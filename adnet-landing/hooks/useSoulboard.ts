import { useCallback } from 'react';
import { useDashboardStore } from '@/store/dashboard-store';
import { useSendTransaction } from '@privy-io/react-auth/solana';
import { Connection, PublicKey, Transaction, VersionedTransaction } from '@solana/web3.js';

interface CreateCampaignParams {
  name: string;
  description: string;
  imageUrl: string;
  budgetSOL: number;
}

interface CreateLocationParams {
  idx: number;
  name: string;
  description: string;
}

export const useSoulboard = () => {
  const {
    client,
    initialise,
    createCampaign: storeCreateCampaign,
    registerLocation: storeRegisterLocation,
    campaigns,
    locations,
    isLoading,
    error,
  } = useDashboardStore();

  const { sendTransaction } = useSendTransaction();
  const connection = new Connection('https://api.mainnet-beta.solana.com');

  // Initialize client if wallet is available
  const initializeClient = useCallback(() => {
    if (!client) {
      // Initialize with Privy's connection and transaction capabilities
      initialise({
        publicKey: new PublicKey(''), // This will be set by Privy
        sendTransaction: async (transaction: Transaction | VersionedTransaction) => {
          const receipt = await sendTransaction({
            transaction,
            connection
          });
          return receipt.signature;
        }
      });
    }
  }, [client, initialise, sendTransaction, connection]);

  // Create a new campaign
  const createCampaign = useCallback(
    async ({ name, description, imageUrl, budgetSOL }: CreateCampaignParams) => {
      if (!client) {
        throw new Error('Client not initialized. Please connect your wallet first.');
      }

      try {
        const campaignId = await storeCreateCampaign({
          name,
          description,
          imageUrl,
          budgetSOL,
        });
        return campaignId;
      } catch (error) {
        console.error('Failed to create campaign:', error);
        throw error;
      }
    },
    [client, storeCreateCampaign]
  );

  // Register a new location
  const registerLocation = useCallback(
    async ({ idx, name, description }: CreateLocationParams) => {
      if (!client) {
        throw new Error('Client not initialized. Please connect your wallet first.');
      }

      try {
        const locationId = await storeRegisterLocation({
          idx,
          name,
          description,
        });
        return locationId;
      } catch (error) {
        console.error('Failed to register location:', error);
        throw error;
      }
    },
    [client, storeRegisterLocation]
  );

  return {
    // State
    campaigns,
    locations,
    isLoading,
    error,
    
    // Actions
    initializeClient,
    createCampaign,
    registerLocation,
  };
}; 