# Deployment Guide

This guide covers deploying Soulboard to different environments.

## Prerequisites

- Solana CLI installed and configured
- Anchor CLI v0.31.0 or higher
- Node.js v18 or higher
- Sufficient SOL for deployment

## Environment Setup

### Devnet

```bash
# Set CLI to devnet
solana config set --url devnet

# Check your address
solana address

# Get devnet SOL
solana airdrop 5
```

### Mainnet

```bash
# Set CLI to mainnet
solana config set --url mainnet-beta

# Check balance
solana balance
```

## Smart Contract Deployment

### 1. Build Programs

```bash
# Clean previous builds
anchor clean

# Build programs
anchor build
```

### 2. Update Program IDs

After building, get the program IDs:

```bash
solana address -k target/deploy/soulboard-keypair.json
solana address -k target/deploy/soul_board_oracle-keypair.json
```

Update `Anchor.toml` and `lib.rs` files with these IDs.

### 3. Deploy to Devnet

```bash
# Deploy both programs
anchor deploy --provider.cluster devnet

# Or deploy individually
anchor deploy --provider.cluster devnet --program-name soulboard
anchor deploy --provider.cluster devnet --program-name soul_board_oracle
```

### 4. Verify Deployment

```bash
# Check soulboard program
solana program show 915wZsHsUJ7Pdei1XUY8jtdfia7D8t4r9XkhGD3TvrDV --url devnet

# Check oracle program
solana program show HbjHJmYYCSjfyiJWCRvaYWo1vKsgRurFDkrxNnNusVFX --url devnet
```

### 5. Update SDK

```bash
# Copy IDL and types to SDK
cp target/idl/soulboard.json soulboard-sdk/src/idl/
cp target/idl/soul_board_oracle.json soulboard-sdk/src/idl/
cp target/types/soulboard.ts soulboard-sdk/src/types/
cp target/types/soul_board_oracle.ts soulboard-sdk/src/types/

# Update program IDs in SDK
# Edit soulboard-sdk/src/programs/soulboard/pdas.ts
# Edit soulboard-sdk/src/programs/oracle/pdas.ts

# Build SDK
cd soulboard-sdk
npm run build
```

## SDK Deployment

### 1. Prepare Package

```bash
cd soulboard-sdk

# Update version in package.json
npm version patch  # or minor/major

# Build
npm run build

# Test
npm test
```

### 2. Publish to npm

```bash
# Login to npm (first time only)
npm login

# Publish
npm publish
```

### 3. Verify Publication

```bash
npm view soulboard-sdk
```

## CLI Deployment

### 1. Build CLI

```bash
cd cli
npm run build
```

### 2. Test CLI

```bash
npm start -- --help
npm start -- view balance
```

### 3. Package CLI (Optional)

```bash
# Package as npm module
npm pack

# Or create standalone executable
npm install -g pkg
pkg package.json
```

## Web Application Deployment

### 1. Configure Environment

Create `.env.local` in `soul-app/`:

```env
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_SOULBOARD_PROGRAM_ID=915wZsHsUJ7Pdei1XUY8jtdfia7D8t4r9XkhGD3TvrDV
NEXT_PUBLIC_ORACLE_PROGRAM_ID=HbjHJmYYCSjfyiJWCRvaYWo1vKsgRurFDkrxNnNusVFX
```

### 2. Build Application

```bash
cd soul-app
pnpm install
pnpm build
```

### 3. Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

Or use the Vercel dashboard:
1. Connect GitHub repository
2. Configure build settings
3. Add environment variables
4. Deploy

### 4. Deploy to Other Platforms

#### Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod --dir=soul-app/.next
```

#### Self-hosted

```bash
cd soul-app

# Build
pnpm build

# Start production server
pnpm start

# Or use PM2 for process management
pm2 start npm --name "soulboard-web" -- start
```

## Oracle Service Deployment

### 1. Configure Service

Edit `soul-orchestrator/config.ts`:

```typescript
export const config = {
  solanaRpcUrl: process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com',
  oracleKeypairPath: process.env.ORACLE_KEYPAIR_PATH || './oracle.json',
  programId: '915wZsHsUJ7Pdei1XUY8jtdfia7D8t4r9XkhGD3TvrDV',
  oracleProgramId: 'HbjHJmYYCSjfyiJWCRvaYWo1vKsgRurFDkrxNnNusVFX',
  pollingInterval: 60000, // 1 minute
};
```

### 2. Build and Run

```bash
cd soul-orchestrator
bun install
bun run index.ts
```

### 3. Deploy with Docker

```bash
# Build image
docker build -t soulboard-oracle .

