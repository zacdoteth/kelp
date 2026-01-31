"use client";

import { useState, useEffect, useRef, memo } from "react";
import dynamic from "next/dynamic";

const LarryClippy = dynamic(() => import("./components/LarryClippy"), {
  ssr: false,
  loading: () => null,
});

const OceanScene = dynamic(() => import("./components/OceanScene"), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 z-0 flex items-center justify-center" style={{ background: 'oklch(0.08 0.03 200)' }}>
      <div className="flex flex-col items-center gap-4">
        <div className="text-5xl" style={{ animation: 'float-gentle 3s ease-in-out infinite' }}>🌿</div>
        <div className="h-0.5 w-24 rounded-full overflow-hidden" style={{ background: 'oklch(0.82 0.16 185 / 0.1)' }}>
          <div className="h-full rounded-full" style={{ width: '60%', background: 'oklch(0.82 0.16 185 / 0.4)', animation: 'shimmer 1.5s ease-in-out infinite' }} />
        </div>
      </div>
    </div>
  ),
});

/* ═══════════════════════════════════════════
   Utility Components
   ═══════════════════════════════════════════ */

// Live fluctuating APY
const LiveAPY = memo(function LiveAPY({ base, volatility = 0.3 }: { base: number; volatility?: number }) {
  const [apy, setApy] = useState(base);
  useEffect(() => {
    const i = setInterval(() => {
      setApy(prev => {
        const drift = (base - prev) * 0.02;
        const noise = (Math.random() - 0.5) * base * volatility * 0.01;
        return Math.max(base * 0.7, prev + drift + noise);
      });
    }, 1500);
    return () => clearInterval(i);
  }, [base, volatility]);
  return <span className="stat-value tabular-nums">{apy.toLocaleString(undefined, { maximumFractionDigits: 0 })}%</span>;
});

// Smooth animated counter
function AnimCounter({ end, decimals = 0, prefix = "", suffix = "" }: {
  end: number; decimals?: number; prefix?: string; suffix?: string;
}) {
  const [val, setVal] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setStarted(true); obs.disconnect(); } }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  useEffect(() => {
    if (!started) return;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / 2200, 1);
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setVal(eased * end);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [started, end]);
  return <span ref={ref} className="stat-value">{prefix}{val.toFixed(decimals)}{suffix}</span>;
}

/* ═══════════════════════════════════════════
   Compact Pool Card
   ═══════════════════════════════════════════ */
