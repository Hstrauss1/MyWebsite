// pages/api/morning-info.ts
import type { NextApiRequest, NextApiResponse } from "next";

/* ───────────── types ───────────── */
type MorningInfo = {
  date: string;
  dayOfWeek: string;
  greeting: string;
  timeOfDay: string;
  weekProgress: number; // 0-100 percentage through the week
  monthProgress: number; // 0-100 percentage through the month
  tip: string;
};

/* ───────────── helpers ───────────── */
function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 6) return "Early bird! 🌅";
  if (hour < 12) return "Good morning! ☀️";
  if (hour < 17) return "Good afternoon! 🌤️";
  if (hour < 21) return "Good evening! 🌆";
  return "Night owl! 🌙";
}

function getTimeOfDay(): string {
  const hour = new Date().getHours();
  if (hour < 6) return "Early Morning";
  if (hour < 12) return "Morning";
  if (hour < 17) return "Afternoon";
  if (hour < 21) return "Evening";
  return "Night";
}

function getWeekProgress(): number {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const hour = now.getHours();
  const minute = now.getMinutes();

  // Calculate progress through the week (Monday = start)
  const adjustedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Monday = 0, Sunday = 6
  const totalMinutesInWeek = 7 * 24 * 60;
  const currentMinutes = adjustedDay * 24 * 60 + hour * 60 + minute;

  return Math.round((currentMinutes / totalMinutesInWeek) * 100);
}

function getMonthProgress(): number {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const day = now.getDate();
  const hour = now.getHours();
  const minute = now.getMinutes();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const totalMinutesInMonth = daysInMonth * 24 * 60;
  const currentMinutes = (day - 1) * 24 * 60 + hour * 60 + minute;

  return Math.round((currentMinutes / totalMinutesInMonth) * 100);
}

function getDailyTip(): string {
  const tips = [
    "Start with your most important task - eat that frog! 🐸",
    "Take breaks every 90 minutes to maintain peak focus 🧠",
    "Drink water first thing in the morning to kickstart your metabolism 💧",
    "Write down 3 things you're grateful for today 📝",
    "Do a 5-minute stretch or walk to energize your body 🚶‍♂️",
    "Review your goals - what's one step you can take today? 🎯",
    "Practice the 2-minute rule: if it takes less than 2 minutes, do it now ⏰",
    "Limit decision fatigue - prepare what you can the night before 🌙",
    "Use the Pomodoro Technique: 25 minutes focused work, 5 minute break 🍅",
    "Connect with someone meaningful today - send a quick message 💬",
    "Learn something new for 10 minutes - curiosity keeps you sharp 📚",
    "Practice deep breathing: 4 counts in, hold 4, out 4, hold 4 🫁",
    "Tidy your workspace - a clear space helps a clear mind 🧹",
    "Set boundaries with your time and energy today 🛡️",
    "Celebrate small wins - progress is progress! 🎉",
    "Ask yourself: What would make today feel successful? 💭",
    "Single-task instead of multitasking for better quality work 🎯",
    "Take a moment to appreciate how far you've come 🌱",
    "Plan tomorrow tonight - your future self will thank you 📅",
    "Remember: done is better than perfect ✅",
  ];

  const day = new Date().toISOString().split("T")[0];
  let hash = 0;
  for (let i = 0; i < day.length; i++) {
    hash = (hash << 5) - hash + day.charCodeAt(i);
    hash |= 0;
  }
  const idx = Math.abs(hash) % tips.length;
  return tips[idx];
}

/* ───────────── handler ───────────── */
export default function handler(
  _req: NextApiRequest,
  res: NextApiResponse<MorningInfo>
) {
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const morningInfo: MorningInfo = {
    date: now.toLocaleDateString("en-US", options),
    dayOfWeek: now.toLocaleDateString("en-US", { weekday: "long" }),
    greeting: getGreeting(),
    timeOfDay: getTimeOfDay(),
    weekProgress: getWeekProgress(),
    monthProgress: getMonthProgress(),
    tip: getDailyTip(),
  };

  res.status(200).json(morningInfo);
}
