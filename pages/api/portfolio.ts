// pages/api/portfolio.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { parseISO, formatISO, subDays, isWeekend } from "date-fns";
import yahooFinance from "yahoo-finance2";
import type { SharePos, ShareCount } from "@/lib/portfolio";

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

async function safeQuote(symbol: string) {
  try {
    return await yahooFinance.quote(symbol);
  } catch (e) {
    console.warn(`⚠️ No quote data for ${symbol}`, (e as Error).message);
    return null;
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

    /* ----- 90-day sparkline days ----- */
    const days = lastBusinessDays(90);
    const dayISO = days.map((d) => formatISO(d, { representation: "date" }));

    /* ----- fetch historical data for each symbol ----- */
    const symHist: Record<string, Map<string, number>> = {};
    const histFallbacks = new Map<
      string,
      { latestPrice: number | null; previousPrice: number | null }
    >();
    await Promise.all(
      [...new Set(portfolio.map((p) => p.symbol))].map(async (sym) => {
        const earliestLot = portfolio
          .filter((l) => l.symbol === sym)
          .map((l) => parseISO(l.purchaseDate))
          .sort((a, b) => a.getTime() - b.getTime())[0];

        const period1 = Math.floor(
          Math.min(earliestLot.getTime(), days[0].getTime()) / 1000
        );
        const period2 = Math.floor(days.at(-1)!.getTime() / 1000) + 86400;

        const rows = await safeHistorical(sym, {
          period1,
          period2,
          interval: "1d",
        });

        const m = new Map<string, number>();
        const priceSeries: { iso: string; price: number }[] = rows
          .map((r: any) => ({
            iso: r.date.toISOString().slice(0, 10),
            price: r.close ?? r.open,
          }))
          .filter(
            (
              row: { iso: string; price: number | null | undefined }
            ): row is {
              iso: string;
              price: number;
            } => typeof row.price === "number" && Number.isFinite(row.price)
          );

        priceSeries.forEach((row) => m.set(row.iso, row.price));
        symHist[sym] = m;
        histFallbacks.set(sym, {
          latestPrice: priceSeries.at(-1)?.price ?? null,
          previousPrice: priceSeries.at(-2)?.price ?? null,
        });
      })
    );

    const symbols = positions.map((p) => p.symbol);
    const quotes = await Promise.all(symbols.map((symbol) => safeQuote(symbol)));
    const quoteMap = new Map(
      quotes
        .filter((quote): quote is NonNullable<typeof quote> => quote !== null)
        .map((quote) => [quote.symbol, quote])
    );

    const latestPriceFor = (symbol: string) => {
      const quote = quoteMap.get(symbol);
      return (
        quote?.regularMarketPrice ?? histFallbacks.get(symbol)?.latestPrice ?? 0
      );
    };

    const dayChangePercentFor = (symbol: string) => {
      const quote = quoteMap.get(symbol);
      if (typeof quote?.regularMarketChangePercent === "number") {
        return quote.regularMarketChangePercent;
      }

      const fallback = histFallbacks.get(symbol);
      const latest = fallback?.latestPrice ?? null;
      const previous = fallback?.previousPrice ?? null;
      if (latest == null || previous == null || previous === 0) return 0;
      return ((latest - previous) / previous) * 100;
    };

    /* ----- for 1-day change ----- */
    const values = positions.map(
      (position) => latestPriceFor(position.symbol) * position.shares
    );
    const totalValue = values.reduce((sum, value) => sum + value, 0) || 1;
    const weights = positions.map((position, index) => ({
      symbol: position.symbol,
      weight: values[index] / totalValue,
    }));
    const changePercent = weights.reduce(
      (sum, weight) => sum + dayChangePercentFor(weight.symbol) * weight.weight,
      0
    );

    const spyRows = await safeHistorical("SPY", {
      period1: Math.floor(days[0].getTime() / 1000),
      period2: Math.floor(days.at(-1)!.getTime() / 1000) + 86400,
      interval: "1d",
    });
    const spyMap = new Map<string, number>();
    spyRows.forEach((row: any) => {
      spyMap.set(
        row.date.toISOString().slice(0, 10),
        row.close ?? row.open ?? null
      );
    });
    const spyPrices = dayISO.map((iso) => spyMap.get(iso) ?? null);

    /* ----- sparkline with dynamic cash ----- */
    // Total capital = today's cash + all cost bases ever deployed
    const totalCapital =
      cashBalance +
      portfolio.reduce((sum, lot) => sum + lot.buyPrice * lot.shares, 0);

    // Carry the last-known price forward so market holidays / missing bars
    // don't drop a held lot's value while still subtracting its cost from cash
    // (which used to crater the whole line to ~cash on every holiday).
    const lastKnownPrice = new Map<string, number>();

    const sparkline: number[] = dayISO.map((iso) => {
      let holdings = 0;
      let deployedCash = 0;

      portfolio.forEach((lot) => {
        if (iso < lot.purchaseDate) return;
        const price =
          symHist[lot.symbol].get(iso) ??
          lastKnownPrice.get(lot.symbol) ??
          lot.buyPrice; // no data yet → value at cost basis
        lastKnownPrice.set(lot.symbol, price);
        holdings += price * lot.shares;
        // cash deployed when this lot was purchased
        deployedCash += lot.buyPrice * lot.shares;
      });

      // cash on hand = total capital minus whatever has been deployed so far
      const cashOnHand = totalCapital - deployedCash;
      const totalValue = holdings + cashOnHand;

      return +totalValue.toFixed(2);
    });

    // Rebase to a base-100 index so the chart shape / returns are preserved
    // but the absolute portfolio value (holdings + cash) is never disclosed.
    const sparkBase = sparkline.find((v) => v > 0) ?? 1;
    const sparklineIndex = sparkline.map(
      (v) => +((v / sparkBase) * 100).toFixed(4)
    );

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

    const weightMap = new Map(weights.map((w) => [w.symbol, w.weight]));

    const details = Array.from(agg.entries()).map(([symbol, a]) => {
      const price = latestPriceFor(symbol);

      const valueNow = price * a.shares;
      const totalRet =
        a.costBasis === 0 ? 0 : ((valueNow - a.costBasis) / a.costBasis) * 100;

      return {
        symbol,
        price: price.toFixed(2),
        dayReturn: dayChangePercentFor(symbol).toFixed(2),
        totalReturn: totalRet.toFixed(2),
        weight: ((weightMap.get(symbol) ?? 0) * 100).toFixed(2),
        reason: a.reasons.size ? Array.from(a.reasons).join(" / ") : "NA",
      };
    });

    return res.status(200).json({
      changePercent,
      details,
      sparkline: sparklineIndex, // base-100 index, no absolute $ disclosed
      spyPrices,
      dayISO,
    });
  } catch (err) {
    console.error("❌ Portfolio API error:", err);
    res.status(500).json({ error: "Server error" });
  }
}
