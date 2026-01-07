export const queryKeys = {
  // User
  user: () => ['user'] as const,
  userProfile: (userId: string) => ['user-profile', userId] as const,
  
  // Diary & Nutrition
  diaryEntries: (date: string) => ['diary-entries', date] as const,
  nutritionSummary: (date: string) => ['nutrition-summary', date] as const,
  
  // Weight
  weightHistory: () => ['weight-history'] as const,
  
  // Social
  posts: () => ['posts'] as const,
  post: (postId: string) => ['post', postId] as const,
  userPosts: (userId: string) => ['user-posts', userId] as const,
  comments: (postId: string) => ['comments', postId] as const,
  
  // Leaderboard
  leaderboard: (limit?: number) => ['leaderboard', limit] as const,
  userRank: (userId: string) => ['user-rank', userId] as const,
  
  // Challenges
  challenges: () => ['challenges'] as const,
  userChallenges: () => ['user-challenges'] as const,
  
  // Blog
  blogArticles: () => ['blog-articles'] as const,
  blogArticle: (slug: string) => ['blog-article', slug] as const,
  
  // Admin
  adminAnalytics: () => ['admin-analytics'] as const,
  adminUsers: (search?: string) => ['admin-users', search] as const,
  adminUser: (userId: string) => ['admin-user', userId] as const,
};
