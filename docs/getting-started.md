# Getting Started with Soulboard

This guide will help you get started with Soulboard, whether you're an advertiser, location provider, or developer.

## Prerequisites

- Node.js v18 or higher
- Solana CLI tools
- A Solana wallet with devnet SOL

## Installation

### For Developers

#### Installing the SDK

```bash
npm install soulboard-sdk
# or
yarn add soulboard-sdk
```

#### Installing the CLI

```bash
cd cli
npm install
npm run build
```

## Quick Start

### 1. Set Up Your Wallet

Create a Solana keypair or use an existing one:

```bash
solana-keygen new -o ~/.config/solana/devnet.json
```

Get devnet SOL:

```bash
solana airdrop 2 --keypair ~/.config/solana/devnet.json --url devnet
```

### 2. Create an Advertiser Account

Using the CLI:

```bash
npm start -- advertiser create
```

Using the SDK:

```typescript
import { SoulboardClient } from 'soulboard-sdk';
import { AnchorProvider } from '@coral-xyz/anchor';
import { Connection, Keypair } from '@solana/web3.js';

const connection = new Connection('https://api.devnet.solana.com');
const wallet = Keypair.fromSecretKey(/* your secret key */);
const provider = new AnchorProvider(connection, wallet, {});

const client = new SoulboardClient({ provider });
const advertiser = await client.advertisers.create();
console.log('Advertiser created:', advertiser.address.toString());
```

### 3. Create a Campaign

Using the CLI:

```bash
npm start -- campaign create \
  --name "My First Campaign" \
  --budget 1.0 \
  --description "Test campaign"
```

Using the SDK:

```typescript
const campaign = await client.campaigns.create(
  'My First Campaign',
  'Test campaign',
  '',
  1_000_000_000 // 1 SOL in lamports
);
console.log('Campaign created:', campaign.address.toString());
```

### 4. Register a Location (For Providers)

Using the CLI:

```bash
npm start -- provider create
npm start -- location register \
  --name "Downtown Billboard" \
  --price 0.01 \
  --description "Prime location"
```

Using the SDK:

```typescript
// Create provider account
const provider = await client.providers.create();

// Register location
const location = await client.locations.register(
  'Downtown Billboard',
  'Prime location',
  10_000_000, // 0.01 SOL per day
  oracleAuthority
);
```

### 5. Book a Location

Using the CLI:

```bash
npm start -- location book \
  --campaign-id 0 \
  --location-id 0 \
  --provider <PROVIDER_AUTHORITY>
```

Using the SDK:

```typescript
const booking = await client.locations.book(
  0, // campaign ID
  0, // location ID
  providerAuthority
);
console.log('Location booked:', booking.address.toString());
```

## Next Steps

- [Learn about the Architecture](./architecture.md)
- [Explore SDK Features](./sdk/README.md)
- [Read the Smart Contract Documentation](./contracts/README.md)
- [Set up the Oracle Service](./oracle/README.md)

## Troubleshooting

### Common Issues

#### Transaction Signature Verification Failed

Make sure you're using the correct wallet and that it has sufficient SOL:

```bash
solana balance --url devnet
```

#### Account Not Found

Ensure you've created the required accounts (advertiser/provider) before trying to create campaigns or locations.

#### RPC Rate Limiting

If you encounter rate limiting errors, try:
- Using a private RPC endpoint
- Adding delays between transactions
- Using a different devnet RPC provider

## Support

- [GitHub Issues](https://github.com/yourusername/soulboard-web/issues)
- [Discord Community](#)
- [Documentation](./README.md)
