import { useState, useEffect } from "react";
import NotesModal from "./ui/NotesModal";
import type { Trade } from "../types";
import Modal from "./ui/Modal";

type Props = {
  trade: Trade | null;
  onClose: () => void;
  onDelete: (id: number) => void;
};

export default function TradeDetailsModal({
  trade,
  onClose,
  onDelete,
}: Props) {
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const pnlPositive = trade ? trade.resultUsd >= 0 : false;

  useEffect(() => {
    setIsConfirmOpen(false);
  }, [trade]);

  // ✅ MOOD TYPE
  type Mood = "Calm" | "Focused" | "Tilted" | "Revenge" | "Fearful";

  // ✅ MOOD STYLE MAP (STRICT)
  const moodStyles: Record<Mood, string> = {
    Calm: "bg-indigo-100 text-indigo-700 shadow-[0_0_10px_rgba(129,140,248,0.45)]",
    Focused:
      "bg-emerald-100 text-emerald-700 shadow-[0_0_10px_rgba(16,185,129,0.45)]",
    Tilted:
      "bg-amber-100 text-amber-700 shadow-[0_0_10px_rgba(245,158,11,0.45)]",
    Revenge:
      "bg-rose-100 text-rose-700 shadow-[0_0_10px_rgba(244,63,94,0.45)]",
    Fearful:
      "bg-sky-100 text-sky-700 shadow-[0_0_10px_rgba(56,189,248,0.45)]",
  };

  // ✅ DEFAULT SAFE MOOD
  const moodKey: Mood = trade?.mood ?? "Calm";

  // -----------------------------------------
  // MODAL CLOSE
  // -----------------------------------------
  const handleClose = () => {
    setIsNotesOpen(false);
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  };

  // -----------------------------------------
  // DELETE CONFIRM
  // -----------------------------------------
  const confirmDelete = () => {
    if (!trade) return;

    setIsClosing(true);
    setTimeout(() => {
      onDelete(trade.id);
      setIsConfirmOpen(false);
      onClose();
      setIsClosing(false);
    }, 300);
  };

  return (
    <Modal
      isOpen={!!trade && !isClosing}
      onClose={handleClose}
      maxWidth="max-w-2xl"
    >
      {!trade ? null : (
        <>
          {/* HEADER */}
          <div className="rounded-2xl p-4 mb-4 bg-gradient-to-br from-indigo-500/20 via-purple-400/20 to-pink-400/20 border border-white/40 backdrop-blur-xl shadow-[0_18px_45px_rgba(0,0,0,0.1)] flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-slate-500">
                İşlem Özeti
              </div>
              <div className="flex items-center gap-2 mt-1">
                <h2 className="text-xl font-semibold text-slate-900">
                  {trade.pair}
                </h2>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    trade.direction === "Long"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-rose-100 text-rose-700"
                  }`}
                >
                  {trade.direction}
                </span>
              </div>
            </div>

            <div
              className={`px-4 py-2 rounded-2xl text-sm font-semibold backdrop-blur-xl border ${
                pnlPositive
                  ? "bg-emerald-100/70 text-emerald-700 border-emerald-200"
                  : "bg-rose-100/70 text-rose-700 border-rose-200"
              }`}
            >
              {trade.resultUsd.toFixed(2)} $
            </div>
          </div>

          {/* INFO */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="glass-card p-5">
              <Info label="Tarih" value={trade.date} />
              <Info label="Session" value={trade.session} />
              <Info label="Strategy" value={trade.strategy} />
              <Info label="Setup Tag" value={trade.setupTag ?? "-"} />
            </div>

            <div className="glass-card p-5">
              <Info label="Risk ($)" value={trade.risk} />
              <Info label="Result (R)" value={trade.resultR.toFixed(2)} />
              <Info
                label="P&L ($)"
                value={`${trade.resultUsd.toFixed(2)} $`}
                highlight={pnlPositive ? "green" : "red"}
              />

              {/* ✅ MOOD */}
              <div className="mt-4 flex items-center gap-3">
                <span
                  className={`px-3 py-1 text-xs rounded-full font-medium backdrop-blur-xl ${moodStyles[moodKey]}`}
                >
                  {moodKey}
                </span>

                {trade.notes && (
                  <button
                    onClick={() => setIsNotesOpen(true)}
                    className="px-4 py-1.5 rounded-full text-xs font-medium bg-indigo-500/20 text-indigo-700 backdrop-blur-xl transition"
                  >
                    Notları Gör
                  </button>
                )}
              </div>
            </div>
          </div>

          <NotesModal
            isOpen={isNotesOpen}
            onClose={() => setIsNotesOpen(false)}
            notes={trade.notes ?? ""}
          />

          {/* ACTIONS */}
          <div className="flex justify-end gap-3">
            {!isConfirmOpen ? (
              <button
                onClick={() => setIsConfirmOpen(true)}
                className="px-5 py-2 rounded-xl text-sm font-medium bg-rose-600 text-white"
              >
                Sil
              </button>
            ) : (
              <>
                <span className="text-sm">Emin misin?</span>
                <button onClick={confirmDelete}>Evet</button>
                <button onClick={() => setIsConfirmOpen(false)}>
                  Vazgeç
                </button>
              </>
            )}

            <button
              onClick={handleClose}
              className="px-6 py-2 rounded-xl text-sm bg-slate-200"
            >
              Kapat
            </button>
          </div>
        </>
      )}
    </Modal>
  );
}

/* INFO */
function Info({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string | number;
  highlight?: "green" | "red";
}) {
  const color =
    highlight === "green"
      ? "text-emerald-600 font-semibold"
      : highlight === "red"
      ? "text-rose-600 font-semibold"
      : "text-slate-700";

  return (
    <div className="flex justify-between py-1 text-sm">
      <span className="text-slate-500">{label}</span>
      <span className={color}>{value}</span>
    </div>
  );
}
