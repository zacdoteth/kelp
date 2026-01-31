"use client";

import { useEffect, useState } from "react";

// Tiny lobsters marching across the bottom of the screen — always visible, ambient life
const LOBSTER_STATES = [
  { emoji: "🦞", move: "bounce" },
  { emoji: "🦐", move: "waddle" },
  { emoji: "🦀", move: "sidestep" },
  { emoji: "🦞", move: "bounce" },
  { emoji: "🦑", move: "float" },
  { emoji: "🦞", move: "bounce" },
  { emoji: "🐙", move: "wiggle" },
  { emoji: "🦞", move: "bounce" },
];

export default function LobsterParade() {
  return (
    <>
      <style>{`
        @keyframes paradeWalk {
          0% { transform: translateX(100vw); }
          100% { transform: translateX(-200px); }
        }
        @keyframes lobsterBounce {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          30% { transform: translateY(-6px) rotate(-5deg); }
          60% { transform: translateY(0) rotate(5deg); }
        }
        @keyframes lobsterWaddle {
          0%, 100% { transform: translateY(0) scaleX(1); }
          25% { transform: translateY(-4px) scaleX(0.92); }
          50% { transform: translateY(0) scaleX(1.05); }
          75% { transform: translateY(-4px) scaleX(0.92); }
        }
        @keyframes lobsterSidestep {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          25% { transform: translateX(4px) rotate(5deg); }
          75% { transform: translateX(-4px) rotate(-5deg); }
        }
      `}</style>
      <div className="fixed bottom-0 left-0 right-0 z-20 pointer-events-none overflow-hidden h-10">
        <div
          className="flex items-end gap-6 whitespace-nowrap"
          style={{ animation: "paradeWalk 25s linear infinite" }}
        >
          {[...LOBSTER_STATES, ...LOBSTER_STATES, ...LOBSTER_STATES].map((l, i) => (
            <span
              key={i}
              className="text-lg inline-block opacity-40 hover:opacity-100 pointer-events-auto cursor-pointer transition-opacity"
              style={{
                animation: `lobster${l.move.charAt(0).toUpperCase() + l.move.slice(1)} ${0.4 + (i % 3) * 0.15}s ease-in-out infinite`,
                animationDelay: `${i * 0.08}s`,
              }}
              title={`Molt #${(i % 1368475) + 1}`}
            >
              {l.emoji}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
