interface GameOverDialogProps {
  score: number;
  onPlayAgain: () => void;
  onExit: () => void;
}

export default function GameOverDialog({ score, onPlayAgain, onExit }: GameOverDialogProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-white rounded-2xl p-12 text-center max-w-md mx-4 shadow-2xl">
        <h2 className="text-5xl font-bold text-red-600 mb-4">KHATAM!</h2>
        <p className="text-3xl font-bold text-gray-800 mb-2">Tata Bye Bye</p>
        <p className="text-2xl text-gray-600 mb-6">Gaya! 😢</p>
        <div className="bg-blue-100 rounded-lg p-4 mb-6">
          <p className="text-lg text-gray-700 mb-1">Your Score</p>
          <p className="text-6xl font-bold text-blue-600">{score}</p>
        </div>
        <button
          onClick={onPlayAgain}
          className="bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 text-xl font-bold w-full mb-3"
        >
          Play Again
        </button>
        <button
          onClick={onExit}
          className="bg-gray-600 text-white px-8 py-4 rounded-lg hover:bg-gray-700 text-xl font-bold w-full"
        >
          Exit
        </button>
      </div>
    </div>
  );
}
