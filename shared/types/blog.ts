export interface BlogArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image?: string;
  author_id?: string;
  author_name?: string;
  published: boolean;
  published_at?: string;
  read_time?: number;
  category?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

export interface BlogCategory {
  name: string;
  slug: string;
  count: number;
}
