'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Meteors } from '@/components/ui/meteors';

export default function GamesPage() {
  const games = [
    { id: 'flying-meme', name: 'Flying Meme', emoji: '🐦', description: 'Test your flying skills', available: true },
    { id: 'quick-math', name: 'Quick Math', emoji: '🧮', description: 'Solve math problems fast', available: false },
    { id: 'word-puzzle', name: 'Word Puzzle', emoji: '🔤', description: 'Unscramble the words', available: false },
    { id: 'reaction-time', name: 'Reaction Time', emoji: '⚡', description: 'Test your reflexes', available: false }
  ];

  return (
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
            <h1 className="text-4xl font-bold text-white mb-2">Games</h1>
            <p className="text-neutral-300 mb-8">Choose your game and start playing!</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {games.map((game, idx) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="relative"
              >
                {game.available ? (
                  <Link href={`/games/${game.id}`}>
                    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-sm p-6 hover:border-purple-500/50 hover:scale-105 transition-all group cursor-pointer">
                      <Meteors number={15} />
                      <div className="relative z-10">
                        <div className="text-6xl mb-4">{game.emoji}</div>
                        <h2 className="text-2xl font-bold text-white mb-2">{game.name}</h2>
                        <p className="text-neutral-300 mb-4">{game.description}</p>
                        <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-green-500/20 text-green-400 border border-green-500/50">Live</span>
                        <div className="mt-4">
                          <span className="text-purple-400 font-semibold group-hover:text-pink-400 transition">Play Now →</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-sm p-6 opacity-60 cursor-not-allowed">
                    <div className="relative z-10">
                      <div className="text-6xl mb-4">{game.emoji}</div>
                      <h2 className="text-2xl font-bold text-white mb-2">{game.name}</h2>
                      <p className="text-neutral-300 mb-4">{game.description}</p>
                      <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">Coming Soon</span>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
