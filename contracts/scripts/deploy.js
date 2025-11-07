const hre = require("hardhat");

async function main() {
  console.log("Deploying PoolManager contract...");

  // Get USDC token address from environment or use default
  // Celo Mainnet USDC: 0xceba9300f2b22571058105c57D6e606663F7130D
  // Celo Sepolia USDC: (update with testnet address if available)
  const tokenAddress = process.env.TOKEN_ADDRESS || process.env.USDC_ADDRESS;
  
  if (!tokenAddress) {
    throw new Error("TOKEN_ADDRESS or USDC_ADDRESS environment variable must be set");
  }

  // Fee configuration (optional)
  // feeRecipient: address to receive fees (use zero address for no fees)
  // feeBps: fee in basis points (e.g., 100 = 1%, 0 = no fees, max 1000 = 10%)
  const feeRecipient = process.env.FEE_RECIPIENT || "0x0000000000000000000000000000000000000000";
  const feeBps = process.env.FEE_BPS ? parseInt(process.env.FEE_BPS) : 0;

  console.log("Using token address:", tokenAddress);
  console.log("Fee recipient:", feeRecipient);
  console.log("Fee (basis points):", feeBps);

  const PoolManager = await hre.ethers.getContractFactory("PoolManager");
  const poolManager = await PoolManager.deploy(tokenAddress, feeRecipient, feeBps);

  await poolManager.waitForDeployment();

  const address = await poolManager.getAddress();
  console.log("PoolManager deployed to:", address);
  console.log("Token address:", tokenAddress);
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
        constructorArguments: [tokenAddress, feeRecipient, feeBps],
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

