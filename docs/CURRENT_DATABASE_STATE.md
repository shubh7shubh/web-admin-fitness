# Current Database State

**Last Updated:** 2025-12-28 (Workout Plan Implementation)
**Status:** Production (Live on Supabase)
**Project ID:** oswlhrzarxjpyocgxgbr
**Migration Method:** Production-Grade CLI (as of Dec 2025)

---

## Overview

This document provides a complete snapshot of the current Supabase database state.

### Migration Workflow (Updated Dec 2025)

**Previous Approach (Legacy):**
- ❌ Manual SQL Editor execution
- ❌ No automatic tracking
- ❌ Error-prone copy/paste

**Current Approach (Production-Grade):**
- ✅ `npx supabase migration new description` - Create migration
- ✅ `npx supabase db push` - Apply migration automatically
- ✅ Automatic tracking in `supabase_migrations` table
- ✅ Team-ready workflow

**Note:** All migrations prior to Dec 2025 were applied manually via SQL Editor. Future migrations should use the CLI workflow documented in `MIGRATION_WORKFLOW.md`.

---

## 1. Database Tables

### 1.1 `public.posts`

Social feed posts with images and engagement metrics.

```sql
CREATE TABLE public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  like_count INTEGER DEFAULT 0 NOT NULL,
  comment_count INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes
CREATE INDEX idx_posts_author_id ON public.posts(author_id);
CREATE INDEX idx_posts_created_at ON public.posts(created_at DESC);
```

**Columns:**
- `id` - UUID primary key
- `author_id` - Foreign key to profiles table
- `image_url` - URL to image in Storage bucket
- `caption` - Optional text caption
- `like_count` - Cached count of likes
- `comment_count` - Cached count of comments
- `created_at` - Timestamp with timezone

**RLS Policies:**
- ✅ Enabled
- Anyone can read posts
- Authenticated users can create posts
- Users can update/delete their own posts

---

### 1.2 `public.comments`

Comments on posts.

```sql
CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes
CREATE INDEX idx_comments_post_id ON public.comments(post_id);
CREATE INDEX idx_comments_author_id ON public.comments(author_id);
```

**Columns:**
- `id` - UUID primary key
- `post_id` - Foreign key to posts
- `author_id` - Foreign key to profiles
- `content` - Comment text
- `created_at` - Timestamp with timezone

**RLS Policies:**
- ✅ Enabled
- Anyone can read comments
- Authenticated users can create comments
- Users can delete their own comments

---

### 1.3 `public.likes`

Like relationships between users and posts.

```sql
CREATE TABLE public.likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(post_id, user_id)
);

-- Indexes
CREATE INDEX idx_likes_post_id ON public.likes(post_id);
CREATE INDEX idx_likes_user_id ON public.likes(user_id);
CREATE UNIQUE INDEX idx_likes_unique ON public.likes(post_id, user_id);
```

**Columns:**
- `id` - UUID primary key
- `post_id` - Foreign key to posts
- `user_id` - Foreign key to profiles
- `created_at` - Timestamp with timezone
- **UNIQUE constraint** on (post_id, user_id) - prevents duplicate likes

**RLS Policies:**
- ✅ Enabled
- Anyone can read likes
- Authenticated users can create/delete likes

---

### 1.4 `public.profiles`

User profiles for social features.

```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  points INTEGER DEFAULT 0 NOT NULL,
  follower_count INTEGER DEFAULT 0 NOT NULL,
  following_count INTEGER DEFAULT 0 NOT NULL,
  posts_count INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes
CREATE UNIQUE INDEX idx_profiles_username ON public.profiles(username);
CREATE INDEX idx_profiles_points ON public.profiles(points DESC);
```

**Columns:**
- `id` - UUID primary key (matches auth.users.id)
- `username` - Unique username
- `avatar_url` - Profile picture URL
- `bio` - User bio/description (max 150 chars)
- `points` - Gamification points
- `follower_count` - Cached count of followers (updated by toggle_follow)
- `following_count` - Cached count of users being followed (updated by toggle_follow)
- `posts_count` - Cached count of posts (updated by trigger_update_posts_count)
- `created_at` - Timestamp with timezone
- `updated_at` - Timestamp with timezone

**RLS Policies:**
- ✅ Enabled
- Anyone can read profiles
- Users can update their own profile

---

### 1.5 `public.followers`

Follow relationships between users.

```sql
CREATE TABLE public.followers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT no_self_follow CHECK (follower_id != following_id),
  CONSTRAINT unique_follow UNIQUE (follower_id, following_id)
);

-- Indexes
CREATE INDEX idx_followers_follower_id ON public.followers(follower_id);
CREATE INDEX idx_followers_following_id ON public.followers(following_id);
CREATE INDEX idx_followers_created_at ON public.followers(created_at DESC);
```

**Columns:**
- `id` - UUID primary key
- `follower_id` - User who is following (foreign key to auth.users)
- `following_id` - User being followed (foreign key to auth.users)
- `created_at` - Timestamp with timezone
- **UNIQUE constraint** on (follower_id, following_id) - prevents duplicate follows
- **CHECK constraint** prevents self-following

**RLS Policies:**
- ✅ Enabled
- Anyone can view follows
- Authenticated users can manage their own follows

---

### 1.6 `public.saved_posts`

Bookmark/save relationships between users and posts.

```sql
CREATE TABLE public.saved_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT unique_user_post UNIQUE (user_id, post_id)
);

-- Indexes
CREATE INDEX idx_saved_posts_user_id ON public.saved_posts(user_id);
CREATE INDEX idx_saved_posts_post_id ON public.saved_posts(post_id);
CREATE INDEX idx_saved_posts_created_at ON public.saved_posts(created_at DESC);
```

**Columns:**
- `id` - UUID primary key
- `user_id` - User who saved the post (foreign key to auth.users)
- `post_id` - Post that was saved (foreign key to posts)
- `created_at` - Timestamp with timezone
- **UNIQUE constraint** on (user_id, post_id) - prevents duplicate saves

**RLS Policies:**
- ✅ Enabled
- Users can view their own saved posts
- Authenticated users can save/unsave posts

---

### 1.7 `public.conversations`

1-on-1 chat conversations between users. Bidirectional uniqueness ensures only one conversation exists between any two users.

```sql
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_1_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  participant_2_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  last_message_content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT no_self_conversation CHECK (participant_1_id != participant_2_id)
);

-- Indexes
CREATE INDEX idx_conversations_participant_1 ON public.conversations(participant_1_id);
CREATE INDEX idx_conversations_participant_2 ON public.conversations(participant_2_id);
CREATE INDEX idx_conversations_last_message_at ON public.conversations(last_message_at DESC);

-- Unique index for bidirectional uniqueness (ensures user1-user2 = user2-user1)
CREATE UNIQUE INDEX idx_unique_conversation ON public.conversations(
  LEAST(participant_1_id, participant_2_id),
  GREATEST(participant_1_id, participant_2_id)
);
```

**Columns:**
- `id` - UUID primary key
- `participant_1_id` - First participant (foreign key to auth.users)
- `participant_2_id` - Second participant (foreign key to auth.users)
- `last_message_at` - Timestamp of last message (auto-updated by trigger)
- `last_message_content` - Preview of last message (auto-updated by trigger)
- `created_at` - Timestamp with timezone
- **CHECK constraint** prevents self-conversations (participant_1_id != participant_2_id)
- **UNIQUE index** on LEAST/GREATEST ensures bidirectional uniqueness

**RLS Policies:**
- ✅ Enabled
- Users can view conversations they are part of (participant_1_id OR participant_2_id)

**Database Trigger:**
- `trigger_update_conversation_last_message` - Auto-updates last_message_at and last_message_content when new message inserted

---

### 1.8 `public.messages`

Chat messages within conversations. Supports real-time delivery via Supabase Realtime.

```sql
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL CHECK (LENGTH(message) > 0 AND LENGTH(message) <= 5000),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_messages_conversation_id ON public.messages(conversation_id, created_at DESC);
CREATE INDEX idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX idx_messages_unread ON public.messages(conversation_id, is_read) WHERE is_read = FALSE;
```

**Columns:**
- `id` - UUID primary key
- `conversation_id` - Conversation this message belongs to (foreign key to conversations)
- `sender_id` - User who sent the message (foreign key to auth.users)
- `message` - Message content (1-5000 characters)
- `is_read` - Read status (default: false)
- `created_at` - Timestamp with timezone
- `updated_at` - Timestamp with timezone
- **CHECK constraint** ensures message length between 1-5000 characters

**RLS Policies:**
- ✅ Enabled
- Users can view messages in conversations they are part of
- Users can mark received messages as read (not their own messages)

**Realtime:**
- ✅ Enabled for real-time message delivery via Supabase Realtime (postgres_changes)

---

## 2. RPC Functions (PostgreSQL Functions)

### 2.1 `get_feed(limit_param INT, offset_param INT)`

Retrieves social feed posts with author info, like status, and save status. Supports pagination.

**Updated:** 2025-11-18 - Added `is_saved` field and pagination support

```sql
CREATE OR REPLACE FUNCTION public.get_feed(
  limit_param INT DEFAULT 20,
  offset_param INT DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  author_id UUID,
  caption TEXT,
  image_url TEXT,
  like_count INT,
  comment_count INT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  author JSON,
  is_liked BOOLEAN,
  is_saved BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.author_id,
    p.caption,
    p.image_url,
    p.like_count,
    p.comment_count,
    p.created_at,
    p.updated_at,
    json_build_object(
      'id', prof.id,
      'username', prof.username,
      'avatar_url', prof.avatar_url,
      'points', prof.points
    ) AS author,
    CASE
      WHEN auth.uid() IS NOT NULL THEN
        EXISTS(
          SELECT 1 FROM public.likes l
          WHERE l.post_id = p.id AND l.user_id = auth.uid()
        )
      ELSE false
    END AS is_liked,
    CASE
      WHEN auth.uid() IS NOT NULL THEN
        EXISTS(
          SELECT 1 FROM public.saved_posts sp
          WHERE sp.post_id = p.id AND sp.user_id = auth.uid()
        )
      ELSE false
    END AS is_saved
  FROM public.posts p
  LEFT JOIN public.profiles prof ON prof.id = p.author_id
  ORDER BY p.created_at DESC
  LIMIT limit_param
  OFFSET offset_param;
END;
$$;
```

