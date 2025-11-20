// pages/api/portfolio.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { parseISO, formatISO, subDays, isWeekend } from "date-fns";
import yahooFinance from "yahoo-finance2";
import {
  sharesToWeights,
  getPortfolioReturn,
  SharePos,
  ShareCount,
} from "@/lib/portfolio";
import { getSymbolTotalReturns } from "@/lib/portfolio";

/* ───── CASH BALANCE ───── */
const cashBalance = 26700; // <-- your current cash included in portfolio value

/* ───── CURRENT PORTFOLIO ───── */
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

/* ---- safe wrapper ---- */
async function safeHistorical(
  symbol: string,
  opts: Parameters<typeof yahooFinance.historical>[1]
) {
  try {
    return await yahooFinance.historical(symbol, opts);
  } catch (e) {
    console.warn(`⚠️ No historical data for ${symbol}`, (e as Error).message);
    return [];
  }
}

/* ---- get last 90 business days ---- */
function lastBusinessDays(n: number): Date[] {
  const days: Date[] = [];
  let d = new Date();
  d.setUTCHours(0, 0, 0, 0);

  while (days.length < n) {
    if (!isWeekend(d)) days.unshift(new Date(d));
    d = subDays(d, 1);
  }
  return days;
}

/* ---- API handler ---- */
export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    /* ----- fetch quotes ----- */
    const quotes = await Promise.all(
      portfolio.map((p) => yahooFinance.quote(p.symbol))
    );

    /* ----- group shares ----- */
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

    /* ----- for 1-day change ----- */
    const weights = await sharesToWeights(positions);
    const changePercent = await getPortfolioReturn(weights);

    /* ----- 90-day sparkline days ----- */
    const days = lastBusinessDays(90);
    const dayISO = days.map((d) => formatISO(d, { representation: "date" }));

    /* ----- fetch historical data for each symbol ----- */
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

        const m = new Map<string, number>();
        rows.forEach((r: any) =>
          m.set(r.date.toISOString().slice(0, 10), r.open ?? r.close)
        );
        symHist[sym] = m;
      })
    );

    /* ----- sparkline including cash ----- */
    const sparkline: number[] = dayISO.map((iso) => {
      let holdings = 0;

      portfolio.forEach((lot) => {
        if (iso < lot.purchaseDate) return;
        const price = symHist[lot.symbol].get(iso);
        if (price !== undefined) {
          holdings += price * lot.shares;
        }
      });

      /* Add constant cash balance */
      const totalValue = holdings + cashBalance;

      return +totalValue.toFixed(2);
    });

    /* ---- cost basis for current positions ---- */
    type Agg = { costBasis: number; shares: number; reasons: Set<string> };
    const agg = new Map<string, Agg>();

    portfolio.forEach((lot) => {
      const a = agg.get(lot.symbol) ?? {
        costBasis: 0,
        shares: 0,
        reasons: new Set<string>(),
      };
      a.costBasis += lot.buyPrice * lot.shares;
      a.shares += lot.shares;
      if (lot.reason && lot.reason !== "NA") a.reasons.add(lot.reason);
      agg.set(lot.symbol, a);
    });

    const quoteMap = new Map<
      string,
      Awaited<ReturnType<typeof yahooFinance.quote>>
    >();
    quotes.forEach((q) => quoteMap.set(q.symbol, q));

    const weightMap = new Map(weights.map((w) => [w.symbol, w.weight]));

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
        totalReturn: totalRet.toFixed(2),
        weight: ((weightMap.get(symbol) ?? 0) * 100).toFixed(2),
        reason: a.reasons.size ? Array.from(a.reasons).join(" / ") : "NA",
        shares: a.shares,
      };
    });

    return res.status(200).json({
      changePercent,
      details,
      sparkline,
      dayISO,
      cashBalance, // <-- send cash to frontend too
    });
  } catch (err) {
    console.error("❌ Portfolio API error:", err);
    res.status(500).json({ error: "Server error" });
  }
}
