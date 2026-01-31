"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import WalletButton from "./WalletButton";
import LobsterMascot from "./LobsterMascot";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/farm", label: "Farm" },
  { href: "/treasury", label: "Treasury" },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="glass-card-static mx-4 mt-4 px-6 py-3 flex items-center justify-between"
        style={{ borderRadius: 16 }}>
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-2xl" role="img" aria-label="kelp">🌿</span>
          <span
            className="text-xl font-semibold tracking-tight"
            style={{ fontFamily: "var(--font-fredoka)" }}
          >
            <span className="text-cyan-glow">Kelp</span>
            <span className="text-kelp-gold">Fi</span>
          </span>
          <LobsterMascot />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? "bg-cyan-glow/10 text-cyan-glow"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
                style={{ fontFamily: "var(--font-fredoka)" }}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyan-glow/5 border border-cyan-glow/10">
            <div className="w-2 h-2 rounded-full bg-cyan-glow animate-[glow-pulse_3s_ease-in-out_infinite]" />
            <span className="text-xs text-cyan-glow/80" style={{ fontFamily: "var(--font-fredoka)" }}>
              Base
            </span>
          </div>
          <WalletButton />
          
          {/* Mobile hamburger */}
          <button 
            className="md:hidden flex flex-col gap-1 p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <span className={`w-5 h-0.5 bg-white/60 transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
            <span className={`w-5 h-0.5 bg-white/60 transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
            <span className={`w-5 h-0.5 bg-white/60 transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden glass-card-static mx-4 mt-2 p-4 animate-fade-in-up">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-cyan-glow/10 text-cyan-glow"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                  style={{ fontFamily: "var(--font-fredoka)" }}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
