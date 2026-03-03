import { Redis } from '@upstash/redis';
import { Club, Participant, Session } from '@/lib/clubContext';
import { defaultClubs } from '@/lib/clubContext';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// Initialize Upstash Redis
const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

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

  // Initialize database
  useEffect(() => {
    initializeDatabase();
  }, []);

  const initializeDatabase = async () => {
    try {
      setSyncStatus('syncing');
      
      // Test Redis connection
      await redis.ping();
      
      // Load data from Redis
      const data = await loadFromRedis();
      setClubs(data);
      setIsOnline(true);
      setSyncStatus('online');
      console.log('Database connected to Upstash Redis');
    } catch (error) {
      console.error('Failed to connect to Redis:', error);
      setIsOnline(false);
      setSyncStatus('offline');
      // Keep default clubs as fallback
      setClubs(defaultClubs);
    }
  };

  const loadFromRedis = async (): Promise<Club[]> => {
    try {
      const clubsData = await redis.get('clubs') as string;
      if (clubsData) {
        return JSON.parse(clubsData);
      }
      
      // If no data in Redis, return default clubs and save them
      await saveToRedis(defaultClubs);
      return defaultClubs;
    } catch (error) {
      console.error('Error loading from Redis:', error);
      return defaultClubs;
    }
  };

  const saveToRedis = async (clubsData: Club[]) => {
    try {
      await redis.set('clubs', JSON.stringify(clubsData), { ex: 60 * 60 * 24 }); // 24 hours expiry
      console.log('Data saved to Redis');
    } catch (error) {
      console.error('Error saving to Redis:', error);
    }
  };

  const addParticipant = async (clubId: string, participant: Participant) => {
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
    await saveToRedis(updatedClubs);
  };

  const updateParticipant = async (clubId: string, participantId: string, participant: Participant) => {
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
    await saveToRedis(updatedClubs);
  };

  const deleteParticipant = async (clubId: string, participantId: string) => {
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
    await saveToRedis(updatedClubs);
  };

  const addSession = async (clubId: string, session: Session) => {
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
    await saveToRedis(updatedClubs);
  };

  const updateSession = async (clubId: string, sessionId: string, session: Session) => {
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
    await saveToRedis(updatedClubs);
  };

  const deleteSession = async (clubId: string, sessionId: string) => {
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
    await saveToRedis(updatedClubs);
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
