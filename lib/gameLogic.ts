// Game logic and scoring functions for Yahtzee

import { Die, DieValue, ScoreCard, ScoreCategory } from './types';

// Roll dice that are not held
export const rollDice = (dice: Die[]): Die[] => {
  return dice.map(die => ({
    ...die,
    value: die.held ? die.value : (Math.floor(Math.random() * 6) + 1) as DieValue,
  }));
};

// Initialize new dice
export const initializeDice = (): Die[] => {
  return Array.from({ length: 5 }, () => ({
    value: 1 as DieValue,
    held: false,
  }));
};

// Count occurrences of each die value
const countDice = (dice: Die[]): Map<DieValue, number> => {
  const counts = new Map<DieValue, number>();
  dice.forEach(die => {
    counts.set(die.value, (counts.get(die.value) || 0) + 1);
  });
  return counts;
};

// Check if dice contain n of a kind
const hasNOfAKind = (dice: Die[], n: number): boolean => {
  const counts = countDice(dice);
  return Array.from(counts.values()).some(count => count >= n);
};

// Sum of all dice
const sumDice = (dice: Die[]): number => {
  return dice.reduce((sum, die) => sum + die.value, 0);
};

// Calculate score for upper section (ones through sixes)
const calculateUpperSection = (dice: Die[], value: DieValue): number => {
  return dice.filter(die => die.value === value).reduce((sum, die) => sum + die.value, 0);
};

// Calculate three of a kind score
const calculateThreeOfAKind = (dice: Die[]): number => {
  return hasNOfAKind(dice, 3) ? sumDice(dice) : 0;
};

// Calculate four of a kind score
const calculateFourOfAKind = (dice: Die[]): number => {
  return hasNOfAKind(dice, 4) ? sumDice(dice) : 0;
};

// Calculate full house score (25 points)
const calculateFullHouse = (dice: Die[]): number => {
  const counts = Array.from(countDice(dice).values()).sort((a, b) => b - a);
  return (counts[0] === 3 && counts[1] === 2) ? 25 : 0;
};

// Calculate small straight score (30 points)
const calculateSmallStraight = (dice: Die[]): number => {
  const uniqueValues = Array.from(new Set(dice.map(die => die.value))).sort();
  
  // Check for sequences of 4
  const sequences = [
    [1, 2, 3, 4],
    [2, 3, 4, 5],
    [3, 4, 5, 6],
  ];
  
  const hasSmallStraight = sequences.some(seq => 
    seq.every(val => uniqueValues.includes(val as DieValue))
  );
  
  return hasSmallStraight ? 30 : 0;
};

// Calculate large straight score (40 points)
const calculateLargeStraight = (dice: Die[]): number => {
  const uniqueValues = Array.from(new Set(dice.map(die => die.value))).sort();
  
  const sequences = [
    [1, 2, 3, 4, 5],
    [2, 3, 4, 5, 6],
  ];
  
  const hasLargeStraight = sequences.some(seq => 
    seq.length === uniqueValues.length &&
    seq.every((val, idx) => uniqueValues[idx] === val)
  );
  
  return hasLargeStraight ? 40 : 0;
};

// Calculate Yahtzee score (50 points)
const calculateYahtzee = (dice: Die[]): number => {
  return hasNOfAKind(dice, 5) ? 50 : 0;
};

// Calculate chance score (sum of all dice)
const calculateChance = (dice: Die[]): number => {
  return sumDice(dice);
};

