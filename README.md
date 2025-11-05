# PoolFi - Decentralized Savings Platform

A collaborative savings platform built on the Celo blockchain that allows users to create and join savings pools, contribute funds, and withdraw when goals are reached.

## 🌟 Features

- **Pool Creation**: Create savings pools with custom targets and contribution amounts
- **Collaborative Saving**: Join pools and contribute with others
- **Smart Withdrawals**: Automatic fund distribution when goals are met
- **Real-time Tracking**: Monitor pool progress and recent activities
- **Wallet Integration**: Connect with various Web3 wallets
- **Mobile Responsive**: Works seamlessly on all devices

## 🚀 Live Demo

- **Frontend**: [poolfi.vercel.app](https://poolfi.vercel.app)
- **Contract**: `0x7EF2e0048f5bAeDe046f6BF797943daF4ED8CB47` (Celo Mainnet)

## 🏗️ Project Structure

```
poolfi/
├── frontend/                 # Next.js frontend application
│   ├── app/                 # App router pages
│   ├── components/          # React components
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility libraries
│   └── public/              # Static assets (images, icons, etc.)
├── contracts/               # Solidity smart contracts
│   ├── contracts/           # Contract source files
│   ├── scripts/              # Deployment scripts
│   ├── test/                 # Test files
│   └── README.md             # Contract documentation
└── README.md                # This file
```

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Wagmi** - React hooks for Ethereum
- **RainbowKit** - Wallet connection UI
- **Viem** - TypeScript interface for Ethereum

### Smart Contracts
- **Solidity** - Smart contract language
- **Celo** - Deployed on Celo mainnet

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Nnadijoshuac/poolfi.git
   cd poolfi
   ```

2. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Update `.env.local` with your values:
   ```env
   NEXT_PUBLIC_POOL_MANAGER_ADDRESS=0x7EF2e0048f5bAeDe046f6BF797943daF4ED8CB47
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_id
   NEXT_PUBLIC_CELO_RPC_URL=https://forno.celo.org
   NEXT_PUBLIC_CELO_CHAIN_ID=42220
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🌐 Deployment

### Vercel (Recommended)

1. **Connect to Vercel**
   - Import your GitHub repository
   - Set build command: `npm run build`
   - Set output directory: `.next`

2. **Set Environment Variables**
   - `NEXT_PUBLIC_POOL_MANAGER_ADDRESS`
   - `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
   - `NEXT_PUBLIC_CELO_RPC_URL`
   - `NEXT_PUBLIC_CELO_CHAIN_ID`

3. **Deploy**
   - Vercel will automatically deploy on every push to main

## 📱 Usage

1. **Connect Wallet**
   - Click "Connect Wallet" button
   - Select your preferred wallet
   - Connect to Celo network

2. **Create a Pool**
   - Click "Create Pool" button
   - Fill in pool details (name, target amount, contribution amount, max members)
   - Confirm transaction

3. **Join a Pool**
   - Browse available pools
   - Click "Join Pool" on desired pool
   - Confirm contribution transaction

4. **Withdraw Funds**
   - When pool reaches target, click "Withdraw"
   - Funds will be sent to your wallet

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Linting
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
```

### Project Structure

- **`/app`** - Next.js App Router pages
- **`/components`** - Reusable React components
- **`/hooks`** - Custom React hooks for blockchain interaction
- **`/lib`** - Utility functions and configurations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built for the Celo Ecosystem
- Powered by Celo blockchain
- UI components from Tailwind CSS
- Wallet integration via RainbowKit

## 📞 Support

For support, email support@poolfi.com or join our Discord community.

---

**PoolFi** - Save together, achieve more! 🚀