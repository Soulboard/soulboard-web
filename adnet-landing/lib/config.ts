export class Config {
  private static instance: Config;
  private env: NodeJS.ProcessEnv;

  private constructor() {
    this.env = process.env;
  }

  public static getInstance(): Config {
    if (!Config.instance) {
      Config.instance = new Config();
    }
    return Config.instance;
  }

  // Solana
  get solanaRpcEndpoint(): string {
    return this.env.NEXT_PUBLIC_SOLANA_RPC_ENDPOINT || 'https://devnet.helius-rpc.com/?api-key=5f1828f6-a7b9-417d-9b7c-dadba932af8d';
  }

  get solanaCommitment(): string {
    return this.env.NEXT_PUBLIC_SOLANA_COMMITMENT || 'confirmed';
  }

  // Privy
  get privyAppId(): string {
    return this.env.NEXT_PUBLIC_PRIVY_APP_ID || '';
  }

  // API Keys
  get heliusApiKey(): string {
    return this.env.NEXT_PUBLIC_HELIUS_API_KEY || '';
  }

  // Program IDs
  get soulboardProgramId(): string {
    return this.env.NEXT_PUBLIC_SOULBOARD_PROGRAM_ID || '61yLHnb8vjRGzkKUPGjN4zviBfsy7wHmwwnZpNP8SfcQd';
  }

  // Feature Flags
  get enableTestMode(): boolean {
    return this.env.NEXT_PUBLIC_ENABLE_TEST_MODE === 'true';
  }

  // URLs
  get apiBaseUrl(): string {
    return this.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';
  }

  // Add more getters as needed for other environment variables
} 