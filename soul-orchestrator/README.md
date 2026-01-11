# soul-orchestrator

Poll ThingSpeak and push metrics to the on-chain Oracle program using the Soulboard SDK.

## Install

```bash
bun install
```

## Run

```bash
bun run index.ts
```

## Environment

Copy `.env.example` to `.env` and configure:

- `RPC_URL`: Solana RPC URL (default: `https://api.devnet.solana.com`)
- `WALLET_PATH`: path to a Solana keypair (default: `~/.config/solana/phantom.json`)
- `THINGSPEAK_URL`: ThingSpeak feed URL with channel id
- `LOCATION_PUBKEY` / `DEVICE_LOCATION`: location account pubkey used when registering a device
- `DEVICE_IDX`: device index to report against (optional; will be stored after first registration)
- `DEVICE_AUTHORITY`: device authority pubkey (optional; defaults to wallet)
- `ALLOW_REGISTER`: set to `false` to disable auto registration
- `POLL_INTERVAL_MS`: polling interval in ms (default: 120000)
- `STATE_PATH`: local JSON state file path (default: `oracle-state.json`)

**Note**: The orchestrator now uses `phantom.json` by default (same as the CLI tool). Make sure your Phantom wallet keypair is exported at `~/.config/solana/phantom.json`.

## Docker Deployment

Build and run using Docker Compose:

```bash
# 1. Copy and configure environment variables
cp .env.example .env
# Edit .env and set LOCATION_PUBKEY and other required variables

# 2. Ensure your wallet is available
# The docker-compose.yaml mounts ~/.config/solana/phantom.json by default

# 3. Build and run
docker-compose up -d

# 4. View logs
docker-compose logs -f

# 5. Stop the service
docker-compose down
```

The Docker container will:
- Use the wallet at `~/.config/solana/phantom.json` (read-only mount)
- Store state in `./oracle-state.json` (persisted)
- Connect to devnet by default (configurable via `RPC_URL`)
- Poll every 2 minutes (configurable via `POLL_INTERVAL_MS`)

## Notes

- If the device does not exist, the orchestrator will auto-create a registry and register a device
  (requires `LOCATION_PUBKEY` and the wallet being the device authority).
- `field1` is mapped to `views`, `field2` is mapped to `impressions`.
- The orchestrator stores the last processed ThingSpeak entry in `STATE_PATH`.

## Read current on-chain metrics

```bash
bun run get-oracle-data.ts
```
