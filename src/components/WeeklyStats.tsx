type WeeklyStatsProps = {
  weeks: { week: number; pnl: number }[];
};

export default function WeeklyStats({ weeks }: WeeklyStatsProps) {
  return (
    <div className="glass-card p-6 w-56 flex flex-col gap-5">

      <h3 className="text-base font-semibold text-slate-700 mb-2">
        Weekly P&L
      </h3>

      <div className="flex flex-col gap-3">
        {weeks.map((w) => {
          const positive = w.pnl > 0;
          const negative = w.pnl < 0;

          return (
            <div
              key={w.week}
              className={`flex items-center justify-between p-3 rounded-2xl shadow-sm border 
                transition-all
                ${
                  positive
                    ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                    : negative
                    ? "bg-rose-50 border-rose-200 text-rose-700"
                    : "bg-slate-50 border-slate-200 text-slate-600"
                }
              `}
            >
              <span className="text-sm font-medium">Week {w.week}</span>

              <span className="font-semibold">
                {positive ? "+" : ""}
                {w.pnl}$
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
