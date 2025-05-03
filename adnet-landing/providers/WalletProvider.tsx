'use client'

import { PrivyProvider } from '@privy-io/react-auth';
import { type ReactNode } from 'react';
import { Config } from '@/lib/config';

export default function WalletProvider({ children }: { children: ReactNode }) {
const config = Config.getInstance()
const appid = config.privyAppId

  return (
    <PrivyProvider 
    appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID}
    config={{
    "appearance": {
      "accentColor": "#6A6FF5",
      "theme": "#222224",
      "showWalletLoginFirst": false,
      "logo": "https://auth.privy.io/logos/privy-logo-dark.png",
      "walletChainType": "solana-only",
      "walletList": [
        "detected_solana_wallets",
        "phantom",
        "solflare",
        "backpack",
        "okx_wallet"
      ]
    },
    "loginMethods": [
      "email",
      "wallet"
    ],
    "fundingMethodConfig": {
      "moonpay": {
        "useSandbox": true
      }
    },
    "embeddedWallets": {
      "requireUserPasswordOnCreate": false,
      "showWalletUIs": true,
      "ethereum": {
        "createOnLogin": "off"
      },
      "solana": {
        "createOnLogin": "users-without-wallets"
      }
    },
    "mfa": {
      "noPromptOnMfaRequired": false
    },
    "externalWallets": {
      "solana": {
        "connectors": {
          onMount: () => {},
          onUnmount: () => {},
          get: () => []
        }
      }
    }
  }}
  >
    {children}
  </PrivyProvider>
  );
}