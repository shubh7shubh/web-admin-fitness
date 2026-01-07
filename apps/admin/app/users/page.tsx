"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

interface UserProfile {
  id: string;
  username: string | null;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  points: number;
  rank: number | null;
  is_banned: boolean;
  is_admin: boolean;
  created_at: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async (searchTerm?: string) => {
    setLoading(true);
    const supabase = createClient();
    
    let query = supabase
      .from("profiles")
      .select("id, username, email, full_name, avatar_url, points, rank, is_banned, is_admin, created_at")
      .order("created_at", { ascending: false })
      .limit(50);

    if (searchTerm) {
      query = query.or(`username.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,full_name.ilike.%${searchTerm}%`);
    }

    const { data } = await query;
    setUsers(data || []);
    setLoading(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers(search);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Users</h1>
        <p className="text-zinc-400 mt-1">Manage user accounts</p>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-4 mb-6">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by username, email, or name..."
          className="bg-zinc-900 border-zinc-800 text-white max-w-md"
        />
        <Button type="submit" variant="outline" className="border-zinc-700 text-zinc-300">
          Search
        </Button>
        {search && (
          <Button
            type="button"
            variant="ghost"
            onClick={() => { setSearch(""); fetchUsers(); }}
            className="text-zinc-400"
          >
            Clear
          </Button>
        )}
      </form>

      {loading ? (
        <div className="text-center py-12 text-zinc-400">Loading users...</div>
      ) : users.length > 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-zinc-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase">Points</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase">Rank</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-zinc-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-zinc-800/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {user.avatar_url ? (
                        <img src={user.avatar_url} alt="" className="w-8 h-8 rounded-full" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
                          {(user.username || user.email)[0].toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="text-white font-medium">{user.full_name || user.username || "No name"}</p>
                        <p className="text-xs text-zinc-500">@{user.username || "no-username"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-zinc-400 text-sm">{user.email}</td>
                  <td className="px-6 py-4 text-zinc-300">{user.points}</td>
                  <td className="px-6 py-4 text-zinc-400">#{user.rank || "-"}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {user.is_admin && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400">
                          Admin
                        </span>
                      )}
                      {user.is_banned ? (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400">
                          Banned
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400">
                          Active
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/users/${user.id}`}>
                      <Button variant="outline" size="sm" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                        View
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="py-12 text-center">
            <p className="text-zinc-400">No users found</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
