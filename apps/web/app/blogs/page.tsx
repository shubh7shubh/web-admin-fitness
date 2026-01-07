import { createClient } from "@/lib/supabase-server";
import { Header } from "@/components/marketing/Header";
import { Footer } from "@/components/marketing/Footer";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | FitnessApp - Fitness Tips & Health Articles",
  description: "Read the latest fitness tips, nutrition advice, and health articles from the FitnessApp team.",
  openGraph: {
    title: "FitnessApp Blog - Fitness Tips & Health Articles",
    description: "Expert fitness tips, nutrition advice, and health articles.",
    type: "website",
  },
};

interface BlogArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featured_image?: string;
  author_name?: string;
  published_at?: string;
  read_time?: number;
  category?: string;
}

export default async function BlogsPage() {
  const supabase = await createClient();
  
  const { data: articles } = await supabase
    .from("blog_articles")
    .select("id, title, slug, excerpt, featured_image, author_name, published_at, read_time, category")
    .eq("published", true)
    .order("published_at", { ascending: false });

  return (
    <>
      <Header />
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Fitness Blog
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Expert tips on nutrition, workouts, and healthy living to help you reach your fitness goals.
            </p>
          </div>

          {/* Articles Grid */}
          {articles && articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article: BlogArticle) => (
                <Link key={article.id} href={`/blogs/${article.slug}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer overflow-hidden">
                    {/* Featured Image */}
                    {article.featured_image && (
                      <div className="h-48 bg-gradient-to-br from-emerald-400 to-cyan-500 relative">
                        <img
                          src={article.featured_image}
                          alt={article.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    {!article.featured_image && (
                      <div className="h-48 bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center">
                        <span className="text-white text-6xl font-bold opacity-30">F</span>
                      </div>
                    )}
                    
                    <CardHeader>
                      {article.category && (
                        <span className="text-xs font-medium text-emerald-600 uppercase tracking-wide">
                          {article.category}
                        </span>
                      )}
                      <CardTitle className="line-clamp-2">{article.title}</CardTitle>
                      <CardDescription className="line-clamp-3">
                        {article.excerpt}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{article.author_name || "FitnessApp Team"}</span>
                        <div className="flex items-center gap-2">
                          {article.read_time && (
                            <span>{article.read_time} min read</span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No articles yet</h3>
              <p className="text-gray-500">Check back soon for fitness tips and health articles!</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
