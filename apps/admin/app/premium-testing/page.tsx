"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function PremiumTestingPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const searchUsers = async () => {
    if (!search) return;
    setLoading(true);
    const supabase = createClient();

    // Search by username only
    const { data, error } = await supabase
      .from("profiles")
      .select("id, username")
      .ilike("username", `%${search}%`)
      .limit(20);

    if (error) {
      console.error("Search error:", error);
    }

    setUsers(data || []);
    setLoading(false);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-2">Premium Testing Panel</h1>
      <p className="text-zinc-400 mb-8">Test premium features without Razorpay</p>

      {/* Search */}
      <div className="flex gap-4 mb-8">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && searchUsers()}
          placeholder="Search users by username..."
          className="bg-zinc-900 border-zinc-800 text-white max-w-md"
        />
        <Button onClick={searchUsers} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </Button>
      </div>

      {/* Results */}
      {users.length > 0 && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-zinc-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase">Username</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-zinc-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 text-white">{user.username || "No username"}</td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/premium-testing/${user.id}`}>
                      <Button variant="outline" size="sm">Test Premium</Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* No results */}
      {search && !loading && users.length === 0 && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 text-center text-zinc-400">
          No users found for "{search}"
        </div>
      )}
    </div>
  );
}
