
export interface TileBonus {
  row: number;
  col: number;
  type: string;
  delta: number;
}

export interface WordMultiplier {
  row: number;
  col: number;
  type: string;
  factor: number;
}

export interface Crossword {
  word: string;
  positions: { r: number; c: number }[];
  points: number;
}

export interface ScoreBreakdown {
  base: number;
  letterBonuses: TileBonus[];
  wordMultipliers: WordMultiplier[];
  crosswords: Crossword[];
  bingoBonus: number;
  total: number;
}

export interface MoveSuggestion {
  word: string;
  row: number; // 0-14
  col: number; // 0-14
  direction: 'across' | 'down';
  usedFromRack: string[];
  score: ScoreBreakdown;
  strategy: string[];
  detailedStrategy?: string; // New field for plain-language explanation
  textInstructions: string; // "Place T at H7, A at H8..."
}

export type BoardState = Record<string, string>;

export interface AnalysisResult {
  best: MoveSuggestion;
  alternatives: MoveSuggestion[];
  nextRackAdvice: string;
  detectedBoard?: BoardState;
}

export const GameMode = {
  MAX_SCORE: 'maximize score',
  DEFENSIVE: 'safer board',
  BINGO: 'bingo hunting'
} as const;

export type GameMode = typeof GameMode[keyof typeof GameMode];
