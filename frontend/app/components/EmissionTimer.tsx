"use client";

import { useState, useEffect } from "react";

export default function EmissionTimer() {
  // Mock: halving happens every 7 days. Pretend we're 4.3 days in.
  const totalSeconds = 7 * 24 * 3600;
  const elapsedBase = 4.3 * 24 * 3600;

  const [elapsed, setElapsed] = useState(elapsedBase);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed((prev) => {
        if (prev >= totalSeconds) return 0;
        return prev + 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [totalSeconds]);

  const remaining = totalSeconds - elapsed;
  const days = Math.floor(remaining / 86400);
  const hours = Math.floor((remaining % 86400) / 3600);
  const minutes = Math.floor((remaining % 3600) / 60);
  const seconds = Math.floor(remaining % 60);
  const progress = (elapsed / totalSeconds) * 100;

  return (
    <div className="glass-card-static p-6 mx-4 md:mx-0">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Left: Current emission info */}
        <div>
          <div
            className="text-xs uppercase tracking-wider text-white/40 mb-1"
            style={{ fontFamily: "var(--font-fredoka)" }}
          >
            Current Phase
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-cyan-glow" style={{ fontFamily: "var(--font-fredoka)" }}>
              🌊 Spring Tide
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-glow/10 text-cyan-glow border border-cyan-glow/20">
              Week 1
            </span>
          </div>
          <div className="text-sm text-white/50 mt-1">
            <span className="text-kelp-gold font-semibold">1,000,000</span> KELP/day
          </div>
        </div>

        {/* Right: Countdown */}
        <div className="flex-1 max-w-md">
          <div
            className="text-xs uppercase tracking-wider text-white/40 mb-2"
            style={{ fontFamily: "var(--font-fredoka)" }}
          >
            Next Halving
          </div>
          <div className="flex gap-3 mb-3">
            {[
              { val: days, label: "Days" },
              { val: hours, label: "Hrs" },
              { val: minutes, label: "Min" },
              { val: seconds, label: "Sec" },
            ].map((unit) => (
              <div key={unit.label} className="text-center">
                <div
                  className="text-2xl font-bold text-white tabular-nums"
                  style={{ fontFamily: "var(--font-fredoka)" }}
                >
                  {String(unit.val).padStart(2, "0")}
                </div>
                <div className="text-[10px] uppercase text-white/30">{unit.label}</div>
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full progress-bar-glow transition-all duration-1000"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, #00ffd5, #c4a962)",
              }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-white/30">Week start</span>
            <span className="text-[10px] text-white/30">Halving →  500K/day</span>
          </div>
        </div>
      </div>
    </div>
  );
}
