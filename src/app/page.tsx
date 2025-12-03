import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="max-w-4xl mx-auto text-center px-4">
        <h1 className="text-6xl font-bold text-gray-900 mb-6">
          Memeverse
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Play games, compete with friends, and climb the leaderboards!
        </p>
        
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">Play Games</h3>
            <p className="text-gray-600">Choose from 4 exciting games and test your skills</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">Track Scores</h3>
            <p className="text-gray-600">Monitor your progress and improve your ratings</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">Compete</h3>
            <p className="text-gray-600">Climb the leaderboards and become the champion</p>
          </div>
        </div>
        
        <div className="space-x-4">
          <Link 
            href="/login" 
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Login
          </Link>
          <Link 
            href="/register" 
            className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}