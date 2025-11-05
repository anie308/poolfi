# PoolFi Project Summary

## Project Overview

**PoolFi** is a decentralized collaborative savings platform built on the Celo blockchain. It enables users to create and join savings pools, contribute funds collectively, and withdraw when goals are reached. The platform is designed for Web3 users who want to save together with friends, family, or communities.

### Live Deployment
- **Frontend**: https://poolfi.vercel.app
- **Smart Contract**: `0x7EF2e0048f5bAeDe046f6BF797943daF4ED8CB47` (Celo Mainnet)
- **Chain ID**: 42220

## Technology Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Web3 Integration**:
  - Wagmi v2.12.0 (React hooks for Ethereum)
  - RainbowKit v2.0.0 (Wallet connection UI)
  - Viem v2.0.0 (TypeScript interface for Ethereum)
- **State Management**: React Query (TanStack Query v5)
- **Notifications**: React Hot Toast v2.4.1
- **Storage**: LocalForage (client-side storage)

### Backend/Database
- **Database**: PostgreSQL (via Prisma ORM)
- **ORM**: Prisma v6.17.1
- **Alternative DB**: Supabase (for waitlist functionality)
- **Email Service**: Configured (via `lib/email.ts`)

### Blockchain
- **Network**: Celo Mainnet (Chain ID: 42220)
- **RPC URL**: Configurable via `NEXT_PUBLIC_CELO_RPC_URL`
- **Native Currency**: CELO (18 decimals)
- **Contract Language**: Solidity
- **Contract Interaction**: Direct contract calls via Viem

## Project Structure

```
poolfi/
├── frontend/                    # Main Next.js application
│   ├── app/                     # Next.js App Router pages
│   │   ├── admin/              # Admin dashboard
│   │   ├── api/                # API routes
│   │   │   ├── admin/waitlist/ # Admin waitlist management
│   │   │   └── waitlist/       # Public waitlist endpoints
│   │   ├── app/                # Main application dashboard
│   │   ├── pool/[id]/         # Individual pool pages
│   │   ├── page.tsx           # Landing page
│   │   └── layout.tsx         # Root layout
│   ├── components/             # React components
│   │   ├── landing/           # Landing page components
│   │   ├── modals/            # Modal dialogs
│   │   └── *.tsx              # Shared components
│   ├── hooks/                  # Custom React hooks
│   │   ├── usePoolManager.ts  # Pool management logic
│   │   └── useRecentActivities.ts
│   ├── lib/                    # Utility libraries
│   │   ├── blockchainService.ts # Blockchain event handling
│   │   ├── database.ts        # Database types/interfaces
│   │   ├── prisma.ts          # Prisma client
│   │   ├── supabase.ts        # Supabase client & waitlist service
│   │   ├── wagmi-config.ts    # Wagmi/RainbowKit configuration
│   │   └── reef-config.ts     # Reef chain configuration
│   ├── prisma/
│   │   └── schema.prisma      # Database schema
│   ├── public/                # Static assets
│   └── vercel.json            # Vercel deployment config
└── README.md                   # Project documentation
```

## Core Features

### 1. Pool Management
- **Create Pools**: Users can create savings pools with:
  - Custom name
  - Target amount (in REEF)
  - Contribution amount per member
  - Maximum number of members
  - Deadline (timestamp)
- **Join Pools**: Browse and join existing pools
- **Contribute**: Make contributions to pools (payable transactions)
- **Withdraw**: Withdraw funds when pool goals are reached
- **Cancel Pools**: Pool creators can cancel pools

### 2. Wallet Integration
- **Multi-Wallet Support**: Via RainbowKit (MetaMask, WalletConnect, etc.)
- **Network Management**: Automatic Reef Pelagia network configuration
- **Balance Display**: Show REEF token balance
- **Transaction Management**: Handle transaction confirmations and receipts

### 3. User Interface
- **Landing Page**: Marketing/onboarding page with:
  - Hero section
  - Feature explanations (Why PoolFi)
  - Contribution process visualization
  - Call-to-action sections
  - Footer
- **Dashboard**: Main application interface with:
  - Pool grid/list view
  - Portfolio overview
  - Recent activities feed
  - Wallet card
  - Action buttons (Create, Join, etc.)
- **Pool Details**: Individual pool pages with:
  - Pool information
  - Member list
  - Contribution history
  - Progress tracking

### 4. Waitlist System
- **Email Collection**: Users can sign up for waitlist
- **Database Storage**: Stored in PostgreSQL via Prisma/Supabase
- **Admin Panel**: Admin can view waitlist entries
- **Metadata Tracking**: Captures IP address, user agent, country

### 5. Recent Activities
- **Event Tracking**: Monitors blockchain events:
  - `PoolCreated`
  - `ContributionMade`
  - `PoolCompleted`
  - `FundsWithdrawn`
- **Activity Feed**: Displays recent user activities

## Smart Contract Integration

### Contract Address
- Default: `0x7EF2e0048f5bAeDe046f6BF797943daF4ED8CB47`
- Configurable via `NEXT_PUBLIC_POOL_MANAGER_ADDRESS`

### Contract Functions
The application interacts with a PoolManager smart contract that provides:

**Read Functions:**
- `poolCount()` - Get total number of pools
- `getPoolBasicInfo(poolId)` - Get basic pool information
- `getPoolFinancialInfo(poolId)` - Get financial data (target, current, contribution amounts)
- `getPoolMemberInfo(poolId)` - Get member information (max/current members)
- `getUserPools(userAddress)` - Get all pools for a user
- `hasUserContributed(poolId, userAddress)` - Check if user has contributed

