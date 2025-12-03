import { User } from '@/types';

export const calculateRating = (user: User) => {
  const baseRating = 1000;
  const gamesBonus = user.totalGamesPlayed * 10;
  const scoreMultiplier = user.totalGamesPlayed > 0 ? user.totalScore / user.totalGamesPlayed : 0;
  
  return Math.round(baseRating + gamesBonus + scoreMultiplier);
};

export const formatDate = (timestamp: any) => {
  if (!timestamp) return 'N/A';
  
  try {
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString();
  } catch (error) {
    return 'N/A';
  }
};