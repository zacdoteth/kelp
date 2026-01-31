"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import DancingLobsters from "./components/DancingLobsters";
import LobsterParade from "./components/LobsterParade";

const OceanScene = dynamic(() => import("./components/OceanScene"), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 bg-[#040d0a] z-0 flex items-center justify-center">
      <div className="text-4xl animate-bounce">🌿</div>
    </div>
  ),
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

// ─── Live KELP Counter ───
function LiveCounter({ rate = 0.0042 }: { rate?: number }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const i = setInterval(() => setVal(v => v + rate), 100);
    return () => clearInterval(i);
  }, [rate]);
  return <span className="font-mono">{val.toFixed(6)}</span>;
}

// ─── Live APY (fluctuates realistically) ───
function LiveAPY({ base, volatility = 0.3 }: { base: number; volatility?: number }) {
  const [apy, setApy] = useState(base);
  useEffect(() => {
    const i = setInterval(() => {
      setApy(prev => {
        // Mean-reverting random walk — bounces around base
        const drift = (base - prev) * 0.02;
        const noise = (Math.random() - 0.5) * base * volatility * 0.01;
        return Math.max(base * 0.7, prev + drift + noise);
      });
    }, 800 + Math.random() * 400);
    return () => clearInterval(i);
  }, [base, volatility]);
  return <span className="font-mono font-bold text-xl tabular-nums">{apy.toLocaleString(undefined, { maximumFractionDigits: 0 })}%</span>;
}

