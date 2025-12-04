'use client';

import { useState, useEffect } from 'react';
import { getCombinedRanking, getGameRanking } from '@/lib/auth';
import { UserRanking } from '@/types';
import Link from 'next/link';

export default function RankingPage() {
  const [rankings, setRankings] = useState<UserRanking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState<'combined' | 'flyingMeme' | 'quickMath' | 'wordPuzzle' | 'reactionTime'>('combined');

  const gameOptions = [
    { key: 'combined' as const, name: 'Combined Ranking' },
    { key: 'flyingMeme' as const, name: 'Flying Meme' },
    { key: 'quickMath' as const, name: 'Quick Math' },
    { key: 'wordPuzzle' as const, name: 'Word Puzzle' },
    { key: 'reactionTime' as const, name: 'Reaction Time' }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div>Loading rankings...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/dashboard" className="text-blue-600 hover:underline">← Back to Dashboard</Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">Rankings</h1>
        </div>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Leaderboard</h2>
              <select
                value={selectedGame}
                onChange={(e) => setSelectedGame(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {gameOptions.map((option) => (
                  <option key={option.key} value={option.key}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Player
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {selectedGame === 'combined' ? 'Total Rating' : 'Score'}
                  </th>
                  {selectedGame === 'combined' && (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Flying Meme
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quick Math
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Word Puzzle
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reaction Time
                      </th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rankings.length === 0 ? (
                  <tr>
                    <td colSpan={selectedGame === 'combined' ? 7 : 3} className="px-6 py-4 text-center text-gray-500">
                      No rankings available yet. Start playing games to appear on the leaderboard!
                    </td>
                  </tr>
                ) : (
                  rankings.map((entry, index) => (
                    <tr key={entry.uid} className={index < 3 ? 'bg-yellow-50' : ''}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {entry.userName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {selectedGame === 'combined' ? entry.totalRating : entry.gameScores[selectedGame]}
                      </td>
                      {selectedGame === 'combined' && (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {entry.gameScores.flyingMeme}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {entry.gameScores.quickMath}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {entry.gameScores.wordPuzzle}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {entry.gameScores.reactionTime}
                          </td>
                        </>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}