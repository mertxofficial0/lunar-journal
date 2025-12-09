import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  format,
  isSameMonth,
} from "date-fns";

type DayData = {
  date: string;
  pnl: number;
  trades: number;
};

export default function MonthlyCalendar({ days }: { days: DayData[] }) {
    if (!days.length) {
    return (
      <div className="rounded-3xl bg-white/70 backdrop-blur-xl shadow-xl p-6 mt-10">
        <h2 className="text-lg font-semibold text-slate-700 mb-4">
          No data yet
        </h2>
        <p className="text-sm text-slate-500">
          Add your first trade to see calendar statistics.
        </p>
      </div>
    );
  }

  const monthDate = new Date(days[0]?.date);
  const monthStart = startOfMonth(monthDate);
  const monthEnd = endOfMonth(monthStart);
  const weekStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  // Tüm display günleri oluştur
  const calendarDays = [];
  let current = weekStart;

  const map = new Map<string, DayData>();
  days.forEach((d) => map.set(d.date, d));

  while (current <= weekEnd) {
    const dateStr = format(current, "yyyy-MM-dd");
    calendarDays.push({
      date: dateStr,
      dayNum: format(current, "dd"),
      inMonth: isSameMonth(current, monthStart),
      pnl: map.get(dateStr)?.pnl ?? null,
      trades: map.get(dateStr)?.trades ?? null,
    });

    current = addDays(current, 1);
  }

  return (
    <div className="rounded-3xl bg-white/70 backdrop-blur-xl shadow-xl p-6 mt-10">
      {/* Ay adı */}
      <h2 className="text-lg font-semibold text-slate-700 mb-4">
        {format(monthStart, "MMMM yyyy")}
      </h2>

      {/* Hafta günleri */}
      <div className="grid grid-cols-7 text-center mb-3">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="text-xs text-slate-400 font-semibold">
            {d}
          </div>
        ))}
      </div>

      {/* Gün kutuları */}
      <div className="grid grid-cols-7 gap-3">
        {calendarDays.map((d, i) => (
          <div
            key={i}
            className={`
              h-24 rounded-2xl border flex flex-col justify-center items-center text-sm transition-all
              ${
                !d.inMonth
                  ? "bg-slate-100/20 border-slate-200 text-slate-300"
                  : d.pnl === null
                  ? "bg-white/50 border-white/40 text-slate-600"
                  : d.pnl > 0
                  ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                  : "bg-rose-50 border-rose-200 text-rose-700"
              }
            `}
          >
            {/* Gün numarası */}
            <span className="text-[11px]">{d.dayNum}</span>

            {/* Veri varsa */}
            {d.pnl !== null && (
              <>
                <span className="font-semibold text-sm mt-1">
                  {d.pnl > 0 ? "+" : ""}
                  {d.pnl}$
                </span>
                <span className="text-[10px] opacity-60">
                  {d.trades} trades
                </span>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
