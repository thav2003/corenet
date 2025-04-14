/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import Image from "next/image";
import { WalletName } from "@solana/wallet-adapter-base";
import { Copy, ExternalLink, LogIn, LogOut, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import { getCsrfToken, signIn, signOut, useSession } from "next-auth/react";
import { SigninMessage } from "@/lib/auth";
import bs58 from "bs58";

//handle wallet balance fixed to 2 decimal numbers without rounding
export function toFixed(num: number, fixed: number): string {
  const re = new RegExp(`^-?\\d+(?:\\.\\d{0,${fixed || -1}})?`);
  return num.toString().match(re)![0];
}

const WalletConnection = () => {
  const { status } = useSession();
  const { connection } = useConnection();
  const { select, signMessage, wallets, publicKey, disconnect, connected } =
    useWallet();

  const [open, setOpen] = useState<boolean>(false);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [balance, setBalance] = useState<number | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (!connection || !publicKey) {
      return;
    }

    connection.onAccountChange(
      publicKey,
      (updatedAccountInfo) => {
        setBalance(updatedAccountInfo.lamports / LAMPORTS_PER_SOL);
      },
      {
        commitment: "confirmed",
      }
    );

    connection.getAccountInfo(publicKey).then((info) => {
      if (info) {
        setBalance(info?.lamports / LAMPORTS_PER_SOL);
      }
    });
  }, [publicKey, connection]);

  const handleWalletSelect = async (walletName: WalletName) => {
    if (walletName) {
      try {
        select(walletName);
        // await connect();
        setOpen(false);
      } catch (error) {
        console.error("Wallet connection error:", error);
      }
    }
  };

  const handleDisconnect = async () => {
    try {
      // Disconnect wallet first
      await disconnect();
      // Then sign out from next-auth
      await signOut({ redirect: false });
      setDrawerOpen(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const copyAddress = async () => {
    if (publicKey) {
      await navigator.clipboard.writeText(publicKey.toBase58());
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    }
  };

  const openExplorer = () => {
    if (publicKey) {
      window.open(
        `https://explorer.solana.com/address/${publicKey.toBase58()}`,
        "_blank"
      );
    }
  };

  const handleSignIn = async () => {
    try {
      if (!connected) {
        setOpen(false);
      }

      const csrf = await getCsrfToken();
      if (!publicKey || !csrf || !signMessage) return;

      const message = new SigninMessage({
        domain: window.location.host,
        publicKey: publicKey?.toBase58(),
        statement: `Sign this message to sign in to the app.`,
        nonce: csrf,
      });

      const data = new TextEncoder().encode(message.prepare());
      const signature = await signMessage(data);
      const serializedSignature = bs58.encode(signature);

      await signIn("credentials", {
        message: JSON.stringify(message),
        redirect: false,
        signature: serializedSignature,
      });
    } catch (error) {
      handleDisconnect();
      console.log(error);
    }
  };

  useEffect(() => {
    if (connected && status === "unauthenticated") {
      handleSignIn();
    }
  }, [connected]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="flex items-center gap-2">
        {!publicKey ? (
          <DialogTrigger asChild>
            <Button
              variant="default"
              size="sm"
              className="font-medium h-9 w-28 bg-[#A374FF] hover:bg-[#A374FF]/80 text-white hover:shadow-[0_0_15px_#A374FF40] transition-all"
            >
              <LogIn className="mr-2 h-4 w-4" />
              Login
            </Button>
          </DialogTrigger>
        ) : (
          <>
            <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
              <DrawerTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="font-medium h-9 w-28 border-[#A374FF]/20 hover:border-[#A374FF] hover:shadow-[0_0_15px_#A374FF40] transition-all bg-black/50 text-gray-300"
                >
                  <Wallet className="mr-2 h-4 w-4" />
                  {balance !== null ? (
                    <span>{toFixed(balance, 2)} SOL</span>
                  ) : (
                    <span>0 SOL</span>
                  )}
                </Button>
              </DrawerTrigger>
              <DrawerContent className="bg-black/95 border-[#A374FF]/20">
                <div className="flex flex-col h-full">
                  <div className="flex-1">
                    <DrawerHeader>
                      <DrawerTitle className="text-gray-200">
                        Wallet Details
                      </DrawerTitle>
                      <DrawerDescription className="text-gray-400">
                        View your wallet information and recent activity
                      </DrawerDescription>
                    </DrawerHeader>

                    <div className="p-4 space-y-6">
                      <div>
                        <h4 className="text-sm font-medium mb-2 text-gray-400">
                          Balance
                        </h4>
                        <div className="text-2xl font-bold text-[#A374FF]">
                          {balance !== null ? toFixed(balance, 4) : "0"} SOL
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-2 text-gray-400">
                          Wallet Address
                        </h4>
                        <div className="p-4 rounded-lg bg-black/50 border border-[#A374FF]/20 flex items-center justify-between break-all">
                          <div className="text-sm text-gray-300">
                            {publicKey.toBase58()}
                          </div>
                          <div className="flex gap-2 ml-2 shrink-0">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 hover:bg-[#A374FF]/10 hover:text-[#A374FF]"
                              onClick={copyAddress}
                            >
                              <Copy
                                className={cn(
                                  "h-4 w-4",
                                  copied ? "text-[#00FFA3]" : "text-gray-400"
                                )}
                              />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 hover:bg-[#A374FF]/10 hover:text-[#A374FF]"
                              onClick={openExplorer}
                            >
                              <ExternalLink className="h-4 w-4 text-gray-400" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-2 text-gray-400">
                          Recent Activity
                        </h4>
                        <div className="text-sm text-gray-500">
                          No recent activity
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto p-4 border-t border-[#A374FF]/20">
                    <Button
                      variant="destructive"
                      className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-500 hover:text-red-400 border border-red-500/20 hover:shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                      onClick={handleDisconnect}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Disconnect Wallet
                    </Button>
                  </div>
                </div>
              </DrawerContent>
            </Drawer>
          </>
        )}
      </div>

      <DialogContent className="sm:max-w-[425px] bg-black/95 border-[#A374FF]/20">
        <DialogHeader>
          <DialogTitle className="text-gray-200">Connect Wallet</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {wallets.map((wallet) => (
            <Button
              key={wallet.adapter.name}
              onClick={() =>
                handleWalletSelect(wallet.adapter.name as WalletName)
              }
              variant="outline"
              className="w-full justify-start bg-black/50 border-[#A374FF]/20 hover:border-[#A374FF] hover:shadow-[0_0_15px_#A374FF40] text-gray-300 transition-all"
            >
              <Image
                src={wallet.adapter.icon}
                alt={wallet.adapter.name}
                width={24}
                height={24}
                className="mr-4"
              />
              {wallet.adapter.name}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WalletConnection;
