# Soulboard CLI Documentation

The Soulboard CLI is a command-line tool for interacting with the Soulboard platform on Solana.

## Installation

```bash
cd cli
npm install
npm run build
```

## Configuration

The CLI uses your Solana keypair from `~/.config/solana/phantom.json` by default. You can specify a different keypair with the `--keypair` option.

## Usage

```bash
npm start -- <command> [options]
```

## Commands

### Advertiser Commands

#### Create Advertiser Account

```bash
npm start -- advertiser create [--keypair <path>]
```

Creates a new advertiser account for the wallet.

**Example:**
```bash
npm start -- advertiser create
```

**Output:**
```
✔ Advertiser account created successfully!

Advertiser Details:
  Address: 2imeUc6aF5DCzFW6aXABdjEN9BpcAfnFPobaX3XZ6MkP
  Authority: DyEWZuwdgvYCLtqcnBPStcEKrqhbuymTCVXD6m47uXSx
  Total Campaigns: 0
```

#### View Advertiser Account

```bash
npm start -- advertiser view [--authority <pubkey>] [--keypair <path>]
```

Displays advertiser account details.

**Options:**
- `--authority`: Advertiser authority public key (defaults to connected wallet)
- `--keypair`: Path to wallet keypair

**Example:**
```bash
npm start -- advertiser view
```

---

### Provider Commands

#### Create Provider Account

```bash
npm start -- provider create [--keypair <path>]
```

Creates a new provider account.

**Example:**
```bash
npm start -- provider create
```

#### View Provider Account

```bash
npm start -- provider view [--authority <pubkey>] [--keypair <path>]
```

Displays provider account details.

---

### Campaign Commands

#### Create Campaign

```bash
npm start -- campaign create \
  --name <name> \
  --budget <sol> \
  [--description <text>] \
  [--image <url>] \
  [--keypair <path>]
```

Creates a new advertising campaign.

**Required Options:**
- `--name, -n`: Campaign name
- `--budget, -b`: Initial budget in SOL

**Optional Options:**
- `--description, -d`: Campaign description
- `--image, -i`: Campaign image URL
- `--keypair, -k`: Path to wallet keypair

**Example:**
```bash
npm start -- campaign create \
  --name "Summer Sale 2026" \
  --budget 5.0 \
  --description "Promotional campaign for summer products" \
  --image "https://example.com/banner.png"
```

#### Add Budget to Campaign

```bash
npm start -- campaign add-budget \
  --id <campaign_id> \
  --amount <sol> \
  [--keypair <path>]
```

Adds budget to an existing campaign.

**Example:**
```bash
npm start -- campaign add-budget --id 0 --amount 2.5
```

#### Withdraw Budget from Campaign

```bash
npm start -- campaign withdraw \
  --id <campaign_id> \
  --amount <sol> \
  [--keypair <path>]
```

Withdraws available budget from a campaign.

**Example:**
```bash
npm start -- campaign withdraw --id 0 --amount 1.0
```

#### Close Campaign

```bash
npm start -- campaign close \
  --id <campaign_id> \
  [--keypair <path>]
```

Closes a campaign and withdraws remaining budget.

**Example:**
```bash
npm start -- campaign close --id 0
```

---

### Location Commands

#### Register Location

```bash
npm start -- location register \
  --name <name> \
  --price <sol> \
  [--description <text>] \
  [--oracle <pubkey>] \
  [--keypair <path>]
```

Registers a new advertising location.

**Required Options:**
- `--name, -n`: Location name
- `--price, -p`: Daily rental price in SOL

**Optional Options:**
- `--description, -d`: Location description
- `--oracle, -o`: Oracle authority public key (defaults to wallet)
- `--keypair, -k`: Path to wallet keypair

**Example:**
```bash
npm start -- location register \
  --name "Times Square Billboard" \
  --price 0.5 \
  --description "Premium billboard in Times Square"
```

#### Book Location

```bash
npm start -- location book \
  --campaign-id <id> \
  --location-id <id> \
  --provider <pubkey> \
  [--keypair <path>]
```

Books a location for a campaign.

**Required Options:**
- `--campaign-id, -c`: Campaign index
- `--location-id, -l`: Location index
- `--provider, -p`: Provider authority public key (not provider account address)

**Example:**
```bash
npm start -- location book \
  --campaign-id 0 \
  --location-id 0 \
  --provider DyEWZuwdgvYCLtqcnBPStcEKrqhbuymTCVXD6m47uXSx
```

