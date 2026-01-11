# Soulboard Architecture

This document describes the overall architecture of the Soulboard platform.

## Overview

Soulboard is built on Solana and consists of several interconnected components:

```
┌─────────────────────────────────────────────────────────────────┐
│                         Web Application                          │
│                     (Next.js + React + UI)                       │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Soulboard SDK                             │
│              (TypeScript Client Library)                         │
└──────────────────────────┬──────────────────────────────────────┘
                           │
           ┌───────────────┴────────────────┐
           ▼                                ▼
┌──────────────────────┐         ┌──────────────────────┐
│  Soulboard Program   │         │   Oracle Program     │
│  (Smart Contract)    │◄────────┤  (Smart Contract)    │
└──────────────────────┘         └──────────────────────┘
           │                                ▲
           │                                │
           ▼                                │
┌──────────────────────┐         ┌──────────────────────┐
│   Solana Blockchain  │         │  Oracle Service      │
│                      │         │  (Off-chain)         │
└──────────────────────┘         └──────────────────────┘
```

## Core Components

### 1. Smart Contracts (On-chain)

#### Soulboard Program
The main smart contract handling:
- **Advertiser Management**: Account creation and campaign management
- **Provider Management**: Location registration and availability
- **Campaign Management**: Budget allocation, spending, and lifecycle
- **Booking System**: Location-campaign associations
- **Payment Escrow**: Secure fund management

Program ID: `915wZsHsUJ7Pdei1XUY8jtdfia7D8t4r9XkhGD3TvrDV`

#### Oracle Program
Handles verification and metrics:
- **Device Registry**: Physical device registration
- **Metrics Reporting**: Impression and engagement data
- **Verification**: Proof of advertising display

Program ID: `HbjHJmYYCSjfyiJWCRvaYWo1vKsgRurFDkrxNnNusVFX`

### 2. SDK (soulboard-sdk)

TypeScript/JavaScript client library providing:
- High-level API for all smart contract interactions
- Account management utilities
- Transaction builders
- Event listeners
- Type-safe interfaces

### 3. CLI Tool

Command-line interface for:
- Testing and development
- Administrative operations
- Bulk operations
- Automation scripts

### 4. Web Application (soul-app)

Next.js application featuring:
- Campaign creation and management UI
- Location browsing and booking
- Analytics dashboard
- Wallet integration
- Real-time updates

### 5. Oracle Service (soul-orchestrator)

Off-chain service that:
- Monitors physical advertising displays
- Collects metrics from IoT devices
- Submits verified data to blockchain
- Triggers settlements

## Data Model

### Account Types

#### Advertiser Account
```rust
pub struct Advertiser {
    pub authority: Pubkey,        // Wallet that owns this account
    pub last_campaign_id: u64,    // Counter for campaign IDs
    pub campaign_count: u64,      // Total campaigns created
}
```

#### Campaign Account
```rust
pub struct Campaign {
    pub authority: Pubkey,
    pub name: String,             // Campaign name
    pub description: String,      // Campaign description
    pub image_url: String,        // Ad creative URL
    pub available_budget: u64,    // Unspent budget
    pub reserved_budget: u64,     // Budget locked in bookings
    pub total_spent: u64,         // Historical spending
    pub status: CampaignStatus,   // Active/Paused/Closed
    pub daily_budget_cap: u64,    // Optional daily limit
    pub created_at: i64,
}
```

#### Provider Account
```rust
pub struct Provider {
    pub authority: Pubkey,
    pub last_location_id: u64,
    pub location_count: u64,
}
```

#### Location Account
```rust
pub struct Location {
    pub authority: Pubkey,
    pub name: String,
    pub description: String,
    pub price_per_day: u64,       // Daily rental price
    pub status: LocationStatus,    // Available/Booked/Offline
    pub oracle_authority: Pubkey,  // Authorized metrics reporter
    pub created_at: i64,
}
```

#### CampaignLocation (Booking)
```rust
pub struct CampaignLocation {
    pub campaign: Pubkey,
    pub location: Pubkey,
    pub provider: Pubkey,
    pub price: u64,               // Locked-in price
    pub start_time: i64,
    pub status: BookingStatus,    // Active/Settled/Cancelled
    pub total_impressions: u64,
    pub total_paid: u64,
}
```

## Transaction Flows

### Campaign Creation Flow

```
1. User submits campaign details
   ↓
2. SDK validates parameters
   ↓
3. Create Campaign instruction sent
   ↓
4. Smart contract:
   - Creates Campaign PDA
   - Transfers budget from user
   - Updates Advertiser account
   ↓
5. Confirmation returned
```

### Location Booking Flow

```
1. Advertiser selects location
   ↓
2. SDK checks availability
   ↓
3. AddCampaignLocation instruction
   ↓
4. Smart contract:
   - Creates CampaignLocation PDA
   - Reserves budget from campaign
   - Updates location status
   - Records booking details
   ↓
5. Booking confirmed
   ↓
6. Oracle begins monitoring
```

### Settlement Flow

```
1. Oracle collects metrics
   ↓
2. Oracle submits verified data
   ↓
3. Smart contract:
   - Verifies oracle signature
   - Calculates payment
   - Transfers from campaign to provider
   - Updates booking records
   ↓
4. Settlement confirmed
```

## Security Model

### Account Ownership
- All PDAs are owned by their respective programs
- User wallets only sign transactions
- No direct fund transfers between users

### Authorization
- Campaign operations require advertiser authority signature
- Location operations require provider authority signature
- Oracle operations require oracle authority signature

### Escrow Mechanism
- Funds locked in campaign accounts
- Budget reserved when booking locations
- Payments released only through verified settlements

## Scalability Considerations

### Parallel Processing
- Independent campaigns can process simultaneously
- Location bookings don't block each other
- Oracle submissions are parallelizable

### State Management
- PDAs derived deterministically
- Minimal account lookups
- Efficient data packing

### Cost Optimization
- Rent-exempt accounts
- Minimal compute units usage
- Batched operations where possible

## Future Enhancements

- [ ] Cross-chain bridge support
- [ ] NFT-based location ownership
- [ ] DAO governance for protocol parameters
- [ ] Advanced analytics and ML integration
- [ ] Multi-signature campaign management
- [ ] Staking mechanisms for providers
- [ ] Reputation system
