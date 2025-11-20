/* components/PortfolioWidget.tsx */
"use client";
import useSWR from "swr";
import Link from "next/link";

/* --- helpers ------------------------------------------------------------- */
const fetchJSON = (url: string) => fetch(url).then((r) => r.json());
const postJSON = <T,>(url: string, body: T) =>
  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).then((r) => r.json());

const MiniCard = ({ message }: { message: string }) => (
  <div className="bottom-section text-white">
    <div className="performance-card border border-gray-700 rounded bg-gray-800 w-[300px]">
      <div className="performance-body p-4 flex items-center justify-center h-[140px]">
        <span className="text-gray-400 text-sm italic">{message}</span>
      </div>
    </div>
  </div>
);

/* --- main widget --------------------------------------------------------- */
export default function PortfolioWidgetNo() {
  const w = 825;
  const h = 175;

  const { data: portData, error: portErr } = useSWR(
    "/api/portfolio",
    fetchJSON
  );

  const { data: spyData, error: spyErr } = useSWR(
    portData ? ["/api/spy", portData.dayISO] : null,
    ([url, dayISO]) => postJSON(url, { dayISO })
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
  const portValues: number[] = portData.sparkline; // total $ value (should already include cash if backend does)
  const spyValues: (number | null)[] = spyData.prices; // null = holiday

  const alignedPort: number[] = [];
  const alignedSpy: number[] = [];

  spyValues.forEach((v, i) => {
    if (v != null) {
      alignedPort.push(portValues[i]);
      alignedSpy.push(v);
    }
  });

  /* --- compute returns directly from aligned series --------------------- */
  let alphaPct = "0.00";
  let alphaUp = true;
  let ninetyPct = "0.00";
  let ninetyUp = true;

  if (alignedPort.length >= 2 && alignedSpy.length >= 2) {
    const p0 = alignedPort[0];
    const pT = alignedPort[alignedPort.length - 1];
    const s0 = alignedSpy[0];
    const sT = alignedSpy[alignedSpy.length - 1];

    const portfolioRet = p0 > 0 ? pT / p0 - 1 : 0;
    const spyRet = s0 > 0 ? sT / s0 - 1 : 0;

    const alpha = portfolioRet - spyRet;
    alphaPct = (alpha * 100).toFixed(2);
    alphaUp = alpha >= 0;

    ninetyPct = (portfolioRet * 100).toFixed(2);
    ninetyUp = parseFloat(ninetyPct) >= 0;
  }

  /* --- day change (from backend 1-day changePercent) -------------------- */
  const dayPct = (portData.changePercent ?? 0).toFixed(2);
  const dayUp = (portData.changePercent ?? 0) >= 0;

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
        (y, i) =>
          `${((i / Math.max(ys.length - 1, 1)) * w).toFixed(2)},${y.toFixed(2)}`
      )
      .join(" ");

  /* --- render ------------------------------------------------------------ */
  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-900">
      <div className="bottom-section text-white">
        <h2 className="performance-title text-sm tracking-wider text-gray-400 mb-2">
          Graphs
        </h2>

        <div className="performance-card border border-gray-700 rounded bg-gray-800 w-[300px] relative">
          <div className="performance-header border-b border-gray-700 p-2 text-center text-xs tracking-wider">
            <p className="performance-header-text">
              PORTFOLIO PERFORMANCE
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
                {/* SPY */}
                <polyline
                  fill="none"
                  stroke="#3b02f6" /* SPY blue */
                  strokeWidth={2}
                  opacity={0.5}
                  points={pts(spyY)}
                />
                {/* Portfolio */}
                <polyline
                  fill="none"
                  stroke={ninetyUp ? "#4ade80" : "#f87171"} /* green/red */
                  strokeWidth={2}
                  points={pts(portY)}
                />
              </svg>
            </div>

            {/* Alpha */}
            <div className="text-center mb-4">
              <p className="text-gray-400 text-xs mb-1">
                ALPHA vs <span className="SP">S&amp;P</span> (90 d)
              </p>
              <p className={alphaUp ? "chart-period-up" : "chart-period-down"}>
                {alphaUp ? "+" : ""}
                {alphaPct}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
