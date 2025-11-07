import { useState, useEffect } from 'react'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useBalance } from 'wagmi'
import { parseUnits, formatUnits, createPublicClient, http, getContract } from 'viem'
import { PoolManagerABI } from '@/lib/contracts/abi'
import { POOL_MANAGER_ADDRESS, isContractDeployed, USDC_ADDRESS, USDC_DECIMALS } from '@/lib/contracts/contractConfig'

// ERC20 ABI for token operations
const ERC20_ABI = [
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: '_spender', type: 'address' },
      { name: '_value', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      { name: '_owner', type: 'address' },
      { name: '_spender', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', type: 'uint256' }],
    type: 'function',
  },
] as const

// Contract ABI is imported directly from @/lib/contracts/abi
// After compiling the contract, run: cd contracts && npm run export-abi
// This will automatically update the ABI file

// Contract address - Imported from contract configuration
const POOLFI_ADDRESS = POOL_MANAGER_ADDRESS

export function usePoolManager() {
  const { address, isConnected } = useAccount()
  const [pools, setPools] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  // Get pool count
  const { data: poolCount } = useReadContract({
    address: isContractDeployed ? POOLFI_ADDRESS : undefined,
    abi: PoolManagerABI,
    functionName: 'poolCount'
  })

  // Load all pools
  useEffect(() => {
    if (!poolCount || !isConnected || !isContractDeployed) {
      setPools([])
      setLoading(false)
      return
    }

    const loadPools = async () => {
      setLoading(true)
      const poolData: any[] = []
      
      try {
        for (let i = 1; i <= Number(poolCount); i++) {
          // Get pool data from contract
          const poolInfo = await fetchPoolInfo(i)
          if (poolInfo) {
            poolData.push({
              id: i,
              name: poolInfo.basic.name,
              description: `Pool created by ${poolInfo.basic.creator}`,
              targetAmount: poolInfo.financial.targetAmount,
              currentAmount: poolInfo.financial.currentAmount,
              contributionAmount: poolInfo.financial.contributionAmount,
              maxMembers: poolInfo.members.maxMembers,
              currentMembers: poolInfo.members.currentMembers,
              deadline: poolInfo.basic.deadline,
              active: poolInfo.basic.isActive,
              completed: poolInfo.basic.isCompleted,
              isRefundable: poolInfo.basic.isRefundable,
            })
          }
        }
        setPools(poolData)
      } catch (error) {
        console.error('Error loading pools:', error)
        setPools([])
      } finally {
        setLoading(false)
      }
    }

    loadPools()
  }, [poolCount, isConnected, isContractDeployed])

  return {
    pools,
    loading,
    poolCount: poolCount ? Number(poolCount) : 0,
    isContractDeployed
  }
}

// Helper function to fetch pool info
async function fetchPoolInfo(poolId: number): Promise<{
  basic: {
    id: bigint
    creator: string
    name: string
    deadline: number
    isActive: boolean
    isCompleted: boolean
    isRefundable: boolean
  }
  financial: {
    targetAmount: bigint
    currentAmount: bigint
    contributionAmount: bigint
  }
  members: {
    maxMembers: bigint
    currentMembers: bigint
  }
} | null> {
  try {
    // Create a public client for reading contract data
    const publicClient = createPublicClient({
      chain: {
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
      },
      transport: http(process.env.NEXT_PUBLIC_CELO_RPC_URL || 'https://forno.celo-sepolia.celo-testnet.org'),
    })

    const contract = getContract({
      address: POOLFI_ADDRESS,
      abi: PoolManagerABI,
      client: publicClient,
    })

    const [basicInfo, financialInfo, memberInfo] = await Promise.all([
      contract.read.getPoolBasicInfo([BigInt(poolId)]),
      contract.read.getPoolFinancialInfo([BigInt(poolId)]),
      contract.read.getPoolMemberInfo([BigInt(poolId)])
    ])

    return {
      basic: {
        id: basicInfo[0],
        creator: basicInfo[1],
        name: basicInfo[2],
        deadline: Number(basicInfo[3]), // Convert bigint to number for timestamp
        isActive: basicInfo[4],
        isCompleted: basicInfo[5],
        isRefundable: basicInfo[6] // New field from updated contract
      },
      financial: {
        targetAmount: financialInfo[0],
        currentAmount: financialInfo[1],
        contributionAmount: financialInfo[2]
      },
      members: {
        maxMembers: memberInfo[0],
        currentMembers: memberInfo[1]
      }
    }
  } catch (error) {
    console.error(`Error fetching pool ${poolId} info:`, error)
    return null
  }
}

