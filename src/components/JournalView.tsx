import { useState } from "react";
import type { Trade, NewTrade } from "../types";
import AddTradeForm from "./AddTradeForm";
import TradeDetailsModal from "./TradeDetailsModal";

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

type JournalProps = {
  trades: Trade[];
  stats: Stats;
  onAddTrade: (trade: NewTrade) => void;
  onDeleteTrade: (id: string) => void;
};


export default function JournalView({
  trades,
  stats,
  onAddTrade,
  onDeleteTrade,
}: JournalProps) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);

  return (
    <div className="flex-1 min-w-0 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
      <div className="mx-auto max-w-8xl space-y-6">
        
        {/* HEADER */}
        <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              Daily Journal
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Her işlemini kaydet, istatistikleri bu ekranda kontrol et.
            </p>
          </div>

          <button
            onClick={() => setIsAddOpen(true)}
            className="
              inline-flex items-center gap-2
              rounded-full px-5 py-2.5
              bg-gradient-to-r from-indigo-500 to-violet-500
              text-white text-sm font-medium
              shadow-[0_18px_40px_rgba(79,70,229,0.55)]
              hover:shadow-[0_20px_50px_rgba(79,70,229,0.7)]
              active:scale-[0.97]
              transition
            "
          >
            <span className="text-base leading-none">＋</span>
            Yeni İşlem Ekle
          </button>
        </header>

        {/* SUMMARY CARDS */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard label="Toplam İşlem" value={stats.total.toString()} />

          <SummaryCard
            label="Winrate"
            value={`${stats.winrate.toFixed(1)}%`}
            sub={`${stats.wins} win / ${stats.losses} loss`}
          />

          <SummaryCard
            label="Toplam P&L"
            value={`${stats.totalUsd.toFixed(2)} $`}
            highlight={stats.totalUsd >= 0 ? "positive" : "negative"}
          />

          <SummaryCard
            label="Avg R / Trade"
            value={stats.avgR.toFixed(2)}
            sub={`${stats.totalR.toFixed(2)}R total`}
          />
        </section>

        {/* TRADE LIST */}
        <section className="glass-card rounded-3xl p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-800">İşlem Listesi</h2>
            <span className="text-xs text-slate-400">{trades.length} trade kayıtlı</span>
          </div>

          <div className="overflow-x-auto -mx-3 sm:mx-0">
            <table className="min-w-full text-sm text-left">
              <thead>
                <tr className="text-xs uppercase tracking-[0.16em] text-slate-400">
                  <th className="px-3 py-2 font-medium">Tarih</th>
                  <th className="px-3 py-2 font-medium">Pair</th>
                  <th className="px-3 py-2 font-medium">Dir</th>
                  <th className="px-3 py-2 font-medium">Session</th>
                  <th className="px-3 py-2 font-medium">Strategy</th>
                  <th className="px-3 py-2 font-medium">Risk ($)</th>
                  <th className="px-3 py-2 font-medium">R</th>
                  <th className="px-3 py-2 font-medium">P&L ($)</th>
                  <th className="px-3 py-2 font-medium text-right">Detay</th>
                </tr>
              </thead>

              <tbody>
                {trades
                  .slice()
                  .sort((a, b) => a.date.localeCompare(b.date))
                  .map((t) => (
                    <tr
                      key={t.id}
                      className="border-t border-slate-100/70 last:border-b hover:bg-slate-50/60 transition"
                    >
                      <td className="px-3 py-2 text-slate-600">{t.date}</td>
                      <td className="px-3 py-2">{t.pair}</td>

                      <td className="px-3 py-2">
                        <span
                          className={`
                            inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium
                            ${
                              t.direction === "Long"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-rose-100 text-rose-700"
                            }
                          `}
                        >
                          {t.direction}
                        </span>
                      </td>

                      <td className="px-3 py-2 text-slate-500">{t.session}</td>
                      <td className="px-3 py-2 text-slate-500">{t.strategy}</td>
                      <td className="px-3 py-2 text-slate-600">{t.risk}</td>
                      <td className="px-3 py-2 text-slate-600">{t.resultR.toFixed(2)}</td>

                      <td
                        className={`px-3 py-2 font-medium ${
                          t.resultUsd >= 0 ? "text-emerald-500" : "text-rose-500"
                        }`}
                      >
                        {t.resultUsd.toFixed(2)}
                      </td>

                      {/* DETAY BUTONU */}
                      <td className="px-3 py-2 text-right">
                        <button
                          onClick={() => setSelectedTrade(t)}
                          className="
                            px-4 py-1.5 rounded-full text-xs font-medium
                            bg-gradient-to-r from-indigo-500 to-violet-500
                            text-white
                            shadow-sm shadow-indigo-300/20
                            hover:shadow-[0_10px_24px_rgba(79,70,229,0.45)]
                            active:scale-95 transition-all
                          "
                        >
                          Detay
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* MODALS */}
        <AddTradeForm
          isOpen={isAddOpen}
          onClose={() => setIsAddOpen(false)}
          onAdd={onAddTrade}
        />

        {/* ⭐ Silme mantığının doğru çalıştığı yer */}
        <TradeDetailsModal
          trade={selectedTrade}
          onClose={() => setSelectedTrade(null)}
          onDelete={(id) => {
            onDeleteTrade(id);     // Listeyi güncelle
            setSelectedTrade(null); // Modal kapansın
          }}
        />
      </div>
    </div>
  );
}

/* SUMMARY CARD */
function SummaryCard({
  label,
  value,
  sub,
  highlight,
}: {
  label: string;
  value: string;
  sub?: string;
  highlight?: "positive" | "negative";
}) {
  const cls =
    highlight === "positive"
      ? "text-emerald-500"
      : highlight === "negative"
      ? "text-rose-500"
      : "text-slate-900";

  return (
    <div className="glass-card rounded-3xl p-4 flex flex-col gap-1">
      <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-400">
        {label}
      </span>

      <span className={`text-lg font-semibold ${cls}`}>{value}</span>

      {sub && <span className="text-xs text-slate-400">{sub}</span>}
    </div>
  );
}
