import { checkIsDay } from "./others/dataHelper";
import { getWeatherIconString } from "./wmoWeatherIcons";

export default function HourlyWeatherData({hourlyData,ref,dateKey,cleaneDaily,nowTimeStr,className}){

    return (<section 
    ref={ref}
    aria-label="Hourly Weather Forecast"
    className="flex flex-row gap-2.5 overflow-x-auto pb-1.5 scrollbar-none items-center scroll-smooth"
>
    {hourlyData?.time?.length > 0 ? (
        hourlyData.time.map((timeString, index) => {
            const isDayTime = checkIsDay(timeString, dateKey, cleaneDaily);
            const weatherCode = hourlyData.weather_code[index];
            const iconClass = getWeatherIconString(weatherCode, isDayTime);
            const isCurrentHour = timeString === nowTimeStr;

            return (
                <article 
                    key={timeString} 
                    aria-current={isCurrentHour ? 'time' : undefined}
                    className={`flex flex-col items-center ${className} justify-center shrink-0 px-3 py-2.5 rounded-2xl gap-1.5 min-w-[62px] transition-all border ${
                        isCurrentHour 
                            ? 'bg-gradient-to-b from-[#1E293B] to-[#0F172A] border-amber-500/80 shadow-lg shadow-amber-500/10 scale-105 ring-1 ring-amber-500/30' 
                            : 'bg-[#0B0F17]/40 border-white/5 hover:border-white/15 hover:bg-[#0B0F17]/70'
                    }`}
                >
                    <time dateTime={timeString} className={`text-[10px] font-medium t ${isCurrentHour ? 'text-amber-400 font-bold' : 'text-slate-400'}`}>
                        {isCurrentHour ? 'Now' : timeString}
                    </time>
                    <i className={`${iconClass} text-lg my-0.5 ${isCurrentHour ? 'text-amber-400 drop-shadow' : 'text-slate-200'}`} aria-hidden="true"></i>
                    <span className="text-xs font-bold text-slate-100">{hourlyData.temperature_2m[index]?.toFixed(1)}°</span>
                </article>
            );
        })
    ) : (
        <div className="w-full text-center py-2" role="status">
            <span className="text-xs italic text-slate-500">Loading forecast...</span>
        </div>
    )}
</section>)
}