# Remix IDE Deployment Guide

## Constructor Parameters for PoolManager

When deploying from Remix, you need to provide these 3 parameters in order:

### 1. Token Address (USDC on Celo)
The ERC20 token address that will be used for all pool operations.

**For Celo Sepolia Testnet:**
```
0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1
```
(This is cUSD on Sepolia - you can use this for testing, or deploy a mock USDC)

**For Celo Mainnet:**
```
0xceba9300f2b22571058105c57D6e606663F7130D
```
(This is the official USDC on Celo Mainnet)

### 2. Fee Recipient Address
The address that will receive fees from contributions.

**For No Fees (Recommended for Testnet):**
```
0x0000000000000000000000000000000000000000
```

**For Fees (Your Wallet Address):**
```
0xYourWalletAddressHere
```

### 3. Fee BPS (Basis Points)
The fee percentage in basis points.

**For No Fees:**
```
0
```

**For Fees Examples:**
- `100` = 1% fee
- `250` = 2.5% fee
- `500` = 5% fee
- `1000` = 10% fee (maximum allowed)

## Quick Reference for Testnet Deployment

```
Token Address:    0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1
Fee Recipient:    0x0000000000000000000000000000000000000000
Fee BPS:          0
```

## Quick Reference for Mainnet Deployment

```
Token Address:    0xceba9300f2b22571058105c57D6e606663F7130D
Fee Recipient:    0x0000000000000000000000000000000000000000  (or your fee address)
Fee BPS:          0  (or your desired fee percentage)
```

## Remix Deployment Steps

1. **Open Remix IDE**: https://remix.ethereum.org

2. **Create New File**: 
   - Create `PoolManager.sol` in the contracts folder
   - Copy the contract code from `contracts/contracts/PoolManager.sol`

3. **Compile**:
   - Select Solidity compiler version `0.8.30`
   - Click "Compile PoolManager.sol"

4. **Deploy**:
   - Go to "Deploy & Run Transactions"
   - Select "Injected Provider - MetaMask" (or your wallet)
   - Make sure you're connected to the correct network (Celo Sepolia for testnet)
   - In the "Deploy" section, you'll see the constructor parameters
   - Enter the 3 values:
     - `_token`: Token address
     - `_feeRecipient`: Fee recipient address
     - `_feeBps`: Fee in basis points (as a number)

5. **Deploy**:
   - Click "Deploy"
   - Confirm the transaction in your wallet
   - Wait for confirmation

6. **Save Contract Address**:
   - After deployment, copy the contract address
   - Update your frontend configuration

## Example Values for Different Scenarios

### Testnet - No Fees
```
Token:      0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1
Recipient:  0x0000000000000000000000000000000000000000
BPS:        0
```

### Testnet - With 1% Fee
```
Token:      0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1
Recipient:  0xYourWalletAddress
BPS:        100
```

### Mainnet - No Fees
```
Token:      0xceba9300f2b22571058105c57D6e606663F7130D
Recipient:  0x0000000000000000000000000000000000000000
BPS:        0
```

### Mainnet - With 2.5% Fee
```
Token:      0xceba9300f2b22571058105c57D6e606663F7130D
Recipient:  0xYourFeeCollectionAddress
BPS:        250
```

## Important Notes

- **Basis Points**: 1 basis point = 0.01%, so 100 = 1%, 1000 = 10%
- **Maximum Fee**: The contract enforces a maximum of 1000 basis points (10%)
- **Zero Address**: Using `0x0000...0000` for fee recipient means no fees will be collected
- **Token Address**: Make sure you're using the correct token address for your network
- **Network**: Ensure you're connected to the correct Celo network in Remix/MetaMask

## After Deployment

1. Copy the deployed contract address
2. Update `frontend/lib/contracts/contractConfig.ts`:
   ```typescript
   export const POOL_MANAGER_ADDRESS = '0xYourDeployedAddress' as `0x${string}`
   ```
3. Or update `frontend/.env.local`:
   ```env
   NEXT_PUBLIC_POOL_MANAGER_ADDRESS=0xYourDeployedAddress
   ```

