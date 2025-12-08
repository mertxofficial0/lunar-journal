import { useState, useRef, useEffect } from "react";

type Props = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
};

export default function CustomSelect({ label, value, onChange, options }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Dışarı tıklayınca kapansın
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="flex flex-col relative" ref={ref}>
      <label className="text-xs font-medium text-slate-500 mb-1">
        {label}
      </label>

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="
          w-full rounded-xl px-3 py-2 text-sm text-slate-700
          bg-white/40 backdrop-blur-xl border border-white/40
          shadow-[0_4px_20px_rgba(15,23,42,0.08)]
          flex items-center justify-between
        "
      >
        <span>{value}</span>

        <svg
          className={`w-4 h-4 transition ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="#6b7280"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="
            absolute left-0 right-0 mt-1
            bg-white/70 backdrop-blur-xl
            border border-white/60
            rounded-xl overflow-hidden
            shadow-[0_12px_30px_rgba(15,23,42,0.25)]
            animate-[fadeIn_0.15s_ease-out]
            z-[9999]
          "
        >
          {options.map((opt) => (
            <div
              key={opt}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className={`
                px-3 py-2 cursor-pointer text-sm
                ${
                  opt === value
                    ? "bg-indigo-100/70 text-indigo-700"
                    : "hover:bg-slate-100/60 text-slate-700"
                }
              `}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
