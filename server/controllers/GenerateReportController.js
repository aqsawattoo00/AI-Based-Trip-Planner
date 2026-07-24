import { generateReportHandler } from "../handlers/GenerateReportHandler.js";
import { addInAiPlanningJob }    from "../queues/trip-planner-ai-queue.js";
import client                    from "../queues/client.js";
import TripResult             from "../models/TripResult.js";
import { getRouteDetails, validateLocation } from "../services/googleMapsService.js";
import { getWeatherForecast }    from "../services/weatherService.js";
import { predictTripCost, recommendHotels } from "../services/mlService.js";

// ── helpers ───────────────────────────────────────────────────────────────────

function parseBudgetPerNight(budgetRange, tripDays) {
    if (!budgetRange) return 5000;
    const match = String(budgetRange).replace(/,/g, '').match(/\d+/);
    if (match) {
        const total = parseInt(match[0]);
        const days  = parseInt(tripDays) || 3;
        return Math.round((total * 0.30) / days);   // 30% of budget for accommodation
    }
    return 5000;
}

function normaliseTransport(transportPreference) {
    const raw = Array.isArray(transportPreference)
        ? transportPreference[0]
        : transportPreference;
    return (raw || 'car').toLowerCase().trim();
}

function normaliseAccommodation(hotelType) {
    const raw = Array.isArray(hotelType) ? hotelType[0] : hotelType;
    return (raw || 'standard hotel').toLowerCase().replace(/ /g, '_').trim();
}

// ── controller ────────────────────────────────────────────────────────────────

export const generateReportController = async (req, res) => {
    try {
        const {
            startingCity, destination,
            numberOfPeople, tripDuration,
            travelStyle, transportPreference,
            hotelType, budgetRange,
        } = req.body;

        const origin   = startingCity  || 'Lahore';
        const dest     = destination   || 'Hunza';
        const people   = parseInt(numberOfPeople) || 2;
        const days     = parseInt(tripDuration)   || 3;
        const style    = (travelStyle  || 'standard').toLowerCase();
        const transport= normaliseTransport(transportPreference);
        const hotel    = normaliseAccommodation(hotelType);

        // ── 1. Validate both locations via Geocoding API ────────────────────
        const [originValid, destValid] = await Promise.all([
            validateLocation(origin),
            validateLocation(dest),
        ]);
        if (!originValid) {
            return res.status(422).json({
                message: `"${origin}" is not a recognised city in Pakistan. Please enter a valid origin city.`,
            });
        }
        if (!destValid) {
            return res.status(422).json({
                message: `"${dest}" is not a recognised city in Pakistan. Please enter a valid destination city.`,
            });
        }

        // ── 2. Fetch real-time data in parallel ─────────────────────────────
        const [routeResult, weatherResult, hotelResult] = await Promise.allSettled([
            getRouteDetails(origin, dest),
            getWeatherForecast(dest),
            recommendHotels({
                destination:      dest,
                origin:           origin,
                budget_per_night: parseBudgetPerNight(budgetRange, days),
                travel_style:     style,
                group_size:       people,
            }),
        ]);

        const routeData  = routeResult.status   === 'fulfilled' ? routeResult.value?.data   : null;
        const weatherData= weatherResult.status === 'fulfilled' ? weatherResult.value?.data : null;
        const hotelData  = hotelResult.status   === 'fulfilled' ? hotelResult.value?.data   : null;

        // ── 2. ML cost prediction (uses real distance if available) ─────────
        const distanceKm = routeData?.distance_km || 500;
        const costResult = await predictTripCost({
            distance_km:        distanceKm,
            group_size:         people,
            trip_days:          days,
            transport_mode:     transport,
            accommodation_type: hotel,
            travel_style:       style,
        });
        const costData = costResult?.data || null;

        // ── 3. Build enriched job payload ───────────────────────────────────
        const enrichedData = {
            ...req.body,
            realTimeData: {
                route: routeData
                    ? {
                        from:           origin,
                        to:             dest,
                        distance_km:    routeData.distance_km,
                        distance_text:  routeData.distance_text,
                        duration_hours: routeData.duration_hours,
                        duration_text:  routeData.duration_text,
                        route_summary:  routeData.route_summary,
                    }
                    : null,

                weather: weatherData
                    ? {
                        city:            weatherData.city,
                        current_temp_c:  weatherData.current_temp_c,
                        current_weather: weatherData.current_weather,
                        humidity:        weatherData.humidity,
                        wind_kmh:        weatherData.wind_kmh,
                        forecasts:       weatherData.forecasts?.slice(0, 5),
                    }
                    : null,

                mlCostPrediction: costData
                    ? {
                        total_cost_pkr:      costData.total_cost_pkr,
                        per_person_cost_pkr: costData.per_person_cost_pkr,
                        breakdown:           costData.breakdown,
                        model_used:          costData.model_used,
                    }
                    : null,

                mlHotelRecommendations: hotelData?.recommendations?.length
                    ? hotelData.recommendations.map(h => ({
                        name:             h.name,
                        type:             h.type,
                        style:            h.style,
                        price_per_night:  h.price_per_night,
                        rating:           h.rating,
                        amenities:        h.amenities,
                        family_friendly:  h.family_friendly,
                        nearby:           h.nearby,
                    }))
                    : null,
            },
        };

        // ── 4. Create an empty result record so the project appears immediately ─
        try {
            await TripResult.create({
                userId: req.body.userId,
                projectId: req.body.projectId,
                result: "",
            });
        } catch (createErr) {
            // If duplicate projectId, ignore
            if (createErr.code !== 11000) {
                console.error("Failed to create initial TripResult:", createErr);
            }
        }

        // ── 5. Queue AI job + save form data ───────────────────────────────
        const aiText = await addInAiPlanningJob(enrichedData);
        await generateReportHandler(req.body);

        return res.status(200).json({ message: "Report generated successfully", aiText: aiText.id });
    } catch (err) {
        console.error('generateReportController error:', err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// ── read controllers (unchanged) ──────────────────────────────────────────────

export const getProjectsController = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) return res.status(400).json({ message: "userId is required" });
        const projects = await TripResult.find({ userId }).sort({ _id: -1 });
        return res.status(200).json({ ok: true, data: projects });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteProjectController = async (req, res) => {
    try {
        const { userId, projectId } = req.params;
        if (!userId || !projectId) return res.status(400).json({ message: "userId and projectId are required" });
        const deleted = await TripResult.findOneAndDelete({ _id: projectId, userId });
        if (!deleted) return res.status(404).json({ message: "Project not found" });
        return res.status(200).json({ ok: true, message: "Project deleted" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getProjectController = async (req, res) => {
    try {
        const { userId, projectId } = req.params;
        if (!userId || !projectId) return res.status(400).json({ message: "userId and projectId are required" });
        const project = await TripResult.findOne({ userId, projectId });
        if (!project) return res.status(404).json({ message: "Project not found" });
        return res.status(200).json({ ok: true, data: project });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const generateReportStreamController = async (req, res) => {
    const { jobId } = req.params;
    const sub = client.duplicate();

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders?.();

    await sub.subscribe(`job:${jobId}`);

    sub.on("message", (channel, message) => {
        if (message === "[DONE]") {
            res.write("event: done\ndata: done\n\n");
            sub.disconnect();
            res.end();
            return;
        }
        res.write(`data: ${JSON.stringify(message)}\n\n`);
    });

    req.on("close", () => {
        sub.disconnect();
        res.end();
    });
};
