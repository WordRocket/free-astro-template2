import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const migrationSQL = `
-- Create authors table
CREATE TABLE IF NOT EXISTS authors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  bio text,
  avatar_url text,
  slug text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text NOT NULL,
  excerpt text,
  hero_image text,
  meta_title text,
  meta_description text,
  author_id uuid REFERENCES authors(id) ON DELETE SET NULL,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  published boolean DEFAULT false,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create tags table
CREATE TABLE IF NOT EXISTS tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create post_tags junction table
CREATE TABLE IF NOT EXISTS post_tags (
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  tag_id uuid REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- Enable Row Level Security
ALTER TABLE authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_tags ENABLE ROW LEVEL SECURITY;

-- RLS Policies for authors
DROP POLICY IF EXISTS "Public read access for authors" ON authors;
CREATE POLICY "Public read access for authors" ON authors FOR SELECT TO public USING (true);
DROP POLICY IF EXISTS "Public insert access for authors" ON authors;
CREATE POLICY "Public insert access for authors" ON authors FOR INSERT TO public WITH CHECK (true);
DROP POLICY IF EXISTS "Public update access for authors" ON authors;
CREATE POLICY "Public update access for authors" ON authors FOR UPDATE TO public USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Public delete access for authors" ON authors;
CREATE POLICY "Public delete access for authors" ON authors FOR DELETE TO public USING (true);

-- RLS Policies for categories
DROP POLICY IF EXISTS "Public read access for categories" ON categories;
CREATE POLICY "Public read access for categories" ON categories FOR SELECT TO public USING (true);
DROP POLICY IF EXISTS "Public insert access for categories" ON categories;
CREATE POLICY "Public insert access for categories" ON categories FOR INSERT TO public WITH CHECK (true);
DROP POLICY IF EXISTS "Public update access for categories" ON categories;
CREATE POLICY "Public update access for categories" ON categories FOR UPDATE TO public USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Public delete access for categories" ON categories;
CREATE POLICY "Public delete access for categories" ON categories FOR DELETE TO public USING (true);

-- RLS Policies for posts
DROP POLICY IF EXISTS "Public read access for posts" ON posts;
CREATE POLICY "Public read access for posts" ON posts FOR SELECT TO public USING (true);
DROP POLICY IF EXISTS "Public insert access for posts" ON posts;
CREATE POLICY "Public insert access for posts" ON posts FOR INSERT TO public WITH CHECK (true);
DROP POLICY IF EXISTS "Public update access for posts" ON posts;
CREATE POLICY "Public update access for posts" ON posts FOR UPDATE TO public USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Public delete access for posts" ON posts;
CREATE POLICY "Public delete access for posts" ON posts FOR DELETE TO public USING (true);

-- RLS Policies for tags
DROP POLICY IF EXISTS "Public read access for tags" ON tags;
CREATE POLICY "Public read access for tags" ON tags FOR SELECT TO public USING (true);
DROP POLICY IF EXISTS "Public insert access for tags" ON tags;
CREATE POLICY "Public insert access for tags" ON tags FOR INSERT TO public WITH CHECK (true);
DROP POLICY IF EXISTS "Public update access for tags" ON tags;
CREATE POLICY "Public update access for tags" ON tags FOR UPDATE TO public USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Public delete access for tags" ON tags;
CREATE POLICY "Public delete access for tags" ON tags FOR DELETE TO public USING (true);

-- RLS Policies for post_tags
DROP POLICY IF EXISTS "Public read access for post_tags" ON post_tags;
CREATE POLICY "Public read access for post_tags" ON post_tags FOR SELECT TO public USING (true);
DROP POLICY IF EXISTS "Public insert access for post_tags" ON post_tags;
CREATE POLICY "Public insert access for post_tags" ON post_tags FOR INSERT TO public WITH CHECK (true);
DROP POLICY IF EXISTS "Public delete access for post_tags" ON post_tags;
CREATE POLICY "Public delete access for post_tags" ON post_tags FOR DELETE TO public USING (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_posts_author_id ON posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_category_id ON posts(category_id);
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published);
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON posts(published_at);
CREATE INDEX IF NOT EXISTS idx_post_tags_post_id ON post_tags(post_id);
CREATE INDEX IF NOT EXISTS idx_post_tags_tag_id ON post_tags(tag_id);

-- Create function for timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
DROP TRIGGER IF EXISTS update_authors_updated_at ON authors;
CREATE TRIGGER update_authors_updated_at
  BEFORE UPDATE ON authors
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_posts_updated_at ON posts;
CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
`;

async function setupDatabase() {
  console.log('Setting up database...');

  const { data, error } = await supabase.rpc('exec_sql', { sql: migrationSQL });

  if (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  }

  console.log('Database setup complete!');
}

setupDatabase();
