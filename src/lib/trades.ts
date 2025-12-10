import { supabase } from "./supabase";
import type { Trade } from "../types";

// DB → UI (snake_case → camelCase)
const fromDb = (row: any): Trade => ({
  id: row.id,
  date: row.date,
  pair: row.pair,
  direction: row.direction,
  session: row.session,
  strategy: row.strategy,
  risk: Number(row.risk),
  resultR: Number(row.result_r),
  resultUsd: Number(row.result_usd),
  setupTag: row.setup_tag ?? undefined,
  mood: row.mood ?? undefined,
  screenshotUrl: row.screenshot_url ?? undefined,
  notes: row.notes ?? undefined,
  user_id: row.user_id ?? undefined, // ✅ opsiyonel user_id
});

// UI → DB (camelCase → snake_case)
const toDb = (trade: Omit<Trade, "id"> & { user_id?: string }) => ({
  user_id: trade.user_id ?? null,
  date: trade.date,
  pair: trade.pair,
  direction: trade.direction,
  session: trade.session,
  strategy: trade.strategy,
  risk: trade.risk,
  result_r: trade.resultR,
  result_usd: trade.resultUsd,
  setup_tag: trade.setupTag ?? null,
  mood: trade.mood ?? null,
  screenshot_url: trade.screenshotUrl ?? null,
  notes: trade.notes ?? null,
});

export async function getTrades(user_id: string): Promise<Trade[]> {
  const { data, error } = await supabase
    .from("trades")
    .select("*")
    .eq("user_id", user_id)
    .order("date", { ascending: true });

  if (error) throw error;
  return data.map(fromDb);
}

export async function addTrade(
  trade: Omit<Trade, "id"> & { user_id?: string }
): Promise<Trade> {
  const { data, error } = await supabase
    .from("trades")
    .insert(toDb(trade))
    .select()
    .single();

  if (error) throw error;
  return fromDb(data);
}

export async function deleteTrade(id: string): Promise<void> {
  const { error } = await supabase.from("trades").delete().eq("id", id);
  if (error) throw error;
}