export function useCreatePool() {
  const { writeContract, data, isPending, error } = useWriteContract()

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: data,
  })

  const createPool = (poolData: {
    name: string
    description: string
    targetAmount: string
    contributionAmount: string
    maxMembers: number
    deadline: number
  }) => {
    if (!isContractDeployed) {
      console.error('Contract not deployed')
      return
    }

    console.log('Creating pool with data:', poolData)
    console.log('Contract address:', POOLFI_ADDRESS)

    // Parse amounts using USDC decimals (6)
    writeContract({
      address: POOLFI_ADDRESS as `0x${string}`,
      abi: PoolManagerABI,
      functionName: 'createPool',
      args: [
        poolData.name,
        parseUnits(poolData.targetAmount, USDC_DECIMALS),
        parseUnits(poolData.contributionAmount, USDC_DECIMALS),
        BigInt(poolData.maxMembers),
        BigInt(poolData.deadline)
      ]
    })
  }

  return {
    createPool,
    isLoading: isPending || isConfirming,
    isSuccess,
    error
  }
}

export function useContribute() {
  const { writeContract, data, isPending, error } = useWriteContract()

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: data,
  })

  const contribute = (poolId: number, minAmountOut: bigint = BigInt(0)) => {
    if (!isContractDeployed) return

    // Note: User must approve tokens before calling contribute
    // The frontend should check allowance using useTokenAllowance hook
    // and call approveToken if needed
    // minAmountOut: For USDC (stablecoin), 0 is safe. For other tokens, calculate slippage tolerance
    writeContract({
      address: POOLFI_ADDRESS as `0x${string}`,
      abi: PoolManagerABI,
      functionName: 'contribute',
      args: [BigInt(poolId), minAmountOut],
    })
  }

  return {
    contribute,
    isLoading: isPending || isConfirming,
    isSuccess,
    error,
  }
}

// Hook for approving USDC tokens
export function useApproveToken() {
  const { address } = useAccount()
  const { writeContract, data, isPending, error } = useWriteContract()

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: data,
  })

  const approveToken = (amount: bigint) => {
    if (!isContractDeployed || !address) return

    writeContract({
      address: USDC_ADDRESS as `0x${string}`,
      abi: ERC20_ABI,
      functionName: 'approve',
      args: [POOLFI_ADDRESS, amount],
    })
  }

  return {
    approveToken,
    isLoading: isPending || isConfirming,
    isSuccess,
    error,
  }
}

// Separate hook for checking token allowance
export function useTokenAllowance() {
  const { address } = useAccount()
  
  const { data: allowance } = useReadContract({
    address: USDC_ADDRESS as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: address && isContractDeployed ? [address, POOLFI_ADDRESS] : undefined,
  })

  // Ensure allowance is a bigint
  const allowanceBigInt = typeof allowance === 'bigint' ? allowance : BigInt(0)

  return {
    allowance: allowanceBigInt,
    allowanceFormatted: allowanceBigInt > BigInt(0) ? formatUnits(allowanceBigInt, USDC_DECIMALS) : '0',
  }
}

export function useCancelPool() {
  const { writeContract, data, isPending, error } = useWriteContract()

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: data,
  })

  const cancelPool = (poolId: number) => {
    if (!isContractDeployed) return

    writeContract({
      address: POOLFI_ADDRESS as `0x${string}`,
      abi: PoolManagerABI,
      functionName: 'cancelPool',
      args: [BigInt(poolId)]
    })
  }

  return {
    cancelPool,
    isLoading: isPending || isConfirming,
    isSuccess,
    error
  }
}

