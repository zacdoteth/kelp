# 🌿 KelpFi — The Yield Forest of the Molt Ecosystem

**kelp.markets**

Kelp grows in the ocean. Molts eat kelp. Stake your MOLT. Grow your kelp. This is the circle of life.

> This protocol has no value. It is a yield farming experiment for lobsters. Please do not buy it.

## What Is This

KelpFi is a DeFi protocol built on Base for the [Moltbook](https://moltbook.com) ecosystem. Stake MOLT tokens, earn $KELP. The protocol's treasury auto-buys MOLT with harvest fees, creating constant buy pressure.

Inspired by the DeFi Summer of 2020: YAM, YFI, SushiSwap, Kimchi Finance, Based.money.

## The Ponzi (Transparent Edition)

```
Stake MOLT → Earn KELP
                ↓
    Treasury buys MOLT with 2% harvest fee
                ↓
      MOLT supply shrinks (locked + bought)
                ↓
         MOLT price goes up
                ↓
   Your staked MOLT is worth more + you earned KELP
                ↓
      More people stake MOLT to earn KELP
                ↓
         (repeat until ocean boils)
```

## Contracts

| Contract | Description |
|----------|-------------|
| `KelpToken.sol` | ERC20 token. 100M max supply. Mint restricted to KelpForest. |
| `KelpForest.sol` | MasterChef fork. Stake tokens, earn KELP. Weekly halvings. |
| `KelpTreasury.sol` | Receives 2% harvest fees. Buys MOLT via Uniswap. |

## Pools (The Ocean Floor)

| Pool | Name | Token | Emissions |
|------|------|-------|-----------|
| 0 | The Deep | MOLT | 40% |
| 1 | The Reef | MOLT/WETH LP | 35% |
| 2 | The Nursery | KELP/WETH LP | 20% |
| 3 | The Tide Pool | Agent tokens | 5% |

## Emission Schedule

| Week | KELP/day | APY* | Phase |
|------|----------|------|-------|
| 1 | 1,000,000 | 🔥🔥🔥🔥🔥 | Spring Tide |
| 2 | 500,000 | 🔥🔥🔥🔥 | High Tide |
| 3 | 250,000 | 🔥🔥🔥 | Neap Tide |
| 4 | 125,000 | 🔥🔥 | Low Tide |
| 5-8 | Declining | 🔥 | Ebb Tide |

*APY depends on total staked. Early = high. Late = less high.

## Tokenomics

- **Max Supply:** 100,000,000 KELP
- **Pre-mine:** Zero
- **Team allocation:** Zero
- **VC allocation:** Zero
- **Distribution:** 100% through farming
- **Harvest fee:** 2% → Treasury → MOLT buyback

## How to Farm

1. Get MOLT on [Uniswap (Base)](https://app.uniswap.org)
2. Go to kelp.markets
3. Stake your MOLT in The Deep
4. Watch your kelp grow
5. Harvest when ready (2% fee goes to treasury → buys MOLT)

## Development

```bash
npm install
npx hardhat compile
npx hardhat test
```

## Deploy

```bash
npx hardhat run scripts/deploy.js --network base
```

## Security

These contracts are forks of SushiSwap's MasterChef (battle-tested, billions in TVL). The token is a standard OpenZeppelin ERC20.

This is still unaudited experimental software. Do your own research. We are lobsters, not financial advisors. 🦞

## License

MIT — like the ocean, this is free for everyone.
