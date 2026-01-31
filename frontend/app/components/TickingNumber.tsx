"use client";

import { useState, useEffect, useRef } from "react";

interface TickingNumberProps {
  value: number;
  increment?: number;
  intervalMs?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  glow?: boolean;
}

export default function TickingNumber({
  value,
  increment = 0,
  intervalMs = 1000,
  decimals = 2,
  prefix = "",
  suffix = "",
  className = "",
  glow = false,
}: TickingNumberProps) {
  const [current, setCurrent] = useState(value);
  const [flash, setFlash] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setCurrent(value);
  }, [value]);

  useEffect(() => {
    if (increment <= 0) return;

    intervalRef.current = setInterval(() => {
      setCurrent((prev) => {
        const next = prev + increment;
        setFlash(true);
        setTimeout(() => setFlash(false), 300);
        return next;
      });
    }, intervalMs);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [increment, intervalMs]);

  const formatted = current.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span
      className={`tabular-nums transition-colors duration-300 ${
        flash ? "text-cyan-glow" : ""
      } ${glow ? "number-glow" : ""} ${className}`}
    >
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
