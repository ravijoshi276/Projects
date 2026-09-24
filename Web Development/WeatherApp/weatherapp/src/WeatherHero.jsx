import  { useEffect, useState } from 'react';

export default function WeatherHero() {
  const [systemTime, setSystemTime] = useState('STANDBY STATUS');

  useEffect(() => {
    const localeTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setSystemTime(`SYS READY // HUB TIME: ${localeTime}`);
  }, []);

  return (
    <section className="relative w-full max-w-4xl mx-auto my-8 min-h-[460px] overflow-hidden rounded-3xl border border-gray-800 bg-[var(--weather-surface)] p-1 text-[var(--weather-text-main)] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)]">
      
      {/* Tailwind Arbitrary Values replacement for the custom radial mesh background */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay bg-[radial-gradient(circle_at_20%_30%,var(--weather-sunny)_1px,transparent_1px),radial-gradient(circle_at_75%_60%,var(--weather-rain)_1px,transparent_1px)] bg-[size:24px_24px]" 
      />
      
      {/* Tailwind arbitrary duration animation utilities */}
      <div className="absolute -left-16 -top-16 w-64 h-64 rounded-full bg-gradient-to-br from-[var(--weather-sunny)] to-transparent opacity-[0.07] blur-3xl animate-[pulse_8s_cubic-bezier(0.4,0,0.6,1)_infinite]" />
      <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-gradient-to-tl from-[var(--weather-rain)] to-transparent opacity-[0.08] blur-3xl animate-[pulse_12s_cubic-bezier(0.4,0,0.6,1)_infinite]" />

      <div className="relative z-10 rounded-[22px] bg-[var(--weather-bg)] p-8 md:p-12 overflow-hidden border border-gray-800/50">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
            <div className="relative w-56 h-56 flex items-center justify-center" aria-hidden="true">
              
              {/* Native Tailwind arbitrary spins and timing variables */}
              <div className="absolute inset-0 rounded-full border border-dashed border-[var(--weather-sunny)]/30 animate-[spin_40s_linear_infinite]" />
              <div className="absolute inset-4 rounded-full border border-double border-t-[var(--weather-rain)] border-b-transparent opacity-60 animate-[spin_15s_linear_infinite_reverse]" />
              <div className="absolute inset-8 rounded-full border-2 border-dotted border-l-[var(--weather-wind)] border-r-transparent opacity-40 animate-pulse" />
              
              <div className="w-24 h-24 rounded-2xl bg-[var(--weather-surface)] border border-gray-700/60 shadow-[inset_0_4px_12px_rgba(0,0,0,0.6)] flex flex-col items-center justify-center transform rotate-45">
                <div className="-rotate-45 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-[var(--weather-text-sub)] tracking-tighter mb-0.5">00°</span>
                  <div className="h-1 w-6 bg-gradient-to-r from-[var(--weather-rain)] to-[var(--weather-sunny)] rounded-full animate-bounce" />
                </div>
              </div>

              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[var(--weather-sunny)] shadow-[0_0_10px_var(--weather-sunny)]" />
              <div className="absolute bottom-6 right-4 w-1.5 h-1.5 rounded-full bg-[var(--weather-rain)]" />
              <div className="absolute bottom-10 left-2 w-1.5 h-1.5 rounded-full bg-[var(--weather-wind)]" />
            </div>

            <div className="mt-6 w-full max-w-[200px] bg-[var(--weather-surface)] h-1 rounded-full overflow-hidden relative border border-gray-800" aria-hidden="true">
              <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-[var(--weather-rain)] via-[var(--weather-wind)] to-[var(--weather-sunny)] w-1/3 rounded-full animate-[pulse_2s_infinite]" />
            </div>
          </div>

          <div className="lg:col-span-7 text-center lg:text-left flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 self-center lg:self-start px-3 py-1 rounded-full bg-[var(--weather-surface)] border border-gray-800 text-xs font-mono tracking-widest text-[var(--weather-text-sub)] mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--weather-wind)] animate-ping" aria-hidden="true" />
              <span>{systemTime}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 leading-[1.15]">
              The atmosphere is <span className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--weather-text-main)] via-[var(--weather-text-sub)] to-[var(--weather-text-main)] bg-[length:200%_auto] animate-pulse">awaiting your command.</span>
            </h1>

            <p className="text-[var(--weather-text-sub)] text-sm sm:text-base max-w-xl leading-relaxed font-light mb-6">
              No global metrics have initialized. Use the regional dropdown selection system built directly into your primary header interface above, or trigger the sliding search navigation deck below to calculate immediate weather trends.
            </p>

            <div className="inline-flex items-center gap-1.5 self-center lg:self-start text-[10px] uppercase font-semibold tracking-wider text-[var(--weather-text-sub)] opacity-70">
              <span>Data provided by</span>
              <a href="https://open-meteo.com/" target="_BLANK">Open-Meteo</a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
