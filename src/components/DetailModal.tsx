import { useEffect } from "react";
import type { Trade } from "../types";

type Props = {
  trade: Trade | null;
  onClose: () => void;
};

export default function DetailModal({ trade, onClose }: Props) {
  if (!trade) return null;

  // ESC ile kapatma
  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, []);

  return (
    <div
      className="
        fixed inset-0 z-[99999]
        flex items-center justify-center
        bg-slate-900/40 backdrop-blur-md
        transition-all duration-200
        opacity-100
      "
      onClick={onClose}
    >
      <div
        className="
          glass-card relative w-full max-w-2xl
          rounded-3xl p-7
          shadow-[0_24px_70px_rgba(15,23,42,0.55)]
          transform transition-all duration-200 scale-100
        "
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold text-slate-900 mb-6">
          İşlem Detayları
        </h2>

        <div className="space-y-2 text-slate-700 text-sm">
          <p><b>Tarih:</b> {trade.date}</p>
          <p><b>Pair:</b> {trade.pair}</p>
          <p><b>Direction:</b> {trade.direction}</p>
          <p><b>Session:</b> {trade.session}</p>
          <p><b>Strategy:</b> {trade.strategy}</p>
          <p><b>Risk:</b> ${trade.risk}</p>
          <p><b>Result R:</b> {trade.resultR}</p>
          <p><b>Result USD:</b> ${trade.resultUsd}</p>
          <p><b>Setup Tag:</b> {trade.setupTag}</p>
          <p><b>Mood:</b> {trade.mood}</p>

          {trade.screenshotUrl && (
            <p>
              <b>Screenshot:</b>{" "}
              <a
                className="text-violet-600 underline"
                href={trade.screenshotUrl}
                target="_blank"
              >
                Görseli Aç
              </a>
            </p>
          )}

          {trade.notes && (
            <p><b>Notlar:</b> {trade.notes}</p>
          )}
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="
              px-5 py-2 rounded-xl text-sm font-medium
              bg-slate-200 text-slate-700 hover:bg-slate-300
              transition
            "
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
}
