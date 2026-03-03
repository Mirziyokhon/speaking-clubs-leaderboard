'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Club, Participant, Session } from './clubContext';
import { 
  getClubs, 
  updateClub,
  addParticipant,
  updateParticipant,
  deleteParticipant,
  addSession,
  updateSession,
  deleteSession,
  initializeSupabaseTables
} from './supabase-db';
import { useLocalStorageSync } from './useLocalStorageSync';
import { defaultClubs } from './clubContext';

export interface DatabaseContextType {
  clubs: Club[];
  addParticipant: (clubName: string, participant: Participant) => Promise<void>;
  updateParticipant: (clubName: string, id: string, participant: Participant) => Promise<void>;
  deleteParticipant: (clubName: string, id: string) => Promise<void>;
  getParticipant: (clubName: string, id: string) => Promise<Participant | undefined>;
  addSession: (clubName: string, session: Session) => Promise<void>;
  updateSession: (clubName: string, id: string, session: Session) => Promise<void>;
  deleteSession: (clubName: string, id: string) => Promise<void>;
  forceReload: () => void;
  isOnline: boolean;
  syncStatus: 'online' | 'offline' | 'syncing';
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export function DatabaseProvider({ children }: { children: ReactNode }) {
  const [isOnline, setIsOnline] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'online' | 'offline' | 'syncing'>('offline');
  
  // Use localStorage for development, Supabase for production
  const [localClubs, setLocalClubs, forceReload] = useLocalStorageSync('clubs', defaultClubs);
  const [clubs, setClubs] = useState<Club[]>(defaultClubs);

  // Check if we're in production and have Supabase available
  const isProduction = process.env.NODE_ENV === 'production';
  const hasSupabase = typeof window !== 'undefined' && 
    process.env.NEXT_PUBLIC_SUPABASE_URL && 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  useEffect(() => {
    if (isProduction && hasSupabase) {
      setIsOnline(true);
      setSyncStatus('syncing');
      initializeDatabase();
    } else {
      setIsOnline(false);
      setSyncStatus('offline');
      // Use localStorage data
      setClubs(localClubs);
    }
  }, [isProduction, hasSupabase]);

  const initializeDatabase = async () => {
    try {
      await initializeSupabaseTables();
      const data = await getClubs();
      setClubs(data);
      setSyncStatus('online');
      console.log('Database initialized and synced with Supabase');
    } catch (error) {
      console.error('Failed to initialize Supabase, falling back to localStorage:', error);
      setIsOnline(false);
      setSyncStatus('offline');
      setClubs(localClubs);
    }
  };

  const addParticipantAsync = async (clubName: string, participant: Participant) => {
    try {
      if (isOnline && hasSupabase) {
        await addParticipant(getClubId(clubName, clubs), participant);
        await refreshData();
      } else {
        // Fallback to localStorage
        const clubIndex = clubs.findIndex(c => c.name === clubName);
        if (clubIndex !== -1) {
          const updatedClubs = [...clubs];
          updatedClubs[clubIndex] = {
            ...updatedClubs[clubIndex],
            participants: [...updatedClubs[clubIndex].participants, participant]
          };
          setClubs(updatedClubs);
          setLocalClubs(updatedClubs);
        }
      }
    } catch (error) {
      console.error('Error adding participant:', error);
      throw error;
    }
  };

  const updateParticipantAsync = async (clubName: string, id: string, participant: Participant) => {
    try {
      if (isOnline && hasSupabase) {
        await updateParticipant(getClubId(clubName, clubs), id, participant);
        await refreshData();
      } else {
        // Fallback to localStorage
        const clubIndex = clubs.findIndex(c => c.name === clubName);
        if (clubIndex !== -1) {
          const updatedClubs = [...clubs];
          updatedClubs[clubIndex] = {
            ...updatedClubs[clubIndex],
            participants: updatedClubs[clubIndex].participants.map(p => 
              p.id === id ? participant : p
            )
          };
          setClubs(updatedClubs);
          setLocalClubs(updatedClubs);
        }
      }
    } catch (error) {
      console.error('Error updating participant:', error);
      throw error;
    }
  };

  const deleteParticipantAsync = async (clubName: string, id: string) => {
    try {
      if (isOnline && hasSupabase) {
        await deleteParticipant(getClubId(clubName, clubs), id);
        await refreshData();
      } else {
        // Fallback to localStorage
        const clubIndex = clubs.findIndex(c => c.name === clubName);
        if (clubIndex !== -1) {
          const updatedClubs = [...clubs];
          updatedClubs[clubIndex] = {
            ...updatedClubs[clubIndex],
            participants: updatedClubs[clubIndex].participants.filter(p => p.id !== id)
          };
          setClubs(updatedClubs);
          setLocalClubs(updatedClubs);
        }
      }
    } catch (error) {
      console.error('Error deleting participant:', error);
      throw error;
    }
  };

  const addSessionAsync = async (clubName: string, session: Session) => {
    try {
      if (isOnline && hasSupabase) {
        await addSession(getClubId(clubName, clubs), session);
        await refreshData();
      } else {
        // Fallback to localStorage
        const clubIndex = clubs.findIndex(c => c.name === clubName);
        if (clubIndex !== -1) {
          const updatedClubs = [...clubs];
          updatedClubs[clubIndex] = {
            ...updatedClubs[clubIndex],
            sessions: [...updatedClubs[clubIndex].sessions, session]
          };
          setClubs(updatedClubs);
          setLocalClubs(updatedClubs);
        }
      }
    } catch (error) {
      console.error('Error adding session:', error);
      throw error;
    }
  };

  const updateSessionAsync = async (clubName: string, id: string, session: Session) => {
    try {
      if (isOnline && hasSupabase) {
        await updateSession(getClubId(clubName, clubs), id, session);
        await refreshData();
      } else {
        // Fallback to localStorage
        const clubIndex = clubs.findIndex(c => c.name === clubName);
        if (clubIndex !== -1) {
          const updatedClubs = [...clubs];
          updatedClubs[clubIndex] = {
            ...updatedClubs[clubIndex],
            sessions: updatedClubs[clubIndex].sessions.map(s => 
              s.id === id ? session : s
            )
          };
          setClubs(updatedClubs);
          setLocalClubs(updatedClubs);
        }
      }
    } catch (error) {
      console.error('Error updating session:', error);
      throw error;
    }
  };

  const deleteSessionAsync = async (clubName: string, id: string) => {
    try {
      if (isOnline && hasSupabase) {
        await deleteSession(getClubId(clubName, clubs), id);
        await refreshData();
      } else {
        // Fallback to localStorage
        const clubIndex = clubs.findIndex(c => c.name === clubName);
        if (clubIndex !== -1) {
          const updatedClubs = [...clubs];
          updatedClubs[clubIndex] = {
            ...updatedClubs[clubIndex],
            sessions: updatedClubs[clubIndex].sessions.filter(s => s.id !== id)
          };
          setClubs(updatedClubs);
          setLocalClubs(updatedClubs);
        }
      }
    } catch (error) {
      console.error('Error deleting session:', error);
      throw error;
    }
  };

  const refreshData = async () => {
    if (isOnline && hasSupabase) {
      try {
        const data = await getClubs();
        setClubs(data);
        console.log('Data refreshed from Supabase');
      } catch (error) {
        console.error('Error refreshing data:', error);
      }
    }
  };

  const getParticipantAsync = async (clubName: string, id: string): Promise<Participant | undefined> => {
    const club = clubs.find(c => c.name === clubName);
    return club?.participants.find(p => p.id === id);
  };

  const getClubId = (clubName: string, clubsList: Club[]): string => {
    const club = clubsList.find(c => c.name === clubName);
    return club?.id || '';
  };

  const value: DatabaseContextType = {
    clubs,
    addParticipant: addParticipantAsync,
    updateParticipant: updateParticipantAsync,
    deleteParticipant: deleteParticipantAsync,
    getParticipant: getParticipantAsync,
    addSession: addSessionAsync,
    updateSession: updateSessionAsync,
    deleteSession: deleteSessionAsync,
    forceReload,
    isOnline,
    syncStatus,
  };

  return <DatabaseContext.Provider value={value}>{children}</DatabaseContext.Provider>;
}

export function useDatabase() {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within DatabaseProvider');
  }
  return context;
}
