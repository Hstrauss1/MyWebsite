/* app/math-stats/page.tsx */
"use client";

import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import Sparkline from "@/components/Sparkline";
import useSWR from "swr";
import * as React from "react";

/* ───────────── helper ───────────── */
const fetcher = (url: string) => fetch(url).then((r) => r.json());

/* ───────────── data shapes ───────────── */
type MathSession = {
  date: string;
  questionsAttempted: number;
  questionsCorrect: number;
  accuracy: number;
  timeSpent: number;
  averageTimePerQuestion: number;
  sessionId: string;
};

type MathStats = {
  totalSessions: number;
  totalQuestions: number;
  totalCorrect: number;
  overallAccuracy: number;
  averageSessionAccuracy: number;
  bestAccuracy: number;
  currentStreak: number;
  longestStreak: number;
  recentSessions: MathSession[];
  dailyStats: {
    [date: string]: {
      sessions: number;
      questionsAttempted: number;
      questionsCorrect: number;
      accuracy: number;
      timeSpent: number;
    };
  };
  weeklyTrends: {
    week: string;
    averageAccuracy: number;
    totalQuestions: number;
    sessionsCompleted: number;
  }[];
  categoryPerformance: {
    basicArithmetic: { attempted: number; correct: number; accuracy: number };
    squares: { attempted: number; correct: number; accuracy: number };
    division: { attempted: number; correct: number; accuracy: number };
    mixed: { attempted: number; correct: number; accuracy: number };
    percentages: { attempted: number; correct: number; accuracy: number };
  };
};

