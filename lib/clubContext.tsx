'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Participant {
  id: string;
  name: string;
  points: number;
  sessions: number;
  lastSession: string;
  badges: string[];
  monthlyWins: number; // Track how many times they've won
}

export interface Session {
  id: string;
  title: string;
  topic: string;
  time: string;
  date: string;
  room: string;
  floor: number;
  duration: number; // in minutes
  instructor: string;
  attendees: number;
}

export interface MonthlyWinner {
  participantId: string;
  clubName: string;
  month: string; // Format: "2026-02"
  prize: string;
  pointsAtWin: number;
}

export interface Club {
  id: string;
  name: string;
  participants: Participant[];
  sessions: Session[];
  monthlyWinners: MonthlyWinner[]; // Track monthly winners
}

export interface ClubsContextType {
  clubs: Club[];
  addParticipant: (clubName: string, participant: Participant) => void;
  updateParticipant: (clubName: string, id: string, participant: Participant) => void;
  deleteParticipant: (clubName: string, id: string) => void;
  getParticipant: (clubName: string, id: string) => Participant | undefined;
  addSession: (clubName: string, session: Session) => void;
  updateSession: (clubName: string, id: string, session: Session) => void;
  deleteSession: (clubName: string, id: string) => void;
  forceReload: () => void;
  exportData: () => void;
  importData: (file: File) => Promise<void>;
}

const defaultClubs: Club[] = [
  {
    id: 'default-english',
    name: 'English',
    participants: [],
    sessions: [],
    monthlyWinners: [],
  },
  {
    id: 'default-russian',
    name: 'Russian',
    participants: [],
    sessions: [],
    monthlyWinners: [],
  },
  {
    id: 'default-japanese',
    name: 'Japanese',
    participants: [],
    sessions: [],
    monthlyWinners: [],
  },
  {
    id: 'default-german',
    name: 'German',
    participants: [],
    sessions: [],
    monthlyWinners: [],
  },
];

const ClubsContext = createContext<ClubsContextType | undefined>(undefined);

export function ClubsProvider({ children }: { children: ReactNode }) {
  const [clubs, setClubs] = useState<Club[]>(defaultClubs);
  const [forceReload] = useState(() => () => {});
  const exportData = () => {};
  const importData = () => Promise.resolve();

  const addParticipant = (clubName: string, participant: Participant) => {
    setClubs((prevClubs) =>
      prevClubs.map((club) =>
        club.name === clubName
          ? { ...club, participants: [...club.participants, participant] }
          : club
      )
    );
  };

  const updateParticipant = (clubName: string, id: string, participant: Participant) => {
    setClubs((prevClubs) =>
      prevClubs.map((club) =>
        club.name === clubName
          ? {
              ...club,
              participants: club.participants.map((p) => (p.id === id ? participant : p)),
            }
          : club
      )
    );
  };

  const deleteParticipant = (clubName: string, id: string) => {
    setClubs((prevClubs) =>
      prevClubs.map((club) =>
        club.name === clubName
          ? {
              ...club,
              participants: club.participants.filter((p) => p.id !== id),
            }
          : club
      )
    );
  };

  const getParticipant = (clubName: string, id: string) => {
    const club = clubs.find((c) => c.name === clubName);
    return club?.participants.find((p) => p.id === id);
  };

  const addSession = (clubName: string, session: Session) => {
    console.log('Adding session to', clubName, ':', session);
    setClubs((prevClubs) => {
      const updatedClubs = prevClubs.map((club) =>
        club.name === clubName
          ? { ...club, sessions: [...club.sessions, session] }
          : club
      );
      console.log('Updated clubs after add:', updatedClubs);
      return updatedClubs;
    });
  };

  const updateSession = (clubName: string, id: string, session: Session) => {
    console.log('Updating session', id, 'in', clubName, ':', session);
    setClubs((prevClubs) => {
      const updatedClubs = prevClubs.map((club) =>
        club.name === clubName
          ? {
              ...club,
              sessions: club.sessions.map((s) => (s.id === id ? session : s)),
            }
          : club
      );
      console.log('Updated clubs after update:', updatedClubs);
      return updatedClubs;
    });
  };

  const deleteSession = (clubName: string, id: string) => {
    console.log('Deleting session', id, 'from', clubName);
    setClubs((prevClubs) => {
      const updatedClubs = prevClubs.map((club) =>
        club.name === clubName
          ? {
              ...club,
              sessions: club.sessions.filter((s) => s.id !== id),
            }
          : club
      );
      console.log('Updated clubs after delete:', updatedClubs);
      return updatedClubs;
    });
  };

  const value: ClubsContextType = {
    clubs,
    addParticipant,
    updateParticipant,
    deleteParticipant,
    getParticipant,
    addSession,
    updateSession,
    deleteSession,
    forceReload,
    exportData,
    importData,
  };

  return <ClubsContext.Provider value={value}>{children}</ClubsContext.Provider>;
}

export { defaultClubs };

export function useClubs() {
  const context = useContext(ClubsContext);
  if (!context) {
    throw new Error('useClubs must be used within ClubsProvider');
  }
  return context;
}
