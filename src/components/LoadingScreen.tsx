export default function LoadingScreen() {
  return (
    <div
      className="
        w-screen h-screen 
        flex items-center justify-center
        bg-gradient-to-br from-[#f7f4ff] via-[#f3f8ff] to-[#fff4f8]
        splash-glass-fade
      "
    >
      <div
        className="
          relative
          w-[320px]
          px-8 py-7
          rounded-2xl
          bg-white/60
          border border-white/70
          shadow-[0_18px_45px_rgba(15,23,42,0.18)]
          backdrop-blur-2xl
          flex flex-col items-center
        "
      >
        {/* Glow arka plan efekti */}
        <div className="pointer-events-none absolute -top-10 -left-10 w-24 h-24 rounded-full bg-purple-400/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 -right-6 w-24 h-24 rounded-full bg-sky-400/25 blur-3xl" />

        {/* LUNAR JOURNAL yazısı */}
        <span className="text-[11px] tracking-[0.35em] text-slate-400 uppercase">
          LUNAR
        </span>
        <div className="mt-2 text-lg font-semibold text-slate-800">
          LUNAR JOURNAL
        </div>

        {/* Parlak glow çizgisi */}
        <div className="mt-2 w-24 h-[2px] rounded-full bg-gradient-to-r from-purple-400 via-white to-purple-400 blur-[0.5px]" />

        <p className="mt-4 text-xs text-slate-500 text-center">
          Trading alanın hazırlanıyor...
        </p>

        {/* Loading bar */}
        <div className="mt-6 w-full h-2 rounded-full bg-white/50 overflow-hidden relative">
          <div className="loading-bar-inner"></div>
        </div>
      </div>
    </div>
  );
}