# Run container
docker run -d \
  --name soulboard-oracle \
  -e SOLANA_RPC_URL=https://api.devnet.solana.com \
  -v $(pwd)/oracle.json:/app/oracle.json \
  soulboard-oracle
```

### 4. Deploy with Docker Compose

```bash
docker-compose up -d
```

## Monitoring and Maintenance

### Check Program Status

```bash
# Program info
solana program show <PROGRAM_ID>

# Recent transactions
solana transaction-history <WALLET_ADDRESS>

# Account info
solana account <ACCOUNT_ADDRESS>
```

### Monitor Logs

For web app (Vercel):
```bash
vercel logs
```

For oracle service:
```bash
# Docker logs
docker logs -f soulboard-oracle

# PM2 logs
pm2 logs soulboard-oracle
```

### Update Programs

```bash
# Build new version
anchor build

# Upgrade program
anchor upgrade <PROGRAM_ID> \
  --provider.cluster <CLUSTER> \
  --program-keypair target/deploy/<PROGRAM>-keypair.json
```

## Rollback Procedure

### Smart Contracts

```bash
# Deploy previous version
anchor upgrade <PROGRAM_ID> \
  --provider.cluster <CLUSTER> \
  --program-keypair <OLD_KEYPAIR>
```

### Web Application

On Vercel:
1. Go to Deployments
2. Find previous successful deployment
3. Click "Promote to Production"

### SDK

```bash
# Revert to previous version
npm publish soulboard-sdk@<previous-version>
```

## Security Checklist

- [ ] All program authority keys secured
- [ ] Upgrade authority properly set
- [ ] Rate limiting configured
- [ ] CORS properly configured
- [ ] Environment variables secured
- [ ] Monitoring and alerts set up
- [ ] Backup keypairs stored safely
- [ ] Bug bounty program considered
- [ ] Security audit completed (for mainnet)

## Mainnet Considerations

### Before Mainnet Launch

1. **Complete Audit**: Get smart contracts audited
2. **Bug Bounty**: Set up bug bounty program
3. **Insurance**: Consider getting smart contract insurance
4. **Monitoring**: Set up comprehensive monitoring
5. **Incident Response**: Have incident response plan
6. **Liquidity**: Ensure sufficient SOL for operations
7. **Testing**: Extensive testing on devnet/testnet
8. **Documentation**: Complete all documentation
9. **Legal**: Ensure legal compliance
10. **Communication**: Prepare announcement and support channels

### Mainnet Deployment

```bash
# Final checks
anchor build --verifiable
anchor test

# Deploy to mainnet
anchor deploy --provider.cluster mainnet-beta

# Verify deployment
solana program show <PROGRAM_ID> --url mainnet-beta
```

## Troubleshooting

### Deployment Fails

```bash
# Check balance
solana balance

# Increase compute budget
# Edit Anchor.toml: compute_units = 500000

# Retry deployment
anchor deploy --provider.cluster <CLUSTER>
```

### Program Upgrade Fails

```bash
# Check upgrade authority
solana program show <PROGRAM_ID>

# Set upgrade authority
solana program set-upgrade-authority <PROGRAM_ID> \
  --new-upgrade-authority <NEW_AUTHORITY>
```

### Web App Build Errors

```bash
# Clear cache
rm -rf .next
rm -rf node_modules
pnpm install
pnpm build
```

## Cost Estimates

### Devnet Deployment
- Program deployment: ~5 SOL (free on devnet)
- Account creation: ~0.01 SOL each
- Transactions: ~0.000005 SOL each

### Mainnet Deployment (Estimates)
- Program deployment: 10-50 SOL depending on program size
- Monthly operations: 1-10 SOL depending on usage
- Account rent: Calculated per account size

## Support

For deployment issues:
- Check [GitHub Issues](https://github.com/yourusername/soulboard-web/issues)
- Join [Discord](https://discord.gg/soulboard)
- Email: support@soulboard.xyz
