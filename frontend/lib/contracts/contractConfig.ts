/**
 * Contract Configuration
 * 
 * This file contains the contract address and configuration for PoolManager
 * Update the address after deploying the contract
 */

// Contract address - Update this after deployment
// Get from: contracts/scripts/deploy.js output or deployment logs
export const POOL_MANAGER_ADDRESS = 
  (process.env.NEXT_PUBLIC_POOL_MANAGER_ADDRESS as `0x${string}`) || 
  '0x0000000000000000000000000000000000000000'

// USDC Token addresses on Celo
export const USDC_ADDRESSES = {
  celo: '0xceba9300f2b22571058105c57D6e606663F7130D', // Celo Mainnet USDC
  alfajores: '0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1', // Alfajores testnet (cUSD, update with actual USDC if available)
  sepolia: '0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1', // Sepolia testnet (cUSD, update with actual USDC if available)
} as const

// Get USDC address for current network
export const USDC_ADDRESS = 
  (process.env.NEXT_PUBLIC_USDC_ADDRESS as `0x${string}`) || 
  USDC_ADDRESSES.celo

// USDC has 6 decimals (not 18 like native tokens)
export const USDC_DECIMALS = 6

// Check if contract is deployed
export const isContractDeployed = 
  POOL_MANAGER_ADDRESS !== '0x0000000000000000000000000000000000000000' 
// Network configuration
export const CONTRACT_NETWORKS = {
  celo: {
    chainId: 42220,
    name: 'Celo Mainnet',
    rpcUrl: 'https://forno.celo.org',
    explorer: 'https://celoscan.io',
  },
  alfajores: {
    chainId: 44787,
    name: 'Celo Alfajores',
    rpcUrl: 'https://alfajores-forno.celo-testnet.org',
    explorer: 'https://alfajores.celoscan.io',
  },
  sepolia: {
    chainId: 11142220,
    name: 'Celo Sepolia',
    rpcUrl: 'https://forno.celo-sepolia.celo-testnet.org',
    explorer: 'https://sepolia.celoscan.io',
  },
} as const

// Get contract explorer URL
export function getContractExplorerUrl(network: 'celo' | 'alfajores' | 'sepolia' = 'sepolia'): string {
  const networkConfig = CONTRACT_NETWORKS[network]
  return `${networkConfig.explorer}/address/${POOL_MANAGER_ADDRESS}`
}

