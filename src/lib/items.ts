export type Tier = "primary" | "intermediate" | "advanced";
export type Rarity = "common" | "uncommon" | "rare" | "epic";

export type Item = {
  id: string;
  name: string;
  image: string;
  tier: Tier;
  rarity: Rarity;
  value: number;
};

const P = "/game/objetos/objetos-primarios";
const C = "/game/objetos/objetos-combinacoes";

export const ITEMS: Record<string, Item> = {
  papel:               { id: "papel", name: "Papel", image: `${P}/papel.png`, tier: "primary", rarity: "common", value: 1 },
  papelao:             { id: "papelao", name: "Papelão", image: `${P}/papelao.png`, tier: "primary", rarity: "common", value: 1 },
  "garrafa-plastico":  { id: "garrafa-plastico", name: "Garrafa Plástica", image: `${P}/garrafa-plastico.png`, tier: "primary", rarity: "common", value: 1 },
  vidro:               { id: "vidro", name: "Vidro", image: `${P}/vidro.png`, tier: "primary", rarity: "common", value: 1 },
  metal:               { id: "metal", name: "Metal", image: `${P}/metal.png`, tier: "primary", rarity: "common", value: 2 },
  madeira:             { id: "madeira", name: "Madeira", image: `${P}/madeira.png`, tier: "primary", rarity: "common", value: 2 },

  "papel-reciclado":    { id: "papel-reciclado", name: "Papel Reciclado", image: `${C}/papel-reciclado.png`, tier: "intermediate", rarity: "uncommon", value: 5 },
  "plastico-triturado": { id: "plastico-triturado", name: "Plástico Triturado", image: `${C}/plastico-triturado.png`, tier: "intermediate", rarity: "uncommon", value: 5 },
  "vidro-moido":        { id: "vidro-moido", name: "Vidro Moído", image: `${C}/vidro-moido.png`, tier: "intermediate", rarity: "rare", value: 8 },

  "brinquedo-ecologico": { id: "brinquedo-ecologico", name: "Brinquedo Ecológico", image: `${C}/brinquedo-ecologico.png`, tier: "advanced", rarity: "epic", value: 25 },
};

export const TOTAL_ITEMS = Object.keys(ITEMS).length;

export const RARITY_LABEL: Record<Rarity, string> = {
  common: "Comum",
  uncommon: "Incomum",
  rare: "Raro",
  epic: "Épico",
};

export const TIER_LABEL: Record<Tier, string> = {
  primary: "Primário",
  intermediate: "Intermediário",
  advanced: "Avançado",
};
