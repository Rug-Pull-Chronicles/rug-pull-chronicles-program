"use client";

import { useCustomConnection } from "@/providers/ConnectionProvider";

const PROGRAM_ID = process.env.NEXT_PUBLIC_PROGRAM_ID;

export default function SwitchConnection() {
  const { networkType, connectToNetwork } = useCustomConnection();

  return (
    <div className="bg-black/90 rounded-lg p-6 max-w-xl mx-auto">
      {networkType === "devnet" ? (
        <div className="p-4 mb-6 bg-blue-900/50 border border-blue-700 rounded-md text-blue-200">
          <p className="text-sm">
            <strong>Connected to Devnet</strong> - Using the deployed program
            for testing.
          </p>
          <p className="text-xs mt-1">Program ID: {PROGRAM_ID}</p>
        </div>
      ) : networkType === "localnet" ? (
        <div className="p-4 mb-6 bg-green-900/50 border border-green-700 rounded-md text-green-200">
          <p className="text-sm">
            <strong>Connected to localnet</strong> - Using the local validator
            for testing.
          </p>
          <p className="text-xs mt-1">Program ID: {PROGRAM_ID}</p>
          <button
            onClick={() => connectToNetwork("devnet")}
            className="mt-2 px-3 py-1 bg-blue-700 text-white text-xs rounded hover:bg-blue-600"
          >
            Switch to Devnet
          </button>
        </div>
      ) : (
        <div className="p-4 mb-6 bg-yellow-900/50 border border-yellow-700 rounded-md text-yellow-200">
          <p className="text-sm">
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
    </div>
  );
}
