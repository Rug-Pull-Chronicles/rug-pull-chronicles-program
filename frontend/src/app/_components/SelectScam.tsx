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
          <form className="flex flex-wrap justify-center gap-6 mb-8">
            {Object.entries(traits).map(([trait, options]) => (
              <div
                key={trait}
                className="flex flex-col items-center min-w-[160px]"
              >
                <label className="mb-1 font-semibold text-sm capitalize tracking-wide">
                  {trait.replace(/_/g, " ")}
                </label>
                <select
                  className="border px-3 py-2 w-full bg-white dark:bg-neutral-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
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
          <h2 className="text-lg font-bold mb-4 text-center">Matching Scams</h2>
          {filteredScams.length === 0 && (
            <div className="text-gray-500 text-center">No scams found.</div>
          )}
          <ul className="space-y-3">
            {filteredScams.map((scam, idx) => (
              <li
                key={idx}
                className="border-secondary-text border-2 p-4 bg-white shadow cursor-pointer transition hover:border-r-4 hover:border-b-4 hover:border-l hover:border-t"
                onClick={() => handleScamSelect(scam)}
              >
                <div className="font-bold text-base mb-1">{scam.headline}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                  {scam.description}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
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
