'use client';

import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { getUserData, getUserHighScores } from '@/lib/auth';
import { User, UserHighScores } from '@/types';
import Link from 'next/link';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { motion } from 'framer-motion';
import { Meteors } from '@/components/ui/meteors';

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
    { id: 'flying-meme', name: 'Flying Meme', emoji: '🐦', description: 'Fly through obstacles', key: 'flyingMeme' as const },
    { id: 'quick-math', name: 'Quick Math', emoji: '🧮', description: 'Solve math problems fast', key: 'quickMath' as const },
    { id: 'word-puzzle', name: 'Word Puzzle', emoji: '🔤', description: 'Unscramble the words', key: 'wordPuzzle' as const },
    { id: 'reaction-time', name: 'Reaction Time', emoji: '⚡', description: 'Test your reflexes', key: 'reactionTime' as const }
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
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">Memerverse</h1>
            <div className="flex items-center gap-6">
              <Link href="/ranking" className="text-neutral-300 hover:text-purple-400 transition">Rankings</Link>
              <Link href="/profile" className="text-neutral-300 hover:text-purple-400 transition">Profile</Link>
              <span className="text-neutral-300">Welcome, {user.userName}</span>
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
              <h2 className="text-4xl font-bold text-white mb-8">Dashboard</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {games.map((game, idx) => (
                  <motion.div
                    key={game.key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl"
                  >
                    <div className="text-4xl mb-2">{game.emoji}</div>
                    <h3 className="text-lg font-medium text-white mb-1">{game.name}</h3>
                    <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                      {highScores?.highScores[game.key] ?? user.gameScores[game.key]}
                    </p>
                    <p className="text-xs text-neutral-400 mt-1">Best Score</p>
                  </motion.div>
                ))}
              </div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-xl mb-12"
              >
                <h3 className="text-xl font-medium text-white mb-2">Total High Score</h3>
                <p className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400">
                  {highScores?.totalHighScore ?? user.totalRating}
                </p>
                <p className="text-sm text-neutral-400 mt-2">Combined best scores across all games</p>
              </motion.div>

              <h3 className="text-3xl font-bold text-white mb-6">Choose a Game</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {games.map((game, idx) => (
                  <motion.div
                    key={game.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + idx * 0.1 }}
                    className="relative"
                  >
                    <Link href={`/games/${game.id}`}>
                      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-sm p-6 hover:border-purple-500/50 hover:scale-105 transition-all group cursor-pointer">
                        <Meteors number={10} />
                        <div className="relative z-10">
                          <div className="text-5xl mb-4">{game.emoji}</div>
                          <h4 className="text-xl font-bold text-white mb-2">{game.name}</h4>
                          <p className="text-neutral-300 mb-2">{game.description}</p>
                          <p className="text-sm text-neutral-400 mb-4">
                            Best: {highScores?.highScores[game.key] ?? user.gameScores[game.key]}
                          </p>
                          <span className="text-purple-400 font-semibold group-hover:text-pink-400 transition">Play Now →</span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
