export default function AboutSection() {
  return (
    <section
      id="about"
      className="border-t border-white/5 bg-[var(--weather-bg)] px-4 py-14 sm:px-6 sm:py-20"
    >
      <div className="mx-auto w-full max-w-4xl">
        <div className="grid overflow-hidden rounded-3xl border border-white/5 bg-[var(--weather-surface)] md:grid-cols-[0.85fr_1.15fr]">
          {/* Visual side */}
          <div className="relative flex min-h-[260px] items-center justify-center overflow-hidden border-b border-white/5 bg-gradient-to-br from-[var(--weather-surface)] to-[var(--weather-bg)] p-8 md:border-b-0 md:border-r">
            {/* Decorative weather circles */}
            <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[var(--weather-sunny)]/10 blur-2xl" />
            <div className="absolute -bottom-20 -left-16 h-40 w-40 rounded-full bg-[var(--weather-rain)]/10 blur-2xl" />

            <div className="relative">
              {/* Sun */}
              <div className="relative mx-auto h-28 w-28">
                <div className="absolute inset-3 rounded-full bg-[var(--weather-sunny)] shadow-[0_0_45px_rgba(245,158,11,0.25)]" />

                {/* Rays */}
                <span className="absolute left-1/2 top-0 h-2 w-1 -translate-x-1/2 rounded-full bg-[var(--weather-sunny)]/60" />
                <span className="absolute bottom-0 left-1/2 h-2 w-1 -translate-x-1/2 rounded-full bg-[var(--weather-sunny)]/60" />
                <span className="absolute left-0 top-1/2 h-1 w-2 -translate-y-1/2 rounded-full bg-[var(--weather-sunny)]/60" />
                <span className="absolute right-0 top-1/2 h-1 w-2 -translate-y-1/2 rounded-full bg-[var(--weather-sunny)]/60" />
              </div>

              {/* Small weather indicators */}
              <div className="mt-6 flex items-center justify-center gap-3">
                <span className="h-1.5 w-8 rounded-full bg-[var(--weather-rain)]/60" />
                <span className="h-1.5 w-5 rounded-full bg-[var(--weather-wind)]/60" />
                <span className="h-1.5 w-3 rounded-full bg-[var(--weather-text-sub)]/40" />
              </div>
            </div>
          </div>

          {/* Content side */}
          <div className="p-6 sm:p-8 md:p-10 lg:p-12">
            <div className="flex items-center gap-2">
              <span className="h-px w-6 bg-[var(--weather-sunny)]" />

              <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--weather-sunny)]">
                About the app
              </span>
            </div>

            <h2 className="mt-5 max-w-md text-2xl font-semibold tracking-tight text-[var(--weather-text-main)] sm:text-3xl">
              Just the weather.
              <span className="block text-[var(--weather-text-sub)]">
                Nothing in the way.
              </span>
            </h2>

            <p className="mt-5 max-w-lg text-sm leading-7 text-[var(--weather-text-sub)]">
              This app was built around one simple idea: finding the weather
              should take seconds, not a tour through a complicated interface.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-white/5 bg-[var(--weather-bg)]/60 p-4">
                <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--weather-rain)]/10">
                  <span className="h-2 w-2 rounded-full bg-[var(--weather-rain)]" />
                </div>

                <p className="text-sm font-medium text-[var(--weather-text-main)]">
                  Search first
                </p>

                <p className="mt-1 text-xs leading-5 text-[var(--weather-text-sub)]">
                  Find a place and get straight to the forecast.
                </p>
              </div>

              <div className="rounded-xl border border-white/5 bg-[var(--weather-bg)]/60 p-4">
                <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--weather-wind)]/10">
                  <span className="h-2 w-2 rounded-full bg-[var(--weather-wind)]" />
                </div>

                <p className="text-sm font-medium text-[var(--weather-text-main)]">
                  Stay focused
                </p>

                <p className="mt-1 text-xs leading-5 text-[var(--weather-text-sub)]">
                  Clear information without the visual noise.
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-white/5 pt-6">
              <span className="text-xs text-[var(--weather-text-sub)]">
                Weather data
              </span>

              <span className="text-xs text-[var(--weather-text-sub)]/40">
                •
              </span>

              <span className="text-xs font-medium text-[var(--weather-text-main)]">
                <a href="https://open-meteo.com/" target="_BLANK">Open-Meteo</a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
