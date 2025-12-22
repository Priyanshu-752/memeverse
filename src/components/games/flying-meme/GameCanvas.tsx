import { forwardRef } from 'react';
import GameOverDialog from './GameOverDialog';

interface GameCanvasProps {
  onJump: () => void;
  showGameOverDialog: boolean;
  score: number;
  onPlayAgain: () => void;
  onExit: () => void;
}

const GameCanvas = forwardRef<HTMLCanvasElement, GameCanvasProps>(
  ({ onJump, showGameOverDialog, score, onPlayAgain, onExit }, ref) => {
    return (
      <div className="fixed inset-0 bg-black z-[9999]">
        <canvas
          ref={ref}
          onClick={onJump}
          className="w-full h-full cursor-pointer"
        />
        {showGameOverDialog && (
          <GameOverDialog
            score={score}
            onPlayAgain={onPlayAgain}
            onExit={onExit}
          />
        )}
      </div>
    );
  }
);

GameCanvas.displayName = 'GameCanvas';

export default GameCanvas;