/* ───────────── page component ───────────── */
export default function MathStatsPage() {
  const {
    data: stats,
    error,
    mutate,
  } = useSWR<MathStats>("/api/math-stats", fetcher);

  const loading = !stats && !error;

  // Prepare sparkline data
  const accuracyTrend =
    stats?.recentSessions
      .slice()
      .reverse()
      .map((session) => session.accuracy) || [];

  const dailyAccuracyTrend = stats
    ? Object.entries(stats.dailyStats)
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-14) // Last 14 days
        .map(([, data]) => data.accuracy)
    : [];

  const weeklyAccuracyTrend =
    stats?.weeklyTrends.map((week) => week.averageAccuracy) || [];

  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      <ThemeToggle />

      <div className="project-detail-container max-w-7xl mx-auto px-4 py-8">
        {/* back button */}
        <Link
          href="/morningRoutine"
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-300 bg-neutral-800 border border-neutral-700 rounded-lg hover:bg-neutral-700 hover:text-white transition-colors mb-6"
        >
          ← Back to Morning Routine
        </Link>

        {/* header */}
        <div className="text-center mb-8">
          <h1 className="project-detail-title text-3xl font-bold mb-4">
            Math Performance Analytics
          </h1>
          <p className="text-gray-400">
            Track your daily math warm-up progress and performance trends
          </p>
        </div>

        {/* loading state */}
        {loading && (
          <p className="text-center text-gray-400 italic mb-8">
            Loading your math statistics...
          </p>
        )}

        {/* error state */}
        {error && (
          <p className="text-center text-red-400 mb-8">
            Unable to load statistics. Please try again later.
          </p>
        )}

        {/* main stats dashboard */}
        {stats && (
          <div className="space-y-8">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-neutral-800/50 rounded-lg p-6 border border-neutral-700/50">
                <div className="text-2xl font-bold text-blue-400 mb-1">
                  {stats.totalSessions}
                </div>
                <div className="text-sm text-gray-400">Total Sessions</div>
              </div>

              <div className="bg-neutral-800/50 rounded-lg p-6 border border-neutral-700/50">
                <div className="text-2xl font-bold text-green-400 mb-1">
                  {stats.overallAccuracy.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-400">Overall Accuracy</div>
              </div>

              <div className="bg-neutral-800/50 rounded-lg p-6 border border-neutral-700/50">
                <div className="text-2xl font-bold text-purple-400 mb-1">
                  {stats.currentStreak}
                </div>
                <div className="text-sm text-gray-400">Current Streak</div>
              </div>

              <div className="bg-neutral-800/50 rounded-lg p-6 border border-neutral-700/50">
                <div className="text-2xl font-bold text-yellow-400 mb-1">
                  {stats.bestAccuracy.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-400">Best Accuracy</div>
              </div>
            </div>

            {/* Sparkline Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Session Accuracy Trend */}
              <div className="bg-neutral-800/50 rounded-lg p-6 border border-neutral-700/50">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Recent Session Accuracy
                </h3>
                <div className="mb-4">
                  <Sparkline
                    data={accuracyTrend}
                    width={300}
                    height={60}
                    color="#3b82f6"
                    strokeWidth={2}
                    fillColor="#3b82f6"
                    showDots={true}
                    className="w-full"
                  />
                </div>
                <div className="text-sm text-gray-400">
                  Last {accuracyTrend.length} sessions
                </div>
              </div>

              {/* Daily Accuracy Trend */}
              <div className="bg-neutral-800/50 rounded-lg p-6 border border-neutral-700/50">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Daily Accuracy (14 Days)
                </h3>
                <div className="mb-4">
                  <Sparkline
                    data={dailyAccuracyTrend}
                    width={300}
                    height={60}
                    color="#10b981"
                    strokeWidth={2}
                    fillColor="#10b981"
                    showDots={false}
                    className="w-full"
                  />
                </div>
                <div className="text-sm text-gray-400">
                  Past 2 weeks performance
                </div>
              </div>
            </div>

            {/* Weekly Trends */}
            {weeklyAccuracyTrend.length > 0 && (
              <div className="bg-neutral-800/50 rounded-lg p-6 border border-neutral-700/50">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Weekly Accuracy Trends
                </h3>
                <div className="mb-4">
                  <Sparkline
                    data={weeklyAccuracyTrend}
                    width={600}
                    height={80}
                    color="#8b5cf6"
                    strokeWidth={3}
                    fillColor="#8b5cf6"
                    showDots={true}
                    className="w-full"
                  />
                </div>
                <div className="text-sm text-gray-400">
                  Weekly average accuracy over time
                </div>
              </div>
            )}

            {/* Detailed Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Performance Summary */}
              <div className="bg-neutral-800/50 rounded-lg p-6 border border-neutral-700/50">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Performance Summary
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Questions:</span>
                    <span className="text-white">{stats.totalQuestions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Correct Answers:</span>
                    <span className="text-green-400">{stats.totalCorrect}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">
                      Average Session Accuracy:
                    </span>
                    <span className="text-blue-400">
                      {stats.averageSessionAccuracy.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Longest Streak:</span>
                    <span className="text-purple-400">
                      {stats.longestStreak} days
                    </span>
                  </div>
                </div>
              </div>

              {/* Recent Sessions */}
              <div className="bg-neutral-800/50 rounded-lg p-6 border border-neutral-700/50">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Recent Sessions
                </h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {stats.recentSessions.slice(0, 8).map((session, index) => (
                    <div
                      key={session.sessionId}
                      className="flex justify-between items-center py-2 border-b border-neutral-700/30 last:border-b-0"
                    >
                      <div>
                        <div className="text-sm text-white">
                          {formatDate(session.date)}
                        </div>
                        <div className="text-xs text-gray-400">
                          {session.questionsCorrect}/
                          {session.questionsAttempted} questions
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className={`text-sm font-medium ${
                            session.accuracy >= 80
                              ? "text-green-400"
                              : session.accuracy >= 60
                              ? "text-yellow-400"
                              : "text-red-400"
                          }`}
                        >
                          {session.accuracy.toFixed(1)}%
                        </div>
                        {session.timeSpent > 0 && (
                          <div className="text-xs text-gray-400">
                            {formatTime(session.timeSpent)}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Daily Breakdown */}
            {Object.keys(stats.dailyStats).length > 0 && (
              <div className="bg-neutral-800/50 rounded-lg p-6 border border-neutral-700/50">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Daily Breakdown
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(stats.dailyStats)
                    .sort(([a], [b]) => b.localeCompare(a))
                    .slice(0, 9)
                    .map(([date, data]) => (
                      <div
                        key={date}
                        className="bg-neutral-700/30 rounded-lg p-4"
                      >
                        <div className="text-sm font-medium text-white mb-2">
                          {formatDate(date)}
                        </div>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Sessions:</span>
                            <span className="text-white">{data.sessions}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Questions:</span>
                            <span className="text-white">
                              {data.questionsAttempted}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Accuracy:</span>
                            <span
                              className={`${
                                data.accuracy >= 80
                                  ? "text-green-400"
                                  : data.accuracy >= 60
                                  ? "text-yellow-400"
                                  : "text-red-400"
                              }`}
                            >
                              {data.accuracy.toFixed(1)}%
                            </span>
                          </div>
                          {data.timeSpent > 0 && (
                            <div className="flex justify-between">
                              <span className="text-gray-400">Time:</span>
                              <span className="text-white">
                                {formatTime(data.timeSpent)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Empty state */}
        {stats && stats.totalSessions === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              No math sessions recorded yet.
            </div>
            <Link
              href="/morningRoutine"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-blue-500 rounded-lg hover:bg-blue-700 hover:border-blue-400 transition-colors"
            >
              Start Your First Session
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
