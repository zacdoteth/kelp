"use client";

import { useState } from "react";
import TickingNumber from "./TickingNumber";

export interface PoolData {
  id: number;
  name: string;
  subtitle: string;
  icon: string;
  token: string;
  emissions: string;
  apy: number;
  staked: number;
  stakedUsd: number;
  pendingKelp: number;
  kelpPerDay: number;
  color: string;
}

interface PoolCardProps {
  pool: PoolData;
  index: number;
}

export default function PoolCard({ pool, index }: PoolCardProps) {
  const [stakeAmount, setStakeAmount] = useState("");
  const [activeTab, setActiveTab] = useState<"stake" | "unstake">("stake");

  return (
    <div
      className={`glass-card p-6 animate-fade-in-up`}
      style={{ animationDelay: `${index * 0.15}s`, animationFillMode: "both" }}
    >
      {/* Pool Header */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
            style={{
              background: `linear-gradient(135deg, ${pool.color}22, ${pool.color}11)`,
              border: `1px solid ${pool.color}33`,
            }}
          >
            {pool.icon}
          </div>
          <div>
            <h3
              className="text-lg font-semibold text-white"
              style={{ fontFamily: "var(--font-fredoka)" }}
            >
              {pool.name}
            </h3>
            <p className="text-xs text-white/40">{pool.subtitle}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-white/40 uppercase tracking-wider">APY</div>
          <div
            className="text-xl font-bold number-glow"
            style={{ fontFamily: "var(--font-fredoka)", color: pool.color }}
          >
            {pool.apy.toLocaleString()}%
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-white/[0.02] rounded-xl p-3">
          <div className="text-[10px] uppercase tracking-wider text-white/30 mb-0.5">
            Your Stake
          </div>
          <div className="text-sm font-bold text-white">
            {pool.staked.toLocaleString()} {pool.token}
          </div>
          <div className="text-[10px] text-white/30">
            ≈ ${pool.stakedUsd.toLocaleString()}
          </div>
        </div>
        <div className="bg-white/[0.02] rounded-xl p-3">
          <div className="text-[10px] uppercase tracking-wider text-white/30 mb-0.5">
            Pending KELP
          </div>
          <div className="text-sm font-bold text-cyan-glow">
            <TickingNumber
              value={pool.pendingKelp}
              increment={pool.kelpPerDay / 86400}
              intervalMs={1000}
              decimals={4}
              glow
            />
          </div>
          <div className="text-[10px] text-white/30">
            {pool.kelpPerDay.toLocaleString()} / day
          </div>
        </div>
      </div>

      {/* Emissions badge */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-[10px] uppercase tracking-wider text-white/30">Emissions:</span>
        <span
          className="text-xs px-2 py-0.5 rounded-full font-medium"
          style={{
            background: `${pool.color}15`,
            color: pool.color,
            border: `1px solid ${pool.color}30`,
          }}
        >
          {pool.emissions}
        </span>
      </div>

      {/* Stake/Unstake Tabs */}
      <div className="flex gap-1 mb-3 bg-white/[0.03] rounded-xl p-1">
        <button
          onClick={() => setActiveTab("stake")}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
            activeTab === "stake"
              ? "bg-cyan-glow/15 text-cyan-glow"
              : "text-white/40 hover:text-white/60"
          }`}
          style={{ fontFamily: "var(--font-fredoka)" }}
        >
          Stake
        </button>
        <button
          onClick={() => setActiveTab("unstake")}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
            activeTab === "unstake"
              ? "bg-coral/15 text-coral"
              : "text-white/40 hover:text-white/60"
          }`}
          style={{ fontFamily: "var(--font-fredoka)" }}
        >
          Unstake
        </button>
      </div>

      {/* Input */}
      <div className="relative mb-3">
        <input
          type="text"
          placeholder="0.0"
          value={stakeAmount}
          onChange={(e) => setStakeAmount(e.target.value)}
          className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-cyan-glow/30 transition-colors"
        />
        <button
          className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] uppercase tracking-wider px-2 py-1 rounded-lg bg-cyan-glow/10 text-cyan-glow hover:bg-cyan-glow/20 transition-colors"
          onClick={() => setStakeAmount("1000")}
        >
          Max
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${
            activeTab === "stake"
              ? "btn-primary"
              : "bg-coral/20 text-coral hover:bg-coral/30"
          }`}
          style={{ fontFamily: "var(--font-fredoka)" }}
        >
          {activeTab === "stake" ? "Stake" : "Unstake"} {pool.token}
        </button>
        <button className="btn-harvest flex items-center gap-2 group">
          <span
            className="harvest-icon inline-block transition-all duration-300"
            role="img"
            aria-label="harvest"
          >
            🌿
          </span>
          <span>Harvest</span>
        </button>
      </div>
    </div>
  );
}
