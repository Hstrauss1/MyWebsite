// pages/api/quote.ts
import type { NextApiRequest, NextApiResponse } from "next";

/* ───────────── types ───────────── */
type QuoteItem = {
  text: string;
  author: string;
  category: "motivation" | "wisdom" | "productivity" | "mindset" | "success";
};

/* ───────────── helpers ───────────── */
function dailyIndex(total: number): number {
  const day = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
  let hash = 0;
  for (let i = 0; i < day.length; i++) {
    hash = (hash << 5) - hash + day.charCodeAt(i);
    hash |= 0; // 32-bit wrap
  }
  return Math.abs(hash) % total;
}

/* ───────────── quote collection ─────────────
   Curated quotes for morning motivation and reflection */
const quotes: QuoteItem[] = [
  // Motivation & Action
  {
    text: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney",
    category: "motivation",
  },
  {
    text: "Don't watch the clock; do what it does. Keep going.",
    author: "Sam Levenson",
    category: "motivation",
  },
  {
    text: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt",
    category: "motivation",
  },
  {
    text: "It is during our darkest moments that we must focus to see the light.",
    author: "Aristotle",
    category: "motivation",
  },

  // Wisdom & Growth
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    category: "wisdom",
  },
  {
    text: "In the middle of difficulty lies opportunity.",
    author: "Albert Einstein",
    category: "wisdom",
  },
  {
    text: "Life is what happens to you while you're busy making other plans.",
    author: "John Lennon",
    category: "wisdom",
  },
  {
    text: "The unexamined life is not worth living.",
    author: "Socrates",
    category: "wisdom",
  },

  // Productivity & Focus
  {
    text: "You don't have to be great to get started, but you have to get started to be great.",
    author: "Les Brown",
    category: "productivity",
  },
  {
    text: "The secret of getting ahead is getting started.",
    author: "Mark Twain",
    category: "productivity",
  },
  {
    text: "Focus on being productive instead of busy.",
    author: "Tim Ferriss",
    category: "productivity",
  },
  {
    text: "What gets measured gets managed.",
    author: "Peter Drucker",
    category: "productivity",
  },

  // Mindset & Perspective
  {
    text: "Whether you think you can or you think you can't, you're right.",
    author: "Henry Ford",
    category: "mindset",
  },
  {
    text: "The mind is everything. What you think you become.",
    author: "Buddha",
    category: "mindset",
  },
  {
    text: "Change your thoughts and you change your world.",
    author: "Norman Vincent Peale",
    category: "mindset",
  },
  {
    text: "Yesterday is history, tomorrow is a mystery, today is a gift.",
    author: "Eleanor Roosevelt",
    category: "mindset",
  },

  // Success & Achievement
  {
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
    category: "success",
  },
  {
    text: "The only impossible journey is the one you never begin.",
    author: "Tony Robbins",
    category: "success",
  },
  {
    text: "Success is walking from failure to failure with no loss of enthusiasm.",
    author: "Winston Churchill",
    category: "success",
  },
  {
    text: "Don't be afraid to give up the good to go for the great.",
    author: "John D. Rockefeller",
    category: "success",
  },

  // Learning & Development
  {
    text: "Live as if you were to die tomorrow. Learn as if you were to live forever.",
    author: "Mahatma Gandhi",
    category: "wisdom",
  },
  {
    text: "The more that you read, the more things you will know. The more that you learn, the more places you'll go.",
    author: "Dr. Seuss",
    category: "wisdom",
  },
  {
    text: "An investment in knowledge pays the best interest.",
    author: "Benjamin Franklin",
    category: "wisdom",
  },

  // Resilience & Perseverance
  {
    text: "Fall seven times, stand up eight.",
    author: "Japanese Proverb",
    category: "motivation",
  },
  {
    text: "It does not matter how slowly you go as long as you do not stop.",
    author: "Confucius",
    category: "motivation",
  },
  {
    text: "Strength does not come from physical capacity. It comes from an indomitable will.",
    author: "Mahatma Gandhi",
    category: "motivation",
  },

  // Innovation & Creativity
  {
    text: "Innovation distinguishes between a leader and a follower.",
    author: "Steve Jobs",
    category: "success",
  },
  {
    text: "Creativity is intelligence having fun.",
    author: "Albert Einstein",
    category: "mindset",
  },
  {
    text: "The best way to predict the future is to create it.",
    author: "Peter Drucker",
    category: "success",
  },

  // Time & Priorities
  {
    text: "Time is more valuable than money. You can get more money, but you cannot get more time.",
    author: "Jim Rohn",
    category: "productivity",
  },
  {
    text: "The key is not to prioritize what's on your schedule, but to schedule your priorities.",
    author: "Stephen Covey",
    category: "productivity",
  },
  {
    text: "Yesterday's the past, tomorrow's the future, but today is a gift. That's why it's called the present.",
    author: "Bil Keane",
    category: "mindset",
  },
];

/* ───────────── handler ───────────── */
export default function handler(
  _req: NextApiRequest,
  res: NextApiResponse<QuoteItem>
) {
  const idx = dailyIndex(quotes.length);
  res.status(200).json(quotes[idx]);
}