**Status:** ✅ Live
**Pagination:** Supports limit and offset parameters
**Returns:** Posts with author info, is_liked status, and **is_saved** status (new)

---

### 2.2 `create_new_post(p_image_url TEXT, p_caption TEXT)`

Creates a new post and returns it with author info.

```sql
CREATE OR REPLACE FUNCTION public.create_new_post(
  p_image_url TEXT,
  p_caption TEXT DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  author_id UUID,
  caption TEXT,
  image_url TEXT,
  like_count INTEGER,
  comment_count INTEGER,
  created_at TIMESTAMPTZ,
  author JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_post_id UUID;
  current_user_id UUID;
BEGIN
  -- Get current user
  current_user_id := auth.uid();
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Insert post
  INSERT INTO posts (author_id, image_url, caption)
  VALUES (current_user_id, p_image_url, p_caption)
  RETURNING posts.id INTO new_post_id;

  -- Return post with author info
  RETURN QUERY
  SELECT
    p.id,
    p.author_id,
    p.caption,
    p.image_url,
    p.like_count,
    p.comment_count,
    p.created_at,
    jsonb_build_object(
      'id', prof.id,
      'username', prof.username,
      'avatar_url', prof.avatar_url,
      'points', prof.points
    ) AS author
  FROM posts p
  JOIN profiles prof ON p.author_id = prof.id
  WHERE p.id = new_post_id;
END;
$$;
```

**Status:** ✅ Live
**Fix Applied:** Parameters renamed to `p_image_url` and `p_caption` to avoid conflicts
**Security:** Uses auth.uid() for authentication

---

### 2.3 `toggle_like(post_id_to_toggle UUID)`

Toggles like status for a post (like if not liked, unlike if liked).

```sql
CREATE OR REPLACE FUNCTION public.toggle_like(post_id_to_toggle UUID)
RETURNS TABLE (
  liked BOOLEAN,
  like_count INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_user_id UUID;
  like_exists BOOLEAN;
  new_like_count INTEGER;
BEGIN
  -- Get authenticated user
  current_user_id := auth.uid();
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Check if like exists
  SELECT EXISTS(
    SELECT 1 FROM likes l
    WHERE l.post_id = post_id_to_toggle AND l.user_id = current_user_id
  ) INTO like_exists;

  IF like_exists THEN
    -- Unlike: Remove like
    DELETE FROM likes l
    WHERE l.post_id = post_id_to_toggle AND l.user_id = current_user_id;

    -- Decrement like count
    UPDATE posts p
    SET like_count = p.like_count - 1
    WHERE p.id = post_id_to_toggle
    RETURNING p.like_count INTO new_like_count;

    RETURN QUERY SELECT false AS liked, new_like_count;
  ELSE
    -- Like: Add like
    INSERT INTO likes (post_id, user_id)
    VALUES (post_id_to_toggle, current_user_id);

    -- Increment like count
    UPDATE posts p
    SET like_count = p.like_count + 1
    WHERE p.id = post_id_to_toggle
    RETURNING p.like_count INTO new_like_count;

    RETURN QUERY SELECT true AS liked, new_like_count;
  END IF;
END;
$$;
```

**Status:** ✅ Live
**Fix Applied:** All column references use table alias `p.` or `l.` to avoid ambiguity
**Behavior:** Atomic toggle operation with cached count update

---

### 2.4 `like_post(post_id_to_like UUID)`

Likes a post (for double-tap functionality). Idempotent - won't fail if already liked.

```sql
CREATE OR REPLACE FUNCTION public.like_post(post_id_to_like UUID)
RETURNS TABLE (
  liked BOOLEAN,
  like_count INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_user_id UUID;
  like_exists BOOLEAN;
  new_like_count INTEGER;
BEGIN
  -- Get authenticated user
  current_user_id := auth.uid();
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Check if like already exists
  SELECT EXISTS(
    SELECT 1 FROM likes l
    WHERE l.post_id = post_id_to_like AND l.user_id = current_user_id
  ) INTO like_exists;

  IF like_exists THEN
    -- Already liked, just return current state
    SELECT p.like_count INTO new_like_count
    FROM posts p
    WHERE p.id = post_id_to_like;

    RETURN QUERY SELECT true AS liked, new_like_count;
  ELSE
    -- Add like
    INSERT INTO likes (post_id, user_id)
    VALUES (post_id_to_like, current_user_id);

    -- Increment like count
    UPDATE posts p
    SET like_count = p.like_count + 1
    WHERE p.id = post_id_to_like
    RETURNING p.like_count INTO new_like_count;

    RETURN QUERY SELECT true AS liked, new_like_count;
  END IF;
END;
$$;
```

