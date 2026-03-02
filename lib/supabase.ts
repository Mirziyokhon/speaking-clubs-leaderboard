// Environment variables for future Supabase integration
export const supabaseEnv = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ukzcklttwsohsglyfqyu.supabase.co',
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiIiwicm9sZSI6ImV4cCI6IjE3NzI4ODAwODc4OX0.Y87D8jbachN18-RneNtZJSJ4jYE_bMooZ5ZqGuvQlaw'
};

export { supabaseEnv };
