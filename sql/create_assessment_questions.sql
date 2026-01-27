-- ============================================================
-- Assessment Questions Table + Seed Data
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. Create assessment_questions table
CREATE TABLE IF NOT EXISTS assessment_questions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  field_key text NOT NULL UNIQUE,
  label text NOT NULL,
  section text NOT NULL CHECK (section IN ('general', 'nutrition', 'workout')),
  field_type text NOT NULL CHECK (field_type IN ('textarea', 'select', 'number')),
  placeholder text,
  options jsonb,
  is_required boolean DEFAULT false,
  max_length integer,
  min_value integer,
  max_value integer,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean DEFAULT true,
  is_legacy boolean DEFAULT false,
  default_value text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_assessment_questions_active
  ON assessment_questions (is_active, sort_order);

-- 2. Add custom_answers column to premium_assessments (for new custom questions)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'premium_assessments' AND column_name = 'custom_answers'
  ) THEN
    ALTER TABLE premium_assessments ADD COLUMN custom_answers jsonb DEFAULT '{}'::jsonb;
  END IF;
END $$;

-- 3. RLS Policies
ALTER TABLE assessment_questions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read active questions (web app needs this)
CREATE POLICY "Anyone can read active assessment questions"
  ON assessment_questions FOR SELECT
  USING (is_active = true);

-- 4. Seed the 17 existing legacy questions
INSERT INTO assessment_questions (field_key, label, section, field_type, placeholder, options, is_required, max_length, min_value, max_value, sort_order, is_legacy, default_value) VALUES

-- GENERAL SECTION (2 questions)
('fitness_goals', 'What are your fitness goals?', 'general', 'textarea',
  'e.g., Lose 10kg, build muscle, improve endurance...',
  NULL, true, 500, NULL, NULL, 1, true, NULL),

('activity_level', 'Activity Level', 'general', 'select',
  NULL,
  '[{"value":"sedentary","label":"Sedentary (little to no exercise)"},{"value":"lightly_active","label":"Lightly Active (1-3 days/week)"},{"value":"moderately_active","label":"Moderately Active (3-5 days/week)"},{"value":"very_active","label":"Very Active (6-7 days/week)"},{"value":"extremely_active","label":"Extremely Active (physical job + training)"}]'::jsonb,
  true, NULL, NULL, NULL, 2, true, 'moderately_active'),

-- NUTRITION SECTION (5 questions)
('dietary_preferences', 'Dietary Preferences', 'nutrition', 'textarea',
  'e.g., Vegetarian, Vegan, Keto, No restrictions...',
  NULL, false, 1000, NULL, NULL, 1, true, NULL),

('health_conditions', 'Health Conditions or Allergies', 'nutrition', 'textarea',
  'e.g., Diabetes, lactose intolerance, nut allergies...',
  NULL, false, 1000, NULL, NULL, 2, true, NULL),

('meal_frequency', 'Preferred Meal Frequency', 'nutrition', 'number',
  'e.g., 3 (meals per day)',
  NULL, false, NULL, 1, 8, 3, true, NULL),

('favorite_foods', 'Favorite Foods', 'nutrition', 'textarea',
  'e.g., Chicken, rice, eggs, broccoli...',
  NULL, false, 1000, NULL, NULL, 4, true, NULL),

('foods_to_avoid', 'Foods to Avoid', 'nutrition', 'textarea',
  'e.g., Dairy, gluten, seafood...',
  NULL, false, 1000, NULL, NULL, 5, true, NULL),

-- WORKOUT SECTION (10 questions)
('workout_experience', 'Workout Experience', 'workout', 'select',
  NULL,
  '[{"value":"beginner","label":"Beginner (0-1 years)"},{"value":"intermediate","label":"Intermediate (1-3 years)"},{"value":"advanced","label":"Advanced (3+ years)"}]'::jsonb,
  true, NULL, NULL, NULL, 1, true, 'beginner'),

('available_equipment', 'Available Equipment', 'workout', 'textarea',
  'e.g., Dumbbells, resistance bands, gym membership, none...',
  NULL, false, 500, NULL, NULL, 2, true, NULL),

('time_availability', 'Time Availability per Workout', 'workout', 'select',
  NULL,
  '[{"value":"15min","label":"15 minutes"},{"value":"30min","label":"30 minutes"},{"value":"45min","label":"45 minutes"},{"value":"60min_plus","label":"60+ minutes"}]'::jsonb,
  true, NULL, NULL, NULL, 3, true, '30min'),

('workout_days_per_week', 'Workout Days per Week', 'workout', 'number',
  'e.g., 4',
  NULL, false, NULL, 1, 7, 4, true, NULL),

('preferred_workout_split', 'Preferred Workout Split', 'workout', 'select',
  NULL,
  '[{"value":"full_body","label":"Full Body"},{"value":"upper_lower","label":"Upper/Lower"},{"value":"push_pull_legs","label":"Push/Pull/Legs"},{"value":"body_part","label":"Body Part Split"},{"value":"no_preference","label":"No Preference"}]'::jsonb,
  false, NULL, NULL, NULL, 5, true, NULL),

('primary_workout_goal', 'Primary Workout Goal', 'workout', 'select',
  NULL,
  '[{"value":"muscle_gain","label":"Muscle Gain"},{"value":"strength","label":"Strength"},{"value":"fat_loss","label":"Fat Loss"},{"value":"endurance","label":"Endurance"},{"value":"general_fitness","label":"General Fitness"}]'::jsonb,
  true, NULL, NULL, NULL, 6, true, 'general_fitness'),

('cardio_preference', 'Cardio Preference', 'workout', 'select',
  NULL,
  '[{"value":"none","label":"None"},{"value":"minimal","label":"Minimal"},{"value":"moderate","label":"Moderate"},{"value":"high","label":"High"}]'::jsonb,
  true, NULL, NULL, NULL, 7, true, 'minimal'),

('workout_limitations', 'Workout Limitations', 'workout', 'textarea',
  'e.g., Lower back pain, knee injury, shoulder issues...',
  NULL, false, 1000, NULL, NULL, 8, true, NULL),

('workout_environment', 'Workout Environment', 'workout', 'select',
  NULL,
  '[{"value":"home","label":"Home"},{"value":"commercial_gym","label":"Commercial Gym"},{"value":"both","label":"Both"},{"value":"outdoor","label":"Outdoor"}]'::jsonb,
  true, NULL, NULL, NULL, 9, true, 'commercial_gym'),

('preferred_workout_time', 'Preferred Workout Time', 'workout', 'select',
  NULL,
  '[{"value":"morning","label":"Morning"},{"value":"afternoon","label":"Afternoon"},{"value":"evening","label":"Evening"},{"value":"flexible","label":"Flexible"}]'::jsonb,
  false, NULL, NULL, NULL, 10, true, NULL)

ON CONFLICT (field_key) DO NOTHING;
