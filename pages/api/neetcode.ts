// pages/api/neetcode.ts
import type { NextApiRequest, NextApiResponse } from "next";

/* ──────────── data type ──────────── */
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

/* ──────────── expanded problem collection ──────────── */
const easyProblems: AlgoItem[] = [
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
    title: "Valid Palindrome",
    url: "https://leetcode.com/problems/valid-palindrome",
    difficulty: "Easy",
  },
  {
    title: "Best Time to Buy and Sell Stock",
    url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock",
    difficulty: "Easy",
  },
  {
    title: "Merge Two Sorted Lists",
    url: "https://leetcode.com/problems/merge-two-sorted-lists",
    difficulty: "Easy",
  },
  {
    title: "Invert Binary Tree",
    url: "https://leetcode.com/problems/invert-binary-tree",
    difficulty: "Easy",
  },
  {
    title: "Valid Parentheses",
    url: "https://leetcode.com/problems/valid-parentheses",
    difficulty: "Easy",
  },
  {
    title: "Maximum Depth of Binary Tree",
    url: "https://leetcode.com/problems/maximum-depth-of-binary-tree",
    difficulty: "Easy",
  },
  {
    title: "Contains Duplicate",
    url: "https://leetcode.com/problems/contains-duplicate",
    difficulty: "Easy",
  },
  {
    title: "Maximum Subarray",
    url: "https://leetcode.com/problems/maximum-subarray",
    difficulty: "Easy",
  },
  {
    title: "Climbing Stairs",
    url: "https://leetcode.com/problems/climbing-stairs",
    difficulty: "Easy",
  },
  {
    title: "Linked List Cycle",
    url: "https://leetcode.com/problems/linked-list-cycle",
    difficulty: "Easy",
  },
  {
    title: "Same Tree",
    url: "https://leetcode.com/problems/same-tree",
    difficulty: "Easy",
  },
  {
    title: "Palindrome Linked List",
    url: "https://leetcode.com/problems/palindrome-linked-list",
    difficulty: "Easy",
  },
  {
    title: "Binary Search",
    url: "https://leetcode.com/problems/binary-search",
    difficulty: "Easy",
  },
  {
    title: "Flood Fill",
    url: "https://leetcode.com/problems/flood-fill",
    difficulty: "Easy",
  },
  {
    title: "Lowest Common Ancestor of BST",
    url: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree",
    difficulty: "Easy",
  },
  {
    title: "Balanced Binary Tree",
    url: "https://leetcode.com/problems/balanced-binary-tree",
    difficulty: "Easy",
  },
  {
    title: "Implement Queue using Stacks",
    url: "https://leetcode.com/problems/implement-queue-using-stacks",
    difficulty: "Easy",
  },
  {
    title: "First Bad Version",
    url: "https://leetcode.com/problems/first-bad-version",
    difficulty: "Easy",
  },
  {
    title: "Ransom Note",
    url: "https://leetcode.com/problems/ransom-note",
    difficulty: "Easy",
  },
  {
    title: "Reverse Linked List",
    url: "https://leetcode.com/problems/reverse-linked-list",
    difficulty: "Easy",
  },
  {
    title: "Majority Element",
    url: "https://leetcode.com/problems/majority-element",
    difficulty: "Easy",
  },
  {
    title: "Add Binary",
    url: "https://leetcode.com/problems/add-binary",
    difficulty: "Easy",
  },
  {
    title: "Diameter of Binary Tree",
    url: "https://leetcode.com/problems/diameter-of-binary-tree",
    difficulty: "Easy",
  },
  {
    title: "Middle of Linked List",
    url: "https://leetcode.com/problems/middle-of-the-linked-list",
    difficulty: "Easy",
  },
  {
    title: "Maximum Product of Two Elements",
    url: "https://leetcode.com/problems/maximum-product-of-two-elements-in-an-array",
    difficulty: "Easy",
  },
  {
    title: "Sqrt(x)",
    url: "https://leetcode.com/problems/sqrtx",
    difficulty: "Easy",
  },
  {
    title: "Plus One",
    url: "https://leetcode.com/problems/plus-one",
    difficulty: "Easy",
  },
  {
    title: "Remove Duplicates from Sorted Array",
    url: "https://leetcode.com/problems/remove-duplicates-from-sorted-array",
    difficulty: "Easy",
  },
];

