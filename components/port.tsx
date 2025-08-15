/* components/PortfolioWidget.tsx */
"use client";
import useSWR from "swr";
import Link from "next/link";

/* --- helpers: disable caching on fetch ---------------------------------- */
const fetchJSON = (url: string) =>
  fetch(url, { cache: "no-store", next: { revalidate: 0 } }).then((r) =>
    r.json()
  );

const postJSON = <T,>(url: string, body: T) =>
  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    next: { revalidate: 0 },
    body: JSON.stringify(body),
  }).then((r) => r.json());

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
  const w = 825,
    h = 175;

  /* SWR: disable client cache and auto revalidation */
  const swrNoCache = {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 0,
  } as const;

  const { data: portData, error: portErr } = useSWR(
    "/api/portfolio",
    fetchJSON,
    swrNoCache
  );

  const { data: spyData, error: spyErr } = useSWR(
    portData ? ["/api/spy", portData.dayISO] : null,
    ([url, dayISO]) => postJSON(url, { dayISO }),
    swrNoCache
  );

  if (portErr || spyErr)
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-900">
        <MiniCard message="Error loading data, reload page." />
      </div>
    );
  if (!portData || !spyData)
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-900">
        <MiniCard message="Loading…" />
      </div>
    );

  /* --- align by date & drop holidays ------------------------------------ */
  const portValues: number[] = portData.sparkline; // total $ value
  const spyValues: (number | null)[] = spyData.prices; // null = holiday

  const alignedPort: number[] = [];
  const alignedSpy: number[] = [];
  spyValues.forEach((v, i) => {
    if (v != null) {
      alignedPort.push(portValues[i]);
      alignedSpy.push(v);
    }
  });

  /* --- % return helpers -------------------------------------------------- */
  const toPctSeries = (series: number[]) => {
    const base = Math.max(series[0] ?? 1, 1e-6);
    return series.map((v) => (v - base) / base);
  };
  const portPct = toPctSeries(alignedPort);
  const spyPct = toPctSeries(alignedSpy);

  /* --- regular alpha (= excess total return) ----------------------------- */
  const portRet = portPct.at(-1) ?? 0;
  const spyRet = spyPct.at(-1) ?? 0;
  const alpha = portRet - spyRet;
  const alphaPct = (alpha * 100).toFixed(2);
  const alphaUp = alpha >= 0;

  /* --- day change & 90-day change --------------------------------------- */
  const dayPct = (portData.changePercent ?? 0).toFixed(2);
  const dayUp = (portData.changePercent ?? 0) >= 0;
  const ninetyPct = (
    ((alignedPort.at(-1)! - alignedPort[0]) / alignedPort[0]) *
    100
  ).toFixed(2);
  const ninetyUp = parseFloat(ninetyPct) >= 0;

  /* --- sparkline coordinate helpers ------------------------------------- */
  const normY = (vals: number[]) => {
    const min = Math.min(...vals);
    const span = Math.max(...vals) - min || 1;
    return vals.map((v) => h - ((v - min) / span) * h);
  };
  const shift = 7; // subtle visual lift for portfolio
  const shiftd = -7;
  const spyY = normY(alignedSpy).map((y) => y - shiftd);
  const portY = normY(alignedPort).map((y) => y - shift);

  const pts = (ys: number[]) =>
    ys
      .map(
        (y, i) => `${((i / (ys.length - 1)) * w).toFixed(2)},${y.toFixed(2)}`
      )
      .join(" ");

  /* --- render ------------------------------------------------------------ */
  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-900">
      <div className="bottom-section text-white">
        <h2 className="performance-title text-sm tracking-wider text-gray-400 mb-2">
          The Port
        </h2>

        <div className="performance-card border border-gray-700 rounded bg-gray-800 w-[300px] relative">
          <div className="performance-header border-b border-gray-700 p-2 text-center text-xs tracking-wider">
            <p className="performance-header-text">
              {" "}
              PORTFOLIO PERFORMANCE{" "}
              <p className="performance-header-small-text">
                May be skewed by recent trades.
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

              <svg
                viewBox={`0 0 ${w} ${h}`}
                className="absolute inset-0 w-full h-full"
              >
                <polyline
                  fill="none"
                  stroke="#3b02f6" /* SPY blue */
                  strokeWidth={2}
                  opacity={0.5}
                  points={pts(spyY)}
                />
                <polyline
                  fill="none"
                  stroke={ninetyUp ? "#4ade80" : "#f87171"} /* green/red */
                  strokeWidth={2}
                  points={pts(portY)}
                />
              </svg>
            </div>

            {/* Regular alpha */}
            <div className="text-center mb-4">
              <p className="text-gray-400 text-xs mb-1">ALPHA vs S&P (90 d)</p>
              <p className={alphaUp ? "chart-period-up" : "chart-period-down"}>
                {alphaUp ? "+" : ""}
                {alphaPct}%
              </p>
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
