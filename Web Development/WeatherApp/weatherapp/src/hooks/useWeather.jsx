import { useState, useEffect } from "react";
import getWeatherData from "../api/getWeatherData";
import { cleanRawData, gorupByHourlyData, cleanDailyData } from "../others/dataHelper"; 

export default function useWeather(latitude, longitude) {
    const [currentData, setCurrentData] = useState(null);
    const [hourlyData, setHourlyData] = useState(null);
    const [dailyData, setDailyData] = useState(null);
  
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!latitude || !longitude) return;

        let isMounted = true;
       
        async function fetchWeatherData() {
             setLoading(true);
            setError(false);

            try {
                const data = await getWeatherData(Number(latitude), Number(longitude));
                console.log("This is data",data);
                if (!isMounted) return;

                const cleanData = cleanRawData([{...data}]);
                
                // Fixed: Do not wrap them twice
                const hourlyGrouped = cleanData ? gorupByHourlyData(cleanData.hourly) : {};
                const cleanedDaily = cleanData ? cleanDailyData(cleanData.daily) : {};
                setCurrentData(cleanData?.current);
                setHourlyData(hourlyGrouped);
                setDailyData(cleanedDaily);
            } catch (err) {
                if (isMounted) {
                    setError(true);
                    console.error('Failed to fetch Weather data:', err);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        fetchWeatherData();

        return () => {
            isMounted = false;
        };
    }, [latitude, longitude]);

    return { currentData, hourlyData, dailyData, loading, error };
}