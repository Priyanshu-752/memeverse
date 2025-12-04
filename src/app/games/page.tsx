import Link from 'next/link';

export default function GamesPage() {
  const games = [
    { id: 'flying-meme', name: 'Flying Meme', description: 'Test your flying skills' },
    { id: 'quick-math', name: 'Quick Math', description: 'Solve math problems fast' },
    { id: 'word-puzzle', name: 'Word Puzzle', description: 'Unscramble the words' },
    { id: 'reaction-time', name: 'Reaction Time', description: 'Test your reflexes' }
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/dashboard" className="text-blue-600 hover:underline">← Back to Dashboard</Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">Games</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {games.map((game) => (
            <Link
              key={game.id}
              href={`/games/${game.id}`}
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{game.name}</h2>
              <p className="text-gray-600 mb-4">{game.description}</p>
              <span className="text-blue-600 font-medium">Play Now →</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}