import { createClient } from "@/lib/supabase-server";
import { Header } from "@/components/marketing/Header";
import { Footer } from "@/components/marketing/Footer";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params;
  const supabase = await createClient();
  
  const { data: profile } = await supabase
    .from("profiles")
    .select("username, full_name, bio, avatar_url")
    .eq("username", username)
    .single();

  if (!profile) {
    return { title: "User Not Found | FitnessApp" };
  }

  return {
    title: `${profile.full_name || profile.username} | FitnessApp`,
    description: profile.bio || `Check out ${profile.username}'s fitness journey on FitnessApp`,
    openGraph: {
      title: `${profile.full_name || profile.username} on FitnessApp`,
      description: profile.bio || `Follow ${profile.username}'s fitness journey`,
      images: profile.avatar_url ? [profile.avatar_url] : [],
      type: "profile",
    },
  };
}

export default async function PublicProfilePage({ params }: PageProps) {
  const { username } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();

  if (!profile) {
    notFound();
  }

  // Fetch user's public posts
  const { data: posts } = await supabase
    .from("posts")
    .select("id, content, image_url, like_count, comment_count, created_at")
    .eq("author_id", profile.id)
    .order("created_at", { ascending: false })
    .limit(12);

  const getRankBadge = (rank: number) => {
    if (rank === 1) return { color: "from-yellow-400 to-yellow-600", label: "🥇 #1" };
    if (rank === 2) return { color: "from-gray-300 to-gray-500", label: "🥈 #2" };
    if (rank === 3) return { color: "from-amber-600 to-amber-800", label: "🥉 #3" };
    if (rank <= 10) return { color: "from-purple-400 to-purple-600", label: `Top 10` };
    if (rank <= 100) return { color: "from-blue-400 to-blue-600", label: `Top 100` };
    return null;
  };

  const rankBadge = profile.rank ? getRankBadge(profile.rank) : null;

  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({
        title: `${profile.full_name || profile.username} on FitnessApp`,
        url: window.location.href,
      });
    }
  };

  return (
    <>
      <Header />
      <main className="pt-24 pb-16 min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Profile Header */}
          <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 mb-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Avatar */}
              <div className="relative">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.username}
                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-white text-3xl font-bold border-4 border-white shadow-lg">
                    {(profile.username || "U")[0].toUpperCase()}
                  </div>
                )}
                {rankBadge && (
                  <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r ${rankBadge.color} text-white text-xs font-bold rounded-full shadow`}>
                    {rankBadge.label}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-2xl font-bold text-gray-900">
                  {profile.full_name || profile.username}
                </h1>
                <p className="text-gray-500">@{profile.username}</p>
                
                {profile.bio && (
                  <p className="mt-3 text-gray-600">{profile.bio}</p>
                )}

                {/* Stats */}
                <div className="flex items-center justify-center sm:justify-start gap-6 mt-4">
                  <div className="text-center">
                    <p className="text-xl font-bold text-gray-900">{profile.points || 0}</p>
                    <p className="text-sm text-gray-500">Points</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-gray-900">{profile.follower_count || 0}</p>
                    <p className="text-sm text-gray-500">Followers</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-gray-900">{profile.following_count || 0}</p>
                    <p className="text-sm text-gray-500">Following</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-gray-900">{profile.posts_count || 0}</p>
                    <p className="text-sm text-gray-500">Posts</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-center sm:justify-start gap-3 mt-6">
                  <Button variant="outline" size="sm" onClick={handleShare}>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    Share Profile
                  </Button>
                  <Button size="sm" className="bg-gradient-to-r from-emerald-500 to-cyan-500">
                    Follow in App
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Download App CTA */}
          <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl p-4 mb-6 text-white text-center">
            <p className="font-medium">Want to interact with {profile.username}?</p>
            <p className="text-sm text-emerald-50">Download FitnessApp to follow, like posts, and send messages!</p>
          </div>

          {/* Posts Grid */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Posts</h2>
            
            {posts && posts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {posts.map((post) => (
                  <Card key={post.id} className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-0">
                      {post.image_url ? (
                        <div className="aspect-square bg-gray-100 relative">
                          <img
                            src={post.image_url}
                            alt="Post"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-2">
                            <div className="flex items-center gap-3 text-white text-xs">
                              <span>❤️ {post.like_count || 0}</span>
                              <span>💬 {post.comment_count || 0}</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="aspect-square bg-gray-50 p-3 flex flex-col justify-between">
                          <p className="text-sm text-gray-600 line-clamp-4">{post.content}</p>
                          <div className="flex items-center gap-3 text-gray-400 text-xs">
                            <span>❤️ {post.like_count || 0}</span>
                            <span>💬 {post.comment_count || 0}</span>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No posts yet</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
