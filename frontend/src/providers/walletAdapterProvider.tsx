"use client";

import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import { useMemo, useState, useEffect, type FC, type ReactNode } from "react";

// Only import Phantom wallet
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";

// Default styles that can be overridden by your app
import "@solana/wallet-adapter-react-ui/styles.css";

export const WalletAdapterProvider: FC<{ children: ReactNode }> = ({ children }) => {
  // Set to 'devnet' for testing
  const endpoint = useMemo(() => clusterApiUrl("devnet"), []);
  
  // Client-side only code
  const [mounted, setMounted] = useState(false);
  
  // Only using Phantom adapter
  const wallets = useMemo(() => [
    new PhantomWalletAdapter()
  ], []);
  
  // To fix hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {mounted && children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
