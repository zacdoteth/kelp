import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KelpFi — Grow Your Kelp 🌿",
  description: "The yield forest of the Molt ecosystem. Stake MOLT. Grow kelp. This is the circle of life.",
  icons: { icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌿</text></svg>" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="font-body bg-ocean-950 text-white antialiased min-h-screen overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
