export const wmoToWeatherIcons = {
  0: { day: "wi-day-sunny", night: "wi-night-clear", color: "text-amber-300 drop-shadow-[0_4px_10px_rgba(245,158,11,0.5)]" },
  1: { day: "wi-day-cloudy", night: "wi-night-alt-cloudy", color: "text-slate-100 drop-shadow-sm" },
  2: { day: "wi-cloudy", night: "wi-night-alt-cloudy", color: "text-slate-200 drop-shadow-md" },
  3: { day: "wi-cloudy", night: "wi-cloudy", color: "text-slate-300 drop-shadow-lg" }, 
  45: { day: "wi-day-fog", night: "wi-night-fog", color: "text-zinc-200 opacity-90" },
  48: { day: "wi-day-fog", night: "wi-night-fog", color: "text-zinc-200 opacity-90" },
  51: { day: "wi-day-sprinkle", night: "wi-night-alt-sprinkle", color: "text-cyan-200" },
  53: { day: "wi-day-sprinkle", night: "wi-night-alt-sprinkle", color: "text-cyan-200" },
  55: { day: "wi-day-rain-drops", night: "wi-night-alt-rain-drops", color: "text-cyan-100 font-bold" },
  56: { day: "wi-day-rain-mix", night: "wi-night-alt-rain-mix", color: "text-teal-200" },
  57: { day: "wi-day-rain-mix", night: "wi-night-alt-rain-mix", color: "text-teal-200" },
  61: { day: "wi-day-rain", night: "wi-night-alt-rain", color: "text-cyan-100" },
  63: { day: "wi-day-rain", night: "wi-night-alt-rain", color: "text-sky-100" },
  65: { day: "wi-day-rain-wind", night: "wi-night-alt-rain-wind", color: "text-sky-50 grid drop-shadow-md" },
  66: { day: "wi-day-sleet", night: "wi-night-alt-sleet", color: "text-emerald-100" },
  67: { day: "wi-day-sleet", night: "wi-night-alt-sleet", color: "text-emerald-100" },
  71: { day: "wi-day-snow", night: "wi-night-alt-snow", color: "text-white drop-shadow-[0_2px_5px_rgba(255,255,255,0.4)]" },
  73: { day: "wi-day-snow", night: "wi-night-alt-snow", color: "text-white drop-shadow-[0_2px_5px_rgba(255,255,255,0.4)]" },
  75: { day: "wi-day-snow-wind", night: "wi-night-alt-snow-wind", color: "text-white drop-shadow-[0_4px_8px_rgba(255,255,255,0.5)]" },
  77: { day: "wi-snowflake-cold", night: "wi-snowflake-cold", color: "text-sky-50" },
  80: { day: "wi-day-showers", night: "wi-night-alt-showers", color: "text-cyan-100" },
  81: { day: "wi-day-showers", night: "wi-night-alt-showers", color: "text-cyan-50" },
  82: { day: "wi-day-storm-showers", night: "wi-night-alt-storm-showers", color: "text-orange-200" },
  85: { day: "wi-day-snow-showers", night: "wi-night-alt-snow-showers", color: "text-white" },
  86: { day: "wi-day-snow-showers", night: "wi-night-alt-snow-showers", color: "text-white" },
  95: { day: "wi-day-thunderstorm", night: "wi-night-alt-thunderstorm", color: "text-amber-400 drop-shadow-[0_4px_12px_rgba(251,191,36,0.6)]" }, 
  96: { day: "wi-day-storm-showers", night: "wi-night-alt-storm-showers", color: "text-orange-400 drop-shadow-[0_4px_12px_rgba(251,146,60,0.6)]" },
  99: { day: "wi-day-lightning", night: "wi-night-alt-lightning", color: "text-amber-300 drop-shadow-[0_6px_15px_rgba(252,211,77,0.7)]" }
};

export function getWeatherIconString(weatherCode, isDay) {
  const fallback = { day: "wi-day-sunny", night: "wi-night-clear", color: "text-amber-300" };
  const iconConfig = wmoToWeatherIcons[weatherCode] || fallback;
  const timeOfDayKey = isDay === 1 ? "day" : "night";
  
  return `wi ${iconConfig[timeOfDayKey]} ${iconConfig.color}`;
}
