// pages/api/math-stats.ts
import type { NextApiRequest, NextApiResponse } from "next";

/* ───────────── types ───────────── */
type MathSession = {
  date: string;
  questionsAttempted: number;
  questionsCorrect: number;
  accuracy: number;
  timeSpent: number; // in seconds
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

/* ───────────── in-memory storage (replace with database in production) ───────────── */
let mathSessions: MathSession[] = [];

/* ───────────── helper functions ───────────── */
function getDateString(date: Date = new Date()): string {
  return date.toISOString().split("T")[0];
}

function getWeekString(date: Date): string {
  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() - date.getDay());
  return startOfWeek.toISOString().split("T")[0];
}

function calculateStreak(sessions: MathSession[]): {
  current: number;
  longest: number;
} {
  if (sessions.length === 0) return { current: 0, longest: 0 };

  const sortedSessions = sessions.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  let lastDate = new Date();

  // Calculate current streak (consecutive days from today backwards)
  for (const session of sortedSessions) {
    const sessionDate = new Date(session.date);
    const daysDiff = Math.floor(
      (lastDate.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysDiff <= 1 && currentStreak === 0) {
      currentStreak = 1;
      tempStreak = 1;
    } else if (daysDiff === 1) {
      currentStreak++;
      tempStreak++;
    } else {
      break;
    }
    lastDate = sessionDate;
  }

  // Calculate longest streak
  const dailySessions = sessions.reduce((acc, session) => {
    const date = session.date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(session);
    return acc;
  }, {} as { [date: string]: MathSession[] });

  const dates = Object.keys(dailySessions).sort();
  let streak = 0;

  for (let i = 0; i < dates.length; i++) {
    if (
      i === 0 ||
      new Date(dates[i]).getTime() - new Date(dates[i - 1]).getTime() ===
        24 * 60 * 60 * 1000
    ) {
      streak++;
      longestStreak = Math.max(longestStreak, streak);
    } else {
      streak = 1;
    }
  }

  return { current: currentStreak, longest: longestStreak };
}

function generateMathStats(): MathStats {
  if (mathSessions.length === 0) {
    return {
      totalSessions: 0,
      totalQuestions: 0,
      totalCorrect: 0,
      overallAccuracy: 0,
      averageSessionAccuracy: 0,
      bestAccuracy: 0,
      currentStreak: 0,
      longestStreak: 0,
      recentSessions: [],
      dailyStats: {},
      weeklyTrends: [],
      categoryPerformance: {
        basicArithmetic: { attempted: 0, correct: 0, accuracy: 0 },
        squares: { attempted: 0, correct: 0, accuracy: 0 },
        division: { attempted: 0, correct: 0, accuracy: 0 },
        mixed: { attempted: 0, correct: 0, accuracy: 0 },
        percentages: { attempted: 0, correct: 0, accuracy: 0 },
      },
    };
  }

  const totalQuestions = mathSessions.reduce(
    (sum, session) => sum + session.questionsAttempted,
    0
  );
  const totalCorrect = mathSessions.reduce(
    (sum, session) => sum + session.questionsCorrect,
    0
  );
  const overallAccuracy =
    totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;

  const sessionAccuracies = mathSessions.map((s) => s.accuracy);
  const averageSessionAccuracy =
    sessionAccuracies.reduce((sum, acc) => sum + acc, 0) /
    sessionAccuracies.length;
  const bestAccuracy = Math.max(...sessionAccuracies);

  const streaks = calculateStreak(mathSessions);

  // Daily stats
  const dailyStats = mathSessions.reduce((acc, session) => {
    const date = session.date;
    if (!acc[date]) {
      acc[date] = {
        sessions: 0,
        questionsAttempted: 0,
        questionsCorrect: 0,
        accuracy: 0,
        timeSpent: 0,
      };
    }
    acc[date].sessions++;
    acc[date].questionsAttempted += session.questionsAttempted;
    acc[date].questionsCorrect += session.questionsCorrect;
    acc[date].timeSpent += session.timeSpent;
    acc[date].accuracy =
      (acc[date].questionsCorrect / acc[date].questionsAttempted) * 100;
    return acc;
  }, {} as MathStats["dailyStats"]);

  // Weekly trends (last 8 weeks)
  const weeklyTrends: MathStats["weeklyTrends"] = [];
  const now = new Date();
  for (let i = 7; i >= 0; i--) {
    const weekDate = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
    const weekString = getWeekString(weekDate);

    const weekSessions = mathSessions.filter((session) => {
      const sessionWeek = getWeekString(new Date(session.date));
      return sessionWeek === weekString;
    });

    if (weekSessions.length > 0) {
      const weekQuestions = weekSessions.reduce(
        (sum, s) => sum + s.questionsAttempted,
        0
      );
      const weekCorrect = weekSessions.reduce(
        (sum, s) => sum + s.questionsCorrect,
        0
      );
      const weekAccuracy =
        weekQuestions > 0 ? (weekCorrect / weekQuestions) * 100 : 0;

      weeklyTrends.push({
        week: weekString,
        averageAccuracy: weekAccuracy,
        totalQuestions: weekQuestions,
        sessionsCompleted: weekSessions.length,
      });
    }
  }

  // Recent sessions (last 10)
  const recentSessions = mathSessions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  return {
    totalSessions: mathSessions.length,
    totalQuestions,
    totalCorrect,
    overallAccuracy,
    averageSessionAccuracy,
    bestAccuracy,
    currentStreak: streaks.current,
    longestStreak: streaks.longest,
    recentSessions,
    dailyStats,
    weeklyTrends,
    categoryPerformance: {
      basicArithmetic: { attempted: 0, correct: 0, accuracy: 0 },
      squares: { attempted: 0, correct: 0, accuracy: 0 },
      division: { attempted: 0, correct: 0, accuracy: 0 },
      mixed: { attempted: 0, correct: 0, accuracy: 0 },
      percentages: { attempted: 0, correct: 0, accuracy: 0 },
    },
  };
}

/* ───────────── handler ───────────── */
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<MathStats | { message: string }>
) {
  if (req.method === "GET") {
    // Return current stats
    const stats = generateMathStats();
    res.status(200).json(stats);
  } else if (req.method === "POST") {
    // Add new session data
    const sessionData: Partial<MathSession> = req.body;

    if (!sessionData.questionsAttempted || !sessionData.questionsCorrect) {
      return res.status(400).json({ message: "Missing required session data" });
    }

    const newSession: MathSession = {
      date: getDateString(),
      questionsAttempted: sessionData.questionsAttempted,
      questionsCorrect: sessionData.questionsCorrect,
      accuracy:
        (sessionData.questionsCorrect / sessionData.questionsAttempted) * 100,
      timeSpent: sessionData.timeSpent || 0,
      averageTimePerQuestion: sessionData.timeSpent
        ? sessionData.timeSpent / sessionData.questionsAttempted
        : 0,
      sessionId: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };

    mathSessions.push(newSession);

    // Keep only last 100 sessions to prevent memory issues
    if (mathSessions.length > 100) {
      mathSessions = mathSessions.slice(-100);
    }

    res.status(201).json({ message: "Session recorded successfully" });
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).json({ message: "Method not allowed" });
  }
}
