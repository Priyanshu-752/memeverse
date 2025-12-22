import { useRef } from 'react';
import { ThemeType } from './types';
import BachanImage from "public/images/bachan.png";
import GandiImage from "public/images/gandi.png";
import ModiImage from "public/images/modi.png";

export function useAudioManager() {
  const jumpAudioRef = useRef<HTMLAudioElement>();
  const gameOverAudioRef = useRef<HTMLAudioElement>();
  const introAudioRef = useRef<HTMLAudioElement>();
  const birdImageRef = useRef<HTMLImageElement>();
  const obstacleImageRef = useRef<HTMLImageElement>();

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

  const loadThemeAssets = (theme: 'bachan' | 'gandi' | 'custom', customBirdImage?: string | null, customSound?: string | null) => {
    const birdImg = new Image();
    if (theme === 'custom') {
      birdImg.src = customBirdImage!;
    } else {
      birdImg.src = theme === 'bachan' ? BachanImage.src : GandiImage.src;
    }
    birdImageRef.current = birdImg;
    
    if (theme === 'gandi') {
      const obstacleImg = new Image();
      obstacleImg.src = ModiImage.src;
      obstacleImageRef.current = obstacleImg;
    }
    
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

  const playIntroSound = () => {
    stopAllSounds();
    if (introAudioRef.current) {
      introAudioRef.current.play().catch(e => console.log('Intro audio play failed:', e));
    }
  };

  const playGameOverSound = () => {
    stopAllSounds();
    if (gameOverAudioRef.current) {
      gameOverAudioRef.current.play().catch(e => console.log('Game over audio play failed:', e));
    }
  };

  return {
    jumpAudioRef,
    gameOverAudioRef,
    introAudioRef,
    birdImageRef,
    obstacleImageRef,
    stopAllSounds,
    loadThemeAssets,
    playIntroSound,
    playGameOverSound
  };
}
