import yahooFinance from "yahoo-finance2";

export interface SharePos {
  symbol: string;
  shares: number;
  buyPrice: number;
}

export interface ShareCount {
  symbol: string;
  shares: number;
}

export interface WeightPos {
  symbol: string;
  weight: number; // 0–1
}

/** Convert share positions to weight positions */
export async function sharesToWeights(
  positions: ShareCount[]
): Promise<WeightPos[]> {
  const quotes = await Promise.all(
    positions.map((p) => yahooFinance.quote(p.symbol))
  );

  const values = quotes.map((q, i) => {
    const price = q.regularMarketPrice ?? 0;
    const shares = positions[i].shares;
    return { symbol: q.symbol, value: price * shares };
  });

  const total = values.reduce((sum, v) => sum + v.value, 0) || 1;

  return values.map((v) => ({
    symbol: v.symbol,
    weight: v.value / total,
  }));
}
