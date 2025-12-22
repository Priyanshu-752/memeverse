'use client';

import { useState, useEffect, useRef } from 'react';
import { auth } from '@/lib/firebase';
import { updateUserScore } from '@/lib/auth';
import { ThemeType } from '@/components/games/flying-meme/types';
import StartScreen from '@/components/games/flying-meme/StartScreen';
import GameCanvas from '@/components/games/flying-meme/GameCanvas';
import { useGameLogic } from '@/components/games/flying-meme/useGameLogic';
import { useCustomTheme } from '@/components/games/flying-meme/useCustomTheme';
import { useAudioManager } from '@/components/games/flying-meme/useAudioManager';

export default function FlyingBirdGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [showGameOverDialog, setShowGameOverDialog] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [selectedTheme, setSelectedTheme] = useState<ThemeType>(null);
  const [showCustomUpload, setShowCustomUpload] = useState(false);
  
  const gameActiveRef = useRef(false);
  const scoreRef = useRef(0);

  const {
    customBirdImage,
    customSound,
    isRecording,
    handleImageUpload,
    handleSoundUpload,
    startRecording,
    stopRecording,
    playPreview,
    clearCache
  } = useCustomTheme();

  const {
    jumpAudioRef,
    birdImageRef,
    obstacleImageRef,
    stopAllSounds,
    loadThemeAssets,
    playIntroSound,
    playGameOverSound
  } = useAudioManager();

  const endGame = async (finalScore: number) => {
    playGameOverSound();
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

  const { jump, gameLoop, resetGame } = useGameLogic({
    canvasRef,
    selectedTheme,
    birdImageRef,
    obstacleImageRef,
    jumpAudioRef,
    gameActiveRef,
    scoreRef,
    setScore,
    endGame
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
    });
    
    return () => {
      unsubscribe();
      stopAllSounds();
    };
  }, []);

  const selectTheme = (theme: 'bachan' | 'gandi' | 'custom') => {
    if (theme === 'custom' && (!customBirdImage || !customSound)) {
      setShowCustomUpload(true);
      return;
    }
    setSelectedTheme(theme);
    loadThemeAssets(theme, customBirdImage, customSound);
  };

  const confirmCustomTheme = () => {
    if (customBirdImage && customSound) {
      setShowCustomUpload(false);
      selectTheme('custom');
    }
  };

  const handleClearCache = () => {
    clearCache();
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
    
    playIntroSound();
    
    try {
      await document.documentElement.requestFullscreen();
    } catch (err) {
      console.log('Fullscreen failed:', err);
    }
    
    setTimeout(() => {
      resetGame();
      gameLoop();
    }, 100);
  };

  const handleExit = () => {
    setShowGameOverDialog(false);
    setGameEnded(true);
    setGameStarted(false);
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    stopAllSounds();
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
  }, [gameStarted, showGameOverDialog]);

  return (
    <div ref={containerRef} className="min-h-screen w-full relative overflow-hidden">
      {!gameStarted && (
        <StartScreen
          score={score}
          selectedTheme={selectedTheme}
          onSelectTheme={selectTheme}
          onStartGame={startGame}
          onChangeTheme={() => setSelectedTheme(null)}
          onClearCache={handleClearCache}
          customBirdImage={customBirdImage}
          customSound={customSound}
          showCustomUpload={showCustomUpload}
          onImageUpload={handleImageUpload}
          onSoundUpload={handleSoundUpload}
          onStartRecording={startRecording}
          onStopRecording={stopRecording}
          onPlayPreview={playPreview}
          onConfirmCustomTheme={confirmCustomTheme}
          onCancelCustomUpload={() => setShowCustomUpload(false)}
          isRecording={isRecording}
        />
      )}

      {gameStarted && (
        <GameCanvas
          ref={canvasRef}
          onJump={jump}
          showGameOverDialog={showGameOverDialog}
          score={score}
          onPlayAgain={startGame}
          onExit={handleExit}
        />
      )}
    </div>
  );
}