**Write Functions:**
- `createPool(name, targetAmount, contributionAmount, maxMembers, deadline)`
- `contribute(poolId)` - Payable function
- `withdraw(poolId)`
- `cancelPool(poolId)`

**Events:**
- `PoolCreated`
- `ContributionMade`
- `PoolCompleted`
- `FundsWithdrawn`

## Database Schema

### Waitlist Table (Prisma)
```prisma
model Waitlist {
  id         String   @id @default(cuid())
  name       String
  email      String   @unique
  country    String?
  ipAddress  String?  @map("ip_address")
  userAgent  String?  @map("user_agent")
  createdAt  DateTime @default(now()) @map("created_at")
  updatedAt  DateTime @updatedAt @map("updated_at")

  @@map("waitlist")
}
```

## Environment Variables

### Required Variables
```env
# Smart Contract
NEXT_PUBLIC_POOL_MANAGER_ADDRESS=0x7EF2e0048f5bAeDe046f6BF797943daF4ED8CB47

# WalletConnect
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id

# Celo Network
NEXT_PUBLIC_CELO_RPC_URL=https://forno.celo.org
NEXT_PUBLIC_CELO_CHAIN_ID=42220

# Database (for Prisma)
DATABASE_URL=postgres://user:password@host:port/database

# Supabase (for waitlist)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## Deployment Configuration

### Vercel
- **Framework**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Root Directory**: `frontend` (if deploying from monorepo root)
- **Node Version**: 18+
- **Runtime**: Node.js

### Build Configuration
- **Output**: `standalone` mode enabled
- **Image Optimization**: WebP and AVIF formats
- **Security Headers**: X-Frame-Options, X-Content-Type-Options, etc.
- **Webpack**: Custom configuration for React Native module fallbacks

## Key Components

### Pages
- `/` - Landing page
- `/app` - Main dashboard
- `/pool/[id]` - Individual pool page
- `/admin` - Admin dashboard
- `/test-buttons` - Testing page
- `/simple-test` - Simple test page

### Modals
- `ConnectWalletModal` - Wallet connection
- `CreatePoolModal` - Pool creation form
- `JoinPoolModal` - Join existing pool
- `PoolDetailsModal` - Pool information
- `WithdrawFundsModal` - Withdrawal interface
- `WaitlistModal` - Waitlist signup
- `FundWalletModal` - Fund wallet interface
- `SendCryptoModal` - Send crypto interface
- `InviteMembersModal` - Invite members to pool

### Custom Hooks
- `usePoolManager()` - Main pool management hook
- `useCreatePool()` - Create pool functionality
- `useContribute()` - Contribute to pool
- `useWithdraw()` - Withdraw from pool
- `useCancelPool()` - Cancel pool
- `useREEFBalance()` - Get REEF token balance
- `useRecentActivities()` - Get recent blockchain activities

## API Routes

### Waitlist API (`/api/waitlist`)
- `POST /api/waitlist` - Add user to waitlist
- `GET /api/waitlist` - Get waitlist stats and recent users

### Admin API (`/api/admin/waitlist`)
- Admin-only endpoints for waitlist management

## Development Workflow

### Available Scripts
```bash
# Development
npm run dev          # Start dev server (port 3001)
npm run build        # Build for production
npm run start        # Start production server

# Database
npm run db:migrate   # Run Prisma migrations
npm run db:generate  # Generate Prisma client
npm run db:studio    # Open Prisma Studio
npm run db:push      # Push schema changes
npm run db:reset     # Reset database

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
npm run analyze      # Analyze bundle size
```

### Development Server
- Default port: `3001` (dev), `3000` (production)
- Hot reload enabled
- TypeScript compilation on save

## Security Considerations

1. **Environment Variables**: All sensitive data in env vars
2. **Wallet Security**: No private key storage, all operations through wallet providers
3. **Input Validation**: Client and server-side validation
4. **Security Headers**: XSS protection, frame options, content type nosniff
5. **Smart Contract**: Direct interaction with deployed contracts (no proxy)

## Known Limitations

1. **Blockchain Events**: Currently using mock implementation for event fetching (needs real blockchain event indexing)
2. **Smart Contracts**: Contract source code not in repository (only ABI and address)
3. **Database**: Using both Prisma and Supabase for different purposes (waitlist uses Supabase)

## Future Enhancements

Potential areas for improvement:
- Real blockchain event indexing (The Graph, Alchemy, etc.)
- Pool analytics and statistics
- Social features (pool sharing, member invites)
- Mobile app (React Native)
- Multi-chain support
- Pool categories/tags
- Advanced pool settings (recurring contributions, etc.)

## Dependencies Summary

### Key Production Dependencies
- `next`: 14.0.4
- `react`: ^18
- `react-dom`: ^18
- `wagmi`: ^2.12.0
- `@rainbow-me/rainbowkit`: ^2.0.0
- `viem`: ^2.0.0
- `@tanstack/react-query`: ^5.0.0
- `@prisma/client`: ^6.17.1
- `@supabase/supabase-js`: ^2.75.1
- `react-hot-toast`: ^2.4.1
- `localforage`: ^1.10.0

### Development Dependencies
- `typescript`: 5.9.3
- `tailwindcss`: ^3.3.0
- `eslint`: ^8
- `@next/bundle-analyzer`: ^14.0.4

## Notes

- The project is configured for deployment on Vercel
- Uses both Prisma (ORM) and Supabase (for waitlist) - could be consolidated
- Blockchain service has mock event fetching that needs real implementation
- Contract ABI is embedded in `usePoolManager.ts`
- Development server runs on port 3001 to avoid conflicts
- All blockchain interactions are client-side via Wagmi hooks

