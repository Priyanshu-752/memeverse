# High Scores System Documentation

## Overview

The Memeverse game platform now maintains **two separate score tracking systems**:

1. **Latest Scores** (`users` collection) - Tracks the most recent game scores
2. **High Scores** (`highScores` collection) - Tracks personal best scores for each game

## Collections Structure

### Users Collection (`users`)
Stores the latest score for each game:
```typescript
{
  uid: string;
  email: string;
  userName: string;
  createdAt: Timestamp;
  gameScores: {
    flyingMeme: number;      // Latest score
    quickMath: number;       // Latest score
    wordPuzzle: number;      // Latest score
    reactionTime: number;    // Latest score
  };
  totalRating: number;       // Sum of latest scores
  rank: number;
}
```

### High Scores Collection (`highScores`)
Stores the highest score ever achieved for each game:
```typescript
{
  uid: string;
  userName: string;
  highScores: {
    flyingMeme: number;      // Best score ever
    quickMath: number;       // Best score ever
    wordPuzzle: number;      // Best score ever
    reactionTime: number;    // Best score ever
  };
  totalHighScore: number;    // Sum of all high scores
  lastUpdated: Timestamp;
}
```

## Key Features

### Automatic High Score Tracking
When a user completes a game:
1. The `updateUserScore()` function is called
2. It updates the latest score in the `users` collection
3. It automatically calls `updateHighScore()` to check if this is a new personal best
4. If the new score is higher than the existing high score, the `highScores` collection is updated
5. If it's the user's first time playing, a new high score document is created

### Ranking Display
The ranking page (`/ranking`) displays:
- **High scores** from the `highScores` collection
- Supports both combined ranking (all games) and individual game rankings
- Shows "Highest Scores" in the title to clarify what's being displayed

## Migration

### For Existing Applications

If you have existing user data, you need to initialize the `highScores` collection:

1. **Navigate to the migration page**: `/admin/migrate`
2. **Click "Run Migration"** to copy existing scores to the high scores collection
3. **Click "Verify Migration"** to ensure the migration was successful

You can also run the migration programmatically:

```typescript
import { migrateToHighScores, verifyMigration } from '@/lib/migrate-high-scores';

// Run migration
await migrateToHighScores();

// Verify migration
await verifyMigration();
```

### For New Applications

For new applications, the `highScores` collection will be automatically populated when users play games for the first time.

## API Functions

### Update Score
```typescript
await updateUserScore(uid: string, gameType: string, score: number);
```
Updates both latest score and high score (if applicable).

### Get High Scores
```typescript
const highScores = await getUserHighScores(uid: string);
```
Retrieves a user's high scores.

### Get Rankings
```typescript
// Combined ranking (all games)
const rankings = await getCombinedRanking();

// Game-specific ranking
const rankings = await getGameRanking('flyingMeme');
```
Rankings are now based on high scores from the `highScores` collection.

## Future Use Cases

The separate collections enable:

1. **Statistics Dashboard**: Show both current form (latest scores) and all-time bests (high scores)
2. **Achievement Tracking**: Award badges when users beat their personal bests
3. **Progress Tracking**: Display improvement over time
4. **Competitive Features**: Compare latest performance vs. high scores
5. **Analytics**: Track how often users beat their personal bests

## Example Usage in Games

The Flying Meme game already implements this system. When a game ends:

```typescript
// In flying-meme/page.tsx
const endGame = async (finalScore: number) => {
  // ... game over logic ...
  
  if (user) {
    try {
      // This single call updates both latest and high scores
      await updateUserScore(user.uid, 'flyingMeme', finalScore);
    } catch (error) {
      console.error('Error updating score:', error);
    }
  }
};
```

You can apply the same pattern to other games:
- `quickMath`
- `wordPuzzle`
- `reactionTime`

## Firestore Rules

Make sure your Firestore rules allow read/write access to both collections:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /highScores/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Notes

- High scores are only updated when a new score **exceeds** the existing high score
- The migration is **safe to run multiple times** (it will overwrite with the same data)
- Both collections are updated in the same transaction for consistency
- Rankings fetch from `highScores` collection for better performance