const mediumProblems: AlgoItem[] = [
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
    title: "3Sum",
    url: "https://leetcode.com/problems/3sum",
    difficulty: "Medium",
  },
  {
    title: "Container With Most Water",
    url: "https://leetcode.com/problems/container-with-most-water",
    difficulty: "Medium",
  },
  {
    title: "Longest Substring Without Repeating Characters",
    url: "https://leetcode.com/problems/longest-substring-without-repeating-characters",
    difficulty: "Medium",
  },
  {
    title: "Longest Palindromic Substring",
    url: "https://leetcode.com/problems/longest-palindromic-substring",
    difficulty: "Medium",
  },
  {
    title: "Clone Graph",
    url: "https://leetcode.com/problems/clone-graph",
    difficulty: "Medium",
  },
  {
    title: "Course Schedule",
    url: "https://leetcode.com/problems/course-schedule",
    difficulty: "Medium",
  },
  {
    title: "Number of Islands",
    url: "https://leetcode.com/problems/number-of-islands",
    difficulty: "Medium",
  },
  {
    title: "Rotate Image",
    url: "https://leetcode.com/problems/rotate-image",
    difficulty: "Medium",
  },
  {
    title: "Spiral Matrix",
    url: "https://leetcode.com/problems/spiral-matrix",
    difficulty: "Medium",
  },
  {
    title: "Set Matrix Zeroes",
    url: "https://leetcode.com/problems/set-matrix-zeroes",
    difficulty: "Medium",
  },
  {
    title: "Longest Consecutive Sequence",
    url: "https://leetcode.com/problems/longest-consecutive-sequence",
    difficulty: "Medium",
  },
  {
    title: "Insert Interval",
    url: "https://leetcode.com/problems/insert-interval",
    difficulty: "Medium",
  },
  {
    title: "Merge Intervals",
    url: "https://leetcode.com/problems/merge-intervals",
    difficulty: "Medium",
  },
  {
    title: "Non-overlapping Intervals",
    url: "https://leetcode.com/problems/non-overlapping-intervals",
    difficulty: "Medium",
  },
  {
    title: "Rotate Array",
    url: "https://leetcode.com/problems/rotate-array",
    difficulty: "Medium",
  },
  {
    title: "Search in Rotated Sorted Array",
    url: "https://leetcode.com/problems/search-in-rotated-sorted-array",
    difficulty: "Medium",
  },
  {
    title: "3Sum Closest",
    url: "https://leetcode.com/problems/3sum-closest",
    difficulty: "Medium",
  },
  {
    title: "Remove Nth Node From End of List",
    url: "https://leetcode.com/problems/remove-nth-node-from-end-of-list",
    difficulty: "Medium",
  },
  {
    title: "Swap Nodes in Pairs",
    url: "https://leetcode.com/problems/swap-nodes-in-pairs",
    difficulty: "Medium",
  },
  {
    title: "Add Two Numbers",
    url: "https://leetcode.com/problems/add-two-numbers",
    difficulty: "Medium",
  },
  {
    title: "Longest Common Subsequence",
    url: "https://leetcode.com/problems/longest-common-subsequence",
    difficulty: "Medium",
  },
  {
    title: "Coin Change",
    url: "https://leetcode.com/problems/coin-change",
    difficulty: "Medium",
  },
  {
    title: "House Robber",
    url: "https://leetcode.com/problems/house-robber",
    difficulty: "Medium",
  },
  {
    title: "House Robber II",
    url: "https://leetcode.com/problems/house-robber-ii",
    difficulty: "Medium",
  },
  {
    title: "Decode Ways",
    url: "https://leetcode.com/problems/decode-ways",
    difficulty: "Medium",
  },
  {
    title: "Unique Paths",
    url: "https://leetcode.com/problems/unique-paths",
    difficulty: "Medium",
  },
  {
    title: "Jump Game",
    url: "https://leetcode.com/problems/jump-game",
    difficulty: "Medium",
  },
  {
    title: "Word Break",
    url: "https://leetcode.com/problems/word-break",
    difficulty: "Medium",
  },
];

