'use client';

import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { getUserData, logoutUser } from '@/lib/auth';
import { User } from '@/types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { motion } from 'framer-motion';

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

  if (loading || !user) {
    return null;
  }

  const gameStats = [
    { name: 'Flying Meme', emoji: '🐦', score: user.gameScores.flyingMeme, color: 'from-blue-400 to-cyan-400' },
    { name: 'Quick Math', emoji: '🧮', score: user.gameScores.quickMath, color: 'from-green-400 to-emerald-400' },
    { name: 'Word Puzzle', emoji: '🔤', score: user.gameScores.wordPuzzle, color: 'from-purple-400 to-pink-400' },
    { name: 'Reaction Time', emoji: '⚡', score: user.gameScores.reactionTime, color: 'from-orange-400 to-red-400' }
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen w-full relative overflow-hidden">
        <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-black to-pink-900">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.15),transparent_50%)]" />
          <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <header className="fixed top-0 w-full z-50 bg-black/30 backdrop-blur-md border-b border-white/10">
          <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <Link href="/dashboard" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">Memerverse</Link>
            <div className="flex items-center gap-6">
              <Link href="/dashboard" className="text-neutral-300 hover:text-purple-400 transition">Dashboard</Link>
              <Link href="/ranking" className="text-neutral-300 hover:text-purple-400 transition">Rankings</Link>
            </div>
          </nav>
        </header>

        <div className="relative pt-24 pb-12 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link href="/dashboard" className="text-purple-400 hover:text-pink-400 transition mb-6 inline-block">← Back to Dashboard</Link>
              <h1 className="text-4xl font-bold text-white mb-8">Profile</h1>
            </motion.div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-xl"
              >
                <div className="text-center mb-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg shadow-purple-500/50">
                    <span className="text-3xl font-bold text-white">
                      {user.userName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <h2 className="text-2xl font-semibold text-white">{user.userName}</h2>
                  <p className="text-neutral-400">{user.email}</p>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                    <span className="text-neutral-300">Total Rating:</span>
                    <span className="font-semibold text-white">{user.totalRating}</span>
                  </div>
                  <div className="flex justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                    <span className="text-neutral-300">Rank:</span>
                    <span className="font-semibold text-white">#{user.rank || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                    <span className="text-neutral-300">Member Since:</span>
                    <span className="font-semibold text-white">
                      {user.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A'}
                    </span>
                  </div>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLogout}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-4 rounded-lg font-semibold hover:opacity-90 shadow-lg shadow-red-500/30"
                >
                  Logout
                </motion.button>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-xl"
              >
                <h3 className="text-2xl font-semibold text-white mb-6">Game Scores</h3>
                
                <div className="space-y-4">
                  {gameStats.map((game, idx) => (
                    <motion.div
                      key={game.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + idx * 0.1 }}
                      className="flex justify-between items-center p-5 bg-white/5 rounded-xl border border-white/10 hover:border-purple-500/50 transition"
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-4xl">{game.emoji}</div>
                        <div>
                          <h4 className="font-medium text-white">{game.name}</h4>
                          <p className="text-sm text-neutral-400">Best Score</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${game.color}`}>
                          {game.score}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
