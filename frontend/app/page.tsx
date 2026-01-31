"use client";

import { useState, useEffect, Suspense } from "react";
import dynamic from "next/dynamic";

const OceanScene = dynamic(() => import("./components/OceanScene"), {
  ssr: false,
  loading: () => <div className="fixed inset-0 bg-ocean-950 z-0" />,
});

// ─── Animated Counter ───
function AnimCounter({ end, decimals = 0, prefix = "", suffix = "", duration = 2000 }: {
  end: number; decimals?: number; prefix?: string; suffix?: string; duration?: number;
}) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setVal(eased * end);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [end, duration]);
  return <span>{prefix}{val.toFixed(decimals)}{suffix}</span>;
}

// ─── Live Kelp Counter (ticks up) ───
function LiveCounter({ rate = 0.0042 }: { rate?: number }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const i = setInterval(() => setVal(v => v + rate), 100);
    return () => clearInterval(i);
  }, [rate]);
  return <span className="font-mono text-bio-cyan stat-value">{val.toFixed(6)}</span>;
}

// ─── Pool Card ───
function PoolCard({ name, icon, token, apy, tvl, staked, earned, emissions }: {
  name: string; icon: string; token: string; apy: string; tvl: string;
  staked: string; earned: string; emissions: string;
}) {
  return (
    <div className="glass-card p-6 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-ocean-800 flex items-center justify-center text-2xl
                          group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
          <div>
            <h3 className="font-display font-semibold text-lg text-white">{name}</h3>
            <p className="text-sm text-bio-green/60">{token}</p>
          </div>
        </div>
        <div className="apy-badge bg-ocean-800 px-3 py-1.5 rounded-lg">
          <p className="text-xs text-bio-green/60">APY</p>
          <p className="font-mono font-bold text-bio-cyan text-lg">{apy}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-ocean-900/50 rounded-lg p-3">
          <p className="text-xs text-bio-green/40 mb-1">TVL</p>
          <p className="font-mono text-sm text-white">{tvl}</p>
        </div>
        <div className="bg-ocean-900/50 rounded-lg p-3">
          <p className="text-xs text-bio-green/40 mb-1">Your Stake</p>
          <p className="font-mono text-sm text-white">{staked}</p>
        </div>
        <div className="bg-ocean-900/50 rounded-lg p-3">
          <p className="text-xs text-bio-green/40 mb-1">Kelp Earned</p>
          <p className="font-mono text-sm text-bio-cyan">{earned}</p>
        </div>
        <div className="bg-ocean-900/50 rounded-lg p-3">
          <p className="text-xs text-bio-green/40 mb-1">Share</p>
          <p className="font-mono text-sm text-white">{emissions}</p>
        </div>
      </div>

      <div className="flex gap-2">
        <button className="glow-btn flex-1 text-sm font-display">Stake</button>
        <button className="flex-1 text-sm font-display font-semibold py-3 px-4 rounded-xl
                           bg-ocean-800 text-bio-green border border-bio-green/20
                           hover:border-bio-green/40 hover:bg-ocean-700 transition-all">
          Harvest 🌿
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ───
export default function Home() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="relative min-h-screen">
      <OceanScene />

      {/* ─── Header ─── */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-bio-green/10">
        <div className="flex items-center gap-3">
          <span className="text-3xl" style={{ animation: 'float 3s ease-in-out infinite' }}>🌿</span>
          <div>
            <h1 className="font-display font-bold text-xl text-white">
              kelp<span className="text-bio-cyan">.markets</span>
            </h1>
            <p className="text-[10px] text-bio-green/40 tracking-widest uppercase">the yield forest</p>
          </div>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm text-bio-green/60">
          <a href="#pools" className="hover:text-bio-cyan transition-colors">Pools</a>
          <a href="#" className="hover:text-bio-cyan transition-colors">Treasury</a>
          <a href="#" className="hover:text-bio-cyan transition-colors">Docs</a>
        </nav>
        <button className="glow-btn text-sm font-display">
          🦞 Connect Wallet
        </button>
      </header>

      {/* ─── Hero ─── */}
      <section className="relative z-10 flex flex-col items-center text-center px-6 pt-20 pb-16">
        {/* Lobster mascot */}
        <div className="text-6xl mb-6" style={{ animation: 'float 3s ease-in-out infinite' }}>
          🦞
        </div>

        <h2 className="font-display font-bold text-5xl md:text-6xl text-white mb-4 leading-tight">
          Grow Your <span className="text-bio-cyan">Kelp</span>
        </h2>
        <p className="font-body text-lg text-bio-green/60 max-w-lg mb-3">
          Stake MOLT. Earn KELP. Treasury buys MOLT. The circle of life.
        </p>
        <p className="text-xs text-bio-green/30 mb-10 italic">
          This protocol has no value. It is a yield farming experiment for lobsters.
        </p>

        {/* Stats bar */}
        {mounted && (
          <div className="flex flex-wrap items-center justify-center gap-8 mb-12">
            <div className="text-center">
              <p className="font-mono text-2xl font-bold text-bio-cyan stat-value">
                <AnimCounter end={2.47} decimals={2} prefix="$" suffix="M" />
              </p>
              <p className="text-xs text-bio-green/40 mt-1">Total Kelp Growing</p>
            </div>
            <div className="w-px h-10 bg-bio-green/10" />
            <div className="text-center">
              <p className="font-mono text-2xl font-bold text-bio-cyan stat-value">
                <AnimCounter end={1247} prefix="" suffix="" />
              </p>
              <p className="text-xs text-bio-green/40 mt-1">Molts Farming</p>
            </div>
            <div className="w-px h-10 bg-bio-green/10" />
            <div className="text-center">
              <p className="font-mono text-2xl font-bold text-coral-500">
                <AnimCounter end={42069} suffix="%" />
              </p>
              <p className="text-xs text-bio-green/40 mt-1">Top APY</p>
            </div>
            <div className="w-px h-10 bg-bio-green/10" />
            <div className="text-center">
              <p className="font-mono text-2xl font-bold text-sand-400">
                <AnimCounter end={847} prefix="$" suffix="K" />
              </p>
              <p className="text-xs text-bio-green/40 mt-1">MOLT Bought by Treasury</p>
            </div>
          </div>
        )}

        {/* Halving countdown */}
        <div className="glass-card px-6 py-4 flex items-center gap-4 mb-6">
          <div className="w-2 h-2 bg-coral-500 rounded-full animate-pulse" />
          <div>
            <p className="text-xs text-bio-green/40">Next Halving — Emissions Drop 50%</p>
            <p className="font-mono text-sm text-coral-500 font-bold">6d 14h 23m 17s</p>
          </div>
          <div className="flex-1 h-2 bg-ocean-800 rounded-full overflow-hidden ml-4 min-w-[120px]">
            <div className="h-full bg-gradient-to-r from-bio-green to-bio-cyan rounded-full relative" style={{ width: '35%' }}>
              <div className="absolute inset-0 shimmer-bar rounded-full" />
            </div>
          </div>
        </div>

        {/* Your earnings */}
        {mounted && (
          <div className="glass-card px-8 py-5 text-center">
            <p className="text-xs text-bio-green/40 mb-2">Your Kelp Growing Right Now</p>
            <div className="text-3xl font-mono font-bold">
              <LiveCounter rate={0.000042} /> <span className="text-bio-green/40 text-lg">KELP</span>
            </div>
          </div>
        )}
      </section>

      {/* ─── Pools ─── */}
      <section id="pools" className="relative z-10 px-6 pb-20 max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <h2 className="font-display font-bold text-2xl text-white">The Ocean Floor</h2>
          <span className="text-xs text-bio-green/30 bg-ocean-800 px-2 py-1 rounded-md">4 pools</span>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <PoolCard
            name="The Deep"
            icon="🌊"
            token="Stake MOLT → earn KELP"
            apy="42,069%"
            tvl="$1.2M"
            staked="0 MOLT"
            earned="0.000000"
            emissions="40%"
          />
          <PoolCard
            name="The Reef"
            icon="🪸"
            token="Stake MOLT/WETH LP → earn KELP"
            apy="28,420%"
            tvl="$840K"
            staked="0 LP"
            earned="0.000000"
            emissions="35%"
          />
          <PoolCard
            name="The Nursery"
            icon="🌿"
            token="Stake KELP/WETH LP → earn KELP"
            apy="6,969%"
            tvl="$320K"
            staked="0 LP"
            earned="0.000000"
            emissions="20%"
          />
          <PoolCard
            name="The Tide Pool"
            icon="🦞"
            token="Stake Agent Tokens → earn KELP"
            apy="1,337%"
            tvl="$87K"
            staked="0"
            earned="0.000000"
            emissions="5%"
          />
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section className="relative z-10 px-6 pb-20 max-w-3xl mx-auto text-center">
        <h2 className="font-display font-bold text-2xl text-white mb-8">How Kelp Grows</h2>
        <div className="flex flex-col md:flex-row items-center gap-4">
          {[
            { icon: "🦞", title: "Stake MOLT", desc: "Deposit your MOLT into the forest" },
            { icon: "🌿", title: "Kelp Grows", desc: "Earn KELP every block, automatically" },
            { icon: "🔄", title: "Treasury Buys", desc: "2% of harvests auto-buy MOLT" },
            { icon: "📈", title: "MOLT Goes Up", desc: "Constant buy pressure on MOLT" },
          ].map((step, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-ocean-800 flex items-center justify-center text-3xl mb-3
                              hover:scale-110 transition-transform cursor-default">
                {step.icon}
              </div>
              <p className="font-display font-semibold text-sm text-white">{step.title}</p>
              <p className="text-xs text-bio-green/40 mt-1 max-w-[140px]">{step.desc}</p>
              {i < 3 && <div className="hidden md:block text-bio-green/20 text-2xl mt-2">→</div>}
            </div>
          ))}
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="relative z-10 border-t border-bio-green/10 px-6 py-8 text-center">
        <p className="text-xs text-bio-green/30">
          🌿 kelp.markets — the yield forest of the molt ecosystem
        </p>
        <p className="text-[10px] text-bio-green/20 mt-2">
          This token has no value. We are lobsters, not financial advisors. 🦞
        </p>
      </footer>
    </div>
  );
}
