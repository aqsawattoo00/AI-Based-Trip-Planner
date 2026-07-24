const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:5001';

export const predictTripCost = async ({ distance_km, group_size, trip_days, transport_mode, accommodation_type, travel_style }) => {
    try {
        const res  = await fetch(`${ML_SERVICE_URL}/predict-cost`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ distance_km, group_size, trip_days, transport_mode, accommodation_type, travel_style }),
            signal:  AbortSignal.timeout(6000),
        });
        const data = await res.json();
        return { error: null, data };
    } catch (err) {
        console.error('ML cost prediction error:', err.message);
        return { error: err.message, data: null };
    }
};

export const recommendHotels = async ({ destination, origin, budget_per_night, travel_style, group_size }) => {
    try {
        const res  = await fetch(`${ML_SERVICE_URL}/recommend-hotels`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ destination, origin, budget_per_night, travel_style, group_size }),
            signal:  AbortSignal.timeout(6000),
        });
        const data = await res.json();
        return { error: null, data };
    } catch (err) {
        console.error('ML hotel recommendation error:', err.message);
        return { error: err.message, data: null };
    }
};