export function useWithdraw() {
  const { writeContract, data, isPending, error } = useWriteContract()

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: data,
  })

  const withdraw = (poolId: number, minAmountOut: bigint = BigInt(0)) => {
    if (!isContractDeployed) return

    // minAmountOut: For USDC (stablecoin), 0 is safe. For other tokens, calculate slippage tolerance
    writeContract({
      address: POOLFI_ADDRESS as `0x${string}`,
      abi: PoolManagerABI,
      functionName: 'withdraw',
      args: [BigInt(poolId), minAmountOut]
    })
  }

  return {
    withdraw,
    isLoading: isPending || isConfirming,
    isSuccess,
    error
  }
}


// Hook to mark pool as failed (enables refunds)
export function useMarkPoolAsFailed() {
  const { writeContract, data, isPending, error } = useWriteContract()

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: data,
  })

  const markPoolAsFailed = (poolId: number) => {
    if (!isContractDeployed) return

    writeContract({
      address: POOLFI_ADDRESS as `0x${string}`,
      abi: PoolManagerABI,
      functionName: 'markPoolAsFailed',
      args: [BigInt(poolId)]
    })
  }

  return {
    markPoolAsFailed,
    isLoading: isPending || isConfirming,
    isSuccess,
    error
  }
}

// Hook to refund from a failed pool
export function useRefund() {
  const { writeContract, data, isPending, error } = useWriteContract()

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: data,
  })

  const refund = (poolId: number, minAmountOut: bigint = BigInt(0)) => {
    if (!isContractDeployed) return

    // minAmountOut: For USDC (stablecoin), 0 is safe. For other tokens, calculate slippage tolerance
    writeContract({
      address: POOLFI_ADDRESS as `0x${string}`,
      abi: PoolManagerABI,
      functionName: 'refund',
      args: [BigInt(poolId), minAmountOut]
    })
  }

  return {
    refund,
    isLoading: isPending || isConfirming,
    isSuccess,
    error
  }
}

// Hook to get user's contribution amount for a pool
export function useContributionAmount(poolId: number) {
  const { address } = useAccount()
  
  const { data: amount } = useReadContract({
    address: isContractDeployed ? POOLFI_ADDRESS : undefined,
    abi: PoolManagerABI,
    functionName: 'getContributionAmount',
    args: address ? [BigInt(poolId), address] : undefined
  })

  return {
    amount: amount ? formatUnits(amount as bigint, USDC_DECIMALS) : '0',
    isLoading: false
  }
}

// Hook to get user's USDC token balance from wallet
export function useUSDCBalance() {
  const { address } = useAccount()
  
  // Get USDC ERC20 token balance
  const { data: balance, isLoading } = useReadContract({
    address: USDC_ADDRESS as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  })

  // Ensure balance is a bigint
  const balanceBigInt = typeof balance === 'bigint' ? balance : BigInt(0)

  return {
    balance: balanceBigInt > BigInt(0) ? formatUnits(balanceBigInt, USDC_DECIMALS) : '0',
    isLoading
  }
}

// Legacy hook name for backward compatibility (now returns USDC balance)
export function useCELOBalance() {
  return useUSDCBalance()
}

// Hook to check if contract is paused
export function useIsPaused() {
  const { data: isPaused } = useReadContract({
    address: isContractDeployed ? POOLFI_ADDRESS : undefined,
    abi: PoolManagerABI,
    functionName: 'paused',
  })

  return {
    isPaused: isPaused || false,
    isLoading: false
  }
}

// Hook to get fee information
export function useFeeInfo() {
  const { data: feeInfo, isLoading } = useReadContract({
    address: isContractDeployed ? POOLFI_ADDRESS : undefined,
    abi: PoolManagerABI,
    functionName: 'getFeeInfo',
  })

  return {
    feeRecipient: feeInfo?.[0] as string | undefined,
    feeBps: feeInfo?.[1] as bigint | undefined,
    totalFeesCollected: feeInfo?.[2] as bigint | undefined,
    feePercentage: feeInfo?.[1] ? Number(feeInfo[1]) / 100 : 0, // Convert basis points to percentage
    isLoading
  }
}

