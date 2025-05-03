# AdNet Landing Page

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# Solana Configuration
NEXT_PUBLIC_SOLANA_RPC_ENDPOINT=https://devnet.helius-rpc.com/?api-key=your-api-key
NEXT_PUBLIC_SOLANA_COMMITMENT=confirmed

# Privy Configuration
NEXT_PUBLIC_PRIVY_APP_ID=your-privy-app-id

# API Keys
NEXT_PUBLIC_HELIUS_API_KEY=your-helius-api-key

# Program IDs
NEXT_PUBLIC_SOULBOARD_PROGRAM_ID=61yLHnb8vjRGzkKUPGjN4zviBfsy7wHmwwnZpNP8SfcQd

# Feature Flags
NEXT_PUBLIC_ENABLE_TEST_MODE=false

# API URLs
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
```

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Copy the environment variables:
```bash
cp .env.example .env.local
```

3. Update the environment variables in `.env.local` with your values

4. Run the development server:
```bash
npm run dev
``` 