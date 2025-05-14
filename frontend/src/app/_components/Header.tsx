"use client";

import React from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import SwitchConnection from "./SwitchConnection";
import Image from "next/image";
import Link from "next/link";

function Header() {
  return (
    <header className="flex items-center justify-between px-8 py-4 border-b border-gray-200 min-h-[70px] bg-custom-beige">
      <div className="flex items-center gap-4">
        <Link href="/">
          <Image
            src="/images/rpc-logo.png"
            alt="Rug Pull Chronicles Logo"
            width={50}
            height={50}
            className="object-contain"
          />
        </Link>
        <h1 className="text-4xl font-extrabold tracking-tight m-0">
          <span className="text-tertiary-text">Rug</span>
          <span className="text-secondary-text space-mono-bold-italic">
            PULL
          </span>
          Chronicles
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
