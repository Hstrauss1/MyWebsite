/* app/mindwarm/page.tsx */
"use client";

import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import useSWR from "swr";
import * as React from "react";

/* ───────────── helper ───────────── */
const fetcher = (url: string) => fetch(url).then((r) => r.json());

/* ───────────── data shapes ───────────── */
type AlgoItem = {
  title: string;
  url: string;
  difficulty: "Easy" | "Medium" | "Hard";
};

type MathItem = {
  question: string; // e.g. "5(17²)-20"
  answer: number; // returned but kept hidden until user clicks “Reveal”
};

type TeaserItem = {
  title: string;
  prompt: string;
  answer: string;
};

/* ───────────── page component ───────────── */
export default function MindWarmPage() {
  /* parallel fetches */
  const { data: algo, error: algoErr } = useSWR<AlgoItem>(
    "/api/neetcode",
    fetcher
  );
  const { data: math, error: mathErr } = useSWR<MathItem>("/api/math", fetcher);
  const { data: teaser, error: tErr } = useSWR<TeaserItem>(
    "/api/teaser",
    fetcher
  );

  const loading = !algo && !algoErr && !math && !mathErr && !teaser && !tErr;

  /* local state for answer reveals */
  const [showMathAns, setShowMathAns] = React.useState(false);
  const [showTeaserAns, setShowTeaserAns] = React.useState(false);

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      <ThemeToggle />

      <div className="project-detail-container max-w-7xl mx-auto px-4 py-8">
        {/* back button */}
        <Link href="/" className="back-button text-xl mb-6 inline-block">
          ←
        </Link>

        {/* title */}
        <h1 className="project-detail-title text-center text-3xl font-bold mb-8">
          Morning MindWarm ↯
        </h1>

        {/* state messages */}
        {loading && (
          <p className="text-center text-gray-400 italic">Warming up…</p>
        )}
        {(algoErr || mathErr || tErr) && (
          <p className="text-center text-red-400">
            Oops! Couldn’t load everything.
          </p>
        )}

        {/* cards */}
        {!loading && (
          <div className="flex flex-col gap-[100px] px-4">
            {/* ────────── NeetCode Card ────────── */}
            {algo && (
              <div className="stock-row-container">
                <div className="ticker-box">
                  <span className="ticker-text">NeetCode</span>
                </div>
                <div className="stock-stats-row">
                  <div className="stat-item" style={{ width: "25%" }}>
                    <Link
                      href={algo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="details-button"
                    >
                      Solve Problem
                    </Link>
                  </div>
                  <div className="stat-item" style={{ width: "25%" }}>
                    Difficulty:{" "}
                    <span
                      className={
                        algo.difficulty === "Easy"
                          ? "chart-period-up"
                          : algo.difficulty === "Medium"
                          ? "SP"
                          : "chart-period-down"
                      }
                    >
                      {algo.difficulty}
                    </span>
                  </div>
                  <div className="stat-item" style={{ width: "40%" }}>
                    {algo.title}
                  </div>
                </div>
              </div>
            )}

            {/* ────────── Quick-Math Card ────────── */}
            {math && (
              <div className="stock-row-container">
                <div className="ticker-box">
                  <span className="ticker-text">Math</span>
                </div>
                <div className="stock-stats-row">
                  <div className="stat-item" style={{ width: "40%" }}>
                    {math.question}
                  </div>
                  <div className="stat-item" style={{ width: "40%" }}>
                    {showMathAns ? (
                      <span className="chart-period-up">{math.answer}</span>
                    ) : (
                      <button
                        onClick={() => setShowMathAns(true)}
                        className="details-button"
                      >
                        Reveal Answer
                      </button>
                    )}
                  </div>
                  <div className="stat-item" style={{ width: "15%" }}>
                    {/* placeholder if you want a timer / score */}
                  </div>
                </div>
              </div>
            )}

            {/* ────────── Brain-Teaser Card ────────── */}
            {teaser && (
              <div className="stock-row-container">
                <div className="ticker-box">
                  <span className="ticker-text">Teaser</span>
                </div>
                <div className="stock-stats-row">
                  <div className="stat-item" style={{ width: "35%" }}>
                    {teaser.title}
                  </div>
                  <div className="stat-item" style={{ width: "45%" }}>
                    {teaser.prompt}
                  </div>
                  <div className="stat-item" style={{ width: "20%" }}>
                    {showTeaserAns ? (
                      <span className="chart-period-up">{teaser.answer}</span>
                    ) : (
                      <button
                        onClick={() => setShowTeaserAns(true)}
                        className="details-button"
                      >
                        Show Solution
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
