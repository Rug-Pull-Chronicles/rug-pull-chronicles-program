import { WalletAdapterProvider } from "@/providers/walletAdapterProvider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { UmiProvider } from "@/providers/umiProvider";
import { ConnectionProvider } from "@/providers/ConnectionProvider";
import Header from "./_components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Rug Pull Chronicles",
  description: "Rug Pull Chronicles NFT Minting App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletAdapterProvider>
          <ConnectionProvider>
            <Header />
            <UmiProvider>{children}</UmiProvider>
          </ConnectionProvider>
        </WalletAdapterProvider>
      </body>
    </html>
  );
}
