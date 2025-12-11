import { useState } from "react";

type LandingProps = {
  onLogin: (mode?: "login" | "register") => void;
};

export default function Landing({ onLogin }: LandingProps) {
  const [showBar, setShowBar] = useState(false);

  // ✨ Login / Register butonları bar animasyonu tetikler
  function handleClick(mode: "login" | "register") {
    setShowBar(true);

    // 1 saniyelik loading bar animasyonu
    setTimeout(() => {
      setShowBar(false);
      onLogin(mode);
    }, 800);
  }

  return (
    <div className="relative w-screen h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 overflow-hidden">
{/* BETA BANNER */}
<div
  className="
    absolute top-10 
    px-5 py-2 
    rounded-2xl 
    backdrop-blur-xl 
    bg-white/100
    border border-white/70 
    shadow-[0_8px_22px_rgba(15,23,42,0.15)]
    animate-[fadeIn_0.6s_ease-out]
  "
>
  <span
    className="
      text-sm font-medium 
      bg-gradient-to-r from-indigo-500 to-pink-500 
      bg-clip-text text-transparent
    "
  >
    Lunar Journal şu anda Beta sürümündedir • Hatalar oluşabilir
  </span>
</div>

<style>
{`
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-6px); }
    to { opacity: 1; transform: translateY(0); }
  }
`}
</style>

      {/* ---------------------- */}
      {/* 🔥 TOP LOADING BAR */}
      {/* ---------------------- */}
      <style>{`
        @keyframes lunarProgress {
          0%   { width: 0%; opacity: 1; }
          100% { width: 100%; opacity: 1; }
        }
      `}</style>

      {showBar && (
        <div className="
          fixed top-0 left-0 h-[3px] z-50
          bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
          animate-[lunarProgress_0.8s_ease-out_forwards]
          shadow-[0_0_14px_rgba(140,120,255,0.45)]
        " />
      )}

      {/* ---------------------- */}
      {/* ARKA PLAN BLOBLAR */}
      {/* ---------------------- */}
      <div className="pointer-events-none absolute -top-40 -left-32 w-96 h-96 rounded-full bg-indigo-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-48 -right-32 w-[520px] h-[520px] rounded-full bg-pink-300/30 blur-3xl" />

      {/* ---------------------- */}
      {/* HERO CARD */}
      {/* ---------------------- */}
      <div
        className="
          relative z-10
          max-w-5xl w-full mx-6
          glass-card
          p-10 md:p-14
          grid md:grid-cols-2 gap-10
        "
      >
        {/* SOL TARAF – METİN */}
        <div className="flex flex-col justify-center">
          <span className="text-[11px] tracking-[0.35em] uppercase text-slate-500 mb-3">
            LUNAR JOURNAL
          </span>

          <h1 className="text-4xl md:text-5xl font-semibold text-slate-900 leading-tight">
            Disiplinli trade,
            <br />
            <span className="bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent">
              net istatistik.
            </span>
          </h1>

          <p className="mt-5 text-slate-600 text-base max-w-md">
            Trade’lerini kaydet, davranışlarını analiz et,
            karar kaliteni istatistiklerle geliştir.
          </p>

          {/* BUTTONS */}
          <div className="mt-8 flex items-center gap-4">

            {/* LOGIN */}
            <button
              onClick={() => handleClick("login")}
              className="
                px-6 py-3 rounded-2xl
                text-sm font-medium text-white
                bg-gradient-to-r from-indigo-500 to-purple-500
                shadow-[0_14px_35px_rgba(79,70,229,0.55)]
                hover:shadow-[0_18px_45px_rgba(79,70,229,0.7)]
                active:scale-[0.97]
                transition
              "
            >
              Log In
            </button>

            {/* REGISTER */}
            <button
              onClick={() => handleClick("register")}
              className="
                px-6 py-3 rounded-2xl
                text-sm font-medium
                bg-white/60 backdrop-blur-xl
                border border-white/70
                text-slate-700
                shadow-[0_8px_20px_rgba(15,23,42,0.18)]
                hover:bg-white/80
                active:scale-[0.97]
                transition
              "
            >
              Create Account
            </button>

            <span className="text-xs text-slate-400">
              Journal & Dashboard sistemi
            </span>
          </div>
        </div>

        {/* SAĞ TARAF – MOCK CARD */}
        <div className="flex items-center justify-center">
          <div
            className="
              w-full max-w-sm
              rounded-3xl
              bg-white/70 backdrop-blur-xl
              border border-white/60
              shadow-[0_22px_55px_rgba(15,23,42,0.18)]
              p-6
              animate-[fadeIn_0.35s_ease-out]
            "
          >
            <div className="text-xs uppercase tracking-wider text-slate-400 mb-2">
              Bugün
            </div>

            <div className="text-2xl font-semibold text-slate-900 mb-4">
              +1.84R
            </div>

            <div className="space-y-3">
              <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full w-[62%] bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full" />
              </div>

              <div className="flex justify-between text-xs text-slate-500">
                <span>Winrate</span>
                <span>62%</span>
              </div>

              <div className="flex justify-between text-xs text-slate-500">
                <span>Avg R</span>
                <span>+0.48</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
