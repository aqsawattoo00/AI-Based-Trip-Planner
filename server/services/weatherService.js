const WEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL        = 'https://api.openweathermap.org/data/2.5';

export const getWeatherForecast = async (city) => {
    try {
        // 5-day / 3-hour forecast
        const params = new URLSearchParams({
            q:     `${city},PK`,
            appid: WEATHER_API_KEY,
            units: 'metric',
            cnt:   8,              // 8 × 3 h = ~24 h of entries
        });

        const res  = await fetch(`${BASE_URL}/forecast?${params}`);
        const json = await res.json();

        if (json.cod !== '200') {
            // Retry without country code
            const params2 = new URLSearchParams({ q: city, appid: WEATHER_API_KEY, units: 'metric' });
            const res2    = await fetch(`${BASE_URL}/weather?${params2}`);
            const json2   = await res2.json();

            if (json2.cod !== 200) {
                console.error('Weather API error:', json2.message);
                return { error: json2.message, data: null };
            }

            return {
                error: null,
                data: {
                    city:            json2.name,
                    country:         json2.sys?.country,
                    current_temp_c:  Math.round(json2.main.temp),
                    feels_like_c:    Math.round(json2.main.feels_like),
                    current_weather: json2.weather[0].description,
                    humidity:        json2.main.humidity,
                    wind_kmh:        Math.round(json2.wind.speed * 3.6),
                    forecasts:       [],
                },
            };
        }

        const forecasts = json.list.map(item => ({
            datetime:         item.dt_txt,
            temp_c:           Math.round(item.main.temp),
            feels_like_c:     Math.round(item.main.feels_like),
            weather:          item.weather[0].description,
            humidity:         item.main.humidity,
            wind_kmh:         Math.round(item.wind.speed * 3.6),
            rain_probability: Math.round((item.pop || 0) * 100),
        }));

        const current = json.list[0];

        return {
            error: null,
            data: {
                city:            json.city.name,
                country:         json.city.country,
                current_temp_c:  Math.round(current.main.temp),
                feels_like_c:    Math.round(current.main.feels_like),
                current_weather: current.weather[0].description,
                humidity:        current.main.humidity,
                wind_kmh:        Math.round(current.wind.speed * 3.6),
                forecasts,
            },
        };
    } catch (err) {
        console.error('Weather service error:', err.message);
        return { error: err.message, data: null };
    }
};
