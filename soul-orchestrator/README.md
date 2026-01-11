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

- `RPC_URL`: Solana RPC URL (default: devnet)
- `WALLET_PATH`: path to a Solana keypair (default: `~/.config/solana/id.json`)
- `THINGSPEAK_URL`: ThingSpeak feed URL with channel id
- `LOCATION_PUBKEY` / `DEVICE_LOCATION`: location account pubkey used when registering a device
- `DEVICE_IDX`: device index to report against (optional; will be stored after first registration)
- `DEVICE_AUTHORITY`: device authority pubkey (optional; defaults to wallet)
- `ALLOW_REGISTER`: set to `false` to disable auto registration
- `POLL_INTERVAL_MS`: polling interval in ms (default: 120000)
- `STATE_PATH`: local JSON state file path (default: `oracle-state.json`)

## Notes

- If the device does not exist, the orchestrator will auto-create a registry and register a device
  (requires `LOCATION_PUBKEY` and the wallet being the device authority).
- `field1` is mapped to `views`, `field2` is mapped to `impressions`.
- The orchestrator stores the last processed ThingSpeak entry in `STATE_PATH`.

## Read current on-chain metrics

```bash
bun run get-oracle-data.ts
```
