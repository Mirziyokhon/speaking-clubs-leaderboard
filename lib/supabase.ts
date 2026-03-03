import { createClient } from '@supabase/supabase-js'

// Create Supabase client only on client side
let supabaseClient: any = null;

export const getSupabaseClient = () => {
  if (typeof window !== 'undefined' && !supabaseClient) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (supabaseUrl && supabaseAnonKey) {
      supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
      console.log('Supabase client created successfully');
    } else {
      console.error('Supabase environment variables not found');
    }
  }
  
  return supabaseClient;
};

export { getSupabaseClient as supabase };