**Status:** ✅ Live
**Fix Applied:** All column references use table alias `p.` or `l.`
**Behavior:** Always ensures post is liked (won't unlike)

---

### 2.5 `create_comment(p_post_id UUID, p_content TEXT)`

Creates a comment on a post and returns it with author info.

```sql
CREATE OR REPLACE FUNCTION public.create_comment(
  p_post_id UUID,
  p_content TEXT
)
RETURNS TABLE (
  id UUID,
  post_id UUID,
  author_id UUID,
  content TEXT,
  created_at TIMESTAMPTZ,
  author JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_comment_id UUID;
  current_user_id UUID;
BEGIN
  -- Get current user
  current_user_id := auth.uid();
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Insert comment
  INSERT INTO comments (post_id, author_id, content)
  VALUES (p_post_id, current_user_id, p_content)
  RETURNING comments.id INTO new_comment_id;

  -- Increment comment count on post
  UPDATE posts p
  SET comment_count = p.comment_count + 1
  WHERE p.id = p_post_id;

  -- Return comment with author info
  RETURN QUERY
  SELECT
    c.id,
    c.post_id,
    c.author_id,
    c.content,
    c.created_at,
    jsonb_build_object(
      'id', prof.id,
      'username', prof.username,
      'avatar_url', prof.avatar_url,
      'points', prof.points
    ) AS author
  FROM comments c
  JOIN profiles prof ON c.author_id = prof.id
  WHERE c.id = new_comment_id;
END;
$$;
```

**Status:** ✅ Live
**Fix Applied:** All column references use table alias `c.` to avoid ambiguous "id" error
**Behavior:** Creates comment and atomically increments post's comment_count

---

### 2.6 `toggle_follow(user_id_to_follow UUID)`

Toggles follow status for a user (follow if not following, unfollow if following).

```sql
CREATE OR REPLACE FUNCTION public.toggle_follow(user_id_to_follow UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_user_id UUID;
  follow_exists BOOLEAN;
  new_follower_count INTEGER;
  new_following_count_for_current_user INTEGER;
BEGIN
  current_user_id := auth.uid();
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  IF current_user_id = user_id_to_follow THEN
    RAISE EXCEPTION 'Cannot follow yourself';
  END IF;

  SELECT EXISTS(
    SELECT 1 FROM followers f
    WHERE f.follower_id = current_user_id AND f.following_id = user_id_to_follow
  ) INTO follow_exists;

  IF follow_exists THEN
    DELETE FROM followers f
    WHERE f.follower_id = current_user_id AND f.following_id = user_id_to_follow;
    UPDATE profiles p SET follower_count = GREATEST(0, p.follower_count - 1) WHERE p.id = user_id_to_follow;
    UPDATE profiles p SET following_count = GREATEST(0, p.following_count - 1) WHERE p.id = current_user_id;
  ELSE
    INSERT INTO followers (follower_id, following_id) VALUES (current_user_id, user_id_to_follow);
    UPDATE profiles p SET follower_count = p.follower_count + 1 WHERE p.id = user_id_to_follow;
    UPDATE profiles p SET following_count = p.following_count + 1 WHERE p.id = current_user_id;
  END IF;

  SELECT p.follower_count INTO new_follower_count FROM profiles p WHERE p.id = user_id_to_follow;
  SELECT p.following_count INTO new_following_count_for_current_user FROM profiles p WHERE p.id = current_user_id;

  RETURN jsonb_build_object(
    'is_following', NOT follow_exists,
    'follower_count', new_follower_count,
    'following_count', new_following_count_for_current_user
  );
END;
$$;
```

**Status:** ✅ Live
**Fix Applied:** All column references use table alias `f.` and `p.` to avoid ambiguity
**Behavior:** Atomic toggle operation with cached count updates, prevents self-following
**Returns:** JSON with is_following status and updated counts

---

### 2.7 `get_followers(profile_user_id UUID)`

Retrieves list of users following the specified user.

```sql
CREATE OR REPLACE FUNCTION public.get_followers(profile_user_id UUID)
RETURNS TABLE (
  id UUID,
  username TEXT,
  avatar_url TEXT,
  points INTEGER,
  is_following BOOLEAN,
  followed_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_user_id UUID;
BEGIN
  current_user_id := auth.uid();
  RETURN QUERY
  SELECT
    p.id, p.username, p.avatar_url, p.points,
    EXISTS(SELECT 1 FROM followers f2 WHERE f2.follower_id = current_user_id AND f2.following_id = p.id) AS is_following,
    f.created_at AS followed_at
  FROM followers f
  INNER JOIN profiles p ON p.id = f.follower_id
  WHERE f.following_id = profile_user_id
  ORDER BY f.created_at DESC;
END;
$$;
```

**Status:** ✅ Live
**Returns:** Followers with their profiles and whether current user follows them back
**Ordering:** Most recent followers first

---

### 2.8 `get_following(profile_user_id UUID)`

Retrieves list of users that the specified user is following.

```sql
CREATE OR REPLACE FUNCTION public.get_following(profile_user_id UUID)
RETURNS TABLE (
  id UUID,
  username TEXT,
  avatar_url TEXT,
  points INTEGER,
  is_following BOOLEAN,
  followed_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_user_id UUID;
BEGIN
  current_user_id := auth.uid();
  RETURN QUERY
  SELECT
    p.id, p.username, p.avatar_url, p.points,
    EXISTS(SELECT 1 FROM followers f2 WHERE f2.follower_id = current_user_id AND f2.following_id = p.id) AS is_following,
    f.created_at AS followed_at
  FROM followers f
  INNER JOIN profiles p ON p.id = f.following_id
  WHERE f.follower_id = profile_user_id
  ORDER BY f.created_at DESC;
END;
$$;
```

**Status:** ✅ Live
**Returns:** Users being followed with their profiles
**Ordering:** Most recently followed first

---

### 2.9 `get_feed_following(user_id_to_check UUID)`

Retrieves social feed posts only from users that the current user is following.

```sql
CREATE OR REPLACE FUNCTION public.get_feed_following(user_id_to_check UUID)
RETURNS TABLE (
  id UUID,
  caption TEXT,
  image_url TEXT,
  like_count INTEGER,
  comment_count INTEGER,
  created_at TIMESTAMP WITH TIME ZONE,
  author JSONB,
  is_liked BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id, p.caption, p.image_url, p.like_count, p.comment_count, p.created_at,
    jsonb_build_object('id', prof.id, 'username', prof.username, 'avatar_url', prof.avatar_url, 'points', prof.points) AS author,
    EXISTS(SELECT 1 FROM likes l WHERE l.post_id = p.id AND l.user_id = user_id_to_check) AS is_liked
  FROM posts p
  INNER JOIN profiles prof ON prof.id = p.author_id
  INNER JOIN followers f ON f.following_id = p.author_id
  WHERE f.follower_id = user_id_to_check
  ORDER BY p.created_at DESC;
END;
$$;
```

**Status:** ✅ Live
**Purpose:** Powers the "Following" feed filter
**Returns:** Posts only from followed users, ordered by creation time
**Difference from get_feed:** Filters by follow relationship instead of showing all posts

---

### 2.10 `is_following(follower_user_id UUID, following_user_id UUID)`

Helper function to check if one user is following another.

```sql
CREATE OR REPLACE FUNCTION public.is_following(
  follower_user_id UUID,
  following_user_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS(
    SELECT 1 FROM followers f
    WHERE f.follower_id = follower_user_id AND f.following_id = following_user_id
  );
END;
$$;
```

**Status:** ✅ Live
**Purpose:** Utility function for checking follow relationships
**Returns:** Boolean indicating follow status

---

### 2.11 `get_user_profile(user_id_param UUID)`

Retrieves complete user profile with all stats and follow status.

```sql
CREATE OR REPLACE FUNCTION public.get_user_profile(user_id_param UUID)
RETURNS TABLE (
  id UUID,
  username TEXT,
  avatar_url TEXT,
  bio TEXT,
  points INTEGER,
  follower_count INTEGER,
  following_count INTEGER,
  posts_count INTEGER,
  is_following BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_user_id UUID;
BEGIN
  current_user_id := auth.uid();
  RETURN QUERY
  SELECT
    p.id, p.username, p.avatar_url, p.bio, p.points,
    p.follower_count, p.following_count, p.posts_count,
    EXISTS(SELECT 1 FROM followers f WHERE f.follower_id = current_user_id AND f.following_id = user_id_param) AS is_following
  FROM profiles p
  WHERE p.id = user_id_param;
END;
$$;
```

**Status:** ✅ Live
**Purpose:** Powers public user profile screens
**Returns:** Complete profile data with follow status for current user

---

### 2.12 `get_user_posts(user_id_param UUID, limit_param INT, offset_param INT)`

Retrieves posts created by a specific user with pagination support.

**Updated:** 2025-11-18 - Added `is_saved` field and `offset_param` for pagination

```sql
CREATE OR REPLACE FUNCTION public.get_user_posts(
  user_id_param UUID,
  limit_param INT DEFAULT 20,
  offset_param INT DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  author_id UUID,
  caption TEXT,
  image_url TEXT,
  like_count INT,
  comment_count INT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  author JSON,
  is_liked BOOLEAN,
  is_saved BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.author_id,
    p.caption,
    p.image_url,
    p.like_count,
    p.comment_count,
    p.created_at,
    p.updated_at,
    json_build_object(
      'id', prof.id,
      'username', prof.username,
      'avatar_url', prof.avatar_url,
      'bio', prof.bio,
      'points', prof.points
    ) AS author,
    CASE
      WHEN auth.uid() IS NOT NULL THEN
        EXISTS(
          SELECT 1 FROM public.likes l
          WHERE l.post_id = p.id AND l.user_id = auth.uid()
        )
      ELSE false
    END AS is_liked,
    CASE
      WHEN auth.uid() IS NOT NULL THEN
        EXISTS(
          SELECT 1 FROM public.saved_posts sp
          WHERE sp.post_id = p.id AND sp.user_id = auth.uid()
        )
      ELSE false
    END AS is_saved
  FROM public.posts p
  LEFT JOIN public.profiles prof ON prof.id = p.author_id
  WHERE p.author_id = user_id_param
  ORDER BY p.created_at DESC
  LIMIT limit_param
  OFFSET offset_param;
END;
$$;
```

**Status:** ✅ Live
**Purpose:** Powers user profile posts grid
**Pagination:** Supports limit and offset parameters
**Returns:** User's posts with like status and **is_saved** status (new)
**Ordering:** Most recent posts first

---

### 2.13 `update_profile_bio(new_bio TEXT)`

Updates the authenticated user's bio.

```sql
CREATE OR REPLACE FUNCTION public.update_profile_bio(new_bio TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_user_id UUID;
  updated_profile RECORD;
BEGIN
  current_user_id := auth.uid();
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  UPDATE profiles p
  SET bio = new_bio, updated_at = NOW()
  WHERE p.id = current_user_id
  RETURNING * INTO updated_profile;

  RETURN jsonb_build_object(
    'id', updated_profile.id,
    'username', updated_profile.username,
    'bio', updated_profile.bio,
    'avatar_url', updated_profile.avatar_url
  );
END;
$$;
```

**Status:** ✅ Live
**Purpose:** Powers edit profile modal bio updates
**Returns:** Updated profile as JSON
**Security:** Only allows updating own profile

---

### 2.14 `update_profile_avatar(new_avatar_url TEXT)`

Updates the authenticated user's avatar URL.

```sql
CREATE OR REPLACE FUNCTION public.update_profile_avatar(new_avatar_url TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_user_id UUID;
  updated_profile RECORD;
BEGIN
  current_user_id := auth.uid();
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  UPDATE profiles p
  SET avatar_url = new_avatar_url, updated_at = NOW()
  WHERE p.id = current_user_id
  RETURNING * INTO updated_profile;

  RETURN jsonb_build_object(
    'id', updated_profile.id,
    'username', updated_profile.username,
    'bio', updated_profile.bio,
    'avatar_url', updated_profile.avatar_url
  );
END;
$$;
```

**Status:** ✅ Live
**Purpose:** Powers edit profile modal avatar updates
**Returns:** Updated profile as JSON
**Security:** Only allows updating own profile

---

### 2.15 `delete_post(post_id_param UUID)`

Deletes a post (only by owner) and returns image URL for storage cleanup.

```sql
CREATE OR REPLACE FUNCTION public.delete_post(post_id_param UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  post_image_url TEXT;
  deleted_post_id UUID;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT p.image_url, p.id INTO post_image_url, deleted_post_id
  FROM public.posts p
  WHERE p.id = post_id_param AND p.author_id = auth.uid();

  IF deleted_post_id IS NULL THEN
    RAISE EXCEPTION 'Post not found or you do not have permission to delete it';
  END IF;

  DELETE FROM public.posts p WHERE p.id = post_id_param;

  UPDATE public.profiles prof
  SET posts_count = GREATEST(0, prof.posts_count - 1)
  WHERE prof.id = auth.uid();

  RETURN json_build_object(
    'success', true,
    'image_url', post_image_url,
    'post_id', deleted_post_id
  );
END;
$$;
```

**Status:** ✅ Live
**Purpose:** Deletes user's own posts with ownership check
**Returns:** Image URL for Edge Function storage cleanup
**Security:** Only post owner can delete

---

### 2.16 `edit_post(post_id_param UUID, new_caption TEXT)`

Updates a post's caption (only by owner).

```sql
CREATE OR REPLACE FUNCTION public.edit_post(
  post_id_param UUID,
  new_caption TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  updated_post_id UUID;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  IF LENGTH(new_caption) > 500 THEN
    RAISE EXCEPTION 'Caption too long (max 500 characters)';
  END IF;

  UPDATE public.posts p
  SET caption = new_caption, updated_at = now()
  WHERE p.id = post_id_param AND p.author_id = auth.uid()
  RETURNING p.id INTO updated_post_id;

  IF updated_post_id IS NULL THEN
    RAISE EXCEPTION 'Post not found or you do not have permission to edit it';
  END IF;

  RETURN json_build_object(
    'success', true,
    'post_id', updated_post_id,
    'caption', new_caption
  );
END;
$$;
```

**Status:** ✅ Live
**Purpose:** Updates post caption with 500 character limit
**Returns:** Updated post info as JSON
**Security:** Only post owner can edit

---

### 2.17 `toggle_save_post(post_id_param UUID)`

Saves or unsaves a post for the authenticated user.

```sql
CREATE OR REPLACE FUNCTION public.toggle_save_post(post_id_param UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  is_currently_saved BOOLEAN;
  save_id UUID;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.posts p WHERE p.id = post_id_param) THEN
    RAISE EXCEPTION 'Post not found';
  END IF;

  SELECT sp.id INTO save_id
  FROM public.saved_posts sp
  WHERE sp.user_id = auth.uid() AND sp.post_id = post_id_param;

  is_currently_saved := (save_id IS NOT NULL);

  IF is_currently_saved THEN
    DELETE FROM public.saved_posts sp
    WHERE sp.user_id = auth.uid() AND sp.post_id = post_id_param;

    RETURN json_build_object(
      'success', true,
      'is_saved', false,
      'message', 'Post unsaved'
    );
  ELSE
    INSERT INTO public.saved_posts (user_id, post_id)
    VALUES (auth.uid(), post_id_param);

    RETURN json_build_object(
      'success', true,
      'is_saved', true,
      'message', 'Post saved'
    );
  END IF;
END;
$$;
```

**Status:** ✅ Live
**Purpose:** Bookmark/unbookmark posts
**Returns:** New saved status as JSON
**Security:** Only authenticated users can save posts

---

### 2.18 `get_saved_posts(limit_param INT, offset_param INT)`

Retrieves all posts saved by the authenticated user.

```sql
CREATE OR REPLACE FUNCTION public.get_saved_posts(
  limit_param INT DEFAULT 20,
  offset_param INT DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  author_id UUID,
  caption TEXT,
  image_url TEXT,
  like_count INT,
  comment_count INT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  author JSON,
  is_liked BOOLEAN,
  is_saved BOOLEAN,
  saved_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  RETURN QUERY
  SELECT
    p.id,
    p.author_id,
    p.caption,
    p.image_url,
    p.like_count,
    p.comment_count,
    p.created_at,
    p.updated_at,
    json_build_object(
      'id', prof.id,
      'username', prof.username,
      'avatar_url', prof.avatar_url
    ) AS author,
    EXISTS(
      SELECT 1 FROM public.likes l
      WHERE l.post_id = p.id AND l.user_id = auth.uid()
    ) AS is_liked,
    true AS is_saved,
    sp.created_at AS saved_at
  FROM public.saved_posts sp
  INNER JOIN public.posts p ON p.id = sp.post_id
  LEFT JOIN public.profiles prof ON prof.id = p.author_id
  WHERE sp.user_id = auth.uid()
  ORDER BY sp.created_at DESC
  LIMIT limit_param
  OFFSET offset_param;
END;
$$;
```

**Status:** ✅ Live
**Purpose:** Retrieves user's bookmarked posts with pagination
**Returns:** Posts with author info and engagement status
**Security:** Only returns posts saved by authenticated user

---

### 2.19 `get_or_create_conversation(other_user_id UUID)`

Find existing conversation or create new one between current user and another user.

```sql
CREATE OR REPLACE FUNCTION public.get_or_create_conversation(
  other_user_id UUID
)
RETURNS TABLE (
  id UUID,
  participant_1_id UUID,
  participant_2_id UUID,
  last_message_at TIMESTAMPTZ,
  last_message_content TEXT,
  created_at TIMESTAMPTZ,
  other_user_full_name TEXT,
  other_user_avatar_url TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
-- Full function implementation
$$;
```

**Status:** ✅ Live
**Purpose:** Start or resume 1-on-1 conversation with another user
**Validation:**
- Cannot create conversation with self
- Requires follow relationship (follower OR following)
- Bidirectional conversation check (user1-user2 = user2-user1)
**Returns:** Conversation with other user's info (username, avatar)
**Security:** SECURITY DEFINER - validates follow relationship

---

### 2.20 `get_conversations()`

Get all user's conversations with last message preview and unread count.

```sql
CREATE OR REPLACE FUNCTION public.get_conversations()
RETURNS TABLE (
  id UUID,
  other_user_id UUID,
  other_user_full_name TEXT,
  other_user_avatar_url TEXT,
  last_message_at TIMESTAMPTZ,
  last_message_content TEXT,
  unread_count BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
-- Full function implementation
$$;
```

**Status:** ✅ Live
**Purpose:** Fetch all user conversations for conversations list
**Returns:**
- Conversations sorted by last_message_at DESC
- Other user's info (username, avatar)
- Unread message count
**Security:** Only returns conversations where user is participant

---

### 2.21 `send_message(p_conversation_id UUID, p_message TEXT)`

Send message in a conversation with validation and rate limiting.

```sql
CREATE OR REPLACE FUNCTION public.send_message(
  p_conversation_id UUID,
  p_message TEXT
)
RETURNS TABLE (
  id UUID,
  conversation_id UUID,
  sender_id UUID,
  message TEXT,
  is_read BOOLEAN,
  created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
-- Full function implementation
$$;
```

**Status:** ✅ Live
**Purpose:** Send chat message with validation
**Validation:**
- Message not empty (after trim)
- Message length 1-5000 characters
- User is part of conversation
- Rate limit: 30 messages per minute per user
**Returns:** Newly created message
**Security:** SECURITY DEFINER - validates conversation membership
**Trigger:** Automatically updates conversation's last_message_at and last_message_content

---

### 2.22 `get_messages(p_conversation_id UUID, p_limit INT, p_offset INT)`

Fetch paginated message history with sender info.

```sql
CREATE OR REPLACE FUNCTION public.get_messages(
  p_conversation_id UUID,
  p_limit INT DEFAULT 50,
  p_offset INT DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  conversation_id UUID,
  sender_id UUID,
  sender_full_name TEXT,
  sender_avatar_url TEXT,
  message TEXT,
  is_read BOOLEAN,
  created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
-- Full function implementation
$$;
```

**Status:** ✅ Live
**Purpose:** Load conversation message history
**Validation:** User must be part of conversation
**Returns:**
- Messages sorted by created_at DESC (newest first)
- Sender info (username, avatar)
- Pagination support (default: 50 messages)
**Security:** SECURITY DEFINER - validates conversation membership

---

### 2.23 `mark_conversation_read(p_conversation_id UUID)`

Mark all unread messages in a conversation as read.

```sql
CREATE OR REPLACE FUNCTION public.mark_conversation_read(
  p_conversation_id UUID
)
RETURNS TABLE (
  updated_count BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
-- Full function implementation
$$;
```

**Status:** ✅ Live
**Purpose:** Mark conversation messages as read when user opens chat
**Validation:** User must be part of conversation
**Returns:** Count of messages marked as read
**Security:** Only marks received messages (sender_id != current user)

---

### 2.24 `get_chat_contacts(search_term TEXT)`

Get list of users available for chat (followers + following).

```sql
CREATE OR REPLACE FUNCTION public.get_chat_contacts(
  search_term TEXT DEFAULT NULL
)
RETURNS TABLE (
  user_id UUID,
  full_name TEXT,
  avatar_url TEXT,
  is_following BOOLEAN,
  is_follower BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
-- Full function implementation
$$;
```

**Status:** ✅ Live
**Purpose:** Get contacts available for messaging
**Returns:**
- Users who are followers OR following current user
- Relationship status (is_following, is_follower)
- Searchable by username
- Sorted by username ASC
**Security:** Excludes current user from results

---

## 3. Database Triggers

### 3.1 `handle_new_user()` + Trigger

Automatically creates a profile when a new user signs up via Supabase Auth.

```sql
-- Function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, avatar_url, points)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', NEW.email, 'user_' || NEW.id),
    NEW.raw_user_meta_data->>'avatar_url',
    0
  );
  RETURN NEW;
END;
$$;

-- Trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

**Status:** ✅ Live
**Purpose:** Fixes foreign key constraint violations when creating posts
**Behavior:**
- Triggered on new user signup
- Creates profile with username from metadata, email, or generated ID
- Initializes points to 0

---

### 3.2 `update_posts_count()` + Trigger

Automatically updates posts_count when posts are created or deleted.

```sql
-- Function
CREATE OR REPLACE FUNCTION public.update_posts_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE profiles p
    SET posts_count = p.posts_count + 1
    WHERE p.id = NEW.author_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE profiles p
    SET posts_count = GREATEST(0, p.posts_count - 1)
    WHERE p.id = OLD.author_id;
    RETURN OLD;
  END IF;
END;
$$;

-- Trigger
CREATE TRIGGER trigger_update_posts_count
  AFTER INSERT OR DELETE ON public.posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_posts_count();
```

**Status:** ✅ Live
**Purpose:** Maintains cached posts_count in profiles table
**Behavior:**
- Triggered on post INSERT or DELETE
- Automatically increments/decrements posts_count
- Uses GREATEST(0, ...) to prevent negative counts
- Eliminates need for expensive COUNT(*) queries

---

### 3.3 `update_conversation_last_message()` + Trigger

Automatically updates conversation preview when new message is sent.

```sql
-- Function
CREATE OR REPLACE FUNCTION public.update_conversation_last_message()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.conversations c
  SET
    last_message_at = NEW.created_at,
    last_message_content = NEW.message
  WHERE c.id = NEW.conversation_id;

  RETURN NEW;
END;
$$;

-- Trigger
DROP TRIGGER IF EXISTS trigger_update_conversation_last_message ON public.messages;
CREATE TRIGGER trigger_update_conversation_last_message
  AFTER INSERT ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_conversation_last_message();
```

**Status:** ✅ Live
**Purpose:** Maintains conversation preview in conversations list
**Behavior:**
- Triggered on message INSERT
- Automatically updates last_message_at timestamp
- Updates last_message_content for preview
- Enables conversations list to show last message without JOIN

---

## 4. Storage Configuration

### 4.1 Bucket: `posts`

**Status:** ✅ Live
**Public Access:** ✅ Enabled
**File Size Limit:** Default
**Allowed MIME Types:** All (images recommended)

---

### 4.2 Bucket: `avatars`

**Status:** ✅ Live
**Public Access:** ✅ Enabled
**File Size Limit:** Default
**Allowed MIME Types:** Images (jpg, png, etc.)

**RLS Policies:**
- **SELECT (Public Read)**: Anyone can view avatars
  ```
  Policy Name: Public read access to avatars
  Operation: SELECT
  Target Role: public
  USING: bucket_id = 'avatars'
  ```
- **INSERT**: Authenticated users can upload avatars
  ```
  Policy Name: Authenticated users can upload avatars
  Operation: INSERT
  Target Role: authenticated
  WITH CHECK: bucket_id = 'avatars' AND auth.uid() IS NOT NULL
  ```
- **UPDATE**: Users can update their own avatars
  ```
  Policy Name: Users can update own avatars
  Operation: UPDATE
  Target Role: authenticated
  USING: bucket_id = 'avatars' AND auth.uid() IS NOT NULL
  WITH CHECK: bucket_id = 'avatars' AND auth.uid() IS NOT NULL
  ```
- **DELETE**: Users can delete their own avatars
  ```
  Policy Name: Users can delete own avatars
  Operation: DELETE
  Target Role: authenticated
  USING: bucket_id = 'avatars' AND auth.uid() IS NOT NULL
  ```

---

### 4.3 Storage Policies (Dashboard UI) - Posts Bucket

All policies were created manually via Supabase Dashboard UI due to permission constraints with SQL Editor.

#### Policy 1: INSERT - Upload Access

```
Policy Name: Authenticated users can upload to posts bucket
Operation: INSERT
Target Role: authenticated
WITH CHECK: bucket_id = 'posts' AND auth.uid() IS NOT NULL
```

**Purpose:** Allows logged-in users to upload images
**Status:** ✅ Live

---

#### Policy 2: SELECT - Public Read Access

```
Policy Name: Public read access to posts bucket
Operation: SELECT
Target Role: public
USING: bucket_id = 'posts'
```

**Purpose:** Allows anyone to view images in feed
**Status:** ✅ Live

---

#### Policy 3: UPDATE - User Update Access

```
Policy Name: Users can update their own uploads in posts bucket
Operation: UPDATE
Target Role: authenticated
USING: bucket_id = 'posts' AND auth.uid() IS NOT NULL
WITH CHECK: bucket_id = 'posts' AND auth.uid() IS NOT NULL
```

**Purpose:** Future feature - edit post images
**Status:** ✅ Live

---

#### Policy 4: DELETE - User Delete Access

```
Policy Name: Users can delete their own uploads in posts bucket
Operation: DELETE
Target Role: authenticated
USING: bucket_id = 'posts' AND auth.uid() IS NOT NULL
```

**Purpose:** Future feature - delete posts
**Status:** ✅ Live

---

## 5. Edge Functions (Deployed)

### 5.1 `create-post`

**File:** `supabase/functions/create-post/index.ts`
**Status:** ✅ Deployed
**Purpose:** Creates new social feed post with image

**RPC Call:**
```typescript
await supabaseClient.rpc("create_new_post", {
  p_image_url: payload.image_url,
  p_caption: payload.caption,
});
```

---

### 5.2 `toggle-like`

**File:** `supabase/functions/toggle-like/index.ts`
**Status:** ✅ Deployed
**Purpose:** Toggle like on heart icon tap

**RPC Call:**
```typescript
await supabaseClient.rpc("toggle_like", {
  post_id_to_toggle: post_id,
});
```

**Logging:** ✅ Comprehensive console.log statements added

---

### 5.3 `like-post`

**File:** `supabase/functions/like-post/index.ts`
**Status:** ✅ Deployed
**Purpose:** Like post on double-tap (idempotent)

**RPC Call:**
```typescript
await supabaseClient.rpc("like_post", {
  post_id_to_like: post_id,
});
```

---

### 5.4 `create-comment`

**File:** `supabase/functions/create-comment/index.ts`
**Status:** ✅ Deployed
**Purpose:** Add comment to post

**RPC Call:**
```typescript
await supabaseClient.rpc("create_comment", {
  p_post_id: post_id,
  p_content: content,
});
```

---

### 5.5 `toggle-follow`

**File:** `supabase/functions/toggle-follow/index.ts`
**Status:** ✅ Deployed
**Purpose:** Toggle follow/unfollow for users

**RPC Call:**
```typescript
await supabaseClient.rpc("toggle_follow", {
  user_id_to_follow: user_id,
});
```

**Returns:** JSON with `is_following`, `follower_count`, and `following_count`
**Logging:** ✅ Comprehensive console.log statements added

---

### 5.6 `delete-post`

**File:** `supabase/functions/delete-post/index.ts`
**Status:** ✅ Deployed
**Purpose:** Deletes post and removes image from storage

**RPC Call:**
```typescript
await supabaseClient.rpc("delete_post", {
  post_id_param: post_id,
});
```

**Additional Actions:** Deletes image from posts storage bucket using returned image_url
**Security:** Ownership verified by RPC function
**Logging:** ✅ Comprehensive console.log statements added

---

### 5.7 `edit-post`

**File:** `supabase/functions/edit-post/index.ts`
**Status:** ✅ Deployed
**Purpose:** Updates post caption (500 char limit)

**RPC Call:**
```typescript
await supabaseClient.rpc("edit_post", {
  post_id_param: post_id,
  new_caption: caption,
});
```

**Returns:** JSON with `success`, `post_id`, and `caption`
**Security:** Ownership verified by RPC function
**Logging:** ✅ Comprehensive console.log statements added

---

### 5.8 `save-post`

**File:** `supabase/functions/save-post/index.ts`
**Status:** ✅ Deployed
**Purpose:** Toggle bookmark/save status on posts

**RPC Call:**
```typescript
await supabaseClient.rpc("toggle_save_post", {
  post_id_param: post_id,
});
```

**Returns:** JSON with `success`, `is_saved`, and `message`
**Logging:** ✅ Comprehensive console.log statements added

---

## 6. Applied Fixes & Manual Changes

### 6.1 Storage Policies

**Method:** Dashboard UI
**Date:** 2025-11-09
**Reason:** SQL Editor lacked permissions on `storage.objects` table
**Documentation:** MANUAL_STORAGE_POLICY_SETUP.md

---

### 6.2 RPC Function Fixes

**Date:** 2025-11-09

**Fixed Functions:**
1. `create_new_post` - Renamed parameters to avoid conflicts
2. `toggle_like` - Added table aliases to fix ambiguous columns
3. `like_post` - Added table aliases to fix ambiguous columns
4. `create_comment` - Added table aliases to fix ambiguous "id"

**Method:** SQL Editor (CREATE OR REPLACE)

---

### 6.3 Profile Auto-Creation

**Date:** 2025-11-09
**Method:** SQL Editor
**Reason:** Foreign key constraint violations on first post creation

**Changes:**
- Created `handle_new_user()` function
- Created `on_auth_user_created` trigger
- Manually inserted existing user's profile

---

## 7. Configuration Files

### 7.1 `supabase/config.toml`

```toml
project_id = "oswlhrzarxjpyocgxgbr"

[api]
enabled = true
port = 54321

[db]
port = 54322
major_version = 17

[functions.create-post]
verify_jwt = true

[functions.toggle-like]
verify_jwt = true

[functions.like-post]
verify_jwt = true

[functions.create-comment]
verify_jwt = true
```

**Status:** ✅ Updated

---

## 8. Migration Status

### Applied via SQL Editor

- ✅ `setup_social_feed.sql` (initial schema)
- ✅ Parameter rename fix for `create_new_post`
- ✅ Ambiguity fixes for all RPC functions
- ✅ Profile trigger setup

### Applied via Dashboard UI

- ✅ Storage policies (4 policies)

### Applied via CLI (Dec 2025)

**Points System:**
- ✅ `20251207_001_add_points_system_tables.sql` - Core gamification tables
- ✅ `20251226190545_create_leaderboard_mv.sql` - Materialized view
- ✅ `20251226191751_add_points_rpc_functions_part1.sql` - Point award functions
- ✅ `20251226200204_add_leaderboard_and_challenge_rpc_functions.sql` - Leaderboard/challenge functions
- ✅ `20251226200314_add_points_system_triggers.sql` - Automation triggers
- ✅ `20251226200430_seed_initial_challenges.sql` - Sample challenges
- ✅ `20251226200857_update_get_feed_with_rank.sql` - Feed integration
- ✅ `20251226202757_fix_post_trigger_column_name.sql` - Bug fix

**Premium System (Concierge Model):**
- ✅ `20251227_concierge_premium_system.sql` - Premium tables, RPC functions, RLS policies

**Workout Plan System:**
- ✅ `20251228050951_add_workout_assessment_fields.sql` - 7 new workout columns
- ✅ `20251228051020_add_workout_plan_rpc.sql` - get_active_workout_plan() RPC
- ✅ `20251228051119_update_premium_status_with_workout_plan.sql` - Updated get_user_premium_status()
- ✅ `20251228053718_fix_workout_plan_date_calculation.sql` - Fixed DATE arithmetic bug

### Not Yet in Migration Files

The following fixes need to be extracted into individual migration files:
- `toggle_like` ambiguity fix
- `like_post` ambiguity fix
- `create_comment` ambiguity fix
- Profile auto-creation trigger

**Next Step:** Create individual migration files (see MIGRATION_WORKFLOW.md)

---

## 9. Known Issues & Limitations

### 9.1 No Comment Deletion

**Status:** Not implemented
**Impact:** Users cannot delete their comments
**Future:** Need to add RPC function and UI

---

### 9.2 No Post Deletion

**Status:** Not implemented
**Impact:** Users cannot delete their posts
**Future:** Need to add RPC function and UI

---

### 9.3 No Edit Functionality

**Status:** Not implemented
**Impact:** Cannot edit posts or comments after creation
**Future:** Need to add RPC functions and UI

---

### 9.4 No Notification System

**Status:** Not implemented
**Impact:** Users don't get notified of likes/comments
**Future:** Implement with Supabase Realtime

---

## 10. Testing & Verification

### Verified Working Features

- ✅ Create post with image upload
- ✅ View feed ordered by author points
- ✅ Like/unlike posts (toggle)
- ✅ Double-tap to like
- ✅ Add comments to posts
- ✅ View comments with author info
- ✅ Like count updates in real-time
- ✅ Comment count updates in real-time
- ✅ Auto-profile creation on signup

---

## 11. Performance Considerations

### Database Indexes

All critical foreign keys have indexes:
- ✅ `idx_posts_author_id`
- ✅ `idx_comments_post_id`
- ✅ `idx_likes_post_id`
- ✅ `idx_profiles_points` (for feed ranking)

### Caching Strategy

- Cached counts: `like_count`, `comment_count` on posts table
- Prevents expensive COUNT(*) queries on large datasets
- Updated atomically in RPC functions

---

## 12. Security

### Row Level Security (RLS)

- ✅ Enabled on all tables
- ✅ Storage policies configured
- ✅ RPC functions use SECURITY DEFINER with auth.uid() checks

### Authentication

- All write operations require authentication
- Read operations public (for feed visibility)
- Edge Functions verify JWT tokens

---

## Related Documentation

- `CLAUDE.md` - Database migration standards
- `MIGRATION_WORKFLOW.md` - How to apply new changes
- `STORAGE_POLICY_FIX.md` - Storage troubleshooting
- `MANUAL_STORAGE_POLICY_SETUP.md` - UI-based policy setup
- `SOCIAL_FEED_FEATURES.md` - Feature documentation
- `PROJECT_REVIEW.md` - Complete project overview

---

**Document Version:** 1.0
**Maintained By:** Development team
**Update Frequency:** After every database change

---

## 13. Points System & Gamification (Added Dec 2025)

### Overview

Complete points-based gamification system with leaderboards, challenges, and automated point awards.

**Migration Files:**
- `20251207_001_add_points_system_tables.sql` - Core tables
- `20251226190545_create_leaderboard_mv.sql` - Materialized view
- `20251226191751_add_points_rpc_functions_part1.sql` - Point award functions
- `20251226200204_add_leaderboard_and_challenge_rpc_functions.sql` - Leaderboard/challenge functions
- `20251226200314_add_points_system_triggers.sql` - Automation triggers
- `20251226200430_seed_initial_challenges.sql` - Sample challenges
- `20251226200857_update_get_feed_with_rank.sql` - Feed integration
- `20251226202757_fix_post_trigger_column_name.sql` - Bug fix

---

### 13.1 Extended `profiles` Table

Added points system columns to existing profiles table:

```sql
ALTER TABLE public.profiles
  ADD COLUMN subscription_tier TEXT DEFAULT 'free' 
    CHECK (subscription_tier IN ('free', 'premium', 'pro')),
  ADD COLUMN subscription_expires_at TIMESTAMPTZ,
  ADD COLUMN total_referrals INTEGER DEFAULT 0,
  ADD COLUMN rank INTEGER,
  ADD COLUMN last_daily_goal_check DATE,
  ADD COLUMN daily_streak INTEGER DEFAULT 0;
```

**New Columns:**
- `subscription_tier` - User subscription level (free/premium/pro)
- `subscription_expires_at` - Expiration timestamp for paid subscriptions
- `total_referrals` - Count of successful referrals
- `rank` - Cached leaderboard rank (updated by triggers)
- `last_daily_goal_check` - Last date daily goals were checked
- `daily_streak` - Consecutive days of goal achievement

**New Indexes:**
- `idx_profiles_subscription` - Subscription queries
- `idx_profiles_rank` - Leaderboard lookups

---

### 13.2 `challenges` Table

Fitness challenges that users can participate in to earn points.

```sql
CREATE TABLE public.challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL CHECK (LENGTH(title) >= 3 AND LENGTH(title) <= 100),
  description TEXT NOT NULL CHECK (LENGTH(description) >= 10 AND LENGTH(description) <= 1000),
  type TEXT NOT NULL CHECK (type IN ('workout', 'nutrition', 'weight_loss', 'streak', 'social')),
  points_reward INTEGER NOT NULL CHECK (points_reward > 0),
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  requirements JSONB DEFAULT '{}' NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  CONSTRAINT valid_date_range CHECK (end_date > start_date)
);
```

**Columns:**
- `id` - UUID primary key
- `title` - Challenge name (3-100 chars)
- `description` - Challenge description (10-1000 chars)
- `type` - Challenge category (workout/nutrition/weight_loss/streak/social)
- `points_reward` - Points awarded on completion
- `start_date` - When challenge becomes available
- `end_date` - Challenge expiration
- `requirements` - JSONB with challenge criteria
- `is_active` - Whether challenge is currently active
- `created_by` - User who created the challenge (optional)

**Indexes:**
- `idx_challenges_active` - Active challenges by start date
- `idx_challenges_type` - Filter by challenge type
- `idx_challenges_dates` - Date range queries

**RLS Policies:**
- Anyone can view active challenges

**Seeded Challenges (5):**
1. 7-Day Nutrition Streak (50 pts)
2. Macro Master (75 pts)
3. Social Butterfly (30 pts)
4. Weight Loss Warrior (100 pts)
5. Consistency King (60 pts)

---

### 13.3 `user_challenges` Table

Tracks user progress on enrolled challenges.

```sql
CREATE TABLE public.user_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  progress JSONB DEFAULT '{}' NOT NULL,
  status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'failed', 'expired')),
  points_awarded INTEGER DEFAULT 0,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, challenge_id)
);
```

**Columns:**
- `id` - UUID primary key
- `user_id` - User participating in challenge
- `challenge_id` - Challenge being attempted
- `progress` - JSONB tracking progress
- `status` - Current state (in_progress/completed/failed/expired)
- `points_awarded` - Points earned (0 until completed)
- `started_at` - Enrollment timestamp
- `completed_at` - Completion timestamp

**Indexes:**
- `idx_user_challenges_user_id` - User's challenges
- `idx_user_challenges_challenge_id` - Challenge participants
- `idx_user_challenges_status` - Filter by status

**RLS Policies:**
- Users can view their own challenges
- Users can join challenges
- Users can update their own challenges

---

### 13.4 `referrals` Table

Tracks user referrals for point rewards.

```sql
CREATE TABLE public.referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referred_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  points_awarded INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  CONSTRAINT no_self_referral CHECK (referrer_id != referred_user_id),
  UNIQUE(referred_user_id)
);
```

**Columns:**
- `id` - UUID primary key
- `referrer_id` - User who referred someone
- `referred_user_id` - User who was referred
- `points_awarded` - Points earned (25 when completed)
- `status` - Referral state (pending/completed/cancelled)
- `completed_at` - When referral was completed

**Constraints:**
- No self-referrals
- Each user can only be referred once

**Indexes:**
- `idx_referrals_referrer` - Referrer's referrals
- `idx_referrals_referred_user` - Check if user was referred

**RLS Policies:**
- Users can view their referrals (both sent and received)

---

### 13.5 `points_history` Table

Complete audit trail of all point transactions.

```sql
CREATE TABLE public.points_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  points_change INTEGER NOT NULL,
  reason TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Columns:**
