# Smart Contracts Documentation

Soulboard consists of two Solana programs (smart contracts) written in Rust using the Anchor framework.

## Programs

1. **Soulboard Program**: Core advertising platform logic
2. **Oracle Program**: Metrics verification and reporting

## Soulboard Program

**Program ID (Devnet)**: `915wZsHsUJ7Pdei1XUY8jtdfia7D8t4r9XkhGD3TvrDV`

### Instructions

#### `create_advertiser`

Creates an advertiser account.

**Accounts:**
- `authority` (signer, writable): The wallet creating the account
- `advertiser` (writable): The PDA for the advertiser account
- `system_program`: Solana system program

**PDA Seeds:** `["advertiser", authority]`

**Example:**
```rust
pub fn create_advertiser(ctx: Context<CreateAdvertiser>) -> Result<()>
```

---

#### `create_campaign`

Creates a new advertising campaign.

**Accounts:**
- `advertiser` (writable): The advertiser account
- `campaign` (writable): The PDA for the campaign
- `authority` (signer, writable): The advertiser's wallet
- `system_program`: Solana system program

**Arguments:**
- `name: String`: Campaign name (max 100 chars)
- `description: String`: Description (max 500 chars)
- `image_url: String`: Image URL (max 200 chars)
- `initial_budget: u64`: Budget in lamports
- `daily_budget_cap: Option<u64>`: Optional daily spending limit

**PDA Seeds:** `["campaign", authority, &campaign_idx.to_le_bytes()]`

---

#### `add_budget`

Adds budget to an existing campaign.

**Accounts:**
- `campaign` (writable): The campaign account
- `authority` (signer, writable): Campaign owner
- `system_program`: Solana system program

**Arguments:**
- `campaign_idx: u64`: Campaign index
- `amount: u64`: Amount to add in lamports

---

#### `withdraw_budget`

Withdraws available budget from a campaign.

**Accounts:**
- `campaign` (writable): The campaign account
- `authority` (signer, writable): Campaign owner

**Arguments:**
- `campaign_idx: u64`: Campaign index
- `amount: u64`: Amount to withdraw

---

#### `close_campaign`

Closes a campaign and returns remaining funds.

**Accounts:**
- `advertiser` (writable): The advertiser account
- `campaign` (writable): The campaign account
- `authority` (signer, writable): Campaign owner

**Arguments:**
- `campaign_idx: u64`: Campaign index

---

#### `create_provider`

Creates a provider account.

**Accounts:**
- `authority` (signer, writable): Provider's wallet
- `provider` (writable): Provider PDA
- `system_program`: Solana system program

**PDA Seeds:** `["provider", authority]`

---

#### `register_location`

Registers a new advertising location.

**Accounts:**
- `provider` (writable): Provider account
- `authority` (signer, writable): Provider's wallet
- `location` (writable): Location PDA
- `system_program`: Solana system program

**Arguments:**
- `name: String`: Location name
- `description: String`: Location description
- `price_per_day: u64`: Daily rental price
- `oracle_authority: Pubkey`: Authorized oracle

**PDA Seeds:** `["location", authority, &location_idx.to_le_bytes()]`

---

#### `add_campaign_location`

Books a location for a campaign.

**Accounts:**
- `campaign` (writable): Campaign account
- `provider`: Provider account
- `location` (writable): Location account
- `campaign_location` (writable): Booking PDA
- `authority` (signer, writable): Campaign owner
- `system_program`: Solana system program

**Arguments:**
- `campaign_idx: u64`: Campaign index
- `location_idx: u64`: Location index

**PDA Seeds:** `["campaign_location", campaign, location]`

---

#### `remove_campaign_location`

Cancels a location booking.

**Accounts:**
- `campaign` (writable): Campaign account
- `provider`: Provider account
- `location` (writable): Location account
- `campaign_location` (writable): Booking account
- `authority` (signer, writable): Campaign owner

**Arguments:**
- `campaign_idx: u64`: Campaign index
- `location_idx: u64`: Location index

---

#### `settle_campaign_location`

Settles payment for a booking based on impressions.

**Accounts:**
- `campaign` (writable): Campaign account
- `location` (writable): Location account
- `campaign_location` (writable): Booking account
- `provider_authority` (writable): Provider's wallet
- `oracle` (signer): Oracle authority
- `campaign_authority` (writable): Campaign owner

**Arguments:**
- `campaign_idx: u64`: Campaign index
- `location_idx: u64`: Location index
- `impressions: u64`: Verified impression count

---

## Oracle Program

**Program ID (Devnet)**: `HbjHJmYYCSjfyiJWCRvaYWo1vKsgRurFDkrxNnNusVFX`

### Instructions

#### `register_device_registry`

Creates a registry for devices.

**Accounts:**
- `authority` (signer, writable): Registry owner
- `registry` (writable): Registry PDA
- `system_program`: Solana system program

**Arguments:**
- `name: String`: Registry name
- `max_devices: u32`: Maximum number of devices

