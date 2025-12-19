'use client';

import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { getUserData, getUserHighScores } from '@/lib/auth';
import { User, UserHighScores } from '@/types';
import Link from 'next/link';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [highScores, setHighScores] = useState<UserHighScores | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        const [userData, userHighScores] = await Promise.all([
          getUserData(firebaseUser.uid),
          getUserHighScores(firebaseUser.uid)
        ]);
        setUser(userData);
        setHighScores(userHighScores);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading || !user) {
    return null;
  }

  const games = [
    { id: 'flying-meme', name: 'Flying Meme', description: 'Fly through obstacles', key: 'flyingMeme' as const },
    { id: 'quick-math', name: 'Quick Math', description: 'Solve math problems fast', key: 'quickMath' as const },
    { id: 'word-puzzle', name: 'Word Puzzle', description: 'Unscramble the words', key: 'wordPuzzle' as const },
    { id: 'reaction-time', name: 'Reaction Time', description: 'Test your reflexes', key: 'reactionTime' as const }
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl text-gray-900 font-semibold">memerverse</h1>
              </div>
              <div className="flex items-center space-x-4">
                <Link href="/ranking" className="text-gray-700 hover:text-gray-900">Rankings</Link>
                <Link href="/profile" className="text-gray-700 hover:text-gray-900">Profile</Link>
                <span className="text-gray-700">Welcome, {user.userName}</span>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Dashboard</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-medium text-gray-900">Flying Meme</h3>
                  <p className="text-3xl font-bold text-blue-600">
                    {highScores?.highScores.flyingMeme ?? user.gameScores.flyingMeme}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Best Score</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-medium text-gray-900">Quick Math</h3>
                  <p className="text-3xl font-bold text-green-600">
                    {highScores?.highScores.quickMath ?? user.gameScores.quickMath}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Best Score</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-medium text-gray-900">Word Puzzle</h3>
                  <p className="text-3xl font-bold text-purple-600">
                    {highScores?.highScores.wordPuzzle ?? user.gameScores.wordPuzzle}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Best Score</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-medium text-gray-900">Reaction Time</h3>
                  <p className="text-3xl font-bold text-orange-600">
                    {highScores?.highScores.reactionTime ?? user.gameScores.reactionTime}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Best Score</p>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Total High Score</h3>
                <p className="text-4xl font-bold text-indigo-600">
                  {highScores?.totalHighScore ?? user.totalRating}
                </p>
                <p className="text-sm text-gray-500">Combined best scores across all games</p>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Choose a Game</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {games.map((game) => (
                  <Link
                    key={game.id}
                    href={`/games/${game.id}`}
                    className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
                  >
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">{game.name}</h4>
                    <p className="text-gray-600 mb-2">{game.description}</p>
                    <p className="text-sm text-gray-500 mb-4">
                      Best Score: {highScores?.highScores[game.key] ?? user.gameScores[game.key]}
                    </p>
                    <div className="mt-4">
                      <span className="text-blue-600 font-medium">Play Now →</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}