const hre = require("hardhat");

async function main() {
  console.log("Deploying PoolManager contract...");

  const PoolManager = await hre.ethers.getContractFactory("PoolManager");
  const poolManager = await PoolManager.deploy();

  await poolManager.waitForDeployment();

  const address = await poolManager.getAddress();
  console.log("PoolManager deployed to:", address);
  console.log("Network:", hre.network.name);
  console.log("Chain ID:", (await hre.ethers.provider.getNetwork()).chainId);

  // Verify contract on CeloScan (optional)
  if (hre.network.name === "celo" || hre.network.name === "alfajores" || hre.network.name === "sepolia") {
    console.log("\nWaiting for block confirmations...");
    await poolManager.deploymentTransaction().wait(5);

    console.log("\nVerifying contract on CeloScan...");
    try {
      await hre.run("verify:verify", {
        address: address,
        constructorArguments: [],
      });
      console.log("Contract verified successfully!");
    } catch (error) {
      console.log("Verification failed:", error.message);
    }
  }

  console.log("\n=== Deployment Summary ===");
  console.log("Contract Address:", address);
  console.log("Network:", hre.network.name);
  console.log("\nNext steps:");
  console.log("1. Update NEXT_PUBLIC_POOL_MANAGER_ADDRESS in your .env file");
  console.log("2. Update the address in frontend/hooks/usePoolManager.ts");
  console.log("3. Test the contract interactions");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

