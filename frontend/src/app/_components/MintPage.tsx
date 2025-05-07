"use client";

import React from "react";
import MintNFT from "@/components/MintNFT";

function MintPage() {
  return (
    <div>
      <MintNFT
        year={2024}
        amount={"1000000"}
        category="DeFi"
        typeOfAttack="Rug Pull"
      />
    </div>
  );
}

export default MintPage;
