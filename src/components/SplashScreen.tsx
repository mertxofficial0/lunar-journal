export default function SplashScreen() {
  return (
    <div
      className="
        splash-screen
        w-screen h-screen 
        flex items-center justify-center
        bg-gradient-to-br from-[#f7f4ff] via-[#f3f8ff] to-[#fef9ff]
        relative overflow-hidden
      "
    >
      {/* LIQUID pastel arka plan blob'ları */}
      <div className="pointer-events-none absolute -top-40 -left-24 w-80 h-80 rounded-full bg-purple-300/35 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-48 -right-12 w-96 h-96 rounded-full bg-sky-300/30 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-[520px] h-[520px] rounded-full bg-fuchsia-300/12 blur-3xl" />

      {/* Hafif liquid yansıma overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.22]">
        <div className="absolute -top-32 left-1/4 w-64 h-64 bg-gradient-to-br from-white/80 via-transparent to-transparent blur-3xl rotate-12" />
        <div className="absolute bottom-0 right-10 w-52 h-52 bg-gradient-to-tr from-white/55 via-transparent to-transparent blur-3xl -rotate-6" />
      </div>

      {/* ANA LIQUID GLASS KART (LUNAR SPLASH) */}
      <div
        className="
          relative z-10
          w-[360px]
          px-8 py-7
          rounded-[26px]
          bg-white/78
          border border-white/85
          shadow-[0_22px_55px_rgba(148,163,184,0.55)]
          backdrop-blur-2xl
          flex flex-col items-center
          overflow-hidden
        "
      >
        {/* Kart içi highlight */}
        <div className="pointer-events-none absolute -top-24 inset-x-10 h-40 bg-gradient-to-b from-white via-white/45 to-transparent opacity-95 blur-xl" />
        <div className="pointer-events-none absolute -bottom-16 left-1/2 -translate-x-1/2 w-64 h-32 bg-gradient-to-t from-purple-300/45 via-indigo-200/20 to-transparent blur-2xl" />

        {/* LOGO - Login ile uyumlu liquid lunar logo */}
        <div className="relative w-18 h-18 mb-3 mt-1">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400/70 via-indigo-300/70 to-pink-300/70 blur-[2px]" />
          <div className="relative w-20 h-20 rounded-full bg-white/90 border border-white/80 flex items-center justify-center overflow-hidden shadow-[0_8px_20px_rgba(148,163,184,0.45)]">
            <svg viewBox="0 0 200 200" className="w-[82%] h-[82%]">
              <defs>
                <linearGradient id="splashLiquidMoon" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ede9fe" />
                  <stop offset="45%" stopColor="#a5b4fc" />
                  <stop offset="100%" stopColor="#fb7185" />
                </linearGradient>
              </defs>
              <circle cx="100" cy="100" r="82" fill="url(#splashLiquidMoon)" />
              <path
                d="
                  M120 45
                  A55 55 0 1 0 120 155
                  A42 60 0 1 1 120 45
                "
                fill="#f9fafb55"
              />
              <circle cx="65" cy="70" r="5" fill="#fdf2ff" />
              <circle cx="138" cy="120" r="4" fill="#e0e7ff" />
              <circle cx="80" cy="132" r="3" fill="#fee2ff" />
            </svg>
          </div>
        </div>

        {/* LUNAR JOURNAL text */}
        <span className="text-[11px] tracking-[0.35em] text-slate-500 uppercase">
          LUNAR
        </span>
        <div className="mt-1 text-lg font-semibold text-slate-900">
          LUNAR JOURNAL
        </div>

        {/* İnce glow çizgi */}
        <div className="mt-2 w-28 h-[2px] rounded-full bg-gradient-to-r from-purple-400 via-white to-pink-400 blur-[0.5px]" />

        <p className="mt-4 text-xs text-slate-500 text-center">
          Trading alanın hazırlanıyor...
        </p>

        {/* Loading bar */}
        <div className="mt-6 w-full h-2 rounded-full bg-white/70 overflow-hidden relative">
          <div className="loading-bar-inner"></div>
        </div>
      </div>
    </div>
  );
}
