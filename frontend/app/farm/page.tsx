"use client";

import PoolCard, { PoolData } from "../components/PoolCard";
import StatsBar from "../components/StatsBar";
import EmissionTimer from "../components/EmissionTimer";
import KelpStrands from "../components/KelpStrands";

const pools: PoolData[] = [
  {
    id: 0,
    name: "The Deep",
    subtitle: "Stake MOLT, earn KELP",
    icon: "🌊",
    token: "MOLT",
    emissions: "40%",
    apy: 1247,
    staked: 45000,
    stakedUsd: 12450,
    pendingKelp: 142.8734,
    kelpPerDay: 23.45,
    color: "#00ffd5",
  },
  {
    id: 1,
    name: "The Reef",
    subtitle: "Stake MOLT/WETH LP",
    icon: "🪸",
    token: "MOLT/WETH LP",
    emissions: "35%",
    apy: 892,
    staked: 12.45,
    stakedUsd: 8930,
    pendingKelp: 87.2341,
    kelpPerDay: 18.92,
    color: "#ff6b6b",
  },
  {
    id: 2,
    name: "The Nursery",
    subtitle: "Stake KELP/WETH LP",
    icon: "🌱",
    token: "KELP/WETH LP",
    emissions: "20%",
    apy: 534,
    staked: 8.21,
    stakedUsd: 5120,
    pendingKelp: 34.1092,
    kelpPerDay: 10.82,
    color: "#c4a962",
  },
  {
    id: 3,
    name: "The Tide Pool",
    subtitle: "Agent tokens",
    icon: "🫧",
    token: "AGENT",
    emissions: "5%",
    apy: 156,
    staked: 25000,
    stakedUsd: 2100,
    pendingKelp: 8.4521,
    kelpPerDay: 2.71,
    color: "#00e5bf",
  },
];

export default function FarmPage() {
  return (
    <div className="relative min-h-screen pt-28 pb-20 px-4">
      {/* Background kelp */}
      <KelpStrands count={6} side="both" className="h-[40vh] opacity-20" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Page Header */}
        <div className="text-center mb-8 animate-fade-in-up">
          <h1
            className="text-4xl md:text-5xl font-bold text-white mb-3"
            style={{ fontFamily: "var(--font-fredoka)" }}
          >
            The Kelp <span className="gradient-text">Forest</span>
          </h1>
          <p className="text-white/40 max-w-lg mx-auto">
            Choose your depth. Stake your tokens. Watch your kelp grow.{" "}
            <span className="text-cyan-glow/50">The deeper you go, the more you earn.</span>
          </p>
        </div>

        {/* Stats Bar */}
        <div className="mb-6 animate-fade-in-up-delay-1">
          <StatsBar />
        </div>

        {/* Emission Timer */}
        <div className="mb-8 animate-fade-in-up-delay-2">
          <EmissionTimer />
        </div>

        {/* Pool Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pools.map((pool, i) => (
            <PoolCard key={pool.id} pool={pool} index={i} />
          ))}
        </div>

        {/* Bottom Info */}
        <div className="mt-10 text-center">
          <div className="glass-card-static inline-block px-6 py-3">
            <p className="text-xs text-white/30">
              🌿 Harvest fee: <span className="text-cyan-glow/60">2%</span> → Treasury → MOLT buyback
              &nbsp;·&nbsp;
              Emissions halve weekly
              &nbsp;·&nbsp;
              <span className="text-kelp-gold/60">Farm early, farm often</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
