/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  LAMPORTS_PER_SOL,
  type ParsedTransactionWithMeta,
} from "@solana/web3.js";
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
import type { WalletName } from "@solana/wallet-adapter-base";
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
  const [transactions, setTransactions] = useState<ParsedTransactionWithMeta[]>(
    []
  );
  const [loadingTransactions, setLoadingTransactions] =
    useState<boolean>(false);

  useEffect(() => {
    if (!connection || !publicKey) {
      return;
    }

    connection.onAccountChange(
      publicKey,
      (updatedAccountInfo) => {
        setBalance(updatedAccountInfo.lamports / LAMPORTS_PER_SOL);
        (async () => {
          await fetchTransactions();
        })();
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

  const fetchTransactions = async () => {
    if (!publicKey || !connection) return;

    try {
      setLoadingTransactions(true);
      const signatures = await connection.getSignaturesForAddress(
        publicKey,
        { limit: 5 },
        "confirmed"
      );

      const txs = await Promise.all(
        signatures.map((sig) =>
          connection.getParsedTransaction(sig.signature, {
            maxSupportedTransactionVersion: 0,
          })
        )
      );

      setTransactions(
        txs.filter((tx): tx is ParsedTransactionWithMeta => tx !== null)
      );
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoadingTransactions(false);
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

  useEffect(() => {
    if (publicKey) {
      fetchTransactions();
    }
  }, [publicKey]);

  const getTransactionAmount = (tx: ParsedTransactionWithMeta) => {
    if (!tx.meta || !publicKey) return null;

    const preBalances = tx.meta.preBalances;
    const postBalances = tx.meta.postBalances;
    const accountIndex = tx.transaction.message.accountKeys.findIndex(
      (key) => key.pubkey.toBase58() === publicKey.toBase58()
    );

    if (accountIndex === -1) return null;

    const balanceChange =
      (postBalances[accountIndex] - preBalances[accountIndex]) /
      LAMPORTS_PER_SOL;
    return balanceChange;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="flex items-center gap-2">
        {!publicKey ? (
          <DialogTrigger asChild>
            <Button
              variant="default"
              size="sm"
              className="cursor-pointer font-medium h-9 w-28 bg-gradient-to-r from-[#6E2BFF] to-[#00E5FF] hover:from-[#7C3AFF] hover:to-[#00D1EB] text-white hover:shadow-[0_0_15px_rgba(0,229,255,0.4)] transition-all"
            >
              <LogIn className="mr-2 h-4 w-4" />
              Login
            </Button>
          </DialogTrigger>
        ) : (
          <>
            <Drawer
              open={drawerOpen}
              direction={"right"}
              onOpenChange={setDrawerOpen}
            >
              <DrawerTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="font-medium h-9 w-28 border-[#00E5FF]/30 hover:border-[#00E5FF] hover:shadow-[0_0_15px_rgba(0,229,255,0.4)] transition-all bg-[#141425] text-gray-200"
                >
                  <Wallet className="mr-2 h-4 w-4" />
                  {balance !== null ? (
                    <span>{toFixed(balance, 2)} SOL</span>
                  ) : (
                    <span>0 SOL</span>
                  )}
                </Button>
              </DrawerTrigger>
              <DrawerContent className="bg-[#0D0D15]/95 border-[#00E5FF]/30">
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
                        <div className="text-2xl font-bold text-[#00E5FF]">
                          {balance !== null ? toFixed(balance, 4) : "0"} SOL
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-2 text-gray-400">
                          Wallet Address
                        </h4>
                        <div className="p-4 rounded-lg bg-[#141425] border border-[#00E5FF]/30 flex items-center justify-between break-all">
                          <div className="text-sm text-gray-300">
                            {publicKey.toBase58()}
                          </div>
                          <div className="flex gap-2 ml-2 shrink-0">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 hover:bg-[#00E5FF]/10 hover:text-[#00E5FF]"
                              onClick={copyAddress}
                            >
                              <Copy
                                className={cn(
                                  "h-4 w-4",
                                  copied ? "text-[#4ADE80]" : "text-gray-400"
                                )}
                              />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 hover:bg-[#00E5FF]/10 hover:text-[#00E5FF]"
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
                        {loadingTransactions ? (
                          <div className="text-sm text-gray-500">
                            Loading transactions...
                          </div>
                        ) : transactions.length > 0 ? (
                          <div className="space-y-2 max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#00E5FF]/20 scrollbar-track-[#141425] pr-2">
                            {transactions.map((tx) => (
                              <div
                                key={tx.transaction.signatures[0]}
                                className="p-3 rounded-lg bg-[#141425] border border-[#00E5FF]/30 hover:border-[#00E5FF] transition-all"
                              >
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center gap-2">
                                    {(() => {
                                      const amount = getTransactionAmount(tx);
                                      if (amount === null) return null;
                                      return (
                                        <div
                                          className={`text-sm ${
                                            amount >= 0
                                              ? "text-[#4ADE80]"
                                              : "text-red-500"
                                          }`}
                                        >
                                          {amount >= 0 ? "+" : ""}
                                          {amount.toFixed(4)} SOL
                                        </div>
                                      );
                                    })()}
                                    <div className="text-sm text-gray-400">
                                      Fee:{" "}
                                      {(tx.meta?.fee || 0) / LAMPORTS_PER_SOL}{" "}
                                      SOL
                                    </div>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 hover:bg-[#00E5FF]/10 hover:text-[#00E5FF]"
                                    onClick={() =>
                                      window.open(
                                        `https://explorer.solana.com/tx/${tx.transaction.signatures[0]}`,
                                        "_blank"
                                      )
                                    }
                                  >
                                    <ExternalLink className="h-3 w-3 text-gray-400" />
                                  </Button>
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  {new Date(
                                    tx.blockTime! * 1000
                                  ).toLocaleString()}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500">
                            No recent activity
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto p-4 border-t border-[#00E5FF]/20">
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

      <DialogContent className="sm:max-w-[425px] bg-[#0D0D15]/95 border-[#00E5FF]/30">
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
              className="w-full justify-start bg-[#141425] border-[#00E5FF]/30 hover:border-[#00E5FF] hover:shadow-[0_0_15px_rgba(0,229,255,0.4)] text-gray-200 transition-all"
            >
              <Image
                src={wallet.adapter.icon || "/placeholder.svg"}
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
