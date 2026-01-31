"use client";

export default function LobsterMascot() {
  return (
    <span
      className="inline-block ml-1 text-lg cursor-pointer select-none"
      style={{
        animation: "lobster-idle 3s ease-in-out infinite",
      }}
      title="Larry the Lobster says hi!"
    >
      🦞
    </span>
  );
}
