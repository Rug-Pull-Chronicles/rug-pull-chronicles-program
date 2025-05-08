"use client";

import React from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import SwitchConnection from "./SwitchConnection";

function Header() {
  return (
    <div>
      <h1>Rug Pull Chronicles</h1>
      <WalletMultiButton />
      <SwitchConnection />
    </div>
  );
}

export default Header;
