'use client';

import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { getUserData, logoutUser } from '@/lib/auth';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { User, GameSession } from '@/types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [gameSessions, setGameSessions] = useState<GameSession[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        const userData = await getUserData(firebaseUser.uid);
        setUser(userData);
        
        // Fetch game sessions
        const q = query(
          collection(db, 'gameSessions'),
          where('userId', '==', firebaseUser.uid),
          orderBy('completedAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const sessions = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as GameSession[];
        setGameSessions(sessions);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Please login</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/dashboard" className="text-blue-600 hover:underline">← Back to Dashboard</Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">Profile</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-600">
                    {user.displayName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900">{user.displayName}</h2>
                <p className="text-gray-600">{user.email}</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Games Played:</span>
                  <span className="font-semibold">{user.totalGamesPlayed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Score:</span>
                  <span className="font-semibold">{user.totalScore}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Rating:</span>
                  <span className="font-semibold">{user.rating}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Rank:</span>
                  <span className="font-semibold">#{user.rank || 'N/A'}</span>
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                className="w-full mt-6 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
          
          {/* Game History */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Game History</h3>
              </div>
              
              <div className="p-6">
                {gameSessions.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No games played yet. Start playing to see your history!
                  </p>
                ) : (
                  <div className="space-y-4">
                    {gameSessions.slice(0, 10).map((session) => (
                      <div key={session.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">{session.gameId}</h4>
                          <p className="text-sm text-gray-600">
                            {session.completedAt?.toDate?.()?.toLocaleDateString() || 'Recent'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">Score: {session.score}</p>
                          <p className="text-sm text-gray-600">Duration: {session.duration}s</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}