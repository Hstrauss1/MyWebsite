// pages/api/portfolio.ts
import type { NextApiRequest, NextApiResponse } from "next";
import {
  parseISO,
  formatISO,
  subDays,
  eachDayOfInterval,
  isWeekend,
} from "date-fns";
import yahooFinance from "yahoo-finance2";
import {
  sharesToWeights,
  getPortfolioReturn,
  SharePos,
  ShareCount,
} from "@/lib/portfolio";
import { getSymbolTotalReturns } from "@/lib/portfolio";

/* ───── portfolio ───── */
const portfolio: SharePos[] = [
  {
    symbol: "CNC",
    shares: 40,
    buyPrice: 32.34,
    purchaseDate: "2025-01-01",
    reason: "managed care bet",
  },
  {
    symbol: "ABR",
    shares: 164.06777,
    buyPrice: 13.7,
    purchaseDate: "2024-09-12",
    reason: "weird REIT",
  },
  {
    symbol: "ALT",
    shares: 283.10901,
    buyPrice: 3.66,
    purchaseDate: "2025-06-26",
    reason: "altitude immune",
  },
  {
    symbol: "LLY",
    shares: 1.14756,
    buyPrice: 870.62,
    purchaseDate: "2025-04-28",
    reason: "ozempic",
  },
  {
    symbol: "MNKD",
    shares: 200,
    buyPrice: 4.39,
    purchaseDate: "2025-04-28",
    reason: "inhalable insulin",
  },
  {
    symbol: "UNH",
    shares: 3,
    buyPrice: 347,
    purchaseDate: "2025-01-01",
    reason: "healthcare stability",
  },
  {
    symbol: "PLTR",
    shares: 5,
    buyPrice: 158.67,
    purchaseDate: "2025-04-14",
    reason: "print city",
  },
  {
    symbol: "LCID",
    shares: 66,
    buyPrice: 23.33,
    purchaseDate: "2025-04-07",
    reason: "please beat tesla",
  },
  {
    symbol: "SNAP",
    shares: 100,
    buyPrice: 8.03,
    purchaseDate: "2025-04-28",
    reason: "terrible leadership, but plz",
  },
  {
    symbol: "RKLB",
    shares: 18.06319,
    buyPrice: 48.46,
    purchaseDate: "2025-07-16",
    reason: "satellite hustle",
  },
  {
    symbol: "EQIX",
    shares: 1.00598,
    buyPrice: 761.19,
    purchaseDate: "2025-06-26",
    reason: "Equzi",
  },
  {
    symbol: "BWXT",
    shares: 4,
    buyPrice: 153.28,
    purchaseDate: "2025-07-16",
    reason: "nuclear propulsion",
  },
  {
    symbol: "BTAI",
    shares: 377,
    buyPrice: 7.61,
    purchaseDate: "2025-04-09",
    reason: "biotech gamble - early entry",
  },
  {
    symbol: "AFRM",
    shares: 10.00602,
    buyPrice: 79.61,
    purchaseDate: "2025-04-28",
    reason: "everyone likes debt",
  },
  {
    symbol: "RR",
    shares: 200,
    buyPrice: 4.09,
    purchaseDate: "2025-01-01",
    reason: "robots everywhere",
  },
  {
    symbol: "QS",
    shares: 50,
    buyPrice: 11.59,
    purchaseDate: "2025-06-26",
    reason: "not sure",
  },
  {
    symbol: "VOYG",
    shares: 24,
    buyPrice: 43.91,
    purchaseDate: "2025-06-24",
    reason: "maybe something",
  },
  {
    symbol: "OWL",
    shares: 30,
    buyPrice: 16.47,
    purchaseDate: "2025-01-01",
    reason: "alt credit bet",
  },
];

async function safeHistorical(
  symbol: string,
  opts: Parameters<typeof yahooFinance.historical>[1]
) {
  try {
    return await yahooFinance.historical(symbol, opts);
  } catch (e) {
    console.warn(`⚠️  No historical data for ${symbol}`, (e as Error).message);
    return [];
  }
}

/* Return the last N weekdays (Mon–Fri) as Date[] (oldest → newest) */
function lastBusinessDays(n: number): Date[] {
  const days: Date[] = [];
  let d = new Date();
  d.setUTCHours(0, 0, 0, 0);

  while (days.length < n) {
    if (!isWeekend(d)) days.unshift(new Date(d)); // oldest first
    d = subDays(d, 1);
  }
  return days;
}

