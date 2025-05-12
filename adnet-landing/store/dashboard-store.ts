import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import {useSendTransaction} from '@privy-io/react-auth/solana';
import {Connection, Transaction, VersionedTransaction} from '@solana/web3.js';
import { SoulboardClient, PrivyWallet, TimeSlotInput } from '@/lib/SoulBoardClient';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import BN from 'bn.js';
import { ConnectedSolanaWallet } from '@privy-io/react-auth/solana';

/* ──────────────────────────────────────────────────────────── */
/*                     Minimal domain models                    */
/* ──────────────────────────────────────────────────────────── */

export type CampaignStatus = 'Active' | 'Ended' | 'Paused';
export type LocationStatus = 'Active' | 'Maintenance' | 'Inactive';

export interface Campaign {
  id: string;            // PDA base-58
  name: string;
  description: string;
  imageUrl: string;
  status: CampaignStatus;
  budgetSOL: number;
}

export interface Location {
  id: string;            // PDA base-58
  name: string;
  description: string;
  status: LocationStatus;
  slotCount: number;
}

/* ──────────────────────────────────────────────────────────── */
/*                         Store shape                          */
/* ──────────────────────────────────────────────────────────── */

interface DashboardState {
  /* on-chain client (set after wallet connect) */
  client?: SoulboardClient;
  initialise: (wallet: PrivyWallet) => void;

  /* data */
  campaigns: Campaign[];
  locations: Location[];
  advertiser: { id: string; name: string; description: string; status: string } | null;
  provider: { id: string; name: string; description: string; status: string } | null;

  /* ui */
  isLoading: { campaigns: boolean; locations: boolean };
  error: { campaigns: string | null; locations: string | null };

  /* actions */
  fetchCampaigns: () => Promise<void>;
  fetchLocations: () => Promise<void>;
  createCampaign: (
    opts: {
      name: string;
      description: string;
      imageUrl: string;
      budgetSOL: number;
    }
  ) => Promise<string>;                          // returns Campaign PDA
  addBudget: (idx: number, extraSOL: number) => Promise<void>;
  registerLocation: (
    opts: {  name: string; description: string , slots  : TimeSlotInput[] }
  ) => Promise<string>;           
  registerAdvertiser :() => Promise<string>  // returns Location PDA
  registerProvider :() => Promise<string>  // returns Location PDA
}

/* ──────────────────────────────────────────────────────────── */
/*                     Helper formatters                        */
/* ──────────────────────────────────────────────────────────── */

const lamportsToSol = (lamports: BN | number) =>
  (typeof lamports === 'number' ? lamports : lamports.toNumber()) /
  LAMPORTS_PER_SOL;

/* ──────────────────────────────────────────────────────────── */
/*                           STORE                              */
/* ──────────────────────────────────────────────────────────── */