const hardProblems: AlgoItem[] = [
  {
    title: "Median of Two Sorted Arrays",
    url: "https://leetcode.com/problems/median-of-two-sorted-arrays",
    difficulty: "Hard",
  },
  {
    title: "Trapping Rain Water",
    url: "https://leetcode.com/problems/trapping-rain-water",
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
  {
    title: "Merge k Sorted Lists",
    url: "https://leetcode.com/problems/merge-k-sorted-lists",
    difficulty: "Hard",
  },
  {
    title: "Sliding Window Maximum",
    url: "https://leetcode.com/problems/sliding-window-maximum",
    difficulty: "Hard",
  },
  {
    title: "Minimum Window Substring",
    url: "https://leetcode.com/problems/minimum-window-substring",
    difficulty: "Hard",
  },
  {
    title: "Serialize and Deserialize Binary Tree",
    url: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree",
    difficulty: "Hard",
  },
  {
    title: "Word Ladder II",
    url: "https://leetcode.com/problems/word-ladder-ii",
    difficulty: "Hard",
  },
  {
    title: "Palindrome Partitioning II",
    url: "https://leetcode.com/problems/palindrome-partitioning-ii",
    difficulty: "Hard",
  },
  {
    title: "Edit Distance",
    url: "https://leetcode.com/problems/edit-distance",
    difficulty: "Hard",
  },
  {
    title: "Longest Valid Parentheses",
    url: "https://leetcode.com/problems/longest-valid-parentheses",
    difficulty: "Hard",
  },
  {
    title: "Regular Expression Matching",
    url: "https://leetcode.com/problems/regular-expression-matching",
    difficulty: "Hard",
  },
  {
    title: "Wildcard Matching",
    url: "https://leetcode.com/problems/wildcard-matching",
    difficulty: "Hard",
  },
  {
    title: "N-Queens",
    url: "https://leetcode.com/problems/n-queens",
    difficulty: "Hard",
  },
  {
    title: "Sudoku Solver",
    url: "https://leetcode.com/problems/sudoku-solver",
    difficulty: "Hard",
  },
  {
    title: "Word Search II",
    url: "https://leetcode.com/problems/word-search-ii",
    difficulty: "Hard",
  },
  {
    title: "Alien Dictionary",
    url: "https://leetcode.com/problems/alien-dictionary",
    difficulty: "Hard",
  },
  {
    title: "Design Search Autocomplete System",
    url: "https://leetcode.com/problems/design-search-autocomplete-system",
    difficulty: "Hard",
  },
  {
    title: "Maximum Rectangle",
    url: "https://leetcode.com/problems/maximal-rectangle",
    difficulty: "Hard",
  },
  {
    title: "Largest Rectangle in Histogram",
    url: "https://leetcode.com/problems/largest-rectangle-in-histogram",
    difficulty: "Hard",
  },
  {
    title: "Binary Tree Maximum Path Sum",
    url: "https://leetcode.com/problems/binary-tree-maximum-path-sum",
    difficulty: "Hard",
  },
  {
    title: "Best Time to Buy and Sell Stock III",
    url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iii",
    difficulty: "Hard",
  },
  {
    title: "Best Time to Buy and Sell Stock IV",
    url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iv",
    difficulty: "Hard",
  },
  {
    title: "Reverse Nodes in k-Group",
    url: "https://leetcode.com/problems/reverse-nodes-in-k-group",
    difficulty: "Hard",
  },
];

/* ──────────── helpers ──────────── */
function seededRandom(seed: number): () => number {
  let state = seed;
  return function () {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

function getDailySeed(): number {
  const day = new Date().toISOString().split("T")[0];
  let hash = 0;
  for (let i = 0; i < day.length; i++) {
    hash = (hash << 5) - hash + day.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function shuffleArray<T>(array: T[], rng: () => number): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/* ──────────── main selection logic ──────────── */
function selectDailyProblems(seed: number): AlgoResponse {
  const rng = seededRandom(seed);

  // 70% chance for easy+medium mode, 30% chance for hard mode
  const useHardMode = rng() < 0.3;

  if (useHardMode) {
    // Select 1 hard problem
    const shuffledHard = shuffleArray(hardProblems, rng);
    return {
      problems: [shuffledHard[0]],
      mode: "hard",
      totalCount: 1,
    };
  } else {
    // Select 4 easy + 2 medium problems
    const shuffledEasy = shuffleArray(easyProblems, rng);
    const shuffledMedium = shuffleArray(mediumProblems, rng);

    const selectedEasy = shuffledEasy.slice(0, 4);
    const selectedMedium = shuffledMedium.slice(0, 2);

    return {
      problems: [...selectedEasy, ...selectedMedium],
      mode: "easy_medium",
      totalCount: 6,
    };
  }
}

/* ──────────── handler ──────────── */
export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse<AlgoResponse>
) {
  const seed = getDailySeed();
  const result = selectDailyProblems(seed);
  res.status(200).json(result);
}
