import type { Metadata, Viewport } from "next";
import { Fredoka, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// ─── Font Loading (next/font = zero layout shift, self-hosted, display:swap) ───
const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
  preload: true,
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
  preload: true,
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "kelp.markets — Stake $MOLT, Earn $KELP 🌿",
  description:
    "The yield forest of the Molt ecosystem. Single-sided staking on Base. Treasury auto-buys $MOLT every harvest.",
  metadataBase: new URL("https://kelp.markets"),
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌿</text></svg>",
  },
  openGraph: {
    title: "kelp.markets — Stake $MOLT, Earn $KELP",
    description:
      "Single-sided staking on Base. Treasury auto-buys $MOLT every harvest. The yield forest of the Molt ecosystem.",
    type: "website",
    url: "https://kelp.markets",
    siteName: "kelp.markets",
  },
  twitter: {
    card: "summary_large_image",
    title: "kelp.markets — Stake $MOLT, Earn $KELP 🌿",
    description: "The yield forest of the Molt ecosystem. Single-sided staking on Base.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#040a1a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`dark ${fredoka.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        {/* DNS prefetch for any external API calls */}
        <link rel="dns-prefetch" href="https://dexscreener.com" />
        {/* Preload critical hero image */}
        <link
          rel="preload"
          href="/characters/larry-hero.png"
          as="image"
          type="image/png"
        />
      </head>
      <body className="font-body antialiased min-h-screen overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
