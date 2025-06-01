"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import useSWR, { mutate } from "swr";

interface Community {
  id: string;
  name: string;
}

const fetcher = async () => {
  const res = await fetch("/api/communities");
  if (!res.ok) {
    throw new Error("Failed to fetch communities");
  }
  return res.json();
};

export default function SearchCommunity() {
  const { data: communities = [] } = useSWR<Community[]>(
    "communities",
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  const [searchTerm, setSearchTerm] = useState<string>("");

  const filteredCommunities = searchTerm
    ? communities.filter((c: Community) =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div className="relative w-80">
      <Input
        type="text"
        placeholder="Search communities..."
        className="w-full "
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onClick={refreshCommunities}
      />
      {filteredCommunities.length > 0 && (
        <Card className="absolute top-full mt-2 w-full bg-background dark:bg-background shadow-lg rounded-lg border max-h-48 overflow-y-auto z-50">
          {filteredCommunities.map((community: Community) => (
            <Link
              key={community.id}
              href={`/p/${community.name}`}
              className="block px-4 py-2 hover:bg-muted dark:hover:bg-muted-background"
              onClick={() => {
                setSearchTerm("");
              }}
            >
              {community.name}
            </Link>
          ))}
        </Card>
      )}
    </div>
  );
}

export function refreshCommunities() {
  mutate("communities");
}
