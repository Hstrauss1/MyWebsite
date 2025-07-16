// pages/api/neetcode.ts
import type { NextApiRequest, NextApiResponse } from "next";

/* ──────────── data type ──────────── */
type AlgoItem = {
  title: string;
  url: string;
  difficulty: "Easy" | "Medium" | "Hard";
};

/* ──────────── starter list ────────────
   Feel free to replace or extend with your own collection.
   (All links point to LeetCode because NeetCode mirrors them.)
*/
const problems: AlgoItem[] = [
  {
    title: "Two Sum",
    url: "https://leetcode.com/problems/two-sum",
    difficulty: "Easy",
  },
  {
    title: "Valid Anagram",
    url: "https://leetcode.com/problems/valid-anagram",
    difficulty: "Easy",
  },
  {
    title: "Merge Two Sorted Lists",
    url: "https://leetcode.com/problems/merge-two-sorted-lists",
    difficulty: "Easy",
  },
  {
    title: "Maximum Subarray",
    url: "https://leetcode.com/problems/maximum-subarray",
    difficulty: "Medium",
  },
  {
    title: "Product of Array Except Self",
    url: "https://leetcode.com/problems/product-of-array-except-self",
    difficulty: "Medium",
  },
  {
    title: "Group Anagrams",
    url: "https://leetcode.com/problems/group-anagrams",
    difficulty: "Medium",
  },
  {
    title: "Clone Graph",
    url: "https://leetcode.com/problems/clone-graph",
    difficulty: "Medium",
  },
  {
    title: "Longest Substring w/o Repeat",
    url: "https://leetcode.com/problems/longest-substring-without-repeating-characters",
    difficulty: "Medium",
  },
  {
    title: "Course Schedule",
    url: "https://leetcode.com/problems/course-schedule",
    difficulty: "Medium",
  },
  {
    title: "Median of Two Sorted Arrays",
    url: "https://leetcode.com/problems/median-of-two-sorted-arrays",
    difficulty: "Hard",
  },
  {
    title: "Word Ladder",
    url: "https://leetcode.com/problems/word-ladder",
    difficulty: "Hard",
  },
  {
    title: "LFU Cache",
    url: "https://leetcode.com/problems/lfu-cache",
    difficulty: "Hard",
  },
];

/* ──────────── helpers ──────────── */

/** Deterministically map today's date (YYYY-MM-DD) ➜ an index in 0…N-1 */
function dailyIndex(total: number): number {
  const day = new Date().toISOString().split("T")[0]; // e.g. "2025-07-09"
  let hash = 0;
  for (let i = 0; i < day.length; i++) {
    hash = (hash << 5) - hash + day.charCodeAt(i);
    hash |= 0; // force 32-bit
  }
  return Math.abs(hash) % total;
}

/* ──────────── handler ──────────── */
export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse<AlgoItem>
) {
  /* If you later want to pull fresh data from a remote source, 
     do it here with fetch(): const raw = await fetch(...).json() */
  const idx = dailyIndex(problems.length);
  res.status(200).json(problems[idx]);
}