// Calculate potential score for a category
export const calculateScore = (dice: Die[], category: ScoreCategory): number => {
  switch (category) {
    case 'ones':
      return calculateUpperSection(dice, 1);
    case 'twos':
      return calculateUpperSection(dice, 2);
    case 'threes':
      return calculateUpperSection(dice, 3);
    case 'fours':
      return calculateUpperSection(dice, 4);
    case 'fives':
      return calculateUpperSection(dice, 5);
    case 'sixes':
      return calculateUpperSection(dice, 6);
    case 'threeOfAKind':
      return calculateThreeOfAKind(dice);
    case 'fourOfAKind':
      return calculateFourOfAKind(dice);
    case 'fullHouse':
      return calculateFullHouse(dice);
    case 'smallStraight':
      return calculateSmallStraight(dice);
    case 'largeStraight':
      return calculateLargeStraight(dice);
    case 'yahtzee':
      return calculateYahtzee(dice);
    case 'chance':
      return calculateChance(dice);
    default:
      return 0;
  }
};

// Calculate upper section total
export const calculateUpperSectionTotal = (scores: ScoreCard): number => {
  const upperCategories: (keyof ScoreCard)[] = ['ones', 'twos', 'threes', 'fours', 'fives', 'sixes'];
  return upperCategories.reduce((sum, category) => {
    const score = scores[category];
    return sum + (score !== null ? score : 0);
  }, 0);
};

// Calculate upper section bonus (35 points if upper section >= 63)
export const calculateUpperSectionBonus = (scores: ScoreCard): number => {
  return calculateUpperSectionTotal(scores) >= 63 ? 35 : 0;
};

// Calculate lower section total
export const calculateLowerSectionTotal = (scores: ScoreCard): number => {
  const lowerCategories: (keyof ScoreCard)[] = [
    'threeOfAKind',
    'fourOfAKind',
    'fullHouse',
    'smallStraight',
    'largeStraight',
    'yahtzee',
    'chance',
  ];
  return lowerCategories.reduce((sum, category) => {
    const score = scores[category];
    return sum + (score !== null ? score : 0);
  }, 0);
};

// Calculate total score
export const calculateTotalScore = (scores: ScoreCard): number => {
  return (
    calculateUpperSectionTotal(scores) +
    calculateUpperSectionBonus(scores) +
    calculateLowerSectionTotal(scores)
  );
};

// Initialize empty score card
export const initializeScoreCard = (): ScoreCard => {
  return {
    ones: null,
    twos: null,
    threes: null,
    fours: null,
    fives: null,
    sixes: null,
    threeOfAKind: null,
    fourOfAKind: null,
    fullHouse: null,
    smallStraight: null,
    largeStraight: null,
    yahtzee: null,
    chance: null,
  };
};

// Get category display name
export const getCategoryName = (category: ScoreCategory): string => {
  const names: Record<ScoreCategory, string> = {
    ones: 'Ones',
    twos: 'Twos',
    threes: 'Threes',
    fours: 'Fours',
    fives: 'Fives',
    sixes: 'Sixes',
    threeOfAKind: '3 of a Kind',
    fourOfAKind: '4 of a Kind',
    fullHouse: 'Full House',
    smallStraight: 'Small Straight',
    largeStraight: 'Large Straight',
    yahtzee: 'Yahtzee',
    chance: 'Chance',
  };
  return names[category];
};

// Get category description
export const getCategoryDescription = (category: ScoreCategory): string => {
  const descriptions: Record<ScoreCategory, string> = {
    ones: 'Sum of all ones',
    twos: 'Sum of all twos',
    threes: 'Sum of all threes',
    fours: 'Sum of all fours',
    fives: 'Sum of all fives',
    sixes: 'Sum of all sixes',
    threeOfAKind: 'At least 3 dice the same. Sum of all dice',
    fourOfAKind: 'At least 4 dice the same. Sum of all dice',
    fullHouse: '3 of one number and 2 of another. Worth 25 points',
    smallStraight: 'Four sequential dice (e.g. 1-2-3-4). Worth 30 points',
    largeStraight: 'Five sequential dice (e.g. 1-2-3-4-5). Worth 40 points',
    yahtzee: 'All five dice the same. Worth 50 points',
    chance: 'Any combination. Sum of all dice',
  };
  return descriptions[category];
};