**Important:** The `--provider` flag expects the provider's **authority public key**, not the provider account address. To find this, use `provider view` command.

#### Cancel Booking

```bash
npm start -- location cancel \
  --campaign-id <id> \
  --location-id <id> \
  --provider <pubkey> \
  [--keypair <path>]
```

Cancels a location booking.

---

### View Commands

#### View All Campaigns

```bash
npm start -- view campaigns [--keypair <path>]
```

Lists all campaigns on the platform.

**Example Output:**
```
✔ Found 2 campaigns

📊 Campaigns:

1. Summer Sale 2026
   ID: 0
   Address: FkBK...8Zvi
   Authority: DyEW...uXSx
   Available Budget: 5.0 SOL
   Reserved Budget: 0.5 SOL
   Description: Promotional campaign
   Status: {"active":{}}

2. Winter Collection
   ID: 1
   ...
```

#### View All Locations

```bash
npm start -- view locations [--keypair <path>]
```

Lists all registered locations.

**Example Output:**
```
✔ Found 3 locations

📍 Locations:

1. Times Square Billboard
   ID: 0
   Address: 5tuN...4oGn
   Authority: DyEW...uXSx
   Price: 0.5 SOL/day
   Status: {"available":{}}
   Description: Premium billboard
```

#### View Wallet Balance

```bash
npm start -- view balance [--keypair <path>]
```

Shows your wallet's SOL balance.

**Example Output:**
```
✔ Balance fetched!

Wallet Details:
  Address: DyEWZuwdgvYCLtqcnBPStcEKrqhbuymTCVXD6m47uXSx
  Balance: 8.354354565 SOL
```

---

## Common Workflows

### Complete Advertiser Workflow

```bash
# 1. Create advertiser account
npm start -- advertiser create

# 2. Create a campaign
npm start -- campaign create \
  --name "My Campaign" \
  --budget 2.0 \
  --description "Test campaign"

# 3. View available locations
npm start -- view locations

# 4. Book a location (use provider authority from location details)
npm start -- location book \
  --campaign-id 0 \
  --location-id 0 \
  --provider <PROVIDER_AUTHORITY>

# 5. Monitor campaign
npm start -- view campaigns
```

### Complete Provider Workflow

```bash
# 1. Create provider account
npm start -- provider create

# 2. Register a location
npm start -- location register \
  --name "My Billboard" \
  --price 0.1 \
  --description "Great visibility"

# 3. View provider details
npm start -- provider view

# 4. List all locations
npm start -- view locations
```

---

## Troubleshooting

### Common Errors

#### "Failed to load keypair"

Make sure your keypair file exists and has the correct format:

```bash
ls -la ~/.config/solana/phantom.json
```

Or specify a different keypair:

```bash
npm start -- advertiser create --keypair /path/to/keypair.json
```

#### "Insufficient funds"

Get devnet SOL:

```bash
solana airdrop 2 --url devnet
```

#### "Account not found"

Make sure you've created the required parent accounts:
- Advertiser account before creating campaigns
- Provider account before registering locations

#### "The program expected this account to be already initialized"

This usually means:
- For booking: The provider authority is incorrect (use the authority pubkey, not the provider account address)
- For campaigns: The advertiser account doesn't exist yet

#### "Signature verification failed"

The wallet doesn't have permission. Make sure:
- You're using the correct keypair
- The account you're trying to modify belongs to your wallet

---

## Tips

1. **Check balances first**: Run `view balance` before expensive operations
2. **Test on devnet**: Always test workflows on devnet before mainnet
3. **Save account addresses**: Keep track of created account addresses
4. **Use descriptive names**: Makes viewing and debugging easier
5. **Batch operations**: Use shell scripts for repetitive tasks

---

## Examples

### Bash Script for Bulk Campaign Creation

```bash
#!/bin/bash

for i in {1..5}; do
  npm start -- campaign create \
    --name "Campaign $i" \
    --budget 1.0 \
    --description "Auto-generated campaign $i"
  
  sleep 2  # Avoid rate limiting
done
```

### Check All Your Accounts

```bash
#!/bin/bash

echo "=== Advertiser ==="
npm start -- advertiser view

echo "\n=== Provider ==="
npm start -- provider view

echo "\n=== Campaigns ==="
npm start -- view campaigns

echo "\n=== Balance ==="
npm start -- view balance
```

---

## Support

For issues or questions:
- Check the [main documentation](../README.md)
- Open an [issue on GitHub](https://github.com/yourusername/soulboard-web/issues)
- Join our [Discord community](#)
