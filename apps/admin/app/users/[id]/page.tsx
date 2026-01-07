"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface UserProfile {
  id: string;
  username: string | null;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  points: number;
  rank: number | null;
  follower_count: number;
  following_count: number;
  posts_count: number;
  is_banned: boolean;
  is_admin: boolean;
  created_at: string;
  current_weight_kg: number | null;
  goal_weight_kg: number | null;
  daily_calorie_goal: number | null;
}

export default function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [pointsDelta, setPointsDelta] = useState("");
  const [pointsReason, setPointsReason] = useState("");

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();
    
    setUser(data);
    setLoading(false);
  };

  const handleToggleBan = async () => {
    if (!user) return;
    setActionLoading(true);

    const supabase = createClient();
    await supabase
      .from("profiles")
      .update({ is_banned: !user.is_banned })
      .eq("id", user.id);

    await fetchUser();
    setActionLoading(false);
  };

  const handleAdjustPoints = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !pointsDelta) return;
    setActionLoading(true);

    const supabase = createClient();
    const delta = parseInt(pointsDelta);
    
    await supabase
      .from("profiles")
      .update({ points: user.points + delta })
      .eq("id", user.id);

    // Log to points_history if table exists
    await supabase.from("points_history").insert({
      user_id: user.id,
      points_amount: delta,
      reason: "admin_adjustment",
      metadata: { admin_reason: pointsReason },
    }).catch(() => {});

    setPointsDelta("");
    setPointsReason("");
    await fetchUser();
    setActionLoading(false);
  };

  if (loading) {
    return <div className="text-center py-12 text-zinc-400">Loading user...</div>;
  }

  if (!user) {
    return <div className="text-center py-12 text-zinc-400">User not found</div>;
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="text-zinc-400"
        >
          ← Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-white">{user.full_name || user.username || "User"}</h1>
          <p className="text-zinc-400">@{user.username || "no-username"}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Info */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white">Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              {user.avatar_url ? (
                <img src={user.avatar_url} alt="" className="w-16 h-16 rounded-full" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-white text-xl font-bold">
                  {(user.username || user.email)[0].toUpperCase()}
                </div>
              )}
              <div>
                <p className="text-white font-medium">{user.email}</p>
                <p className="text-sm text-zinc-400">Joined {new Date(user.created_at).toLocaleDateString()}</p>
              </div>
            </div>

            {user.bio && (
              <p className="text-zinc-400 text-sm">{user.bio}</p>
            )}

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-zinc-800">
              <div className="text-center">
                <p className="text-xl font-bold text-white">{user.posts_count}</p>
                <p className="text-xs text-zinc-500">Posts</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-white">{user.follower_count}</p>
                <p className="text-xs text-zinc-500">Followers</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-white">{user.following_count}</p>
                <p className="text-xs text-zinc-500">Following</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white">Stats & Goals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-zinc-400">Points</span>
              <span className="text-white font-bold">{user.points}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Rank</span>
              <span className="text-white font-bold">#{user.rank || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Current Weight</span>
              <span className="text-white">{user.current_weight_kg ? `${user.current_weight_kg} kg` : "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Goal Weight</span>
              <span className="text-white">{user.goal_weight_kg ? `${user.goal_weight_kg} kg` : "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Daily Calorie Goal</span>
              <span className="text-white">{user.daily_calorie_goal || "-"}</span>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white">Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Ban Status</p>
                <p className="text-sm text-zinc-400">
                  {user.is_banned ? "User is currently banned" : "User is active"}
                </p>
              </div>
              <Button
                onClick={handleToggleBan}
                disabled={actionLoading}
                variant={user.is_banned ? "default" : "destructive"}
                className={user.is_banned ? "bg-emerald-600 hover:bg-emerald-700" : ""}
              >
                {user.is_banned ? "Unban User" : "Ban User"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Points Adjustment */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white">Adjust Points</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdjustPoints} className="space-y-4">
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Points (+ or -)</label>
                <Input
                  type="number"
                  value={pointsDelta}
                  onChange={(e) => setPointsDelta(e.target.value)}
                  placeholder="e.g., 50 or -25"
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Reason</label>
                <Input
                  value={pointsReason}
                  onChange={(e) => setPointsReason(e.target.value)}
                  placeholder="Reason for adjustment..."
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
              <Button
                type="submit"
                disabled={actionLoading || !pointsDelta}
                className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500"
              >
                Adjust Points
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
