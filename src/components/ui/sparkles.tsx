"use client";
import React, { useId } from "react";
import { motion } from "framer-motion";

export const SparklesCore = (props: {
  id?: string;
  background?: string;
  minSize?: number;
  maxSize?: number;
  particleDensity?: number;
  className?: string;
  particleColor?: string;
}) => {
  const {
    id,
    background = "transparent",
    minSize = 1,
    maxSize = 3,
    particleDensity = 100,
    className = "",
    particleColor = "#FFF",
  } = props;
  const generatedId = useId();
  const effectId = id || generatedId;

  return (
    <div className={`relative ${className}`}>
      <svg className="absolute inset-0 h-full w-full">
        <rect width="100%" height="100%" fill={background} />
        {[...Array(particleDensity)].map((_, index) => {
          const size = Math.random() * (maxSize - minSize) + minSize;
          const x = Math.random() * 100;
          const y = Math.random() * 100;
          const duration = Math.random() * 3 + 2;
          const delay = Math.random() * 2;

          return (
            <motion.circle
              key={`${effectId}-${index}`}
              cx={`${x}%`}
              cy={`${y}%`}
              r={size}
              fill={particleColor}
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration,
                repeat: Infinity,
                delay,
                ease: "easeInOut",
              }}
            />
          );
        })}
      </svg>
    </div>
  );
};
