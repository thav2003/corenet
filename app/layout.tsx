import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import WalletContextProvider from "@/providers/WalletContextProvider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SolAIForge",
  description: "Create and manage your NFT collections with AI",
  icons: {
    icon: "./logo.png",
    shortcut: "./logo.png",
    apple: "./logo.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <WalletContextProvider session={session}>
          <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </WalletContextProvider>
      </body>
    </html>
  );
}
