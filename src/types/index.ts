import { Timestamp } from 'firebase/firestore';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  createdAt: Timestamp;
  totalGamesPlayed: number;
  totalScore: number;
  rating: number;
  rank: number;
}

export interface Game {
  id: string;
  name: string;
  description: string;
  maxScore: number;
  difficulty: 'easy' | 'medium' | 'hard';
  isActive: boolean;
}

export interface GameSession {
  id: string;
  userId: string;
  gameId: string;
  score: number;
  duration: number;
  completedAt: Timestamp;
  difficulty: string;
}

export interface LeaderboardEntry {
  userId: string;
  userName: string;
  totalScore: number;
  gamesPlayed: number;
  rating: number;
  rank: number;
  lastUpdated: Timestamp;
}