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
  deleteSession
} from './supabase-db';
import { testSupabaseConnection } from './test-supabase';
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
  const [syncStatus, setSyncStatus] = useState<'online' | 'offline' | 'syncing'>('syncing');
  const [clubs, setClubs] = useState<Club[]>(defaultClubs);

  useEffect(() => {
    initializeDatabase();
  }, []);

  const initializeDatabase = async () => {
    try {
      setSyncStatus('syncing');
      
      // Test Supabase connection first
      const testResult = await testSupabaseConnection();
      console.log('Supabase test result:', testResult);
      
      if (!testResult.success) {
        throw new Error('Supabase connection failed');
      }
      
      const data = await getClubs();
      setClubs(data);
      setIsOnline(true);
      setSyncStatus('online');
      console.log('Database connected to Supabase');
    } catch (error) {
      console.error('Failed to connect to Supabase:', error);
      setIsOnline(false);
      setSyncStatus('offline');
      // Keep default clubs as fallback
      setClubs(defaultClubs);
    }
  };

  const addParticipantAsync = async (clubName: string, participant: Participant) => {
    try {
      const clubId = getClubId(clubName, clubs);
      await addParticipant(clubId, participant);
      await refreshData();
    } catch (error) {
      console.error('Error adding participant:', error);
      throw error;
    }
  };

  const updateParticipantAsync = async (clubName: string, id: string, participant: Participant) => {
    try {
      const clubId = getClubId(clubName, clubs);
      await updateParticipant(clubId, id, participant);
      await refreshData();
    } catch (error) {
      console.error('Error updating participant:', error);
      throw error;
    }
  };

  const deleteParticipantAsync = async (clubName: string, id: string) => {
    try {
      const clubId = getClubId(clubName, clubs);
      await deleteParticipant(clubId, id);
      await refreshData();
    } catch (error) {
      console.error('Error deleting participant:', error);
      throw error;
    }
  };

  const addSessionAsync = async (clubName: string, session: Session) => {
    try {
      const clubId = getClubId(clubName, clubs);
      await addSession(clubId, session);
      await refreshData();
    } catch (error) {
      console.error('Error adding session:', error);
      throw error;
    }
  };

  const updateSessionAsync = async (clubName: string, id: string, session: Session) => {
    try {
      const clubId = getClubId(clubName, clubs);
      await updateSession(clubId, id, session);
      await refreshData();
    } catch (error) {
      console.error('Error updating session:', error);
      throw error;
    }
  };

  const deleteSessionAsync = async (clubName: string, id: string) => {
    try {
      const clubId = getClubId(clubName, clubs);
      await deleteSession(clubId, id);
      await refreshData();
    } catch (error) {
      console.error('Error deleting session:', error);
      throw error;
    }
  };

  const refreshData = async () => {
    try {
      const data = await getClubs();
      setClubs(data);
      console.log('Data refreshed from Supabase');
    } catch (error) {
      console.error('Error refreshing data:', error);
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
    forceReload: refreshData,
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