- `id` - UUID primary key
- `user_id` - User who earned/lost points
- `points_change` - Positive for earning, negative for deductions
- `reason` - Reason code (post_created/daily_goal/challenge_complete/referral)
- `metadata` - JSONB with additional context
- `created_at` - Transaction timestamp

**Indexes:**
- `idx_points_history_user_id` - User's point history
- `idx_points_history_reason` - Filter by reason
- `idx_points_history_created_at` - Time-based queries

**RLS Policies:**
- Users can view their own points history

**Common Reason Codes:**
- `post_created` - 2 points per post (max 10/day)
- `daily_goal_achievement` - 10+ points for meeting nutrition goals
- `challenge_completed` - Challenge reward points
- `referral_completed` - 25 points for successful referral

---

### 13.6 `leaderboard_mv` Materialized View

Pre-calculated leaderboard for instant queries (<10ms).

```sql
CREATE MATERIALIZED VIEW public.leaderboard_mv AS
SELECT
  p.id,
  p.username,
  p.avatar_url,
  p.points,
  p.follower_count,
  ROW_NUMBER() OVER (ORDER BY p.points DESC, p.created_at ASC) AS rank
FROM public.profiles p
WHERE p.points > 0
ORDER BY p.points DESC, p.created_at ASC
LIMIT 100;

CREATE UNIQUE INDEX idx_leaderboard_mv_id ON public.leaderboard_mv(id);
CREATE INDEX idx_leaderboard_mv_rank ON public.leaderboard_mv(rank);
CREATE INDEX idx_leaderboard_mv_points ON public.leaderboard_mv(points DESC);
```

