'use client';

import { useState, useEffect } from 'react';
import { getCombinedRanking, getGameRanking } from '@/lib/auth';
import { UserRanking } from '@/types';
import Link from 'next/link';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { motion } from 'framer-motion';

export default function RankingPage() {
  const [rankings, setRankings] = useState<UserRanking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState<'combined' | 'flyingMeme' | 'quickMath' | 'wordPuzzle' | 'reactionTime'>('combined');

  const gameOptions = [
    { key: 'combined' as const, name: 'Combined Ranking', emoji: '🏆' },
    { key: 'flyingMeme' as const, name: 'Flying Meme', emoji: '🐦' },
    { key: 'quickMath' as const, name: 'Quick Math', emoji: '🧮' },
    { key: 'wordPuzzle' as const, name: 'Word Puzzle', emoji: '🔤' },
    { key: 'reactionTime' as const, name: 'Reaction Time', emoji: '⚡' }
  ];

  useEffect(() => {
    const fetchRankings = async () => {
      setLoading(true);
      try {
        let data: UserRanking[];
        if (selectedGame === 'combined') {
          data = await getCombinedRanking();
        } else {
          data = await getGameRanking(selectedGame);
        }
        setRankings(data);
      } catch (error) {
        console.error('Error fetching rankings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRankings();
  }, [selectedGame]);

  const getMedalEmoji = (index: number) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `#${index + 1}`;
  };

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
              <Link href="/profile" className="text-neutral-300 hover:text-purple-400 transition">Profile</Link>
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
              <h1 className="text-4xl font-bold text-white mb-2">Rankings</h1>
              <p className="text-neutral-300 mb-8">Displaying all-time best scores for each player</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl overflow-hidden"
            >
              <div className="px-6 py-5 border-b border-white/10">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
                    <span className="text-3xl">{gameOptions.find(g => g.key === selectedGame)?.emoji}</span>
                    Leaderboard
                  </h2>
                  <select
                    value={selectedGame}
                    onChange={(e) => setSelectedGame(e.target.value as any)}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {gameOptions.map((option) => (
                      <option key={option.key} value={option.key} className="bg-gray-900">
                        {option.emoji} {option.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              {loading ? (
                <div className="px-6 py-12 text-center text-neutral-400">Loading rankings...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-white/5">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                          Rank
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                          Player
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                          {selectedGame === 'combined' ? 'Total High Score' : 'Best Score'}
                        </th>
                        {selectedGame === 'combined' && (
                          <>
                            <th className="px-6 py-4 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                              🐦 Flying
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                              🧮 Math
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                              🔤 Puzzle
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                              ⚡ Reaction
                            </th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {rankings.length === 0 ? (
                        <tr>
                          <td colSpan={selectedGame === 'combined' ? 7 : 3} className="px-6 py-8 text-center text-neutral-400">
                            No rankings available yet. Start playing games to appear on the leaderboard!
                          </td>
                        </tr>
                      ) : (
                        rankings.map((entry, index) => (
                          <motion.tr
                            key={entry.uid}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`${index < 3 ? 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10' : 'hover:bg-white/5'} transition`}
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-white">
                              {getMedalEmoji(index)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">
                              {entry.userName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                              {selectedGame === 'combined' ? entry.totalRating : entry.gameScores[selectedGame]}
                            </td>
                            {selectedGame === 'combined' && (
                              <>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-300">
                                  {entry.gameScores.flyingMeme}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-300">
                                  {entry.gameScores.quickMath}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-300">
                                  {entry.gameScores.wordPuzzle}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-300">
                                  {entry.gameScores.reactionTime}
                                </td>
                              </>
                            )}
                          </motion.tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
