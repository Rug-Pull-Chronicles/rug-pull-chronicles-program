"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { SelectScam } from "./_components/SelectScam";
import ShowScammedNft from "./_components/ShowScammedNft";

export default function Home() {
  const { publicKey } = useWallet();

  return (
    <main className="flex flex-col p-6 bg-custom-beige/50 min-h-[calc(100vh-83px)]">
      <div className="mt-8 flex-grow flex justify-center items-center">
        {publicKey?.toBase58() !==
        "FSEkJ8iHX6gfhAuNzeAirmycihZdw1mHbsbwfMuJPGMj" ? (
          <ShowScammedNft />
        ) : (
          <SelectScam />
        )}
      </div>
    </main>
  );
}
