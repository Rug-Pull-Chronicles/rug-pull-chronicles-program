"use client";

import { Connection } from "@solana/web3.js";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import { clusterApiUrl } from "@solana/web3.js";

const DEVNET_ENDPOINT = clusterApiUrl("devnet");
const LOCAL_ENDPOINT = process.env.NEXT_PUBLIC_LOCAL_ENDPOINT;

type NetworkType = "localnet" | "devnet" | "mainnet";

type ConnectionContextType = {
  connectionToUse: Connection;
  networkType: NetworkType;
  connectToNetwork: (network: NetworkType) => void;
};

const ConnectionContext = createContext<ConnectionContextType | undefined>(
  undefined
);

export function ConnectionProvider({ children }: { children: ReactNode }) {
  const { connection } = useConnection();

  const [networkType, setNetworkType] = useState<NetworkType>("devnet");
  const [connectionToUse, setConnectionToUse] = useState<Connection>(
    new Connection(DEVNET_ENDPOINT, "confirmed")
  );

  useEffect(() => {
    if (connection?.rpcEndpoint) {
      if (connection.rpcEndpoint === LOCAL_ENDPOINT) {
        setNetworkType("localnet");
      } else if (connection.rpcEndpoint.includes("devnet")) {
        setNetworkType("devnet");
      } else {
        setNetworkType("mainnet");
      }
      setConnectionToUse(connection);
    }
  }, [connection]);

  const connectToNetwork = (network: NetworkType) => {
    let endpoint;
    switch (network) {
      case "localnet":
        endpoint = LOCAL_ENDPOINT;
        break;
      case "devnet":
        endpoint = DEVNET_ENDPOINT;
        break;
      case "mainnet":
        endpoint = clusterApiUrl("mainnet-beta");
        break;
    }

    if (endpoint) {
      const newConnection = new Connection(endpoint, "confirmed");
      setConnectionToUse(newConnection);
      setNetworkType(network);
    }
  };

  return (
    <ConnectionContext.Provider
      value={{
        connectionToUse,
        networkType,
        connectToNetwork,
      }}
    >
      {children}
    </ConnectionContext.Provider>
  );
}

export function useCustomConnection() {
  const context = useContext(ConnectionContext);
  if (context === undefined) {
    throw new Error(
      "useCustomConnection must be used within a ConnectionProvider"
    );
  }
  return context;
}
