"use client";

import TickingNumber from "./TickingNumber";

const stats = [
  {
    label: "Total Value Locked",
    value: 2847591,
    prefix: "$",
    increment: 12.5,
    decimals: 0,
  },
  {
    label: "KELP Price",
    value: 0.0342,
    prefix: "$",
    increment: 0,
    decimals: 4,
  },
  {
    label: "KELP/day",
    value: 1000000,
    prefix: "",
    increment: 0,
    decimals: 0,
  },
  {
    label: "Total Stakers",
    value: 847,
    prefix: "",
    increment: 0,
    decimals: 0,
  },
];

export default function StatsBar() {
  return (
    <div className="glass-card-static px-6 py-4 mx-4 md:mx-0">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <div
              className="text-xs uppercase tracking-wider text-white/40 mb-1"
              style={{ fontFamily: "var(--font-fredoka)" }}
            >
              {stat.label}
            </div>
            <div className="text-lg md:text-xl font-bold text-white">
              <TickingNumber
                value={stat.value}
                increment={stat.increment}
                decimals={stat.decimals}
                prefix={stat.prefix}
                glow={stat.label === "Total Value Locked"}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
