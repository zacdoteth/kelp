"use client";

import { useState } from "react";
import TickingNumber from "../components/TickingNumber";
import KelpStrands from "../components/KelpStrands";

const buybackHistory = [
  { id: 1, date: "2025-01-30", moltBought: 45230, kelpFee: 892.4, txHash: "0xa1b2...c3d4", priceImpact: "+2.1%" },
  { id: 2, date: "2025-01-29", moltBought: 38100, kelpFee: 751.2, txHash: "0xe5f6...g7h8", priceImpact: "+1.8%" },
  { id: 3, date: "2025-01-28", moltBought: 52890, kelpFee: 1042.7, txHash: "0xi9j0...k1l2", priceImpact: "+2.5%" },
  { id: 4, date: "2025-01-27", moltBought: 29450, kelpFee: 580.9, txHash: "0xm3n4...o5p6", priceImpact: "+1.3%" },
  { id: 5, date: "2025-01-26", moltBought: 41200, kelpFee: 812.3, txHash: "0xq7r8...s9t0", priceImpact: "+1.9%" },
  { id: 6, date: "2025-01-25", moltBought: 67800, kelpFee: 1337.1, txHash: "0xu1v2...w3x4", priceImpact: "+3.2%" },
  { id: 7, date: "2025-01-24", moltBought: 33500, kelpFee: 660.8, txHash: "0xy5z6...a7b8", priceImpact: "+1.5%" },
];

