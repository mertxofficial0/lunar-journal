import React from "react";

type SidebarProps = {
  current: "dashboard" | "journal" | "profile";
  onChange: (page: "dashboard" | "journal" | "profile") => void;
  onLogout: () => void;
  loggingOut?: boolean;
};



export function Sidebar({
  current,
  onChange,
  onLogout,
  loggingOut = false,
}: SidebarProps) {
  return (
    <aside className="h-full w-64 flex-shrink-0">
      <div
        className="
          relative h-full w-full
          rounded-[28px]
          bg-white/60
          backdrop-blur-2xl
          border border-white/70
          shadow-[0_24px_60px_rgba(15,23,42,0.18)]
          overflow-hidden
        "
      >
        <div
          className="
            pointer-events-none absolute inset-0
            bg-[radial-gradient(circle_at_0_0,#a5b4fc33,transparent_55%),radial-gradient(circle_at_0_100%,#f9a8d433,transparent_55%),radial-gradient(circle_at_100%_50%,#a5f3fc33,transparent_55%)]
          "
        />

        <div className="relative z-10 flex h-full flex-col px-5 pt-5 pb-6 text-slate-800">
          {/* LOGO */}
          <div className="flex items-center gap-3 mb-8">
            <div
              className="
                w-11 h-11 rounded-2xl
                bg-white/80 border border-white/80 backdrop-blur-xl
                flex items-center justify-center
                shadow-[0_12px_30px_rgba(15,23,42,0.20)]
              "
            >
              <svg viewBox="0 0 200 200" className="w-8 h-8">
                <defs>
                  <linearGradient
                    id="lunarSidebarLogo"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#e0e7ff" />
                    <stop offset="45%" stopColor="#a5b4fc" />
                    <stop offset="100%" stopColor="#fb7185" />
                  </linearGradient>
                </defs>
                <circle cx="100" cy="100" r="80" fill="url(#lunarSidebarLogo)" />
                <path
                  d="M120 45 A55 55 0 1 0 120 155 A42 60 0 1 1 120 45"
                  fill="#f9fafbcc"
                />
              </svg>
            </div>

            <div className="flex flex-col">
              <span className="text-[11px] tracking-[0.24em] uppercase text-slate-500">
                LUNAR
              </span>
              <span className="text-sm font-semibold leading-tight text-slate-900">
                Lunar Journal
              </span>
              <span className="text-[11px] text-slate-500">
                Trading Dashboard
              </span>
            </div>
          </div>

          {/* NAVIGATION */}
          <nav className="space-y-3">
            <SidebarItem
              label="Dashboard"
              active={current === "dashboard"}
              onClick={() => onChange("dashboard")}
            />

            <SidebarItem
              label="Daily Journal"
              active={current === "journal"}
              onClick={() => onChange("journal")}
            />
            <SidebarItem
  label="Profile"
  active={current === "profile"}
  onClick={() => onChange("profile")}
/>

          </nav>

          <div className="flex-1" />

          {/* TIP */}
          <div className="text-[11px] text-slate-500 leading-snug mb-4 mt-4">
            <div className="uppercase tracking-[0.22em] text-slate-400 mb-1">
              Today&apos;s tip
            </div>
            <p>
              Kurallı trade fonu kurtarır.{" "}
              <span className="font-semibold text-rose-500">
                Revenge trade öldürür.
              </span>
            </p>
          </div>

          {/* LOGOUT */}
          <button
            onClick={onLogout}
            disabled={loggingOut}
            className={`
              mt-3 w-full py-2.5
              rounded-2xl text-sm font-medium
              bg-white/40 backdrop-blur-xl
              border border-white/50
              text-slate-700
              shadow-[0_8px_22px_rgba(15,23,42,0.18)]
              transition
              flex items-center justify-center gap-2
              ${
                loggingOut
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:bg-white/70"
              }
            `}
          >
            {loggingOut ? (
              <>
                <span className="w-4 h-4 border-2 border-slate-400/40 border-t-slate-600 rounded-full animate-spin" />
                Çıkış yapılıyor…
              </>
            ) : (
              "Çıkış Yap"
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}

type SidebarItemProps = {
  label: string;
  active: boolean;
  onClick: () => void;
};

function SidebarItem({ label, active, onClick }: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center justify-between
        rounded-[18px] px-4 py-3
        text-sm font-medium transition
        ${
          active
            ? "bg-white text-slate-900 shadow-[0_18px_40px_rgba(15,23,42,0.22)]"
            : "bg-white/30 text-slate-700 hover:bg-white/70 hover:shadow-[0_10px_28px_rgba(15,23,42,0.18)]"
        }
      `}
    >
      <span>{label}</span>
      <span
        className={`
          h-2.5 w-2.5 rounded-full
          ${
            active
              ? "bg-emerald-400 shadow-[0_0_0_4px_rgba(34,197,94,0.45)]"
              : "bg-slate-300"
          }
        `}
      />
    </button>
  );
}

export default React.memo(Sidebar);
