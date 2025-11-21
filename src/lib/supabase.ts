import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Author = {
  id: string;
  name: string;
  email: string;
  bio?: string;
  avatar_url?: string;
  slug: string;
  created_at: string;
  updated_at: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
};

export type Tag = {
  id: string;
  name: string;
  slug: string;
  created_at: string;
};

export type Post = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  hero_image?: string;
  meta_title?: string;
  meta_description?: string;
  author_id?: string;
  category_id?: string;
  published: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
  author?: Author;
  category?: Category;
  tags?: Tag[];
};
