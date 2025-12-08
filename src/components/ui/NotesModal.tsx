import Modal from "./Modal";

export default function NotesModal({
  isOpen,
  onClose,
  notes,
}: {
  isOpen: boolean;
  onClose: () => void;
  notes: string;
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">Notlar</h2>

      {/* ⭐ Uzun notlarda otomatik satır kıran + taşma yapmayan kutu */}
      <div
        className="
          rounded-2xl p-4 
          bg-white/70 backdrop-blur-xl 
          border border-white/50 
          shadow-[0_12px_30px_rgba(0,0,0,0.08)]
          max-h-[260px] overflow-y-auto
        "
      >
        <p
          className="
            text-sm text-slate- 
            whitespace-pre-wrap 
            break-words 
            leading-relaxed
          "
        >
          {notes}
        </p>
      </div>

      <div className="flex justify-end mt-5">
        <button
          onClick={onClose}
          className="
            px-5 py-2 rounded-xl text-sm font-medium
            bg-slate-50 hover:bg-slate-200
            transition active:scale-95
          "
        >
          Kapat
        </button>
      </div>
    </Modal>
  );
}
