import "./App.css";
import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";

import SplashScreen from "./components/SplashScreen";
import LoginScreen from "./components/LoginScreen";
import { Sidebar } from "./components/Sidebar";
import { DashboardView } from "./components/DashboardView";
import JournalView from "./components/JournalView";
import type { Trade } from "./types";

function App() {
  const [stage, setStage] = useState<"splash" | "login" | "app">("splash");
  const [page, setPage] = useState<"dashboard" | "journal">("dashboard");

  const [preloadDashboard, setPreloadDashboard] = useState(false);
  const [dashboardVisible, setDashboardVisible] = useState(false);
  const [dashboardReady, setDashboardReady] = useState(false);

  // ⭐ Artık her sayfanın kendi scroll container’ı var
  const dashScrollRef = useRef<HTMLDivElement>(null);
  const journalScrollRef = useRef<HTMLDivElement>(null);

  // DEMO TRADES
  const [trades, setTrades] = useState<Trade[]>([
    {
      id: 1,
      date: "2025-12-01",
      pair: "EURUSD",
      direction: "Long",
      session: "London",
      strategy: "FVG",
      risk: 50,
      resultR: 2,
      resultUsd: 100,
    },
    {
      id: 2,
      date: "2025-12-02",
      pair: "GBPUSD",
      direction: "Short",
      session: "NY",
      strategy: "Breakout",
      risk: 50,
      resultR: -1,
      resultUsd: -50,
    },
  ]);

  const handleAddTrade = useCallback((t: Omit<Trade, "id">) => {
    setTrades((prev) => [...prev, { id: Date.now(), ...t }]);
  }, []);

  const handleDeleteTrade = useCallback((id: number) => {
    setTrades((prev) => prev.filter((x) => x.id !== id));
  }, []);

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

  // SPLASH → LOGIN
  useEffect(() => {
    const t = setTimeout(() => setStage("login"), 4000);
    return () => clearTimeout(t);
  }, []);

  // LOGIN aşamasında dashboard + journal preload
  useEffect(() => {
    if (stage === "login") {
      const t = setTimeout(() => {
        setPreloadDashboard(true);
        setDashboardReady(true); // login ekranına "hazır" sinyali
      }, 150);
      return () => clearTimeout(t);
    } else {
      setPreloadDashboard(false);
      setDashboardReady(false);
    }
  }, [stage]);

  // APP görünür animasyonu
  useEffect(() => {
    if (stage === "app") {
      setDashboardVisible(false);
      const t = setTimeout(() => setDashboardVisible(true), 30);
      return () => clearTimeout(t);
    } else {
      setDashboardVisible(false);
    }
  }, [stage]);

  // ⭐ SCROLL RESET — her sayfanın kendi scroll kabı, reset görünmüyor
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

  // === SPLASH
  if (stage === "splash") return <SplashScreen />;

  // === LOGIN + preload
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
            <div className="overflow-y-auto">
              <DashboardView trades={trades} stats={stats} />
              <JournalView
                trades={trades}
                stats={stats}
                onAddTrade={handleAddTrade}
                onDeleteTrade={handleDeleteTrade}
              />
            </div>
          </div>
        )}
      </>
    );
  }

  // === APP
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

      {/* ⭐ Artık main scroll DEĞİL, içindeki view div’leri scroll oluyor */}
      <main
        className="
          flex-1 overflow-hidden
          rounded-[32px]
          bg-white/12 backdrop-blur-xl
          border border-white/35 shadow-[0_12px_30px_rgba(15,23,42,0.30)]
          p-8 relative
        "
      >
        {/* DASHBOARD VIEW */}
        {showDashboard && (
          <div
            ref={dashScrollRef}
            className={`
              absolute inset-0
              overflow-y-auto
              transition-all duration-200
              ${
                page === "dashboard"
                  ? "opacity-100 translate-y-0 pointer-events-auto"
                  : "opacity-0 translate-y-2 pointer-events-none"
              }
            `}
          >
            <DashboardView trades={trades} stats={stats} />
          </div>
        )}

        {/* JOURNAL VIEW */}
        {showDashboard && (
          <div
            ref={journalScrollRef}
            className={`
              absolute inset-0
              overflow-y-auto
              transition-all duration-200
              ${
                page === "journal"
                  ? "opacity-100 translate-y-0 pointer-events-auto"
                  : "opacity-0 translate-y-2 pointer-events-none"
              }
            `}
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
