/* components/PortfolioWidget.tsx */
"use client";
import useSWR from "swr";
import Link from "next/link";

/* --- helpers: disable caching on fetch ---------------------------------- */
const fetchJSON = (url: string) =>
  fetch(url, { cache: "no-store", next: { revalidate: 0 } }).then((r) => {
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json();
  });

const MiniCard = ({ message }: { message: string }) => (
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

/* --- main widget --------------------------------------------------------- */
export default function PortfolioWidget() {
  const w = 825;
  const h = 175;

  /* SWR settings to avoid caching */
  const swrNoCache = {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 0,
  } as const;

  /* ----- load portfolio data (with cash included) ----- */
  const { data: portData, error: portErr } = useSWR(
    "/api/portfolio",
    fetchJSON,
    swrNoCache
  );

  /* ----- loading and error handling ----- */
  if (portErr)
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-900">
        <MiniCard message="Error loading data, reload page." />
      </div>
    );
  if (!portData)
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-900">
        <MiniCard message="Loading…" />
      </div>
    );

  /* ------ Align by date & drop holidays ------ */
  const portValues: number[] = portData.sparkline; // includes cash
  const spyValues: (number | null)[] | null = Array.isArray(portData.spyPrices)
    ? portData.spyPrices
    : null;

  const alignedPort: number[] = [];
  const alignedSpy: number[] = [];

  if (spyValues) {
    spyValues.forEach((v, i) => {
      if (v != null) {
        alignedPort.push(portValues[i]);
        alignedSpy.push(v);
      }
    });
  }

  if (alignedPort.length === 0) {
    alignedPort.push(...portValues);
  }

  /* ----- Start comparison at first day where portfolio > 0 ----- */
  let firstIdx = alignedPort.findIndex((v) => v > 0);
  if (firstIdx === -1) firstIdx = 0;

  const portSeries = alignedPort.slice(firstIdx);
  const spySeries = alignedSpy.slice(firstIdx);
  const hasChartData = portSeries.length >= 2;
  const hasSpyData = spySeries.length >= 2;

  /* ----- compute portfolio vs SPY return over the window ----- */
  let alphaPct = "N/A";
  let alphaUp = true;
  let ninetyPct = "0.00";
  let ninetyUp = true;

  if (hasChartData) {
    const p0 = portSeries[0];
    const pT = portSeries.at(-1)!;

    const portfolioReturn = p0 > 0 ? pT / p0 - 1 : 0;
    ninetyPct = (portfolioReturn * 100).toFixed(2);
    ninetyUp = parseFloat(ninetyPct) >= 0;

    if (hasSpyData) {
      const s0 = spySeries[0];
      const sT = spySeries.at(-1)!;
      const spyReturn = s0 > 0 ? sT / s0 - 1 : 0;
      const alpha = portfolioReturn - spyReturn;
      alphaPct = (alpha * 100).toFixed(2);
      alphaUp = alpha >= 0;
    }
  }

  /* ----- Day change from backend ----- */
  const dayPct = (portData.changePercent ?? 0).toFixed(2);
  const dayUp = (portData.changePercent ?? 0) >= 0;

  /* ----- sparkline coordinate helpers ----- */
  const normY = (vals: number[]) => {
    const min = Math.min(...vals);
    const span = Math.max(...vals) - min || 1;
    return vals.map((v) => h - ((v - min) / span) * h);
  };

  const shift = 7;
  const shiftDown = -7;

  const spyY = hasSpyData
    ? normY(spySeries).map((y) => y - shiftDown)
    : [];
  const portY = hasChartData ? normY(portSeries).map((y) => y - shift) : [];

  const pts = (ys: number[]) =>
    ys
      .map(
        (y, i) =>
          `${((i / Math.max(ys.length - 1, 1)) * w).toFixed(2)},${y.toFixed(2)}`
      )
      .join(" ");

  /* ----- render widget ----- */
  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-900">
      <div className="bottom-section text-white">
        <h2 className="performance-title text-sm tracking-wider text-gray-400 mb-2">
          The Port
        </h2>

        <div className="performance-card border border-gray-700 rounded bg-gray-800 w-[300px] relative">
          <div className="performance-header border-b border-gray-700 p-2 text-center text-xs tracking-wider">
            <p className="performance-header-text">
              PORTFOLIO PERFORMANCE
              <p className="performance-header-small-text">
                90-day numbers now include cash for accurate performance.
              </p>
            </p>
          </div>

          <div className="performance-body p-4">
            {/* Day return */}
            <div className="text-center mb-4">
              <p className="text-gray-400 text-xs mb-1">DAY RETURN</p>
              <p className={dayUp ? "chart-period-up" : "chart-period-down"}>
                {dayUp ? "+" : ""}
                {dayPct}%
              </p>
            </div>

            {/* 90-day chart */}
            <div className="mb-4 relative h-[175px]">
              <div className="flex gap-2 items-center mb-2">
                <span className="px-2 py-1 bg-gray-700 text-xs rounded">
                  90 DAYS
                </span>
                <span
                  className={ninetyUp ? "chart-period-up" : "chart-period-down"}
                >
                  {ninetyUp ? "+" : ""}
                  {ninetyPct}%
                </span>
              </div>

              {hasChartData ? (
                <svg
                  viewBox={`0 0 ${w} ${h}`}
                  className="absolute inset-0 w-full h-full"
                >
                  {hasSpyData && (
                    <polyline
                      fill="none"
                      stroke="#3b02f6"
                      strokeWidth={2}
                      opacity={0.5}
                      points={pts(spyY)}
                    />
                  )}

                  {/* PORTFOLIO */}
                  <polyline
                    fill="none"
                    stroke={ninetyUp ? "#4ade80" : "#f87171"}
                    strokeWidth={2}
                    points={pts(portY)}
                  />
                </svg>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-center text-sm text-gray-400">
                  Waiting for enough market data to draw the chart.
                </div>
              )}
            </div>

            {/* Alpha */}
            <div className="text-center mb-4">
              <p className="text-gray-400 text-xs mb-1">
                ALPHA vs S&P (window)
              </p>
              {hasSpyData ? (
                <p className={alphaUp ? "chart-period-up" : "chart-period-down"}>
                  {alphaUp ? "+" : ""}
                  {alphaPct}%
                </p>
              ) : (
                <p className="text-gray-400">SPY unavailable</p>
              )}
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
