"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Copy, Check } from "lucide-react";

interface UserProfile {
  id: string;
  username: string | null;
  avatar_url: string | null;
  points: number;
  follower_count: number;
  following_count: number;
  posts_count: number;
  created_at: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [copiedUsername, setCopiedUsername] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async (searchTerm?: string) => {
    setLoading(true);
    const supabase = createClient();

    let query = supabase
      .from("profiles")
      .select("id, username, avatar_url, points, follower_count, following_count, posts_count, created_at")
      .order("created_at", { ascending: false })
      .limit(100);

    if (searchTerm) {
      query = query.ilike("username", `%${searchTerm}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching users:", error);
    }

    setUsers(data || []);
    setLoading(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers(search);
  };

  const copyUsername = async (username: string | null) => {
    if (!username) return;
    await navigator.clipboard.writeText(username);
    setCopiedUsername(username);
    setTimeout(() => setCopiedUsername(null), 2000);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Users</h1>
        <p className="text-zinc-400 mt-1">
          Manage user accounts {!loading && `• Showing ${users.length} users`}
        </p>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-4 mb-6">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by username..."
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
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase">Username</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase">Points</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase">Followers</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase">Posts</th>
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
                          {(user.username || "?")[0].toUpperCase()}
                        </div>
                      )}
                      <div>
                        {user.username ? (
                          <button
                            onClick={() => copyUsername(user.username)}
                            className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors group"
                          >
                            <span className="font-mono text-sm">@{user.username}</span>
                            {copiedUsername === user.username ? (
                              <Check className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <Copy className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                            )}
                          </button>
                        ) : (
                          <span className="text-zinc-600 text-sm">No username</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-zinc-300">{user.points}</td>
                  <td className="px-6 py-4 text-zinc-400">{user.follower_count}</td>
                  <td className="px-6 py-4 text-zinc-400">{user.posts_count}</td>
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
