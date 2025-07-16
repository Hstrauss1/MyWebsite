/* app/morningRoutine/page.tsx */
"use client";

import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import useSWR from "swr";
import * as React from "react";

/* ───────────── types ───────────── */
type MorningInfo = {
  date: string;
  dayOfWeek: string;
  greeting: string;
  timeOfDay: string;
  weekProgress: number;
  monthProgress: number;
  tip: string;
};

type AlgoItem = {
  title: string;
  url: string;
  difficulty: "Easy" | "Medium" | "Hard";
};

type AlgoResponse = {
  problems: AlgoItem[];
  mode: "easy_medium" | "hard";
  totalCount: number;
};

type MathItem = {
  questions: Array<{
    question: string;
    answer: number;
  }>;
  totalCount: number;
};

type TeaserItem = {
  title: string;
  prompt: string;
  answer: string;
  category: string;
};

type QuoteItem = {
  text: string;
  author: string;
  category: string;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function MorningRoutinePage() {
  const { data: info } = useSWR<MorningInfo>("/api/morning-info", fetcher);
  const { data: algo } = useSWR<AlgoResponse>("/api/neetcode", fetcher);
  const { data: math } = useSWR<MathItem>("/api/math", fetcher);
  const { data: teaser } = useSWR<TeaserItem>("/api/teaser", fetcher);
  const { data: quote } = useSWR<QuoteItem>("/api/quote", fetcher);

  const loading = !info || !algo || !math || !teaser || !quote;

  const [mathInput, setMathInput] = React.useState("");
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [feedback, setFeedback] = React.useState<string | null>(null);

  const checkAnswer = () => {
    if (!math) return;
    const correct = math.questions[currentIndex].answer;
    const user = parseFloat(mathInput);
    if (Math.abs(user - correct) < 0.01) {
      setFeedback("Correct!");
    } else {
      setFeedback(`Incorrect. Correct answer: ${correct}`);
    }
    setTimeout(() => {
      setFeedback(null);
      setMathInput("");
      setCurrentIndex((prev) => (prev + 1) % math.questions.length);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      <ThemeToggle />
      <div className="project-detail-container max-w-7xl mx-auto px-4 py-8">
        <Link href="/" className="back-button text-xl mb-6 inline-block">
          ←
        </Link>

        <h1 className="project-detail-title text-center text-3xl font-bold mb-8">
          Morning Routine
        </h1>

        {loading && (
          <p className="text-center text-gray-400 italic">Loading...</p>
        )}

        {!loading && info && (
          <div className="stock-row-container-head font-semibold bg-[#062940]">
            <div className="ticker-box">
              <span className="ticker-text">{info.greeting}</span>
            </div>
            <div className="stock-stats-row">
              <div className="stat-item" style={{ width: "20%" }}>
                {info.date}
              </div>
              <div className="stat-item" style={{ width: "20%" }}>
                Week: {info.weekProgress}%
              </div>
              <div className="stat-item" style={{ width: "20%" }}>
                Month: {info.monthProgress}%
              </div>
              <div className="stat-item" style={{ width: "40%" }}>
                {info.tip}
              </div>
            </div>
          </div>
        )}

        {!loading &&
          algo?.problems.map((p, i) => (
            <div key={i} className="stock-row-container">
              <div className="ticker-box">
                <span className="ticker-text">{p.title}</span>
              </div>
              <div className="stock-stats-row">
                <div className="stat-item" style={{ width: "20%" }}>
                  {p.difficulty}
                </div>
                <div className="stat-item" style={{ width: "60%" }}>
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    Solve Problem
                  </a>
                </div>
                <div className="stat-item" style={{ width: "20%" }}>
                  {algo.mode}
                </div>
              </div>
            </div>
          ))}

        {!loading && math && math.questions.length > 0 && (
          <div className="stock-row-container">
            <div className="ticker-box">
              <span className="ticker-text">Math</span>
            </div>
            <div className="stock-stats-row flex-col items-start text-left gap-2 p-4">
              <div className="text-blue-300">
                Q{currentIndex + 1}: {math.questions[currentIndex].question} = ?
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  checkAnswer();
                }}
                className="math-box"
              >
                <input
                  type="number"
                  className="math-input"
                  value={mathInput}
                  onChange={(e) => setMathInput(e.target.value)}
                  placeholder="Enter your answer"
                />
                <button type="submit" className="math-submit">
                  Submit
                </button>
              </form>

              {feedback && (
                <div className="text-sm mt-2 text-yellow-400">{feedback}</div>
              )}
            </div>
          </div>
        )}

        {!loading && teaser && (
          <div className="stock-row-container">
            <div className="ticker-box">
              <span className="ticker-text">Teaser</span>
            </div>
            <div className="stock-stats-row">
              <div className="stat-item" style={{ width: "40%" }}>
                {teaser.title}
              </div>
              <div className="stat-item" style={{ width: "60%" }}>
                {teaser.prompt}
              </div>
            </div>
          </div>
        )}

        {!loading && quote && (
          <div className="stock-row-container">
            <div className="ticker-box">
              <span className="ticker-text">Quote</span>
            </div>
            <div className="stock-stats-row">
              <div className="stat-item" style={{ width: "60%" }}>
                "{quote.text}"
              </div>
              <div className="stat-item" style={{ width: "20%" }}>
                {quote.author}
              </div>
              <div className="stat-item" style={{ width: "20%" }}>
                {quote.category}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
