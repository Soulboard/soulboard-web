FROM oven/bun:1.2.17-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY soul-orchestrator/package.json soul-orchestrator/bun.lock ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY soul-orchestrator /app

# Create directory for solana config
RUN mkdir -p /root/.config/solana

# Set default command
CMD ["bun", "run", "index.ts"] 