import type { NextApiRequest, NextApiResponse } from "next";

/* ─────────────── types ─────────────── */
type MathItem = {
  questions: Array<{
    question: string;
    answer: number;
  }>;
  totalCount: number;
};

/* ─────────────── helpers ─────────────── */
function seededRandom(seed: number): () => number {
  let state = seed;
  return function () {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

function getDailySeed(): number {
  const day = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
  let hash = 0;
  for (let i = 0; i < day.length; i++) {
    hash = (hash << 5) - hash + day.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/* ─────────────── math problem generators ─────────────── */
function generateBasicArithmetic(rng: () => number): {
  question: string;
  answer: number;
} {
  const operations = [
    () => {
      const a = Math.floor(rng() * 20) + 5;
      const b = Math.floor(rng() * 15) + 2;
      const c = Math.floor(rng() * 30) + 10;
      return { question: `${a} × ${b} + ${c}`, answer: a * b + c };
    },
    () => {
      const a = Math.floor(rng() * 15) + 5;
      const b = Math.floor(rng() * 12) + 3;
      const c = Math.floor(rng() * 20) + 5;
      return { question: `${a} × ${b} - ${c}`, answer: a * b - c };
    },
    () => {
      const a = Math.floor(rng() * 25) + 10;
      const b = Math.floor(rng() * 15) + 5;
      const c = Math.floor(rng() * 10) + 2;
      return { question: `(${a} + ${b}) × ${c}`, answer: (a + b) * c };
    },
    () => {
      const a = Math.floor(rng() * 20) + 10;
      const b = Math.floor(rng() * 15) + 5;
      const c = Math.floor(rng() * 8) + 2;
      return { question: `(${a} - ${b}) × ${c}`, answer: (a - b) * c };
    },
  ];

  const op = operations[Math.floor(rng() * operations.length)];
  return op();
}

function generateSquareOperations(rng: () => number): {
  question: string;
  answer: number;
} {
  const operations = [
    () => {
      const a = Math.floor(rng() * 15) + 5;
      const b = Math.floor(rng() * 20) + 10;
      return { question: `${a}² + ${b}`, answer: a * a + b };
    },
    () => {
      const a = Math.floor(rng() * 12) + 8;
      const b = Math.floor(rng() * 15) + 5;
      return { question: `${a}² - ${b}`, answer: a * a - b };
    },
    () => {
      const a = Math.floor(rng() * 8) + 3;
      const b = Math.floor(rng() * 6) + 2;
      const c = Math.floor(rng() * 10) + 5;
      return { question: `${a}² + ${b}² - ${c}`, answer: a * a + b * b - c };
    },
    () => {
      const a = Math.floor(rng() * 10) + 5;
      const b = Math.floor(rng() * 8) + 2;
      return { question: `(${a} + ${b})²`, answer: (a + b) * (a + b) };
    },
  ];

  const op = operations[Math.floor(rng() * operations.length)];
  return op();
}

function generateDivisionOperations(rng: () => number): {
  question: string;
  answer: number;
} {
  const operations = [
    () => {
      const divisor = Math.floor(rng() * 8) + 3;
      const quotient = Math.floor(rng() * 15) + 5;
      const dividend = divisor * quotient;
      const add = Math.floor(rng() * 20) + 10;
      return {
        question: `${dividend}÷${divisor} + ${add}`,
        answer: quotient + add,
      };
    },
    () => {
      const a = Math.floor(rng() * 12) + 4;
      const b = Math.floor(rng() * 8) + 2;
      const c = Math.floor(rng() * 15) + 5;
      return { question: `${a * b}÷${b} × ${c}`, answer: a * c };
    },
    () => {
      const a = Math.floor(rng() * 10) + 5;
      const b = Math.floor(rng() * 6) + 2;
      return { question: `${a * b * 2}÷${b}÷2`, answer: a };
    },
  ];

  const op = operations[Math.floor(rng() * operations.length)];
  return op();
}

function generateMixedOperations(rng: () => number): {
  question: string;
  answer: number;
} {
  const operations = [
    () => {
      const a = Math.floor(rng() * 8) + 2;
      const b = Math.floor(rng() * 12) + 5;
      const c = Math.floor(rng() * 6) + 2;
      return { question: `${a}³ + ${b} - ${c}`, answer: a * a * a + b - c };
    },
    () => {
      const a = Math.floor(rng() * 15) + 5;
      const b = Math.floor(rng() * 10) + 3;
      const c = Math.floor(rng() * 8) + 2;
      return {
        question: `${a} × ${b} ÷ ${c}`,
        answer: Math.floor((a * b) / c),
      };
    },
    () => {
      const a = Math.floor(rng() * 20) + 10;
      const b = Math.floor(rng() * 15) + 5;
      const c = Math.floor(rng() * 10) + 3;
      return { question: `${a} + ${b} × ${c}`, answer: a + b * c };
    },
    () => {
      const a = Math.floor(rng() * 12) + 8;
      const b = Math.floor(rng() * 8) + 3;
      const c = Math.floor(rng() * 15) + 5;
      return { question: `${a} × ${b} + ${c}²`, answer: a * b + c * c };
    },
  ];

  const op = operations[Math.floor(rng() * operations.length)];
  return op();
}

function generatePercentageOperations(rng: () => number): {
  question: string;
  answer: number;
} {
  const operations = [
    () => {
      const base = [25, 50, 75, 100, 125, 150, 200][Math.floor(rng() * 7)];
      const percent = [10, 20, 25, 30, 40, 50, 60, 75][Math.floor(rng() * 8)];
      return {
        question: `${percent}% of ${base}`,
        answer: (percent * base) / 100,
      };
    },
    () => {
      const base = [80, 120, 160, 240, 320][Math.floor(rng() * 5)];
      const percent = [25, 50, 75][Math.floor(rng() * 3)];
      const add = Math.floor(rng() * 20) + 10;
      return {
        question: `${percent}% of ${base} + ${add}`,
        answer: (percent * base) / 100 + add,
      };
    },
  ];

  const op = operations[Math.floor(rng() * operations.length)];
  return op();
}

/* ─────────────── main generator ─────────────── */
function generate100Questions(
  seed: number
): Array<{ question: string; answer: number }> {
  const rng = seededRandom(seed);
  const questions: Array<{ question: string; answer: number }> = [];

  const generators = [
    generateBasicArithmetic,
    generateSquareOperations,
    generateDivisionOperations,
    generateMixedOperations,
    generatePercentageOperations,
  ];

  for (let i = 0; i < 100; i++) {
    const generator = generators[Math.floor(rng() * generators.length)];
    const question = generator(rng);
    questions.push(question);
  }

  return questions;
}

/* ─────────────── handler ─────────────── */
export default function handler(
  _req: NextApiRequest,
  res: NextApiResponse<MathItem>
) {
  const seed = getDailySeed();
  const questions = generate100Questions(seed);

  res.status(200).json({
    questions,
    totalCount: questions.length,
  });
}
