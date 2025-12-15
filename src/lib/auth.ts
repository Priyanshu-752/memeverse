import { auth, db } from './firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User as FirebaseUser
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  query,
  orderBy,
  getDocs,
  where,
  Timestamp
} from 'firebase/firestore';
import { User, UserRanking, UserHighScores } from '@/types';

// Register new user
export const registerUser = async (email: string, password: string, userName: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  const userData: Omit<User, 'uid'> = {
    email: user.email!,
    userName,
    createdAt: Timestamp.now(),
    gameScores: {
      flyingMeme: 0,
      quickMath: 0,
      wordPuzzle: 0,
      reactionTime: 0
    },
    totalRating: 0,
    rank: 0
  };

  await setDoc(doc(db, 'users', user.uid), userData);
  return user;
};

// Login user
export const loginUser = async (email: string, password: string) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

// Logout user
export const logoutUser = async () => {
  return await signOut(auth);
};

// Get user data
export const getUserData = async (uid: string): Promise<User | null> => {
  const docRef = doc(db, 'users', uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { uid, ...docSnap.data() } as User;
  }
  return null;
};

// Update user game score (for latest scores in users collection)
export const updateUserScore = async (uid: string, gameType: keyof User['gameScores'], score: number) => {
  const userRef = doc(db, 'users', uid);
  const userData = await getUserData(uid);

  if (userData) {
    const newGameScores = { ...userData.gameScores, [gameType]: score };
    const totalRating = Object.values(newGameScores).reduce((sum, score) => sum + score, 0);

    // Update latest score in users collection
    await updateDoc(userRef, {
      [`gameScores.${gameType}`]: score,
      totalRating
    });

    // Also update high score if this score is better
    await updateHighScore(uid, userData.userName, gameType, score);
  }
};

// Update high score in the highScores collection
export const updateHighScore = async (
  uid: string,
  userName: string,
  gameType: keyof User['gameScores'],
  score: number
) => {
  const highScoreRef = doc(db, 'highScores', uid);
  const highScoreDoc = await getDoc(highScoreRef);

  if (highScoreDoc.exists()) {
    const currentHighScores = highScoreDoc.data() as UserHighScores;
    const currentHighScore = currentHighScores.highScores[gameType];

    // Only update if new score is higher
    if (score > currentHighScore) {
      const newHighScores = { ...currentHighScores.highScores, [gameType]: score };
      const totalHighScore = Object.values(newHighScores).reduce((sum, s) => sum + s, 0);

      await updateDoc(highScoreRef, {
        [`highScores.${gameType}`]: score,
        totalHighScore,
        lastUpdated: Timestamp.now()
      });
    }
  } else {
    // Create new high score document if it doesn't exist
    const highScoreData: UserHighScores = {
      uid,
      userName,
      highScores: {
        flyingMeme: gameType === 'flyingMeme' ? score : 0,
        quickMath: gameType === 'quickMath' ? score : 0,
        wordPuzzle: gameType === 'wordPuzzle' ? score : 0,
        reactionTime: gameType === 'reactionTime' ? score : 0
      },
      totalHighScore: score,
      lastUpdated: Timestamp.now()
    };

    await setDoc(highScoreRef, highScoreData);
  }
};

// Get user's high scores
export const getUserHighScores = async (uid: string): Promise<UserHighScores | null> => {
  const docRef = doc(db, 'highScores', uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as UserHighScores;
  }
  return null;
};

// Get combined ranking based on high scores
export const getCombinedRanking = async (): Promise<UserRanking[]> => {
  const q = query(collection(db, 'highScores'), orderBy('totalHighScore', 'desc'));
  const querySnapshot = await getDocs(q);

  const rankings: UserRanking[] = [];
  querySnapshot.forEach((doc) => {
    const data = doc.data() as UserHighScores;
    rankings.push({
      uid: doc.id,
      userName: data.userName,
      totalRating: data.totalHighScore,
      gameScores: data.highScores,
      rank: rankings.length + 1
    });
  });

  return rankings;
};

// Get game-wise ranking based on high scores
export const getGameRanking = async (gameType: keyof User['gameScores']): Promise<UserRanking[]> => {
  const q = query(collection(db, 'highScores'), orderBy(`highScores.${gameType}`, 'desc'));
  const querySnapshot = await getDocs(q);

  const rankings: UserRanking[] = [];
  querySnapshot.forEach((doc) => {
    const data = doc.data() as UserHighScores;
    rankings.push({
      uid: doc.id,
      userName: data.userName,
      totalRating: data.totalHighScore,
      gameScores: data.highScores,
      rank: rankings.length + 1
    });
  });

  return rankings;
};