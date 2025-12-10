import CustomSelect from "./ui/CustomSelect";
import SegmentedDirection from "./ui/SegmentedDirection";
import { useState } from "react";
import Modal from "./ui/Modal";
import Input from "./ui/Input";
import DateInput from "./ui/DateInput";
import TextArea from "./ui/TextArea";
import type { Trade, NewTrade } from "../types";


type AddTradeFormProps = {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (trade: NewTrade) => void;
};


export default function AddTradeForm({ isOpen, onClose, onAdd }: AddTradeFormProps) {
  // FORM STATE
  const [date, setDate] = useState("");
  const [pair, setPair] = useState("EURUSD");
  const [direction, setDirection] = useState<"Long" | "Short">("Long");
  const [session, setSession] = useState("London");
  const [strategy, setStrategy] = useState("FVG");
  const [risk, setRisk] = useState<number>(50);
  const [resultUsd, setResultUsd] = useState<number>(0);
  const [resultR, setResultR] = useState<number>(0);

  // Yeni alanlar:
  const [setupTag, setSetupTag] = useState("FVG");
  const [mood, setMood] = useState<Trade["mood"]>("Calm");
  const [screenshotUrl, setScreenshotUrl] = useState("");
  const [notes, setNotes] = useState("");
    


  const reset = () => {
    setDate("");
    setPair("EURUSD");
    setDirection("Long");
    setSession("London");
    setStrategy("FVG");
    setRisk(50);
    setResultUsd(0);
    setResultR(0);
    setSetupTag("FVG");
    setMood("Calm");
    setScreenshotUrl("");
    setNotes("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!date) return;

    onAdd({
  date,
  pair,
  direction,
  session,
  strategy,
  risk,
  resultUsd,
  resultR,
  setupTag,
  mood,
  screenshotUrl,
  notes,
});



    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-xl">
      <h2 className="text-xl font-semibold text-slate-900 mb-6">
        Yeni İşlem Ekle
      </h2>

      <form className="space-y-5" onSubmit={handleSubmit}>
        {/* Tarih + Pair */}
        <div className="grid grid-cols-2 gap-4">
  <DateInput label="Tarih" value={date} onChange={setDate} />
  <Input
    label="Pair"
    value={pair}
    onChange={(v) => setPair(v.toUpperCase())}
    placeholder="EURUSD"
  />
</div>

        {/* Direction - Session - Strategy */}
        <div className="grid grid-cols-3 gap-4">
          <SegmentedDirection value={direction} onChange={setDirection} />

          <Input label="Session" value={session} onChange={setSession} />
          <Input label="Strategy" value={strategy} onChange={setStrategy} />
        </div>

        {/* Risk / P&L / R */}
        <div className="grid grid-cols-3 gap-4">
          <Input
            label="Risk ($)"
            type="number"
            value={risk}
            onChange={(v) => setRisk(Number(v))}
          />
          <Input
            label="Result ($)"
            type="number"
            value={resultUsd}
            onChange={(v) => setResultUsd(Number(v))}
          />
          <Input
            label="Result (R)"
            type="number"
            value={resultR}
            onChange={(v) => setResultR(Number(v))}
          />
        </div>

        {/* SetupTag + Mood */}
<div className="grid grid-cols-2 gap-4">
  <Input
    label="Setup Tag"
    value={setupTag}
    onChange={setSetupTag}
    placeholder="FVG, BOS, CHoCH..."
  />

  <CustomSelect
    label="Mood"
    value={mood ?? "Calm"}
    options={["Calm", "Focused", "Tilted", "Revenge", "Fearful"]}
    onChange={(v) => setMood(v as Trade["mood"])}
  />
</div>


        {/* Screenshot + Notes */}
        <Input
          label="Screenshot URL"
          value={screenshotUrl}
          onChange={setScreenshotUrl}
          placeholder="https://..."
        />

        <TextArea
          label="Notes"
          value={notes}
          onChange={setNotes}
          placeholder="İşlem hakkında kısa notlar..."
        />

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              reset();
              onClose();
            }}
            className="
              px-4 py-2 rounded-xl text-sm
              bg-slate-100 text-slate-600 hover:bg-slate-200
            "
          >
            İptal
          </button>

          <button
            type="submit"
            className="
              px-5 py-2 rounded-xl text-sm font-medium
              bg-indigo-500 text-white
              hover:bg-indigo-600
              shadow-[0_12px_30px_rgba(79,70,229,0.6)]
            "
          >
            Kaydet
          </button>
        </div>
      </form>
    </Modal>
  );
}
