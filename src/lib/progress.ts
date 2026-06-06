import { ITEMS, TOTAL_ITEMS, type Rarity, type Tier } from "./items";

const K_DISCOVERED = "ecocraft_discovered";
const K_POINTS = "ecocraft_eco_points";
const K_BEST = "ecocraft_best_session";
const K_FIRST = "ecocraft_first_visit";
const K_TUT = "ecocraft_tutorial_seen";

export type Progress = {
  discovered: string[];
  ecoPoints: number;
  bestSession: number;
  byTier: Record<Tier, { found: number; total: number }>;
  byRarity: Record<Rarity, number>;
  percent: number;
};

function safeGet(key: string): string | null {
  if (typeof window === "undefined") return null;
  try { return window.localStorage.getItem(key); } catch { return null; }
}
function safeSet(key: string, value: string) {
  if (typeof window === "undefined") return;
  try { window.localStorage.setItem(key, value); } catch { /* ignore */ }
}
function safeRemove(key: string) {
  if (typeof window === "undefined") return;
  try { window.localStorage.removeItem(key); } catch { /* ignore */ }
}

export function loadProgress(): Progress {
  let discovered: string[] = [];
  try {
    const raw = safeGet(K_DISCOVERED);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) discovered = parsed.filter((id) => typeof id === "string" && ITEMS[id]);
    }
  } catch { /* ignore */ }

  const ecoPoints = Number(safeGet(K_POINTS) || "0") || 0;
  const bestSession = Number(safeGet(K_BEST) || "0") || 0;

  const byTier: Progress["byTier"] = {
    primary: { found: 0, total: 0 },
    intermediate: { found: 0, total: 0 },
    advanced: { found: 0, total: 0 },
  };
  const byRarity: Progress["byRarity"] = { common: 0, uncommon: 0, rare: 0, epic: 0 };

  for (const id of Object.keys(ITEMS)) {
    byTier[ITEMS[id].tier].total += 1;
  }
  for (const id of discovered) {
    const it = ITEMS[id];
    if (!it) continue;
    byTier[it.tier].found += 1;
    byRarity[it.rarity] += 1;
  }

  return {
    discovered,
    ecoPoints,
    bestSession,
    byTier,
    byRarity,
    percent: Math.round((discovered.length / TOTAL_ITEMS) * 100),
  };
}

export function resetProgress() {
  safeRemove(K_DISCOVERED);
  safeRemove(K_POINTS);
  safeRemove(K_BEST);
}

export function markFirstVisit() {
  safeSet(K_FIRST, "1");
}
export function isFirstVisit() {
  return !safeGet(K_FIRST);
}
export function markTutorialSeen() {
  safeSet(K_TUT, "1");
}
