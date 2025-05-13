"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { SelectScam } from "./_components/SelectScam";
import ShowScammedNft from "./_components/ShowScammedNft";
import { uploadMetadataToIPFS } from "@/lib/storage/uploadData";

export default function Home() {
  const { publicKey } = useWallet();

  const handleUploadMetadata = async () => {
    const metadata = await uploadMetadataToIPFS({
      name: "test",
      description: "test",
    });
    console.log(metadata);
  };

  return (
    <main className="flex min-h-screen flex-col p-6 lg:p-24">
      <div>
        <h1>TEST</h1>
        <button onClick={handleUploadMetadata}>Upload Metadata</button>
      </div>
      <div className="mt-8 flex-grow flex justify-center items-center">
        {publicKey ? <ShowScammedNft /> : <SelectScam />}
      </div>
    </main>
  );
}
