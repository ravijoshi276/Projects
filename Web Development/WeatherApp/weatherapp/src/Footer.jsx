export default function Footer() {
  return (
    <footer className="border-t w-full  flex justiyfy-center  gap-5 flex-wrap items-center  md:flex-nowrap border-white/5 bg-[var(--weather-bg)] px-4 py-8 sm:px-6">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        {/* Brand */}
        <div>
          <a
            href="#home"
            className="text-sm font-semibold tracking-tight text-[var(--weather-text-main)] transition-colors hover:text-[var(--weather-sunny)]"
          >
            Weather
          </a>

          <p className="mt-1 text-xs text-[var(--weather-text-sub)]">
            Simple weather, wherever you are.
          </p>
        </div>

        {/* Navigation */}
        <nav
          aria-label="Footer navigation"
          className="flex flex-wrap items-center gap-x-5 gap-y-2"
        >
          <a
            href="#home"
            className="text-xs text-[var(--weather-text-sub)] transition-colors hover:text-[var(--weather-text-main)]"
          >
            Home
          </a>

          <a
            href="#about"
            className="text-xs text-[var(--weather-text-sub)] transition-colors hover:text-[var(--weather-text-main)]"
          >
            About
          </a>

          <a
            href="#privacy"
            className="text-xs text-[var(--weather-text-sub)] transition-colors hover:text-[var(--weather-text-main)]"
          >
            Privacy
          </a>
        </nav>
      </div>

      <div className="mx-auto mt-6 flex w-full max-w-4xl items-center justify-between border-t border-white/5 pt-5">
        <p className="text-[11px] text-[var(--weather-text-sub)]/70">
          Weather data by <a href="https://open-meteo.com/" target="_BLANK">Open-Meteo</a>
        </p>

        <span className="flex items-center gap-1.5 text-[11px] text-[var(--weather-text-sub)]/50">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--weather-wind)]" />
          Made for the web
        </span>
      </div>
    </footer>
  );
}
