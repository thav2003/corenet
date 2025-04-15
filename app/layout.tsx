import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import WalletContextProvider from "@/providers/WalletContextProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CoreNet",
  description:
    "CoreNet ($CNET) is a decentralized Modular Compute platform operating on the Solana blockchain, utilizing the Modular Compute Protocol (MCP) to provide powerful, secure, and flexible computing capabilities. The project is designed to support AI Compute, ZK Compute, MEV Optimization, and complex blockchain data processing requirements. By combining cutting-edge technology with a decentralized model, CoreNet opens up opportunities for next-generation blockchain applications.",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <WalletContextProvider session={session}>
          {children}
        </WalletContextProvider>
      </body>
    </html>
  );
}
