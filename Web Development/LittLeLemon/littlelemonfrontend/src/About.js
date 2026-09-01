import React from 'react';
import { useNavigate } from 'react-router';
import logo from './assets/images/Asset 16@4x.png'


export default function About() {
  const navigate = useNavigate();

  return (
    <div className="min-w-full min-h-screen bg-[var(--bg-container)] text-[var(--text-main)] font-sans antialiased">
       
      <section className="relative bg-[var(--color-primary)] text-[var(--bg-container)] py-20 px-6 flex flex-col items-center justify-center text-center select-none">
        <div className="w-32 h-32 bg-[var(--bg-surface)] rounded-full flex items-center justify-center border-4 border-[var(--color-secondary)] mb-6 shadow-sm">
          <span className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider"><img src={logo} alt='Little Lemon Logo' /></span>
        </div>
        <h1 className="font-serif text-5xl md:text-7xl font-bold text-[var(--color-secondary)] tracking-tight">
          Little Lemon
        </h1>
      </section>

      <section className="max-w-6xl mx-auto py-16 px-6 grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
        <div className="md:col-span-5 bg-[var(--color-primary)] text-[var(--bg-container)] p-8 rounded-2xl border-b-8 border-[var(--color-secondary)] shadow-sm">
          <blockquote className="text-xl md:text-2xl font-serif italic text-center leading-relaxed">
            “Clean ingredients. Timeless recipes. Crafted with love.”
          </blockquote>
        </div>
        
        <div className="md:col-span-7 flex flex-col gap-3">
          <h3 className="font-serif text-2xl md:text-3xl font-bold text-[var(--color-primary)]">
            From the Sun-Drenched Coasts to Your Table
          </h3>
          <p className="text-base text-[var(--text-muted)] leading-relaxed">
            Founded with a passionate vision to bring wholesome culinary traditions to your neighborhood, every dish at Little Lemon shares a piece of our premium heritage.
          </p>
        </div>
      </section>

      <section className="bg-[var(--color-primary)] py-16 px-6 text-[var(--bg-container)]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="bg-[#5B736B] p-8 rounded-xl border border-white/10 shadow-sm transition-transform hover:-translate-y-1 duration-300">
              <div className="text-[var(--color-secondary)] w-8 h-8 mb-4">
                <svg fill="currentColor" viewBox="0 0 24 24" className="w-full h-full" aria-hidden="true">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Locally Sourced</h3>
              <p className="text-sm opacity-90 leading-relaxed">
                We partner with nearby farmers to bring peak-season ingredients straight to your plate daily.
              </p>
            </div>

          </div>
        </div>
      </section>

      <section className="bg-[var(--color-secondary)] text-[#333333] py-20 px-6 text-center flex flex-col items-center justify-center">
        <h2 className="font-serif text-3xl md:text-5xl font-bold mb-6 tracking-tight">
          Come Pull Up A Chair
        </h2>
        <button 
          type="button"
          className="bg-[var(--color-primary)] text-[var(--bg-container)] hover:bg-[var(--color-primary-hover)] active:scale-95 font-semibold text-base px-10 py-4 rounded-xl shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 focus:ring-offset-[var(--color-secondary)]" 
          onClick={() => navigate("../book-table")} 
        >
          Reserve A Table
        </button>
      </section>

    </div>
  );
}
