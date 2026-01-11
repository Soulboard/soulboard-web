# Soulboard CLI

CLI tool for testing the Soulboard SDK and Solana programs on devnet.

## Installation

```bash
npm install
npm run build
```

## Configuration

By default, the CLI uses the keypair at `~/.config/solana/phantom.json`. You can override this with the `-k` or `--keypair` option on any command.

## Quick Start

Check your wallet balance:
```bash
npm start -- view balance
```

## Usage

### Account Management

**Create Advertiser Account:**
```bash
npm start -- advertiser create
```

**View Advertiser Account:**
```bash
npm start -- advertiser view
```

**Create Provider Account:**
```bash
npm start -- provider create
```

**View Provider Account:**
```bash
npm start -- provider view
```

### Campaign Management

**Create Campaign:**
```bash
npm start -- campaign create -n "My Campaign" -b 5 -d "Campaign description"
```
- `-n, --name`: Campaign name (required)
- `-b, --budget`: Initial budget in SOL (required)
- `-d, --description`: Campaign description (optional)
- `-i, --image`: Campaign image URL (optional)

**Add Budget to Campaign:**
```bash
npm start -- campaign add-budget -i 0 -a 2.5
```
- `-i, --campaign-id`: Campaign index (required)
- `-a, --amount`: Amount in SOL to add (required)

**Withdraw from Campaign:**
```bash
npm start -- campaign withdraw -i 0 -a 1.0
```

**Close Campaign:**
```bash
npm start -- campaign close -i 0
```

### Location Management

**Register Location:**
```bash
npm start -- location register -n "Times Square Billboard" -p 1.5 -d "Premium location"
```
- `-n, --name`: Location name (required)
- `-p, --price`: Price per day in SOL (required)
- `-d, --description`: Location description (optional)
- `-o, --oracle`: Oracle authority public key (optional, defaults to wallet)

**Book Location:**
```bash
npm start -- location book -c 0 -l 0 -p <PROVIDER_PUBKEY>
```
- `-c, --campaign-id`: Campaign index (required)
- `-l, --location-id`: Location index (required)
- `-p, --provider`: Provider authority public key (required)

**Cancel Booking:**
```bash
npm start -- location cancel -c 0 -l 0 -p <PROVIDER_PUBKEY>
```

### View Data

**List All Campaigns:**
```bash
npm start -- view campaigns
```

**List All Locations:**
```bash
npm start -- view locations
```

**Check Wallet Balance:**
```bash
npm start -- view balance
```

## Example Workflow

1. **Create accounts:**
   ```bash
   # Create advertiser account
   npm start -- advertiser create
   
   # Create provider account  
   npm start -- provider create
   ```

2. **Register a location (as provider):**
   ```bash
   npm start -- location register -n "Downtown Billboard" -p 2 -d "High traffic area"
   ```

3. **Create a campaign (as advertiser):**
   ```bash
   npm start -- campaign create -n "Product Launch" -b 10 -d "New product advertising"
   ```

4. **Book the location:**
   ```bash
   # Get your wallet pubkey first
   npm start -- view balance
   # Then book using provider pubkey
   npm start -- location book -c 0 -l 0 -p <YOUR_WALLET_PUBKEY>
   ```

5. **View all data:**
   ```bash
   npm start -- view campaigns
   npm start -- view locations
   ```

## Help

For detailed help on any command:
```bash
npm start -- <command> --help
```

For example:
```bash
npm start -- campaign --help
npm start -- campaign create --help
```

## Notes

- All commands connect to Solana devnet
- Make sure you have devnet SOL in your wallet (get from https://faucet.solana.com/)
- Program addresses are configured in the SDK and match the deployed programs on devnet
- Campaign and location IDs start from 0 and increment for each new item created by your wallet
