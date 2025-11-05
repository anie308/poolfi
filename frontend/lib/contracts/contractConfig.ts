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

// Check if contract is deployed
export const isContractDeployed = 
  POOL_MANAGER_ADDRESS !== '0x0000000000000000000000000000000000000000' &&
  POOL_MANAGER_ADDRESS !== ''

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
} as const

// Get contract explorer URL
export function getContractExplorerUrl(network: 'celo' | 'alfajores' = 'celo'): string {
  const networkConfig = CONTRACT_NETWORKS[network]
  return `${networkConfig.explorer}/address/${POOL_MANAGER_ADDRESS}`
}

