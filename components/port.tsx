"use client";
import useSWR from "swr";
import Link from "next/link";

export default function PortfolioWidget() {
  const { data, error } = useSWR("/api/portfolio", (url) =>
    fetch(url).then((r) => r.json())
  );

  if (error || !data) {
    const message = error ? "Error loading data." : "Loading…";

    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-900">
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
      </div>
    );
  }

  // ⬇⬇ guard against undefined
  const pct = data.changePercent?.toFixed(2);

  const up = (data.changePercent ?? 0) >= 0;
  const spark = data.sparkline as number[];
  const w = 270;
  const h = 60;

  let points = "0,0";
  if (spark && spark.length > 1) {
    const min = Math.min(...spark);
    const max = Math.max(...spark);
    const span = max - min || 1;
    const step = w / (spark.length - 1);

    points = spark
      .map((v, i) => {
        const y = h - ((v - min) / span) * h;
        const x = i * step;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-900">
      {/* Performance card with sparkline */}
      <div className="bottom-section text-white">
        <div className="performance-title-container mb-2">
          <div className="performance-title text-sm tracking-wider text-gray-400">
            Pick-Performance
          </div>
        </div>

        <div className="performance-card border border-gray-700 rounded bg-gray-800 w-[300px]">
          {/* Header */}
          <div className="performance-header border-b border-gray-700 p-2 text-center text-xs tracking-wider">
            <p className="performance-header-text">PORTFOLIO PERFORMANCE</p>
          </div>

          {/* Body */}
          <div className="performance-body p-4">
            {/* Metrics */}
            <div className="performance-metrics text-center mb-4">
              <div className="metric-label text-gray-400 text-xs mb-1">
                DAY RETURN
              </div>
              <div
                className={
                  up
                    ? "metric-value text-green-400 text-lg"
                    : "metric-value text-red-400 text-lg"
                }
              >
                {up ? "+" : ""}
                {pct}%
              </div>
            </div>

            {/* ✅ SVG Sparkline */}
            <div className="performance-chart relative h-[80px] border border-gray-700 rounded">
              <div className="chart-period absolute top-1 left-2 text-xs text-gray-400">
                30 DAYS
              </div>
              <svg
                width={w + 3}
                height={h + 18}
                viewBox={`0 0 ${w + 4} ${h + 18}`}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute top-[1px] left-[6px]"
              >
                <path
                  opacity="0.3"
                  d={`M0.5 ${h / 2 + 9}H${w + 3.5}`}
                  stroke="#888"
                  strokeDasharray="2 2"
                />
                <polyline
                  fill="none"
                  stroke={up ? "#4ade80" : "#f87171"}
                  strokeWidth="2"
                  points={points}
                />
              </svg>
            </div>
            <Link href="/portfolio" className="details-button">
              more info
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
