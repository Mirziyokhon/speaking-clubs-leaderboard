import { supabase } from './supabase';

// Simple test function to check Supabase connection
export async function testSupabaseConnection() {
  try {
    console.log('=== DEBUGGING ENVIRONMENT ===');
    console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    console.log('=== END DEBUGGING ===');
    
    console.log('Testing Supabase connection...');
    console.log('Updated for redeploy - new Supabase variables should be active');
    
    // Check if supabase client is available
    if (!supabase) {
      console.log('Supabase client not available');
      return { success: false, error: 'Client not available' };
    }
    
    // Test basic connection
    const { data, error } = await supabase
      .from('clubs')
      .select('id, name')
      .limit(1);
    
    if (error) {
      console.error('Supabase connection error:', error);
      return { success: false, error };
    }
    
    console.log('Supabase connection successful:', data);
    return { success: true, data };
  } catch (err) {
    console.error('Supabase test failed:', err);
    return { success: false, error: err };
  }
}

// Test getting clubs with participants
export async function testGetClubs() {
  try {
    console.log('Testing getClubs...');
    
    // Get clubs
    const { data: clubs, error: clubsError } = await supabase
      .from('clubs')
      .select('*');
    
    if (clubsError) {
      console.error('Error getting clubs:', clubsError);
      return { success: false, error: clubsError };
    }
    
    console.log('Clubs found:', clubs);
    
    // For each club, get participants
    const clubsWithData = await Promise.all(
      (clubs || []).map(async (club) => {
        const { data: participants, error: participantsError } = await supabase
          .from('participants')
          .select('*')
          .eq('club_id', club.id);
        
        if (participantsError) {
          console.error('Error getting participants:', participantsError);
          return { ...club, participants: [], sessions: [] };
        }
        
        const { data: sessions, error: sessionsError } = await supabase
          .from('sessions')
          .select('*')
          .eq('club_id', club.id);
        
        if (sessionsError) {
          console.error('Error getting sessions:', sessionsError);
          return { ...club, participants: participants || [], sessions: [] };
        }
        
        return {
          ...club,
          participants: participants || [],
          sessions: sessions || []
        };
      })
    );
    
    console.log('Clubs with data:', clubsWithData);
    return { success: true, data: clubsWithData };
  } catch (err) {
    console.error('Test getClubs failed:', err);
    return { success: false, error: err };
  }
}
