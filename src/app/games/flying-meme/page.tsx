'use client';

import { useState, useEffect, useRef } from 'react';
import { auth } from '@/lib/firebase';
import { updateUserScore } from '@/lib/auth';
import Link from 'next/link';
import BachanImage from "public/images/bachan.png";
import GandiImage from "public/images/gandi.png";
import ModiImage from "public/images/modi.png"

interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  passed: boolean;
}

export default function FlyingBirdGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [showGameOverDialog, setShowGameOverDialog] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [selectedTheme, setSelectedTheme] = useState<'bachan' | 'gandi' | 'custom' | null>(null);
  const [showCustomUpload, setShowCustomUpload] = useState(false);
  const [customBirdImage, setCustomBirdImage] = useState<string | null>(null);
  const [customSound, setCustomSound] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const obstacleImageRef = useRef<HTMLImageElement>();
  const gameLoopRef = useRef<number>();
  const birdImageRef = useRef<HTMLImageElement>();
  const jumpAudioRef = useRef<HTMLAudioElement>();
  const gameOverAudioRef = useRef<HTMLAudioElement>();
  const introAudioRef = useRef<HTMLAudioElement>();
  const gameActiveRef = useRef(false);
  
  const birdRef = useRef({ y: 250, velocity: 0, rotation: 0 });
  const obstaclesRef = useRef<Obstacle[]>([]);
  const scoreRef = useRef(0);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
    });
    
    // Load cached custom theme
    const cachedImage = localStorage.getItem('customBirdImage');
    const cachedSound = localStorage.getItem('customSound');
    if (cachedImage) setCustomBirdImage(cachedImage);
    if (cachedSound) setCustomSound(cachedSound);
    
    return () => {
      unsubscribe();
      if (introAudioRef.current) {
        introAudioRef.current.pause();
      }
    };
  }, []);

  useEffect(() => {
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, []);

  const stopAllSounds = () => {
    if (introAudioRef.current) {
      introAudioRef.current.pause();
      introAudioRef.current.currentTime = 0;
    }
    if (jumpAudioRef.current) {
      jumpAudioRef.current.pause();
      jumpAudioRef.current.currentTime = 0;
    }
    if (gameOverAudioRef.current) {
      gameOverAudioRef.current.pause();
      gameOverAudioRef.current.currentTime = 0;
    }
  };

  const selectTheme = (theme: 'bachan' | 'gandi' | 'custom') => {
    if (theme === 'custom' && (!customBirdImage || !customSound)) {
      setShowCustomUpload(true);
      return;
    }
    setSelectedTheme(theme);
    
    // Load bird image based on theme
    const birdImg = new Image();
    if (theme === 'custom') {
      birdImg.src = customBirdImage!;
    } else {
      birdImg.src = theme === 'bachan' ? BachanImage.src : GandiImage.src;
    }
    birdImageRef.current = birdImg;
    
    // Load obstacle image for Gandhi theme
    if (theme === 'gandi') {
      const obstacleImg = new Image();
      obstacleImg.src = ModiImage.src;
      obstacleImageRef.current = obstacleImg;
    }
    
    // Load sounds based on theme
    if (theme === 'custom') {
      jumpAudioRef.current = new Audio('/sound/JumpAag.m4a');
      gameOverAudioRef.current = new Audio(customSound!);
      introAudioRef.current = new Audio('/sound/intro.m4a');
      introAudioRef.current.loop = true;
    } else if (theme === 'bachan') {
      jumpAudioRef.current = new Audio('/sound/JumpAag.m4a');
      gameOverAudioRef.current = new Audio('/sound/mkcAag.m4a');
      introAudioRef.current = new Audio('/sound/intro.m4a');
      introAudioRef.current.loop = true;
    } else {
      jumpAudioRef.current = new Audio('/sound/playGandi.m4a');
      gameOverAudioRef.current = new Audio('/sound/khatam.m4a');
      introAudioRef.current = new Audio('/sound/intoGandi.m4a');
      introAudioRef.current.loop = true;
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        setCustomBirdImage(dataUrl);
        localStorage.setItem('customBirdImage', dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSoundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        setCustomSound(dataUrl);
        localStorage.setItem('customSound', dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onload = () => {
          const dataUrl = reader.result as string;
          setCustomSound(dataUrl);
          localStorage.setItem('customSound', dataUrl);
        };
        reader.readAsDataURL(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Recording failed:', err);
      alert('Microphone access denied');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const playPreview = () => {
    if (customSound) {
      const audio = new Audio(customSound);
      audio.play();
    }
  };

  const confirmCustomTheme = () => {
    if (customBirdImage && customSound) {
      setShowCustomUpload(false);
      setShowPreview(false);
      selectTheme('custom');
    }
  };

  const clearCache = () => {
    localStorage.removeItem('customBirdImage');
    localStorage.removeItem('customSound');
    setCustomBirdImage(null);
    setCustomSound(null);
    setSelectedTheme(null);
    setShowCustomUpload(false);
  };

  const startGame = async () => {
    if (!selectedTheme) return;
    
    setGameStarted(true);
    setGameEnded(false);
    setShowGameOverDialog(false);
    setScore(0);
    scoreRef.current = 0;
    gameActiveRef.current = false;
    
    // Start intro sound when entering TAP TO START screen
    stopAllSounds();
    if (introAudioRef.current) {
      introAudioRef.current.play().catch(e => console.log('Intro audio play failed:', e));
    }
    
    // Enter fullscreen
    if (containerRef.current) {
      try {
        await containerRef.current.requestFullscreen();
      } catch (err) {
        console.log('Fullscreen failed:', err);
      }
    }
    
    // Resize canvas and reset bird position
    setTimeout(() => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
        birdRef.current = { y: window.innerHeight / 2, velocity: 0, rotation: 0 };
      }
      obstaclesRef.current = [];
      gameLoop();
    }, 100);
  };

  const endGame = async (finalScore: number) => {
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
    }
    
    // Stop all sounds and play game over sound
    stopAllSounds();
    if (gameOverAudioRef.current) {
      gameOverAudioRef.current.play().catch(e => console.log('Game over audio play failed:', e));
    }
    
    // Show dialog immediately (don't exit fullscreen yet)
    setShowGameOverDialog(true);
    setScore(finalScore);
    
    if (user) {
      try {
        await updateUserScore(user.uid, 'flyingMeme', finalScore);
      } catch (error) {
        console.error('Error updating score:', error);
      }
    }
  };

  const jump = () => {
    // Only allow jumping if game is started, not ended, and no game over dialog
    if (gameStarted && !showGameOverDialog) {
      if (!gameActiveRef.current) {
        gameActiveRef.current = true;
      }
      birdRef.current.velocity = -6.5;
      if (jumpAudioRef.current) {
        jumpAudioRef.current.currentTime = 0;
        jumpAudioRef.current.play().catch(e => console.log('Jump audio play failed:', e));
      }
    }
  };

  const gameLoop = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const bird = birdRef.current;
    const birdSize = 70;
    const birdX = canvas.width / 3;

    // Only update bird physics if game is active
    if (gameActiveRef.current) {
      bird.velocity += 0.28; // even smoother gravity
      bird.velocity = Math.min(bird.velocity, 8); // lower terminal velocity
      bird.y += bird.velocity;
      
      // Smooth rotation based on velocity
      bird.rotation = Math.min(Math.max(bird.velocity * 3, -25), 90);
    }

    // Draw bird image with rotation
    ctx.save();
    ctx.translate(birdX, bird.y);
    ctx.rotate((bird.rotation * Math.PI) / 180);
    
    if (birdImageRef.current && birdImageRef.current.complete && birdImageRef.current.naturalWidth > 0) {
      ctx.drawImage(birdImageRef.current, -birdSize / 2, -birdSize / 2, birdSize, birdSize);
    } else {
      // Fallback circle
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.arc(0, 0, birdSize / 2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // Show tap to start message
    if (!gameActiveRef.current) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.font = 'bold 48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('TAP TO START', canvas.width / 2, canvas.height / 2 + 100);
      ctx.font = 'bold 32px Arial';
      ctx.fillText('Press SPACE or Click', canvas.width / 2, canvas.height / 2 + 150);
    }

    // Add obstacles only if game is active
    if (gameActiveRef.current && (obstaclesRef.current.length === 0 || obstaclesRef.current[obstaclesRef.current.length - 1].x < canvas.width - 550)) {
      const gap = 350; // even larger gap
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

    // Update and draw obstacles
    obstaclesRef.current = obstaclesRef.current.filter(obstacle => {
      if (gameActiveRef.current) {
        obstacle.x -= 1.3; // much slower for easier gameplay
      }

      // Draw obstacles
      if (selectedTheme === 'gandi' && obstacleImageRef.current && obstacleImageRef.current.complete) {
        const img = obstacleImageRef.current;
        const aspectRatio = img.naturalWidth / img.naturalHeight;
        const imgWidth = obstacle.width;
        const imgHeight = imgWidth / aspectRatio;
        
        // Draw Modi images for top obstacle
        for (let y = 0; y < obstacle.y; y += imgHeight) {
          ctx.drawImage(img, obstacle.x, y, imgWidth, Math.min(imgHeight, obstacle.y - y));
        }
        // Draw Modi images for bottom obstacle
        for (let y = obstacle.y + obstacle.height; y < canvas.height; y += imgHeight) {
          ctx.drawImage(img, obstacle.x, y, imgWidth, Math.min(imgHeight, canvas.height - y));
        }
      } else {
        // Draw bricks for Bachan theme
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(obstacle.x, 0, obstacle.width, obstacle.y);
        ctx.strokeStyle = '#654321';
        ctx.lineWidth = 2;
        ctx.strokeRect(obstacle.x, 0, obstacle.width, obstacle.y);
        ctx.fillRect(obstacle.x, obstacle.y + obstacle.height, obstacle.width, canvas.height - obstacle.y - obstacle.height);
        ctx.strokeRect(obstacle.x, obstacle.y + obstacle.height, obstacle.width, canvas.height - obstacle.y - obstacle.height);
      }

      // Check if passed
      if (gameActiveRef.current && !obstacle.passed && obstacle.x + obstacle.width < birdX) {
        obstacle.passed = true;
        scoreRef.current += 1;
        setScore(scoreRef.current);
      }

      // Check collision
      if (
        gameActiveRef.current &&
        birdX + birdSize / 2 > obstacle.x &&
        birdX - birdSize / 2 < obstacle.x + obstacle.width &&
        (bird.y - birdSize / 2 < obstacle.y || bird.y + birdSize / 2 > obstacle.y + obstacle.height)
      ) {
        endGame(scoreRef.current);
        return false;
      }

      return obstacle.x > -obstacle.width;
    });

    // Check ground/ceiling collision
    if (gameActiveRef.current && (bird.y + birdSize / 2 > canvas.height || bird.y - birdSize / 2 < 0)) {
      endGame(scoreRef.current);
      return;
    }

    // Draw score
    ctx.fillStyle = '#000';
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${scoreRef.current}`, 20, 50);

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !showGameOverDialog) {
        e.preventDefault();
        jump();
      }
      if (e.code === 'Escape' && gameStarted) {
        endGame(scoreRef.current);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameStarted, gameEnded, showGameOverDialog]);

  return (
    <div ref={containerRef} className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/games" className="text-blue-600 hover:underline">← Back to Games</Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">Flying Meme</h1>
        </div>
        
        <div className="bg-white rounded-lg shadow p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold mb-4">Score: {score}</h2>
            
            {!gameStarted && !gameEnded && (
              <div>
                {!selectedTheme ? (
                  <div>
                    <p className="text-gray-600 mb-6 text-lg">Select Your Theme:</p>
                    <div className="flex gap-4 justify-center flex-wrap">
                      <button
                        onClick={() => selectTheme('bachan')}
                        className="bg-orange-600 text-white px-8 py-4 rounded-lg hover:bg-orange-700 text-xl font-bold"
                      >
                        Bachan Theme
                      </button>
                      <button
                        onClick={() => selectTheme('gandi')}
                        className="bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 text-xl font-bold"
                      >
                        Gandhi Theme
                      </button>
                      <button
                        onClick={() => selectTheme('custom')}
                        className="bg-purple-600 text-white px-8 py-4 rounded-lg hover:bg-purple-700 text-xl font-bold"
                      >
                        Custom Theme
                      </button>
                    </div>
                    {(customBirdImage || customSound) && (
                      <button
                        onClick={clearCache}
                        className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm"
                      >
                        Clear Custom Cache
                      </button>
                    )}
                  </div>
                ) : (
                  <div>
                    <p className="text-gray-600 mb-2">Theme: <span className="font-bold">{selectedTheme === 'bachan' ? 'Bachan' : selectedTheme === 'gandi' ? 'Gandhi' : 'Custom'}</span></p>
                    <p className="text-gray-600 mb-4">Press SPACE or Click to fly! Avoid the obstacles!</p>
                    <button
                      onClick={startGame}
                      className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 mr-3"
                    >
                      Start Game (Fullscreen)
                    </button>
                    <button
                      onClick={() => setSelectedTheme(null)}
                      className="bg-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-700"
                    >
                      Change Theme
                    </button>
                  </div>
                )}
              </div>
            )}

            {showCustomUpload && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
                  <h3 className="text-2xl font-bold mb-4">Custom Theme Setup</h3>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Upload Bird Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="w-full border rounded p-2"
                    />
                    {customBirdImage && <p className="text-green-600 text-sm mt-1">✓ Image uploaded</p>}
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Sound (Game Over)</label>
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={handleSoundUpload}
                      className="w-full border rounded p-2 mb-2"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={isRecording ? stopRecording : startRecording}
                        className={`flex-1 ${isRecording ? 'bg-red-600' : 'bg-blue-600'} text-white px-4 py-2 rounded hover:opacity-90`}
                      >
                        {isRecording ? '⏹ Stop Recording' : '🎤 Record'}
                      </button>
                      {customSound && (
                        <button
                          onClick={playPreview}
                          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                        >
                          ▶ Preview
                        </button>
                      )}
                    </div>
                    {customSound && <p className="text-green-600 text-sm mt-1">✓ Sound ready</p>}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={confirmCustomTheme}
                      disabled={!customBirdImage || !customSound}
                      className="flex-1 bg-purple-600 text-white px-4 py-3 rounded hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      Confirm & Start
                    </button>
                    <button
                      onClick={() => setShowCustomUpload(false)}
                      className="flex-1 bg-gray-600 text-white px-4 py-3 rounded hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {gameStarted && (
              <div className="fixed inset-0 bg-black z-50">
                <canvas
                  ref={canvasRef}
                  onClick={jump}
                  className="w-full h-full cursor-pointer"
                />
                {showGameOverDialog && !gameEnded && (
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
                        onClick={startGame}
                        className="bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 text-xl font-bold w-full mb-3"
                      >
                        Play Again
                      </button>
                      <button
                        onClick={() => {
                          setShowGameOverDialog(false);
                          setGameEnded(true);
                          setGameStarted(false);
                          if (document.fullscreenElement) {
                            document.exitFullscreen();
                          }
                          // Stop all sounds when exiting
                          if (introAudioRef.current) {
                            introAudioRef.current.pause();
                            introAudioRef.current.currentTime = 0;
                          }
                          if (jumpAudioRef.current) {
                            jumpAudioRef.current.pause();
                          }
                          if (gameOverAudioRef.current) {
                            gameOverAudioRef.current.pause();
                          }
                        }}
                        className="bg-gray-600 text-white px-8 py-4 rounded-lg hover:bg-gray-700 text-xl font-bold w-full"
                      >
                        Exit
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {gameEnded && !showGameOverDialog && (
              <div>
                <p className="text-red-600 mb-4 text-xl font-bold">Game Over! Final Score: {score}</p>
                <button
                  onClick={startGame}
                  className="bg-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-700 mr-4"
                >
                  Play Again
                </button>
                <Link
                  href="/dashboard"
                  className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700"
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