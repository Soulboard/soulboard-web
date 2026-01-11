# Soulboard SDK Documentation

The Soulboard SDK provides a TypeScript/JavaScript interface for interacting with the Soulboard smart contracts on Solana.

## Installation

```bash
npm install soulboard-sdk
# or
yarn add soulboard-sdk
# or
pnpm add soulboard-sdk
```

## Quick Start

```typescript
import { SoulboardClient } from 'soulboard-sdk';
import { AnchorProvider } from '@coral-xyz/anchor';
import { Connection, Keypair } from '@solana/web3.js';
import NodeWallet from '@coral-xyz/anchor/dist/cjs/nodewallet';

// Setup connection and wallet
const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
const keypair = Keypair.fromSecretKey(/* your secret key */);
const wallet = new NodeWallet(keypair);

// Create provider
const provider = new AnchorProvider(connection, wallet, { commitment: 'confirmed' });

// Initialize client
const client = new SoulboardClient({ provider });

// Now you can use the client
const advertiser = await client.advertisers.create();
```

## Client Structure

The `SoulboardClient` provides access to different service modules:

```typescript
client.advertisers  // Advertiser account operations
client.providers    // Provider account operations  
client.campaigns    // Campaign management
client.locations    // Location management
client.oracle       // Oracle operations (separate client)
```

## Services

### Advertiser Service

Manage advertiser accounts and metadata.

#### Create Advertiser

```typescript
const advertiser = await client.advertisers.create();
// Returns: { address: PublicKey, data: AdvertiserAccount }
```

#### Fetch Advertiser

```typescript
const advertiser = await client.advertisers.fetch(authorityPubkey);
// Returns: { address: PublicKey, data: AdvertiserAccount }
```

#### List All Advertisers

```typescript
const advertisers = await client.advertisers.list();
// Returns: Array<{ address: PublicKey, data: AdvertiserAccount }>
```

### Provider Service

Manage provider accounts.

#### Create Provider

```typescript
const provider = await client.providers.create();
```

#### Fetch Provider

```typescript
const provider = await client.providers.fetch(authorityPubkey);
```

### Campaign Service

Create and manage advertising campaigns.

#### Create Campaign

```typescript
const campaign = await client.campaigns.create(
  'Campaign Name',
  'Campaign description',
  'https://example.com/image.png',
  1_000_000_000, // 1 SOL budget in lamports
  100_000_000    // 0.1 SOL daily cap (optional)
);
```

#### Add Budget

```typescript
await client.campaigns.addBudget(
  campaignId,
  500_000_000  // Add 0.5 SOL
);
```

#### Withdraw Budget

```typescript
await client.campaigns.withdrawBudget(
  campaignId,
  200_000_000  // Withdraw 0.2 SOL
);
```

#### Close Campaign

```typescript
await client.campaigns.close(campaignId);
```

#### Fetch Campaign

```typescript
const campaign = await client.campaigns.fetch(authority, campaignId);
```

#### List All Campaigns

```typescript
const campaigns = await client.campaigns.list();
```

### Location Service

Register and manage physical advertising locations.

#### Register Location

```typescript
const location = await client.locations.register(
  'Location Name',
  'Location description',
  10_000_000,      // 0.01 SOL per day
  oracleAuthority  // PublicKey of authorized oracle
);
```

#### Update Location Details

```typescript
await client.locations.updateDetails(
  locationId,
  'New Name',        // or null to keep current
  'New Description'  // or null to keep current
);
```

#### Update Location Price

```typescript
await client.locations.updatePrice(
  locationId,
  15_000_000  // New price: 0.015 SOL per day
);
```

#### Set Location Status

```typescript
await client.locations.setStatus(
  locationId,
  { offline: {} }  // or { available: {} } or { booked: {} }
);
```

#### Book Location for Campaign

```typescript
const booking = await client.locations.book(
  campaignId,
  locationId,
  providerAuthority
);
```

#### Cancel Booking

```typescript
await client.locations.cancelBooking(
  campaignId,
  locationId,
  providerAuthority
);
```

#### Settle Campaign Location

