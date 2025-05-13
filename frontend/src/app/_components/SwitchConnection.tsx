"use client";

import { useCustomConnection } from "@/providers/ConnectionProvider";

export default function SwitchConnection() {
  const { networkType, connectToNetwork } = useCustomConnection();

  return (
    <>
      {networkType === "devnet" ? (
        <div className="ml-4">
          <strong>{networkType}</strong>
        </div>
      ) : (
        <div className="ml-4">
          <button
            onClick={() => connectToNetwork("devnet")}
            className="px-3 py-1 bg-blue-700 text-white text-xs rounded hover:bg-blue-600"
          >
            Connect to Devnet
          </button>
        </div>
      )}
    </>
  );
}
