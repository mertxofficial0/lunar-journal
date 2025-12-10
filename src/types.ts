export type Trade = {
  id: string;
  date: string;
  pair: string;
  direction: "Long" | "Short";
  session: string;
  strategy: string;
  risk: number;
  resultR: number;
  resultUsd: number;

  setupTag?: string;
  mood?: "Calm" | "Focused" | "Tilted" | "Revenge" | "Fearful";
  screenshotUrl?: string;
  notes?: string;

  user_id: string;
};

export type NewTrade = Omit<Trade, "id" | "user_id">;
