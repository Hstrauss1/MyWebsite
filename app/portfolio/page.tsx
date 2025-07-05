"use client";

import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import useSWR from "swr";

type StockDetail = {
  symbol: string;
  price: string;
  dayReturn: string;
  weight: string;
  reason?: string;
};
export default function StockListPage() {
  const { data, error } = useSWR("/api/portfolio", (url) =>
    fetch(url).then((r) => r.json())
  );

  const loading = !data && !error;
  const rawDetails: StockDetail[] = data?.details ?? [];
  console.log("🔎 Raw Details from API:", rawDetails);

  // Merge duplicates and sum weight
  const symbolMap = new Map<string, StockDetail>();

  for (const stock of rawDetails) {
    const existing = symbolMap.get(stock.symbol);
    console.log("🔎 Raw Details from API:", rawDetails);
    if (existing) {
      // Accumulate valid reasons (not "NA")
      const existingReasons =
        existing.reason && existing.reason !== "NA"
          ? existing.reason.split(" / ")
          : [];

      const newReasons =
        stock.reason && stock.reason !== "NA" ? stock.reason.split(" / ") : [];

      const mergedReasons = Array.from(
        new Set([...existingReasons, ...newReasons])
      );

      symbolMap.set(stock.symbol, {
        ...existing,
        weight: (
          parseFloat(existing.weight) + parseFloat(stock.weight)
        ).toFixed(2),
        reason: mergedReasons.length > 0 ? mergedReasons.join(" / ") : "NA",
      });
    } else {
      // Set reason only if valid, else default to "NA"
      const reason =
        stock.reason && stock.reason !== "NA" ? stock.reason : "NA";

      symbolMap.set(stock.symbol, {
        ...stock,
        reason,
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

        {/* loading or error */}
        {loading && (
          <p className="text-center text-gray-400 italic">Loading…</p>
        )}
        {error && (
          <p className="text-center text-red-400">Error loading data.</p>
        )}

        {/* flex row for stock cards */}
        <div className="stock-row-container font-semibold bg-[#062940]">
          <div className="ticker-box">
            <span className="ticker-text">Ticker</span>
          </div>
          <div className="stock-stats-row">
            <div className="stat-item" style={{ width: "20%" }}>
              Price
            </div>
            <div className="stat-item" style={{ width: "20%" }}>
              Return
            </div>
            <div className="stat-item" style={{ width: "20%" }}>
              Weight
            </div>
            <div className="stat-item" style={{ width: "auto" }}>
              Reason
            </div>
          </div>
        </div>
        {!loading && !error && (
          <div className="flex flex-col gap-[100px] px-4">
            {details.map((stock) => {
              const up = parseFloat(stock.dayReturn) >= 0;

              return (
                <div key={stock.symbol} className="stock-row-container">
                  <div className="ticker-box">
                    <span className="ticker-text">{stock.symbol}</span>
                  </div>

                  <div className="stock-stats-row">
                    <div className="stat-item" style={{ width: "20%" }}>
                      ${stock.price}
                    </div>
                    <div
                      className="stat-item"
                      style={{
                        width: "20%",
                        color: up ? "#4ade80" : "#f87991", // Tailwind's green-400/red-400
                      }}
                    >
                      {up ? "+" : ""}
                      {stock.dayReturn}%
                    </div>
                    <div className="stat-item" style={{ width: "20%" }}>
                      {stock.weight}%
                    </div>
                    <div className="stat-item" style={{ width: "auto" }}>
                      {stock.reason || "N/A"}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  valueColor = "text-white",
}: {
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <div>
      <p className="text-gray-400 uppercase tracking-wide text-xs mb-1">
        {label}
      </p>
      <p className={`text-base font-medium ${valueColor}`}>{value}</p>
    </div>
  );
}
