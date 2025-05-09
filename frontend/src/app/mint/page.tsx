"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import MintNFT from "@/app/mint/_components/MintNFT";
import scamsData from "@/lib/scams.json";

function MintPage() {
  const searchParams = useSearchParams();
  const [scam, setScam] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const scamId = searchParams.get("id");

    if (scamId) {
      const foundScam = scamsData.scams.find((s) => s.id === scamId);
      if (foundScam) {
        setScam(foundScam);
      }
    }

    setLoading(false);
  }, [searchParams]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!scam) {
    return (
      <div>Scam not found. Please select a valid scam from the gallery.</div>
    );
  }

  // Convert amount string to numeric value (removing $ and "k", "M" suffixes)
  const parseAmount = (amountStr: string) => {
    const numericValue = amountStr.replace("$", "");
    if (numericValue.endsWith("k")) {
      return (parseFloat(numericValue.replace("k", "")) * 1000).toString();
    } else if (numericValue.endsWith("M")) {
      return (parseFloat(numericValue.replace("M", "")) * 1000000).toString();
    }
    return numericValue;
  };

  return (
    <div>
      <MintNFT
        year={parseInt(scam.year)}
        amount={parseAmount(scam.amount_usd)}
        category={scam.category}
        typeOfAttack={scam.type_of_attack}
        title={scam.headline}
        description={scam.description}
      />
    </div>
  );
}

export default MintPage;
