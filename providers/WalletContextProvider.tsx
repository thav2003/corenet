"use client";

import { FC, ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";

import { clusterApiUrl } from "@solana/web3.js";
import {
  CoinbaseWalletAdapter,
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { useMemo } from "react";

import "@solana/wallet-adapter-react-ui/styles.css";

const WalletContextProvider: FC<{
  children: ReactNode;
  session: Session | null;
}> = ({ children, session }) => {
  const network = process.env.NEXT_PUBLIC_NETWORK;

  // You can also provide a custom RPC endpoint.
  const endpoint = useMemo(
    () => process.env.NEXT_PUBLIC_SOLANA_RPC_URL || clusterApiUrl(network),
    [network]
  );

  //wallets
  const wallets = useMemo(
    () => [
      new CoinbaseWalletAdapter(),
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter({ network }),
      new TorusWalletAdapter(),
    ],
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <SessionProvider session={session} refetchInterval={0}>
            {children}
          </SessionProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default WalletContextProvider;