**Purpose:**
- Stores top 100 users by points
- Refreshed when significant point changes occur
- Provides instant leaderboard queries

**Refresh Strategy:**
- Automatic: Trigger fires when user gains >= 10 points
- Manual: `SELECT refresh_leaderboard();`
- Uses CONCURRENTLY to avoid blocking reads

---

## 14. Points System RPC Functions

### 14.1 `award_points()` - Central Point Award Function

Awards points to a user, logs to history, and updates rank.

```sql
CREATE OR REPLACE FUNCTION public.award_points(
  p_user_id UUID,
  p_points_amount INTEGER,
  p_reason TEXT,
  p_metadata JSONB DEFAULT NULL
)
RETURNS TABLE (
  success BOOLEAN,
  new_total_points INTEGER,
  new_rank INTEGER,
  points_awarded INTEGER
)
```

**Parameters:**
- `p_user_id` - User receiving points
- `p_points_amount` - Points to award (positive or negative)
- `p_reason` - Reason code for audit trail
- `p_metadata` - Optional JSONB with context

**Returns:**
- `success` - Always TRUE (or raises exception)
- `new_total_points` - User's new total
- `new_rank` - User's new leaderboard rank
- `points_awarded` - Points added this transaction

**Behavior:**
1. Atomically updates user's points
2. Logs transaction to points_history
3. Calculates new rank (from materialized view or on-demand)
4. Updates cached rank in profiles table

