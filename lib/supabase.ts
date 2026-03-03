// Supabase client - will be initialized only if package is available
let supabase: any = null;

try {
  // Try to import Supabase only if available
  const { createClient } = require('@supabase/supabase-js');
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseAnonKey) {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.log('Supabase client initialized');
  } else {
    console.warn('Supabase environment variables not found');
  }
} catch (error) {
  console.warn('Supabase package not available, using fallback mode');
}

export { supabase };
