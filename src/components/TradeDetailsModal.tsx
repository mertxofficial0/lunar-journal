
import React, { useState, useEffect } from "react";
import NotesModal from "./ui/NotesModal";
import type { Trade } from "../types";
import Modal from "./ui/Modal";

export default function TradeDetailsModal({
  trade,
  onClose,
  onDelete
}: {
  trade: Trade | null;
  onClose: () => void;
  onDelete: (id: number) => void;
}) {
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  

  const pnlPositive = trade ? trade.resultUsd >= 0 : false;
  

  useEffect(() => {
  setIsConfirmOpen(false);
}, [trade]);


  // ⭐ MOOD RENK HARİTASI
  const moodStyles: Record<string, string> = {
    Calm: `bg-indigo-100 text-indigo-700 shadow-[0_0_10px_rgba(129,140,248,0.45)]`,
    Focused: `bg-emerald-100 text-emerald-700 shadow-[0_0_10px_rgba(16,185,129,0.45)]`,
    Tilted: `bg-amber-100 text-amber-700 shadow-[0_0_10px_rgba(245,158,11,0.45)]`,
    Revenge: `bg-rose-100 text-rose-700 shadow-[0_0_10px_rgba(244,63,94,0.45)]`,
    Fearful: `bg-sky-100 text-sky-700 shadow-[0_0_10px_rgba(56,189,248,0.45)]`,
  };

  // -----------------------------------------
  //  MODAL KAPANIŞ ANİMASYONU
  // -----------------------------------------
  const handleClose = () => {
    setIsNotesOpen(false);
    setIsClosing(true);

    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300); // Modal.tsx duration ile aynı
  };

  // -----------------------------------------
  //  SİLME ONAY → ANİMASYON → SİL → KAPAT
  // -----------------------------------------
  const confirmDelete = () => {
    if (!trade) return;

    setIsClosing(true); // önce kapanış animasyonu başlasın

    setTimeout(() => {
      onDelete(trade.id);     // trade listeden sil
      setIsConfirmOpen(false); 
      onClose();               // modal tamamen kapat
      setIsClosing(false);
    }, 300); // aç-kapa animasyon süresi
  };

  return (
    <>
      {/* ----------------------------- */}
      {/* TRADE DETAILS MODAL */}
      {/* ----------------------------- */}
      <Modal
        isOpen={!!trade && !isClosing}
  // ⭐ trade silinse bile animasyon oynar
        onClose={handleClose}
        maxWidth="max-w-2xl"
      >
        {!trade ? null : (
          <>
            {/* HEADER */}
            <div
              className="
                rounded-2xl p-4 mb-4
                bg-gradient-to-br from-indigo-500/20 via-purple-400/20 to-pink-400/20
                border border-white/40 backdrop-blur-xl
                shadow-[0_18px_45px_rgba(0,0,0,0.1)]
                flex items-center justify-between
              "
            >
              <div>
                <div className="text-xs uppercase tracking-wider text-slate-500">
                  İşlem Özeti
                </div>

                <div className="flex items-center gap-2 mt-1">
                  <h2 className="text-xl font-semibold text-slate-900">
                    {trade.pair}
                  </h2>

                  <span
                    className={`
                      px-2 py-0.5 rounded-full text-xs font-medium
                      ${
                        trade.direction === "Long"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-rose-100 text-rose-700"
                      }
                    `}
                  >
                    {trade.direction}
                  </span>
                </div>
              </div>

              <div
                className={`
                  px-4 py-2 rounded-2xl text-sm font-semibold shadow-sm
                  backdrop-blur-xl border
                  ${
                    pnlPositive
                      ? "bg-emerald-100/70 text-emerald-700 border-emerald-200"
                      : "bg-rose-100/70 text-rose-700 border-rose-200"
                  }
                `}
              >
                {trade.resultUsd.toFixed(2)} $
              </div>
            </div>

            {/* INFO GRID */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              {/* LEFT */}
              <div className="glass-card p-5">
                <h3 className="text-sm font-semibold text-slate-700 mb-3">
                  Trade Bilgileri
                </h3>

                <Info label="Tarih" value={trade.date} />
                <Info label="Session" value={trade.session} />
                <Info label="Strategy" value={trade.strategy} />
                <Info label="Setup Tag" value={trade.setupTag} />
              </div>

              {/* RIGHT */}
              <div className="glass-card p-5">
                <h3 className="text-sm font-semibold text-slate-700 mb-3">
                  Performans
                </h3>

                <Info label="Risk ($)" value={trade.risk} />
                <Info label="Result (R)" value={trade.resultR.toFixed(2)} />
                <Info
                  label="P&L ($)"
                  value={`${trade.resultUsd.toFixed(2)} $`}
                  highlight={pnlPositive ? "green" : "red"}
                />

                {/* Mood + Notes */}
                <div className="mt-4 flex items-center gap-3">
                  <span
                    className={`
                      px-3 py-1 text-xs rounded-full font-medium
                      backdrop-blur-xl transition
                      ${moodStyles[trade.mood] || moodStyles["Calm"]}
                    `}
                  >
                    {trade.mood}
                  </span>

                  {trade.notes && (
                    <button
                      onClick={() => setIsNotesOpen(true)}
                      className="
                        px-4 py-1.5 rounded-full text-xs font-medium
                        bg-indigo-500/20 text-indigo-700
                        shadow-[0_0_12px_rgba(129,140,248,0.35)]
                        backdrop-blur-xl
                        hover:bg-indigo-500/30 hover:shadow-[0_0_18px_rgba(129,140,248,0.55)]
                        transition active:scale-95
                      "
                    >
                      Notları Gör
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* SCREENSHOT */}
            {trade.screenshotUrl && (
              <div className="glass-card p-4 mb-4">
                <h3 className="text-sm font-semibold text-slate-700 mb-3">
                  Screenshot
                </h3>

                <div className="max-h-[420px] overflow-auto rounded-xl">
                  <a
  href={trade.screenshotUrl}
  target="_blank"
  rel="noopener noreferrer"
>
  <img
    src={trade.screenshotUrl}
    alt="trade screenshot"
    className="
      w-full object-contain rounded-xl cursor-pointer
      shadow-[0_12px_30px_rgba(0,0,0,0.12)]
      transition hover:scale-[1.01] hover:shadow-[0_18px_45px_rgba(0,0,0,0.16)]
    "
  />
</a>

                </div>
              </div>
            )}

            {/* NOTES MODAL */}
            <NotesModal
              isOpen={isNotesOpen}
              onClose={() => setIsNotesOpen(false)}
              notes={trade.notes ?? ""}
            />

            

            {/* ACTION BUTTONS */}
            <div className="flex justify-end gap-3">
              {/* DELETE BUTTON */}
{!isConfirmOpen ? (
  <button
    onClick={() => setIsConfirmOpen(true)}
    className="
      px-5 py-2 rounded-xl text-sm font-medium
      bg-rose-600 text-white
      shadow-[0_0_12px_rgba(244,63,94,0.45)]
      hover:bg-rose-700 hover:shadow-[0_0_18px_rgba(244,63,94,0.65)]
      backdrop-blur-xl transition active:scale-95
    "
  >
    Sil
  </button>
) : (
  <div
    className="
      flex items-center gap-3
      animate-softConfirm
    "
  >
    <span className="text-sm text-slate-600">Emin misin?</span>

    <button
      onClick={confirmDelete}
      className="
        px-4 py-1.5 rounded-lg text-sm font-medium
        bg-rose-600 text-white
        shadow-[0_0_8px_rgba(244,63,94,0.35)]
        hover:bg-rose-700 hover:shadow-[0_0_12px_rgba(244,63,94,0.55)]
        transition active:scale-95
      "
    >
      Evet
    </button>

    <button
      onClick={() => setIsConfirmOpen(false)}
      className="
        px-4 py-1.5 rounded-lg text-sm font-medium
        bg-slate-200 text-slate-700
        hover:bg-slate-300 transition active:scale-95
      "
    >
      Vazgeç
    </button>
  </div>
)}



              {/* CLOSE BUTTON */}
              <button
                onClick={handleClose}
                className="
                  px-6 py-2 rounded-xl text-sm font-medium
                  bg-slate-100 hover:bg-slate-300
                  transition shadow-sm active:scale-95
                "
              >
                Kapat
              </button>
            </div>
          </>
        )}
      </Modal>
    </>
  );
}

/* INFO COMPONENT */
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
