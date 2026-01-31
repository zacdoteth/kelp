"use client";

import { useState, useEffect } from "react";

const DANCE_MOVES = [
  // Each move is a keyframe sequence: [transform, duration]
  { name: "bounce", keyframes: `
    0%, 100% { transform: translateY(0) rotate(0deg); }
    25% { transform: translateY(-12px) rotate(-8deg); }
    50% { transform: translateY(0) rotate(0deg); }
    75% { transform: translateY(-12px) rotate(8deg); }
  `},
  { name: "spin", keyframes: `
    0% { transform: rotate(0deg) scale(1); }
    25% { transform: rotate(15deg) scale(1.1); }
    50% { transform: rotate(0deg) scale(1); }
    75% { transform: rotate(-15deg) scale(1.1); }
    100% { transform: rotate(0deg) scale(1); }
  `},
  { name: "wave", keyframes: `
    0%, 100% { transform: translateX(0) rotate(0deg); }
    25% { transform: translateX(8px) rotate(10deg); }
    75% { transform: translateX(-8px) rotate(-10deg); }
  `},
  { name: "disco", keyframes: `
    0%, 100% { transform: translateY(0) scaleX(1); }
    25% { transform: translateY(-8px) scaleX(0.9); }
    50% { transform: translateY(0) scaleX(1.1); }
    75% { transform: translateY(-8px) scaleX(0.9); }
  `},
  { name: "headbang", keyframes: `
    0%, 100% { transform: rotate(0deg) translateY(0); }
    15% { transform: rotate(-20deg) translateY(-5px); }
    30% { transform: rotate(5deg) translateY(3px); }
    45% { transform: rotate(-20deg) translateY(-5px); }
    60% { transform: rotate(5deg) translateY(3px); }
    75% { transform: rotate(0deg) translateY(0); }
  `},
];

function Lobster({ index, total, speed }: { index: number; total: number; speed: number }) {
  const move = DANCE_MOVES[index % DANCE_MOVES.length];
  const delay = (index * 0.12).toFixed(2);
  const size = 28 + Math.sin(index * 1.7) * 8;
  const animName = `lobster-${move.name}-${index}`;
  
  return (
    <>
      <style>{`
        @keyframes ${animName} { ${move.keyframes} }
      `}</style>
      <div
        className="inline-block cursor-pointer hover:scale-125 transition-transform duration-200"
        style={{
          fontSize: `${size}px`,
          animation: `${animName} ${speed}s ease-in-out ${delay}s infinite`,
          filter: `hue-rotate(${index * 15}deg)`,
        }}
        title={`Molt #${index + 1}`}
      >
        🦞
      </div>
    </>
  );
}

export default function DancingLobsters() {
  const [visible, setVisible] = useState(false);
  const [lobsterCount, setLobsterCount] = useState(12);
  const [speed, setSpeed] = useState(0.6);
  const [party, setParty] = useState(false);

  // Party mode = more lobsters + faster
  const triggerParty = () => {
    setParty(true);
    setLobsterCount(30);
    setSpeed(0.3);
    setTimeout(() => {
      setParty(false);
      setLobsterCount(12);
      setSpeed(0.6);
    }, 5000);
  };

  return (
    <div className="relative">
      {/* Toggle button */}
      <button
        onClick={() => setVisible(!visible)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.06]
                   hover:bg-white/[0.08] hover:border-[#ff6b6b]/30 transition-all duration-300 text-sm"
      >
        <span className="inline-block" style={{ animation: 'float 2s ease-in-out infinite' }}>🦞</span>
        <span className="text-white/40 font-display">{visible ? 'Hide' : 'Release'} the Lobsters</span>
      </button>

      {/* Dance floor */}
      {visible && (
        <div className="mt-4 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] overflow-hidden relative">
          {/* Disco lights */}
          {party && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute top-0 left-1/4 w-20 h-full bg-[#ff6b6b]/5 rotate-12 animate-pulse" />
              <div className="absolute top-0 left-1/2 w-20 h-full bg-[#00ffd5]/5 -rotate-12 animate-pulse" style={{ animationDelay: '0.3s' }} />
              <div className="absolute top-0 left-3/4 w-20 h-full bg-[#c4a962]/5 rotate-6 animate-pulse" style={{ animationDelay: '0.6s' }} />
            </div>
          )}

          {/* Title */}
          <div className="text-center mb-4">
            <p className="text-[10px] text-white/20 uppercase tracking-[0.2em]">
              {party ? "🪩 PARTY MODE 🪩" : "the lobster dance"}
            </p>
          </div>

          {/* Lobsters */}
          <div className="flex flex-wrap items-end justify-center gap-1">
            {Array.from({ length: lobsterCount }, (_, i) => (
              <Lobster key={i} index={i} total={lobsterCount} speed={speed} />
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-3 mt-5">
            <button
              onClick={triggerParty}
              className="px-4 py-2 rounded-xl text-[12px] font-display font-semibold
                         bg-gradient-to-r from-[#ff6b6b] to-[#ff8a80] text-white
                         hover:shadow-[0_4px_20px_rgba(255,107,107,0.3)] active:scale-95 transition-all"
            >
              🪩 Party Mode
            </button>
            <button
              onClick={() => setSpeed(s => Math.max(0.2, s - 0.1))}
              className="px-3 py-2 rounded-xl text-[12px] text-white/40 bg-white/[0.04] border border-white/[0.06]
                         hover:bg-white/[0.08] transition-all"
            >
              ⚡ Faster
            </button>
            <button
              onClick={() => setSpeed(s => Math.min(1.5, s + 0.1))}
              className="px-3 py-2 rounded-xl text-[12px] text-white/40 bg-white/[0.04] border border-white/[0.06]
                         hover:bg-white/[0.08] transition-all"
            >
              🐌 Slower
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