**Usage:**
```sql
SELECT * FROM award_points(
  'user-uuid',
  10,
  'daily_goal_achievement',
  '{"calorie_progress": 95.5, "streak": 7}'::jsonb
);
```

---

### 14.2 `check_daily_goal_achievement()` - Auto Daily Goal Check

Checks if user met daily nutrition goals and awards points.

```sql
CREATE OR REPLACE FUNCTION public.check_daily_goal_achievement(
  p_user_id UUID,
  p_date DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE (
  success BOOLEAN,
  points_awarded INTEGER,
  achievement_type TEXT,
  message TEXT
)
```

**Point Awards:**
- **10 points** - Met calorie goal (90-110% of target)
- **+5 points** - Met all macro goals (protein, carbs, fats)
- **+1-10 points** - Streak bonus (1 point per consecutive day, max 10)

**Streak Logic:**
- Increments if yesterday was also successful
- Resets to 0 if goal not met
- Stored in `profiles.daily_streak`

**Usage:**
```sql
SELECT * FROM check_daily_goal_achievement('user-uuid', '2025-12-26');
```

---

### 14.3 `get_leaderboard()` - Fetch Top Users

Retrieves top N users from leaderboard.

```sql
CREATE OR REPLACE FUNCTION public.get_leaderboard(
  p_limit INTEGER DEFAULT 20
)
RETURNS TABLE (
  id UUID,
  username TEXT,
  avatar_url TEXT,
  points INTEGER,
  follower_count INTEGER,
  rank BIGINT
)
```

**Parameters:**
- `p_limit` - Number of users to return (default 20)

**Returns:** Top users with rank, points, follower count

**Usage:**
```sql
SELECT * FROM get_leaderboard(10); -- Top 10 users
```

---

### 14.4 `get_user_rank()` - Get User's Rank

Gets specific user's rank and percentile.

