import { useEffect, useState } from "react";
import useWeather from './hooks/useWeather';
import useCountry from "./hooks/useCountry";
import useCountryState from "./hooks/useCountrysState";
import useStateCity from './hooks/useStateCity';

export default function Header({ changeData }) {
    const [formData, setFormData] = useState({ country: "", city: "", state: "" });
    const [error, setError] = useState("");
    
    // 1. Store coordinates in state so the useWeather hook can react to them
    const [coords, setCoords] = useState({ latitude: null, longitude: null });

    const validCountry = useCountry();
    const selectedCountry = formData.country.length ? validCountry.filter(item => item.country == formData.country)[0]?.id : -1;
    const validStates = useCountryState(selectedCountry) || [];
    const selectedState = formData.state.length ? validStates.filter(item => item.state == formData.state)[0]?.id : -1;
    const validCities = useStateCity(selectedState) || [];  

  
    const { currentData, hourlyData, dailyData, loading, error: weatherError } = useWeather(coords.latitude, coords.longitude);

    // 3. Automatically push weather data up to the parent component when it finishes loading
    useEffect(() => {
        if (!loading && !weatherError && currentData) {
            console.log("Current dataa",currentData)
            changeData({ current: currentData, hourly: hourlyData, daily: dailyData  });
            console.log("Weather data updated and passed to parent");
        }
    }, [currentData, loading, weatherError]);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
        if (error) setError("");
    };
    const handleClear =()=>{
        setFormData({ country: "", city: "", state: "" });
    }

    const handleSearch = (e) => {
        e.preventDefault();
        
        if (!validCountry.some(item => item.country == formData.country)) {
            setError("Please select a valid country from the list.");
            return;
        }
        if (!validStates.some(item => item.state == formData.state)) {
            setError("Please select a valid state from the list.");
            return;
        }
        if (!validCities.some(item => item.city == formData.city)) {
            setError("Please select a valid city from the list.");
            return;
        }

        setError("");
        
        // 4. Update coordinates, which automatically triggers the useWeather hook
        const selectedCity = validCities.find(item => item.city == formData.city);
        if (selectedCity) {
            console.log("Selected city coordinates:", selectedCity);
            setCoords({
                latitude: Number(selectedCity.latitude),
                longitude: Number(selectedCity.longitude)
            });
        }
    };

    return (
        <header className="sticky top-0 z-50 w-full flex flex-col h-auto sm:flex-row sm:flex-wrap justify-between items-center px-6 py-4 backdrop-blur-xl bg-[var(--weather-bg)]/80 border-b border-gray-800/80 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.7)] gap-4 text-[var(--weather-text-main)]">
    
    <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-start">
        <div className="flex items-center gap-3 group">
            <div className="p-2 rounded-xl bg-[var(--weather-surface)] border border-gray-800 shadow-[inset_0_2px_4px_rgba(255,255,255,0.05)] transition-transform duration-300 group-hover:scale-110">
                <i className="wi wi-day-cloudy text-xl text-[var(--weather-sunny)] animate-pulse" />
            </div>
            <h1 className="font-black text-base tracking-wider uppercase bg-clip-text text-transparent bg-gradient-to-r from-[var(--weather-text-main)] via-[var(--weather-text-sub)] to-[var(--weather-text-main)] bg-[length:200%_auto]">
                WeatherApp
            </h1>
        </div>
        {error && (
            <span className="lg:hidden text-[10px] font-mono font-bold tracking-tight px-2.5 py-1 rounded-md bg-[var(--weather-surface)] border border-[var(--weather-danger)]/30 text-[var(--weather-danger)] animate-bounce">
                {error}
            </span>
        )}
    </div>

    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
        
        <div className="flex items-center gap-3 w-full sm:w-auto relative group">
            <label htmlFor="country" className="text-[10px] font-mono font-bold uppercase tracking-widest text-[var(--weather-text-sub)]">
                CNT
            </label>
            <div className="relative w-full sm:w-44">
                <input 
                    list="country-list" 
                    id="country" 
                    name="country" 
                    value={formData.country}
                    onChange={handleChange} 
                    placeholder="Select country..."
                    autoComplete="off"
                    className="w-full text-xs py-2.5 px-3.5 rounded-xl border border-gray-800 bg-[var(--weather-surface)] text-[var(--weather-text-main)] placeholder-[var(--weather-text-sub)]/50 transition-all duration-300 focus:outline-none focus:border-[var(--weather-sunny)]/50 focus:ring-1 focus:ring-[var(--weather-sunny)]/20 shadow-inner"
                />
            </div>
            <datalist id="country-list">
                {validCountry.length ? validCountry.map((item) => (
                    <option key={item.id} value={item.country} />
                )) : <option key={-1} value={""} />}
            </datalist>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto relative group">
            <label htmlFor="state" className="text-[10px] font-mono font-bold uppercase tracking-widest text-[var(--weather-text-sub)]">
                STT
            </label>
            <div className="relative w-full sm:w-44">
                <input 
                    list="state-list" 
                    id="state" 
                    name="state" 
                    value={formData.state}
                    onChange={handleChange} 
                    placeholder="Select state..."
                    autoComplete="off"
                    className="w-full text-xs py-2.5 px-3.5 rounded-xl border border-gray-800 bg-[var(--weather-surface)] text-[var(--weather-text-main)] placeholder-[var(--weather-text-sub)]/50 transition-all duration-300 focus:outline-none focus:border-[var(--weather-rain)]/50 focus:ring-1 focus:ring-[var(--weather-rain)]/20 shadow-inner"
                />
            </div>
            <datalist id="state-list">
                {validStates.map((state) => (
                    <option key={state.id} value={state.state} />
                ))}
            </datalist>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto relative group">
            <label htmlFor="city" className="text-[10px] font-mono font-bold uppercase tracking-widest text-[var(--weather-text-sub)]">
                CTY
            </label>
            <div className="relative w-full sm:w-44">
                <input 
                    list="city-list" 
                    id="city" 
                    name="city" 
                    value={formData.city}
                    onChange={handleChange} 
                    placeholder="Select city..."
                    autoComplete="off"
                    className="w-full text-xs py-2.5 px-3.5 rounded-xl border border-gray-800 bg-[var(--weather-surface)] text-[var(--weather-text-main)] placeholder-[var(--weather-text-sub)]/50 transition-all duration-300 focus:outline-none focus:border-[var(--weather-wind)]/50 focus:ring-1 focus:ring-[var(--weather-wind)]/20 shadow-inner"
                />
            </div>
            <datalist id="city-list">
                {validCities.map((city) => (
                    <option key={city.id} value={city.city} />
                ))}
            </datalist>
        </div>
    <div className="w-full flex flex-wrap md:w-auto md:min-w-[25%] lg:flex-nowrap">
       <button 
    type="submit"
    className="w-full lg:w-auto shrink-0 flex items-center justify-center gap-3 px-8 py-3.5 rounded-xl text-xs font-black tracking-widest uppercase transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 text-[var(--weather-text-main)] bg-[var(--weather-sunny)] hover:bg-gray-800 border border-gray-700/80 shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.7),0_0_20px_rgba(59,130,246,0.15)] group"
>
    <i className="wi wi-search text-base text-[var(--weather-rain)] transition-transform duration-300 group-hover:scale-120 group-hover:text-[var(--weather-sunny)]" />
    <span className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--weather-text-main)] via-[var(--weather-text-sub)] to-[var(--weather-text-main)] bg-[length:200%_auto] group-hover:animate-pulse">
        Search 
    </span>
</button>
<button
  type="button"
  className="w-full shrink-0 rounded-xl border border-gray-700/80 bg-[var(--weather-text-sub)] px-8 py-3.5 text-xs font-black uppercase tracking-widest text-[var(--weather-text-main)] shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[var(--weather-text-main)] hover:text-[var(--weather-bg)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.7),0_0_20px_rgba(59,130,246,0.15)] active:translate-y-0 lg:w-auto group"
  onClick={handleClear}
>
  <i className="wi wi-search text-base transition-transform duration-300 group-hover:scale-120 group-hover:text-[var(--weather-sunny)]" />

  <span className="bg-gradient-to-r from-[var(--weather-surface)] via-[var(--weather-surface)] to-[var(--weather-text-main)] bg-[length:200%_auto] bg-clip-text text-transparent group-hover:animate-pulse">
    Clear
  </span>
</button>
</div>



    </form>

    {error && (
        <div className="hidden lg:flex absolute -bottom-5 right-6 text-[10px] font-mono font-bold tracking-wider px-3 py-1 rounded-lg border shadow-xl bg-[var(--weather-surface)] text-[var(--weather-danger)] border-[var(--weather-danger)]/40 backdrop-blur-md">
            {error}
        </div>
    )}
</header>

    );
}