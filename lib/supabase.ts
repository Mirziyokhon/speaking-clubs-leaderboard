import { createClient } from '@supabase/supabase-js'

// Use environment variables from Vercel in production
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not found. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel.');
  throw new Error('Supabase configuration missing');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export { supabase };