```sql
CREATE OR REPLACE FUNCTION public.get_user_rank(
  p_user_id UUID DEFAULT NULL
)
RETURNS TABLE (
  user_id UUID,
  username TEXT,
  avatar_url TEXT,
  points INTEGER,
  rank BIGINT,
  percentile NUMERIC
)
```

**Parameters:**
- `p_user_id` - User to check (defaults to current user)

**Returns:**
- User's rank, points, and percentile (0-100, higher is better)

**Percentile Calculation:**
- Top 5% = 95th percentile
- Calculated as: `(1 - rank/total_users) * 100`

**Usage:**
```sql
SELECT * FROM get_user_rank(); -- Current user's rank
```

---

### 14.5 `enroll_in_challenge()` - Join a Challenge

Enrolls current user in a challenge.

```sql
CREATE OR REPLACE FUNCTION public.enroll_in_challenge(
  p_challenge_id UUID
)
RETURNS TABLE (
  success BOOLEAN,
  user_challenge_id UUID,
  message TEXT
)
```

**Validations:**
- Challenge must be active
- Challenge must have started
- Challenge must not be expired
- User cannot enroll twice

**Usage:**
```sql
SELECT * FROM enroll_in_challenge('challenge-uuid');
```

---

### 14.6 `complete_challenge()` - Mark Challenge Complete

Marks challenge as completed and awards points.

```sql
CREATE OR REPLACE FUNCTION public.complete_challenge(
  p_user_id UUID,
  p_challenge_id UUID
)
RETURNS TABLE (
  success BOOLEAN,
  points_awarded INTEGER,
  new_total_points INTEGER,
  message TEXT
)
```

**Behavior:**
1. Verifies user is enrolled
2. Updates status to 'completed'
3. Calls `award_points()` with challenge reward
4. Returns success message

**Usage:**
```sql
SELECT * FROM complete_challenge('user-uuid', 'challenge-uuid');
```

---

### 14.7 `get_feed()` - Updated with Rank

Feed function updated to include user rank for badge display.

**Changes:**
- Added `rank` to author JSONB object
- Prioritizes top 20 users' posts
- Sorts: Top 20 first, then by created_at DESC

**Author Object:**
```json
{
  "id": "user-uuid",
  "username": "john_doe",
  "avatar_url": "https://...",
  "points": 150,
  "rank": 5,
  "is_following": true
}
```

---

## 15. Points System Database Triggers

### 15.1 Auto-Refresh Leaderboard Trigger

Refreshes leaderboard when user earns >= 10 points.

```sql
CREATE TRIGGER on_points_change_refresh_leaderboard
  AFTER INSERT OR UPDATE OF points ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION trigger_refresh_leaderboard();
```

**Behavior:**
- Fires on INSERT or UPDATE of points column
- Only refreshes if change >= 10 points
- Uses CONCURRENTLY to avoid blocking

---

### 15.2 Post Creation Point Award Trigger

Awards 2 points per post, max 10 posts/day.

```sql
CREATE TRIGGER on_post_created_award_points
  AFTER INSERT ON public.posts
  FOR EACH ROW
  EXECUTE FUNCTION trigger_award_post_points();
```

**Rate Limiting:**
- 2 points per post
- Maximum 10 posts per day earn points
- 11th+ posts create no points (prevents gaming)

**Metadata Logged:**
```json
{
  "post_id": "post-uuid",
  "posts_today": 5
}
```

---

### 15.3 Daily Goal Check Trigger

Auto-checks daily goals when diary entry added/updated.

```sql
CREATE TRIGGER on_diary_entry_check_daily_goal
  AFTER INSERT OR UPDATE OF calories, protein_g, carbs_g, fat_g ON public.diary_entries
  FOR EACH ROW
  EXECUTE FUNCTION trigger_check_daily_goal();
```

**Behavior:**
- Fires when nutrition macros change
- Only checks if not already checked today
- Calls `check_daily_goal_achievement()`

---

### 15.4 Referral Point Award Trigger

Awards 25 points when referral is completed.

```sql
CREATE TRIGGER on_referral_completed_award_points
  AFTER UPDATE OF status ON public.referrals
  FOR EACH ROW
  WHEN (NEW.status = 'completed' AND OLD.status = 'pending')
  EXECUTE FUNCTION trigger_award_referral_points();
```

**Behavior:**
- Awards 25 points to referrer
- Updates referral record
- Increments `total_referrals` counter

---

## 16. Points Economy Summary

### Point Sources

| Action | Points | Daily Limit | Notes |
|--------|--------|-------------|-------|
| Create Post | 2 | 10 posts | Max 20 pts/day |
| Meet Calorie Goal | 10 | 1 check | 90-110% of target |
| Meet All Macros | +5 | 1 check | Bonus on top of calorie goal |
| Daily Streak | +1 to +10 | 1 check | Consecutive days bonus |
| Complete Challenge | 30-100 | Unlimited | Varies by challenge |
| Successful Referral | 25 | Unlimited | One-time per referral |

### Maximum Daily Points

- **Posts:** 20 points (10 posts × 2)
- **Daily Goals:** 25 points (10 base + 5 macros + 10 streak max)
- **Challenges:** Unlimited (challenge-dependent)
- **Total Regular:** ~45 points/day from routine activities

### Leaderboard Mechanics

- **Ranking:** Points DESC, then created_at ASC (tiebreaker)
- **Top 100:** Cached in materialized view
- **Top 20:** Posts prioritized in feed, rank badges shown
- **Updates:** Real-time via triggers
- **Performance:** <10ms queries via materialized view

---

## 17. Premium Features (Concierge Model)

**Implementation Date:** December 27, 2025
**Approach:** Manual Expert Creation ("Concierge MVP")
**Documentation:** See `PREMIUM_ADMIN_WORKFLOW.md` and `CONCIERGE_PREMIUM_IMPLEMENTATION_GUIDE.md`

### 17.1 premium_assessments Table

Stores user questionnaire data for premium plan creation.

**Schema:**
```sql
CREATE TABLE public.premium_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- User Assessment Data (17 fields in 3 sections)
  -- Section 1: General Information
  fitness_goals TEXT NOT NULL CHECK (LENGTH(fitness_goals) >= 10 AND LENGTH(fitness_goals) <= 500),

  -- Section 2: Nutrition Questions
  dietary_preferences TEXT CHECK (LENGTH(dietary_preferences) <= 1000),
  health_conditions TEXT CHECK (LENGTH(health_conditions) <= 1000),
  activity_level TEXT NOT NULL CHECK (activity_level IN ('sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extremely_active')),
  meal_frequency INTEGER CHECK (meal_frequency >= 1 AND meal_frequency <= 8),
  favorite_foods TEXT CHECK (LENGTH(favorite_foods) <= 500),
  foods_to_avoid TEXT CHECK (LENGTH(foods_to_avoid) <= 500),

  -- Section 3: Workout Questions
  workout_experience TEXT NOT NULL CHECK (workout_experience IN ('beginner', 'intermediate', 'advanced')),
  available_equipment TEXT CHECK (LENGTH(available_equipment) <= 500),
  time_availability TEXT NOT NULL CHECK (time_availability IN ('15min', '30min', '45min', '60min_plus')),
  workout_days_per_week INTEGER CHECK (workout_days_per_week >= 1 AND workout_days_per_week <= 7),
  preferred_workout_split TEXT CHECK (preferred_workout_split IN ('full_body', 'upper_lower', 'push_pull_legs', 'body_part', 'no_preference')) DEFAULT 'no_preference',
  primary_workout_goal TEXT NOT NULL DEFAULT 'general_fitness' CHECK (primary_workout_goal IN ('muscle_gain', 'strength', 'fat_loss', 'endurance', 'general_fitness')),
  cardio_preference TEXT NOT NULL DEFAULT 'minimal' CHECK (cardio_preference IN ('none', 'minimal', 'moderate', 'high')),
  workout_limitations TEXT CHECK (LENGTH(workout_limitations) <= 1000),
  workout_environment TEXT NOT NULL DEFAULT 'commercial_gym' CHECK (workout_environment IN ('home', 'commercial_gym', 'both', 'outdoor')),
  preferred_workout_time TEXT CHECK (preferred_workout_time IN ('morning', 'afternoon', 'evening', 'flexible')),

  -- Admin Fields
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'inactive')),
  admin_notes TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_one_active_assessment_per_user
  ON premium_assessments(user_id)
  WHERE status = 'active';
```

**Status Flow:**
- `pending` → User submitted assessment, waiting for admin to create plan
- `active` → Plan created and activated by admin
- `inactive` → Old assessment deactivated when new one submitted

**Indexes:**
- `idx_premium_assessments_user_id` - Fast user lookups
- `idx_premium_assessments_status` - Admin queries for pending assessments
- `idx_one_active_assessment_per_user` - Ensures one active assessment per user

**Triggers:**
- `update_premium_assessment_updated_at` - Auto-update updated_at timestamp

### 17.2 diet_plans Table

Stores expert-created personalized diet plans as JSONB.

**Schema:**
```sql
CREATE TABLE public.diet_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  assessment_id UUID REFERENCES premium_assessments(id) ON DELETE SET NULL,

  -- Plan Metadata
  plan_name TEXT NOT NULL CHECK (LENGTH(plan_name) >= 3 AND LENGTH(plan_name) <= 100),
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  duration_weeks INTEGER NOT NULL DEFAULT 4 CHECK (duration_weeks >= 1 AND duration_weeks <= 52),

  -- Plan Data (JSONB structure)
  plan_data JSONB NOT NULL,

  -- Status
  is_active BOOLEAN NOT NULL DEFAULT true,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_one_active_diet_plan_per_user
  ON diet_plans(user_id)
  WHERE is_active = true;
```

**JSONB Structure:**
```json
{
  "weeks": [
    {
      "week_number": 1,
      "days": [
        {
          "day_number": 1,
          "meals": [
            {
              "meal_type": "breakfast",
              "name": "Protein Oatmeal Bowl",
              "calories": 350,
              "protein": 25,
              "carbs": 45,
              "fat": 8,
              "instructions": "Cook oats, add protein powder, top with berries"
            }
          ]
        }
      ]
    }
  ]
}
```

**Meal Types:** `breakfast`, `lunch`, `dinner`, `snacks`

