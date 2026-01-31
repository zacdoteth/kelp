"use client";

import { useState } from "react";

export default function WalletButton() {
  const [connected, setConnected] = useState(false);

  if (connected) {
    return (
      <button
        onClick={() => setConnected(false)}
        className="btn-secondary text-sm flex items-center gap-2"
      >
        <div className="w-2 h-2 rounded-full bg-cyan-glow" />
        <span>0x1a2b...3c4d</span>
      </button>
    );
  }

  return (
    <button
      onClick={() => setConnected(true)}
      className="btn-primary text-sm"
    >
      Connect Wallet
    </button>
  );
}
