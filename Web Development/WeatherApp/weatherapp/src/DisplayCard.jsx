import HourlyWeatherData from "./HourlyWeatherData"
import CurrentWeather from "./CurrentWeather"
export default function DisplayCard({hourlyData,dateToday,cleanedDailyData,current_units,selectedDate,currentData}){
    console.log("This is current data data ",currentData)
    if(dateToday===selectedDate){
         return <CurrentWeather 
                    daily_data={cleanedDailyData} 
                    hourly_data={hourlyData} 
                    current_data={currentData} 
                    current_units={current_units}
                    selectedDate={selectedDate}
                />
    }
    return <section 
  style={{ minHeight: '60vh', padding: '20px' }}
  className="w-[80vw] flex flex-col gap-10 "
>
  <h2 className="text-xl">{selectedDate}</h2>
  
  <div className="w-full grow flex flex-col">
    <div className="relative z-10 flex w-full flex-col gap-4 rounded-3xl bg-[#161F2E] p-10 text-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.5)] select-none overflow-hidden backdrop-blur-2xl ring-1 ring-white/10">
      <div>
        <span 
          style={{ display: 'inline-block', marginLeft: '10px' }} 
          className="text-[9px] font-extrabold tracking-widest uppercase text-slate-400"
        >
          Hourly Data
        </span>
      </div>
      
      <HourlyWeatherData 
        hourlyData={hourlyData} 
        dateKey={dateToday} 
        cleanedDaily={cleanedDailyData}
        className="h-[30vh]"
      />
    </div>
  </div>
</section>

}