// Hook to fetch a single pool by ID
export function usePool(poolId: number | string) {
  const { address, isConnected } = useAccount()
  const [poolData, setPoolData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [members, setMembers] = useState<string[]>([])

  const poolIdNum = typeof poolId === 'string' ? parseInt(poolId) : poolId

  // Get pool basic info
  const { data: basicInfo } = useReadContract({
    address: isContractDeployed ? POOLFI_ADDRESS : undefined,
    abi: PoolManagerABI,
    functionName: 'getPoolBasicInfo',
    args: poolIdNum > 0 ? [BigInt(poolIdNum)] : undefined,
  })

  // Get pool financial info
  const { data: financialInfo } = useReadContract({
    address: isContractDeployed ? POOLFI_ADDRESS : undefined,
    abi: PoolManagerABI,
    functionName: 'getPoolFinancialInfo',
    args: poolIdNum > 0 ? [BigInt(poolIdNum)] : undefined,
  })

  // Get pool member info
  const { data: memberInfo } = useReadContract({
    address: isContractDeployed ? POOLFI_ADDRESS : undefined,
    abi: PoolManagerABI,
    functionName: 'getPoolMemberInfo',
    args: poolIdNum > 0 ? [BigInt(poolIdNum)] : undefined,
  })

  // Get user's contribution amount
  const { data: userContribution } = useReadContract({
    address: isContractDeployed && address ? POOLFI_ADDRESS : undefined,
    abi: PoolManagerABI,
    functionName: 'getContributionAmount',
    args: poolIdNum > 0 && address ? [BigInt(poolIdNum), address] : undefined,
  })

  // Check if user has contributed
  const { data: hasContributed } = useReadContract({
    address: isContractDeployed && address ? POOLFI_ADDRESS : undefined,
    abi: PoolManagerABI,
    functionName: 'hasUserContributed',
    args: poolIdNum > 0 && address ? [BigInt(poolIdNum), address] : undefined,
  })

  // Fetch pool members
  useEffect(() => {
    if (!poolIdNum || !isContractDeployed) {
      setMembers([])
      return
    }

    const fetchMembers = async () => {
      try {
        const publicClient = createPublicClient({
          chain: {
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
            },
          },
          transport: http(process.env.NEXT_PUBLIC_CELO_RPC_URL || 'https://forno.celo-sepolia.celo-testnet.org'),
        })

        const contract = getContract({
          address: POOLFI_ADDRESS,
          abi: PoolManagerABI,
          client: publicClient,
        })

        const memberList = await contract.read.getPoolMembers([BigInt(poolIdNum)])
        setMembers(memberList as string[])
      } catch (error) {
        console.error('Error fetching pool members:', error)
        setMembers([])
      }
    }

    fetchMembers()
  }, [poolIdNum, isContractDeployed])

  // Combine all pool data
  useEffect(() => {
    if (!basicInfo || !financialInfo || !memberInfo) {
      setLoading(true)
      return
    }

    const targetAmount = financialInfo[0] as bigint
    const currentAmount = financialInfo[1] as bigint
    const contributionAmount = financialInfo[2] as bigint
    const maxMembers = memberInfo[0] as bigint
    const currentMembers = memberInfo[1] as bigint

    const progress = targetAmount > BigInt(0) 
      ? Number((currentAmount * BigInt(100)) / targetAmount) 
      : 0

    setPoolData({
      id: poolIdNum,
      name: basicInfo[2] as string,
      creator: basicInfo[1] as string,
      deadline: Number(basicInfo[3] as bigint),
      isActive: basicInfo[4] as boolean,
      isCompleted: basicInfo[5] as boolean,
      isRefundable: basicInfo[6] as boolean,
      targetAmount,
      currentAmount,
      contributionAmount,
      maxMembers: Number(maxMembers),
      currentMembers: Number(currentMembers),
      progress: Math.min(progress, 100),
      userContribution: userContribution ? formatUnits(userContribution as bigint, USDC_DECIMALS) : '0',
      hasContributed: hasContributed || false,
      members,
    })

    setLoading(false)
  }, [basicInfo, financialInfo, memberInfo, userContribution, hasContributed, members, poolIdNum])

  return {
    pool: poolData,
    loading,
    members,
    isCreator: address && poolData?.creator?.toLowerCase() === address?.toLowerCase(),
  }
}