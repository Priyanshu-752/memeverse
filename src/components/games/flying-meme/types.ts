export interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  passed: boolean;
}

export interface PathObstacle {
  x: number;
  y: number;
  size: number;
  passed: boolean;
}

export interface Heart {
  x: number;
  y: number;
  size: number;
  collected: boolean;
}

export type ThemeType = 'bachan' | 'gandi' | 'custom' | null;