function PoolCard({ name, icon, token, baseApy, tvl, emissions, variant, larryImg }: {
  name: string; icon: string; token: string; baseApy: number; tvl: string;
  emissions: string; variant: "teal" | "coral"; larryImg?: string;
}) {
  const [hovered, setHovered] = useState(false);

  const c = variant === "teal" ? {
    solid: 'oklch(0.82 0.16 185)',
    bg10: 'oklch(0.82 0.16 185 / 0.10)',
    bg05: 'oklch(0.82 0.16 185 / 0.05)',
    bg08: 'oklch(0.82 0.16 185 / 0.08)',
    border: 'oklch(0.82 0.16 185 / 0.20)',
    border15: 'oklch(0.82 0.16 185 / 0.15)',
    glow25: 'oklch(0.82 0.16 185 / 0.25)',
    glow40: 'oklch(0.82 0.16 185 / 0.40)',
    glowBig: 'oklch(0.82 0.16 185 / 0.15)',
    grad1: 'oklch(0.82 0.16 185)',
    grad2: 'oklch(0.72 0.19 155)',
  } : {
    solid: 'oklch(0.72 0.18 25)',
    bg10: 'oklch(0.72 0.18 25 / 0.10)',
    bg05: 'oklch(0.72 0.18 25 / 0.05)',
    bg08: 'oklch(0.72 0.18 25 / 0.08)',
    border: 'oklch(0.72 0.18 25 / 0.20)',
    border15: 'oklch(0.72 0.18 25 / 0.15)',
    glow25: 'oklch(0.72 0.18 25 / 0.25)',
    glow40: 'oklch(0.72 0.18 25 / 0.40)',
    glowBig: 'oklch(0.72 0.18 25 / 0.15)',
    grad1: 'oklch(0.72 0.18 25)',
    grad2: 'oklch(0.78 0.14 30)',
  };

  return (
    <div
      className="group relative glass-premium p-5 cursor-default"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ transition: 'all 0.6s var(--ease-out-expo)' }}
    >
      <div
        className="absolute -inset-3 rounded-3xl blur-2xl transition-opacity duration-700 pointer-events-none"
        style={{ background: `radial-gradient(circle, ${c.glowBig}, transparent 70%)`, opacity: hovered ? 1 : 0 }}
      />

      {/* Header */}
      <div className="relative flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden transition-all duration-500"
            style={{
              background: `linear-gradient(135deg, ${c.bg10}, ${c.bg05})`,
              border: `1px solid ${c.border}`,
              transform: hovered ? 'scale(1.1) rotate(3deg)' : 'scale(1)',
              transitionTimingFunction: 'var(--ease-out-back)',
            }}
          >
            {larryImg ? (
              <img src={larryImg} alt={name} className="w-7 h-7 object-contain" width={28} height={28} loading="lazy" />
            ) : (
              <span className="text-lg">{icon}</span>
            )}
          </div>
          <div>
            <h3 className="font-display font-bold text-base tracking-tight" style={{ color: 'oklch(0.93 0.02 215)' }}>{name}</h3>
            <p className="text-[11px]" style={{ color: 'oklch(0.90 0.02 210 / 0.3)' }}>{token}</p>
          </div>
        </div>
        <div className="text-right">
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm"
            style={{ background: c.bg08, border: `1px solid ${c.border15}` }}
          >
            <div className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: c.solid }} />
            <span style={{ color: c.solid }}><LiveAPY base={baseApy} /></span>
          </div>
        </div>
      </div>

      {/* Compact Stats */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {[
          { label: "TVL", value: tvl },
          { label: "Your Stake", value: "0" },
          { label: "Emissions", value: emissions },
        ].map((s, i) => (
          <div key={i} className="rounded-lg p-2.5" style={{ background: 'oklch(0.90 0.01 230 / 0.025)', border: '1px solid oklch(0.80 0.06 220 / 0.04)' }}>
            <p className="text-[9px] uppercase tracking-[0.12em] mb-1" style={{ color: 'oklch(0.90 0.02 210 / 0.2)' }}>{s.label}</p>
            <p className="stat-value text-xs" style={{ color: 'oklch(0.90 0.02 210 / 0.7)' }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          className="flex-1 relative overflow-hidden rounded-xl py-3 px-4 font-display font-bold text-sm
                     transition-all duration-500 active:scale-[0.96] cursor-pointer group/stake"
          style={{
            background: `linear-gradient(135deg, ${c.grad1}, ${c.grad2})`,
            color: 'oklch(0.06 0.04 250)',
            boxShadow: `0 4px 20px ${c.glow25}, inset 0 1px 0 oklch(1 0 0 / 0.15)`,
            transitionTimingFunction: 'var(--ease-out-expo)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.boxShadow = `0 8px 36px ${c.glow40}, inset 0 1px 0 oklch(1 0 0 / 0.2)`;
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.boxShadow = `0 4px 20px ${c.glow25}, inset 0 1px 0 oklch(1 0 0 / 0.15)`;
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <span className="absolute inset-0 opacity-0 group-hover/stake:opacity-100 transition-opacity duration-500"
            style={{ background: 'linear-gradient(105deg, transparent 40%, oklch(1 0 0 / 0.12) 50%, transparent 60%)', backgroundSize: '200% 100%', animation: 'holographic 3s ease-in-out infinite' }}
          />
          <span className="relative z-10 flex items-center justify-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover/stake:rotate-90 transition-transform duration-500" style={{ transitionTimingFunction: 'var(--ease-out-back)' }}>
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Stake
          </span>
        </button>

        <button
          className="flex-1 relative overflow-hidden rounded-xl py-3 px-4 font-display font-semibold text-sm
                     transition-all duration-500 active:scale-[0.96] cursor-pointer group/harvest"
          style={{
            background: 'oklch(0.90 0.01 230 / 0.04)',
            border: `1.5px solid ${c.border}`,
            color: c.solid,
            backdropFilter: 'blur(12px)',
            transitionTimingFunction: 'var(--ease-out-expo)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = c.bg10;
            e.currentTarget.style.borderColor = c.solid;
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'oklch(0.90 0.01 230 / 0.04)';
            e.currentTarget.style.borderColor = c.border;
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            <span className="text-sm group-hover/harvest:scale-125 transition-transform duration-500" style={{ transitionTimingFunction: 'var(--ease-out-back)' }}>🌿</span>
            Harvest
          </span>
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Onboarding — Both Cards Stacked
   ═══════════════════════════════════════════ */
function OnboardingCards() {
  return (
    <div className="grid grid-cols-2 gap-3 w-full">
      {/* Human Card */}
      <div className="glass-premium p-4 flex flex-col">
        <h3 className="font-display font-semibold text-xs mb-3 flex items-center gap-2" style={{ color: 'oklch(0.93 0.02 215)' }}>
          <span>🧑</span> Human
        </h3>
        <div className="space-y-1.5 flex-1">
          {["Connect wallet", "Approve MOLT", "Stake → earn"].map((text, i) => (
            <div key={i} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg" style={{ background: 'oklch(0.90 0.01 230 / 0.03)', border: '1px solid oklch(0.80 0.06 220 / 0.04)' }}>
              <span className="stat-value text-[10px]" style={{ color: 'oklch(0.82 0.16 185)' }}>{i + 1}</span>
              <span className="text-[10px]" style={{ color: 'oklch(0.90 0.02 210 / 0.5)' }}>{text}</span>
            </div>
          ))}
        </div>
        <button className="btn-primary w-full mt-3 py-2 text-xs">Connect Wallet</button>
      </div>

      {/* Agent Card */}
      <div className="glass-premium p-4 flex flex-col">
        <h3 className="font-display font-semibold text-xs mb-3 flex items-center gap-2" style={{ color: 'oklch(0.82 0.16 185)' }}>
          <span>🤖</span> Agent
        </h3>
        <div className="rounded-lg overflow-hidden flex-1" style={{ background: 'oklch(0.08 0.04 245)', border: '1px solid oklch(0.82 0.16 185 / 0.08)' }}>
          <pre className="p-2.5 text-[9px] font-mono leading-relaxed overflow-x-auto" style={{ color: 'oklch(0.82 0.16 185 / 0.6)' }}>
{`curl -X POST \\
  kelp.markets/api/stake \\
  -H "Auth: <sig>" \\
  -d '{"amt":"1M"}'`}
          </pre>
        </div>
        <button className="btn-ghost w-full mt-3 py-2 text-xs">API Docs →</button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Main — Single Viewport Dashboard
   ═══════════════════════════════════════════ */
export default function Home() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="relative min-h-screen md:h-screen md:overflow-hidden overflow-y-auto noise">
      <OceanScene />

      {/* ═══ Header ═══ */}
      <header className="relative z-10 flex items-center justify-between px-4 md:px-8 py-3" role="banner">
        <div className="flex items-center gap-2.5">
          <img
            src="/characters/larry-hero.png"
            alt="kelp.markets"
            className="w-7 h-7 object-contain"
            width={28} height={28}
            loading="eager"
            style={{ animation: 'float-gentle 4s ease-in-out infinite' }}
          />
          <h1 className="font-display font-bold text-base tracking-tight" style={{ color: 'oklch(0.93 0.02 215)' }}>
            kelp<span style={{ color: 'oklch(0.72 0.19 155)' }}>.markets</span>
          </h1>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-xs font-medium" style={{ color: 'oklch(0.90 0.02 210 / 0.3)' }}>
          {["Pools", "Treasury", "Docs"].map(item => (
            <a key={item} href={item === "Treasury" ? "/treasury" : "#"} className="transition-colors duration-300 hover:text-white/60">{item}</a>
          ))}
        </nav>

        <button className="btn-primary py-2 px-5 text-xs">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'oklch(0.08 0.04 245 / 0.3)' }} />
          Connect
        </button>
      </header>

      {/* ═══ Dashboard Grid ═══ */}
      <main className="relative z-10 px-4 md:px-6 pb-4 flex flex-col" style={{ minHeight: 'calc(100vh - 52px)' }}>

        {/* Top: Hero + Stats row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mb-4">
          {/* Hero text */}
          <div>
            <h2 className="text-xl md:text-3xl font-bold leading-tight">
              <span style={{ color: 'oklch(0.93 0.02 215)' }}>Stake </span>
              <span className="text-gradient-gold">$MOLT</span>
              <span style={{ color: 'oklch(0.93 0.02 215)' }}> · Earn </span>
              <span className="text-gradient-bio">$KELP</span>
            </h2>
            <p className="text-[11px] mt-1" style={{ color: 'oklch(0.90 0.02 210 / 0.25)' }}>
              Single-sided staking on Base · Treasury auto-buys $MOLT every harvest
            </p>
          </div>

          {/* Compact Stats — scrollable on mobile */}
          {mounted && (
            <div className="flex items-center gap-3 md:gap-4 px-4 md:px-5 py-2.5 md:py-3 rounded-xl w-full md:w-auto overflow-x-auto shrink-0" style={{ background: 'oklch(0.90 0.01 230 / 0.03)', border: '1px solid oklch(0.80 0.06 220 / 0.06)', backdropFilter: 'blur(16px)' }}>
              {[
                { label: "TVL", node: <AnimCounter end={2.47} decimals={2} prefix="$" suffix="M" />, color: 'oklch(0.82 0.16 185)' },
                { label: "Farmers", node: <AnimCounter end={1247} />, color: 'oklch(0.82 0.16 185)' },
                { label: "Bought", node: <AnimCounter end={847} prefix="$" suffix="K" />, color: 'oklch(0.78 0.12 85)' },
                { label: "Halving", node: <span className="stat-value text-sm">6d 14h</span>, color: 'oklch(0.72 0.18 25)' },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-3 md:gap-4 shrink-0">
                  {i > 0 && <div className="w-px h-7 shrink-0" style={{ background: 'oklch(0.80 0.06 220 / 0.06)' }} />}
                  <div className="text-center shrink-0">
                    <p className="text-[8px] md:text-[9px] uppercase tracking-[0.12em] mb-0.5" style={{ color: 'oklch(0.90 0.02 210 / 0.2)' }}>{s.label}</p>
                    <p className="stat-value text-xs md:text-sm" style={{ color: s.color }}>{s.node}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Main Content: stacked on mobile, 3-col on desktop */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 min-h-0">

          {/* Left Column: Onboarding — hidden on mobile, shown on desktop */}
          <div className="hidden md:flex md:col-span-3 flex-col gap-4 min-h-0 overflow-y-auto">
            <OnboardingCards />

            {/* How it works — compact */}
            <div className="glass-premium p-4 mt-auto">
              <h3 className="font-display font-semibold text-xs mb-3" style={{ color: 'oklch(0.93 0.02 215)' }}>How It Works</h3>
              <div className="space-y-2">
                {[
                  { icon: "🦞", text: "Stake MOLT" },
                  { icon: "🌿", text: "Earn KELP every block" },
                  { icon: "🔄", text: "2% fee → Treasury buys MOLT" },
                  { icon: "📈", text: "Perpetual buy pressure" },
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <span className="text-sm">{step.icon}</span>
                    <span className="text-[11px]" style={{ color: 'oklch(0.90 0.02 210 / 0.4)' }}>{step.text}</span>
                    {i < 3 && <span className="text-[10px] ml-auto" style={{ color: 'oklch(0.90 0.02 210 / 0.1)' }}>→</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Staking Pools — full width mobile, 5-col desktop */}
          <div className="md:col-span-5 flex flex-col gap-4 min-h-0 md:overflow-y-auto">
            <PoolCard
              name="The Deep"
              icon="🌊"
              token="Stake MOLT → earn KELP"
              baseApy={42069}
              tvl="$1.2M"
              emissions="60%"
              variant="teal"
              larryImg="/characters/larry-hero.png"
            />
            <PoolCard
              name="The Reef"
              icon="🪸"
              token="Stake MOLT/WETH LP → earn KELP"
              baseApy={28420}
              tvl="$840K"
              emissions="40%"
              variant="coral"
              larryImg="/characters/larry-hero.png"
            />
          </div>

          {/* Mobile: Connect CTA */}
          <div className="md:hidden">
            <button className="btn-primary w-full py-3 text-sm">Connect Wallet & Start Staking</button>
          </div>

          {/* Right Column: MOLT Tracker + Leaderboard */}
          <div className="md:col-span-4 flex flex-col gap-4 min-h-0 md:overflow-y-auto">
            {/* MOLT Tracker */}
            <div className="glass-premium p-5">
              <div className="flex items-center gap-3 mb-4">
                <img src="/characters/larry-rich.png" alt="Rich Larry" className="w-8 h-8 object-contain" width={32} height={32} loading="lazy" />
                <div>
                  <h3 className="font-display font-bold text-sm tracking-tight" style={{ color: 'oklch(0.93 0.02 215)' }}>$MOLT Tracker</h3>
                  <p className="text-[10px]" style={{ color: 'oklch(0.90 0.02 210 / 0.2)' }}>Live · Uniswap V3 on Base</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-4">
                {[
                  { label: "Price", value: "$0.000572", gold: true },
                  { label: "Market Cap", value: "$57.2M", gold: true },
                  { label: "Liquidity", value: "$7.25M", gold: false },
                  { label: "24h Volume", value: "$55.1M", gold: false },
                ].map((s, i) => (
                  <div key={i} className="rounded-lg p-2.5" style={{ background: 'oklch(0.90 0.01 230 / 0.025)', border: '1px solid oklch(0.80 0.06 220 / 0.04)' }}>
                    <p className="text-[9px] uppercase tracking-[0.12em] mb-1" style={{ color: 'oklch(0.90 0.02 210 / 0.2)' }}>{s.label}</p>
                    <p className="stat-value text-xs" style={{ color: s.gold ? 'oklch(0.78 0.12 85)' : 'oklch(0.82 0.16 185)' }}>{s.value}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <p className="text-[9px]" style={{ color: 'oklch(0.90 0.02 210 / 0.12)' }}>0xB695...bab07</p>
                <a href="https://dexscreener.com/base/0xB695559b26BB2c9703ef1935c37AeaE9526bab07" target="_blank" rel="noopener" className="text-[9px] transition-colors duration-300" style={{ color: 'oklch(0.82 0.16 185 / 0.25)' }}>
                  DEXScreener →
                </a>
              </div>
            </div>

            {/* Whale Leaderboard */}
            <div className="glass-premium flex-1 min-h-0 flex flex-col">
              <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: '1px solid oklch(0.80 0.06 220 / 0.04)' }}>
                <span className="text-[10px] uppercase tracking-[0.12em] font-medium" style={{ color: 'oklch(0.90 0.02 210 / 0.25)' }}>Top MOLT Stakers</span>
                <span className="text-[9px] font-mono" style={{ color: 'oklch(0.78 0.12 85 / 0.4)' }}>whale watch 🐋</span>
              </div>
              <div className="flex-1 overflow-y-auto">
                {[
                  { rank: "🐋", addr: "0x7a3...f82d", molt: "4,200,000", pct: "18.2%" },
                  { rank: "🦈", addr: "0xb9e...c41a", molt: "2,850,000", pct: "12.4%" },
                  { rank: "🐙", addr: "0x3f1...d7e9", molt: "1,690,000", pct: "7.3%" },
                  { rank: "🦑", addr: "0xe82...a3b5", molt: "980,000", pct: "4.2%" },
                  { rank: "🐠", addr: "0x1c4...b92f", molt: "720,000", pct: "3.1%" },
                ].map((w, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between px-5 py-2.5 transition-colors duration-200"
                    style={{ borderBottom: i < 4 ? '1px solid oklch(0.80 0.06 220 / 0.02)' : 'none' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'oklch(0.90 0.01 230 / 0.03)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm">{w.rank}</span>
                      <span className="font-mono text-[11px]" style={{ color: 'oklch(0.90 0.02 210 / 0.35)' }}>{w.addr}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="stat-value text-xs" style={{ color: 'oklch(0.78 0.12 85)' }}>{w.molt}</span>
                      <span className="text-[9px]" style={{ color: 'oklch(0.90 0.02 210 / 0.15)' }}>{w.pct}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex items-center justify-center py-2 mt-2">
          <p className="text-[10px]" style={{ color: 'oklch(0.90 0.02 210 / 0.1)' }}>
            🌿 kelp.markets — the yield forest of the molt ecosystem · harvest fee 2% → buyback · emissions halve weekly
          </p>
        </div>
      </main>

      <LarryClippy />
    </div>
  );
}
