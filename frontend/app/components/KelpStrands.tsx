"use client";

interface KelpStrandsProps {
  count?: number;
  side?: "left" | "right" | "both";
  className?: string;
}

export default function KelpStrands({ count = 6, side = "both", className = "" }: KelpStrandsProps) {
  const strands = Array.from({ length: count }, (_, i) => {
    const isLeft = side === "left" || (side === "both" && i < count / 2);
    const baseLeft = isLeft ? 2 + (i * 6) : 60 + (i * 6);
    const height = 100 + Math.random() * 200;
    const delay = Math.random() * 3;
    const duration = 5 + Math.random() * 4;

    return { id: i, left: baseLeft, height, delay, duration };
  });

  return (
    <div className={`absolute bottom-0 left-0 right-0 pointer-events-none overflow-hidden ${className}`} aria-hidden="true">
      {strands.map((s) => (
        <div
          key={s.id}
          className="absolute bottom-0"
          style={{
            left: `${s.left}%`,
            width: 4,
            height: s.height,
            background: `linear-gradient(to top, #134e3a, rgba(0, 229, 191, 0.15))`,
            borderRadius: "2px 2px 0 0",
            transformOrigin: "bottom center",
            animation: `kelp-sway ${s.duration}s ease-in-out ${s.delay}s infinite`,
          }}
        >
          {/* Kelp leaves */}
          {[0.3, 0.5, 0.7].map((pos, li) => (
            <div
              key={li}
              style={{
                position: "absolute",
                bottom: `${pos * 100}%`,
                left: li % 2 === 0 ? 4 : -18,
                width: 22,
                height: 10,
                background: `radial-gradient(ellipse, rgba(26, 107, 80, 0.6), rgba(19, 78, 58, 0.3))`,
                borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
                transform: li % 2 === 0 ? "rotate(-10deg)" : "rotate(10deg) scaleX(-1)",
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
