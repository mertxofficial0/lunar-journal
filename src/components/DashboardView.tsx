import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import WeeklyStats from "./WeeklyStats";
import MonthlyCalendar from "./MonthlyCalendar";
import type { Trade } from "../types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
} from "recharts";

type Stats = {
  total: number;
  wins: number;
  losses: number;
  totalR: number;
  totalUsd: number;
  winrate: number;
  avgR: number;
  profitFactor: number;
};

type DashboardProps = {
  trades: Trade[];
  stats: Stats;
};

export const DashboardView = ({ trades, stats }: DashboardProps) => {

  // 🔥 PROFİL STATE (sadece 1 tane!)
  const [profile, setProfile] = useState<{
    first_name: string | null;
    last_name: string | null;
    username: string | null;
  } | null>(null);

  // 🔥 Supabase’den kullanıcı bilgisi çek
  useEffect(() => {
  async function loadProfile() {
    const { data: { user } } = await supabase.auth.getUser();

    console.log("AUTH USER:", user);  // 👈 TEST

    if (!user) return;

    const { data, error } = await supabase
      .from("profiles")
      .select("first_name, last_name, username")
      .eq("id", user.id)
      .single();

    console.log("PROFILE RESULT:", data, error); // 👈 TEST

    setProfile(data);
  }

  loadProfile();
}, []);

  // -------------------------------------------------------------
  // DASHBOARD İSTATİSTİK HESAPLAMALARI
  // -------------------------------------------------------------

  const equityData = trades.map((t, idx) => ({
    index: idx + 1,
    label: t.date,
    equity:
      trades
        .slice(0, idx + 1)
        .reduce((a, b) => a + b.resultUsd, 0) || 0,
  }));

  const winLossData = [
    { name: "Win", value: stats.wins },
    { name: "Loss", value: stats.losses },
  ];

  const dailyMap = new Map<string, number>();
  trades.forEach((t) => {
    const prev = dailyMap.get(t.date) ?? 0;
    dailyMap.set(t.date, prev + t.resultUsd);
  });

  const dailyPnl = Array.from(dailyMap.entries()).map(([date, value]) => ({
    date,
    value,
  }));

  const weekly = new Map<number, number>();
  dailyPnl.forEach((d) => {
    const dayNum = Number(d.date.split("-")[2]);
    const weekNum = Math.ceil(dayNum / 7);
    const prev = weekly.get(weekNum) ?? 0;
    weekly.set(weekNum, prev + d.value);
  });

  const weeklyStats = Array.from(weekly.entries()).map(([week, pnl]) => ({
    week,
    pnl,
  }));

  // 🔥 Dynamic greeting
  const greeting = profile
    ? `Good evening, ${profile.first_name} ${profile.last_name} 👋`
    : "Good evening 👋";

  return (
    <div className="flex-1 min-w-0 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
      <div className="mx-auto max-w-6xl space-y-6">
        
        {/* HEADER */}
        <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              {greeting}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              İşlemlerini pastel, soft bir dashboard&apos;da izliyorsun.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-2xl bg-white/70 px-4 py-2 text-xs text-slate-600 shadow-[0_16px_45px_rgba(15,23,42,0.16)] backdrop-blur-xl">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-[11px] font-semibold text-emerald-700">
              P&L
            </span>
            <div className="flex flex-col">
              <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Demo veri gösteriliyor
              </span>
              <span className="text-[11px]">
                Sonra gerçek Blueberry / FTMO fon verilerine bağlarız.
              </span>
            </div>
          </div>
        </header>

        {/* STAT CARDS */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Account P&L"
            value={`${stats.totalUsd.toFixed(2)} $`}
            subtitle={stats.totalUsd >= 0 ? "Positive" : "Negative"}
            progress={Math.min(Math.abs(stats.totalUsd) / 500, 1)}
            variant={stats.totalUsd >= 0 ? "green" : "red"}
          />
          <StatCard
            title="Winrate"
            value={`${stats.winrate.toFixed(1)}%`}
            subtitle={`${stats.wins}/${stats.total} wins`}
            progress={stats.winrate / 100}
            variant="purple"
          />
          <StatCard
            title="Profit Factor"
            value={stats.profitFactor.toFixed(2)}
            subtitle="Gross Prof / Loss"
            progress={Math.min(stats.profitFactor / 3, 1)}
            variant="blue"
          />
          <StatCard
            title="Avg R / Trade"
            value={stats.avgR.toFixed(2)}
            subtitle={`${stats.totalR.toFixed(2)}R total`}
            progress={Math.min(Math.abs(stats.avgR), 1)}
            variant="pink"
          />
        </section>

        {/* EQUITY + WIN/LOSS */}
        <section className="grid gap-4 lg:grid-cols-[minmax(0,2.1fr)_minmax(0,0.9fr)]">
          {/* Equity curve */}
          <div className="glass-card">
            <div className="flex items-center justify-between pb-3">
              <div>
                <h2 className="text-sm font-semibold text-slate-800">
                  Equity Curve
                </h2>
                <p className="text-xs text-slate-500">
                  Kümülatif P&L (demo verisi).
                </p>
              </div>
            </div>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={equityData}>
                  <defs>
                    <linearGradient id="equityFill" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.45} />
                      <stop offset="100%" stopColor="#a855f7" stopOpacity={0.04} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="index"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fill: "#9ca3af" }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fill: "#9ca3af" }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 16,
                      border: "1px solid #e5e7eb",
                      boxShadow:
                        "0 18px 45px rgba(15, 23, 42, 0.18)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="equity"
                    stroke="#4f46e5"
                    strokeWidth={2.4}
                    dot={false}
                    fill="url(#equityFill)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Win vs Loss */}
          <div className="glass-card">
            <div className="flex items-center justify-between pb-3">
              <div>
                <h2 className="text-sm font-semibold text-slate-800">
                  Win vs Loss
                </h2>
                <p className="text-xs text-slate-500">
                  Toplam {stats.total} işlem – {stats.wins} win,{" "}
                  {stats.losses} loss.
                </p>
              </div>
            </div>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={winLossData}>
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fill: "#9ca3af" }}
                  />
                  <YAxis
                    allowDecimals={false}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fill: "#9ca3af" }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 16,
                      border: "1px solid #e5e7eb",
                      boxShadow:
                        "0 18px 45px rgba(15, 23, 42, 0.18)",
                    }}
                  />
                  <Bar
                    dataKey="value"
                    radius={[999, 999, 6, 6]}
                    fill="#22c55e"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        
        {/* Monthly Performance Calendar */}
