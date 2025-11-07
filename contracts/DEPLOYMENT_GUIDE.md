# PoolManager Contract Deployment Guide

## Prerequisites

1. **Node.js and npm** installed
2. **Wallet with CELO** for gas fees
3. **Environment variables** configured

## Step 1: Install Dependencies

```bash
cd contracts
npm install
```

## Step 2: Set Up Environment Variables

Create a `.env` file in the `contracts` directory with the following variables:

```env
# Required: Private key of the wallet that will deploy the contract
# WARNING: Never commit this to version control!
PRIVATE_KEY=your_private_key_here

# Required: USDC Token Address on Celo
# Celo Mainnet USDC: 0xceba9300f2b22571058105c57D6e606663F7130D
# For testnet, use the appropriate testnet USDC address
TOKEN_ADDRESS=0xceba9300f2b22571058105c57D6e606663F7130D

# Optional: Fee Configuration
# Fee recipient address (use 0x0000000000000000000000000000000000000000 for no fees)
FEE_RECIPIENT=0x0000000000000000000000000000000000000000

# Fee in basis points (100 = 1%, 0 = no fees, max 1000 = 10%)
FEE_BPS=0

# Optional: RPC URLs (defaults are provided in hardhat.config.js)
CELO_RPC_URL=https://forno.celo.org
ALFAJORES_RPC_URL=https://alfajores-forno.celo-testnet.org
CELO_SEPOLIA_RPC_URL=https://forno.celo-sepolia.celo-testnet.org

# Optional: CeloScan API Key for contract verification
CELOSCAN_API_KEY=your_celoscan_api_key
```

## Step 3: Compile the Contract

```bash
npm run compile
```

This will compile the PoolManager contract and check for any errors.

## Step 4: Deploy to Testnet (Recommended First)

### Deploy to Celo Sepolia Testnet

```bash
npm run deploy:alfajores
```

Or manually:
```bash
TOKEN_ADDRESS=0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1 \
FEE_RECIPIENT=0x0000000000000000000000000000000000000000 \
FEE_BPS=0 \
npx hardhat run scripts/deploy.js --network sepolia
```

## Step 5: Deploy to Celo Mainnet

**⚠️ WARNING: Only deploy to mainnet after thorough testing on testnet!**

```bash
npm run deploy:celo
```

Or manually:
```bash
TOKEN_ADDRESS=0xceba9300f2b22571058105c57D6e606663F7130D \
FEE_RECIPIENT=0xYourFeeRecipientAddress \
FEE_BPS=100 \
npx hardhat run scripts/deploy.js --network celo
```

## Step 6: Update Frontend Configuration

After deployment, update the frontend environment variables:

1. **Update `.env` or `.env.local` in the `frontend` directory:**

```env
NEXT_PUBLIC_POOL_MANAGER_ADDRESS=0xYourDeployedContractAddress
NEXT_PUBLIC_USDC_ADDRESS=0xceba9300f2b22571058105c57D6e606663F7130D
NEXT_PUBLIC_CELO_RPC_URL=https://forno.celo.org
```

2. **Or update `frontend/lib/contracts/contractConfig.ts` directly:**

```typescript
export const POOL_MANAGER_ADDRESS = '0xYourDeployedContractAddress' as `0x${string}`
```

## Step 7: Export ABI (Optional but Recommended)

After deployment, export the ABI for frontend use:

```bash
npm run export-abi
```

This updates the ABI file that the frontend uses.

## Deployment Parameters Explained

### Constructor Parameters

The PoolManager contract requires 3 constructor parameters:

1. **`_token`** (address): The ERC20 token address (USDC on Celo)
   - Mainnet: `0xceba9300f2b22571058105c57D6e606663F7130D`
   - Testnet: Check Celo documentation for testnet USDC address

2. **`_feeRecipient`** (address): Address to receive fees
   - Use `0x0000000000000000000000000000000000000000` for no fees
   - Or set to your fee collection address

3. **`_feeBps`** (uint256): Fee percentage in basis points
   - `0` = no fees
   - `100` = 1% fee
   - `1000` = 10% fee (maximum)
   - Example: For 2.5% fee, use `250`

## Example Deployment Commands

### Testnet Deployment (No Fees)
```bash
TOKEN_ADDRESS=0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1 \
FEE_RECIPIENT=0x0000000000000000000000000000000000000000 \
FEE_BPS=0 \
npx hardhat run scripts/deploy.js --network sepolia
```

### Mainnet Deployment (With 1% Fee)
```bash
TOKEN_ADDRESS=0xceba9300f2b22571058105c57D6e606663F7130D \
FEE_RECIPIENT=0xYourFeeRecipientAddress \
FEE_BPS=100 \
npx hardhat run scripts/deploy.js --network celo
```

## Post-Deployment Checklist

- [ ] Contract deployed successfully
- [ ] Contract address saved
- [ ] Contract verified on CeloScan (if applicable)
- [ ] Frontend `.env` updated with contract address
- [ ] Frontend tested with deployed contract
- [ ] Fee configuration verified (if fees are enabled)
- [ ] Pause functionality tested (owner only)
- [ ] Emergency withdrawal tested (if needed)

## Troubleshooting

### "Insufficient funds" error
- Ensure your wallet has enough CELO for gas fees
- Check gas price settings in `hardhat.config.js`

### "Invalid token address" error
- Verify the USDC token address is correct for your network
- For testnet, you may need to use a different token or deploy a mock USDC

### Contract verification fails
- Ensure `CELOSCAN_API_KEY` is set correctly
- Wait a few minutes after deployment before verifying
- Check that constructor arguments match exactly

## Security Notes

1. **Never commit `.env` files** to version control
2. **Use a dedicated wallet** for deployments (not your main wallet)
3. **Test thoroughly on testnet** before mainnet deployment
4. **Verify contract source code** on CeloScan after deployment
5. **Keep your private key secure** - consider using a hardware wallet

## Network Information

### Celo Mainnet
- Chain ID: 42220
- RPC URL: https://forno.celo.org
- Explorer: https://celoscan.io
- USDC: 0xceba9300f2b22571058105c57D6e606663F7130D

### Celo Sepolia Testnet
- Chain ID: 11142220
- RPC URL: https://forno.celo-sepolia.celo-testnet.org
- Explorer: https://sepolia.celoscan.io
- Faucet: https://faucet.celo.org

### Celo Alfajores Testnet
- Chain ID: 44787
- RPC URL: https://alfajores-forno.celo-testnet.org
- Explorer: https://alfajores.celoscan.io
- Faucet: https://faucet.celo.org/alfajores
