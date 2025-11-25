"use client";

import React from 'react';

export default function WitnessLogo() {
  return (
    <div className="relative w-24 h-24 group cursor-pointer">
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full fill-current text-[var(--blood-red)] animate-pulse"
        style={{ filter: 'drop-shadow(0 0 5px var(--neon-red))' }}
      >
        <path d="M50 10 C30 10 15 25 15 45 C15 60 25 70 30 80 L30 90 L40 90 L40 85 L60 85 L60 90 L70 90 L70 80 C75 70 85 60 85 45 C85 25 70 10 50 10 Z M35 40 C38 40 40 42 40 45 C40 48 38 50 35 50 C32 50 30 48 30 45 C30 42 32 40 35 40 Z M65 40 C68 40 70 42 70 45 C70 48 68 50 65 50 C62 50 60 48 60 45 C60 42 62 40 65 40 Z M50 65 L45 75 L55 75 Z" />
        
        {/* Glitch Layers */}
        <path 
          d="M50 10 C30 10 15 25 15 45 C15 60 25 70 30 80 L30 90 L40 90 L40 85 L60 85 L60 90 L70 90 L70 80 C75 70 85 60 85 45 C85 25 70 10 50 10 Z M35 40 C38 40 40 42 40 45 C40 48 38 50 35 50 C32 50 30 48 30 45 C30 42 32 40 35 40 Z M65 40 C68 40 70 42 70 45 C70 48 68 50 65 50 C62 50 60 48 60 45 C60 42 62 40 65 40 Z M50 65 L45 75 L55 75 Z" 
          className="absolute top-0 left-0 opacity-50 text-[var(--neon-red)]"
          style={{ animation: 'glitch 0.3s infinite reverse' }}
        />
        <path 
          d="M50 10 C30 10 15 25 15 45 C15 60 25 70 30 80 L30 90 L40 90 L40 85 L60 85 L60 90 L70 90 L70 80 C75 70 85 60 85 45 C85 25 70 10 50 10 Z M35 40 C38 40 40 42 40 45 C40 48 38 50 35 50 C32 50 30 48 30 45 C30 42 32 40 35 40 Z M65 40 C68 40 70 42 70 45 C70 48 68 50 65 50 C62 50 60 48 60 45 C60 42 62 40 65 40 Z M50 65 L45 75 L55 75 Z" 
          className="absolute top-0 left-0 opacity-50 text-blue-500"
          style={{ animation: 'glitch 0.3s infinite' }}
        />
      </svg>
    </div>
  );
}
