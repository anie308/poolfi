'use client'

import { defineChain } from 'viem'
import { getDefaultConfig } from '@rainbow-me/rainbowkit'

// Define Celo Sepolia Testnet chain
const celoChain = defineChain({
  id: 11142220,
  name: 'Celo Sepolia',
  network: 'celo-sepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'CELO',
    symbol: 'CELO',
  },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_CELO_RPC_URL || 'https://forno.celo-sepolia.celo-testnet.org'],
    },
    public: {
      http: [process.env.NEXT_PUBLIC_CELO_RPC_URL || 'https://forno.celo-sepolia.celo-testnet.org'],
    },
  },
  blockExplorers: {
    default: { name: 'Celo Explorer', url: 'https://sepolia.celoscan.io' },
  },
})

// Get WalletConnect Project ID from environment variables
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID

// Validate that projectId is provided
if (!projectId) {
  throw new Error(
    'Missing NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID. ' +
    'Please set this environment variable with your WalletConnect Cloud projectId. ' +
    'Get one for free at https://cloud.walletconnect.com/'
  )
}

// Configure wagmi config with RainbowKit
// Note: getDefaultConfig from RainbowKit v2 handles both wagmi and RainbowKit setup
export const wagmiConfig = getDefaultConfig({
  appName: 'PoolFi',
  projectId: projectId,
  chains: [celoChain],
  ssr: true,
})