---

#### `register_device`

Registers a device in the registry.

**Accounts:**
- `registry` (writable): Device registry
- `device` (writable): Device PDA
- `authority` (signer, writable): Registry owner
- `system_program`: Solana system program

**Arguments:**
- `device_id: u64`: Unique device identifier
- `name: String`: Device name
- `location: Option<GeoLocation>`: Physical location

---

#### `update_device_metrics`

Updates metrics for a device.

**Accounts:**
- `device` (writable): Device account
- `authority` (signer): Device owner

**Arguments:**
- `device_id: u64`: Device identifier
- `impressions: u64`: Impression count
- `engagement_rate: u16`: Engagement percentage

---

## Account Structures

### Advertiser

```rust
#[account]
pub struct Advertiser {
    pub authority: Pubkey,        // 32 bytes
    pub last_campaign_id: u64,    // 8 bytes
    pub campaign_count: u64,      // 8 bytes
}
// Total: 48 bytes + 8 (discriminator) = 56 bytes
```

### Campaign

```rust
#[account]
pub struct Campaign {
    pub authority: Pubkey,        // 32
    pub advertiser: Pubkey,       // 32
    pub name: String,             // 4 + 100
    pub description: String,      // 4 + 500
    pub image_url: String,        // 4 + 200
    pub available_budget: u64,    // 8
    pub reserved_budget: u64,     // 8
    pub total_spent: u64,         // 8
    pub status: CampaignStatus,   // 1 + variant
    pub daily_budget_cap: Option<u64>, // 1 + 8
    pub created_at: i64,          // 8
}
```

### Provider

```rust
#[account]
pub struct Provider {
    pub authority: Pubkey,        // 32
    pub last_location_id: u64,    // 8
    pub location_count: u64,      // 8
}
```

### Location

```rust
#[account]
pub struct Location {
    pub authority: Pubkey,        // 32
    pub provider: Pubkey,         // 32
    pub name: String,             // 4 + 100
    pub description: String,      // 4 + 500
    pub price_per_day: u64,       // 8
    pub status: LocationStatus,   // 1 + variant
    pub oracle_authority: Pubkey, // 32
    pub created_at: i64,          // 8
}
```

### CampaignLocation

```rust
#[account]
pub struct CampaignLocation {
    pub campaign: Pubkey,         // 32
    pub location: Pubkey,         // 32
    pub provider: Pubkey,         // 32
    pub price: u64,               // 8
    pub start_time: i64,          // 8
    pub status: BookingStatus,    // 1 + variant
    pub total_impressions: u64,   // 8
    pub total_paid: u64,          // 8
}
```

## Error Codes

### Soulboard Program Errors

```rust
#[error_code]
pub enum SoulboardError {
    #[msg("Campaign name too long")]
    NameTooLong,
    
    #[msg("Description too long")]
    DescriptionTooLong,
    
    #[msg("Insufficient campaign budget")]
    InsufficientBudget,
    
    #[msg("Campaign is not active")]
    CampaignNotActive,
    
    #[msg("Location is not available")]
    LocationNotAvailable,
    
    #[msg("Unauthorized oracle")]
    UnauthorizedOracle,
    
    #[msg("Invalid settlement amount")]
    InvalidSettlement,
    
    #[msg("Booking not active")]
    BookingNotActive,
}
```

## Events

The programs emit events for important state changes:

```rust
#[event]
pub struct CampaignCreated {
    pub campaign: Pubkey,
    pub authority: Pubkey,
    pub initial_budget: u64,
}

#[event]
pub struct LocationBooked {
    pub campaign: Pubkey,
    pub location: Pubkey,
    pub price: u64,
}

#[event]
pub struct SettlementProcessed {
    pub campaign_location: Pubkey,
    pub impressions: u64,
    pub amount_paid: u64,
}
```

## Security Considerations

1. **Authority Checks**: All sensitive operations verify signer authority
2. **Budget Validation**: Ensures sufficient funds before reserving/spending
3. **Oracle Verification**: Only authorized oracles can submit metrics
4. **PDA Derivation**: Deterministic account addresses prevent collisions
5. **Rent Exemption**: All accounts are rent-exempt

## Testing

Run the test suite:

```bash
anchor test
```

Key test scenarios:
- Account creation and initialization
- Budget management and transfers
- Location booking lifecycle
- Settlement calculations
- Error conditions and edge cases

## Deployment

### Devnet

```bash
anchor build
anchor deploy --provider.cluster devnet
```

### Mainnet

```bash
anchor build --verifiable
anchor deploy --provider.cluster mainnet
```

## Upgrading

The programs are upgradeable. To upgrade:

```bash
anchor build
anchor upgrade <PROGRAM_ID> --provider.cluster <CLUSTER> --program-keypair <KEYPAIR>
```

## Source Code

- Soulboard: `/programs/soulboard/src/`
- Oracle: `/programs/SoulBoardOracle/src/`
