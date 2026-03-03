import { supabase } from './supabase';

// Get the supabase client
const getClient = () => {
  const client = supabase();
  if (!client) {
    throw new Error('Supabase client not available on server side');
  }
  return client;
};

// Table names
const CLUBS_TABLE = 'clubs';
const PARTICIPANTS_TABLE = 'participants';
const SESSIONS_TABLE = 'sessions';

// Clubs operations
export async function getClubs() {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized');
    }
    
    // Get clubs first
    const { data: clubsData, error: clubsError } = await getClient()
      .from(CLUBS_TABLE)
      .select('*')
      .order('created_at', { ascending: true });

    if (clubsError) {
      console.error('Error fetching clubs:', clubsError);
      throw clubsError;
    }

    // Get participants for each club
    const clubsWithParticipants = await Promise.all(
      (clubsData || []).map(async (club) => {
        const { data: participants, error: participantsError } = await supabase
          .from(PARTICIPANTS_TABLE)
          .select('*')
          .eq('club_id', club.id)
          .order('created_at', { ascending: true });

        if (participantsError) {
          console.error('Error fetching participants:', participantsError);
          return { ...club, participants: [], sessions: [] };
        }

        // Get sessions for each club
        const { data: sessions, error: sessionsError } = await supabase
          .from(SESSIONS_TABLE)
          .select('*')
          .eq('club_id', club.id)
          .order('created_at', { ascending: true });

        if (sessionsError) {
          console.error('Error fetching sessions:', sessionsError);
          return { ...club, participants: participants || [], sessions: [] };
        }

        return {
          ...club,
          participants: participants || [],
          sessions: sessions || []
        };
      })
    );

    return clubsWithParticipants;
  } catch (error) {
    console.error('Error in getClubs:', error);
    throw error;
  }
}

export async function updateClub(clubId: string, clubData: any) {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized');
    }
    
    const { error } = await getClient()
      .from(CLUBS_TABLE)
      .update(clubData)
      .eq('id', clubId);

    if (error) {
      console.error('Error updating club:', error);
      throw error;
    }

    return { success: !error };
  } catch (error) {
    console.error('Error in updateClub:', error);
    throw error;
  }
}

export async function addParticipant(clubId: string, participant: any) {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized');
    }
    
    const { error } = await getClient()
      .from(PARTICIPANTS_TABLE)
      .insert({ ...participant, club_id: clubId });

    if (error) {
      console.error('Error adding participant:', error);
      throw error;
    }

    return { success: !error };
  } catch (error) {
    console.error('Error in addParticipant:', error);
    throw error;
  }
}

export async function updateParticipant(clubId: string, participantId: string, participant: any) {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized');
    }
    
    const { error } = await getClient()
      .from(PARTICIPANTS_TABLE)
      .update(participant)
      .eq('id', participantId)
      .eq('club_id', clubId);

    if (error) {
      console.error('Error updating participant:', error);
      throw error;
    }

    return { success: !error };
  } catch (error) {
    console.error('Error in updateParticipant:', error);
    throw error;
  }
}

export async function deleteParticipant(clubId: string, participantId: string) {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized');
    }
    
    const { error } = await getClient()
      .from(PARTICIPANTS_TABLE)
      .delete()
      .eq('id', participantId)
      .eq('club_id', clubId);

    if (error) {
      console.error('Error deleting participant:', error);
      throw error;
    }

    return { success: !error };
  } catch (error) {
    console.error('Error in deleteParticipant:', error);
    throw error;
  }
}

export async function addSession(clubId: string, session: any) {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized');
    }
    
    const { error } = await getClient()
      .from(SESSIONS_TABLE)
      .insert({ ...session, club_id: clubId });

    if (error) {
      console.error('Error adding session:', error);
      throw error;
    }

    return { success: !error };
  } catch (error) {
    console.error('Error in addSession:', error);
    throw error;
  }
}

export async function updateSession(clubId: string, sessionId: string, session: any) {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized');
    }
    
    const { error } = await getClient()
      .from(SESSIONS_TABLE)
      .update(session)
      .eq('id', sessionId)
      .eq('club_id', clubId);

    if (error) {
      console.error('Error updating session:', error);
      throw error;
    }

    return { success: !error };
  } catch (error) {
    console.error('Error in updateSession:', error);
    throw error;
  }
}

export async function deleteSession(clubId: string, sessionId: string) {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized');
    }
    
    const { error } = await getClient()
      .from(SESSIONS_TABLE)
      .delete()
      .eq('id', sessionId)
      .eq('club_id', clubId);

    if (error) {
      console.error('Error deleting session:', error);
      throw error;
    }

    return { success: !error };
  } catch (error) {
    console.error('Error in deleteSession:', error);
    throw error;
  }
}
