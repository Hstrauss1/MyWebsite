import type { NextApiRequest, NextApiResponse } from "next";

/* ─────────────── types ─────────────── */
type MathItem = {
  question: string;
  answer: number;
};

/* ─────────────── helpers ─────────────── */
function dailyIndex(total: number): number {
  const day = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
  let hash = 0;
  for (let i = 0; i < day.length; i++) {
    hash = (hash << 5) - hash + day.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % total;
}

/* ─────────────── expression generator ─────────────── */
const expressions = [
  { expr: "5 * (17 ** 2) - 20", display: "5(17²) - 20" },
  { expr: "12 * 12 + 144 / 2", display: "12×12 + 144÷2" },
  { expr: "(25 + 15) * 2 - 10", display: "(25 + 15) × 2 - 10" },
  { expr: "2 ** 5 + 6 * 3", display: "2⁵ + 6×3" },
  { expr: "100 - (3 ** 3) + 1", display: "100 - 3³ + 1" },
  { expr: "(50 / 2) + (10 * 3)", display: "50÷2 + 10×3" },
  { expr: "7 * 13 - 5 * 4", display: "7×13 - 5×4" },
  { expr: "(6 + 3) ** 2 - 4", display: "(6+3)² - 4" },
  { expr: "9 * 9 + 3 ** 2", display: "9×9 + 3²" },
  { expr: "81 / 3 + 2 * 10", display: "81÷3 + 2×10" },
];

/* ─────────────── handler ─────────────── */
export default function handler(
  _req: NextApiRequest,
  res: NextApiResponse<MathItem>
) {
  const idx = dailyIndex(expressions.length);
  const { expr, display } = expressions[idx];

  // Safe evaluation
  let answer: number;
  try {
    answer = Function(`"use strict"; return (${expr})`)(); // clean eval
  } catch (e) {
    return res.status(500).json({ question: "Invalid Expression", answer: 0 });
  }

  res
    .status(200)
    .json({ question: display, answer: Number(answer.toFixed(2)) });
}