```typescript
const settlement = await client.locations.settle(
  campaignId,
  locationId,
  providerAuthority,
  impressionCount
);
```

#### Fetch Location

```typescript
const location = await client.locations.fetch(authority, locationId);
```

#### Fetch Campaign Location (Booking)

```typescript
const booking = await client.locations.fetchCampaignLocation(
  campaignAuthority,
  campaignId,
  providerAuthority,
  locationId
);
```

#### List All Locations

```typescript
const locations = await client.locations.list();
```

## Oracle Client

For oracle-specific operations, use the `OracleClient`:

```typescript
import { OracleClient } from 'soulboard-sdk';

const oracleClient = new OracleClient({ provider });

// Register device
const registry = await oracleClient.devices.registerRegistry(
  'Registry Name',
  maxDevices
);

const device = await oracleClient.devices.registerDevice(
  deviceId,
  'Device Name',
  { latitude, longitude }
);
```

## Type Definitions

### AdvertiserAccount

```typescript
interface AdvertiserAccount {
  authority: PublicKey;
  lastCampaignId: BN;
  campaignCount: BN;
}
```

### CampaignAccount

```typescript
interface CampaignAccount {
  authority: PublicKey;
  advertiser: PublicKey;
  name: string;
  description: string;
  imageUrl: string;
  availableBudget: BN;
  reservedBudget: BN;
  totalSpent: BN;
  status: CampaignStatus;
  dailyBudgetCap: BN | null;
  createdAt: BN;
}

type CampaignStatus = 
  | { active: {} }
  | { paused: {} }
  | { closed: {} };
```

### LocationAccount

```typescript
interface LocationAccount {
  authority: PublicKey;
  provider: PublicKey;
  name: string;
  description: string;
  pricePerDay: BN;
  status: LocationStatus;
  oracleAuthority: PublicKey;
  createdAt: BN;
}

type LocationStatus =
  | { available: {} }
  | { booked: {} }
  | { offline: {} };
```

### CampaignLocationAccount

```typescript
interface CampaignLocationAccount {
  campaign: PublicKey;
  location: PublicKey;
  provider: PublicKey;
  price: BN;
  startTime: BN;
  status: BookingStatus;
  totalImpressions: BN;
  totalPaid: BN;
}

type BookingStatus =
  | { active: {} }
  | { settled: {} }
  | { cancelled: {} };
```

## Error Handling

The SDK throws typed errors:

```typescript
import { SdkError, AccountNotFoundError, TransactionFailedError } from 'soulboard-sdk';

try {
  await client.campaigns.create(/* ... */);
} catch (error) {
  if (error instanceof AccountNotFoundError) {
    console.error('Account not found:', error.account);
  } else if (error instanceof TransactionFailedError) {
    console.error('Transaction failed:', error.message);
    console.error('Logs:', error.logs);
  } else if (error instanceof SdkError) {
    console.error('SDK error:', error.message);
  }
}
```

## Advanced Usage

### Custom Program IDs

```typescript
import { PublicKey } from '@solana/web3.js';

const client = new SoulboardClient({
  provider,
  programId: new PublicKey('YourCustomProgramId')
});
```

### Event Subscriptions

```typescript
// Subscribe to account changes
const unsubscribe = await client.advertisers.onChange(
  authorityPubkey,
  (account) => {
    console.log('Advertiser updated:', account);
  }
);

// Later, unsubscribe
await unsubscribe();
```

### Batch Operations

```typescript
// Fetch multiple accounts efficiently
const [campaign1, campaign2, campaign3] = await Promise.all([
  client.campaigns.fetch(authority, 0),
  client.campaigns.fetch(authority, 1),
  client.campaigns.fetch(authority, 2),
]);
```

## Best Practices

1. **Reuse Client Instances**: Create one client and reuse it
2. **Handle Errors**: Always wrap SDK calls in try-catch
3. **Check Balances**: Ensure sufficient SOL before transactions
4. **Use Confirmations**: Wait for transaction confirmations
5. **Cache PDAs**: Cache derived addresses when possible

## Examples

See the [examples directory](../../examples/) for complete working examples.
