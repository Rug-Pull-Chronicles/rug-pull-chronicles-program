"use client";

import React from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import SwitchConnection from "./SwitchConnection";
import Image from "next/image";

function Header() {
  return (
    <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-200 min-h-[70px] bg-custom-beige">
      <div className="flex items-center gap-4">
        <Image
          src="/images/rpc-logo.png"
          alt="Rug Pull Chronicles Logo"
          width={50}
          height={50}
          className="object-contain"
        />
        <h1 className="text-4xl font-extrabold tracking-tight m-0">
          Rug Pull Chronicles
        </h1>
      </div>
      <div className="flex items-center justify-center">
        <WalletMultiButton />
        <SwitchConnection />
      </div>
    </header>
  );
}

export default Header;
