import type { NextApiRequest, NextApiResponse } from "next";
import yahooFinance from "yahoo-finance2";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { dayISO } = req.body; // Expect a list of ISO date strings from client

  if (!Array.isArray(dayISO)) {
    return res.status(400).json({ error: "Missing or invalid dayISO array" });
  }

  try {
    // Determine earliest and latest dates from the incoming dayISO
    const start = new Date(dayISO[0]);
    const end = new Date(dayISO[dayISO.length - 1]);

    const rows = await yahooFinance.historical("SPY", {
      period1: Math.floor(start.getTime() / 1000),
      period2: Math.floor(end.getTime() / 1000),
      interval: "1d",
    });

    // Map YYYY-MM-DD to close price
    const priceMap = new Map<string, number>();
    rows.forEach((r) => {
      const iso = r.date.toISOString().slice(0, 10);
      priceMap.set(iso, r.close ?? r.open); // fallback to open if no close
    });

    // Return prices in the same order as dayISO
    const prices = dayISO.map((date) => priceMap.get(date) ?? null);

    return res.status(200).json({ dayISO, prices });
  } catch (err) {
    console.error("❌ SPY API error:", err);
    return res.status(500).json({ error: "Failed to fetch SPY data" });
  }
}
