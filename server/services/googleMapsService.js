const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
const DIRECTIONS_BASE     = 'https://maps.googleapis.com/maps/api/directions/json';
const GEOCODING_BASE      = 'https://maps.googleapis.com/maps/api/geocode/json';

export const validateLocation = async (name) => {
    if (!name || name.trim().length < 2) return false;

    try {
        const params = new URLSearchParams({
            address:  `${name}, Pakistan`,
            key:      GOOGLE_MAPS_API_KEY,
            language: 'en',
        });
        const res  = await fetch(`${GEOCODING_BASE}?${params}`);
        const json = await res.json();

        if (json.status !== 'OK' || !json.results?.length) return false;

        const result     = json.results[0];
        const types      = result.types || [];
        const components = result.address_components || [];

        // Must be a specific geographic place type (not route/country/establishment)
        const acceptableTypes = [
            'locality', 'sublocality', 'sublocality_level_1',
            'administrative_area_level_1', 'administrative_area_level_2',
            'administrative_area_level_3', 'natural_feature',
            'colloquial_area', 'neighborhood',
        ];
        if (!types.some(t => acceptableTypes.includes(t))) return false;

        // Must be inside Pakistan
        const inPakistan = components.some(c =>
            c.types.includes('country') && c.short_name === 'PK'
        );
        // Some Pakistani cities (e.g. Gilgit, Skardu) occasionally omit the country
        // component; since we explicitly searched with ", Pakistan", accept them
        // if no other country is present and the input is matched.
        const hasOtherCountry = components.some(c =>
            c.types.includes('country') && c.short_name !== 'PK'
        );
        if (hasOtherCountry) return false;

        const inputNorm = name.toLowerCase().trim();

        // Accept if the input appears anywhere in the address components or formatted address
        const allNames = components.flatMap(c => [c.long_name, c.short_name]).map(n => n.toLowerCase());
        const formattedAddress = (result.formatted_address || '').toLowerCase();
        if (allNames.some(n => n.includes(inputNorm)) || formattedAddress.includes(inputNorm)) {
            return true;
        }

        // Fallback: prefix-based similarity check
        const cityComp = components.find(c =>
            c.types.includes('locality') ||
            c.types.includes('administrative_area_level_1') ||
            c.types.includes('administrative_area_level_2') ||
            c.types.includes('sublocality')
        );
        if (!cityComp) return false;

        const matchedNorm = cityComp.long_name.toLowerCase().trim();
        const prefixLen   = Math.min(inputNorm.length, 4);

        const isClose =
            matchedNorm.startsWith(inputNorm.slice(0, prefixLen)) ||
            inputNorm.startsWith(matchedNorm.slice(0, prefixLen));

        return isClose;

    } catch {
        return true; // Network failure → don't block the user
    }
};

export const getRouteDetails = async (origin, destination) => {
    try {
        const params = new URLSearchParams({
            origin:      `${origin}, Pakistan`,
            destination: `${destination}, Pakistan`,
            key:         GOOGLE_MAPS_API_KEY,
            language:    'en',
        });

        const res  = await fetch(`${DIRECTIONS_BASE}?${params}`);
        const json = await res.json();

        if (json.status !== 'OK') {
            console.error('Google Maps API status:', json.status);
            return { error: json.status, data: null };
        }

        const leg = json.routes[0].legs[0];

        return {
            error: null,
            data: {
                distance_km:    Math.round(leg.distance.value / 1000),
                distance_text:  leg.distance.text,
                duration_hours: Math.round((leg.duration.value / 3600) * 10) / 10,
                duration_text:  leg.duration.text,
                start_address:  leg.start_address,
                end_address:    leg.end_address,
                route_summary:  json.routes[0].summary,
            },
        };
    } catch (err) {
        console.error('Google Maps service error:', err.message);
        return { error: err.message, data: null };
    }
};