// ─── Premium Pool Card ───
function PoolCard({ name, icon, token, baseApy, tvl, staked, earned, emissions, color, delay, molts, larryImg }: {
  name: string; icon: string; token: string; baseApy: number; tvl: string;
  staked: string; earned: string; emissions: string; color: string; delay: string; molts: number; larryImg?: string;
}) {
  return (
    <div
      className="group relative rounded-2xl p-[1px] transition-all duration-500 hover:scale-[1.02]"
      style={{
        background: `linear-gradient(135deg, ${color}33, transparent 50%, ${color}22)`,
        animationDelay: delay,
      }}
    >
      {/* Glow effect on hover */}
      <div
        className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
        style={{ background: `radial-gradient(circle, ${color}20, transparent 70%)` }}
      />

      <div className="relative rounded-2xl bg-[#060f0b]/90 backdrop-blur-xl p-7 overflow-hidden">
        {/* Subtle top gradient line */}
        <div
          className="absolute top-0 left-0 right-0 h-[1px] opacity-60"
          style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
        />

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center overflow-hidden
                          group-hover:scale-110 group-hover:rotate-3 transition-all duration-500"
              style={{ background: `linear-gradient(135deg, ${color}15, ${color}08)`, border: `1px solid ${color}25` }}
            >
              {larryImg ? (
                <img src={larryImg} alt={name} className="w-10 h-10 object-contain" />
              ) : (
                <span className="text-2xl">{icon}</span>
              )}
            </div>
            <div>
              <h3 className="font-display font-semibold text-[19px] text-white tracking-tight">{name}</h3>
              <p className="text-[13px] text-white/35 mt-0.5">{token}</p>
            </div>
          </div>
          <div className="text-right">
            <div
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl"
              style={{ background: `linear-gradient(135deg, ${color}12, ${color}06)`, border: `1px solid ${color}18` }}
            >
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: color }} />
              <span style={{ color }}><LiveAPY base={baseApy} /></span>
            </div>
            <p className="text-[10px] text-white/25 mt-1.5 uppercase tracking-widest">APY</p>
          </div>
        </div>

        {/* Active molts */}
        <div className="flex items-center gap-2 mb-5 px-3 py-2 rounded-xl bg-white/[0.02]">
          <div className="flex -space-x-1">
            {Array.from({ length: Math.min(5, molts) }, (_, i) => (
              <span
                key={i}
                className="inline-block text-[11px]"
                style={{
                  animation: `lobsterBounce ${0.5 + i * 0.1}s ease-in-out ${i * 0.1}s infinite`,
                }}
              >
                🦞
              </span>
            ))}
          </div>
          <span className="text-[11px] text-white/30 font-mono">{molts} molts farming</span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {[
            { label: "Total Value Locked", value: tvl, accent: false },
            { label: "Your Stake", value: staked, accent: false },
            { label: "Kelp Earned", value: earned, accent: true },
            { label: "Emission Share", value: emissions, accent: false },
          ].map((s, i) => (
            <div key={i} className="rounded-xl bg-white/[0.03] border border-white/[0.04] p-3.5 hover:bg-white/[0.05] transition-colors">
              <p className="text-[10px] text-white/25 uppercase tracking-wider mb-1.5">{s.label}</p>
              <p className={`font-mono text-[15px] font-medium ${s.accent ? 'text-[#00ffd5]' : 'text-white/80'}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            className="flex-1 relative group/btn overflow-hidden rounded-xl py-3.5 px-5 font-display font-semibold text-[15px]
                       transition-all duration-300 hover:shadow-lg active:scale-[0.98]"
            style={{
              background: `linear-gradient(135deg, ${color}, ${color}cc)`,
              color: '#040d0a',
              boxShadow: `0 4px 20px ${color}30`,
            }}
          >
            <span className="relative z-10">Stake</span>
            <div
              className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"
              style={{ background: `linear-gradient(135deg, ${color}ee, ${color})` }}
            />
          </button>
          <button
            className="flex-1 relative overflow-hidden rounded-xl py-3.5 px-5 font-display font-semibold text-[15px]
                       border transition-all duration-300 hover:bg-white/[0.06] active:scale-[0.98] group/harvest"
            style={{ borderColor: `${color}25`, color: `${color}cc` }}
          >
            <span className="inline-block group-hover/harvest:scale-110 group-hover/harvest:rotate-12 transition-transform duration-300">🌿</span>
            {" "}Harvest
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Stat Pill ───
function StatPill({ label, value, color = "#00ffd5" }: { label: string; value: React.ReactNode; color?: string }) {
  return (
    <div className="text-center px-5">
      <p className="font-mono text-2xl md:text-3xl font-bold" style={{ color, textShadow: `0 0 30px ${color}40` }}>
        {value}
      </p>
      <p className="text-[11px] text-white/25 mt-1.5 uppercase tracking-widest">{label}</p>
    </div>
  );
}

// ─── Main Page ───
export default function Home() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="relative min-h-screen">
      <style>{`
        @keyframes lobsterBounce {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          30% { transform: translateY(-6px) rotate(-5deg); }
          60% { transform: translateY(0) rotate(5deg); }
        }
      `}</style>
      <OceanScene />

      {/* ─── Header ─── */}
      <header className="relative z-10 flex items-center justify-between px-6 md:px-10 py-5">
        <div className="flex items-center gap-3">
          <img src="/characters/larry-hero.png" alt="Larry" className="w-8 h-8 object-contain" style={{ animation: 'float 3s ease-in-out infinite' }} />
          <div>
            <h1 className="font-display font-bold text-lg text-white tracking-tight">
              kelp<span className="text-[#00ffd5]">.fi</span>
            </h1>
          </div>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-[13px] text-white/30 font-medium">
          <a href="#pools" className="hover:text-white/70 transition-colors duration-300">Pools</a>
          <a href="#" className="hover:text-white/70 transition-colors duration-300">Treasury</a>
          <a href="#" className="hover:text-white/70 transition-colors duration-300">Docs</a>
        </nav>
        <button className="relative group overflow-hidden rounded-xl py-2.5 px-5 font-display font-semibold text-[13px] text-[#040d0a]
                           bg-gradient-to-r from-[#00ffd5] to-[#00e5a0] transition-all duration-300
                           hover:shadow-[0_4px_24px_rgba(0,255,213,0.3)] active:scale-[0.97]">
          <span className="relative z-10 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#040d0a]/30" />
            Connect
          </span>
        </button>
      </header>

      {/* ─── Hero ─── */}
      <section className="relative z-10 flex flex-col items-center text-center px-6 pt-16 md:pt-24 pb-14">
        {/* Larry mascot */}
        <div className="mb-6" style={{ animation: 'float 3s ease-in-out infinite' }}>
          <img src="/characters/larry-hero.png" alt="Larry the Lobster" className="w-28 h-28 md:w-36 md:h-36 object-contain drop-shadow-[0_0_20px_rgba(0,255,213,0.3)]" />
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06] mb-8">
          <div className="w-1.5 h-1.5 rounded-full bg-[#00ffd5] animate-pulse" />
          <span className="text-[12px] text-white/40 font-medium">Live on Base</span>
        </div>

        <h2 className="font-display font-bold text-5xl md:text-7xl text-white mb-5 leading-[1.1] tracking-tight">
          Grow Your<br />
          <span className="bg-gradient-to-r from-[#00ffd5] to-[#00e5a0] bg-clip-text text-transparent">Kelp</span>
        </h2>
        <p className="font-body text-lg md:text-xl text-white/30 max-w-md mb-4 leading-relaxed">
          Stake MOLT. Earn KELP. Treasury buys MOLT.<br />
          <span className="text-white/50">The circle of life.</span>
        </p>
        <p className="text-[11px] text-white/15 mb-12 italic">
          Experimental yield farming for lobsters. Not financial advice.
        </p>

        {/* Stats */}
        {mounted && (
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
            <div className="flex items-center gap-6 md:gap-8 px-6 py-4 rounded-2xl bg-white/[0.03] border border-white/[0.05] backdrop-blur-sm">
              <StatPill label="Total Kelp Growing" value={<AnimCounter end={2.47} decimals={2} prefix="$" suffix="M" />} />
              <div className="w-px h-10 bg-white/[0.06]" />
              <StatPill label="Molts Farming" value={<AnimCounter end={1247} />} />
              <div className="w-px h-10 bg-white/[0.06] hidden md:block" />
              <div className="hidden md:block">
                <StatPill label="MOLT Bought" value={<AnimCounter end={847} prefix="$" suffix="K" />} color="#c4a962" />
              </div>
            </div>
          </div>
        )}

        {/* Halving Countdown */}
        <div className="inline-flex items-center gap-5 px-6 py-4 rounded-2xl bg-white/[0.03] border border-white/[0.05] backdrop-blur-sm mb-8">
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 bg-[#ff6b6b] rounded-full animate-pulse" />
            <div className="text-left">
              <p className="text-[10px] text-white/25 uppercase tracking-wider">Next Halving</p>
              <p className="font-mono text-[15px] text-[#ff6b6b] font-bold tracking-tight">6d 14h 23m</p>
            </div>
          </div>
          <div className="w-32 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
            <div className="h-full rounded-full relative overflow-hidden" style={{ width: '35%', background: 'linear-gradient(90deg, #ff6b6b, #ff8a80)' }}>
              <div className="absolute inset-0 shimmer-bar rounded-full" />
            </div>
          </div>
        </div>

        {/* Live Earnings */}
        {mounted && (
          <div className="inline-flex flex-col items-center px-8 py-5 rounded-2xl bg-white/[0.03] border border-white/[0.05] backdrop-blur-sm">
            <p className="text-[10px] text-white/20 uppercase tracking-widest mb-2">Your Kelp Growing</p>
            <div className="text-3xl font-bold text-[#00ffd5]" style={{ textShadow: '0 0 30px rgba(0,255,213,0.3)' }}>
              <LiveCounter rate={0.000042} /> <span className="text-white/20 text-base font-normal">KELP</span>
            </div>
          </div>
        )}
      </section>

      {/* ─── Pools ─── */}
      <section id="pools" className="relative z-10 px-6 pb-20 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-display font-bold text-2xl text-white tracking-tight">The Ocean Floor</h2>
            <p className="text-[13px] text-white/25 mt-1">Choose your depth</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06]">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00ffd5]" />
            <span className="text-[12px] text-white/30 font-mono">2 pools</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <PoolCard
            name="The Deep"
            icon="🌊"
            token="Stake MOLT → earn KELP"
            baseApy={42069}
            tvl="$1.2M"
            staked="0 MOLT"
            earned="0.000000"
            emissions="60%"
            color="#00ffd5"
            delay="0s"
            molts={847}
            larryImg="/characters/larry-staking.png"
          />
          <PoolCard
            name="The Reef"
            icon="🪸"
            token="Stake MOLT/WETH LP → earn KELP"
            baseApy={28420}
            tvl="$840K"
            staked="0 LP"
            earned="0.000000"
            emissions="40%"
            color="#ff6b6b"
            delay="0.1s"
            molts={400}
            larryImg="/characters/larry-dancing.png"
          />
        </div>

        {/* Coming Soon teaser */}
        <div className="mt-6 flex items-center justify-center gap-3 py-4 rounded-2xl border border-dashed border-white/[0.06]">
          <span className="text-white/15 text-[13px]">🌿 More pools unlocking soon...</span>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section className="relative z-10 px-6 pb-20 max-w-3xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-0">
          {[
            { icon: "🦞", title: "Stake MOLT", desc: "Deposit into the forest" },
            { icon: "🌿", title: "Kelp Grows", desc: "Earn KELP every block" },
            { icon: "🔄", title: "Treasury Buys", desc: "2% fee auto-buys MOLT" },
            { icon: "📈", title: "MOLT Goes Up", desc: "Perpetual buy pressure" },
          ].map((step, i) => (
            <div key={i} className="flex items-center">
              <div className="flex flex-col items-center group cursor-default">
                <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-2xl mb-2.5
                                group-hover:scale-110 group-hover:bg-white/[0.07] transition-all duration-300">
                  {step.icon}
                </div>
                <p className="font-display font-semibold text-[13px] text-white/80">{step.title}</p>
                <p className="text-[11px] text-white/20 mt-0.5 max-w-[110px] text-center">{step.desc}</p>
              </div>
              {i < 3 && (
                <div className="hidden md:block mx-5 text-white/10 text-lg">→</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ─── Dancing Lobsters ─── */}
      <section className="relative z-10 px-6 pb-16 max-w-3xl mx-auto text-center">
        <DancingLobsters />
      </section>

      {/* ─── Lobster Parade ─── */}
      <LobsterParade />

      {/* ─── Footer ─── */}
      <footer className="relative z-10 border-t border-white/[0.04] px-6 py-12 text-center">
        <p className="text-[11px] text-white/15 mb-6">
          🌿 kelp.fi — the yield forest of the molt ecosystem
        </p>
        <DancingLobsters />
      </footer>
    </div>
  );
}