/* ───── main handler ───── */
export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    /* ----- current quotes for details ----- */
    const quotes = await Promise.all(
      portfolio.map((p) => yahooFinance.quote(p.symbol))
    );

    /* ----- weights & 1-day change ----- */
    const shareAgg = new Map<string, number>();
    portfolio.forEach((lot) => {
      shareAgg.set(lot.symbol, (shareAgg.get(lot.symbol) ?? 0) + lot.shares);
    });
    const positions: ShareCount[] = Array.from(
      shareAgg,
      ([symbol, shares]) => ({
        symbol,
        shares,
      })
    );

    /* 2. accurate weights that sum to 1.0 */
    const weights = await sharesToWeights(positions);

    /* 3. portfolio’s 1-day change based on those weights */
    const changePercent = await getPortfolioReturn(weights);

    /* ----- generate sparkline points ----- */
    const days = lastBusinessDays(90);
    const dayISO = days.map((d) => formatISO(d, { representation: "date" }));

    /* fetch history (once per symbol) that covers the full 30-day window */
    const symHist: Record<string, Map<string, number>> = {};
    await Promise.all(
      [...new Set(portfolio.map((p) => p.symbol))].map(async (sym) => {
        const earliestLot = portfolio
          .filter((l) => l.symbol === sym)
          .map((l) => parseISO(l.purchaseDate))
          .sort((a, b) => a.getTime() - b.getTime())[0];

        const period1 = Math.floor(
          Math.min(earliestLot.getTime(), days[0].getTime()) / 1000
        );
        const period2 = Math.floor(days.at(-1)!.getTime() / 1000);

        const rows = await safeHistorical(sym, {
          period1,
          period2,
          interval: "1d",
        });

        /* map YYYY-MM-DD → opening price */
        const m = new Map<string, number>();
        rows.forEach((r: any) =>
          m.set(r.date.toISOString().slice(0, 10), r.open ?? r.close)
        );
        symHist[sym] = m;
      })
    );

    const day0 = dayISO[0]!;
    const cashStart = portfolio
      .filter((lot) => lot.purchaseDate > day0)
      .reduce((sum, lot) => sum + lot.buyPrice * lot.shares, 0);

    const holdingsStart = portfolio
      .filter((lot) => lot.purchaseDate <= day0)
      .reduce((sum, lot) => {
        const open = symHist[lot.symbol].get(day0);
        return open ? sum + open * lot.shares : sum;
      }, 0);

    const capitalStart = cashStart + holdingsStart;
    const returns = await getSymbolTotalReturns(portfolio);
    /* ----- build a true “total value” sparkline --------------------------- */
    const sparkline: number[] = [];

    for (const iso of dayISO) {
      /* 1. value of holdings owned *on that day* */
      let holdings = 0;
      portfolio.forEach((lot) => {
        if (iso < lot.purchaseDate) return;
        const open = symHist[lot.symbol].get(iso);
        if (open !== undefined) holdings += open * lot.shares;
      });

      /* 2. remaining cash (cashStart minus what you’ve already spent) */
      const spentSoFar = portfolio
        .filter((lot) => lot.purchaseDate > day0 && lot.purchaseDate <= iso)
        .reduce((s, lot) => s + lot.buyPrice * lot.shares, 0);

      const cash = cashStart - spentSoFar;

      sparkline.push(+(holdings + cash).toFixed(2));
    }

    type Agg = { costBasis: number; shares: number; reasons: Set<string> };
    const agg = new Map<string, Agg>();

    portfolio.forEach((lot) => {
      const a = agg.get(lot.symbol) ?? {
        costBasis: 0,
        shares: 0,
        reasons: new Set<string>(),
      };
      a.costBasis += lot.buyPrice * lot.shares; // Σ buyPrice × shares
      a.shares += lot.shares; // Σ shares
      if (lot.reason && lot.reason !== "NA") a.reasons.add(lot.reason);
      agg.set(lot.symbol, a);
    });

    /** step 2 – handy look-up maps */
    const quoteMap = new Map<
      string,
      Awaited<ReturnType<typeof yahooFinance.quote>>
    >();
    quotes.forEach((q) => quoteMap.set(q.symbol, q));

    const weightMap = new Map(weights.map((w) => [w.symbol, w.weight]));

    /** step 3 – final details array, one row per ticker */
    const details = Array.from(agg.entries()).map(([symbol, a]) => {
      const q = quoteMap.get(symbol);
      const price = q?.regularMarketPrice ?? 0;

      const valueNow = price * a.shares;
      const totalRet =
        a.costBasis === 0 ? 0 : ((valueNow - a.costBasis) / a.costBasis) * 100;

      return {
        symbol,
        price: price.toFixed(2),
        dayReturn: (q?.regularMarketChangePercent ?? 0).toFixed(2),
        totalReturn: totalRet.toFixed(2), // ✅ correct now
        weight: ((weightMap.get(symbol) ?? 0) * 100).toFixed(2),
        reason: a.reasons.size ? Array.from(a.reasons).join(" / ") : "NA",
        shares: a.shares, // optional extra
      };
    });

    return res.status(200).json({
      changePercent,
      sparkline,
      details,
      dayISO, // ← add this to sync with SPY
    });
  } catch (err) {
    console.error("❌ Portfolio API error:", err);
    res.status(500).json({ error: "Server error" });
  }
}
