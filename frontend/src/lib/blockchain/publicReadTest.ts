import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  fetchAllDigitalAssetByOwner,
  mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";
import { publicKey } from "@metaplex-foundation/umi";

// @sturt tag nft channel discord; mp-nft-ai
// drop walrus in favor of arwave/just basic db;

export async function fetchWalletNFTs(walletAddress: string) {
  const umi = createUmi(
    `https://mainnet.helius-rpc.com/?api-key=${process.env.NEXT_PUBLIC_HELIUS_API}`
  ).use(mplTokenMetadata());

  const ownerPublicKey = publicKey(walletAddress);

  const nfts = await fetchAllDigitalAssetByOwner(umi, ownerPublicKey);

  console.log("-- result");
  console.log(nfts);

  const formattedNfts = nfts.filter((nft) => nft.mint.decimals === 0);

  // Fetch and return the NFT data with metadata JSON
  const nftsWithMetadata = await Promise.all(
    formattedNfts.map(async (nft) => {
      let metadataJson = null;
      try {
        const response = await fetch(nft.metadata.uri);
        metadataJson = await response.json();
      } catch (error) {
        console.error(
          `Error fetching metadata for ${nft.metadata.name}:`,
          error
        );
      }

      return {
        name: nft.metadata.name,
        symbol: nft.metadata.symbol,
        uri: nft.metadata.uri,
        json: metadataJson,
        image: metadataJson.image,
      };
    })
  );

  return nftsWithMetadata;
}
