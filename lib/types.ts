// Game types and interfaces for Yahtzee

export type DieValue = 1 | 2 | 3 | 4 | 5 | 6;

export interface Die {
  value: DieValue;
  held: boolean;
}

export type ScoreCategory =
  | 'ones'
  | 'twos'
  | 'threes'
  | 'fours'
  | 'fives'
  | 'sixes'
  | 'threeOfAKind'
  | 'fourOfAKind'
  | 'fullHouse'
  | 'smallStraight'
  | 'largeStraight'
  | 'yahtzee'
  | 'chance';

export interface ScoreCard {
  ones: number | null;
  twos: number | null;
  threes: number | null;
  fours: number | null;
  fives: number | null;
  sixes: number | null;
  threeOfAKind: number | null;
  fourOfAKind: number | null;
  fullHouse: number | null;
  smallStraight: number | null;
  largeStraight: number | null;
  yahtzee: number | null;
  chance: number | null;
}

export interface GameState {
  dice: Die[];
  rollsLeft: number;
  scores: ScoreCard;
  round: number; // 1-13
  gameOver: boolean;
}

export interface GameResult {
  id?: number;
  date: string;
  scores: ScoreCard;
  totalScore: number;
  upperSectionTotal: number;
  upperSectionBonus: number;
  lowerSectionTotal: number;
}

export interface GameStats {
  totalGames: number;
  highScore: number;
  averageScore: number;
  totalYahtzees: number;
}
