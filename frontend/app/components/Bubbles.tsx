"use client";

export default function Bubbles() {
  // Generate a set of bubbles with varying positions, sizes, and delays
  const bubbles = [
    { left: "5%", size: 6, delay: 0, duration: 10 },
    { left: "12%", size: 4, delay: 2, duration: 12 },
    { left: "20%", size: 8, delay: 5, duration: 9 },
    { left: "30%", size: 3, delay: 1, duration: 14 },
    { left: "42%", size: 5, delay: 7, duration: 11 },
    { left: "55%", size: 7, delay: 3, duration: 8 },
    { left: "65%", size: 4, delay: 9, duration: 13 },
    { left: "72%", size: 6, delay: 4, duration: 10 },
    { left: "80%", size: 3, delay: 6, duration: 15 },
    { left: "88%", size: 5, delay: 8, duration: 11 },
    { left: "93%", size: 4, delay: 2, duration: 12 },
    { left: "48%", size: 3, delay: 11, duration: 16 },
  ];

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {bubbles.map((b, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: b.left,
            bottom: "-20px",
            width: b.size,
            height: b.size,
            background: `radial-gradient(circle at 30% 30%, rgba(0, 255, 213, 0.4), rgba(0, 255, 213, 0.1))`,
            animation: `bubble-rise ${b.duration}s ease-in ${b.delay}s infinite`,
            boxShadow: "inset 0 -2px 4px rgba(0,255,213,0.1)",
          }}
        />
      ))}
    </div>
  );
}
