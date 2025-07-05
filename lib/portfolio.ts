import yahooFinance from "yahoo-finance2";

/* ─────────── types ─────────── */
export type SharePos = {
  symbol: string;
  shares: number;
  buyPrice: number;
  purchaseDate: string;
  reason?: string;
};
export interface ShareCount {
  symbol: string;
  shares: number;
} // 🔑 lean
export interface WeightPos {
  symbol: string;
  weight: number;
} // 0–1

/* ─────────── a. convert shares ➜ weights ─────────── */
export async function sharesToWeights(
  positions: ShareCount[] // ← changed
): Promise<WeightPos[]> {
  const quotes = await Promise.all(
    positions.map((p) => yahooFinance.quote(p.symbol))
  );

  const values = quotes.map((q, i) => {
    const price = q.regularMarketPrice ?? 0; // fallback = 0
    const shares = positions[i].shares;
    return price * shares;
  });

  const total = values.reduce((s, v) => s + v, 0) || 1;

  return positions.map((p, i) => ({
    symbol: p.symbol,
    weight: values[i] / total,
  }));
}

/* ─────────── b. portfolio one-day return ─────────── */
export async function getPortfolioReturn(
  weights: WeightPos[]
): Promise<number> {
  const quotes = await Promise.all(
    weights.map((w) => yahooFinance.quote(w.symbol))
  );

  const weighted = quotes.map(
    (q, i) => (q.regularMarketChangePercent ?? 0) * weights[i].weight
  );

  return weighted.reduce((s, v) => s + v, 0); // e.g. 1.24 → +1.24 %
}
