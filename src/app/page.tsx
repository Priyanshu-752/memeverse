'use client';
import Link from 'next/link';
import PublicRoute from '@/components/auth/PublicRoute';
import { motion } from 'framer-motion';
import { Meteors } from '@/components/ui/meteors';
import { SparklesCore } from '@/components/ui/sparkles';

export default function HomePage() {
  const games = [
    { name: 'Flappy Meme', emoji: '🐦', desc: 'Navigate through pipes with your favorite meme character', status: 'Live' },
    { name: 'Meme Match', emoji: '🎴', desc: 'Test your memory with iconic meme cards', status: 'Coming Soon' },
    { name: 'Meme Runner', emoji: '🏃', desc: 'Endless runner with meme obstacles', status: 'Coming Soon' },
    { name: 'Meme Quiz', emoji: '🧠', desc: 'How well do you know your memes?', status: 'Coming Soon' },
  ];

  return (
    <PublicRoute>
      <div className="min-h-screen w-full relative overflow-hidden">
        {/* Unified Background for entire page */}
        <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-black to-pink-900">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.15),transparent_50%)]" />
          <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        {/* Header */}
        <header className="fixed top-0 w-full z-50 bg-black/30 backdrop-blur-md border-b border-white/10">
          <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">Memerverse</h1>
            <div className="flex gap-4">
              <Link href="/login" className="px-6 py-2 text-white hover:text-purple-400 transition">
                Login
              </Link>
              <Link href="/register" className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:opacity-90 transition">
                Sign Up
              </Link>
            </div>
          </nav>
        </header>

        {/* Hero Section */}
        <div className="relative min-h-screen flex items-center justify-center">

          {/* Floating emojis */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            {['😂', '🔥', '💀', '✨', '🎮', '👾', '🚀', '💎'].map((emoji, i) => (
              <motion.div
                key={i}
                className="absolute text-4xl opacity-20"
                initial={{ y: '100vh', x: `${Math.random() * 100}vw` }}
                animate={{ 
                  y: '-100vh',
                  x: `${Math.random() * 100}vw`,
                  rotate: 360
                }}
                transition={{
                  duration: 15 + Math.random() * 10,
                  repeat: Infinity,
                  delay: i * 2,
                  ease: 'linear'
                }}
              >
                {emoji}
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 text-center px-4 max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center"
            >
              <h2 className="text-6xl md:text-8xl font-bold text-white mb-2">
                Welcome to
              </h2>
              <h1 className="md:text-7xl text-5xl lg:text-9xl font-bold text-center text-white relative z-20 mb-4">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400">Memerverse</span>
              </h1>
              <div className="w-[45rem] h-40 relative">
                {/* Gradients */}
                <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-purple-500 to-transparent h-[2px] w-3/4 blur-sm" />
                <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-purple-500 to-transparent h-px w-3/4" />
                <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-pink-500 to-transparent h-[5px] w-1/4 blur-sm" />
                <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-pink-500 to-transparent h-px w-1/4" />

                {/* Sparkles Core */}
                <SparklesCore
                  background="transparent"
                  minSize={0.4}
                  maxSize={1}
                  particleDensity={500}
                  className="w-full h-3/5"
                  particleColor="#a855f7"
                />

                {/* Radial Gradient */}
                <div className="absolute inset-0 w-full h-full [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]" />
              </div>
            </motion.div>
            <p className="text-xl md:text-2xl -mt-12 text-neutral-300 mb-8">
              Where memes meet gaming. Play, compete, and dominate the leaderboards. 🎯
            </p>
            <Link href="/register">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(168,85,247,0.6)' }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg font-semibold rounded-full shadow-lg shadow-purple-500/50"
              >
                Start Playing Now ✨
              </motion.button>
            </Link>
          </motion.div>
        </div>

        {/* Games Section */}
        <section className="relative py-20">
          <div className="relative z-10 max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h3 className="text-5xl font-bold text-white mb-4">Our Games</h3>
              <p className="text-xl text-neutral-300">Experience the thrill of meme-powered gaming</p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {games.map((game, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative"
                >
                  <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-sm p-6 hover:border-purple-500/50 hover:scale-105 transition-all group">
                    <Meteors number={15} />
                    <div className="relative z-10">
                      <div className="text-6xl mb-4">{game.emoji}</div>
                      <h4 className="text-2xl font-bold text-white mb-2">{game.name}</h4>
                      <p className="text-neutral-300 mb-4">{game.desc}</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                        game.status === 'Live' 
                          ? 'bg-green-500/20 text-green-400 border border-green-500/50' 
                          : 'bg-orange-500/20 text-orange-400 border border-orange-500/50'
                      }`}>
                        {game.status}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative border-t border-white/10">
          <div className="relative z-10 max-w-7xl mx-auto px-6 py-8 text-center">
            <p className="text-neutral-300">© 2025 memerverse. All rights reserved.</p>
            <p className="text-neutral-400 text-sm mt-2">Made with 💜 for meme lovers</p>
          </div>
        </footer>
      </div>
    </PublicRoute>
  );
}