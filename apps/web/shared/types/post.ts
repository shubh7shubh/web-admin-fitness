export interface Post {
  id: string;
  author_id: string;
  content: string;
  image_url?: string;
  like_count: number;
  comment_count: number;
  created_at: string;
  updated_at: string;
  // Joined fields
  author?: {
    id: string;
    username?: string;
    full_name?: string;
    avatar_url?: string;
    points?: number;
    rank?: number;
  };
  is_liked?: boolean;
  is_saved?: boolean;
}

export interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  content: string;
  created_at: string;
  author?: {
    id: string;
    username?: string;
    full_name?: string;
    avatar_url?: string;
  };
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: "nutrition" | "workout" | "weight_loss" | "streak" | "social";
  points_reward: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  requirements?: Record<string, unknown>;
  created_at: string;
}

export interface UserChallenge {
  id: string;
  user_id: string;
  challenge_id: string;
  status: "in_progress" | "completed" | "failed" | "expired";
  progress?: Record<string, unknown>;
  points_awarded?: number;
  enrolled_at: string;
  completed_at?: string;
  challenge?: Challenge;
}
