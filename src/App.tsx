import "./App.css";
import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";

import SplashScreen from "./components/SplashScreen";
import LoginScreen from "./components/LoginScreen";
import { Sidebar } from "./components/Sidebar";
import { DashboardView } from "./components/DashboardView";
import JournalView from "./components/JournalView";

import type { Trade } from "./types";
import { getTrades, addTrade, deleteTrade } from "./lib/trades";
import { supabase } from "./lib/supabase";

/* =========================
   ✅ DB → UI SAFE MAPPER
========================= */
const mapDbTradeToTrade = (db: any): Trade => ({
  id: db.id,
  date: db.date,
  pair: db.pair,
  direction: db.direction,
  session: db.session,
  strategy: db.strategy,
  risk: Number(db.risk),
  resultUsd: Number(db.result_usd),
  resultR: Number(db.result_r),
  setupTag: db.setup_tag ?? undefined,
  mood: db.mood ?? undefined,
  screenshotUrl: db.screenshot_url ?? undefined,
  notes: db.notes ?? undefined,
});

function App() {
  const [stage, setStage] = useState<"splash" | "login" | "app">("splash");
  const [page, setPage] = useState<"dashboard" | "journal">("dashboard");

  const [preloadDashboard, setPreloadDashboard] = useState(false);
  const [dashboardVisible, setDashboardVisible] = useState(false);
  const [dashboardReady, setDashboardReady] = useState(false);

  const dashScrollRef = useRef<HTMLDivElement>(null);
  const journalScrollRef = useRef<HTMLDivElement>(null);

  const [trades, setTrades] = useState<Trade[]>([]);

  /* =========================
     ✅ INITIAL LOAD (DB)
  ========================= */
  useEffect(() => {
    getTrades()
      .then(setTrades)
      .catch(console.error);
  }, []);

  /* =========================
     ✅ REALTIME SYNC
  ========================= */
  useEffect(() => {
    const channel = supabase
      .channel("trades-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "trades" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setTrades((prev) => [
              mapDbTradeToTrade(payload.new),
              ...prev,
            ]);
          }

          if (payload.eventType === "UPDATE") {
            setTrades((prev) =>
              prev.map((t) =>
                t.id === payload.new.id
                  ? mapDbTradeToTrade(payload.new)
                  : t
              )
            );
          }

          if (payload.eventType === "DELETE") {
            setTrades((prev) =>
              prev.filter((t) => t.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  /* =========================
     ✅ ADD / DELETE
  ========================= */
  const handleAddTrade = useCallback(
    async (t: Omit<Trade, "id">) => {
      await addTrade(t); // realtime ekleyecek
    },
    []
  );

  const handleDeleteTrade = useCallback(
    async (id: string) => {
      await deleteTrade(id); // realtime silecek
    },
    []
  );

  /* =========================
     ✅ STATS (SAFE)
  ========================= */
  const stats = useMemo(() => {
    const total = trades.length;
    const wins = trades.filter((t) => t.resultUsd > 0).length;
    const losses = trades.filter((t) => t.resultUsd < 0).length;
    const totalUsd = trades.reduce((a, b) => a + b.resultUsd, 0);
    const totalR = trades.reduce((a, b) => a + b.resultR, 0);

    return {
      total,
      wins,
      losses,
      totalUsd,
      totalR,
      winrate: total ? (wins / total) * 100 : 0,
      avgR: total ? totalR / total : 0,
      profitFactor:
        losses === 0
          ? wins
          : Math.abs(
              trades
                .filter((t) => t.resultUsd > 0)
                .reduce((a, b) => a + b.resultUsd, 0) /
                trades
                  .filter((t) => t.resultUsd < 0)
                  .reduce((a, b) => a + b.resultUsd, 0)
            ),
    };
  }, [trades]);

  /* =========================
     UI FLOW (AYNI)
  ========================= */
  useEffect(() => {
    const t = setTimeout(() => setStage("login"), 4000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (stage === "login") {
      const t = setTimeout(() => {
        setPreloadDashboard(true);
        setDashboardReady(true);
      }, 150);
      return () => clearTimeout(t);
    } else {
      setPreloadDashboard(false);
      setDashboardReady(false);
    }
  }, [stage]);

  useEffect(() => {
    if (stage === "app") {
      setDashboardVisible(false);
      const t = setTimeout(() => setDashboardVisible(true), 30);
      return () => clearTimeout(t);
    } else {
      setDashboardVisible(false);
    }
  }, [stage]);

  useEffect(() => {
    if (page === "dashboard" && dashScrollRef.current) {
      dashScrollRef.current.scrollTop = 0;
    }
    if (page === "journal" && journalScrollRef.current) {
      journalScrollRef.current.scrollTop = 0;
    }
  }, [page]);

  const handleLogout = () => {
    document.body.classList.add("logout-fade");
    setTimeout(() => {
      setStage("login");
      document.body.classList.remove("logout-fade");
    }, 1500);
  };

  if (stage === "splash") return <SplashScreen />;

  if (stage === "login") {
    return (
      <>
        <LoginScreen
          onSuccess={() => setStage("app")}
          dashboardReady={dashboardReady}
        />

        {preloadDashboard && (
          <div className="opacity-0 pointer-events-none absolute inset-0 h-0 overflow-hidden">
            <Sidebar current={page} onChange={() => {}} onLogout={() => {}} />
            <DashboardView trades={trades} stats={stats} />
            <JournalView
              trades={trades}
              stats={stats}
              onAddTrade={handleAddTrade}
              onDeleteTrade={handleDeleteTrade}
            />
          </div>
        )}
      </>
    );
  }

  const showDashboard = stage === "app" || preloadDashboard;

  return (
    <div
      className={`
        ${dashboardVisible ? "app-screen-enter" : "opacity-0"}
        flex h-screen w-screen overflow-hidden px-6 py-6 gap-6
        bg-gradient-to-br from-[#eef2ff] via-[#f5f3ff] to-[#ffe4f5]
      `}
    >
      <Sidebar current={page} onChange={setPage} onLogout={handleLogout} />

      <main className="flex-1 overflow-hidden rounded-[32px] bg-white/12 backdrop-blur-xl border border-white/35 shadow-[0_12px_30px_rgba(15,23,42,0.30)] p-8 relative">
        {showDashboard && (
          <div
            ref={dashScrollRef}
            className={`absolute inset-0 overflow-y-auto transition-all duration-200 ${
              page === "dashboard"
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            }`}
          >
            <DashboardView trades={trades} stats={stats} />
          </div>
        )}

        {showDashboard && (
          <div
            ref={journalScrollRef}
            className={`absolute inset-0 overflow-y-auto transition-all duration-200 ${
              page === "journal"
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            }`}
          >
            <JournalView
              trades={trades}
              stats={stats}
              onAddTrade={handleAddTrade}
              onDeleteTrade={handleDeleteTrade}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default React.memo(App);
