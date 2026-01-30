import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect("/login");
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back{profile?.full_name ? `, ${profile.full_name}` : ""}!
        </h1>
        <p className="text-gray-600 mt-1">
          Here&apos;s an overview of your fitness journey
        </p>
      </div>

      {/* Download App CTA */}
      <div className="mb-8 p-4 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl text-white">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold text-lg">Limited Web Features</h3>
            <p className="text-emerald-50 text-sm">
              Download the app for full features including meal logging, challenges, and more!
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" className="bg-white text-emerald-600 hover:bg-gray-100">
              Download iOS
            </Button>
            <Button size="sm" className="bg-white/20 border border-white text-white hover:bg-white/30">
              Download Android
            </Button>
          </div>
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Nutrition Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              Today&apos;s Nutrition
            </CardTitle>
            <CardDescription>Your daily intake summary</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Calories</span>
                  <span className="font-medium">{profile?.daily_calorie_goal || 2000} goal</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full" style={{ width: "0%" }} />
                </div>
              </div>
              <p className="text-sm text-gray-500 text-center py-4">
                Log meals in the app to see your progress
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Weight Progress Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
              </div>
              Weight Progress
            </CardTitle>
            <CardDescription>Track your weight journey</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <p className="text-3xl font-bold text-gray-900">
                {profile?.current_weight_kg ? `${profile.current_weight_kg} kg` : "--"}
              </p>
              <p className="text-sm text-gray-500 mt-1">Current weight</p>
              {profile?.goal_weight_kg && (
                <p className="text-sm text-emerald-600 mt-2">
                  Goal: {profile.goal_weight_kg} kg
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Points & Rank Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              Points & Rank
            </CardTitle>
            <CardDescription>Your leaderboard status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <p className="text-3xl font-bold text-gray-900">
                {profile?.points || 0}
              </p>
              <p className="text-sm text-gray-500 mt-1">Total points</p>
              {profile?.rank && (
                <p className="text-sm text-purple-600 mt-2">
                  Rank #{profile.rank}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
