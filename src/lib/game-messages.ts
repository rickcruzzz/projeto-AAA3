export type GameMessage =
  | { type: "ecocraft:discovery"; itemId: string; totalDiscovered: number; ecoPoints: number }
  | { type: "ecocraft:back-to-menu" }
  | { type: "ecocraft:reset" };

export function isGameMessage(data: unknown): data is GameMessage {
  if (!data || typeof data !== "object") return false;
  const t = (data as { type?: unknown }).type;
  return (
    t === "ecocraft:discovery" ||
    t === "ecocraft:back-to-menu" ||
    t === "ecocraft:reset"
  );
}
