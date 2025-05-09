"use client";

import { useCustomConnection } from "@/providers/ConnectionProvider";

const PROGRAM_ID = process.env.NEXT_PUBLIC_PROGRAM_ID;

export default function SwitchConnection() {
  const { networkType, connectToNetwork } = useCustomConnection();

  return (
    <>
      {networkType === "devnet" ? (
        <div className="p-4 mb-6">
          <p className="text-xs">
            <strong>Connected to {networkType}</strong> - Using the deployed
            program for testing.
          </p>
          <p className="text-xs mt-1">Program ID: {PROGRAM_ID}</p>
        </div>
      ) : (
        <div className="p-4 mb-6">
          <p className="text-xs">
            <strong>Note:</strong> Not connected to a known network. Using
            Devnet by default.
          </p>
          <button
            onClick={() => connectToNetwork("devnet")}
            className="mt-2 px-3 py-1 bg-blue-700 text-white text-xs rounded hover:bg-blue-600"
          >
            Connect to Devnet
          </button>
        </div>
      )}
    </>
  );
}
