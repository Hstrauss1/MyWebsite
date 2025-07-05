"use client";

import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import useSWR from "swr";

type StockDetail = {
  symbol: string;
  price: string;
  dayReturn: string;
  weight: string;
};

export default function StockListPage() {
  const { data, error } = useSWR("/api/portfolio", (url) =>
    fetch(url).then((r) => r.json())
  );

  const loading = !data && !error;
  const details: StockDetail[] = data?.details ?? [];

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      <ThemeToggle />

      <div className="project-detail-container max-w-5xl mx-auto px-4 py-8">
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

        {/* render each stock as its own block */}
        {!loading &&
          !error &&
          details.map((stock) => {
            const up = parseFloat(stock.dayReturn) >= 0;

            return (
              <div
                key={stock.symbol}
                className="mb-10 p-6 bg-gray-800 border border-gray-700 rounded-lg shadow-sm"
              >
                {/* stock title */}
                <h2 className="text-center text-2xl font-mono font-semibold mb-4">
                  {stock.symbol}
                </h2>

                {/* stats layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm max-w-xl mx-auto">
                  <Stat label="Price" value={`$${stock.price}`} />
                  <Stat
                    label="Day Return"
                    value={`${up ? "+" : ""}${stock.dayReturn}%`}
                    valueColor={up ? "text-green-400" : "text-red-400"}
                  />
                  <Stat
                    label="Weight in Portfolio"
                    value={`${stock.weight}%`}
                  />
                </div>
              </div>
            );
          })}
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
