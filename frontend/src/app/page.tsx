"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { SelectScam } from "./_components/SelectScam";
import ShowScammedNft from "./_components/ShowScammedNft";

export default function Home() {
  const { publicKey } = useWallet();

  return (
    <main className="flex min-h-screen flex-col p-6 lg:p-24">
      <div className="mt-8 flex-grow flex justify-center items-center">
        {!publicKey ? <ShowScammedNft /> : <SelectScam />}
      </div>
    </main>
  );
}
