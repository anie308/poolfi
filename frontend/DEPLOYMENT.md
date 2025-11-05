# PoolFi Frontend Deployment Guide

## Vercel Deployment

This guide will help you deploy the PoolFi frontend to Vercel.

### Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Your code should be pushed to GitHub
3. **Environment Variables**: Prepare the required environment variables

### Required Environment Variables

Set these in your Vercel dashboard under Project Settings > Environment Variables:

```bash
# Smart Contract Addresses (Update after deployment)
NEXT_PUBLIC_POOL_MANAGER_ADDRESS=0x0000000000000000000000000000000000000000

# WalletConnect Project ID (Get from https://cloud.walletconnect.com/)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here

# Celo Network Configuration
NEXT_PUBLIC_CELO_RPC_URL=https://forno.celo.org
NEXT_PUBLIC_CELO_CHAIN_ID=42220

# Production optimizations
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

### Deployment Steps

#### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Connect Repository**:
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository: `Nnadijoshuac/poolfi`

2. **Configure Project**:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

3. **Set Environment Variables**:
   - Add all required environment variables listed above
   - Make sure to set them for Production, Preview, and Development

4. **Deploy**:
   - Click "Deploy"
   - Wait for the build to complete

#### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Navigate to Frontend Directory**:
   ```bash
   cd frontend
   ```

4. **Deploy**:
   ```bash
   # For preview deployment
   vercel

   # For production deployment
   vercel --prod
   ```

### Post-Deployment Configuration

1. **Update Smart Contract Addresses**:
   - After deploying your smart contracts, update the `NEXT_PUBLIC_POOL_MANAGER_ADDRESS` in Vercel
   - Redeploy the frontend

2. **Configure Custom Domain** (Optional):
   - Go to Project Settings > Domains
   - Add your custom domain
   - Configure DNS records as instructed

3. **Set up Analytics** (Optional):
   - Enable Vercel Analytics in Project Settings
   - Or integrate Google Analytics by adding `NEXT_PUBLIC_GA_ID`

### Build Optimization

The project is configured with:
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Wagmi** for Web3 integration
- **RainbowKit** for wallet connection

### Troubleshooting

#### Common Issues:

1. **Build Failures**:
   - Check that all environment variables are set
   - Ensure Node.js version is 18+ in Vercel settings
   - Check build logs for specific errors

2. **Wallet Connection Issues**:
   - Verify `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` is correct
   - Check that the project ID is from the correct network

3. **Smart Contract Issues**:
   - Ensure `NEXT_PUBLIC_POOL_MANAGER_ADDRESS` is the correct deployed address
   - Verify the contract is deployed on the correct network (Celo)

#### Performance Optimization:

1. **Enable Vercel Analytics** for performance monitoring
2. **Use Vercel Edge Functions** for API routes if needed
3. **Configure caching** in `vercel.json` for static assets

### Environment-Specific Configurations

#### Development
- Uses local RPC URL
- Debug mode enabled
- Hot reload enabled

#### Preview
- Uses production RPC URL
- Debug mode disabled
- Optimized for testing

#### Production
- Uses production RPC URL
- All optimizations enabled
- Analytics and monitoring active

### Security Considerations

The deployment includes:
- Security headers in `vercel.json`
- Content Security Policy
- XSS protection
- Frame options protection
- Referrer policy

### Monitoring and Maintenance

1. **Monitor Performance**:
   - Use Vercel Analytics
   - Monitor Core Web Vitals
   - Check error rates

2. **Regular Updates**:
   - Keep dependencies updated
   - Monitor for security vulnerabilities
   - Update smart contract addresses as needed

### Support

For issues related to:
- **Vercel Deployment**: Check Vercel documentation
- **Next.js**: Check Next.js documentation
- **Web3 Integration**: Check Wagmi/RainbowKit docs
- **Celo Network**: Check Celo documentation

---

**Note**: Make sure to test your deployment thoroughly in preview mode before promoting to production.