export const useDashboardStore = create<DashboardState>()(
  devtools(
    persist(
      (set, get) => ({
        /* ───────────── initial state ───────────── */
        campaigns: [],
        locations: [],
        advertiser : null,  
        provider : null,
        isLoading: { campaigns: false, locations: false },
        error: { campaigns: null, locations: null },

        /* ─────────── init Soulboard client ─────────── */
        initialise: (wallet) => {
          const client = new SoulboardClient(wallet);
          set({ client });
        },

        /* ───────────────── data actions ──────────────── */
        fetchCampaigns: async () => {
          const { client } = get();
          if (!client) return;

          set((s) => ({
            isLoading: { ...s.isLoading, campaigns: true },
            error: { ...s.error, campaigns: null },
          }));

          try {
            const list = await client.program.account.campaign.all();

            const campaigns: Campaign[] = list.map(({ account, publicKey }) => ({
              id: publicKey.toBase58(),
              name: account.campaignName,
              description: account.campaignDescription,
              imageUrl: account.campaignImageUrl,
              status: (account as any).isClosed ? 'Ended' : 'Active',
              budgetSOL: lamportsToSol((account as any).budget),
            }));

            set({
              campaigns,
              isLoading: { ...get().isLoading, campaigns: false },
            });
          } catch (err: any) {
            set({
              isLoading: { ...get().isLoading, campaigns: false },
              error: { ...get().error, campaigns: err.message ?? 'Fetch failed' },
            });
          }
        },

        fetchLocations: async () => {
          const { client } = get();
          if (!client) return;

          set((s) => ({
            isLoading: { ...s.isLoading, locations: true },
            error: { ...s.error, locations: null },
          }));

          try {
            const list = await client.program.account.location.all();

            const locations: Location[] = list.map(({ account, publicKey }) => ({
              id: publicKey.toBase58(),
              name: account.locationName,
              description: account.locationDescription,
              status: 'Active',                // refine if you encode status on-chain
              slotCount: account.slots.length,
            }));

            set({
              locations,
              isLoading: { ...get().isLoading, locations: false },
            });
          } catch (err: any) {
            set({
              isLoading: { ...get().isLoading, locations: false },
              error: { ...get().error, locations: err.message ?? 'Fetch failed' },
            });
          }
        },

        /* ───────────────── tx actions ─────────────── */

        createCampaign: async ({ name, description, imageUrl, budgetSOL }) => {
          const { client , advertiser } = get();
          if (!client) throw new Error('client not initialised');
          if (!advertiser) throw new Error('advertiser not initialised');

          const { campaignPda } = await client.createCampaign(
            { campaignName: name, campaignDescription: description, campaignImageUrl: imageUrl },
            new BN(budgetSOL * LAMPORTS_PER_SOL),
          );

          // optimistic-update
          set((s) => ({
            campaigns: [
              ...s.campaigns,
              {
                id: campaignPda.toBase58(),
                name,
                description,
                imageUrl,
                status: 'Active',
                budgetSOL,
              },
            ],
          }));

          return campaignPda.toBase58();
        },

        addBudget: async (campaignIdx, extraSOL) => {
          const { client } = get();
          if (!client) throw new Error('client not initialised');

          await client.addBudget(
            campaignIdx,
            new BN(extraSOL * LAMPORTS_PER_SOL),
          );

          // refresh from chain (cheaper: mutate locally)
          await get().fetchCampaigns();
        },

        registerLocation: async ({  name, description , slots }) => {
          const { client ,provider } = get();
          if (!client) throw new Error('client not initialised');
     

        
          await client.registerLocation( name, description, slots);

          const pda = client.getLocationPda(
            client.wallet.publicKey!,
            idx,
          )[0];

          set((s) => ({
            locations: [
              ...s.locations,
              {
                id: pda.toBase58(),
                name,
                description,
                status: 'Active',
                slotCount: 0,
              },
            ],
          }));

          return pda.toBase58();
        },

        registerAdvertiser: async () => {
          const { client , advertiser } = get();
          if (!client) throw new Error('client not initialised');

          await client.createAdvertiser();

          const pda = client.getAdvertiserPda(
            client.wallet.publicKey!,
          )[0];

          set((s) => ({
            ...s,
            advertiser: {
              id: pda.toBase58(),
              name: '',
              description: '',
              status: 'Active',
            },
          }));
          
          return pda.toBase58();
          
        },

        registerProvider: async () => {
          const { client } = get();
          if (!client) throw new Error('client not initialised');

          await client.createProvider();

          const pda = client.getProviderPda(
            client.wallet.publicKey!,
          )[0];

          set((s) => ({
            ...s,
            provider: {
              id: pda.toBase58(),
              name: '',
              description: '',
              status: 'Active',
            },
          }));

          
          return pda.toBase58();
        }
      }),
      {
        name: 'dashboard-storage',
        partialize: (s) => ({
          campaigns: s.campaigns,
          locations: s.locations,
        }),
      },
    ),
  ),
);
