import { User } from '@/types';

export const calculateRating = (user: User) => {
  return user.totalRating;
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