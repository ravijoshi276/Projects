

export default function Navbar({ dailyData = {}, selectedDate, onSelectDate,dateToday }) {
    const headings = Object.keys(dailyData);
    const indexToday = headings?.findIndex(item=>item===dateToday);
   
    if (headings.length === 0) {
        return (
            <nav className="bg-[var(--weather-surface)] rounded-2xl w-4/5 self-center mt-12 p-4 text-center text-slate-400 border border-white/5">
                <span className="text-xs italic">Loading available dates...</span>
            </nav>
        );
    }

    return (
        <nav 
            aria-label="Daily Weather Navigation"
            className="bg-[var(--weather-surface)]/80 backdrop-blur-md border border-white/5 rounded-2xl w-4/5 self-center mt-12 p-3 shadow-xl"
        >
            <ul className="flex flex-row flex-wrap gap-3 justify-evenly py-1 px-1 ">
                {headings.map((item,index) => {
                    const isSelected = item === selectedDate;
                    let itemText=item;
                   if (index<indexToday) return ;
                   if (index==indexToday) {
                    itemText='Today';
                   }
                   if(index===indexToday+1){
                    itemText='Tommorrow'
                   }


                    return (
                        <li key={item} className="shrink-0 grow-0 sm:grow-1 ">
                            <button
                                type="button"
                                onClick={() => onSelectDate && onSelectDate(item)}
                                aria-pressed={isSelected}
                                className={`w-full px-4 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 border cursor-pointer ${
                                    isSelected
                                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold border-amber-400 shadow-lg shadow-amber-500/20 scale-105'
                                        : 'bg-[#0B0F17]/40 text-slate-300 border-white/5 hover:border-white/15 hover:bg-[#0B0F17]/70 hover:text-white'
                                }`}
                            >
                                {itemText}
                            </button>
                            <div className='flex justify-center items-center gap-1.5 mt-1.5 px-3 py-1 rounded-full text-[11px] font-bold border border-white/5 bg-[#0B0F17]/80 shadow-inner'>
                            <span className='text-rose-400'>{dailyData[item].temperature_2m_max?.toFixed(1) ?? '--'}°</span>
                            <span className='text-slate-600'>/</span>
                            <span className='text-sky-400'>{dailyData[item].temperature_2m_min?.toFixed(1) ?? '--'}°</span>
                        </div>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}