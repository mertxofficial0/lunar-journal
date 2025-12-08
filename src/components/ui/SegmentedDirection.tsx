

type Props = {
  value: "Long" | "Short";
  onChange: (v: "Long" | "Short") => void;
};

export default function SegmentedDirection({ value, onChange }: Props) {
  return (
    <div className="flex flex-col">
      <label className="text-xs font-medium text-slate-500 mb-1">
        Direction
      </label>

      <div
        className="
          flex p-1 rounded-xl
          bg-white/40 backdrop-blur-xl
          border border-white/40
          shadow-[0_4px_20px_rgba(15,23,42,0.08)]
        "
      >
        <button
          type="button"
          onClick={() => onChange("Long")}
          className={`
            flex-1 py-2 rounded-lg text-sm font-medium transition
            active:scale-[0.97]
            ${
              value === "Long"
                ? "bg-emerald-500 text-white shadow-[0_8px_20px_rgba(16,185,129,0.35)]"
                : "text-slate-600 hover:bg-white/40"
            }
          `}
        >
          Long
        </button>

        <button
          type="button"
          onClick={() => onChange("Short")}
          className={`
            flex-1 py-2 rounded-lg text-sm font-medium transition
            active:scale-[0.97]
            ${
              value === "Short"
                ? "bg-rose-500 text-white shadow-[0_8px_20px_rgba(244,63,94,0.35)]"
                : "text-slate-600 hover:bg-white/40"
            }
          `}
        >
          Short
        </button>
      </div>
    </div>
  );
}
