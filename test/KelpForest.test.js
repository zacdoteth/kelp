const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("KelpFi", function () {
  let kelp, forest, treasury;
  let owner, user1, user2;
  let mockMolt, mockLP;

  const KELP_PER_BLOCK = ethers.parseEther("10");

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    // Deploy mock MOLT token for testing
    const MockToken = await ethers.getContractFactory("KelpToken");
    mockMolt = await MockToken.deploy();
    await mockMolt.waitForDeployment();

    // Deploy mock LP token
    mockLP = await MockToken.deploy();
    await mockLP.waitForDeployment();

    // Deploy KELP
    kelp = await (await ethers.getContractFactory("KelpToken")).deploy();
    await kelp.waitForDeployment();

    // Deploy Treasury (use owner as router placeholder for tests)
    treasury = await (await ethers.getContractFactory("KelpTreasury")).deploy(
      await kelp.getAddress(),
      await mockMolt.getAddress(),
      owner.address // mock router
    );
    await treasury.waitForDeployment();

    // Deploy Forest
    const currentBlock = await ethers.provider.getBlockNumber();
    forest = await (await ethers.getContractFactory("KelpForest")).deploy(
      await kelp.getAddress(),
      await treasury.getAddress(),
      owner.address, // dev fund
      KELP_PER_BLOCK,
      currentBlock + 5
    );
    await forest.waitForDeployment();

    // Transfer KELP ownership to Forest
    await kelp.transferOwnership(await forest.getAddress());

    // Mint mock tokens to users for testing
    await mockMolt.mint(user1.address, ethers.parseEther("10000"));
    await mockMolt.mint(user2.address, ethers.parseEther("10000"));

    // Add pool: stake mockMOLT, earn KELP
    await forest.addPool(1000, await mockMolt.getAddress());
  });

  describe("KelpToken", function () {
    it("has correct name and symbol", async function () {
      expect(await kelp.name()).to.equal("Kelp");
      expect(await kelp.symbol()).to.equal("KELP");
    });

    it("has 100M max supply", async function () {
      expect(await kelp.MAX_SUPPLY()).to.equal(ethers.parseEther("100000000"));
    });

    it("only owner (Forest) can mint", async function () {
      // Owner is now Forest, so direct mint from deployer should fail
      await expect(
        kelp.connect(owner).mint(user1.address, ethers.parseEther("100"))
      ).to.be.reverted;
    });
  });

  describe("KelpForest", function () {
    it("has one pool after setup", async function () {
      expect(await forest.poolLength()).to.equal(1);
    });

    it("allows deposits", async function () {
      const amount = ethers.parseEther("1000");
      await mockMolt.connect(user1).approve(await forest.getAddress(), amount);
      await forest.connect(user1).deposit(0, amount);

      const userInfo = await forest.userInfo(0, user1.address);
      expect(userInfo.amount).to.equal(amount);
    });

    it("accrues KELP rewards over blocks", async function () {
      const amount = ethers.parseEther("1000");
      await mockMolt.connect(user1).approve(await forest.getAddress(), amount);
      await forest.connect(user1).deposit(0, amount);

      // Mine some blocks
      for (let i = 0; i < 10; i++) {
        await ethers.provider.send("evm_mine");
      }

      const pending = await forest.pendingKelp(0, user1.address);
      expect(pending).to.be.gt(0);
    });

    it("allows withdrawal", async function () {
      const amount = ethers.parseEther("1000");
      await mockMolt.connect(user1).approve(await forest.getAddress(), amount);
      await forest.connect(user1).deposit(0, amount);

      // Mine blocks
      for (let i = 0; i < 5; i++) {
        await ethers.provider.send("evm_mine");
      }

      await forest.connect(user1).withdraw(0, amount);
      
      const userInfo = await forest.userInfo(0, user1.address);
      expect(userInfo.amount).to.equal(0);
      
      // Should have received KELP
      const kelpBalance = await kelp.balanceOf(user1.address);
      expect(kelpBalance).to.be.gt(0);
    });

    it("distributes rewards proportionally", async function () {
      const amount = ethers.parseEther("1000");
      
      // User1 deposits
      await mockMolt.connect(user1).approve(await forest.getAddress(), amount);
      await forest.connect(user1).deposit(0, amount);

      // User2 deposits same amount
      await mockMolt.connect(user2).approve(await forest.getAddress(), amount);
      await forest.connect(user2).deposit(0, amount);

      // Mine blocks
      for (let i = 0; i < 10; i++) {
        await ethers.provider.send("evm_mine");
      }

      const pending1 = await forest.pendingKelp(0, user1.address);
      const pending2 = await forest.pendingKelp(0, user2.address);

      // User1 should have more (was in longer)
      expect(pending1).to.be.gt(pending2);
    });

    it("harvest takes 2% fee to treasury", async function () {
      const amount = ethers.parseEther("1000");
      await mockMolt.connect(user1).approve(await forest.getAddress(), amount);
      await forest.connect(user1).deposit(0, amount);

      // Mine blocks to accrue rewards
      for (let i = 0; i < 20; i++) {
        await ethers.provider.send("evm_mine");
      }

      const treasuryAddr = await treasury.getAddress();
      const treasuryBefore = await kelp.balanceOf(treasuryAddr);
      
      await forest.connect(user1).harvest(0);
      
      const treasuryAfter = await kelp.balanceOf(treasuryAddr);
      expect(treasuryAfter).to.be.gt(treasuryBefore);
    });

    it("emergency withdraw forfeits rewards", async function () {
      const amount = ethers.parseEther("1000");
      await mockMolt.connect(user1).approve(await forest.getAddress(), amount);
      await forest.connect(user1).deposit(0, amount);

      // Mine blocks
      for (let i = 0; i < 10; i++) {
        await ethers.provider.send("evm_mine");
      }

      await forest.connect(user1).emergencyWithdraw(0);
      
      // Got tokens back
      expect(await mockMolt.balanceOf(user1.address)).to.equal(ethers.parseEther("10000"));
      // No KELP rewards
      expect(await kelp.balanceOf(user1.address)).to.equal(0);
    });

    it("only owner can add pools", async function () {
      await expect(
        forest.connect(user1).addPool(100, await mockMolt.getAddress())
      ).to.be.reverted;
    });
  });

  describe("Halving", function () {
    it("halves emissions after HALVING_PERIOD blocks", async function () {
      const initialRate = await forest.kelpPerBlock();
      const halvingPeriod = await forest.HALVING_PERIOD();

      // Mine through halving period
      await ethers.provider.send("hardhat_mine", ["0x" + halvingPeriod.toString(16)]);

      // Trigger halving via deposit
      const amount = ethers.parseEther("100");
      await mockMolt.connect(user1).approve(await forest.getAddress(), amount);
      await forest.connect(user1).deposit(0, amount);

      const newRate = await forest.kelpPerBlock();
      expect(newRate).to.equal(initialRate / 2n);
    });
  });
});
