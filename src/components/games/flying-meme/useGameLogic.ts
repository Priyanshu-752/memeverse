import { useRef, useEffect } from 'react';
import { Obstacle, PathObstacle, Heart, ThemeType } from './types';
import BhauImage from 'public/images/bhau.png';

interface UseGameLogicProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  selectedTheme: ThemeType;
  birdImageRef: React.MutableRefObject<HTMLImageElement | undefined>;
  obstacleImageRef: React.MutableRefObject<HTMLImageElement | undefined>;
  jumpAudioRef: React.MutableRefObject<HTMLAudioElement | undefined>;
  gameActiveRef: React.MutableRefObject<boolean>;
  scoreRef: React.MutableRefObject<number>;
  setScore: (score: number) => void;
  endGame: (score: number) => void;
}

export function useGameLogic({
  canvasRef,
  selectedTheme,
  birdImageRef,
  obstacleImageRef,
  jumpAudioRef,
  gameActiveRef,
  scoreRef,
  setScore,
  endGame
}: UseGameLogicProps) {
  const gameLoopRef = useRef<number>();
  const birdRef = useRef({ y: 250, velocity: 0, rotation: 0 });
  const obstaclesRef = useRef<Obstacle[]>([]);
  const pathObstaclesRef = useRef<PathObstacle[]>([]);
  const heartsRef = useRef<Heart[]>([]);
  const livesRef = useRef(0);
  const bhauImageRef = useRef<HTMLImageElement>();
  const gameSpeedRef = useRef(1.3);

  useEffect(() => {
    const img = new Image();
    img.src = BhauImage.src;
    bhauImageRef.current = img;
  }, []);

  const jump = () => {
    if (!gameActiveRef.current) {
      gameActiveRef.current = true;
    }
    birdRef.current.velocity = -6.5;
    if (jumpAudioRef.current) {
      jumpAudioRef.current.currentTime = 0;
      jumpAudioRef.current.play().catch(e => console.log('Jump audio play failed:', e));
    }
  };

  const gameLoop = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const bird = birdRef.current;
    const birdSize = 70;
    const birdX = canvas.width / 3;

    if (gameActiveRef.current) {
      bird.velocity += 0.28;
      bird.velocity = Math.min(bird.velocity, 8);
      bird.y += bird.velocity;
      bird.rotation = Math.min(Math.max(bird.velocity * 3, -25), 90);
    }

    ctx.save();
    ctx.translate(birdX, bird.y);
    ctx.rotate((bird.rotation * Math.PI) / 180);
    
    if (birdImageRef.current && birdImageRef.current.complete && birdImageRef.current.naturalWidth > 0) {
      ctx.drawImage(birdImageRef.current, -birdSize / 2, -birdSize / 2, birdSize, birdSize);
    } else {
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.arc(0, 0, birdSize / 2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    if (!gameActiveRef.current) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.font = 'bold 48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('TAP TO START', canvas.width / 2, canvas.height / 2 + 100);
      ctx.font = 'bold 32px Arial';
      ctx.fillText('Press SPACE or Click', canvas.width / 2, canvas.height / 2 + 150);
    }

    // Increase speed based on score
    gameSpeedRef.current = 1.3 + (scoreRef.current * 0.05);

    if (gameActiveRef.current && (obstaclesRef.current.length === 0 || obstaclesRef.current[obstaclesRef.current.length - 1].x < canvas.width - 550)) {
      const gap = Math.max(250, 350 - scoreRef.current * 5);
      const minHeight = 150;
      const maxHeight = canvas.height - gap - minHeight;
      const height = Math.random() * (maxHeight - minHeight) + minHeight;
      
      obstaclesRef.current.push({
        x: canvas.width,
        y: height,
        width: 80,
        height: gap,
        passed: false
      });
    }

    // Add path obstacles
    if (gameActiveRef.current && scoreRef.current > 3 && (pathObstaclesRef.current.length === 0 || pathObstaclesRef.current[pathObstaclesRef.current.length - 1].x < canvas.width - 400)) {
      const lastObstacle = obstaclesRef.current[obstaclesRef.current.length - 1];
      if (lastObstacle && Math.random() > 0.6) {
        const gapTop = lastObstacle.y;
        const gapBottom = lastObstacle.y + lastObstacle.height;
        const gapCenter = (gapTop + gapBottom) / 2;
        const isTopHalf = Math.random() > 0.5;
        const yPos = isTopHalf 
          ? gapTop + (gapCenter - gapTop) * (0.2 + Math.random() * 0.3)
          : gapBottom - (gapBottom - gapCenter) * (0.2 + Math.random() * 0.3);
        
        pathObstaclesRef.current.push({
          x: canvas.width,
          y: yPos,
          size: 35,
          passed: false
        });
      }
    }

    // Add hearts
    if (gameActiveRef.current && (heartsRef.current.length === 0 || heartsRef.current[heartsRef.current.length - 1].x < canvas.width - 1200)) {
      const lastObstacle = obstaclesRef.current[obstaclesRef.current.length - 1];
      if (lastObstacle && Math.random() > 0.95) {
        heartsRef.current.push({
          x: canvas.width,
          y: lastObstacle.y + lastObstacle.height / 2,
          size: 30,
          collected: false
        });
      }
    }

    obstaclesRef.current = obstaclesRef.current.filter(obstacle => {
      if (gameActiveRef.current) {
        obstacle.x -= gameSpeedRef.current;
      }

      if (selectedTheme === 'gandi' && obstacleImageRef.current && obstacleImageRef.current.complete) {
        const img = obstacleImageRef.current;
        const aspectRatio = img.naturalWidth / img.naturalHeight;
        const imgWidth = obstacle.width;
        const imgHeight = imgWidth / aspectRatio;
        
        for (let y = 0; y < obstacle.y; y += imgHeight) {
          ctx.drawImage(img, obstacle.x, y, imgWidth, Math.min(imgHeight, obstacle.y - y));
        }
        for (let y = obstacle.y + obstacle.height; y < canvas.height; y += imgHeight) {
          ctx.drawImage(img, obstacle.x, y, imgWidth, Math.min(imgHeight, canvas.height - y));
        }
      } else {
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(obstacle.x, 0, obstacle.width, obstacle.y);
        ctx.strokeStyle = '#654321';
        ctx.lineWidth = 2;
        ctx.strokeRect(obstacle.x, 0, obstacle.width, obstacle.y);
        ctx.fillRect(obstacle.x, obstacle.y + obstacle.height, obstacle.width, canvas.height - obstacle.y - obstacle.height);
        ctx.strokeRect(obstacle.x, obstacle.y + obstacle.height, obstacle.width, canvas.height - obstacle.y - obstacle.height);
      }

      if (gameActiveRef.current && !obstacle.passed && obstacle.x + obstacle.width < birdX) {
        obstacle.passed = true;
        scoreRef.current += 1;
        setScore(scoreRef.current);
      }

      if (
        gameActiveRef.current &&
        birdX + birdSize / 2 > obstacle.x &&
        birdX - birdSize / 2 < obstacle.x + obstacle.width &&
        (bird.y - birdSize / 2 < obstacle.y || bird.y + birdSize / 2 > obstacle.y + obstacle.height)
      ) {
        if (livesRef.current > 0) {
          livesRef.current -= 1;
          return false;
        } else {
          endGame(scoreRef.current);
          return false;
        }
      }

      return obstacle.x > -obstacle.width;
    });

    if (gameActiveRef.current && (bird.y + birdSize / 2 > canvas.height || bird.y - birdSize / 2 < 0)) {
      if (livesRef.current > 0) {
        livesRef.current -= 1;
        bird.y = canvas.height / 2;
        bird.velocity = 0;
      } else {
        endGame(scoreRef.current);
        return;
      }
    }

    // Update and draw path obstacles
    pathObstaclesRef.current = pathObstaclesRef.current.filter(pathObstacle => {
      if (gameActiveRef.current) {
        pathObstacle.x -= gameSpeedRef.current;
      }

      // Draw bhau image
      if (bhauImageRef.current && bhauImageRef.current.complete) {
        ctx.drawImage(bhauImageRef.current, pathObstacle.x, pathObstacle.y - pathObstacle.size / 2, pathObstacle.size, pathObstacle.size);
      } else {
        ctx.fillStyle = '#FF0000';
        ctx.beginPath();
        ctx.arc(pathObstacle.x + pathObstacle.size / 2, pathObstacle.y, pathObstacle.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Check collision
      if (
        gameActiveRef.current &&
        Math.abs(bird.y - pathObstacle.y) < (birdSize + pathObstacle.size) / 2 &&
        Math.abs(birdX - (pathObstacle.x + pathObstacle.size / 2)) < (birdSize + pathObstacle.size) / 2
      ) {
        if (livesRef.current > 0) {
          livesRef.current -= 1;
          return false;
        } else {
          endGame(scoreRef.current);
          return false;
        }
      }

      return pathObstacle.x > -pathObstacle.size;
    });

    // Update and draw hearts
    heartsRef.current = heartsRef.current.filter(heart => {
      if (gameActiveRef.current) {
        heart.x -= gameSpeedRef.current;
      }

      if (!heart.collected) {
        ctx.fillStyle = '#FF0000';
        ctx.font = `${heart.size}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText('❤️', heart.x, heart.y);

        if (
          gameActiveRef.current &&
          Math.abs(bird.y - heart.y) < (birdSize + heart.size) / 2 &&
          Math.abs(birdX - heart.x) < (birdSize + heart.size) / 2
        ) {
          heart.collected = true;
          livesRef.current = Math.min(livesRef.current + 1, 3);
          return false;
        }
      }

      return heart.x > -heart.size && !heart.collected;
    });

    // Draw lives
    ctx.fillStyle = '#FF0000';
    ctx.font = '30px Arial';
    ctx.textAlign = 'left';
    for (let i = 0; i < livesRef.current; i++) {
      ctx.fillText('❤️', 20 + i * 40, 130);
    }

    ctx.fillStyle = '#000';
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${scoreRef.current}`, 20, 50);
    ctx.fillText(`Speed: ${gameSpeedRef.current.toFixed(1)}x`, 20, 90);

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  };

  const resetGame = () => {
    if (canvasRef.current) {
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;
      birdRef.current = { y: window.innerHeight / 2, velocity: 0, rotation: 0 };
    }
    obstaclesRef.current = [];
    pathObstaclesRef.current = [];
    heartsRef.current = [];
    livesRef.current = 0;
    gameSpeedRef.current = 1.3;
  };

  useEffect(() => {
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, []);

  return { jump, gameLoop, resetGame };
}
