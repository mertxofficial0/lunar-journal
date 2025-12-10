type LandingProps = {
  onLogin: (mode?: "login" | "register") => void;
};

export default function Landing({ onLogin }: LandingProps) {
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 overflow-hidden">
      {/* Arka plan liquid bloblar */}
      <div className="pointer-events-none absolute -top-40 -left-32 w-96 h-96 rounded-full bg-indigo-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-48 -right-32 w-[520px] h-[520px] rounded-full bg-pink-300/30 blur-3xl" />

      {/* HERO CARD */}
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

          {/* ✅ BUTTONS */}
          <div className="mt-8 flex items-center gap-4">
            {/* LOGIN */}
            <button
              onClick={() => onLogin("login")}
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
              onClick={() => onLogin("register")}
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
