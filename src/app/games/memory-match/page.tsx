'use client';

import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { updateUserScore } from '@/lib/auth';
import Link from 'next/link';

export default function MemoryMatchGame() {
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  const startGame = () => {
    setGameStarted(true);
    setGameEnded(false);
    setScore(0);
  };

  const endGame = async (finalScore: number) => {
    setGameEnded(true);
    setScore(finalScore);
    
    if (user) {
      try {
        await updateUserScore(user.uid, 'memoryMatch', finalScore);
      } catch (error) {
        console.error('Error updating score:', error);
      }
    }
  };

  const simulateGame = () => {
    // Simulate a game with random score
    const randomScore = Math.floor(Math.random() * 1000) + 100;
    setTimeout(() => {
      endGame(randomScore);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/games" className="text-blue-600 hover:underline">← Back to Games</Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">Memory Match</h1>
        </div>
        
        <div className="bg-white rounded-lg shadow p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold mb-4">Score: {score}</h2>
            
            {!gameStarted && !gameEnded && (
              <div>
                <p className="text-gray-600 mb-4">Test your memory by matching cards!</p>
                <button
                  onClick={() => {
                    startGame();
                    simulateGame();
                  }}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700"
                >
                  Start Game
                </button>
              </div>
            )}
            
            {gameStarted && !gameEnded && (
              <div>
                <p className="text-gray-600 mb-4">Playing... (This is a demo)</p>
                <div className="animate-pulse">
                  <div className="bg-gray-200 h-32 w-full rounded mb-4"></div>
                </div>
              </div>
            )}
            
            {gameEnded && (
              <div>
                <p className="text-green-600 mb-4">Game Complete! Score saved.</p>
                <button
                  onClick={() => {
                    setGameStarted(false);
                    setGameEnded(false);
                  }}
                  className="bg-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-700 mr-4"
                >
                  Play Again
                </button>
                <Link
                  href="/dashboard"
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700"
                >
                  Back to Dashboard
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}