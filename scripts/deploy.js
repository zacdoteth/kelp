const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with:", deployer.address);
  console.log("Balance:", (await deployer.provider.getBalance(deployer.address)).toString());

  // --- Config ---
  // MOLT token on Base: 0xB695559b26BB2c9703ef1935c37AeaE9526bab07
  // Adjust these for mainnet:
  const MOLT_ADDRESS = "0xB695559b26BB2c9703ef1935c37AeaE9526bab07";
  const ROUTER_ADDRESS = "0x4752ba5DBc23f44D87826276BF6Fd6b1C372aD24"; // Uniswap V2 Router on Base
  
  // Emissions: ~11.5 KELP per block (1M/day at 3s blocks = ~86400 blocks/day)
  // 1,000,000 / 86,400 ≈ 11.57 KELP per block
  const KELP_PER_BLOCK = hre.ethers.parseEther("11.57");
  
  // Start block: set to current block + small buffer
  const currentBlock = await hre.ethers.provider.getBlockNumber();
  const START_BLOCK = currentBlock + 100; // ~5 min buffer

  // --- Deploy KelpToken ---
  console.log("\n🌿 Deploying KelpToken...");
  const KelpToken = await hre.ethers.getContractFactory("KelpToken");
  const kelp = await KelpToken.deploy();
  await kelp.waitForDeployment();
  const kelpAddress = await kelp.getAddress();
  console.log("KelpToken deployed to:", kelpAddress);

  // --- Deploy KelpTreasury ---
  console.log("\n🏦 Deploying KelpTreasury...");
  const KelpTreasury = await hre.ethers.getContractFactory("KelpTreasury");
  const treasury = await KelpTreasury.deploy(kelpAddress, MOLT_ADDRESS, ROUTER_ADDRESS);
  await treasury.waitForDeployment();
  const treasuryAddress = await treasury.getAddress();
  console.log("KelpTreasury deployed to:", treasuryAddress);

  // --- Deploy KelpForest ---
  console.log("\n🌊 Deploying KelpForest...");
  const DEV_FUND = deployer.address; // Dev fund = deployer (change for multisig later)
  const KelpForest = await hre.ethers.getContractFactory("KelpForest");
  const forest = await KelpForest.deploy(kelpAddress, treasuryAddress, DEV_FUND, KELP_PER_BLOCK, START_BLOCK);
  await forest.waitForDeployment();
  const forestAddress = await forest.getAddress();
  console.log("KelpForest deployed to:", forestAddress);

  // --- Transfer KelpToken ownership to KelpForest ---
  console.log("\n🔑 Transferring KelpToken ownership to KelpForest...");
  await kelp.transferOwnership(forestAddress);
  console.log("KelpToken owner is now KelpForest");

  // --- Add Pools ---
  console.log("\n🦞 Adding pools...");

  // Pool 0: The Deep — Stake MOLT, earn KELP (40% = 4000 allocPoints)
  await forest.addPool(4000, MOLT_ADDRESS);
  console.log("Pool 0 (The Deep): MOLT staking — 40% emissions");

  // Pool 1: The Reef — Stake MOLT/WETH LP (35% = 3500 allocPoints)
  // NOTE: Set LP token address after creating the KELP/WETH pair
  // await forest.addPool(3500, MOLT_WETH_LP_ADDRESS);
  // console.log("Pool 1 (The Reef): MOLT/WETH LP — 35% emissions");

  // Pool 2: The Nursery — Stake KELP/WETH LP (20% = 2000 allocPoints)  
  // NOTE: Set after creating KELP/WETH pair on DEX
  // await forest.addPool(2000, KELP_WETH_LP_ADDRESS);
  // console.log("Pool 2 (The Nursery): KELP/WETH LP — 20% emissions");

  // Pool 3: The Tide Pool — Agent tokens (5% = 500 allocPoints)
  // NOTE: Add agent token pools as needed
  // await forest.addPool(500, AGENT_TOKEN_ADDRESS);

  console.log("\n✅ Deployment complete!");
  console.log("================================");
  console.log("KelpToken:    ", kelpAddress);
  console.log("KelpTreasury: ", treasuryAddress);
  console.log("KelpForest:   ", forestAddress);
  console.log("Start Block:  ", START_BLOCK);
  console.log("KELP/block:   ", "11.57");
  console.log("Halving every:", "~7 days (201,600 blocks)");
  console.log("Max halvings: ", "8 (~56 days total emissions)");
  console.log("Max supply:   ", "100,000,000 KELP");
  console.log("================================");
  console.log("\n⚠️  TODO:");
  console.log("1. Create KELP/WETH pair on DEX");
  console.log("2. Add Pool 1 (MOLT/WETH LP) with forest.addPool(3500, LP_ADDRESS)");
  console.log("3. Add Pool 2 (KELP/WETH LP) with forest.addPool(2000, LP_ADDRESS)");
  console.log("4. Add agent token pools as desired");
  console.log("5. Seed initial KELP/WETH liquidity");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
