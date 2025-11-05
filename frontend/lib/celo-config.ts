// Celo Token Configuration
export const CELO_TOKENS = {
  // Native CELO token
  CELO: {
    address: '0x0000000000000000000000000000000000000000', // Native token
    symbol: 'CELO',
    name: 'Celo',
    decimals: 18,
    logoURI: '/celo_logo.png',
    chainId: 42220, // Celo Mainnet
  },
  // Celo stablecoins
  cUSD: {
    address: '0x765DE816845861e75A25fCA122bb6898B8B1282a', // cUSD on Celo Mainnet
    symbol: 'cUSD',
    name: 'Celo Dollar',
    decimals: 18,
    logoURI: '/cusd-logo.png',
    chainId: 42220,
  },
  cEUR: {
    address: '0xD8763CB27637c4AcDED8FdC19318b4C2F3dc32D8', // cEUR on Celo Mainnet
    symbol: 'cEUR',
    name: 'Celo Euro',
    decimals: 18,
    logoURI: '/ceur-logo.png',
    chainId: 42220,
  },
  USDC: {
    address: '0xceba9300f2b22571058105c57D6e606663F7130D', // USDC on Celo Mainnet
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    logoURI: '/usdc-logo.png',
    chainId: 42220,
  },
} as const

// Celo Alfajores Testnet tokens
export const CELO_TESTNET_TOKENS = {
  CELO: {
    address: '0x0000000000000000000000000000000000000000', // Native token
    symbol: 'CELO',
    name: 'Celo',
    decimals: 18,
    logoURI: '/celo_logo.png',
    chainId: 44787, // Celo Alfajores Testnet
  },
  cUSD: {
    address: '0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1', // cUSD on Alfajores
    symbol: 'cUSD',
    name: 'Celo Dollar',
    decimals: 18,
    logoURI: '/cusd-logo.png',
    chainId: 44787,
  },
} as const

// Celo Chain Configuration
export const CELO_CHAINS = {
  mainnet: {
    id: 42220,
    name: 'Celo Mainnet',
    rpcUrl: 'https://forno.celo.org',
    blockExplorer: 'https://explorer.celo.org',
    faucet: null, // No faucet for mainnet
    nativeCurrency: {
      name: 'Celo',
      symbol: 'CELO',
      decimals: 18,
    },
  },
  testnet: {
    id: 44787,
    name: 'Celo Alfajores',
    rpcUrl: 'https://alfajores-forno.celo-testnet.org',
    blockExplorer: 'https://alfajores-explorer.celo.org',
    faucet: 'https://faucet.celo.org/alfajores',
    nativeCurrency: {
      name: 'Celo',
      symbol: 'CELO',
      decimals: 18,
    },
  },
} as const

// Helper functions
export const isCeloChain = (chainId: number): boolean => {
  return chainId === CELO_CHAINS.mainnet.id || chainId === CELO_CHAINS.testnet.id
}

export const isCeloMainnet = (chainId: number): boolean => {
  return chainId === CELO_CHAINS.mainnet.id
}

export const isCeloTestnet = (chainId: number): boolean => {
  return chainId === CELO_CHAINS.testnet.id
}

export const getCeloTokens = (chainId: number) => {
  if (isCeloMainnet(chainId)) {
    return CELO_TOKENS
  } else if (isCeloTestnet(chainId)) {
    return CELO_TESTNET_TOKENS
  }
  return {}
}

export const getCeloChainInfo = (chainId: number) => {
  if (isCeloMainnet(chainId)) {
    return CELO_CHAINS.mainnet
  } else if (isCeloTestnet(chainId)) {
    return CELO_CHAINS.testnet
  }
  return null
}
