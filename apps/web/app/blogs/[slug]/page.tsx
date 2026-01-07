import { createClient } from "@/lib/supabase-server";
import { createClient as createBrowserClient } from "@/lib/supabase-browser";
import { Header } from "@/components/marketing/Header";
import { Footer } from "@/components/marketing/Footer";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

interface BlogArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image?: string;
  author_name?: string;
  published_at?: string;
  read_time?: number;
  category?: string;
  tags?: string[];
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Use browser client for build-time static generation (no cookies needed)
export async function generateStaticParams() {
  const supabase = createBrowserClient();
  const { data: articles } = await supabase
    .from("blog_articles")
    .select("slug")
    .eq("published", true);

  return articles?.map((article) => ({ slug: article.slug })) || [];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: article } = await supabase
    .from("blog_articles")
    .select("title, excerpt, featured_image")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (!article) {
    return {
      title: "Article Not Found | FitnessApp Blog",
    };
  }

  return {
    title: `${article.title} | FitnessApp Blog`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      images: article.featured_image ? [article.featured_image] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
    },
  };
}

export default async function BlogArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();
  
  const { data: article } = await supabase
    .from("blog_articles")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (!article) {
    notFound();
  }

  const typedArticle = article as BlogArticle;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      <Header />
      <main className="pt-24 pb-16 min-h-screen bg-white">
        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <Link href="/blogs" className="text-emerald-600 hover:text-emerald-700 text-sm">
              ← Back to Blog
            </Link>
          </nav>

          {/* Article Header */}
          <header className="mb-8">
            {typedArticle.category && (
              <span className="text-sm font-medium text-emerald-600 uppercase tracking-wide">
                {typedArticle.category}
              </span>
            )}
            <h1 className="text-4xl font-bold text-gray-900 mt-2 mb-4">
              {typedArticle.title}
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              {typedArticle.excerpt}
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500 border-b border-gray-100 pb-6">
              <span>{typedArticle.author_name || "FitnessApp Team"}</span>
              {typedArticle.published_at && (
                <>
                  <span>•</span>
                  <span>{formatDate(typedArticle.published_at)}</span>
                </>
              )}
              {typedArticle.read_time && (
                <>
                  <span>•</span>
                  <span>{typedArticle.read_time} min read</span>
                </>
              )}
            </div>
          </header>

          {/* Featured Image */}
          {typedArticle.featured_image && (
            <div className="mb-8 rounded-xl overflow-hidden">
              <img
                src={typedArticle.featured_image}
                alt={typedArticle.title}
                className="w-full h-auto"
              />
            </div>
          )}

          {/* Article Content */}
          <div 
            className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-a:text-emerald-600 prose-strong:text-gray-900"
            dangerouslySetInnerHTML={{ __html: typedArticle.content }}
          />

          {/* Tags */}
          {typedArticle.tags && typedArticle.tags.length > 0 && (
            <div className="mt-8 pt-8 border-t border-gray-100">
              <div className="flex flex-wrap gap-2">
                {typedArticle.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="mt-12 p-6 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl text-white text-center">
            <h3 className="text-xl font-bold mb-2">Ready to start your fitness journey?</h3>
            <p className="text-emerald-50 mb-4">Download FitnessApp and track your progress today!</p>
            <div className="flex justify-center gap-4">
              <Link href="#" className="px-6 py-2 bg-white text-emerald-600 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                Download iOS
              </Link>
              <Link href="#" className="px-6 py-2 border border-white text-white rounded-lg font-medium hover:bg-white/10 transition-colors">
                Download Android
              </Link>
            </div>
          </div>
        </article>

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              headline: typedArticle.title,
              description: typedArticle.excerpt,
              image: typedArticle.featured_image,
              author: {
                "@type": "Person",
                name: typedArticle.author_name || "FitnessApp Team",
              },
              publisher: {
                "@type": "Organization",
                name: "FitnessApp",
              },
              datePublished: typedArticle.published_at,
            }),
          }}
        />
      </main>
      <Footer />
    </>
  );
}