export default function TreasuryPage() {
  const [showAll, setShowAll] = useState(false);
  const displayed = showAll ? buybackHistory : buybackHistory.slice(0, 5);

  const totalMoltBought = buybackHistory.reduce((sum, b) => sum + b.moltBought, 0);
  const totalKelpFees = buybackHistory.reduce((sum, b) => sum + b.kelpFee, 0);

  return (
    <div className="relative min-h-screen pt-28 pb-20 px-4">
      {/* Background kelp */}
      <KelpStrands count={4} side="left" className="h-[30vh] opacity-15" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Page Header */}
        <div className="text-center mb-10 animate-fade-in-up">
          <h1
            className="text-4xl md:text-5xl font-bold text-white mb-3"
            style={{ fontFamily: "var(--font-fredoka)" }}
          >
            The <span className="text-kelp-gold">Treasury</span>
          </h1>
          <p className="text-white/40 max-w-lg mx-auto">
            2% of every harvest goes here. The treasury auto-buys MOLT on Uniswap,{" "}
            <span className="text-kelp-gold/60">creating perpetual buy pressure</span>.
          </p>
        </div>

        {/* Treasury Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* MOLT Bought */}
          <div className="glass-card p-6 text-center animate-fade-in-up-delay-1">
            <div className="text-3xl mb-3">🦞</div>
            <div className="text-xs uppercase tracking-wider text-white/40 mb-2" style={{ fontFamily: "var(--font-fredoka)" }}>
              Total MOLT Bought
            </div>
            <div className="text-3xl font-bold text-coral" style={{ fontFamily: "var(--font-fredoka)" }}>
              <TickingNumber
                value={totalMoltBought}
                increment={2.3}
                decimals={0}
                glow
              />
            </div>
            <div className="text-xs text-white/30 mt-1">
              ≈ ${(totalMoltBought * 0.28).toLocaleString(undefined, { maximumFractionDigits: 0 })} USD
            </div>
          </div>

          {/* KELP Fees Collected */}
          <div className="glass-card p-6 text-center animate-fade-in-up-delay-2">
            <div className="text-3xl mb-3">🌿</div>
            <div className="text-xs uppercase tracking-wider text-white/40 mb-2" style={{ fontFamily: "var(--font-fredoka)" }}>
              KELP Fees Collected
            </div>
            <div className="text-3xl font-bold text-cyan-glow" style={{ fontFamily: "var(--font-fredoka)" }}>
              <TickingNumber
                value={totalKelpFees}
                increment={0.15}
                decimals={1}
                glow
              />
            </div>
            <div className="text-xs text-white/30 mt-1">
              From harvest fees
            </div>
          </div>

          {/* Treasury Balance */}
          <div className="glass-card p-6 text-center animate-fade-in-up-delay-3">
            <div className="text-3xl mb-3">🏦</div>
            <div className="text-xs uppercase tracking-wider text-white/40 mb-2" style={{ fontFamily: "var(--font-fredoka)" }}>
              Treasury Balance
            </div>
            <div className="text-3xl font-bold text-kelp-gold" style={{ fontFamily: "var(--font-fredoka)" }}>
              <TickingNumber
                value={4.82}
                increment={0.0001}
                decimals={4}
                suffix=" ETH"
                glow
              />
            </div>
            <div className="text-xs text-white/30 mt-1">
              Pending next buyback
            </div>
          </div>
        </div>

        {/* Buyback Flywheel Visualization */}
        <div className="glass-card-static p-8 mb-8 animate-fade-in-up-delay-3">
          <h2 className="text-xl font-semibold text-white mb-6 text-center" style={{ fontFamily: "var(--font-fredoka)" }}>
            The <span className="text-cyan-glow">Flywheel</span>
          </h2>
          <div className="flex flex-wrap justify-center items-center gap-3 text-sm">
            {[
              { text: "Stake MOLT", icon: "🦞", color: "text-coral" },
              { text: "→", icon: "", color: "text-white/20" },
              { text: "Earn KELP", icon: "🌿", color: "text-cyan-glow" },
              { text: "→", icon: "", color: "text-white/20" },
              { text: "Harvest (2% fee)", icon: "✂️", color: "text-kelp-gold" },
              { text: "→", icon: "", color: "text-white/20" },
              { text: "Treasury buys MOLT", icon: "🏦", color: "text-coral" },
              { text: "→", icon: "", color: "text-white/20" },
              { text: "MOLT price ↑", icon: "📈", color: "text-cyan-glow" },
              { text: "→", icon: "", color: "text-white/20" },
              { text: "Repeat ♻️", icon: "", color: "text-kelp-gold" },
            ].map((step, i) => (
              <span
                key={i}
                className={`${step.color} font-medium whitespace-nowrap`}
                style={{ fontFamily: "var(--font-fredoka)" }}
              >
                {step.icon} {step.text}
              </span>
            ))}
          </div>
        </div>

        {/* Buyback History */}
        <div className="glass-card-static overflow-hidden animate-fade-in-up-delay-4">
          <div className="px-6 py-4 border-b border-white/5">
            <h2
              className="text-lg font-semibold text-white"
              style={{ fontFamily: "var(--font-fredoka)" }}
            >
              Buyback History
            </h2>
          </div>

          {/* Table - Desktop */}
          <div className="hidden md:block">
            <table className="w-full">
              <thead>
                <tr className="text-xs uppercase tracking-wider text-white/30 border-b border-white/5">
                  <th className="text-left px-6 py-3 font-medium">Date</th>
                  <th className="text-right px-6 py-3 font-medium">MOLT Bought</th>
                  <th className="text-right px-6 py-3 font-medium">KELP Fee</th>
                  <th className="text-right px-6 py-3 font-medium">Price Impact</th>
                  <th className="text-right px-6 py-3 font-medium">Tx</th>
                </tr>
              </thead>
              <tbody>
                {displayed.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-white/60">{row.date}</td>
                    <td className="px-6 py-4 text-sm text-right text-coral font-medium">
                      {row.moltBought.toLocaleString()} MOLT
                    </td>
                    <td className="px-6 py-4 text-sm text-right text-cyan-glow/70">
                      {row.kelpFee.toLocaleString()} KELP
                    </td>
                    <td className="px-6 py-4 text-sm text-right text-green-400">
                      {row.priceImpact}
                    </td>
                    <td className="px-6 py-4 text-sm text-right">
                      <a
                        href="#"
                        className="text-cyan-glow/40 hover:text-cyan-glow transition-colors text-xs font-mono"
                      >
                        {row.txHash}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cards - Mobile */}
          <div className="md:hidden px-4 py-2">
            {displayed.map((row) => (
              <div
                key={row.id}
                className="py-4 border-b border-white/[0.03] last:border-0"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs text-white/40">{row.date}</span>
                  <span className="text-xs text-green-400">{row.priceImpact}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm font-medium text-coral">
                      {row.moltBought.toLocaleString()} MOLT
                    </div>
                    <div className="text-xs text-cyan-glow/50">
                      {row.kelpFee.toLocaleString()} KELP fee
                    </div>
                  </div>
                  <a
                    href="#"
                    className="text-[10px] text-cyan-glow/30 font-mono hover:text-cyan-glow transition-colors"
                  >
                    {row.txHash}
                  </a>
                </div>
              </div>
            ))}
          </div>

          {buybackHistory.length > 5 && (
            <div className="px-6 py-3 border-t border-white/5 text-center">
              <button
                onClick={() => setShowAll(!showAll)}
                className="text-xs text-cyan-glow/50 hover:text-cyan-glow transition-colors"
                style={{ fontFamily: "var(--font-fredoka)" }}
              >
                {showAll ? "Show Less" : `View All (${buybackHistory.length})`}
              </button>
            </div>
          )}
        </div>

        {/* Bottom */}
        <div className="mt-10 text-center">
          <p className="text-xs text-white/20">
            Treasury contract auto-executes buybacks via Uniswap V3 on Base 🌊
          </p>
        </div>
      </div>
    </div>
  );
}
