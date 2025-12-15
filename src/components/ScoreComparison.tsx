'use client';

import { useEffect, useState } from 'react';
import { getUserData, getUserHighScores } from '@/lib/auth';
import { User, UserHighScores } from '@/types';

interface ScoreComparisonProps {
  uid: string;
}

export default function ScoreComparison({ uid }: ScoreComparisonProps) {
  const [userData, setUserData] = useState<User | null>(null);
  const [highScores, setHighScores] = useState<UserHighScores | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [user, high] = await Promise.all([
          getUserData(uid),
          getUserHighScores(uid)
        ]);
        setUserData(user);
        setHighScores(high);
      } catch (error) {
        console.error('Error fetching scores:', error);
      } finally {
        setLoading(false);
      }
    };

    if (uid) {
      fetchData();
    }
  }, [uid]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center text-gray-500">Loading scores...</div>
      </div>
    );
  }

  if (!userData || !highScores) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center text-gray-500">No score data available</div>
      </div>
    );
  }

  const games = [
    { key: 'flyingMeme' as const, name: 'Flying Meme', icon: '🎮' },
    { key: 'quickMath' as const, name: 'Quick Math', icon: '🧮' },
    { key: 'wordPuzzle' as const, name: 'Word Puzzle', icon: '🧩' },
    { key: 'reactionTime' as const, name: 'Reaction Time', icon: '⚡' }
  ];

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-purple-600">
        <h2 className="text-xl font-bold text-white">Your Game Stats</h2>
        <p className="text-blue-100 text-sm">Latest vs Personal Best</p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 font-semibold mb-1">Latest Total</div>
            <div className="text-3xl font-bold text-blue-600">{userData.totalRating}</div>
            <div className="text-xs text-gray-500 mt-1">Current session total</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 font-semibold mb-1">Best Total</div>
            <div className="text-3xl font-bold text-purple-600">{highScores.totalHighScore}</div>
            <div className="text-xs text-gray-500 mt-1">All-time high score</div>
          </div>
        </div>

        <div className="space-y-4">
          {games.map((game) => {
            const latestScore = userData.gameScores[game.key];
            const bestScore = highScores.highScores[game.key];
            const isNewRecord = latestScore === bestScore && bestScore > 0;
            const improvement = bestScore > 0 ? ((latestScore / bestScore) * 100).toFixed(0) : 0;

            return (
              <div key={game.key} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{game.icon}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900">{game.name}</h3>
                      {isNewRecord && bestScore > 0 && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full font-semibold">
                          🏆 Personal Record!
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Latest Score</div>
                    <div className="text-2xl font-bold text-gray-700">{latestScore}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Best Score</div>
                    <div className="text-2xl font-bold text-purple-600">{bestScore}</div>
                  </div>
                </div>

                {bestScore > 0 && !isNewRecord && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Performance</span>
                      <span className={`font-semibold ${
                        Number(improvement) >= 90 ? 'text-green-600' :
                        Number(improvement) >= 70 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {improvement}% of best
                      </span>
                    </div>
                    <div className="mt-2 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          Number(improvement) >= 90 ? 'bg-green-500' :
                          Number(improvement) >= 70 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${Math.min(Number(improvement), 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="text-xs text-gray-600 text-center">
            💡 <strong>Tip:</strong> Keep playing to beat your personal records and climb the leaderboard!
          </div>
        </div>
      </div>
    </div>
  );
}
