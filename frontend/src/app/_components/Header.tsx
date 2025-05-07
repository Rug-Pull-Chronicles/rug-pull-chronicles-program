"use client";

import React from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

function Header() {
  return (
    <div>
      <h1>Rug Pull Chronicles</h1>
      <WalletMultiButton />
    </div>
  );
}

export default Header;
