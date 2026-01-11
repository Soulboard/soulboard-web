# Soulboard Programs

This folder contains two Solana programs written with Anchor:

- `soulboard`: campaign and location management, booking, escrow, and settlement.
- `SoulBoardOracle`: device registry and metrics reporting for locations.

The code is organized by responsibility:

- `context.rs`: Anchor account context definitions and PDA seeds.
- `states.rs`: on-chain account models, enums, and events.
- `errors.rs`: program-specific error codes.
- `instructions/`: instruction handlers for each feature group.
- `utils.rs` (soulboard only): shared helpers for validation and lamport movement.

## Program: soulboard

### Core accounts and PDAs

- `Advertiser` PDA
  - Seeds: `[ADVERTISER_KEY, advertiser_authority]`
  - Tracks campaign counters for the advertiser (Alice).
- `Provider` PDA
  - Seeds: `[PROVIDER_KEY, provider_authority]`
  - Tracks location counters for the provider (Bob).
- `Campaign` PDA
  - Seeds: `[CAMPAIGN_KEY, advertiser_authority, campaign_idx]`
  - Holds campaign metadata and budgets.
- `Location` PDA
  - Seeds: `[LOCATION_KEY, provider_authority, location_idx]`
  - Holds location metadata and pricing.
- `CampaignLocation` PDA
  - Seeds: `[CAMPAIGN_LOCATION_KEY, campaign_pubkey, location_pubkey]`
  - Escrow account for a booking; stores price and settlement status.

### Budgets and escrow

- `available_budget`: funds that can be booked.
- `reserved_budget`: funds locked in `CampaignLocation` escrow.
- Booking moves lamports from `Campaign` to `CampaignLocation`.
- Settlement moves lamports from `CampaignLocation` to the provider and refunds the remainder to `Campaign`.

### Instruction summary

- `create_advertiser`: create advertiser PDA.
- `create_provider`: create provider PDA.
- `create_campaign`: create campaign PDA and optionally fund it.
- `update_campaign`: update name/description/image while active.
- `add_budget`: deposit lamports into the campaign.
- `withdraw_budget`: withdraw available budget while keeping rent-exempt balance.
- `close_campaign`: close only when no reserved budget remains.
- `register_location`: create location PDA and set price/status/oracle authority.
- `update_location_details`: update name/description.
- `update_location_price`: change price.
- `set_location_status`: set Available or Inactive (not Booked).
- `add_campaign_location`: book a location and create escrow.
- `remove_campaign_location`: cancel a booking and refund escrow.
- `settle_campaign_location`: release escrow to provider and refund remainder.

## Program: SoulBoardOracle

### Core accounts and PDAs

- `DeviceRegistry` PDA
  - Seeds: `[DEVICE_REGISTRY_KEY, registry_authority]`
  - Tracks device counters.
- `Device` PDA
  - Seeds: `[DEVICE_KEY, device_authority, device_idx]`
  - Stores location, oracle authority, and aggregated metrics.

### Instruction summary

- `create_device_registry`: create registry PDA.
- `register_device`: create device PDA with location and oracle authority.
- `update_device_location`: change the linked location.
- `update_device_oracle`: change the oracle authority.
- `set_device_status`: set device Active or Inactive.
- `report_device_metrics`: oracle updates aggregated views/impressions.

## Alice and Bob flow (example)

Alice is an advertiser. Bob is a location provider (location manager).

1. Alice creates her advertiser profile:
   - `create_advertiser`
2. Bob creates his provider profile:
   - `create_provider`
3. Alice creates a campaign with a budget:
   - `create_campaign(name, description, image_url, budget)`
4. Bob registers a location (with oracle authority):
   - `register_location(name, description, price, oracle_authority)`
5. Alice books Bob's location:
   - `add_campaign_location(campaign_idx, location_idx)`
   - Funds move from `Campaign` to `CampaignLocation` escrow.
6. Campaign runs off-chain. When ready to settle:
   - The oracle signs `settle_campaign_location(campaign_idx, location_idx, settlement_amount)`
   - `settlement_amount` goes to Bob, remainder returns to Alice's campaign.
7. If Alice needs to cancel instead:
   - `remove_campaign_location(campaign_idx, location_idx)`
   - Escrow is refunded back to the campaign.
8. When all bookings are settled:
   - `close_campaign(campaign_idx)`

### Optional device metrics

If Bob installs a device at his location and wants oracle metrics:

1. Bob creates a device registry and device:
   - `create_device_registry`
   - `register_device(location_pubkey, oracle_authority)`
2. Oracle reports metrics:
   - `report_device_metrics(device_idx, views, impressions)`
3. Bob can update or pause devices:
   - `update_device_location`, `update_device_oracle`, `set_device_status`

## Invariants and safety checks

- Only campaign authority can modify budgets and campaign details.
- Only provider authority can modify locations and prices.
- Booking requires an active campaign, an available location, and enough budget.
- Settlement cannot exceed the booked price.
- Budget withdrawals ensure rent-exempt balances remain.

## Build

From each program directory:

```sh
CARGO_TARGET_DIR=target cargo build
```

If you have an Anchor workspace configured, you can also run `anchor build` at the workspace root.
