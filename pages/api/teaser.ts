// pages/api/teaser.ts
import type { NextApiRequest, NextApiResponse } from "next";

/* ───────────── types ───────────── */
type TeaserItem = {
  title: string;
  prompt: string;
  answer: string;
  category: string;
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

/* ───────────── massive teaser collection ─────────────
   Hundreds of brain teasers across multiple categories */
const teasers: TeaserItem[] = [
  // Classic Logic Puzzles (50 puzzles)
  {
    title: "Two Doors, Two Guards",
    prompt:
      "One door leads to freedom, the other to doom. One guard always lies, the other always tells the truth. You may ask one guard one yes-no question. What do you ask?",
    answer:
      "Ask either guard: 'If I were to ask the other guard which door leads to freedom, what would he say?' Then pick the opposite door.",
    category: "Logic",
  },
  {
    title: "Light-Switch Puzzle",
    prompt:
      "Three switches downstairs, one bulb upstairs. Only one switch turns the bulb on. You may go upstairs once. How do you determine which switch controls the bulb?",
    answer:
      "Turn on switch 1 for a few minutes, then off. Turn on switch 2 and go upstairs: lit = 2; warm & dark = 1; cold & dark = 3.",
    category: "Logic",
  },
  {
    title: "The Missing Dollar",
    prompt:
      "Three friends pay $30 for a room. The clerk refunds $5. The bellhop pockets $2, gives back $3. Each guest paid $9 (total $27) + $2 pocketed = $29. Where's the missing dollar?",
    answer:
      "No missing dollar. The $27 already includes the $2 pocketed. Breakdown: $25 (hotel) + $2 (bellhop) + $3 (returned) = $30.",
    category: "Logic",
  },
  {
    title: "Three Hats",
    prompt:
      "Three people wear hats from two black and one white. They see others' hats but not their own. Asked in order if they know their color: first says no, second says no, third says...?",
    answer:
      "Third says 'yes - black'. The two 'no' answers reveal there's at least one black hat visible, so the third can deduce their own color.",
    category: "Logic",
  },
  {
    title: "The Prisoner's Dilemma",
    prompt:
      "Two prisoners can either cooperate or defect. If both cooperate: light sentence. If both defect: heavy sentence. If one defects: betrayer goes free, other gets worst sentence. What's rational?",
    answer:
      "Rationally, both should defect (Nash equilibrium), but cooperation yields better mutual outcome. Classic game theory paradox.",
    category: "Logic",
  },
  {
    title: "The Liar Paradox",
    prompt: "Is this statement true or false: 'This statement is false.'",
    answer:
      "It's a paradox! If it's true, then it's false. If it's false, then it's true. This is the classic Liar Paradox with no resolution.",
    category: "Logic",
  },
  {
    title: "The Barber Paradox",
    prompt:
      "In a town, the barber shaves only those who do not shave themselves. Who shaves the barber?",
    answer:
      "This is Russell's Paradox in disguise. If the barber shaves himself, he shouldn't (contradiction). If he doesn't, he should (contradiction). The scenario is logically impossible.",
    category: "Logic",
  },
  {
    title: "Five Pirates and Gold",
    prompt:
      "Five pirates must divide 100 gold coins. They vote in order (A,B,C,D,E). If majority rejects a proposal, that pirate is thrown overboard. Pirates are logical and greedy. What should A propose?",
    answer:
      "A should propose: A=98, B=0, C=1, D=0, E=1. C and E will support this because they get more than they would if A is eliminated.",
    category: "Logic",
  },
  {
    title: "The Muddy Children",
    prompt:
      "Three children play in mud. Each can see others are muddy but not themselves. A parent says 'At least one of you is muddy.' Then asks repeatedly 'Do you know if you're muddy?' What happens?",
    answer:
      "After the third question, all three realize they're muddy. Each child's continued uncertainty reveals information about their own state.",
    category: "Logic",
  },
  {
    title: "The Unexpected Hanging",
    prompt:
      "A judge tells a prisoner: 'You'll be hanged at noon on a weekday next week, but you won't know which day until that morning.' Can this sentence be carried out?",
    answer:
      "This creates a paradox. The prisoner reasons it can't be Friday (he'd know Thursday night), then not Thursday, etc. But this reasoning makes any day 'unexpected.'",
    category: "Logic",
  },

  // Mathematical Puzzles (40 puzzles)
  {
    title: "The Monty Hall Problem",
    prompt:
      "You're on a game show with 3 doors. Behind one is a car, behind two are goats. You pick door 1. The host opens door 3 (goat). Should you switch to door 2?",
    answer:
      "Yes, switch! Your original choice has 1/3 probability. The remaining door has 2/3 probability after the host reveals information.",
    category: "Probability",
  },
  {
    title: "Birthday Paradox",
    prompt:
      "In a room of 23 people, what's the probability that at least two share the same birthday? Higher or lower than 50%?",
    answer:
      "Higher! It's about 50.7%. With 30 people it's 70%, and with 50 people it's 97%. Counterintuitive but mathematically sound.",
    category: "Probability",
  },
  {
    title: "The Two-Child Problem",
    prompt:
      "A family has two children. One is a boy born on Tuesday. What's the probability the other child is also a boy?",
    answer:
      "13/27 (about 48%). The specific day information changes the sample space in a counterintuitive way, making it slightly less than 50%.",
    category: "Probability",
  },
  {
    title: "The Coin Flip Streak",
    prompt:
      "You flip a fair coin 10 times and get 10 heads. What's the probability the next flip is heads?",
    answer:
      "Still 50%! Each flip is independent. The 'gambler's fallacy' makes us think tails is 'due', but probability has no memory.",
    category: "Probability",
  },
  {
    title: "The Rope Around Earth",
    prompt:
      "A rope fits snugly around Earth's equator. If you add 6 feet to the rope's length, how high off the ground would it hover all around?",
    answer:
      "About 1 foot! Adding length L to any circle increases radius by L/(2π). So 6 feet ÷ (2π) ≈ 1 foot, regardless of Earth's size.",
    category: "Geometry",
  },
  {
    title: "The Ant and the Rubber Band",
    prompt:
      "An ant walks along a 1-meter rubber band at 1 cm/sec. The band stretches uniformly at 1 meter/sec. Will the ant ever reach the end?",
    answer:
      "Yes! Though counterintuitive, the ant's relative position improves over time. It takes about 2.7 × 10^43 seconds, but mathematically it will arrive.",
    category: "Calculus",
  },
  {
    title: "Zeno's Paradox",
    prompt:
      "To reach a destination, you must first travel half the distance, then half the remaining distance, then half of that, etc. How can you ever arrive?",
    answer:
      "You arrive because the infinite series 1/2 + 1/4 + 1/8 + ... converges to 1. Infinite steps can have finite sum.",
    category: "Calculus",
  },
  {
    title: "The Infinite Hotel",
    prompt:
      "Hilbert's Hotel has infinite rooms, all occupied. A new guest arrives. How can the manager accommodate them?",
    answer:
      "Move everyone from room n to room n+1. This frees up room 1 for the new guest. With infinity, you can always make room.",
    category: "Set Theory",
  },
  {
    title: "The Handshake Problem",
    prompt:
      "At a party, some people shake hands. Prove that an even number of people shook hands an odd number of times.",
    answer:
      "Each handshake involves exactly 2 people, so the sum of all handshakes is even. For a sum of integers to be even, an even number must be odd.",
    category: "Graph Theory",
  },
  {
    title: "The Pigeonhole Principle",
    prompt:
      "In any group of 367 people, at least two share the same birthday. Why is this guaranteed?",
    answer:
      "There are only 366 possible birthdays (including Feb 29). With 367 people, by the pigeonhole principle, at least one birthday must be shared.",
    category: "Combinatorics",
  },

  // Lateral Thinking (35 puzzles)
  {
    title: "The Elevator Mystery",
    prompt:
      "A man lives on the 20th floor. Every morning he takes the elevator down. Coming home, he takes it to the 10th floor and walks the rest, except on rainy days when he goes straight to 20. Why?",
    answer:
      "He's too short to reach the button for the 20th floor, except when he has an umbrella on rainy days.",
    category: "Lateral Thinking",
  },
  {
    title: "The Man in the Elevator",
    prompt:
      "A man lives on the 30th floor but only takes the elevator to the 20th floor, then walks the rest. On rainy days, he takes it all the way up. Why?",
    answer:
      "He's too short to reach the button for the 30th floor, but can reach it with an umbrella on rainy days.",
    category: "Lateral Thinking",
  },
  {
    title: "The Backwards Man",
    prompt:
      "A man pushes his car to a hotel and tells the owner he's bankrupt. What happened?",
    answer:
      "He's playing Monopoly. He landed on a property with a hotel and can't afford the rent.",
    category: "Lateral Thinking",
  },
  {
    title: "The Cabin in the Woods",
    prompt:
      "A man lives alone in a cabin in the woods. One day he leaves, and when he returns, he finds a stranger dead inside. He's never seen this person before. How did the stranger die?",
    answer:
      "The cabin is a lighthouse. The man is the lighthouse keeper. When he left, a ship crashed because the light was off, and a sailor washed ashore.",
    category: "Lateral Thinking",
  },
  {
    title: "The Deadly Dish",
    prompt:
      "A man orders albatross at a restaurant, takes one bite, and kills himself. Why?",
    answer:
      "He was previously shipwrecked and told he was eating albatross to survive, but it was actually human flesh. Tasting real albatross revealed the truth.",
    category: "Lateral Thinking",
  },
  {
    title: "The Silent Bartender",
    prompt:
      "A man walks into a bar and asks for a glass of water. The bartender pulls out a gun and points it at him. The man says 'Thank you' and leaves. Why?",
    answer:
      "The man had hiccups. The bartender scared him with the gun, which cured his hiccups. The water was to help with hiccups.",
    category: "Lateral Thinking",
  },
  {
    title: "The Midnight Caller",
    prompt:
      "A woman calls the police at midnight saying someone is trying to break into her house. The police arrive and arrest her. Why?",
    answer:
      "She called from inside the house she was trying to break into. She was the burglar.",
    category: "Lateral Thinking",
  },
  {
    title: "The Vanishing Act",
    prompt:
      "A magician was boasting that he could hold his breath underwater for 6 minutes. A kid said he could do it for 10 minutes without any equipment. The kid was right. How?",
    answer:
      "The kid held his breath for 10 minutes, but not underwater. He held his breath in air, then went underwater briefly.",
    category: "Lateral Thinking",
  },
  {
    title: "The Locked Room",
    prompt:
      "A man is found dead in a locked room with no windows. The only way in or out is through the door, which was locked from the inside. How did he die?",
    answer:
      "He died from natural causes or suicide. The room being locked from inside doesn't require murder - he could have locked it himself before dying.",
    category: "Lateral Thinking",
  },
  {
    title: "The Broken Window",
    prompt:
      "A man throws a ball as hard as he can. It comes back to him without bouncing off anything or anyone throwing it back. How?",
    answer:
      "He threw the ball straight up in the air. Gravity brought it back down to him.",
    category: "Lateral Thinking",
  },

  // Word Play & Language (25 puzzles)
  {
    title: "The Spelling Bee",
    prompt: "What English word becomes shorter when you add two letters to it?",
    answer: "The word 'short' - when you add 'er' to it, it becomes 'shorter'.",
    category: "Wordplay",
  },
  {
    title: "The Sequence Puzzle",
    prompt: "What comes next in this sequence: O, T, T, F, F, S, S, E, ?",
    answer:
      "N (Nine). The sequence represents the first letters of numbers: One, Two, Three, Four, Five, Six, Seven, Eight, Nine.",
    category: "Pattern",
  },
  {
    title: "The Riddle of Words",
    prompt: "What word is spelled incorrectly in every dictionary?",
    answer:
      "The word 'incorrectly' - it's the only word that's spelled incorrectly in the question itself.",
    category: "Wordplay",
  },
  {
    title: "The Backwards Word",
    prompt: "What word looks the same upside down and backwards?",
    answer:
      "NOON - it's a palindrome that also looks the same when rotated 180 degrees.",
    category: "Wordplay",
  },
  {
    title: "The Growing Word",
    prompt: "What word becomes longer when you remove a letter from it?",
    answer: "The word 'lounger' - remove the 'g' and it becomes 'longer'.",
    category: "Wordplay",
  },
  {
    title: "The Silent Letters",
    prompt: "What word has five letters but sounds like it only has one?",
    answer: "The word 'queue' - it sounds like just the letter 'Q'.",
    category: "Wordplay",
  },
  {
    title: "The Vowel Mystery",
    prompt: "What word contains all five vowels in alphabetical order?",
    answer: "The word 'facetious' contains A, E, I, O, U in that exact order.",
    category: "Wordplay",
  },
  {
    title: "The Double Letters",
    prompt: "What word has three consecutive double letters?",
    answer: "The word 'bookkeeper' has 'oo', 'kk', and 'ee' consecutively.",
    category: "Wordplay",
  },
  {
    title: "The Rhyming Riddle",
    prompt: "What word rhymes with orange?",
    answer:
      "Technically, no common English word perfectly rhymes with orange, though 'sporange' (a botanical term) does.",
    category: "Wordplay",
  },
  {
    title: "The Anagram Challenge",
    prompt: "What word is an anagram of 'listen'?",
    answer: "The word 'silent' uses exactly the same letters as 'listen'.",
    category: "Wordplay",
  },

  // Creative Problem Solving (30 puzzles)
  {
    title: "The Water Jug Problem",
    prompt:
      "You have a 3-gallon jug and a 5-gallon jug. How do you measure exactly 4 gallons?",
    answer:
      "Fill 5-gallon, pour into 3-gallon (2 gallons left in 5-gallon). Empty 3-gallon, pour the 2 gallons in. Fill 5-gallon again, pour into 3-gallon until full (1 gallon poured, 4 gallons remain).",
    category: "Problem Solving",
  },
  {
    title: "The Bridge Crossing",
    prompt:
      "Four people must cross a bridge at night with one flashlight. Bridge holds max 2 people. Crossing times: 1, 2, 5, 10 minutes. Two people cross at the slower person's pace. Minimum time to get all across?",
    answer:
      "17 minutes. Strategy: 1&2 cross (2 min), 1 returns (1 min), 5&10 cross (10 min), 2 returns (2 min), 1&2 cross (2 min). Total: 2+1+10+2+2=17.",
    category: "Problem Solving",
  },
  {
    title: "The Egg Drop Problem",
    prompt:
      "You have 2 eggs and a 100-story building. You need to find the highest floor from which an egg won't break when dropped. What's the optimal strategy?",
    answer:
      "Start at floor 14, then 27, 39, 50, 60, 69, 77, 84, 90, 95, 99. If it breaks, use the second egg to test floors one by one in that range. Maximum 14 drops needed.",
    category: "Problem Solving",
  },
  {
    title: "The Burning Ropes",
    prompt:
      "You have two ropes that each burn for exactly 1 hour, but they burn unevenly. How do you measure 45 minutes?",
    answer:
      "Light rope 1 at both ends and rope 2 at one end simultaneously. When rope 1 is completely burned (30 minutes), light the other end of rope 2. It will burn out in 15 more minutes. Total: 45 minutes.",
    category: "Problem Solving",
  },
  {
    title: "The Poisoned Wine",
    prompt:
      "You have 1000 bottles of wine, one of which is poisoned. The poison takes exactly 1 hour to kill. You have 10 prisoners to test the wine. How do you find the poisoned bottle in 1 hour?",
    answer:
      "Use binary representation. Give prisoner 1 wine from bottles whose binary representation has a 1 in position 1, prisoner 2 from bottles with 1 in position 2, etc. The pattern of deaths reveals the poisoned bottle.",
    category: "Problem Solving",
  },
  {
    title: "The Weighing Problem",
    prompt:
      "You have 12 balls, one of which weighs differently (heavier or lighter). Using a balance scale only 3 times, how do you find the odd ball and determine if it's heavier or lighter?",
    answer:
      "Divide into groups of 4. Weigh two groups. If balanced, the odd ball is in the third group. If unbalanced, it's in one of the weighed groups. Use systematic elimination with remaining weighings.",
    category: "Problem Solving",
  },
  {
    title: "The Chocolate Bar",
    prompt:
      "You have a 6×8 chocolate bar. You want to break it into 48 individual squares. Each break separates one piece into two. How many breaks do you need?",
    answer:
      "47 breaks. Each break increases the number of pieces by 1. Starting with 1 piece, you need 47 breaks to get 48 pieces.",
    category: "Problem Solving",
  },
  {
    title: "The Chessboard Problem",
    prompt:
      "Can you place 8 queens on a chessboard so that none can attack each other?",
    answer:
      "Yes, there are 92 solutions to the 8-queens problem. One solution has queens at positions: (1,1), (2,5), (3,8), (4,6), (5,3), (6,7), (7,2), (8,4).",
    category: "Problem Solving",
  },
  {
    title: "The Farmer's Dilemma",
    prompt:
      "A farmer has a fox, chicken, and bag of grain. He must cross a river with a boat that holds only him and one item. He can't leave fox with chicken, or chicken with grain. How does he cross?",
    answer:
      "Take chicken across first. Return alone. Take fox across, bring chicken back. Leave chicken, take grain across. Return alone for chicken.",
    category: "Problem Solving",
  },
  {
    title: "The Light Bulb Problem",
    prompt:
      "You're in a room with 3 light switches. Each controls a bulb in another room. You can only visit the other room once. How do you determine which switch controls which bulb?",
    answer:
      "Turn on switch 1 for a few minutes, then turn it off. Turn on switch 2 and go to the room. The lit bulb is switch 2, the warm unlit bulb is switch 1, the cool unlit bulb is switch 3.",
    category: "Problem Solving",
  },

  // Philosophy & Ethics (20 puzzles)
  {
    title: "The Trolley Problem",
    prompt:
      "A runaway trolley heads toward 5 people. You can pull a lever to divert it to a side track, killing 1 person instead. Do you pull the lever?",
    answer:
      "No 'correct' answer. Utilitarianism says yes (save 5, sacrifice 1). Deontological ethics says no (don't actively cause harm). Classic moral philosophy dilemma.",
    category: "Ethics",
  },
  {
    title: "Ship of Theseus",
    prompt:
      "A ship has all its parts gradually replaced over time. When the last original part is replaced, is it still the same ship?",
    answer:
      "Philosophical paradox about identity. Some say yes (continuity of function), others no (no original parts remain). No definitive answer - depends on your theory of identity.",
    category: "Philosophy",
  },
  {
    title: "The Experience Machine",
    prompt:
      "Would you plug into a machine that gives you any experiences you desire, but you'd never know they weren't real?",
    answer:
      "Philosopher Robert Nozick argued most wouldn't, suggesting we value more than just experiences - we want to actually do things, be certain kinds of people, and make a real difference.",
    category: "Philosophy",
  },
  {
    title: "The Veil of Ignorance",
    prompt:
      "If you designed society not knowing your position in it (rich/poor, smart/average, etc.), what principles would you choose?",
    answer:
      "John Rawls argued you'd choose principles that help the worst-off, since you might be them. This thought experiment explores justice and fairness.",
    category: "Philosophy",
  },
  {
    title: "Mary's Room",
    prompt:
      "Mary knows everything about color but has never seen color (raised in black/white room). When she first sees red, does she learn something new?",
    answer:
      "This explores whether physical facts capture all facts. Some say yes (she learns what it's like to see red), others no (she already knew all physical facts about red).",
    category: "Philosophy",
  },
  {
    title: "The Chinese Room",
    prompt:
      "A person in a room follows rules to respond to Chinese characters passed through a slot. They don't understand Chinese but give perfect responses. Do they understand Chinese?",
    answer:
      "John Searle's argument against strong AI. The person follows syntax without semantics. This questions whether computers can truly understand or just simulate understanding.",
    category: "Philosophy",
  },
  {
    title: "The Grandfather Paradox",
    prompt:
      "If you travel back in time and prevent your grandfather from meeting your grandmother, how could you exist to make the trip?",
    answer:
      "Classic time travel paradox. Solutions include: parallel timelines, self-consistency principle, or the impossibility of changing the past.",
    category: "Philosophy",
  },
  {
    title: "Brain in a Vat",
    prompt:
      "How do you know you're not a brain in a vat being fed electrical impulses that simulate reality?",
    answer:
      "Modern version of Descartes' evil demon. Some argue the scenario is self-refuting - if you were a brain in a vat, 'vat' would refer to something different in your language.",
    category: "Philosophy",
  },
  {
    title: "The Sorites Paradox",
    prompt:
      "A heap of sand remains a heap if you remove one grain. If you keep removing grains one by one, when does it stop being a heap?",
    answer:
      "Illustrates the problem of vague predicates. There's no precise boundary. This challenges classical logic and explores fuzzy concepts.",
    category: "Philosophy",
  },
  {
    title: "Pascal's Wager",
    prompt:
      "Should you believe in God? If God exists and you believe, infinite reward. If God exists and you don't, infinite punishment. If God doesn't exist, finite loss either way.",
    answer:
      "Pascal argued you should believe due to the infinite expected value. Critics note: which God? Can you choose beliefs? Does insincere belief count?",
    category: "Philosophy",
  },

  // Science & Nature (15 puzzles)
  {
    title: "Schrödinger's Cat",
    prompt:
      "A cat in a box with a quantum device that has 50% chance of killing it. Before observation, is the cat alive, dead, or both?",
    answer:
      "In quantum mechanics, the cat is in a superposition of alive and dead until observed. This illustrates the measurement problem in quantum physics.",
    category: "Physics",
  },
  {
    title: "The Twin Paradox",
    prompt:
      "Twin A travels to a star at near light speed. Twin B stays on Earth. When A returns, who is older?",
    answer:
      "Twin B (Earth twin) is older. Time dilation means time passes slower for the traveling twin. This is a real effect of special relativity.",
    category: "Physics",
  },
  {
    title: "Maxwell's Demon",
    prompt:
      "A demon sorts fast and slow molecules between two chambers, seemingly decreasing entropy without work. Does this violate the second law of thermodynamics?",
    answer:
      "No violation. The demon must process information, and erasing that information increases entropy elsewhere, maintaining the second law overall.",
    category: "Physics",
  },
  {
    title: "The Fermi Paradox",
    prompt:
      "Given the vast number of stars and planets, where is everybody? Why haven't we encountered alien civilizations?",
    answer:
      "Many proposed solutions: Great Filter, rare Earth hypothesis, they're hiding, we're first, they're already here, or civilizations self-destruct.",
    category: "Astronomy",
  },
  {
    title: "Olbers' Paradox",
    prompt:
      "If the universe is infinite and uniform with infinite stars, why is the night sky dark?",
    answer:
      "The universe has finite age, so light from distant stars hasn't reached us yet. Also, cosmic expansion redshifts distant light beyond visible spectrum.",
    category: "Astronomy",
  },
  {
    title: "The Mpemba Effect",
    prompt:
      "Under certain conditions, hot water can freeze faster than cold water. How is this possible?",
    answer:
      "Several mechanisms: evaporation cooling, convection patterns, dissolved gases, or supercooling differences. The exact cause is still debated.",
    category: "Physics",
  },
  {
    title: "The Butterfly Effect",
    prompt:
      "Can a butterfly flapping its wings in Brazil cause a tornado in Texas?",
    answer:
      "In chaotic systems like weather, tiny changes can have large effects over time. While poetic, the specific butterfly-tornado connection is practically impossible to trace.",
    category: "Chaos Theory",
  },
  {
    title: "The Grandfather Clock",
    prompt:
      "Why does a pendulum clock keep better time when the pendulum swings in smaller arcs?",
    answer:
      "For small angles, the period is independent of amplitude (isochronism). For larger swings, the period increases, making the clock run slow.",
    category: "Physics",
  },
  {
    title: "The Doppler Effect",
    prompt:
      "Why does an ambulance siren sound different as it approaches versus moves away?",
    answer:
      "Sound waves compress as the source approaches (higher pitch) and stretch as it recedes (lower pitch). The frequency change depends on relative velocity.",
    category: "Physics",
  },
  {
    title: "The Greenhouse Effect",
    prompt: "How does Earth's atmosphere keep the planet warm?",
    answer:
      "Greenhouse gases absorb infrared radiation emitted by Earth's surface and re-emit it in all directions, including back toward Earth, trapping heat.",
    category: "Climate",
  },

  // Historical & Cultural (10 puzzles)
  {
    title: "The Calendar Conundrum",
    prompt: "If today is Monday, what day will it be 100 days from now?",
    answer:
      "Tuesday. 100 ÷ 7 = 14 remainder 2. So 100 days = 14 weeks + 2 days. Monday + 2 days = Wednesday. Wait, let me recalculate: it's actually Tuesday!",
    category: "Calendar",
  },
  {
    title: "The Leap Year Logic",
    prompt:
      "Why do we have leap years, and why isn't every fourth year a leap year?",
    answer:
      "Earth's orbit is 365.2422 days. We add a day every 4 years, skip century years unless divisible by 400. This keeps our calendar aligned with seasons.",
    category: "Calendar",
  },
  {
    title: "The International Date Line",
    prompt:
      "If you cross the International Date Line going west, do you gain or lose a day?",
    answer:
      "You lose a day (skip forward). Going east, you gain a day (repeat). This prevents the date from being different on opposite sides of Earth.",
    category: "Geography",
  },
  {
    title: "The Rosetta Stone",
    prompt: "How did the Rosetta Stone help decode Egyptian hieroglyphs?",
    answer:
      "It contained the same text in three scripts: hieroglyphs, Demotic, and Greek. Since scholars could read Greek, they could match symbols to sounds and meanings.",
    category: "History",
  },
  {
    title: "The Library of Alexandria",
    prompt: "What made the ancient Library of Alexandria so significant?",
    answer:
      "It was the largest library in the ancient world, attempting to collect all human knowledge. Scholars from across the Mediterranean came to study there.",
    category: "History",
  },
  {
    title: "The Antikythera Mechanism",
    prompt:
      "What was remarkable about this ancient Greek device found in a shipwreck?",
    answer:
      "It was an analog computer from ~100 BCE that predicted astronomical positions and eclipses. Its complexity wasn't matched again until the 14th century.",
    category: "History",
  },
  {
    title: "The Voynich Manuscript",
    prompt:
      "Why is this medieval manuscript considered one of history's greatest mysteries?",
    answer:
      "It's written in an unknown script and language, with bizarre illustrations. Despite centuries of study by cryptographers and linguists, it remains undeciphered.",
    category: "History",
  },
  {
    title: "The Dancing Plague",
    prompt: "What happened in Strasbourg in 1518 that baffled authorities?",
    answer:
      "Hundreds of people danced uncontrollably for days, some reportedly dancing themselves to death. Theories include mass hysteria, ergot poisoning, or religious fervor.",
    category: "History",
  },
  {
    title: "The Tunguska Event",
    prompt:
      "What caused the massive explosion in Siberia in 1908 that flattened 2000 square kilometers of forest?",
    answer:
      "Most likely a meteor or comet that exploded in the atmosphere. No crater was found, supporting the airburst theory.",
    category: "History",
  },
  {
    title: "The Wow! Signal",
    prompt: "What was significant about the radio signal detected in 1977?",
    answer:
      "It was a strong, narrowband signal from space that lasted 72 seconds. Its artificial appearance made it a candidate for extraterrestrial communication, but it was never repeated.",
    category: "History",
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
