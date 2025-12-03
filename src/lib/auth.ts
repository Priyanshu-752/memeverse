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
import { User, UserRanking } from '@/types';

// Register new user
export const registerUser = async (email: string, password: string, userName: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  
  const userData: Omit<User, 'uid'> = {
    email: user.email!,
    userName,
    createdAt: Timestamp.now(),
    gameScores: {
      memoryMatch: 0,
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

// Update user game score
export const updateUserScore = async (uid: string, gameType: keyof User['gameScores'], score: number) => {
  const userRef = doc(db, 'users', uid);
  const userData = await getUserData(uid);
  
  if (userData) {
    const newGameScores = { ...userData.gameScores, [gameType]: score };
    const totalRating = Object.values(newGameScores).reduce((sum, score) => sum + score, 0);
    
    await updateDoc(userRef, {
      [`gameScores.${gameType}`]: score,
      totalRating
    });
  }
};

// Get combined ranking (all games)
export const getCombinedRanking = async (): Promise<UserRanking[]> => {
  const q = query(collection(db, 'users'), orderBy('totalRating', 'desc'));
  const querySnapshot = await getDocs(q);
  
  const rankings: UserRanking[] = [];
  querySnapshot.forEach((doc, index) => {
    const data = doc.data();
    rankings.push({
      uid: doc.id,
      userName: data.userName,
      totalRating: data.totalRating,
      gameScores: data.gameScores,
      rank: index + 1
    });
  });
  
  return rankings;
};

// Get game-wise ranking
export const getGameRanking = async (gameType: keyof User['gameScores']): Promise<UserRanking[]> => {
  const q = query(collection(db, 'users'), orderBy(`gameScores.${gameType}`, 'desc'));
  const querySnapshot = await getDocs(q);
  
  const rankings: UserRanking[] = [];
  querySnapshot.forEach((doc, index) => {
    const data = doc.data();
    rankings.push({
      uid: doc.id,
      userName: data.userName,
      totalRating: data.totalRating,
      gameScores: data.gameScores,
      rank: index + 1
    });
  });
  
  return rankings;
};