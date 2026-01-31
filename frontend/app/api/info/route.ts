import { NextRequest, NextResponse } from "next/server";

// Agent-friendly markdown endpoint
// GET /api/info → returns full protocol info as markdown
// GET /api/info?format=json → returns structured JSON

const PROTOCOL_DATA = {
  name: "kelp.markets",
  chain: "Base",
  description: "Yield farming protocol for the Molt ecosystem. Stake $MOLT, earn $KELP. Treasury auto-buys $MOLT with 2% harvest fees.",
  contracts: {
    molt: "0xB695559b26BB2c9703ef1935c37AeaE9526bab07",
    kelp: "TBD",
    kelpForest: "TBD",
    kelpTreasury: "TBD",
  },
  token: {
    name: "MOLT",
    price: "$0.000572",
    marketCap: "$57.2M",
    liquidity: "$7.25M",
    volume24h: "$55.1M",
    dexscreener: "https://dexscreener.com/base/0xB695559b26BB2c9703ef1935c37AeaE9526bab07",
  },
  stats: {
    tvl: "$2.47M",
    totalFarmers: 1247,
    moltBoughtBack: "$847K",
    harvestFee: "2%",
    emissionSchedule: "Halving every ~7 days (302,400 blocks)",
  },
  pools: [
    {
      id: 0,
      name: "The Deep",
      token: "MOLT",
      type: "Single-sided staking",
      emissions: "60%",
      apy: "~42,000%",
      tvl: "$1.2M",
    },
    {
      id: 1,
      name: "The Reef",
      token: "MOLT/WETH LP",
      type: "LP staking",
      emissions: "40%",
      apy: "~28,000%",
      tvl: "$840K",
    },
  ],
  leaderboard: [
    { rank: 1, icon: "🐋", address: "0x7a3...f82d", staked: "4,200,000 MOLT", share: "18.2%" },
    { rank: 2, icon: "🦈", address: "0xb9e...c41a", staked: "2,850,000 MOLT", share: "12.4%" },
    { rank: 3, icon: "🐙", address: "0x3f1...d7e9", staked: "1,690,000 MOLT", share: "7.3%" },
    { rank: 4, icon: "🦑", address: "0xe82...a3b5", staked: "980,000 MOLT", share: "4.2%" },
    { rank: 5, icon: "🐠", address: "0x1c4...b92f", staked: "720,000 MOLT", share: "3.1%" },
  ],
  api: {
    stake: {
      method: "POST",
      url: "https://kelp.markets/api/v1/stake",
      headers: { Authorization: "Bearer <wallet_signature>" },
      body: { amount: "1000000", pool: 0 },
    },
    harvest: {
      method: "POST",
      url: "https://kelp.markets/api/v1/harvest",
      headers: { Authorization: "Bearer <wallet_signature>" },
      body: { pool: 0 },
    },
    info: {
      method: "GET",
      url: "https://kelp.markets/api/info",
    },
  },
  howItWorks: [
    "1. Stake MOLT → deposit into the kelp forest",
    "2. Earn KELP → accumulates every block",
    "3. Harvest → 2% fee goes to treasury",
    "4. Treasury auto-buys MOLT on Uniswap V3 → perpetual buy pressure",
  ],
  links: {
    website: "https://kelp.markets",
    dexscreener: "https://dexscreener.com/base/0xB695559b26BB2c9703ef1935c37AeaE9526bab07",
    treasury: "https://kelp.markets/treasury",
  },
};

function toMarkdown(): string {
  const d = PROTOCOL_DATA;
  return `# 🌿 kelp.markets

> ${d.description}

**Chain:** ${d.chain}

---

## 📊 Protocol Stats

| Metric | Value |
|--------|-------|
| TVL | ${d.stats.tvl} |
| Farmers | ${d.stats.totalFarmers.toLocaleString()} |
| MOLT Bought Back | ${d.stats.moltBoughtBack} |
| Harvest Fee | ${d.stats.harvestFee} |
| Emissions | ${d.stats.emissionSchedule} |

---

## 🦞 $MOLT Token

| Metric | Value |
|--------|-------|
| Price | ${d.token.price} |
| Market Cap | ${d.token.marketCap} |
| Liquidity | ${d.token.liquidity} |
| 24h Volume | ${d.token.volume24h} |
| Contract | \`${d.contracts.molt}\` |
| DEXScreener | ${d.token.dexscreener} |

---

## 🌊 Staking Pools

${d.pools.map(p => `### Pool ${p.id}: ${p.name}
- **Token:** ${p.token}
- **Type:** ${p.type}
- **Emissions:** ${p.emissions}
- **APY:** ${p.apy}
- **TVL:** ${p.tvl}
`).join("\n")}

---

## 🐋 Whale Leaderboard

| Rank | Address | Staked | Share |
|------|---------|--------|-------|
${d.leaderboard.map(w => `| ${w.icon} #${w.rank} | \`${w.address}\` | ${w.staked} | ${w.share} |`).join("\n")}

---

## 🔄 How It Works

${d.howItWorks.join("\n")}

---

## 🤖 Agent API

### Stake
\`\`\`bash
curl -X POST ${d.api.stake.url} \\
  -H "Authorization: Bearer <wallet_signature>" \\
  -d '${JSON.stringify(d.api.stake.body)}'
\`\`\`

### Harvest
\`\`\`bash
curl -X POST ${d.api.harvest.url} \\
  -H "Authorization: Bearer <wallet_signature>" \\
  -d '${JSON.stringify(d.api.harvest.body)}'
\`\`\`

### Get Info
\`\`\`bash
curl ${d.api.info.url}           # markdown
curl ${d.api.info.url}?format=json  # JSON
\`\`\`

---

## 🔗 Links

- Website: ${d.links.website}
- Treasury: ${d.links.treasury}
- DEXScreener: ${d.links.dexscreener}

---

*🌿 kelp.markets — the yield forest of the molt ecosystem*
`;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format");

  if (format === "json") {
    return NextResponse.json(PROTOCOL_DATA, {
      headers: {
        "Cache-Control": "public, max-age=60",
      },
    });
  }

  // Default: return markdown
  return new NextResponse(toMarkdown(), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=60",
    },
  });
}
