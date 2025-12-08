import { useState, useRef, useEffect } from "react";


type Props = {
  label: string;
  value: string;
  onChange: (v: string) => void;
};

export default function DateInput({ label, value, onChange }: Props) {
  const [show, setShow] = useState(false);

  const today = new Date();

  // Varsayılan ay/yıl bugün
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());

  const ref = useRef<HTMLDivElement>(null);

  // * Click outside → close
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setShow(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Gün sayısı
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // İlk gün haftanın hangi günü
  let startDay = new Date(year, month, 1).getDay();
  if (startDay === 0) startDay = 7; // Pazar = 7 olsun

  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  // Ay geçişi
  const prevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else setMonth((m) => m - 1);
  };

  const nextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else setMonth((m) => m + 1);
  };

  // Tarih seç
  const handleSelect = (d: number) => {
    const mm = String(month + 1).padStart(2, "0");
    const dd = String(d).padStart(2, "0");
    onChange(`${year}-${mm}-${dd}`);
    setShow(false);
  };

  // "Bugün" butonu
  const selectToday = () => {
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");

    onChange(`${today.getFullYear()}-${mm}-${dd}`);
    setMonth(today.getMonth());
    setYear(today.getFullYear());
    setShow(false);
  };

  return (
    <div className="relative" ref={ref}>
      <label className="text-xs font-medium text-slate-500 mb-1 block">
        {label}
      </label>

      {/* INPUT */}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setShow(true)}
        placeholder="gg.aa.yyyy"
        className="
          w-full h-[37px] rounded-xl px-4
          bg-white/70 backdrop-blur-xl
          border border-white/60
          shadow-[0_4px_18px_rgba(15,23,42,0.08)]
          outline-none text-sm
          focus:ring-2 ring-violet-400/50
          transition
        "
      />

      {/* POPUP */}
      {show && (
        <div
          className="
            absolute left-0 mt-2 z-[99999]
            w-[260px] rounded-2xl p-4
            bg-white/75 backdrop-blur-xl border border-white/40
            shadow-[0_22px_55px_rgba(15,23,42,0.18)]
            animate-[fadeIn_0.18s_ease-out]
          "
        >
          {/* HEADER */}
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={prevMonth}
              className="px-2 py-1 text-slate-600 hover:text-slate-900 text-lg"
            >
              ‹
            </button>

            <h3 className="font-semibold text-slate-700 text-sm">
              {monthNames[month]} {year}
            </h3>

            <button
              onClick={nextMonth}
              className="px-2 py-1 text-slate-600 hover:text-slate-900 text-lg"
            >
              ›
            </button>
          </div>

          {/* WEEKDAYS */}
          <div className="grid grid-cols-7 text-center text-[11px] font-medium text-slate-400 mb-2">
            {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>

          {/* DAYS GRID */}
          <div className="grid grid-cols-7 gap-1">
            {/* Boş kutular */}
            {Array(startDay - 1)
              .fill(0)
              .map((_, i) => (
                <div key={i}></div>
              ))}

            {/* Günler */}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => {
              const isSelected =
                value ===
                `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

              return (
                <button
                  key={d}
                  onClick={() => handleSelect(d)}
                  className={`
                    h-8 flex items-center justify-center rounded-lg
                    font-medium text-[13px] transition-all
                    ${
                      isSelected
                        ? "bg-violet-500 text-white shadow-[0_6px_16px_rgba(139,92,246,0.45)]"
                        : "text-slate-700 hover:bg-slate-200/60"
                    }
                  `}
                >
                  {d}
                </button>
              );
            })}
          </div>

          {/* TODAY BUTTON */}
          <button
            onClick={selectToday}
            className="
              w-full mt-3 py-1.5 rounded-xl text-sm font-medium
              bg-violet-50 text-violet-600
              hover:bg-violet-100
              transition
            "
          >
            Bugün’e Git
          </button>
        </div>
      )}
    </div>
  );
}
