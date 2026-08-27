import React from 'react';

export default function About() {
  return (
    <div className="min-w-full min-h-screen bg-[#F5F7F6] text-[#333333] font-sans">
       
      {/* 1. HERO HEADER (Olive Green Backdrop with Centered Logo Anchor) */}
      <header className="relative bg-[var(--color-primary)] text-[var(--bg-container)] py-20 text-center">
        <div className="w-32 h-32 bg-[var(--bg-container)] rounded-full flex items-center justify-center border-4 border-[var(--color-secondary)]">
          <span>[ Little Lemon Logo ]</span>
        </div>
        <h1 className="font-serif text-4xl md:text-6xl text-[var(--color-secondary)]">Little Lemon</h1>
      </header>

      {/* 2. OUR STORY SECTION (Two-Column Split Grid with Large Typographic Quote) */}
      <section className="max-w-6xl mx-auto py-16 px-6 grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="md:col-span-5 bg-[var(--color-primary)] text-[var(--bg-container)] p-8 rounded-2xl border-b-8 border-[var(--color-secondary)]">
          <blockquote>“Clean ingredients. Timeless recipes. Crafted with love.”</blockquote>
        </div>
        <div className="md:col-span-7">
          <h3>From the Sun-Drenched Coasts to Your Table</h3>
          <p>Founded with a passionate vision to bring wholesome culinary traditions...</p>
        </div>
      </section>

      {/* 3. CORE PHILOSOPHY (3-Card Layout row with customized Font Awesome Icons) */}
      <section className="bg-[var(--color-primary)] py-16 text-[var(--bg-container)]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card Component featuring custom filled Font Awesome Icons */}
          <div className="bg-[#5B736B] p-8 rounded-xl">
            <i className="fa-solid fa-lemon text-[var(--color-secondary)]"></i>
            <h3>Locally Sourced</h3>
          </div>
          {/* ... Additional value cards */}
        </div>
      </section>

      {/* 4. CALL TO ACTION FOOTER (High-Contrast yellow zone with reservations trigger & operational hours) */}
      <section className="bg-[var(--color-secondary)] text-[var(--color-primary)] py-16 text-center">
        <h2>Come Pull Up A Chair</h2>
        <button className="bg-[var(--color-primary)] text-[var(--bg-container)] px-8 py-3 rounded-full">Reserve A Table</button>
      </section>

    </div>
  );
}
