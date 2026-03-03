import { supabase } from './supabase';

// Table names
const CLUBS_TABLE = 'clubs';
const PARTICIPANTS_TABLE = 'participants';
const SESSIONS_TABLE = 'sessions';

// Initialize Supabase tables if they don't exist
export async function initializeSupabaseTables() {
  try {
    // Create clubs table
    const { error: clubsError } = await supabase.rpc('create_table_if_not_exists', {
      table_name: CLUBS_TABLE,
      definition: `
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      `
    });

    // Create participants table
    const { error: participantsError } = await supabase.rpc('create_table_if_not_exists', {
      table_name: PARTICIPANTS_TABLE,
      definition: `
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        club_id UUID REFERENCES ${CLUBS_TABLE}(id),
        name TEXT NOT NULL,
        points INTEGER DEFAULT 0,
        sessions INTEGER DEFAULT 0,
        last_session TEXT,
        badges TEXT[] DEFAULT '{}',
        monthly_wins INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      `
    });

    // Create sessions table
    const { error: sessionsError } = await supabase.rpc('create_table_if_not_exists', {
      table_name: SESSIONS_TABLE,
      definition: `
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        club_id UUID REFERENCES ${CLUBS_TABLE}(id),
        title TEXT NOT NULL,
        topic TEXT,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        room TEXT NOT NULL,
        floor INTEGER NOT NULL,
        duration INTEGER NOT NULL,
        instructor TEXT NOT NULL,
        attendees INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      `
    });

    if (clubsError || participantsError || sessionsError) {
      console.error('Error initializing tables:', { clubsError, participantsError, sessionsError });
      throw new Error('Failed to initialize database tables');
    }

    console.log('Supabase tables initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing Supabase:', error);
    throw error;
  }
}

// Clubs operations
export async function getClubs() {
  try {
    const { data, error } = await supabase
      .from(CLUBS_TABLE)
      .select(`
        *,
        participants:${PARTICIPANTS_TABLE}(id, name, points, sessions, last_session, badges, monthly_wins),
        sessions:${SESSIONS_TABLE}(id, title, topic, date, time, room, floor, duration, instructor, attendees)
      `)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching clubs:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error in getClubs:', error);
    throw error;
  }
}

export async function updateClub(clubId: string, clubData: any) {
  try {
    const { error } = await supabase
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
    const { error } = await supabase
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
    const { error } = await supabase
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
    const { error } = await supabase
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
    const { error } = await supabase
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
    const { error } = await supabase
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
    const { error } = await supabase
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
