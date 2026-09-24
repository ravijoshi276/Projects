export default function Privacy() {
  return (
    <section
      id="privacy"
      className="border-t border-white/5 bg-[var(--weather-bg)] px-4 py-12 sm:px-6 sm:py-16"
    >
      <div className="mx-auto w-full max-w-2xl">
        {/* Heading */}
        <div className="mb-7 sm:mb-8">
          <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--weather-wind)] sm:text-xs">
            Privacy
          </p>

          <h2 className="text-2xl font-semibold tracking-tight text-[var(--weather-text-main)] sm:text-3xl">
            Your data stays simple.
          </h2>

          <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--weather-text-sub)]">
            A little transparency about how this weather app handles your
            information.
          </p>
        </div>

        {/* Privacy card */}
        <div className="rounded-2xl border border-white/5 bg-[var(--weather-surface)] p-5 shadow-xl shadow-black/10 sm:p-7 md:p-8">
          <div className="space-y-7 sm:space-y-8">
            <div>
              <h3 className="text-sm font-medium text-[var(--weather-text-main)]">
                No account required
              </h3>

              <p className="mt-2 text-sm leading-6 text-[var(--weather-text-sub)]">
                You can use the app without creating an account or providing
                personal information.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-[var(--weather-text-main)]">
                Your searches
              </h3>

              <p className="mt-2 text-sm leading-6 text-[var(--weather-text-sub)]">
                Locations you search for are used to retrieve weather data and
                are not stored by this app.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-[var(--weather-text-main)]">
                Weather data
              </h3>

              <p className="mt-2 text-sm leading-6 text-[var(--weather-text-sub)]">
                Weather information is provided by <a href="https://open-meteo.com/" target="_BLANK">Open-Meteo</a> . Requests made
                to their service may be subject to their own privacy practices.
              </p>
            </div>
          </div>

          {/* Status */}
          <div className="mt-7 flex items-center gap-2 border-t border-white/5 pt-5 sm:mt-8 sm:pt-6">
            <span
              className="h-2 w-2 shrink-0 rounded-full bg-[var(--weather-wind)]"
              aria-hidden="true"
            />

            <span className="text-xs leading-5 text-[var(--weather-text-sub)]">
              No unnecessary data collection.
            </span>
          </div>
        </div>

        <p className="mt-5 text-center text-xs text-[var(--weather-text-sub)]/70">
          Last updated September 2026
        </p>
      </div>
    </section>
  );
}
