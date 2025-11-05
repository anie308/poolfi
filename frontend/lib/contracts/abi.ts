// Auto-generated from PoolManager contract
// Run: cd contracts && npm run export-abi
// Or: cd contracts && node scripts/export-abi.js
//
// This file will be automatically generated when you run:
//   cd contracts && npm run build

// For now, this is a placeholder. After compiling the contract, run:
//   cd contracts && npm run export-abi
// to generate the actual ABI from the compiled contract.

export const PoolManagerABI = [
  {
    "inputs": [],
    "name": "poolCount",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "string", "name": "_name", "type": "string"},
      {"internalType": "uint256", "name": "_targetAmount", "type": "uint256"},
      {"internalType": "uint256", "name": "_contributionAmount", "type": "uint256"},
      {"internalType": "uint256", "name": "_maxMembers", "type": "uint256"},
      {"internalType": "uint256", "name": "_deadline", "type": "uint256"}
    ],
    "name": "createPool",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_poolId", "type": "uint256"}],
    "name": "contribute",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_poolId", "type": "uint256"}],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_poolId", "type": "uint256"}],
    "name": "cancelPool",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_poolId", "type": "uint256"}],
    "name": "getPoolBasicInfo",
    "outputs": [
      {"internalType": "uint256", "name": "id", "type": "uint256"},
      {"internalType": "address", "name": "creator", "type": "address"},
      {"internalType": "string", "name": "name", "type": "string"},
      {"internalType": "uint256", "name": "deadline", "type": "uint256"},
      {"internalType": "bool", "name": "isActive", "type": "bool"},
      {"internalType": "bool", "name": "isCompleted", "type": "bool"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_poolId", "type": "uint256"}],
    "name": "getPoolFinancialInfo",
    "outputs": [
      {"internalType": "uint256", "name": "targetAmount", "type": "uint256"},
      {"internalType": "uint256", "name": "currentAmount", "type": "uint256"},
      {"internalType": "uint256", "name": "contributionAmount", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_poolId", "type": "uint256"}],
    "name": "getPoolMemberInfo",
    "outputs": [
      {"internalType": "uint256", "name": "maxMembers", "type": "uint256"},
      {"internalType": "uint256", "name": "currentMembers", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "_user", "type": "address"}],
    "name": "getUserPools",
    "outputs": [{"internalType": "uint256[]", "name": "", "type": "uint256[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "_poolId", "type": "uint256"},
      {"internalType": "address", "name": "_user", "type": "address"}
    ],
    "name": "hasUserContributed",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "poolId", "type": "uint256"},
      {"indexed": true, "internalType": "address", "name": "creator", "type": "address"},
      {"indexed": false, "internalType": "string", "name": "name", "type": "string"},
      {"indexed": false, "internalType": "uint256", "name": "targetAmount", "type": "uint256"},
      {"indexed": false, "internalType": "uint256", "name": "contributionAmount", "type": "uint256"},
      {"indexed": false, "internalType": "uint256", "name": "maxMembers", "type": "uint256"},
      {"indexed": false, "internalType": "uint256", "name": "deadline", "type": "uint256"}
    ],
    "name": "PoolCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "poolId", "type": "uint256"},
      {"indexed": true, "internalType": "address", "name": "contributor", "type": "address"},
      {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"},
      {"indexed": false, "internalType": "uint256", "name": "totalContributed", "type": "uint256"}
    ],
    "name": "ContributionMade",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "poolId", "type": "uint256"},
      {"indexed": false, "internalType": "uint256", "name": "totalAmount", "type": "uint256"}
    ],
    "name": "PoolCompleted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "poolId", "type": "uint256"},
      {"indexed": true, "internalType": "address", "name": "recipient", "type": "address"},
      {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"}
    ],
    "name": "FundsWithdrawn",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "poolId", "type": "uint256"},
      {"indexed": true, "internalType": "address", "name": "creator", "type": "address"}
    ],
    "name": "PoolCancelled",
    "type": "event"
  }
] as const

export const PoolManagerContractName = 'PoolManager'

