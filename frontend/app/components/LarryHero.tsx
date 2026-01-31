"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

const LARRY_QUOTES = [
  "gm. the kelp is growing.",
  "did someone say yield?",
  "*adjusts crown* another day, another harvest.",
  "the treasury bought more MOLT. you're welcome.",
  "stake now or cry later. your choice.",
  "i didn't choose the kelp life. the kelp life chose me.",
  "*dives into pile of kelp* weeee!",
  "fun fact: lobsters are biologically immortal. so is this protocol.",
  "that's a nice bag of MOLT you got there...",
  "the deep is calling. can you hear it?",
  "imagine NOT farming kelp right now. couldn't be me.",
  "*polishes crown* yes, i earned this.",
  "ser, the APY is literally five digits.",
  "one does not simply stop farming kelp.",
  "i've been farming since before ethereum had gas fees. wait.",
];

const LARRY_STATES = {
  idle: { img: "/characters/larry-hero.png", animation: "larryIdle" },
  excited: { img: "/characters/larry-dancing.png", animation: "larryExcited" },
  rich: { img: "/characters/larry-rich.png", animation: "larryRich" },
  sleeping: { img: "/characters/larry-sleeping.png", animation: "larrySleep" },
  party: { img: "/characters/larry-party.png", animation: "larryParty" },
};

export default function LarryHero() {
  const [state, setState] = useState<keyof typeof LARRY_STATES>("idle");
  const [quote, setQuote] = useState("");
  const [showQuote, setShowQuote] = useState(false);
  const [kelpCount, setKelpCount] = useState(0);
  const [clickCount, setClickCount] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Kelp falling animation items
  const [kelpRain, setKelpRain] = useState<{ id: number; x: number; delay: number; }[]>([]);

  const handleClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);

    // Different reactions based on click count
    if (newCount >= 10) {
      setState("party");
      triggerKelpRain();
    } else if (newCount >= 5) {
      setState("rich");
    } else {
      setState("excited");
    }

    // Show quote
    const q = LARRY_QUOTES[Math.floor(Math.random() * LARRY_QUOTES.length)];
    setQuote(q);
    setShowQuote(true);

    // Add kelp to the "vault"
    setKelpCount(k => k + Math.floor(Math.random() * 100) + 10);

    // Reset after a bit
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setState("idle");
      setShowQuote(false);
      setClickCount(0);
    }, 3000);
  };

  const triggerKelpRain = () => {
    const rain = Array.from({ length: 20 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      delay: Math.random() * 1,
    }));
    setKelpRain(rain);
    setTimeout(() => setKelpRain([]), 3000);
  };

  // Random idle quotes
  useEffect(() => {
    const interval = setInterval(() => {
      if (state === "idle" && Math.random() > 0.7) {
        const q = LARRY_QUOTES[Math.floor(Math.random() * LARRY_QUOTES.length)];
        setQuote(q);
        setShowQuote(true);
        setTimeout(() => setShowQuote(false), 4000);
      }
    }, 8000);
    return () => clearInterval(interval);
  }, [state]);

  const currentState = LARRY_STATES[state];

  return (
    <>
      <style>{`
        @keyframes larryIdle {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-8px) rotate(-2deg); }
          75% { transform: translateY(-4px) rotate(2deg); }
        }
        @keyframes larryExcited {
          0%, 100% { transform: translateY(0) rotate(0deg) scale(1); }
          25% { transform: translateY(-16px) rotate(-8deg) scale(1.05); }
          50% { transform: translateY(-4px) rotate(4deg) scale(1); }
          75% { transform: translateY(-12px) rotate(-4deg) scale(1.05); }
        }
        @keyframes larryRich {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-6px) scale(1.08); }
        }
        @keyframes larryParty {
          0% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(15deg) scale(1.1); }
          50% { transform: rotate(-15deg) scale(1.15); }
          75% { transform: rotate(10deg) scale(1.1); }
          100% { transform: rotate(0deg) scale(1); }
        }
        @keyframes larrySleep {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(3px); }
        }
        @keyframes speechBubble {
          0% { opacity: 0; transform: translateY(10px) scale(0.8); }
          10% { opacity: 1; transform: translateY(0) scale(1); }
          90% { opacity: 1; transform: translateY(0) scale(1); }
          100% { opacity: 0; transform: translateY(-5px) scale(0.95); }
        }
        @keyframes kelpFall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(200px) rotate(360deg); opacity: 0; }
        }
        @keyframes vaultPulse {
          0%, 100% { box-shadow: 0 0 20px rgba(196, 169, 98, 0.1); }
          50% { box-shadow: 0 0 40px rgba(196, 169, 98, 0.25); }
        }
      `}</style>

      <div className="relative flex flex-col items-center">
        {/* Kelp rain */}
        {kelpRain.map(k => (
          <span
            key={k.id}
            className="absolute text-2xl pointer-events-none z-30"
            style={{
              left: `${k.x}%`,
              top: 0,
              animation: `kelpFall 2s ease-in ${k.delay}s forwards`,
            }}
          >
            🌿
          </span>
        ))}

        {/* Speech bubble */}
        {showQuote && (
          <div
            className="absolute -top-16 z-20 max-w-[280px] px-4 py-2.5 rounded-2xl rounded-bl-sm
                       bg-white/[0.08] border border-white/[0.1] backdrop-blur-sm"
            style={{ animation: "speechBubble 4s ease-out forwards" }}
          >
            <p className="text-[13px] text-white/70 font-body italic leading-snug">{quote}</p>
          </div>
        )}

        {/* Larry himself */}
        <div
          className="relative cursor-pointer select-none active:scale-95 transition-transform"
          onClick={handleClick}
          style={{ animation: `${currentState.animation} ${state === 'party' ? '0.4s' : state === 'excited' ? '0.5s' : '3s'} ease-in-out infinite` }}
        >
          <img
            src={currentState.img}
            alt="Larry the Lobster"
            className="w-36 h-36 md:w-44 md:h-44 object-contain drop-shadow-[0_0_30px_rgba(0,255,213,0.3)]"
          />

          {/* Click indicator */}
          {clickCount === 0 && (
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/[0.06] border border-white/[0.08]">
              <span className="text-[10px] text-white/30">tap me</span>
              <span className="text-[10px]">👆</span>
            </div>
          )}
        </div>

        {/* Larry's Kelp Vault */}
        <div
          className="mt-5 flex items-center gap-3 px-5 py-3 rounded-2xl bg-[#c4a962]/[0.06] border border-[#c4a962]/[0.15]"
          style={{ animation: kelpCount > 500 ? "vaultPulse 2s ease-in-out infinite" : "none" }}
        >
          <span className="text-lg">🏦</span>
          <div>
            <p className="text-[10px] text-[#c4a962]/40 uppercase tracking-wider">Larry's Kelp Vault</p>
            <p className="font-mono text-[15px] text-[#c4a962] font-bold">
              {kelpCount.toLocaleString()} <span className="text-[11px] text-[#c4a962]/40 font-normal">KELP</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