**Indexes:**
- `idx_diet_plans_user_id` - Fast user lookups
- `idx_diet_plans_assessment_id` - Link to assessment
- `idx_one_active_diet_plan_per_user` - Ensures one active plan per user

### 17.3 workout_plans Table

Stores expert-created personalized workout plans as JSONB.

**Status:** ✅ Fully Implemented (Dec 2025)

**Schema:**
```sql
CREATE TABLE public.workout_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  assessment_id UUID REFERENCES premium_assessments(id) ON DELETE SET NULL,

  -- Plan Metadata
  plan_name TEXT NOT NULL CHECK (LENGTH(plan_name) >= 3 AND LENGTH(plan_name) <= 100),
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  duration_weeks INTEGER NOT NULL DEFAULT 4 CHECK (duration_weeks >= 1 AND duration_weeks <= 52),

  -- Plan Data (JSONB structure)
  routine_data JSONB NOT NULL,

  -- Status
  is_active BOOLEAN NOT NULL DEFAULT true,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_one_active_workout_plan_per_user
  ON workout_plans(user_id)
  WHERE is_active = true;
```

**JSONB Structure (routine_data):**
```json
{
  "weeks": [
    {
      "week_number": 1,
      "focus": "Hypertrophy - Building Foundation",
      "days": [
        {
          "day_number": 1,
          "day_name": "Push (Chest, Shoulders, Triceps)",
          "estimated_duration_minutes": 60,
          "exercises": [
            {
              "name": "Barbell Bench Press",
              "muscle_groups": ["chest", "triceps", "shoulders"],
              "type": "strength",
              "sets": 4,
              "reps": "8-10",
              "weight": "135 lbs",
              "rest_seconds": 90,
              "tempo": "3-0-1-0",
              "instructions": "Lie on bench, grip bar slightly wider than shoulder-width...",
              "form_tips": "Don't bounce the bar off your chest. Keep wrists straight...",
              "alternative_exercises": ["Dumbbell Bench Press", "Incline Barbell Press"]
            }
          ],
          "notes": "First week - focus on learning proper form."
        }
      ]
    }
  ]
}
```

**Exercise Types:** `strength`, `cardio`, `stretching`, `warmup`, `cooldown`

**Muscle Groups:** `chest`, `back`, `shoulders`, `biceps`, `triceps`, `forearms`, `abs`, `obliques`, `quadriceps`, `hamstrings`, `glutes`, `calves`, `cardio`

**Indexes:**
- `idx_workout_plans_user_id` - Fast user lookups
- `idx_workout_plans_assessment_id` - Link to assessment
- `idx_one_active_workout_plan_per_user` - Ensures one active plan per user

**Sample Data:** See `docs/SAMPLE_WORKOUT_PLAN_INSERT.sql` for complete 4-week Push/Pull/Legs program example

### 17.4 RPC Functions

#### submit_premium_assessment

Creates or updates pending assessment for authenticated user.

**Signature:**
```sql
submit_premium_assessment(
  p_fitness_goals TEXT,
  p_dietary_preferences TEXT DEFAULT NULL,
  p_health_conditions TEXT DEFAULT NULL,
  p_activity_level TEXT DEFAULT 'moderately_active',
  p_meal_frequency INTEGER DEFAULT 3,
  p_favorite_foods TEXT DEFAULT NULL,
  p_foods_to_avoid TEXT DEFAULT NULL,
  p_workout_experience TEXT DEFAULT 'beginner',
  p_available_equipment TEXT DEFAULT NULL,
  p_time_availability TEXT DEFAULT '30min'
) RETURNS UUID
```

**Behavior:**
- Deactivates old pending assessments
- Creates new pending assessment
- Returns new assessment_id

**Security:** SECURITY DEFINER, validates auth.uid()

#### get_user_premium_status

Returns comprehensive premium status for gatekeeper logic.

**Signature:**
```sql
get_user_premium_status() RETURNS TABLE(
  has_subscription BOOLEAN,
  subscription_tier TEXT,
  has_assessment BOOLEAN,
  assessment_status TEXT,
  has_diet_plan BOOLEAN,
  has_workout_plan BOOLEAN,
  gatekeeper_state TEXT
)
```

**Gatekeeper States:**
- `upsell` - Free user, show marketing screen
- `needs_assessment` - Premium user without assessment, redirect to form
- `pending` - Assessment submitted, show waiting room
- `active` - Plan ready, show dashboard

**Security:** SECURITY DEFINER, validates auth.uid()

**Used By:** `usePremiumStatus()` hook, Plans tab gatekeeper

#### get_active_diet_plan

Fetches active diet plan with calculated current week/day.

**Signature:**
```sql
get_active_diet_plan() RETURNS TABLE(
  plan_id UUID,
  plan_name TEXT,
  start_date DATE,
  duration_weeks INTEGER,
  plan_data JSONB,
  current_week INTEGER,
  current_day INTEGER,
  created_at TIMESTAMPTZ
)
```

**Behavior:**
- Returns NULL if no active plan (PGRST116 error handled by frontend)
- Calculates current_week and current_day based on start_date
- Returns single most recent active plan

**Security:** SECURITY DEFINER, validates auth.uid()

**Used By:** `useDietPlan()` hook, DietPlanView component

#### get_active_workout_plan

Fetches active workout plan with calculated current week/day.

**Signature:**
```sql
get_active_workout_plan() RETURNS TABLE(
  id UUID,
  plan_name TEXT,
  start_date DATE,
  duration_weeks INTEGER,
  current_week INTEGER,
  current_day INTEGER,
  routine_data JSONB,
  created_at TIMESTAMPTZ
)
```

**Behavior:**
- Returns NULL if no active plan (PGRST116 error handled by frontend)
- Calculates current_week and current_day based on start_date using integer arithmetic
- Returns single most recent active plan
- Date calculation: `days_since_start = CURRENT_DATE - start_date` (returns INTEGER directly)
- Week calculation: `(days_since_start / 7) + 1` (1-indexed)
- Day calculation: `(days_since_start % 7) + 1` (1-indexed)

**Security:** SECURITY DEFINER, validates auth.uid()

**Used By:** `useWorkoutPlan()` hook, WorkoutPlanView component

**Bug Fix:** Migration `20251228053718_fix_workout_plan_date_calculation.sql` corrected date calculation from `EXTRACT(DAY FROM (CURRENT_DATE - start_date))` to `(CURRENT_DATE - start_date)` because PostgreSQL's DATE - DATE returns INTEGER directly, not an interval.

**Data Mapping:** Frontend hook maps `routine_data` → `plan_data` to match TypeScript interface

#### log_planned_meal_v2

Logs meal from diet plan to diary_entries without requiring food_id.

**Signature:**
```sql
log_planned_meal_v2(
  p_meal_name TEXT,
  p_calories NUMERIC,
  p_protein NUMERIC,
  p_carbs NUMERIC,
  p_fat NUMERIC,
  p_meal_type TEXT,
  p_date DATE DEFAULT CURRENT_DATE
) RETURNS UUID
```

**Behavior:**
- Inserts into diary_entries with food_id = NULL
- Uses denormalized nutrition data from plan
- Sets serving_size = '1 serving' by default
- Returns entry_id

**Security:** SECURITY DEFINER, validates auth.uid() and meal_type

**Used By:** "Eat This" button in DietPlanView component

### 17.5 RLS Policies

**premium_assessments:**
- `Users can view own assessments` - SELECT where auth.uid() = user_id
- `Users can create own assessments` - INSERT with auth.uid() = user_id
- `Users can update own pending assessments` - UPDATE where status = 'pending'

**diet_plans:**
- `Users can view own diet plans` - SELECT where auth.uid() = user_id

**workout_plans:**
- `Users can view own workout plans` - SELECT where auth.uid() = user_id

**Admin Access:** Plans are created manually via Supabase Dashboard SQL Editor (elevated privileges)

### 17.6 Premium Workflow

**User Journey:**
1. User subscribes (or uses dev toggle to set subscription_tier = 'premium')
2. Plans tab detects premium status → redirects to assessment form
3. User fills 10-field assessment → submits
4. Status changes to 'pending', Plans tab shows waiting room
5. Admin creates JSON plan → inserts into diet_plans table via SQL
6. Admin updates assessment status to 'active'
7. Plans tab automatically refetches → shows plan dashboard
8. User taps "Eat This" → meal logged to diary

**Admin Workflow:** See `PREMIUM_ADMIN_WORKFLOW.md`

### 17.7 Frontend Integration

**New Components:**
- `modules/premium/components/UpsellView.tsx` - Marketing screen (State 1)
- `modules/premium/components/AssessmentForm.tsx` - 10-field questionnaire (State 2)
- `modules/premium/components/AssessmentPendingView.tsx` - Waiting room (State 3)
- `modules/premium/components/PlanDashboard.tsx` - Tab switcher (State 4)
- `modules/premium/components/DietPlanView.tsx` - Plan renderer with "Eat This" buttons
- `modules/premium/components/WorkoutPlanView.tsx` - Placeholder

**New Hooks:**
- `modules/premium/hooks/usePremiumStatus.ts` - Fetch gatekeeper state (5min stale time)
- `modules/premium/hooks/useDietPlan.ts` - Fetch active diet plan (10min stale time)
- `modules/premium/hooks/useSubmitAssessment.ts` - Submit assessment mutation

**New Routes:**
- `app/(tabs)/plans.tsx` - Main gatekeeper screen
- `app/(modals)/premium-assessment.tsx` - Assessment form modal

**Query Keys:**
- `queryKeys.premiumStatus()` → `['premium', 'status']`
- `queryKeys.dietPlan()` → `['premium', 'diet-plan']`
- `queryKeys.assessment(id?)` → `['premium', 'assessment', id?]`

**State Management:**
- UserStore extended with premiumStatus, loadingPremiumStatus, fetchPremiumStatus(), clearPremiumStatus()
- Premium status fetched in AuthProvider after user login

**Dev Tools:**
- Profile screen includes dev-only subscription toggle (__DEV__ check)
- Allows testing all 4 gatekeeper states without Supabase Dashboard

### 17.8 Migration Files

- `20251227_concierge_premium_system.sql` - Main migration with tables, RPC functions, RLS policies

---

