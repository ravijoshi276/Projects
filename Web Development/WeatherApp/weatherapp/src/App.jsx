import { useEffect, useState } from 'react'
import './App.css'
import Header from './Header'
import Navbar from './Navbar'
import WeatherHero from './WeatherHero'
import Privacy from './Privacy'
import DisplayCard from './DisplayCard'
import AboutSection from './AboutSection'
import Footer from './Footer'
function App() {
    const [data,setData] = useState(null);
    const units = {
                    "time": "iso8601",
                    "interval": "seconds",
                    "temperature_2m": "°C",
                    "relative_humidity_2m": "%",
                    "apparent_temperature": "°C",
                    "is_day": "",
                    "weather_code": "wmo code",
                    "wind_speed_10m": "km/h",
                    "wind_direction_10m": "°",
                    "precipitation": "mm",
                    "rain": "mm",
                    "showers": "mm",
                    "snowfall": "cm"
                }
    const currentData = data?data.current:{}
    const hourlyGrouped = data?data.hourly:{};
    const cleanedDaily = data?data.daily:{};
    const datekey = data?data.current.time.split(',')[1].trim():"";
    const changeData =(newdata)=>{
        setData(newdata);
    }
    // Initialize selectedDate state with the first available date key
   
    const [selectedDate, setSelectedDate] = useState(datekey);

    useEffect(()=>{
        function updateDataKey(){
        setSelectedDate(datekey);
        }
        updateDataKey();
    },[datekey])
    
    return (
        <div id="home" className="relative min-h-screen w-full flex flex-col gap-12 p-4 sm:p-6 lg:p-8 bg-[var(--weather-bg)] selection:bg-[var(--weather-rain)]/30 selection:text-white overflow-x-hidden">
    
    <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[var(--weather-sunny)] opacity-[0.03] blur-[140px] pointer-events-none animate-[pulse_16s_ease-in-out_infinite]" />
    <div className="absolute bottom-[20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-[var(--weather-rain)] opacity-[0.04] blur-[180px] pointer-events-none animate-[pulse_20s_ease-in-out_infinite_2s]" />
    <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[40vw] h-[40vw] rounded-full bg-[var(--weather-wind)] opacity-[0.02] blur-[150px] pointer-events-none" />

    <div className="relative z-10 w-full flex flex-col gap-12 items-center justify-center">
        
        <div className="w-full transform transition-transform duration-500 hover:translate-y-[-1px] flex justify-center">
            <Header changeData={changeData}/>
        </div>
        
        {data ? (
            <div className="w-full rounded-2xl border border-gray-800/40 bg-[var(--weather-surface)]/30 backdrop-blur-md p-1 shadow-[0_15px_35px_-10px_rgba(0,0,0,0.5)] flex justify-center">
                <Navbar 
                    dailyData={cleanedDaily} 
                    selectedDate={selectedDate} 
                    onSelectDate={setSelectedDate}
                    dateToday={datekey} 
                />
            </div>
        ) : ""}

        <div className="relative flex w-full min-h-[70vh] justify-center items-center rounded-[32px] border border-gray-800/60 bg-[var(--weather-surface)]/20 p-4 sm:p-6 backdrop-blur-xl shadow-[inset_0_4px_30px_rgba(0,0,0,0.4),0_25px_50px_-12px_rgba(0,0,0,0.8)]">
            
            <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-gray-700/60 rounded-tl-md pointer-events-none" />
            <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-gray-700/60 rounded-tr-md pointer-events-none" />
            <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-gray-700/60 rounded-bl-md pointer-events-none" />
            <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-gray-700/60 rounded-br-md pointer-events-none" />

            <div className="w-full flex justify-center items-center">
                {data ? (
                    <DisplayCard 
                        hourlyData={hourlyGrouped[selectedDate]} 
                        dateToday={datekey} 
                        cleanedDailyData={cleanedDaily[selectedDate]} 
                        current_units={units} 
                        selectedDate={selectedDate} 
                        currentData={currentData}
                    />
                ) : (
                    <WeatherHero />
                )}
            </div>
              
        </div>
          <AboutSection />
          <Privacy />
        <Footer />
    </div>
</div>


    )
}

export default App
