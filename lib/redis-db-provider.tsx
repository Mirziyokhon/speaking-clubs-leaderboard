'use client';

import { Club, Participant, Session } from '@/lib/clubContext';
import { defaultClubs } from '@/lib/clubContext';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type DatabaseContextType = {
  clubs: Club[];
  setClubs: (clubs: Club[]) => void;
  addParticipant: (clubId: string, participant: Participant) => Promise<void>;
  updateParticipant: (clubId: string, participantId: string, participant: Participant) => Promise<void>;
  deleteParticipant: (clubId: string, participantId: string) => Promise<void>;
  addSession: (clubId: string, session: Session) => Promise<void>;
  updateSession: (clubId: string, sessionId: string, session: Session) => Promise<void>;
  deleteSession: (clubId: string, sessionId: string) => Promise<void>;
  isOnline: boolean;
  syncStatus: 'online' | 'offline' | 'syncing';
};

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export function useDatabase() {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
}

export function DatabaseProvider({ children }: { children: ReactNode }) {
  const [clubs, setClubs] = useState<Club[]>(defaultClubs);
  const [isOnline, setIsOnline] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'online' | 'offline' | 'syncing'>('offline');
  const [isInitialized, setIsInitialized] = useState(false); // Add loading guard

  // Initialize database
  useEffect(() => {
    initializeDatabase();
  }, []);

  const initializeDatabase = async () => {
    try {
      setSyncStatus('syncing');
      
      // Only run API operations on client side
      if (typeof window === 'undefined') {
        console.log('Skipping API initialization on server side');
        setClubs(defaultClubs);
        setIsOnline(false);
        setSyncStatus('offline');
        setIsInitialized(true);
        return;
      }
      
      // Test API connection and load data
      const data = await loadFromAPI();
      setClubs(data);
      setIsOnline(true);
      setSyncStatus('online');
      setIsInitialized(true); // Mark as fully loaded
      console.log('Database connected via API');
    } catch (error) {
      console.error('Failed to connect to API:', error);
      setIsOnline(false);
      setSyncStatus('offline');
      setIsInitialized(true); // Mark as loaded even on error
      // Keep default clubs as fallback
      setClubs(defaultClubs);
    }
  };

  const loadFromAPI = async (): Promise<Club[]> => {
    try {
      // Only run API operations on client side
      if (typeof window === 'undefined') {
        console.log('Skipping API load on server side');
        return defaultClubs;
      }
      
      const response = await fetch('/api/clubs');
      if (!response.ok) {
        throw new Error('Failed to fetch clubs');
      }
      
      const result = await response.json();
      if (result.success && result.data) {
        // Redis now returns object directly (no double serialization)
        return result.data;
      }
      
      // If no data in API, return default clubs and save them
      await saveToAPI(defaultClubs);
      return defaultClubs;
    } catch (error) {
      console.error('Error loading from API:', error);
      return defaultClubs;
    }
  };

  const saveToAPI = async (clubsData: Club[]) => {
    try {
      // Only run API operations on client side
      if (typeof window === 'undefined') {
        console.log('Skipping API save on server side');
        return;
      }
      
      const response = await fetch('/api/clubs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clubsData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save clubs');
      }
      
      console.log('Data saved via API');
    } catch (error) {
      console.error('Error saving to API:', error);
    }
  };

  const addParticipant = async (clubId: string, participant: Participant) => {
    if (!isInitialized) return; // Don't save until data is loaded
    
    const updatedClubs = clubs.map(club => {
      if (club.id === clubId) {
        return {
          ...club,
          participants: [...club.participants, participant]
        };
      }
      return club;
    });
    
    setClubs(updatedClubs);
    await saveToAPI(updatedClubs);
  };

  const updateParticipant = async (clubId: string, participantId: string, participant: Participant) => {
    if (!isInitialized) return; // Don't save until data is loaded
    const updatedClubs = clubs.map(club => {
      if (club.id === clubId) {
        return {
          ...club,
          participants: club.participants.map(p => 
            p.id === participantId ? participant : p
          )
        };
      }
      return club;
    });
    
    setClubs(updatedClubs);
    await saveToAPI(updatedClubs);
  };

  const deleteParticipant = async (clubId: string, participantId: string) => {
    if (!isInitialized) return; // Don't save until data is loaded
    const updatedClubs = clubs.map(club => {
      if (club.id === clubId) {
        return {
          ...club,
          participants: club.participants.filter(p => p.id !== participantId)
        };
      }
      return club;
    });
    
    setClubs(updatedClubs);
    await saveToAPI(updatedClubs);
  };

  const addSession = async (clubId: string, session: Session) => {
    if (!isInitialized) return; // Don't save until data is loaded
    const updatedClubs = clubs.map(club => {
      if (club.id === clubId) {
        return {
          ...club,
          sessions: [...club.sessions, session]
        };
      }
      return club;
    });
    
    setClubs(updatedClubs);
    await saveToAPI(updatedClubs);
  };

  const updateSession = async (clubId: string, sessionId: string, session: Session) => {
    if (!isInitialized) return; // Don't save until data is loaded
    const updatedClubs = clubs.map(club => {
      if (club.id === clubId) {
        return {
          ...club,
          sessions: club.sessions.map(s => 
            s.id === sessionId ? session : s
          )
        };
      }
      return club;
    });
    
    setClubs(updatedClubs);
    await saveToAPI(updatedClubs);
  };

  const deleteSession = async (clubId: string, sessionId: string) => {
    if (!isInitialized) return; // Don't save until data is loaded
    const updatedClubs = clubs.map(club => {
      if (club.id === clubId) {
        return {
          ...club,
          sessions: club.sessions.filter(s => s.id !== sessionId)
        };
      }
      return club;
    });
    
    setClubs(updatedClubs);
    await saveToAPI(updatedClubs);
  };

  return (
    <DatabaseContext.Provider value={{
      clubs,
      setClubs,
      addParticipant,
      updateParticipant,
      deleteParticipant,
      addSession,
      updateSession,
      deleteSession,
      isOnline,
      syncStatus
    }}>
      {children}
    </DatabaseContext.Provider>
  );
}
