FROM oven/bun:1.2.17-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json bun.lock ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Create directory for solana config
RUN mkdir -p /root/.config/solana

# Expose any ports if needed (optional)
# EXPOSE 3000

# Set default command
CMD ["bun", "run", "index.ts"] 