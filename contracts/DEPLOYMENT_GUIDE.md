# PoolFi Contract Deployment Guide

This guide will walk you through deploying the PoolManager contract to Celo blockchain.

## Prerequisites

1. **Node.js 18+** installed
2. **Celo Account** with funds:
   - For Alfajores testnet: Get test CELO from [faucet](https://faucet.celo.org/alfajores)
   - For Mainnet: Have CELO in your wallet for gas fees
3. **Private Key** of your deployer account (keep this secure!)

## Step 1: Install Dependencies

```bash
cd contracts
npm install
```

## Step 2: Configure Environment

Create a `.env` file in the `contracts` directory:

```bash
cp .env.example .env
```

Edit `.env` and add your values:

```env
# Your deployer account private key (without 0x prefix)
PRIVATE_KEY=your_private_key_here

# Optional: CeloScan API key for contract verification
CELOSCAN_API_KEY=your_celoscan_api_key_here
```

⚠️ **WARNING**: Never commit your `.env` file to version control!

## Step 3: Compile Contracts

```bash
npm run compile
```

This will compile the contracts and generate artifacts in the `artifacts` folder.

## Step 4: Deploy to Testnet (Recommended First)

Deploy to Alfajores testnet first to test everything:

```bash
npm run deploy:alfajores
```

Expected output:
```
Deploying PoolManager contract...
PoolManager deployed to: 0x...
Network: alfajores
Chain ID: 44787
```

## Step 5: Verify Contract (Optional)

After deployment, verify the contract on CeloScan:

```bash
npx hardhat verify --network alfajores <CONTRACT_ADDRESS>
```

## Step 6: Update Frontend Configuration

1. **Update contract address in frontend**:

   Edit `frontend/hooks/usePoolManager.ts`:
   ```typescript
   const POOLFI_ADDRESS = 'YOUR_DEPLOYED_CONTRACT_ADDRESS' as `0x${string}`
   ```

2. **Update environment variables**:

   Add to `frontend/.env.local`:
   ```env
   NEXT_PUBLIC_POOL_MANAGER_ADDRESS=YOUR_DEPLOYED_CONTRACT_ADDRESS
   NEXT_PUBLIC_CELO_RPC_URL=https://alfajores-forno.celo-testnet.org
   NEXT_PUBLIC_CELO_CHAIN_ID=44787
   ```

## Step 7: Test on Testnet

1. Start your frontend:
   ```bash
   cd frontend
   npm run dev
   ```

2. Connect your wallet to Alfajores testnet
3. Test creating a pool
4. Test contributing to a pool
5. Test withdrawing from a completed pool

## Step 8: Deploy to Mainnet

Once testing is complete, deploy to Celo mainnet:

```bash
npm run deploy:celo
```

**Important**: 
- Make sure you have CELO in your wallet for gas fees
- Double-check all parameters before deploying
- Consider using a multisig wallet for production deployments

## Step 9: Update Production Configuration

After mainnet deployment:

1. Update `frontend/hooks/usePoolManager.ts` with mainnet address
2. Update production environment variables:
   ```env
   NEXT_PUBLIC_POOL_MANAGER_ADDRESS=YOUR_MAINNET_CONTRACT_ADDRESS
   NEXT_PUBLIC_CELO_RPC_URL=https://forno.celo.org
   NEXT_PUBLIC_CELO_CHAIN_ID=42220
   ```

## Troubleshooting

### "Insufficient funds"
- Make sure your deployer account has enough CELO for gas fees
- Check your balance on CeloScan

### "Network error"
- Verify RPC URLs are correct
- Check your internet connection
- Try using a different RPC endpoint

### "Contract verification failed"
- Wait a few minutes after deployment
- Make sure you're using the correct network
- Check that CELOSCAN_API_KEY is set correctly

## Security Checklist

Before deploying to mainnet:

- [ ] Code reviewed and tested
- [ ] All tests passing
- [ ] Tested on testnet first
- [ ] Private keys stored securely
- [ ] Contract verified on CeloScan
- [ ] Frontend updated with new address
- [ ] Environment variables updated
- [ ] Documentation updated

## Network Information

### Celo Mainnet
- Chain ID: 42220
- RPC: https://forno.celo.org
- Explorer: https://celoscan.io
- Gas Price: ~20 gwei

### Celo Alfajores Testnet
- Chain ID: 44787
- RPC: https://alfajores-forno.celo-testnet.org
- Explorer: https://alfajores.celoscan.io
- Faucet: https://faucet.celo.org/alfajores

## Support

For issues:
- Check the [contracts README](./README.md)
- Review [Celo documentation](https://docs.celo.org/)
- Check [Hardhat documentation](https://hardhat.org/docs)

