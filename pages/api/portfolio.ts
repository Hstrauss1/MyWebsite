// pages/api/portfolio.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { parseISO, formatISO, subDays, eachDayOfInterval } from "date-fns";
import yahooFinance from "yahoo-finance2";
import {
  sharesToWeights,
  getPortfolioReturn,
  SharePos,
  ShareCount,
} from "@/lib/portfolio";

/* ───── portfolio ───── */
const portfolio: SharePos[] = [
  { symbol: "AAPL", shares: 2, buyPrice: 207, purchaseDate: "2025-04-14" },
  { symbol: "AAPL", shares: 4, buyPrice: 176, purchaseDate: "2025-04-07" },
  { symbol: "ABR", shares: 160, buyPrice: 13.75, purchaseDate: "2024-09-12" },
  { symbol: "AFRM", shares: 20, buyPrice: 48.29, purchaseDate: "2025-04-28" },
  { symbol: "ALT", shares: 200, buyPrice: 3.69, purchaseDate: "2025-06-26" },
  { symbol: "CRWV", shares: 6, buyPrice: 158.58, purchaseDate: "2025-06-26" },
  { symbol: "EQIX", shares: 1, buyPrice: 761.05, purchaseDate: "2025-06-26" },
  { symbol: "INTC", shares: 15, buyPrice: 20.05, purchaseDate: "2025-05-01" },
  { symbol: "INTC", shares: 20, buyPrice: 20.89, purchaseDate: "2024-08-02" },
  { symbol: "INTC", shares: 6, buyPrice: 33.06, purchaseDate: "2024-07-22" },
  { symbol: "INTC", shares: 6, buyPrice: 34.63, purchaseDate: "2024-07-12" },
  { symbol: "INTC", shares: 47, buyPrice: 1.0, purchaseDate: "2024-12-20" },
  { symbol: "LCID", shares: 100, buyPrice: 2.38, purchaseDate: "2025-05-05" },
  { symbol: "LCID", shares: 200, buyPrice: 2.54, purchaseDate: "2025-04-28" },
  { symbol: "LCID", shares: 200, buyPrice: 2.31, purchaseDate: "2025-04-07" },
  { symbol: "LLY", shares: 2, buyPrice: 871, purchaseDate: "2025-04-28" },
  { symbol: "MENS", shares: 50, buyPrice: 9.5, purchaseDate: "2025-06-26" },
  { symbol: "MNKD", shares: 240, buyPrice: 1, purchaseDate: "2024-12-20" },
  { symbol: "NVDA", shares: 7, buyPrice: 88, purchaseDate: "2025-04-07" },
  { symbol: "NVDA", shares: 4, buyPrice: 112, purchaseDate: "2025-04-14" },
  { symbol: "ORCL", shares: 5, buyPrice: 232.5, purchaseDate: "2025-07-03" },
  { symbol: "PLTR", shares: 15, buyPrice: 93, purchaseDate: "2025-04-14" },
  { symbol: "QMCO", shares: 80, buyPrice: 11.1, purchaseDate: "2025-05-01" },
  { symbol: "QMCO", shares: 50, buyPrice: 12, purchaseDate: "2025-04-14" },
  { symbol: "QS", shares: 60, buyPrice: 7.54, purchaseDate: "2025-06-26" },
  { symbol: "SLDE", shares: 40, buyPrice: 21.28, purchaseDate: "2025-06-26" },
  { symbol: "SNAP", shares: 40, buyPrice: 7.94, purchaseDate: "2025-05-01" },
  { symbol: "SNAP", shares: 100, buyPrice: 8.84, purchaseDate: "2025-04-28" },
  { symbol: "TLX", shares: 50, buyPrice: 17.32, purchaseDate: "2025-04-28" },
  { symbol: "TSM", shares: 8, buyPrice: 161, purchaseDate: "2025-04-28" },
  { symbol: "TTAN", shares: 8, buyPrice: 104, purchaseDate: "2025-06-24" },
  { symbol: "VOYG", shares: 20, buyPrice: 44.29, purchaseDate: "2025-06-24" },
];

