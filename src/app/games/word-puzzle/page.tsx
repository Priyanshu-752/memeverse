'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function WordPuzzleGame() {
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/games" className="text-blue-600 hover:underline">← Back to Games</Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">Word Puzzle</h1>
        </div>
        
        <div className="bg-white rounded-lg shadow p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold mb-4">Score: {score}</h2>
            {!gameStarted ? (
              <button
                onClick={() => setGameStarted(true)}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700"
              >
                Start Game
              </button>
            ) : (
              <div>
                <p className="text-gray-600 mb-4">Game implementation coming soon...</p>
                <button
                  onClick={() => setGameStarted(false)}
                  className="bg-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-700"
                >
                  Reset Game
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}