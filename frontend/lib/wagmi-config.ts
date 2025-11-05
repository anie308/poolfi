'use client'

import { defineChain } from 'viem'
import { getDefaultConfig } from '@rainbow-me/rainbowkit'

// Define Celo chain
const celoChain = defineChain({
  id: 42220,
  name: 'Celo',
  network: 'celo',
  nativeCurrency: {
    decimals: 18,
    name: 'CELO',
    symbol: 'CELO',
  },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_CELO_RPC_URL || 'https://forno.celo.org'],
    },
    public: {
      http: [process.env.NEXT_PUBLIC_CELO_RPC_URL || 'https://forno.celo.org'],
    },
  },
  blockExplorers: {
    default: { name: 'Celo Explorer', url: 'https://explorer.celo.org' },
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

