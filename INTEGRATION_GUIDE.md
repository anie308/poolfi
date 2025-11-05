# Smart Contract Integration Guide

This guide explains how the PoolManager smart contract is integrated into the frontend application.

## 📁 Project Structure

```
poolfi/
├── contracts/                    # Smart contracts
│   ├── contracts/
│   │   └── PoolManager.sol      # Main contract
│   ├── scripts/
│   │   ├── deploy.js            # Deployment script
│   │   └── export-abi.js        # ABI export script
│   └── package.json
│
└── frontend/                     # Frontend application
    ├── lib/
    │   └── contracts/            # Contract integration
    │       ├── abi.ts            # Contract ABI (auto-generated)
    │       ├── contractConfig.ts # Contract address & config
    │       └── PoolManager.json  # Full contract artifact
    └── hooks/
        └── usePoolManager.ts     # Contract interaction hooks
```

## 🔄 Integration Flow

### 1. Compile Contract

After making changes to the contract, compile it:

```bash
cd contracts
npm run compile
```

### 2. Export ABI

Export the ABI to the frontend:

```bash
cd contracts
npm run export-abi
```

Or use the build command that does both:

```bash
cd contracts
npm run build
```

This will:
- Compile the contract
- Extract the ABI
- Generate `frontend/lib/contracts/abi.ts` (TypeScript)
- Generate `frontend/lib/contracts/PoolManager.json` (Full artifact)

### 3. Update Contract Address

After deploying the contract, update the address:

**Option 1: Environment Variable (Recommended)**
```env
# frontend/.env.local
NEXT_PUBLIC_POOL_MANAGER_ADDRESS=0xYourDeployedAddress
```

**Option 2: Direct Configuration**
```typescript
// frontend/lib/contracts/contractConfig.ts
export const POOL_MANAGER_ADDRESS = '0xYourDeployedAddress' as `0x${string}`
```

## 📝 Using the Contract in Frontend

### Import Contract Configuration

```typescript
import { POOL_MANAGER_ADDRESS, isContractDeployed } from '@/lib/contracts/contractConfig'
import { PoolManagerABI } from '@/lib/contracts/abi'
```

### Use Contract Hooks

The `usePoolManager.ts` hook provides all contract interactions:

```typescript
import { usePoolManager, useCreatePool, useContribute, useWithdraw } from '@/hooks/usePoolManager'

function MyComponent() {
  const { pools, loading, poolCount } = usePoolManager()
  const { createPool, isLoading: isCreating } = useCreatePool()
  const { contribute, isLoading: isContributing } = useContribute()
  const { withdraw, isLoading: isWithdrawing } = useWithdraw()

  // Use the hooks...
}
```

### Available Hooks

- **`usePoolManager()`** - Get all pools and pool count
- **`useCreatePool()`** - Create a new pool
- **`useContribute()`** - Contribute to a pool
- **`useWithdraw()`** - Withdraw from completed pool
- **`useCancelPool()`** - Cancel a pool (creator only)
- **`useCELOBalance()`** - Get user's CELO balance

## 🔧 Contract Functions

### View Functions (Read)

```typescript
// Get pool count
const { data: poolCount } = useReadContract({
  address: POOL_MANAGER_ADDRESS,
  abi: PoolManagerABI,
  functionName: 'poolCount'
})

// Get pool info
const { data: poolInfo } = useReadContract({
  address: POOL_MANAGER_ADDRESS,
  abi: PoolManagerABI,
  functionName: 'getPoolBasicInfo',
  args: [poolId]
})
```

### Write Functions

```typescript
// Create pool
const { writeContract } = useWriteContract()
writeContract({
  address: POOL_MANAGER_ADDRESS,
  abi: PoolManagerABI,
  functionName: 'createPool',
  args: [name, targetAmount, contributionAmount, maxMembers, deadline]
})

// Contribute (payable)
writeContract({
  address: POOL_MANAGER_ADDRESS,
  abi: PoolManagerABI,
  functionName: 'contribute',
  args: [poolId],
  value: parseEther(contributionAmount) // Amount in CELO
})
```

## 📡 Events

Listen to contract events:

```typescript
import { usePublicClient } from 'wagmi'

const publicClient = usePublicClient()

// Listen for PoolCreated events
const logs = await publicClient.getLogs({
  address: POOL_MANAGER_ADDRESS,
  event: {
    type: 'event',
    name: 'PoolCreated',
    inputs: [
      { indexed: true, name: 'poolId', type: 'uint256' },
      { indexed: true, name: 'creator', type: 'address' },
      // ... other inputs
    ]
  }
})
```

## 🔐 Security Best Practices

1. **Never commit private keys** - Use environment variables
2. **Verify contract on CeloScan** - After deployment
3. **Test on testnet first** - Always test on Alfajores before mainnet
4. **Validate user inputs** - Check amounts, deadlines, etc.
5. **Handle errors gracefully** - Show user-friendly error messages

## 🚀 Deployment Workflow

1. **Develop Contract**
   ```bash
   cd contracts
   # Edit PoolManager.sol
   ```

2. **Test Contract**
   ```bash
   npm test
   ```

3. **Compile & Export ABI**
   ```bash
   npm run build
   ```

4. **Deploy to Testnet**
   ```bash
   npm run deploy:alfajores
   ```

5. **Update Frontend Config**
   ```bash
   # Update NEXT_PUBLIC_POOL_MANAGER_ADDRESS in frontend/.env.local
   ```

6. **Test Frontend Integration**
   ```bash
   cd ../frontend
   npm run dev
   ```

7. **Deploy to Mainnet** (After thorough testing)
   ```bash
   cd contracts
   npm run deploy:celo
   ```

8. **Update Production Config**
   ```bash
   # Update environment variables in Vercel/dep

oyment platform
   ```

## 🐛 Troubleshooting

### ABI Not Found

If you see errors about missing ABI:
```bash
cd contracts
npm run export-abi
```

### Contract Address Not Set

Check that `NEXT_PUBLIC_POOL_MANAGER_ADDRESS` is set in your `.env.local`:
```bash
# frontend/.env.local
NEXT_PUBLIC_POOL_MANAGER_ADDRESS=0xYourAddress
```

### Contract Not Deployed

The app will gracefully handle missing contracts. Check:
- Contract address is correct
- Network is correct (Celo mainnet or Alfajores)
- Contract is actually deployed on that network

### Type Errors

Make sure TypeScript can find the contract types:
```bash
cd frontend
npm run type-check
```

## 📚 Additional Resources

- [Wagmi Documentation](https://wagmi.sh/)
- [Viem Documentation](https://viem.sh/)
- [Celo Documentation](https://docs.celo.org/)
- [Hardhat Documentation](https://hardhat.org/docs)

## 🔄 Keeping Contract & Frontend in Sync

After any contract changes:

1. Update contract code
2. Compile: `cd contracts && npm run compile`
3. Export ABI: `cd contracts && npm run export-abi`
4. Update frontend if needed
5. Test thoroughly
6. Deploy and update address

The ABI export script automatically keeps the frontend in sync with the contract!

