"use client";

import Image from "next/image";
import { Logo } from "@/components/icon";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useRef } from "react";
import { Copy } from "lucide-react";
import { PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useConnection } from "@solana/wallet-adapter-react";

interface NetworkStats {
  totalSupply: number;
  circulatingSupply: number;
  nonCirculatingSupply: number;
  currentEpoch: number;
  epochProgress: number;
  slotRange: {
    start: number;
    end: number;
  };
  timeRemaining: string;
  totalTransactions: number;
  blockHeight: number;
  slotHeight: number;
  tps: number;
  trueTps: number;
  totalStake: number;
  currentStake: number;
  delinquentStake: number;
}

interface Block {
  blockHeight: number;
  blockTime?: number | null;
  transactionCount: number;
}

interface Transaction {
  signature: string;
  blockTime?: number | null;
  status: string;
}

interface SearchResult {
  type: "transaction" | "address" | "block";
  value: string;
  displayValue: string;
  timestamp?: number;
  status?: string;
}

// Hàm tính thời gian còn lại
const calculateTimeRemaining = (slotsRemaining: number): string => {
  // Trung bình mỗi slot trong Solana mất 400ms
  const millisecondsPerSlot = 400;
  const totalMilliseconds = slotsRemaining * millisecondsPerSlot;

  const days = Math.floor(totalMilliseconds / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (totalMilliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor(
    (totalMilliseconds % (1000 * 60 * 60)) / (1000 * 60)
  );
  const seconds = Math.floor((totalMilliseconds % (1000 * 60)) / 1000);

  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
};

export default function ExplorerPage() {
  const { connection } = useConnection();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("transactions");
  const [recentBlocks, setRecentBlocks] = useState<Block[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [networkStats, setNetworkStats] = useState<NetworkStats>({
    totalSupply: 0,
    circulatingSupply: 0,
    nonCirculatingSupply: 0,
    currentEpoch: 0,
    epochProgress: 0,
    slotRange: {
      start: 0,
      end: 0,
    },
    timeRemaining: "0d 0h 0m 0s",
    totalTransactions: 0,
    blockHeight: 0,
    slotHeight: 0,
    tps: 0,
    trueTps: 0,
    totalStake: 0,
    currentStake: 0,
    delinquentStake: 0,
  });
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Hàm lấy các block gần đây
  const getRecentBlocks = async () => {
    try {
      setLoading(true);
      const currentSlot = await connection.getSlot();
      const blocks: Block[] = [];

      for (let i = 0; i < 10; i++) {
        try {
          const blockTime = await connection.getBlockTime(currentSlot - i);
          const block = await connection.getBlock(currentSlot - i, {
            commitment: "confirmed",
            maxSupportedTransactionVersion: 0,
          });
          if (block) {
            blocks.push({
              blockHeight: currentSlot - i,
              blockTime,
              transactionCount: block.transactions.length,
            });
          }
        } catch (error) {
          console.error(`Error fetching block ${currentSlot - i}:`, error);
        }
      }

      setRecentBlocks(blocks);
    } catch (error) {
      console.error("Error fetching recent blocks:", error);
    } finally {
      setLoading(false);
    }
  };

  // Hàm lấy các giao dịch gần đây
  const getRecentTransactions = async () => {
    try {
      setLoading(true);
      // Lấy các giao dịch mới nhất từ Solana
      const signatures = await connection.getSignaturesForAddress(
        new PublicKey("11111111111111111111111111111111"), // System Program ID
        { limit: 10 }
      );

      const transactions = await Promise.all(
        signatures.map(async (sig) => {
          return {
            signature: sig.signature,
            blockTime: sig.blockTime,
            status: sig.err ? "Failed" : "Success",
          };
        })
      );

      setRecentTransactions(transactions);
    } catch (error) {
      console.error("Error fetching recent transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle click outside dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Copy to clipboard function
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(text);
      setTimeout(() => setCopySuccess(null), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  // Hàm tìm kiếm tất cả
  const handleSearch = async (query: string) => {
    if (!query) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    setIsSearching(true);
    setShowDropdown(true);
    const results: SearchResult[] = [];

    try {
      // Tìm kiếm transaction
      try {
        const tx = await connection.getTransaction(query, {
          maxSupportedTransactionVersion: 0,
        });
        if (tx) {
          results.push({
            type: "transaction",
            value: query,
            displayValue: `Transaction: ${query.slice(0, 20)}...`,
            timestamp: tx.blockTime || undefined,
            status: tx.meta?.err ? "Failed" : "Success",
          });
        }
      } catch {
        // Không phải transaction signature
      }

      // Tìm kiếm address
      try {
        const pubkey = new PublicKey(query);
        const signatures = await connection.getSignaturesForAddress(pubkey, {
          limit: 5,
        });
        if (signatures.length > 0) {
          results.push({
            type: "address",
            value: query,
            displayValue: `Address: ${query.slice(0, 20)}...`,
            timestamp: signatures[0].blockTime || undefined,
          });
        }
      } catch {
        // Không phải địa chỉ hợp lệ
      }

      // Tìm kiếm block
      if (/^\d+$/.test(query)) {
        try {
          const block = await connection.getBlock(parseInt(query), {
            maxSupportedTransactionVersion: 0,
          });
          if (block) {
            results.push({
              type: "block",
              value: query,
              displayValue: `Block #${parseInt(query).toLocaleString()}`,
              timestamp: block.blockTime || undefined,
            });
          }
        } catch {
          // Không phải block number hợp lệ
        }
      }

      setSearchResults(results);
    } catch (error) {
      console.error("Error searching:", error);
    } finally {
      setIsSearching(false);
    }
  };

  // Xử lý khi click vào kết quả tìm kiếm
  const handleResultClick = (result: SearchResult) => {
    let url = "https://solscan.io";
    switch (result.type) {
      case "transaction":
        url += `/tx/${result.value}`;
        break;
      case "address":
        url += `/account/${result.value}`;
        break;
      case "block":
        url += `/block/${result.value}`;
        break;
    }
    window.open(url, "_blank");
    setShowDropdown(false);
  };

  // Debounce search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Hàm lấy thông tin supply
  const getSupplyInfo = async () => {
    try {
      setStatsLoading(true);
      const supply = await connection.getSupply();
      setNetworkStats((prev) => ({
        ...prev,
        totalSupply: supply.value.total / LAMPORTS_PER_SOL,
        circulatingSupply: supply.value.circulating / LAMPORTS_PER_SOL,
        nonCirculatingSupply: supply.value.nonCirculating / LAMPORTS_PER_SOL,
      }));
    } catch (error) {
      console.error("Error fetching supply:", error);
    } finally {
      setStatsLoading(false);
    }
  };

  // Hàm lấy thông tin network
  const getNetworkInfo = async () => {
    try {
      setStatsLoading(true);
      const epochInfo = await connection.getEpochInfo();
      const blockHeight = await connection.getBlockHeight();
      const slotHeight = await connection.getSlot();
      const performance = await connection.getRecentPerformanceSamples(1);
      const transactionCount = await connection.getTransactionCount();
      const slotsRemaining = epochInfo.slotsInEpoch - epochInfo.slotIndex - 1;
      const timeRemaining = calculateTimeRemaining(slotsRemaining);

      if (performance.length > 0) {
        const sample = performance[0];
        // Tổng TPS bao gồm cả vote transactions
        const totalTps = sample.numTransactions / sample.samplePeriodSecs;
        // True TPS (ước tính ~70% là non-vote transactions)
        const trueTps = totalTps * 0.7;

        setNetworkStats((prev) => ({
          ...prev,
          currentEpoch: epochInfo.epoch,
          epochProgress: (epochInfo.slotIndex / epochInfo.slotsInEpoch) * 100,
          totalTransactions: transactionCount,
          slotRange: {
            start: epochInfo.absoluteSlot - epochInfo.slotIndex,
            end:
              epochInfo.absoluteSlot +
              (epochInfo.slotsInEpoch - epochInfo.slotIndex - 1),
          },
          blockHeight,
          slotHeight,
          timeRemaining,
          tps: Math.round(totalTps * 100) / 100,
          trueTps: Math.round(trueTps * 100) / 100,
        }));
      }
    } catch (error) {
      console.error("Error fetching network info:", error);
    } finally {
      setStatsLoading(false);
    }
  };
  // Fetch initial data
  useEffect(() => {
    getSupplyInfo();
    getNetworkInfo();
  }, []);
  // Fetch initial data
  useEffect(() => {
    if (viewMode === "transactions") {
      getRecentTransactions();
    } else {
      getRecentBlocks();
    }
  }, [viewMode]);

  return (
    <div className="min-h-screen" style={{backgroundImage: `linear-gradient(to right, #0a1a2f 0%, #0e0e19 100%)`}}>
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      <div className="container relative mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="relative w-12 h-12">
              <Image
                src={Logo || "/placeholder.svg"}
                alt="SolAIForge Explorer"
                fill
                className="object-contain"
                priority
              />
            </div>
            <h1 className="text-2xl font-bold text-blue-400">
              Solana Explorer
            </h1>
          </div>
        </div>

        {/* Search Section */}
        <div className="mb-8" ref={searchRef}>
          <div className="max-w-2xl">
            <div className="relative">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    placeholder="Search by transaction, address, or block..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#0d2341] border-[#1a2b44] text-gray-200 placeholder-gray-400"
                  />
                  {isSearching && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-200"></div>
                    </div>
                  )}
                </div>
              </div>

              {/* Search Results Dropdown */}
              {showDropdown && searchResults.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-[#0A1A2F] rounded-md shadow-lg border border-[#1a2b44]">
                  <ul className="py-1">
                    {searchResults.map((result, index) => (
                      <li
                        key={index}
                        className="px-4 py-2 hover:bg-[#1a2b44] cursor-pointer"
                        onClick={() => handleResultClick(result)}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium text-gray-200">
                              {result.displayValue}
                            </p>
                            {result.timestamp && (
                              <p className="text-xs text-gray-400">
                                {new Date(
                                  result.timestamp * 1000
                                ).toLocaleString()}
                              </p>
                            )}
                          </div>
                          {result.status && (
                            <span
                              className={`px-2 py-1 text-xs rounded ${
                                result.status === "Success"
                                  ? "bg-[#00FFA3]/20 text-[#00FFA3]"
                                  : "bg-red-500/20 text-red-500"
                              }`}
                            >
                              {result.status}
                            </span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Network Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 mb-8">
          {/* Card 1: SOL Supply */}
          <div className="p-6 rounded-lg border border-[#1a2b44] bg-[#0A1A2F] shadow-[0_2px_8px_rgba(0,0,0,0.2)]">
            <h3 className="text-lg font-semibold mb-4 text-gray-200">
              SOL Supply
            </h3>
            <div className="space-y-4">
              {statsLoading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-8 bg-[#1a2b44] rounded w-3/4"></div>
                  <div className="h-4 bg-[#1a2b44] rounded w-1/2"></div>
                  <div className="h-4 bg-[#1a2b44] rounded w-1/2"></div>
                </div>
              ) : (
                <>
                  <div>
                    <p className="text-2xl font-bold text-blue-400">
                      {networkStats.totalSupply.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Circulating Supply</p>
                    <p className="text-base text-gray-200">
                      {networkStats.circulatingSupply.toLocaleString()} SOL (
                      {(
                        (networkStats.circulatingSupply /
                          networkStats.totalSupply) *
                        100
                      ).toFixed(1)}
                      %)
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">
                      Non-circulating Supply
                    </p>
                    <p className="text-base text-gray-200">
                      {networkStats.nonCirculatingSupply.toLocaleString()} SOL (
                      {(
                        (networkStats.nonCirculatingSupply /
                          networkStats.totalSupply) *
                        100
                      ).toFixed(1)}
                      %)
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Card 2: Epoch Info */}
          <div className="p-6 rounded-lg border border-[#1a2b44] bg-[#0A1A2F] shadow-[0_2px_8px_rgba(0,0,0,0.2)]">
            <h3 className="text-lg font-semibold mb-4 text-gray-200">
              Current Epoch
            </h3>
            <div className="space-y-4">
              {statsLoading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-8 bg-[#1a2b44] rounded w-1/2"></div>
                  <div className="h-4 bg-[#1a2b44] rounded w-3/4"></div>
                  <div className="h-4 bg-[#1a2b44] rounded w-3/4"></div>
                  <div className="h-4 bg-[#1a2b44] rounded w-1/2"></div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-2xl font-bold text-blue-400">
                      {networkStats.currentEpoch}
                    </p>
                    <p className="text-base text-gray-400">
                      ({networkStats.epochProgress.toFixed(2)}%)
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Slot Range</p>
                    <p className="text-base text-gray-200">
                      {networkStats.slotRange.start.toLocaleString()} to{" "}
                      {networkStats.slotRange.end.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Time Remain</p>
                    <p className="text-base text-gray-200">
                      {networkStats.timeRemaining}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Card 3: Network Stats */}
          <div className="p-6 rounded-lg border border-[#1a2b44] bg-[#0A1A2F] shadow-[0_2px_8px_rgba(0,0,0,0.2)]">
            <h3 className="text-lg font-semibold mb-4 text-gray-200">
              Network (Transactions)
            </h3>
            <div className="space-y-4">
              {statsLoading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-8 bg-[#1a2b44] rounded w-3/4"></div>
                  <div className="h-4 bg-[#1a2b44] rounded w-1/2"></div>
                  <div className="h-4 bg-[#1a2b44] rounded w-1/2"></div>
                </div>
              ) : (
                <>
                  <div>
                    <p className="text-2xl font-bold text-blue-400">
                      {networkStats.totalTransactions.toLocaleString()}
                    </p>
                  </div>

                  {/* Block Height và Slot Height cùng hàng */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Block Height</p>
                      <p className="text-base text-gray-200">
                        {networkStats.blockHeight.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Slot Height</p>
                      <p className="text-base text-gray-200">
                        {networkStats.slotHeight.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* TPS và True TPS cùng hàng */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">TPS</p>
                      <p className="text-base text-gray-200">
                        {networkStats.tps.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">True TPS</p>
                      <p className="text-base text-gray-200">
                        {networkStats.trueTps.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        {/* Latest Data Section */}
        <div className="bg-[#0A1A2F] rounded-lg border border-[#1a2b44] overflow-hidden">
          <Tabs
            defaultValue="transactions"
            className="w-full"
            onValueChange={(value) => setViewMode(value)}
          >
            <div className="p-4 border-b border-[#1a2b44]">
              <div className="flex justify-between items-center">
                <TabsList className="bg-[#0d2341] border border-[#1a2b44]">
                  <TabsTrigger
                    value="transactions"
                    className="text-gray-400 hover:text-gray-200 data-[state=active]:bg-[#1a2b44] data-[state=active]:text-gray-200"
                  >
                    Latest Transactions
                  </TabsTrigger>
                  <TabsTrigger
                    value="blocks"
                    className="text-gray-400 hover:text-gray-200 data-[state=active]:bg-[#1a2b44] data-[state=active]:text-gray-200"
                  >
                    Latest Blocks
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>

            <TabsContent value="transactions" className="p-4">
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-[#1a2b44] rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-[#1a2b44] rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {recentTransactions.map((tx, index) => (
                    <div key={index} className="border-b border-[#1a2b44] pb-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium text-gray-200">
                                {tx.signature.slice(0, 20)}...
                              </p>
                              <button
                                onClick={() => copyToClipboard(tx.signature)}
                                className="p-1 hover:bg-[#1a2b44] rounded relative group"
                              >
                                <Copy className="h-4 w-4 text-gray-400" />
                                {copySuccess === tx.signature && (
                                  <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-[#0d2341] text-gray-200 text-xs px-2 py-1 rounded border border-[#1a2b44]">
                                    Copied!
                                  </span>
                                )}
                              </button>
                            </div>
                            <p className="text-sm text-gray-400">
                              {tx.blockTime
                                ? new Date(tx.blockTime * 1000).toLocaleString()
                                : "N/A"}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`px-2 py-1 text-xs rounded ${
                            tx.status === "Success"
                              ? "bg-[#00FFA3]/20 text-[#00FFA3]"
                              : "bg-red-500/20 text-red-500"
                          }`}
                        >
                          {tx.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="blocks" className="p-4">
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-[#1a2b44] rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-[#1a2b44] rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {recentBlocks.map((block, index) => (
                    <div key={index} className="border-b border-[#1a2b44] pb-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-gray-200">
                              Block #{block.blockHeight.toLocaleString()}
                            </p>
                            <button
                              onClick={() =>
                                copyToClipboard(block.blockHeight.toString())
                              }
                              className="p-1 hover:bg-[#1a2b44] rounded relative group"
                            >
                              <Copy className="h-4 w-4 text-gray-400" />
                              {copySuccess === block.blockHeight.toString() && (
                                <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-[#0d2341] text-gray-200 text-xs px-2 py-1 rounded border border-[#1a2b44]">
                                  Copied!
                                </span>
                              )}
                            </button>
                          </div>
                          <p className="text-sm text-gray-400">
                            {block.blockTime
                              ? new Date(
                                  block.blockTime * 1000
                                ).toLocaleString()
                              : "N/A"}
                          </p>
                          <p className="text-sm text-gray-400">
                            {block.transactionCount} transactions
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
