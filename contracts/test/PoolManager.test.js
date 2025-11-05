const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PoolManager", function () {
  let poolManager;
  let owner;
  let addr1;
  let addr2;
  let addr3;

  beforeEach(async function () {
    [owner, addr1, addr2, addr3] = await ethers.getSigners();

    const PoolManager = await ethers.getContractFactory("PoolManager");
    poolManager = await PoolManager.deploy();
    await poolManager.waitForDeployment();
  });

  describe("Pool Creation", function () {
    it("Should create a pool successfully", async function () {
      const poolName = "Test Pool";
      const targetAmount = ethers.parseEther("100");
      const contributionAmount = ethers.parseEther("10");
      const maxMembers = 5;
      const deadline = Math.floor(Date.now() / 1000) + 86400; // 24 hours from now

      await expect(
        poolManager.createPool(
          poolName,
          targetAmount,
          contributionAmount,
          maxMembers,
          deadline
        )
      ).to.emit(poolManager, "PoolCreated");

      const poolInfo = await poolManager.getPoolBasicInfo(1);
      expect(poolInfo.name).to.equal(poolName);
      expect(poolInfo.creator).to.equal(owner.address);
      expect(poolInfo.isActive).to.be.true;
      expect(poolInfo.isCompleted).to.be.false;
    });

    it("Should reject pool creation with invalid parameters", async function () {
      const targetAmount = ethers.parseEther("100");
      const contributionAmount = ethers.parseEther("10");
      const maxMembers = 5;
      const deadline = Math.floor(Date.now() / 1000) + 86400;

      // Empty name
      await expect(
        poolManager.createPool("", targetAmount, contributionAmount, maxMembers, deadline)
      ).to.be.revertedWith("Pool name cannot be empty");

      // Zero target amount
      await expect(
        poolManager.createPool("Pool", 0, contributionAmount, maxMembers, deadline)
      ).to.be.revertedWith("Target amount must be greater than 0");

      // Past deadline
      await expect(
        poolManager.createPool(
          "Pool",
          targetAmount,
          contributionAmount,
          maxMembers,
          Math.floor(Date.now() / 1000) - 1000
        )
      ).to.be.revertedWith("Deadline must be in the future");
    });
  });

  describe("Contributions", function () {
    let poolId;
    const targetAmount = ethers.parseEther("100");
    const contributionAmount = ethers.parseEther("10");
    const maxMembers = 5;
    const deadline = Math.floor(Date.now() / 1000) + 86400;

    beforeEach(async function () {
      await poolManager.createPool(
        "Test Pool",
        targetAmount,
        contributionAmount,
        maxMembers,
        deadline
      );
      poolId = 1;
    });

    it("Should allow contribution to pool", async function () {
      await expect(
        poolManager.connect(addr1).contribute(poolId, { value: contributionAmount })
      ).to.emit(poolManager, "ContributionMade");

      const financialInfo = await poolManager.getPoolFinancialInfo(poolId);
      expect(financialInfo.currentAmount).to.equal(contributionAmount);

      const memberInfo = await poolManager.getPoolMemberInfo(poolId);
      expect(memberInfo.currentMembers).to.equal(1);

      const hasContributed = await poolManager.hasUserContributed(poolId, addr1.address);
      expect(hasContributed).to.be.true;
    });

    it("Should reject contribution with wrong amount", async function () {
      await expect(
        poolManager.connect(addr1).contribute(poolId, { value: ethers.parseEther("5") })
      ).to.be.revertedWith("Contribution amount must match pool requirement");
    });

    it("Should reject duplicate contributions", async function () {
      await poolManager.connect(addr1).contribute(poolId, { value: contributionAmount });
      
      await expect(
        poolManager.connect(addr1).contribute(poolId, { value: contributionAmount })
      ).to.be.revertedWith("You have already contributed to this pool");
    });

    it("Should complete pool when target is reached", async function () {
      // Need 10 contributions of 10 CELO each to reach 100 CELO target
      for (let i = 0; i < 10; i++) {
        const signer = i === 0 ? addr1 : i === 1 ? addr2 : addr3;
        await poolManager.connect(signer).contribute(poolId, { value: contributionAmount });
      }

      const poolInfo = await poolManager.getPoolBasicInfo(poolId);
      expect(poolInfo.isCompleted).to.be.true;
      expect(poolInfo.isActive).to.be.false;
    });
  });

  describe("Withdrawals", function () {
    let poolId;
    const contributionAmount = ethers.parseEther("10");
    const deadline = Math.floor(Date.now() / 1000) + 86400;

    beforeEach(async function () {
      await poolManager.createPool(
        "Test Pool",
        ethers.parseEther("100"),
        contributionAmount,
        5,
        deadline
      );
      poolId = 1;
    });

    it("Should allow withdrawal from completed pool", async function () {
      // Complete the pool
      for (let i = 0; i < 10; i++) {
        const signers = [addr1, addr2, addr3, owner, addr1, addr2, addr3, owner, addr1, addr2];
        await poolManager.connect(signers[i]).contribute(poolId, { value: contributionAmount });
      }

      const balanceBefore = await ethers.provider.getBalance(addr1.address);
      
      await expect(
        poolManager.connect(addr1).withdraw(poolId)
      ).to.emit(poolManager, "FundsWithdrawn");

      const balanceAfter = await ethers.provider.getBalance(addr1.address);
      expect(balanceAfter - balanceBefore).to.be.closeTo(contributionAmount, ethers.parseEther("0.01"));
    });

    it("Should reject withdrawal from incomplete pool", async function () {
      await poolManager.connect(addr1).contribute(poolId, { value: contributionAmount });
      
      await expect(
        poolManager.connect(addr1).withdraw(poolId)
      ).to.be.revertedWith("Pool is not completed yet");
    });
  });

  describe("Pool Cancellation", function () {
    it("Should allow creator to cancel empty pool", async function () {
      const deadline = Math.floor(Date.now() / 1000) + 86400;
      await poolManager.createPool(
        "Test Pool",
        ethers.parseEther("100"),
        ethers.parseEther("10"),
        5,
        deadline
      );

      await expect(
        poolManager.cancelPool(1)
      ).to.emit(poolManager, "PoolCancelled");

      const poolInfo = await poolManager.getPoolBasicInfo(1);
      expect(poolInfo.isActive).to.be.false;
    });

    it("Should reject cancellation by non-creator", async function () {
      const deadline = Math.floor(Date.now() / 1000) + 86400;
      await poolManager.createPool(
        "Test Pool",
        ethers.parseEther("100"),
        ethers.parseEther("10"),
        5,
        deadline
      );

      await expect(
        poolManager.connect(addr1).cancelPool(1)
      ).to.be.revertedWith("Only pool creator can perform this action");
    });
  });
});

