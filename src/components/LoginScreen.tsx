import { useState } from "react";
import { supabase } from "../lib/supabase";

type LoginScreenProps = {
  onSuccess: () => void;
  dashboardReady?: boolean;
  initialMode?: "login" | "register";
  onBack?: () => void; // ✅ geri tuşu callback
};

export default function LoginScreen({ onSuccess, initialMode, onBack }: LoginScreenProps) {
  const [mode, setMode] = useState<"login" | "register">(initialMode ?? "login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // ✅ Confirm password
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [exiting, setExiting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError("");

    // Register moduysa şifre kontrolü
    if (mode === "register" && password !== confirmPassword) {
      setError("Passwords do not match!");
      setLoading(false);
      return;
    }

    let error;
    if (mode === "login") {
      ({ error } = await supabase.auth.signInWithPassword({ email, password }));
    } else {
      ({ error } = await supabase.auth.signUp({ email, password }));
    }

    if (error) {
      setLoading(false);
      setError(error.message);
      return;
    }

    setExiting(true);
    setTimeout(() => onSuccess(), 300);
  };

  const containerClass =
    (exiting ? "login-exit " : "login-fade ") +
    "w-screen h-screen flex items-center justify-center bg-gradient-to-br from-[#f7f4ff] via-[#f3f8ff] to-[#fef9ff] relative overflow-hidden";

  return (
    <div className={containerClass}>
      {/* Arka plan blobları */}
      <div className="pointer-events-none absolute -top-40 -left-24 w-80 h-80 rounded-full bg-purple-300/35 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-48 -right-12 w-96 h-96 rounded-full bg-sky-300/30 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-[520px] h-[520px] rounded-full bg-fuchsia-300/10 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.22]">
        <div className="absolute -top-32 left-1/4 w-64 h-64 bg-gradient-to-br from-white/70 via-transparent to-transparent blur-3xl rotate-12" />
        <div className="absolute bottom-0 right-10 w-52 h-52 bg-gradient-to-tr from-white/50 via-transparent to-transparent blur-3xl -rotate-6" />
      </div>

      <div className="relative z-10 w-[380px] px-8 py-7 rounded-[26px] bg-white/75 border border-white/80 shadow-[0_22px_55px_rgba(148,163,184,0.55)] backdrop-blur-2xl flex flex-col items-center overflow-hidden">

        {/* ✅ Geri tuşu */}
        {onBack && (
  <button
    type="button"
    onClick={onBack}
    className="
      absolute top-4 left-4
      flex items-center gap-1 px-4 py-2
      rounded-2xl
      bg-white/40
      text-slate-700 font-medium
      backdrop-blur-xl
      shadow-[0_8px_22px_rgba(15,23,42,0.18)]
      hover:bg-white/60
      transition
    "
  > Geri
    
  </button>
)}





        {/* LOGO */}
        <div className="relative w-20 h-20 mb-4">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400/70 via-indigo-300/70 to-fuchsia-300/70 blur-[2px]" />
          <div className="relative w-full h-full rounded-full bg-white/90 border border-white/80 flex items-center justify-center overflow-hidden shadow-[0_8px_20px_rgba(148,163,184,0.45)]">
            <svg viewBox="0 0 200 200" className="w-[82%] h-[82%]">
              <defs>
                <linearGradient id="liquidMoonLight" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ede9fe" />
                  <stop offset="45%" stopColor="#a5b4fc" />
                  <stop offset="100%" stopColor="#fb7185" />
                </linearGradient>
              </defs>
              <circle cx="100" cy="100" r="82" fill="url(#liquidMoonLight)" />
              <path d="M120 45 A55 55 0 1 0 120 155 A42 60 0 1 1 120 45" fill="#f9fafb55" />
            </svg>
          </div>
        </div>

        <h1 className="text-[22px] font-semibold text-slate-900 text-center">
          {mode === "login" ? "Welcome Back 👋" : "Create Account ✨"}
        </h1>

        <p className="text-sm text-slate-500 mt-1 mb-6 text-center">
          {mode === "login"
            ? "Lunar Journal alanına yeniden hoş geldin."
            : "Kendi trading dashboard’unu oluştur."}
        </p>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 relative z-10">
          <div className="space-y-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] uppercase tracking-[0.18em] text-slate-500/90">Email</label>
              <input
                placeholder="email@example.com"
                value={email}
                disabled={loading}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-[14px] border border-slate-200/80 bg-white/80 text-slate-900 placeholder:text-slate-400/90 focus:bg-white focus:ring-2 focus:ring-indigo-300/70 outline-none transition text-sm"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] uppercase tracking-[0.18em] text-slate-500/90">Password</label>
              <input
                placeholder="••••••••"
                type="password"
                value={password}
                disabled={loading}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-[14px] border border-slate-200/80 bg-white/80 text-slate-900 placeholder:text-slate-400/90 focus:bg-white focus:ring-2 focus:ring-indigo-300/70 outline-none transition text-sm"
              />
            </div>

            {/* Confirm Password */}
            {mode === "register" && (
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] uppercase tracking-[0.18em] text-slate-500/90">Confirm Password</label>
                <input
                  placeholder="••••••••"
                  type="password"
                  value={confirmPassword}
                  disabled={loading}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-[14px] border border-slate-200/80 bg-white/80 text-slate-900 placeholder:text-slate-400/90 focus:bg-white focus:ring-2 focus:ring-indigo-300/70 outline-none transition text-sm"
                />
              </div>
            )}
          </div>

          {error && <div className="text-xs text-rose-500 mt-1">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="mt-3 py-3 rounded-[16px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold hover:from-indigo-400 hover:via-purple-400 hover:to-pink-400 transition flex items-center justify-center gap-2 shadow-[0_14px_35px_rgba(168,85,247,0.55)] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                {mode === "login" ? "Logging in..." : "Creating account..."}
              </>
            ) : mode === "login" ? "Login" : "Create Account"}
          </button>
        </form>

        
      </div>
    </div>
  );
}
