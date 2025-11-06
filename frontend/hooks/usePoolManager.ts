import { useState, useEffect } from 'react'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useBalance } from 'wagmi'
import { parseEther, formatEther, createPublicClient, http, getContract } from 'viem'
import { PoolManagerABI } from '@/lib/contracts/abi'
import { POOL_MANAGER_ADDRESS, isContractDeployed } from '@/lib/contracts/contractConfig'

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
    deadline: bigint
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
        deadline: basicInfo[3],
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

    writeContract({
      address: POOLFI_ADDRESS as `0x${string}`,
      abi: PoolManagerABI,
      functionName: 'createPool',
      args: [
        poolData.name,
        parseEther(poolData.targetAmount),
        parseEther(poolData.contributionAmount),
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

  const contribute = (poolId: number, value: string) => {
    if (!isContractDeployed) return

    writeContract({
      address: POOLFI_ADDRESS as `0x${string}`,
      abi: PoolManagerABI,
      functionName: 'contribute',
      args: [BigInt(poolId)],
      value: parseEther(value)
    })
  }

  return {
    contribute,
    isLoading: isPending || isConfirming,
    isSuccess,
    error
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

  const withdraw = (poolId: number) => {
    if (!isContractDeployed) return

    writeContract({
      address: POOLFI_ADDRESS as `0x${string}`,
      abi: PoolManagerABI,
      functionName: 'withdraw',
      args: [BigInt(poolId)]
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

  const refund = (poolId: number) => {
    if (!isContractDeployed) return

    writeContract({
      address: POOLFI_ADDRESS as `0x${string}`,
      abi: PoolManagerABI,
      functionName: 'refund',
      args: [BigInt(poolId)]
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
    amount: amount ? formatEther(amount as bigint) : '0',
    isLoading: false
  }
}

// Hook to get user's CELO token balance from wallet
export function useCELOBalance() {
  const { address } = useAccount()
  
  // Get native CELO balance using useBalance hook from wagmi
  const { data: balance } = useBalance({
    address: address,
  })

  return {
    balance: balance ? formatEther(balance.value) : '0',
    isLoading: false
  }
}