import { fetchWeatherApi } from "openmeteo";

const params = {
    daily: ["sunrise", "sunset", "temperature_2m_max", "temperature_2m_min"],
    hourly: ["temperature_2m", "weather_code", "cloud_cover", "relative_humidity_2m", "dew_point_2m", "apparent_temperature", "precipitation_probability", "wind_speed_10m", "wind_direction_10m", "visibility"],
    current: ["temperature_2m", "relative_humidity_2m", "apparent_temperature", "is_day", "weather_code", "wind_speed_10m", "wind_direction_10m", "precipitation", "rain", "showers", "snowfall"],
};
const url = "https://api.open-meteo.com/v1/forecast";

export default async function getWeatherData(latitude, longitude) {
    try {    
        const responses = await fetchWeatherApi(url, {
            ...params,
            latitude: latitude,
            longitude: longitude,
        });

        if (responses && responses.length > 0) {
            const response = responses[0];

            const utcOffsetSeconds = response.utcOffsetSeconds();

            const current = response.current();
            const hourly = response.hourly();
            const daily = response.daily();

            const sunrise = daily.variables(0);
            const sunset = daily.variables(1);
            
            const weatherData = {
                current: {
                    time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
                    temperature_2m: current.variables(0).value(),
                    relative_humidity_2m: current.variables(1).value(),
                    apparent_temperature: current.variables(2).value(),
                    is_day: current.variables(3).value(),
                    weather_code: current.variables(4).value(),
                    wind_speed_10m: current.variables(5).value(),
                    wind_direction_10m: current.variables(6).value(),
                    precipitation: current.variables(7).value(),
                    rain: current.variables(8).value(),
                    showers: current.variables(9).value(),
                    snowfall: current.variables(10).value(),
                },
                hourly: {
                    time: Array.from(
                        { length: (Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval() }, 
                        (_ , i) => new Date((Number(hourly.time()) + i * hourly.interval() + utcOffsetSeconds) * 1000)
                    ),
                    temperature_2m: hourly.variables(0).valuesArray(),
                    weather_code: hourly.variables(1).valuesArray(),
                    cloud_cover: hourly.variables(2).valuesArray(),
                    relative_humidity_2m: hourly.variables(3).valuesArray(),
                    dew_point_2m: hourly.variables(4).valuesArray(),
                    apparent_temperature: hourly.variables(5).valuesArray(),
                    precipitation_probability: hourly.variables(6).valuesArray(),
                    wind_speed_10m: hourly.variables(7).valuesArray(),
                    wind_direction_10m: hourly.variables(8).valuesArray(),
                    visibility: hourly.variables(9).valuesArray(),
                },
                daily: {
                    time: Array.from(
                        { length: (Number(daily.timeEnd()) - Number(daily.time())) / daily.interval() }, 
                        (_ , i) => new Date((Number(daily.time()) + i * daily.interval() + utcOffsetSeconds) * 1000)
                    ),
                    sunrise: [...Array(sunrise.valuesInt64Length())].map(
                        (_ , i) => new Date((Number(sunrise.valuesInt64(i)) + utcOffsetSeconds) * 1000)
                    ),
                    sunset: [...Array(sunset.valuesInt64Length())].map(
                        (_ , i) => new Date((Number(sunset.valuesInt64(i)) + utcOffsetSeconds) * 1000)
                    ),
                    temperature_2m_max: daily.variables(2).valuesArray(),
                    temperature_2m_min: daily.variables(3).valuesArray(),
                },
            };

            return weatherData;
        }
    } catch (error) {
        console.error("Failed to fetch weather data:", error);
    }
}