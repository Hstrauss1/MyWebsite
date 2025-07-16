// pages/api/teaser.ts
import type { NextApiRequest, NextApiResponse } from "next";

/* ───────────── types ───────────── */
type TeaserItem = {
  title: string;
  prompt: string;
  answer: string;
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

/* ───────────── teaser bank ─────────────
   Short classics (adapted from Smullyan & others).
   Feel free to extend, swap, or pull from a DB instead. */
const teasers: TeaserItem[] = [
  {
    title: "The Green-Eyed Dragons",
    prompt:
      "On an island live 100 dragons, all with green eyes. They can’t see their own eye color. A visitor tells them at least one has green eyes. If a dragon discovers its eyes are green, it must leave at midnight. What happens?",
    answer:
      "All 100 dragons leave the island on the 100-th midnight (common-knowledge logic chain).",
  },
  {
    title: "The Impossible Sandwich",
    prompt:
      "A logician says: “I’ll have either ham or turkey for lunch. If I have ham, I’ll also have mustard. I will have mustard only if I have cheese.” Can the logician have lunch?",
    answer:
      "No – assuming only one meat can be picked. Ham ⇒ mustard ⇒ cheese, but cheese ⇒ ¬ham (only one meat). Turkey has no condiment chain, so the statements are mutually inconsistent; the lunch order is impossible.",
  },
  {
    title: "Two Doors, Two Guards",
    prompt:
      "One door leads to freedom, the other to doom. One guard always lies, the other always tells the truth. You may ask **one** guard **one** yes-no question. What do you ask?",
    answer:
      "“If I were to ask the *other* guard which door leads to freedom, what would he say?” – then pick the opposite door.",
  },
  {
    title: "The Missing Dollar",
    prompt:
      "Three friends pay $30 for a room. Later the clerk refunds $5. The bellhop pockets $2, gives back $3. Each guest paid $9 (total $27) + $2 pocketed = $29. Where is the missing dollar?",
    answer:
      "The $27 already includes the $2 pocketed. Correct breakdown: $25 (hotel) + $2 (bellhop) + $3 (returned) = $30.",
  },
  {
    title: "Light-Switch Puzzle",
    prompt:
      "Three switches downstairs, one bulb upstairs. Only one switch turns the bulb on. You may go upstairs **once**. How do you determine which switch controls the bulb?",
    answer:
      "Turn on switch 1 for a few minutes, then off. Turn on switch 2 and go upstairs: lit = 2; warm & dark = 1; cold & dark = 3.",
  },
  {
    title: "The Fork in the Road",
    prompt:
      "You meet a native from a tribe where everyone always lies **or** always tells the truth. You need to know if the left path leads to the village. What single yes-no question guarantees the answer?",
    answer:
      "“If I asked **you** whether the left path leads to the village, would you say yes?” – truth-teller answers truthfully, liar lies about lying, both yield the correct path.",
  },
  {
    title: "Heaven or Hell",
    prompt:
      "Saint Peter says: “One of you always lies, the other always tells the truth.” The twins reply: A: “B is the liar.” B: “We are both liars.” Which one is the liar?",
    answer:
      "B is the liar. If B were truthful, his statement “we are both liars” would create a contradiction.",
  },
  {
    title: "Three Hats",
    prompt:
      "Three people wear hats chosen from two black and one white. They can see others’ hats. In order, each is asked if they know their own color. First says no, second says no, third says …?",
    answer:
      "The third says **yes – black**. Two “no” answers reveal at least one black hat on heads 1 or 2; third sees either one or two black hats and can deduce his own.",
  },
];

/* ───────────── handler ───────────── */
export default function handler(
  _req: NextApiRequest,
  res: NextApiResponse<TeaserItem>
) {
  const idx = dailyIndex(teasers.length);
  res.status(200).json(teasers[idx]);
}
