import  { useRef, useEffect,  } from 'react';
import 'weather-icons/css/weather-icons.min.css';
import 'weather-icons/css/weather-icons-wind.min.css';

import { timeToMinutes } from './others/dataHelper';
import { getWeatherIconString } from './wmoWeatherIcons';
import HourlyWeatherData from './HourlyWeatherData';
export default function CurrentWeather({daily_data,current_data,hourly_data,current_units}) {
    console.log("this is data i need",daily_data)
    const scrollContainerRef = useRef(null);
    const temperature = `${current_data.temperature_2m.toFixed(1)} ${current_units.temperature_2m}`;
    const feelsLike = `${current_data.apparent_temperature.toFixed(1)} ${current_units.apparent_temperature}`;
    const curr_date = current_data.time;

    const dateKey = curr_date.split(',')[1].trim();
    const nowTimeStr = curr_date.split(',')[2].slice(0, 9).trim();

    // Auto-scroll to just before current time
    useEffect(() => {
        if (hourly_data?.time?.length > 0 && scrollContainerRef.current) {
            let currentIndex = hourly_data.time.findIndex(t => timeToMinutes(t) >= timeToMinutes(nowTimeStr));
            if (currentIndex === -1) currentIndex = 0;
            
            const targetIndex = Math.max(0, currentIndex - 1);
            const container = scrollContainerRef.current;
            const targetChild = container.children[targetIndex];
            
            if (targetChild) {
                container.scrollTo({
                    left: targetChild.offsetLeft - container.offsetLeft,
                    behavior: 'smooth'
                });
            }
        }
    }, [hourly_data, nowTimeStr]);

    return (
        <section className='relative flex flex-col rounded-3xl p-5 w-100 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl ring-1 ring-white/10 gap-4 select-none bg-[#161F2E] text-slate-100 overflow-hidden'>
            
            {/* Ambient background glow asset for rich atmosphere */}
            <div className='absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none'></div>
            <div className='absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none'></div>

            {/* Top Section: Current Weather & Metrics */}
            <div className='relative flex z-10 w-full flex justify-between items-center'>
                
                {/* Left Panel: Main Temp & High/Low */}
                <div className='w-[55%] flex flex-col gap-2.5 justify-center items-center pr-3 border-r border-slate-700/60'>
                    <div className="flex items-center gap-2.5 justify-center">
                        <i className={`${getWeatherIconString(current_data?.weather_code, current_data?.is_day)} text-[2.6rem] drop-shadow-[0_10px_10px_rgba(245,158,11,0.2)] text-amber-400`}></i>
                        <span className="text-[2.2rem] font-black leading-none tracking-tight text-white">
                            {temperature ?? '--'}
                        </span>
                    </div>
                    
                    <div className='flex flex-col items-center text-center'> 
                        <span className='text-xs font-medium tracking-wide text-slate-400'>
                            Feels like {feelsLike ?? '--'}
                        </span>
                        <div className='flex items-center gap-1.5 mt-1.5 px-3 py-1 rounded-full text-[11px] font-bold border border-white/5 bg-[#0B0F17]/80 shadow-inner'>
                            <span className='text-rose-400'>{daily_data?.temperature_2m_max?.toFixed(1) ?? '--'}°</span>
                            <span className='text-slate-600'>/</span>
                            <span className='text-sky-400'>{daily_data?.temperature_2m_min.toFixed(1) ?? '--'}°</span>
                        </div>
                    </div>   
                </div>
                
                {/* Right Panel: Styled Metric Grid Cards */}
                <div className='w-[45%] flex flex-col justify-center gap-1.5 pl-2.5'>
                    <span className='text-[9px] tracking-widest uppercase font-extrabold mb-0.5 text-slate-400'>
                        Overview
                    </span>
                    
                    <div className='flex items-center justify-between text-xs px-2.5 py-1.5 rounded-xl border border-white/5 bg-[#0B0F17]/60 shadow-sm'>
                        <span className='flex items-center gap-1.5 text-[11px] text-slate-400'>
                            <i className='wi wi-humidity text-sm text-sky-400'></i> Hum
                        </span>
                        <span className='font-bold text-xs text-slate-200'>{current_data?.relative_humidity_2m ? `${current_data.relative_humidity_2m?.toFixed(1)}%` : '--'}</span>
                    </div>
                    
                    <div className='flex items-center justify-between text-xs px-2.5 py-1.5 rounded-xl border border-white/5 bg-[#0B0F17]/60 shadow-sm'>
                        <span className='flex items-center gap-1.5 text-[11px] text-slate-400'>
                            <i className='wi wi-strong-wind text-sm text-emerald-400'></i> Wind
                        </span>
                        <span className='font-bold text-xs text-slate-200'>{current_data?.wind_speed_10m?.toFixed(2) ?? '--'}</span>
                    </div>

                    <div className='flex items-center justify-between text-xs px-2.5 py-1.5 rounded-xl border border-white/5 bg-[#0B0F17]/60 shadow-sm'>
                        <span className='flex items-center gap-1.5 text-[11px] text-slate-400'>
                            <i className='wi wi-sunrise text-sm text-amber-400'></i> Sun
                        </span>
                        <span className='font-bold text-[10px] text-slate-200'>{daily_data?.sunrise ?? '--'}</span>
                    </div>
                </div>
            </div>

            {/* Custom Separator Line */}
            <div className='relative z-10 w-full h-[1px] my-0.5 bg-gradient-to-r from-transparent via-slate-700 to-transparent'></div>

            {/* Bottom Section: Hourly Forecast */}
            <div className='relative z-10 w-full flex flex-col gap-2'>
                <div className='flex justify-between items-center'>
                    <span className='text-[9px] tracking-widest uppercase font-extrabold text-slate-400'>
                        Hourly Data
                    </span>
                </div>
                <HourlyWeatherData ref={scrollContainerRef} hourlyData={hourly_data} dateKey={dateKey} cleanedDaily={daily_data} nowTimeStr={nowTimeStr}/>
                
            </div>
            
        </section>
    );
}