/* helper: wrap historical in try/catch so 1 bad symbol won't crash everything */
async function safeHistorical(
  symbol: string,
  opts: Parameters<typeof yahooFinance.historical>[1]
) {
  try {
    return await yahooFinance.historical(symbol, opts);
  } catch (err) {
    console.warn(
      `⚠️  No historical data for ${symbol}:`,
      (err as Error).message
    );
    return [];
  }
}

/* ───── API handler ───── */
export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    /* ----- live quotes ----- */
    const rawQuotes = await Promise.all(
      portfolio.map((p) => yahooFinance.quote(p.symbol))
    );

    /* ----- weights + 1-day portfolio return ----- */
    const weights = await sharesToWeights(
      portfolio.map(({ symbol, shares }) => ({
        symbol,
        shares,
      })) as ShareCount[]
    );
    const changePercent = await getPortfolioReturn(weights);

    /* consistent timestamp to avoid future-date errors */
    const now = new Date();
    now.setUTCHours(0, 0, 0, 0); // midnight UTC

    /* ----- price 30 days ago ----- */
    const history30 = await Promise.all(
      portfolio.map((p) =>
        safeHistorical(p.symbol, {
          period1: subDays(now, 35),
          period2: subDays(now, 29),
          interval: "1d",
        })
      )
    );
    const price30Ago = history30.map((h) => h.at(-1)?.close ?? 0);

    /* ----- sparkline (30 weighted daily returns) ----- */
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const startDate = subDays(today, 29);
    const allDays = eachDayOfInterval({ start: startDate, end: today });

    /* fetch historical data starting from purchaseDate */
    const fullHist = await Promise.all(
      portfolio.map(
        (p) =>
          yahooFinance
            .historical(p.symbol, {
              period1: parseISO(p.purchaseDate),
              interval: "1d",
            })
            .catch(() => []) // handle missing data
      )
    );

    const cost = portfolio.map((p) => p.buyPrice * p.shares);
    const totalCost = cost.reduce((s, v) => s + v, 0) || 1;

    const sparkline: number[] = [];

    for (const day of allDays) {
      const dayISO = formatISO(day, { representation: "date" });

      let investedCost = 0;
      let investedValue = 0;

      portfolio.forEach((p, i) => {
        if (day >= parseISO(p.purchaseDate)) {
          investedCost += p.buyPrice * p.shares;

          const row = fullHist[i].find((h) =>
            h.date.toISOString().startsWith(dayISO)
          );
          if (row) investedValue += row.close * p.shares;
        }
      });

      const pct = investedCost
        ? (investedValue - investedCost) / investedCost
        : 0;
      sparkline.push(pct);
    }

    /* ----- per-stock details ----- */
    const details = portfolio.map((p, i) => {
      const curr = rawQuotes[i].regularMarketPrice ?? 0;
      const day = rawQuotes[i].regularMarketChangePercent ?? 0;
      const ago30 = price30Ago[i];

      return {
        symbol: p.symbol,
        price: curr.toFixed(2),
        dayReturn: day.toFixed(2),
        gain30d: ago30 ? (((curr - ago30) / ago30) * 100).toFixed(2) : "0.00",
        gainSinceBuy: (((curr - p.buyPrice) / p.buyPrice) * 100).toFixed(2),
        weight: (
          (weights.find((w) => w.symbol === p.symbol)?.weight ?? 0) * 100
        ).toFixed(2),
      };
    });

    /* ----- respond ----- */
    res.status(200).json({
      changePercent,
      sparkline,
      details,
    });
  } catch (err) {
    console.error("❌ Error fetching quotes:", err);
    return res.status(500).json({ error: "Could not fetch quotes" });
  }
}
