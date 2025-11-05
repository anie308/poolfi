# PoolFi Smart Contracts

Smart contracts for PoolFi - a collaborative savings platform on Celo blockchain.

## 📋 Overview

The `PoolManager` contract enables users to:
- Create savings pools with custom targets and contribution amounts
- Join pools and contribute funds
- Withdraw funds when pool goals are reached
- Cancel pools (by creator, before contributions)

## 🏗️ Contract Structure

### PoolManager.sol

Main contract that manages all pool operations.

**Key Features:**
- Pool creation with configurable parameters
- Contribution tracking
- Automatic completion detection
- Secure fund withdrawal
- Member management

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- A Celo account with funds (for deployment)
- Private key for deployment account

### Installation

1. **Install dependencies**
   ```bash
   cd contracts
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your:
   - `PRIVATE_KEY` - Your deployer account private key
   - `CELOSCAN_API_KEY` - Optional, for contract verification

### Deployment

#### Deploy to Alfajores Testnet (Recommended for testing)

```bash
npm run deploy:alfajores
```

#### Deploy to Celo Mainnet

```bash
npm run deploy:celo
```

### After Deployment

1. **Update frontend configuration**
   
   Update `frontend/hooks/usePoolManager.ts`:
   ```typescript
   const POOLFI_ADDRESS = 'YOUR_DEPLOYED_CONTRACT_ADDRESS'
   ```

2. **Update environment variables**
   
   Add to your frontend `.env.local`:
   ```env
   NEXT_PUBLIC_POOL_MANAGER_ADDRESS=YOUR_DEPLOYED_CONTRACT_ADDRESS
   ```

## 📝 Contract Functions

### View Functions

- `poolCount()` - Get total number of pools
- `getPoolBasicInfo(uint256 _poolId)` - Get basic pool information
- `getPoolFinancialInfo(uint256 _poolId)` - Get financial data
- `getPoolMemberInfo(uint256 _poolId)` - Get member information
- `getUserPools(address _user)` - Get all pools for a user
- `hasUserContributed(uint256 _poolId, address _user)` - Check contribution status

### Write Functions

- `createPool(string _name, uint256 _targetAmount, uint256 _contributionAmount, uint256 _maxMembers, uint256 _deadline)` - Create a new pool
- `contribute(uint256 _poolId)` - Contribute to a pool (payable)
- `withdraw(uint256 _poolId)` - Withdraw funds from completed pool
- `cancelPool(uint256 _poolId)` - Cancel a pool (creator only)

## 🔍 Contract Verification

After deployment, verify the contract on CeloScan:

```bash
npx hardhat verify --network celo <CONTRACT_ADDRESS>
```

Or for Alfajores:
```bash
npx hardhat verify --network alfajores <CONTRACT_ADDRESS>
```

## 🧪 Testing

Run tests:
```bash
npm test
```

## 📊 Contract ABI

The contract ABI matches the frontend implementation in `frontend/hooks/usePoolManager.ts`. After deployment, the ABI will be available in:
- `artifacts/contracts/PoolManager.sol/PoolManager.json`

## 🔒 Security Considerations

1. **Private Key Security**: Never commit your `.env` file with private keys
2. **Access Control**: The contract includes modifiers for creator-only functions
3. **Reentrancy**: The contract uses checks-effects-interactions pattern
4. **Emergency Functions**: The `emergencyWithdraw` function should be removed or restricted in production

## 🌐 Network Configuration

### Celo Mainnet
- Chain ID: 42220
- RPC: https://forno.celo.org
- Explorer: https://celoscan.io

### Celo Alfajores Testnet
- Chain ID: 44787
- RPC: https://alfajores-forno.celo-testnet.org
- Explorer: https://alfajores.celoscan.io
- Faucet: https://faucet.celo.org/alfajores

## 📚 Resources

- [Celo Documentation](https://docs.celo.org/)
- [Hardhat Documentation](https://hardhat.org/docs)
- [Solidity Documentation](https://docs.soliditylang.org/)

## 🤝 Contributing

1. Test thoroughly on Alfajores testnet before mainnet deployment
2. Review all contract functions before deployment
3. Update frontend configuration after deployment

## 📄 License

MIT License - see LICENSE file for details

