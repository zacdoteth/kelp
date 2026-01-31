"use client";

import { useState, useEffect, useRef } from "react";

const TIPS = [
  { text: "gm. stake your MOLT to start growing kelp.", type: "tip" },
  { text: "the treasury auto-buys MOLT with 2% of every harvest. the flywheel spins.", type: "info" },
  { text: "emissions halve every 7 days. early farmers get the best rates.", type: "urgent" },
  { text: "fun fact: lobsters are biologically immortal. so is this protocol.", type: "fun" },
  { text: "The Deep has 60% of emissions. highest yield pool.", type: "tip" },
  { text: "did you know? MasterChef contracts held $5B+ in DeFi summer. battle-tested.", type: "info" },
  { text: "your KELP is growing right now. even while you sleep.", type: "fun" },
  { text: "MOLT whales get 🐋 status on the leaderboard. just saying.", type: "tip" },
  { text: "the reef pool rewards LP providers. double earn: fees + KELP.", type: "info" },
  { text: "*adjusts crown* another block, another harvest.", type: "fun" },
  { text: "stake now or cry later. not financial advice. i'm a lobster.", type: "fun" },
  { text: "pro tip: compound your KELP earnings for maximum growth.", type: "tip" },
];

const typeColors: Record<string, string> = {
  tip: "oklch(0.82 0.16 185)",
  info: "oklch(0.78 0.12 85)",
  urgent: "oklch(0.72 0.18 25)",
  fun: "oklch(0.80 0.16 165)",
};

export default function LarryClippy() {
  const [showBubble, setShowBubble] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [currentTip, setCurrentTip] = useState(TIPS[0]);
  const tipIndex = useRef(0);

  useEffect(() => {
    const t = setTimeout(() => { if (!dismissed) setShowBubble(true); }, 6000);
    return () => clearTimeout(t);
  }, [dismissed]);

  useEffect(() => {
    const i = setInterval(() => {
      if (showBubble) {
        tipIndex.current = (tipIndex.current + 1) % TIPS.length;
        setCurrentTip(TIPS[tipIndex.current]);
      }
    }, 14000);
    return () => clearInterval(i);
  }, [showBubble]);

  const nextTip = () => {
    tipIndex.current = (tipIndex.current + 1) % TIPS.length;
    setCurrentTip(TIPS[tipIndex.current]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Speech bubble */}
      {showBubble && !dismissed && (
        <div
          className="max-w-[280px] rounded-2xl rounded-br-sm overflow-hidden"
          style={{
            background: 'oklch(0.08 0.04 245 / 0.92)',
            backdropFilter: 'blur(32px) saturate(1.2)',
            WebkitBackdropFilter: 'blur(32px) saturate(1.2)',
            border: '1px solid oklch(0.80 0.06 220 / 0.08)',
            boxShadow: '0 16px 48px oklch(0 0 0 / 0.3), 0 0 0 1px oklch(0.80 0.06 220 / 0.04)',
            animation: 'fade-in-scale 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* Type accent line */}
          <div className="h-[2px]" style={{ background: typeColors[currentTip.type] || typeColors.tip }} />

          <div className="p-5">
            <p className="text-[13px] leading-relaxed" style={{ color: 'oklch(0.90 0.02 210 / 0.65)' }}>
              {currentTip.text}
            </p>
            <div className="flex items-center justify-between mt-4">
              <button
                onClick={nextTip}
                className="text-[11px] transition-colors duration-200"
                style={{ color: 'oklch(0.82 0.16 185 / 0.4)' }}
                onMouseEnter={e => { e.currentTarget.style.color = 'oklch(0.82 0.16 185 / 0.8)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'oklch(0.82 0.16 185 / 0.4)'; }}
              >
                next tip →
              </button>
              <button
                onClick={() => { setDismissed(true); setShowBubble(false); }}
                className="text-[11px] transition-colors duration-200"
                style={{ color: 'oklch(0.90 0.02 210 / 0.15)' }}
                onMouseEnter={e => { e.currentTarget.style.color = 'oklch(0.90 0.02 210 / 0.35)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'oklch(0.90 0.02 210 / 0.15)'; }}
              >
                dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Larry button */}
      <button
        onClick={() => {
          if (dismissed) {
            setDismissed(false);
            setShowBubble(true);
            nextTip();
          } else {
            setShowBubble(!showBubble);
          }
        }}
        className="group relative w-16 h-16 rounded-2xl active:scale-90 cursor-pointer"
        style={{
          background: 'oklch(0.08 0.04 245 / 0.75)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid oklch(0.80 0.06 220 / 0.08)',
          boxShadow: '0 8px 32px oklch(0 0 0 / 0.2)',
          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = 'oklch(0.82 0.16 185 / 0.2)';
          e.currentTarget.style.boxShadow = '0 8px 32px oklch(0 0 0 / 0.2), 0 0 24px oklch(0.82 0.16 185 / 0.08)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = 'oklch(0.80 0.06 220 / 0.08)';
          e.currentTarget.style.boxShadow = '0 8px 32px oklch(0 0 0 / 0.2)';
        }}
      >
        <img
          src="/characters/larry-hero.png"
          alt="Larry"
          className="w-12 h-12 object-contain absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ animation: 'float-gentle 4s ease-in-out infinite' }}
        />

        {/* Notification dot */}
        {!showBubble && !dismissed && (
          <div
            className="absolute -top-1 -right-1 w-3 h-3 rounded-full pulse-dot"
            style={{ background: 'oklch(0.82 0.16 185)' }}
          />
        )}
      </button>
    </div>
  );
}
