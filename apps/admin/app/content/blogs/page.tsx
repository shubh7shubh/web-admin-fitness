import { createClient } from "@/lib/supabase-server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface BlogArticle {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  published_at: string | null;
  category: string | null;
  read_time: number | null;
}

export default async function BlogsPage() {
  const supabase = await createClient();

  const { data: articles } = await supabase
    .from("blog_articles")
    .select("id, title, slug, published, published_at, category, read_time")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Blog CMS</h1>
          <p className="text-zinc-400 mt-1">Manage blog articles</p>
        </div>
        <Link href="/content/blogs/new">
          <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Article
          </Button>
        </Link>
      </div>

      {articles && articles.length > 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-zinc-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase">Published</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-zinc-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {articles.map((article: BlogArticle) => (
                <tr key={article.id} className="hover:bg-zinc-800/50">
                  <td className="px-6 py-4">
                    <span className="text-white font-medium">{article.title}</span>
                    <p className="text-xs text-zinc-500 mt-1">/blogs/{article.slug}</p>
                  </td>
                  <td className="px-6 py-4 text-zinc-400">
                    {article.category || "-"}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      article.published
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}>
                      {article.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-zinc-400 text-sm">
                    {article.published_at
                      ? new Date(article.published_at).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/content/blogs/${article.id}/edit`}>
                      <Button variant="outline" size="sm" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                        Edit
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
            <p className="text-zinc-400">No articles yet. Write your first blog post!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
