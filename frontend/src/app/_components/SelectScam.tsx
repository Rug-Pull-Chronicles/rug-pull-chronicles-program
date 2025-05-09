"use client";

import { useEffect, useState } from "react";

import scamsData from "@/lib/scams.json";
import { useRouter } from "next/navigation";

export function SelectScam() {
  const { traits, scams } = scamsData;
  const router = useRouter();

  const [filters, setFilters] = useState<any>({});
  const [filteredScams, setFilteredScams] = useState<any[]>([]);
  const [selectedScam, setSelectedScam] = useState<any>(null);

  // Filter scams when filters or scams change
  useEffect(() => {
    if (!scams.length) return;
    let result = scams;
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        result = result.filter((scam) => scam[key] === value);
      }
    });
    setFilteredScams(result);
  }, [filters, scams]);

  // Handle select change
  const handleChange = (trait: string, value: string) => {
    setFilters((prev: any) => ({
      ...prev,
      [trait]: value,
    }));
  };

  const handleScamSelect = (scam: any) => {
    setSelectedScam(scam);
    router.push(`/mint?id=${scam.id}`);
  };

  return (
    <div className="max-w-xl mx-auto py-6 sm:px-6 lg:px-8 text-center">
      <div className="space-y-2">
        {traits && (
          <form className="space-y-4">
            {Object.entries(traits).map(([trait, options]) => (
              <div key={trait}>
                <label className="block mb-1 font-semibold">
                  {trait.replace(/_/g, " ")}
                </label>
                <select
                  className="border rounded px-2 py-1"
                  value={filters[trait] || ""}
                  onChange={(e) => handleChange(trait, e.target.value)}
                >
                  <option value="">Any</option>
                  {(options as string[]).map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </form>
        )}

        <div className="mt-6">
          <h2 className="text-lg font-bold mb-2">Matching Scams</h2>
          {filteredScams.length === 0 && <div>No scams found.</div>}
          <ul className="space-y-2">
            {filteredScams.map((scam, idx) => (
              <li
                key={idx}
                className="border rounded p-3 text-left cursor-pointer hover:bg-neutral-400 dark:hover:bg-neutral-900"
                onClick={() => handleScamSelect(scam)}
              >
                <div className="font-bold">{scam.headline}</div>
                <div className="text-sm text-gray-600">{scam.description}</div>
                <div className="text-xs mt-1">
                  <span>Year: {scam.year}</span> |{" "}
                  <span>Amount: {scam.amount_usd}</span> |{" "}
                  <span>Category: {scam.category}</span> |{" "}
                  <span>Attack: {scam.type_of_attack}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