<section className="mt-10 grid grid-cols-[1fr_auto] gap-6">

  <MonthlyCalendar
    days={dailyPnl.map((d) => ({
      date: d.date,
      pnl: d.value,
      trades: trades.filter((t) => t.date === d.date).length,
    }))}
  />

  <WeeklyStats weeks={weeklyStats} />

</section>


      </div>
    </div>
  );
};

type StatCardProps = {
  
  title: string;
  value: string;
  subtitle: string;
  progress: number;
  variant: "green" | "purple" | "blue" | "pink" | "red";
};

const variantClasses: Record<
  StatCardProps["variant"],
  { bar: string; pill: string }
> = {
  green: {
    bar: "from-emerald-400 to-emerald-500",
    pill: "bg-emerald-100 text-emerald-700",
  },
  purple: {
    bar: "from-violet-400 to-indigo-500",
    pill: "bg-violet-100 text-violet-700",
  },
  blue: {
    bar: "from-sky-400 to-blue-500",
    pill: "bg-sky-100 text-sky-700",
  },
  pink: {
    bar: "from-pink-400 to-rose-400",
    pill: "bg-pink-100 text-pink-700",
  },
  red: {
    bar: "from-rose-400 to-red-500",
    pill: "bg-rose-100 text-rose-700",
  },
};

const StatCard = ({
  title,
  value,
  subtitle,
  progress,
  variant,
}: StatCardProps) => {
  const v = variantClasses[variant];
  return (
    
    <div className="glass-card flex flex-col gap-2">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-400">
            {title}
          </div>
          <div className="mt-1 text-lg font-semibold text-slate-900">
            {value}
          </div>
        </div>
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-medium ${v.pill}`}
        >
          {subtitle}
        </span>
      </div>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${v.bar} transition-all`}
          style={{ width: `${Math.max(6, Math.min(progress * 100, 100))}%` }}
        />
      </div>
    </div>
  );
};
