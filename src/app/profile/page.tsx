'use client';

import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { getUserData, logoutUser } from '@/lib/auth';
import { User } from '@/types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        const userData = await getUserData(firebaseUser.uid);
        setUser(userData);
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
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center mb-6">
              <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-600">
                  {user.userName.charAt(0).toUpperCase()}
                </span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">{user.userName}</h2>
              <p className="text-gray-600">{user.email}</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Rating:</span>
                <span className="font-semibold">{user.totalRating}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Rank:</span>
                <span className="font-semibold">#{user.rank || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Member Since:</span>
                <span className="font-semibold">
                  {user.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A'}
                </span>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="w-full mt-6 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
            >
              Logout
            </button>
          </div>
          
          {/* Game Scores */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Game Scores</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Flying Meme</h4>
                  <p className="text-sm text-gray-600">Fly through obstacles</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">{user.gameScores.flyingMeme}</p>
                  <p className="text-xs text-gray-500">Best Score</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Quick Math</h4>
                  <p className="text-sm text-gray-600">Solve math problems fast</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">{user.gameScores.quickMath}</p>
                  <p className="text-xs text-gray-500">Best Score</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Word Puzzle</h4>
                  <p className="text-sm text-gray-600">Unscramble the words</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-purple-600">{user.gameScores.wordPuzzle}</p>
                  <p className="text-xs text-gray-500">Best Score</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-orange-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Reaction Time</h4>
                  <p className="text-sm text-gray-600">Test your reflexes</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-orange-600">{user.gameScores.reactionTime}</p>
                  <p className="text-xs text-gray-500">Best Score</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}