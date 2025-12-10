import "./App.css";
import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";

import Landing from "./components/Landing";
import LoginScreen from "./components/LoginScreen";
import { Sidebar } from "./components/Sidebar";
import { DashboardView } from "./components/DashboardView";
import JournalView from "./components/JournalView";
import type { Session, User } from "@supabase/supabase-js";
import type { Trade, NewTrade } from "./types";
import { getTrades, addTrade, deleteTrade } from "./lib/trades";
import { supabase } from "./lib/supabase";

/* DB → UI MAPPER */
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
  user_id: db.user_id, // artık tip güvenli
});

function App() {
  const [stage, setStage] = useState<"landing" | "login" | "app">("login");
  const [loginMode, setLoginMode] = useState<"login" | "register">("login");
  const [page, setPage] = useState<"dashboard" | "journal">("dashboard");

  // AUTH STATE
  const [_session, _setSession] = useState<Session | null>(null); // unused warnings bastırıldı
  const [user, setUser] = useState<User | null>(null);
  const [_authReady, _setAuthReady] = useState(false); // unused warnings bastırıldı

  /* Safe async useEffect for session */
  useEffect(() => {
  const fetchSession = async () => {
    const { data } = await supabase.auth.getSession();
    _setSession(data.session);
    setUser(data.session?.user ?? null);
    setStage(data.session ? "app" : "landing");
  };

  fetchSession();

  const { data: listener } = supabase.auth.onAuthStateChange(
    (_event, session) => {
      _setSession(session);
      setUser(session?.user ?? null);
      setStage(session ? "app" : "landing");
    }
  );

  return () => {
    listener.subscription.unsubscribe();
  };
}, []);



  const [preloadDashboard, setPreloadDashboard] = useState(false);
  const [dashboardVisible, setDashboardVisible] = useState(false);
  const [dashboardReady, setDashboardReady] = useState(false);

  const dashScrollRef = useRef<HTMLDivElement>(null);
  const journalScrollRef = useRef<HTMLDivElement>(null);

  const [trades, setTrades] = useState<Trade[]>([]);

  /* INITIAL LOAD USER BAZLI */
  useEffect(() => {
    if (!user) return;
    const fetchTrades = async () => {
      const userTrades = await getTrades(user.id);
      setTrades(userTrades);
    };
    fetchTrades().catch(console.error);
  }, [user]);

  /* REALTIME SYNC USER BAZLI (tip güvenli) */
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("trades-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "trades" },
        (payload) => {
          const payloadNew = payload.new as Partial<Trade> & { user_id?: string };
          const payloadOld = payload.old as Partial<Trade>;

          if (!payloadNew.user_id || payloadNew.user_id !== user.id) return;

          if (payload.eventType === "INSERT")
            setTrades((prev) => [mapDbTradeToTrade(payloadNew), ...prev]);

          if (payload.eventType === "UPDATE")
            setTrades((prev) =>
              prev.map((t) => (t.id === payloadNew.id ? mapDbTradeToTrade(payloadNew) : t))
            );

          if (payload.eventType === "DELETE")
            setTrades((prev) => prev.filter((t) => t.id !== payloadOld.id));
        }
      )
      .subscribe();

    return () => {
  supabase.removeChannel(channel);
};

  }, [user]);

  /* ADD / DELETE */
const handleAddTrade = useCallback(
  async (t: NewTrade) => {
    if (!user) return;
    await addTrade({ ...t, user_id: user.id });
  },
  [user]
);

const handleDeleteTrade = useCallback(async (id: string) => {
  await deleteTrade(id);
}, []);


  /* STATS */
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
              trades.filter((t) => t.resultUsd > 0).reduce((a, b) => a + b.resultUsd, 0) /
                trades.filter((t) => t.resultUsd < 0).reduce((a, b) => a + b.resultUsd, 0)
            ),
    };
  }, [trades]);

  /* UI FLOW */
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
    } else setDashboardVisible(false);
  }, [stage]);

  useEffect(() => {
    if (page === "dashboard" && dashScrollRef.current) dashScrollRef.current.scrollTop = 0;
    if (page === "journal" && journalScrollRef.current) journalScrollRef.current.scrollTop = 0;
  }, [page]);

  /* LOGOUT */
  const handleLogout = async () => {
    try { await supabase.auth.signOut(); } catch (err) { console.error(err); }
    setUser(null);
    setStage("landing");
  };

  /* RENDER */
  if (stage === "landing")
    return <Landing onLogin={(mode) => { setLoginMode(mode ?? "login"); setStage("login"); }} />;

  if (stage === "login")
    return (
      <>
        <LoginScreen
          onSuccess={() => setStage("app")}
          dashboardReady={dashboardReady}
          initialMode={loginMode}
          onBack={() => setStage("landing")}
        />
        {preloadDashboard && (
          <div className="opacity-0 pointer-events-none absolute inset-0 h-0 overflow-hidden">
            <Sidebar current={page} onChange={() => {}} onLogout={() => {}} />
            <DashboardView trades={trades} stats={stats} />
            <JournalView trades={trades} stats={stats} onAddTrade={handleAddTrade} onDeleteTrade={handleDeleteTrade} />
          </div>
        )}
      </>
    );

  const showDashboard = stage === "app" || preloadDashboard;

  return (
    <div className={`${dashboardVisible ? "app-screen-enter" : "opacity-0"} flex h-screen w-screen overflow-hidden px-6 py-6 gap-6 bg-gradient-to-br from-[#eef2ff] via-[#f5f3ff] to-[#ffe4f5]`}>
      <Sidebar current={page} onChange={setPage} onLogout={handleLogout} />
      <main className="flex-1 overflow-hidden rounded-[32px] bg-white/12 backdrop-blur-xl border border-white/35 shadow-[0_12px_30px_rgba(15,23,42,0.30)] p-8 relative">
        {showDashboard && (
          <div ref={dashScrollRef} className={`absolute inset-0 overflow-y-auto transition-all duration-200 ${page === "dashboard" ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
            <DashboardView trades={trades} stats={stats} />
          </div>
        )}
        {showDashboard && (
          <div ref={journalScrollRef} className={`absolute inset-0 overflow-y-auto transition-all duration-200 ${page === "journal" ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
            <JournalView trades={trades} stats={stats} onAddTrade={handleAddTrade} onDeleteTrade={handleDeleteTrade} />
          </div>
        )}
      </main>
    </div>
  );
}

export default React.memo(App);
