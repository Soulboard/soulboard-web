import { useState, useEffect } from 'react';
import { SoulboardClient } from '../lib/SoulBoardClient';
import { usePrivy, useSolanaWallets } from '@privy-io/react-auth';


export function useAdvertiser() {

    const createAdveustiser = async (advertiser: any) => {
        const { user, ready } = usePrivy();
        const { wallets } = useSolanaWallets()
        const client = new SoulboardClient();
        await client.createAdvertiser();
    }
    
}