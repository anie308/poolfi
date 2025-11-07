# Testnet Deployment Guide

## Quick Start for Testnet Deployment

### Step 1: Create `.env` File

Create a `.env` file in the `contracts` directory:

```env
# Your wallet private key (without 0x prefix)
PRIVATE_KEY=your_private_key_here

# For Celo Sepolia Testnet, you can use cUSD as the token
# cUSD on Sepolia: 0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1
# Or deploy a mock USDC token for testing
TOKEN_ADDRESS=0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1

# No fees for testnet
FEE_RECIPIENT=0x0000000000000000000000000000000000000000
FEE_BPS=0
```

### Step 2: Get Testnet CELO

You need CELO for gas fees on testnet:

1. **Celo Sepolia Testnet**: Visit https://faucet.celo.org
2. **Celo Alfajores Testnet**: Visit https://faucet.celo.org/alfajores

Connect your wallet and request testnet CELO.

### Step 3: Choose Your Testnet

You have two options:

#### Option A: Celo Sepolia Testnet (Recommended)
```bash
TOKEN_ADDRESS=0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1 \
npx hardhat run scripts/deploy.js --network sepolia
```

#### Option B: Celo Alfajores Testnet
```bash
TOKEN_ADDRESS=0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1 \
npx hardhat run scripts/deploy.js --network alfajores
```

### Step 4: Deploy

Run the deployment command:

```bash
# For Sepolia
npx hardhat run scripts/deploy.js --network sepolia

# OR for Alfajores
npx hardhat run scripts/deploy.js --network alfajores
```

### Step 5: Save the Contract Address

After deployment, you'll see output like:
```
PoolManager deployed to: 0x1234...
```

**Save this address!** You'll need it for the frontend.

### Step 6: Update Frontend

Update `frontend/.env.local` or `frontend/lib/contracts/contractConfig.ts`:

```env
NEXT_PUBLIC_POOL_MANAGER_ADDRESS=0xYourDeployedContractAddress
NEXT_PUBLIC_USDC_ADDRESS=0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1
NEXT_PUBLIC_CELO_RPC_URL=https://forno.celo-sepolia.celo-testnet.org
```

## Testnet Token Addresses

### Celo Sepolia Testnet
- **cUSD**: `0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1`
- **Native CELO**: Native token (for gas)

### Celo Alfajores Testnet  
- **cUSD**: `0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1`
- **Native CELO**: Native token (for gas)

**Note**: For testing with USDC specifically, you may need to:
1. Deploy a mock USDC ERC20 token on testnet
2. Or use cUSD for testing (it's also a stablecoin)

## Troubleshooting

### "Insufficient funds"
- Make sure you have testnet CELO in your wallet
- Get more from the faucet: https://faucet.celo.org

### "Invalid token address"
- Verify the token address exists on the testnet
- Check on the testnet explorer (sepolia.celoscan.io or alfajores.celoscan.io)

### "Network error"
- Check your internet connection
- Try a different RPC URL
- Wait a few minutes and try again

## Next Steps After Deployment

1. ✅ Contract deployed
2. ✅ Contract address saved
3. ⬜ Update frontend with contract address
4. ⬜ Test creating a pool
5. ⬜ Test contributing to a pool
6. ⬜ Test withdrawing from a pool
7. ⬜ Verify contract on CeloScan (optional)

## Verify Contract (Optional)

After deployment, verify on CeloScan:

```bash
npx hardhat verify --network sepolia <CONTRACT_ADDRESS> <TOKEN_ADDRESS> <FEE_RECIPIENT> <FEE_BPS>
```

Example:
```bash
npx hardhat verify --network sepolia 0xYourContractAddress 0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1 0x0000000000000000000000000000000000000000 0
```

