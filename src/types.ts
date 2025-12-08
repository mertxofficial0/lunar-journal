export type Trade = {
  id: number;
  date: string;
  pair: string;
  direction: "Long" | "Short";
  session: string;
  strategy: string;
  risk: number;
  resultR: number;
  resultUsd: number;

  // 🔹 Yeni alanlar (hepsi opsiyonel)
  setupTag?: string; // ör: "FVG", "Sweep", "Breakout"
  mood?: "Calm" | "Focused" | "Tilted" | "Revenge" | "Fearful";
  screenshotUrl?: string;
  notes?: string;
};
