export interface User {
  id: number;
  username: string;
  email: string;
  totalPoints: number;
  currentLevel: number;
  gamesPlayed: number;
  streakDays: number;
  badges: BadgeType[];
  lastActivity: string;
  createdAt: string;
}

export enum BadgeType {
  FIRST_STEPS = 'FIRST_STEPS',
  SPEED_DEMON = 'SPEED_DEMON',
  MATH_WIZARD = 'MATH_WIZARD',
  PERFECT_MEMORY = 'PERFECT_MEMORY',
  QUIZ_MASTER = 'QUIZ_MASTER',
  AI_LEARNER = 'AI_LEARNER',
  STREAK_KING = 'STREAK_KING',
  CHAMPION = 'CHAMPION'
}

export enum GameType {
  QUIZ_BATTLE = 'QUIZ_BATTLE',
  TYPING_RACE = 'TYPING_RACE',
  MATH_LIGHTNING = 'MATH_LIGHTNING',
  WORD_SCRAMBLE = 'WORD_SCRAMBLE',
  MEMORY_FLASH = 'MEMORY_FLASH'
}

export interface GameSession {
  id: number;
  gameType: GameType;
  score: number;
  pointsEarned: number;
  duration: number;
  gameData: string;
  playedAt: string;
}