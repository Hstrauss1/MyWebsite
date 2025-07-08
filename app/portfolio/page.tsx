/* app/portfolio/page.tsx */
"use client";

import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import useSWR from "swr";
import PortfolioWidgetNo from "@/components/portNo";

/* ───────────── types ───────────── */
type StockDetail = {
  symbol: string;
  price: string;
  dayReturn: string; // 1-day change %
  totalReturn: string; // NEW: from purchase to today
  weight: string; // % of portfolio
  reason?: string;
};

export default function StockListPage() {
  const { data, error } = useSWR("/api/portfolio", (url) =>
    fetch(url).then((r) => r.json())
  );

  const loading = !data && !error;
  const rawDetails: StockDetail[] = data?.details ?? [];

  /* — optional merge pass (kept from your original) — */
  const symbolMap = new Map<string, StockDetail>();
  for (const stock of rawDetails) {
    const existing = symbolMap.get(stock.symbol);
    if (existing) {
      const mergedReasons = Array.from(
        new Set([
          ...(existing.reason && existing.reason !== "NA"
            ? existing.reason.split(" / ")
            : []),
          ...(stock.reason && stock.reason !== "NA"
            ? stock.reason.split(" / ")
            : []),
        ])
      );

      symbolMap.set(stock.symbol, {
        ...existing,
        weight: (
          parseFloat(existing.weight) + parseFloat(stock.weight)
        ).toFixed(2),
        reason: mergedReasons.length ? mergedReasons.join(" / ") : "NA",
        /* totalReturn already aggregated by backend, keep existing */
      });
    } else {
      symbolMap.set(stock.symbol, {
        ...stock,
        reason: stock.reason && stock.reason !== "NA" ? stock.reason : "NA",
      });
    }
  }
  const details = Array.from(symbolMap.values());

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      <ThemeToggle />

      <div className="project-detail-container max-w-7xl mx-auto px-4 py-8">
        {/* back button */}
        <Link href="/" className="back-button text-xl mb-6 inline-block">
          ←
        </Link>

        {/* page title */}
        <h1 className="project-detail-title text-center text-3xl font-bold mb-8">
          Portfolio Stocks
        </h1>

        {/* loading / error */}
        {loading && (
          <p className="text-center text-gray-400 italic">Loading…</p>
        )}
        {error && (
          <p className="text-center text-red-400">Error loading data.</p>
        )}

        {/* header row */}
        <div className="stock-row-container-head font-semibold bg-[#062940]">
          <div className="ticker-box">
            <span className="ticker-text">Ticker</span>
          </div>
          <div className="stock-stats-row">
            <div className="stat-item" style={{ width: "15%" }}>
              Price
            </div>
            <div className="stat-item" style={{ width: "15%" }}>
              1-Day Return
            </div>
            <div className="stat-item" style={{ width: "15%" }}>
              Total Return
            </div>
            <div className="stat-item" style={{ width: "15%" }}>
              Weight
            </div>
            <div className="stat-item" style={{ width: "15%" }}>
              Reason
            </div>
          </div>
        </div>

        {/* data rows */}
        {!loading && !error && (
          <div className="flex flex-col gap-[100px] px-4">
            {details.map((stock) => {
              const oneDayUp = parseFloat(stock.dayReturn) >= 0;
              const totalUp = parseFloat(stock.totalReturn) >= 0;

              return (
                <div key={stock.symbol} className="stock-row-container">
                  {/* ticker column */}
                  <div className="ticker-box">
                    <span className="ticker-text">{stock.symbol}</span>
                  </div>

                  {/* stat columns */}
                  <div className="stock-stats-row">
                    {/* Price */}
                    <div className="stat-item" style={{ width: "15%" }}>
                      ${stock.price}
                    </div>

                    {/* 1-Day Return */}
                    <div
                      className="stat-item"
                      style={{
                        width: "15%",
                        color: oneDayUp ? "#4ade80" : "#f87991",
                      }}
                    >
                      {oneDayUp ? "+" : ""}
                      {stock.dayReturn}%
                    </div>

                    {/* Total Return */}
                    <div
                      className="stat-item"
                      style={{
                        width: "15%",
                        color: totalUp ? "#4ade80" : "#f87991",
                      }}
                    >
                      {totalUp ? "+" : ""}
                      {stock.totalReturn}%
                    </div>

                    {/* Weight */}
                    <div className="stat-item" style={{ width: "15%" }}>
                      {stock.weight}%
                    </div>

                    {/* Reason */}
                    <div className="stat-item" style={{ width: "15%" }}>
                      {stock.reason || "N/A"}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* optional widget */}
      <PortfolioWidgetNo />
    </div>
  );
}
