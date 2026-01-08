"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewBlogPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    featured_image: "",
    author_name: "ApexOne Team",
    category: "",
    tags: "",
    read_time: 5,
    published: false,
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: formData.slug || generateSlug(title),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { error } = await supabase.from("blog_articles").insert({
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt,
        content: formData.content,
        featured_image: formData.featured_image || null,
        author_name: formData.author_name,
        category: formData.category || null,
        tags: formData.tags ? formData.tags.split(",").map((t) => t.trim()) : null,
        read_time: formData.read_time,
        published: formData.published,
        published_at: formData.published ? new Date().toISOString() : null,
      });

      if (error) throw error;
      router.push("/content/blogs");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create article");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">New Article</h1>
        <p className="text-zinc-400 mt-1">Write a new blog post</p>
      </div>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white">Article Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Title</label>
              <Input
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                required
                className="bg-zinc-800 border-zinc-700 text-white"
                placeholder="5 Tips for Effective Meal Tracking"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Slug</label>
              <Input
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                required
                className="bg-zinc-800 border-zinc-700 text-white"
                placeholder="5-tips-effective-meal-tracking"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Excerpt</label>
              <Textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                required
                className="bg-zinc-800 border-zinc-700 text-white"
                placeholder="A brief summary of the article..."
                rows={2}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Content (HTML)</label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                required
                className="bg-zinc-800 border-zinc-700 text-white font-mono text-sm"
                placeholder="<h2>Introduction</h2><p>Your content here...</p>"
                rows={12}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Featured Image URL</label>
                <Input
                  value={formData.featured_image}
                  onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 text-white"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Author Name</label>
                <Input
                  value={formData.author_name}
                  onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Category</label>
                <Input
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 text-white"
                  placeholder="Nutrition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Tags (comma-separated)</label>
                <Input
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 text-white"
                  placeholder="fitness, nutrition, tips"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Read Time (min)</label>
                <Input
                  type="number"
                  value={formData.read_time}
                  onChange={(e) => setFormData({ ...formData, read_time: parseInt(e.target.value) })}
                  min={1}
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="published"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                className="w-4 h-4"
              />
              <label htmlFor="published" className="text-sm text-zinc-300">Publish immediately</label>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-900/50 text-red-400 text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-emerald-500 to-cyan-500"
              >
                {loading ? "Creating..." : "Create Article"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="border-zinc-700 text-zinc-300"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
