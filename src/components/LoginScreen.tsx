import { useState } from "react";
import { supabase } from "../lib/supabase";

/* ----------------------------------------------------------
   🔥 EyeToggle – animasyonlu göz / slash çizgisi
----------------------------------------------------------- */
function EyeToggle({ show }: { show: boolean }) {
  return (
    <div className="relative w-5 h-5">
      <svg
        className="w-5 h-5 text-slate-600"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 12s3.75-7.5 9.75-7.5 9.75 7.5 9.75 7.5-3.75 7.5-9.75 7.5S2.25 12 2.25 12z"
        />
        <circle cx="12" cy="12" r="3" />
      </svg>

      <svg
        className={`absolute inset-0 w-5 h-5 stroke-rose-500 transition-all duration-200
          ${show ? "opacity-0 scale-90" : "opacity-100 scale-100"}
        `}
        fill="none"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <line x1="3" y1="21" x2="21" y2="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

/* ----------------------------------------------------------
   🔥 LoginScreen Component
----------------------------------------------------------- */

type LoginScreenProps = {
  onSuccess: () => void;
  dashboardReady?: boolean;
  initialMode?: "login" | "register";
  onBack?: () => void;
};

export default function LoginScreen({
  onSuccess,
  initialMode,
  onBack,
}: LoginScreenProps) {
  /* 🟣 Password strength */
  const [passwordStrength, setPasswordStrength] = useState<"weak" | "medium" | "strong" | "">("");

  function calculateStrength(pw: string) {
    let score = 0;
    if (pw.length >= 6) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw) || /[^A-Za-z0-9]/.test(pw)) score++;
    if (score === 0) return "";
    if (score === 1) return "weak";
    if (score === 2) return "medium";
    return "strong";
  }

  const [confirmStrength, setConfirmStrength] = useState<"weak" | "medium" | "strong" | "">("");

  function calculateConfirmStrength(pw: string) {
    let score = 0;
    if (pw.length >= 6) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw) || /[^A-Za-z0-9]/.test(pw)) score++;
    if (score === 0) return "";
    if (score === 1) return "weak";
    if (score === 2) return "medium";
    return "strong";
  }

  /* Extra register alanları */
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");

  /* STATE */
  const [mode] = useState<"login" | "register">(initialMode ?? "login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [showBackBar, setShowBackBar] = useState(false);


  /* SUBMIT */
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (loading) return;

  setLoading(true);
  setError("");

  if (mode === "register") {
    if (password.length < 8) {
      setError("Password must be at least 8 characters!");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      setLoading(false);
      return;
    }

    if (passwordStrength === "weak") {
      setError("Password too weak!");
      setLoading(false);
      return;
    }
  }

  let authError;
  let data;

  if (mode === "login") {
    const result = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    authError = result.error;
  } else {
    const result = await supabase.auth.signUp({
      email,
      password,
    });

    authError = result.error;
    data = result.data;

    // 🔥 SIGN UP BAŞARILIYSA PROFİLE EKLE
    if (!authError && data?.user) {
      await supabase.from("profiles").insert({
        id: data.user.id,
        first_name: firstName,
        last_name: lastName,
        username: username,
      });
    }
  }

  if (authError) {
    setLoading(false);
    setError(authError.message);
    return;
  }

  setTimeout(() => {
    setExiting(true);
    onSuccess();
  }, 4000);
};



  const containerClass =
    (exiting ? "login-exit " : "login-fade ") +
    "w-screen h-screen flex items-center justify-center bg-gradient-to-br from-[#f7f4ff] via-[#f3f8ff] to-[#fef9ff] relative overflow-hidden";

  return (
    <div className={containerClass}>
      {/* BACK PROGRESS BAR */}
{showBackBar && (
  <div
    className="
      fixed top-0 left-0 h-[3px] z-[9999]
      bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
      animate-[lunarProgress_0.5s_ease-out_forwards]
    "
  />
)}
<style>{`
  @keyframes lunarProgress {
    0% { width: 0%; opacity: 1; }
    100% { width: 100%; opacity: 1; }
  }
`}</style>

      {/* BACKGROUND BLURS */}
      <div className="pointer-events-none absolute -top-40 -left-24 w-80 h-80 rounded-full bg-purple-300/35 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-48 -right-12 w-96 h-96 rounded-full bg-sky-300/30 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-[520px] h-[520px] rounded-full bg-fuchsia-300/10 blur-3xl" />

      {/* CARD */}
      <div className="relative z-10 w-[380px] px-8 py-7 rounded-[26px] bg-white/75 border border-white/80 shadow-[0_22px_55px_rgba(148,163,184,0.55)] backdrop-blur-2xl flex flex-col items-center overflow-hidden">
        
        {onBack && (
          <button
            type="button"
            onClick={() => {
  setShowBackBar(true);
  setTimeout(() => {
    setShowBackBar(false);
    onBack && onBack();
  }, 500); // 0.5 saniye sonra geri dön
}}

            className="absolute top-4 left-4 flex items-center gap-1 px-4 py-2 rounded-2xl bg-white/40 text-slate-700 font-medium backdrop-blur-xl shadow-[0_8px_22px_rgba(15,23,42,0.18)] hover:bg-white/60 transition"
          >
            Geri
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

        {/* HEADINGS */}
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

            {/* REGISTER MODE EXTRA FIELDS */}
            {mode === "register" && (
              <>
                {/* FIRST NAME */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] uppercase tracking-[0.18em] text-slate-500/90">
                    First Name
                  </label>
                  <input
                    placeholder="Mert"
                    value={firstName}
                    disabled={loading}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-[14px] border border-slate-200/80 bg-white/80 
                               text-slate-900 placeholder:text-slate-400/90 focus:bg-white 
                               focus:ring-2 focus:ring-indigo-300/70 outline-none transition text-sm"
                  />
                </div>

                {/* LAST NAME */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] uppercase tracking-[0.18em] text-slate-500/90">
                    Last Name
                  </label>
                  <input
                    placeholder="Zengin"
                    value={lastName}
                    disabled={loading}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-[14px] border border-slate-200/80 bg-white/80 
                               text-slate-900 placeholder:text-slate-400/90 focus:bg-white 
                               focus:ring-2 focus:ring-indigo-300/70 outline-none transition text-sm"
                  />
                </div>

                {/* USERNAME */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] uppercase tracking-[0.18em] text-slate-500/90">
                    Username
                  </label>
                  <input
                    placeholder="mertztrader"
                    value={username}
                    disabled={loading}
                    onChange={(e) => setUsername(e.target.value.toLowerCase())}
                    className="
                      w-full px-4 py-2.5 rounded-[14px] border border-slate-200/80 
                      bg-white/80 text-slate-900 placeholder:text-slate-400/90 
                      focus:bg-white focus:ring-2 focus:ring-indigo-300/70 
                      outline-none transition text-sm
                    "
                  />
                </div>
              </>
            )}

            {/* EMAIL */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] uppercase tracking-[0.18em] text-slate-500/90">
                Email
              </label>
              <input
                placeholder="email@example.com"
                value={email}
                disabled={loading}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-[14px] border border-slate-200/80 bg-white/80 text-slate-900 placeholder:text-slate-400/90 focus:bg-white focus:ring-2 focus:ring-indigo-300/70 outline-none transition text-sm"
              />
            </div>

            {/* PASSWORD */}
            <div className="flex flex-col gap-1.5 relative">
              <label className="text-[11px] uppercase tracking-[0.18em] text-slate-500/90">
                Password
              </label>

              <div className="relative">
                <input
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  disabled={loading}
                  onChange={(e) => {
                    const val = e.target.value;
                    setPassword(val);
                    setPasswordStrength(calculateStrength(val));
                  }}
                  className="
                    w-full px-4 py-2.5 rounded-[14px] border border-slate-200/80 
                    bg-white/80 text-slate-900 placeholder:text-slate-400/90 
                    focus:bg-white focus:ring-2 focus:ring-indigo-300/70 
                    outline-none transition text-sm pr-10
                  "
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                >
                  <EyeToggle show={showPassword} />
                </button>
              </div>

              {/* PASSWORD STRENGTH BAR */}
              {mode === "register" && (
                <div className={`w-[95%] -ml-[-2%] mt-[3px] ${passwordStrength ? "animate-strength-in" : "animate-strength-out"}`}>
                  {passwordStrength && (
                    <div className="h-[4px] rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className={`
                          h-full rounded-full transition-all duration-300
                          ${
                            passwordStrength === "weak"
                              ? "bg-rose-500 w-1/3"
                              : passwordStrength === "medium"
                              ? "bg-amber-500 w-2/3"
                              : "bg-emerald-500 w-full"
                          }
                        `}
                      ></div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* CONFIRM PASSWORD */}
            {mode === "register" && (
              <div className="flex flex-col gap-1.5 relative">
                <label className="text-[11px] uppercase tracking-[0.18em] text-slate-500/90">
                  Confirm Password
                </label>

                <div className="relative">
                  <input
                    placeholder="••••••••"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    disabled={loading}
                    onChange={(e) => {
                      const val = e.target.value;
                      setConfirmPassword(val);
                      setConfirmStrength(calculateConfirmStrength(val));
                    }}
                    className="w-full px-4 py-2.5 rounded-[14px] border border-slate-200/80 bg-white/80 
                               text-slate-900 placeholder:text-slate-400/90 focus:bg-white 
                               focus:ring-2 focus:ring-indigo-300/70 outline-none transition text-sm pr-11"
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                  >
                    <EyeToggle show={showConfirmPassword} />
                  </button>
                </div>

                {/* CONFIRM BAR */}
                <div className={`w-[95%] -ml-[-2%] mt-[3px] ${confirmStrength ? "animate-strength-in" : "animate-strength-out"}`}>
                  {confirmStrength && (
                    <div className="h-[4px] rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className={`
                          h-full rounded-full transition-all duration-300
                          ${
                            confirmStrength === "weak"
                              ? "bg-rose-500 w-1/3"
                              : confirmStrength === "medium"
                              ? "bg-amber-500 w-2/3"
                              : "bg-emerald-500 w-full"
                          }
                        `}
                      ></div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ERROR */}
          {error && <div className="text-xs text-rose-500 mt-1">{error}</div>}

          {/* SUBMIT BUTTON */}
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
