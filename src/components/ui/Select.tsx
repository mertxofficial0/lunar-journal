import { useState, useRef, useEffect } from "react";


type Props = {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
};

export default function Select({ label, value, options, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Click outside -> close
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <label className="text-xs font-medium text-slate-500 mb-1 block">
        {label}
      </label>

      {/* TOP BUTTON */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="
          w-full h-[37px] px-4 rounded-xl text-left text-sm
          bg-white/70 backdrop-blur-xl
          border border-white/60
          shadow-[0_4px_18px_rgba(15,23,42,0.08)]
          flex items-center justify-between
          transition
          focus:ring-2 ring-violet-400/50
        "
      >
        <span className="text-slate-700">{value}</span>

        <svg
          className="w-4 h-4 text-slate-500"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "0.2s" }}
          fill="none"
          strokeWidth="2"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {/* DROPDOWN */}
      {open && (
        <div
          className="
            absolute left-0 right-0 mt-3 z-[9999]
            rounded-3xl p-3
            bg-white/85 backdrop-blur-2xl
            border border-white/60
            shadow-[0_28px_65px_rgba(15,23,42,0.28)]
            animate-[fadeIn_0.20s_ease-out]
          "
          style={{
            animation:
              "fadeInSoft 0.20s ease-out, scaleIn 0.20s ease-out",
          }}
        >
          {/* Soft highlight overlay */}
          <div className="absolute inset-x-6 top-0 h-10 bg-white/60 blur-xl opacity-80 rounded-3xl pointer-events-none"></div>

          {/* OPTIONS */}
          <div className="relative flex flex-col gap-1 z-10">
            {options.map((opt) => {
              const active = opt === value;

              return (
                <button
                  key={opt}
                  onClick={() => {
                    onChange(opt);
                    setOpen(false);
                  }}
                  className={`
                    w-full text-left px-4 py-2.5 text-sm 
                    rounded-xl transition-all duration-150
                    ${
                      active
                        ? "bg-violet-500 text-white shadow-[0_6px_20px_rgba(139,92,246,0.45)]"
                        : "text-slate-700 hover:bg-slate-200/60 hover:shadow-[0_2px_12px_rgba(0,0,0,0.12)]"
                    }
                  `}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ANIMATIONS */}
      <style>
        {`
          @keyframes fadeInSoft {
            0% { opacity: 0; }
            100% { opacity: 1; }
          }
          @keyframes scaleIn {
            0% { transform: scale(0.96); filter: blur(4px); }
            100% { transform: scale(1); filter: blur(0px); }
          }
        `}
      </style>
    </div>
  );
}
