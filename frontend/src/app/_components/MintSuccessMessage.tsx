interface MintSuccessMessageProps {
  result: {
    signature: string;
    nftAddress: string;
  } | null;
}

export function MintSuccessMessage({ result }: MintSuccessMessageProps) {
  return (
    <div className="mt-4 p-4 bg-green-100 border border-green-200 text-green-800">
      <h3 className="font-medium text-lg mb-2">NFT Minted Successfully!</h3>
      {result ? (
        <div className="space-y-2 text-sm">
          <p className="break-all">
            <span className="font-semibold">NFT Address:</span>{" "}
            {result.nftAddress}
          </p>
          <p className="break-all">
            <span className="font-semibold">Transaction:</span>{" "}
            {result.signature}
          </p>
          <div className="flex justify-between mt-2">
            <a
              href={`https://explorer.solana.com/address/${result.nftAddress}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-700 hover:text-green-900 underline text-xs"
            >
              View NFT on Explorer
            </a>
            <a
              href={`https://explorer.solana.com/tx/${result.signature}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-700 hover:text-green-900 underline text-xs"
            >
              View Transaction
            </a>
          </div>
        </div>
      ) : (
        <p className="text-sm">
          NFT minted successfully, but result details are not available.
        </p>
      )}
    </div>
  );
}
