/* components/PortfolioWidget.tsx */
"use client";
import useSWR from "swr";
import Link from "next/link";

export default function PortfolioWidget() {
  /* ─── fetch API payload ─── */
  const { data, error } = useSWR("/api/portfolio", (url) =>
    fetch(url).then((r) => r.json())
  );

  /* ─── loading / error UI ─── */
  if (error || !data) {
    const message = error ? "Error loading data, Reload Page." : "Loading…";
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-900">
        <MiniCard message={message} />
      </div>
    );
  }

  /* ─── safeguard sparkline ─── */
  const rawSeries: number[] = Array.isArray(data.sparkline)
    ? data.sparkline
    : [];
  const priceSeries: number[] = rawSeries.filter((n) => n !== 0);

  if (!priceSeries) {
    console.warn("⚠️  sparkline missing or empty:", data.sparkline);
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-900">
        <MiniCard message="No sparkline data." />
      </div>
    );
  }

  /* ─── logging for dev ─── */
  console.log("📈 raw sparkline:", priceSeries);

  /* ─── normalize to % change ─── */
  const basePrice = priceSeries[0];
  const sparkPct = priceSeries.map((p) => ((p - basePrice) / basePrice) * 100);
  const lastPct90 = sparkPct.length > 0 ? sparkPct[sparkPct.length - 1] : 0;
  const pct90d = lastPct90.toFixed(2);
  const pct90dUp = lastPct90 >= 0;
  const w = 625; // internal SVG units (x-axis 0→100)
  const h = 125; // internal SVG units (y-axis 0→100)

  /* ─── metric & sparkline drawing params ─── */
  const pct = (data.changePercent ?? 0).toFixed(2);
  const up = (data.changePercent ?? 0) >= 0;

  /* ─── polyline points ─── */ let points = "";
  if (priceSeries.length > 1) {
    const min = Math.min(...priceSeries);
    const max = Math.max(...priceSeries);
    const span = max - min || 1; // avoid /0
    points = priceSeries
      .map((v, i) => {
        const x = (i / (priceSeries.length - 1)) * w; // 0-100
        const y = h - ((v - min) / span) * h; // 0-100
        return `${x.toFixed(2)},${y.toFixed(2)}`;
      })
      .join(" ");
  }

  console.log("📐 polyline points:", points);

  /* ─── rendered card ─── */
  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-900">
      <div className="bottom-section text-white">
        {/* title */}
        <h2 className="performance-title text-sm tracking-wider text-gray-400 mb-2">
          The Port
        </h2>

        {/* card */}
        <div className="performance-card border border-gray-700 rounded bg-gray-800 w-[300px]">
          {/* header */}
          <div className="performance-header border-b border-gray-700 p-2 text-center text-xs tracking-wider">
            <p className="performance-header-text">PORTFOLIO PERFORMANCE</p>
          </div>

          {/* body */}
          <div className="performance-body p-4">
            {/* metric */}
            <div className="performance-metrics text-center mb-4">
              <p className="metric-label text-gray-400 text-xs mb-1">
                DAY RETURN
              </p>
              <p
                className={`chart-period-base ${
                  up ? "chart-period-up" : "chart-period-down"
                }`}
              >
                {up ? "+" : ""}
                {pct}%
              </p>
            </div>

            {/* sparkline */}
            <div className="performance-chart">
              <div className="flex gap-2 items-center mb-2">
                <span className="px-2 py-1 bg-gray-700 text-xs rounded text-white">
                  90 DAYS
                </span>
                <span
                  className={`chart-period-base ${
                    pct90dUp ? "chart-period-up" : "chart-period-down"
                  }`}
                >
                  ({pct90dUp ? "+" : ""}
                  {pct90d}%)
                </span>
              </div>
              <svg
                viewBox={`0 0 ${w} ${h}`}
                preserveAspectRatio="none"
                className="absolute inset-0 w-full h-full"
                xmlns="http://www.w3.org/2000/svg"
              >
                <polyline
                  fill="none"
                  stroke={up ? "#4ade80" : "#f87171"}
                  strokeWidth="2"
                  points={points}
                />
              </svg>
            </div>

            {/* link */}
            <Link href="/portfolio" className="details-button">
              more info
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── tiny helper card for loading / empty states ─── */
function MiniCard({ message }: { message: string }) {
  return (
    <div className="bottom-section text-white">
      <div className="performance-title-container mb-2">
        <div className="performance-title text-sm tracking-wider text-gray-400">
          Pick-Performance
        </div>
      </div>
      <div className="performance-card border border-gray-700 rounded bg-gray-800 w-[300px]">
        <div className="performance-header border-b border-gray-700 p-2 text-center text-xs tracking-wider">
          PORTFOLIO PERFORMANCE
        </div>
        <div className="performance-body p-4 flex items-center justify-center h-[140px]">
          <span className="text-gray-400 text-sm italic">{message}</span>
        </div>
      </div>
    </div>
  );
}
