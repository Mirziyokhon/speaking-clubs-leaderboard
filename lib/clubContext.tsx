'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocalStorageSync } from './useLocalStorageSync';

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
    name: 'English',
    participants: [
      {
        id: '1',
        name: 'Ali Karimov',
        points: 120,
        sessions: 8,
        lastSession: '2026-02-20',
        badges: ['Active Speaker', 'Consistency Hero'],
        monthlyWins: 0,
      },
      {
        id: '2',
        name: 'Sofia Rodriguez',
        points: 105,
        sessions: 7,
        lastSession: '2026-02-19',
        badges: ['Rising Star'],
      },
      {
        id: '3',
        name: 'Marcus Chen',
        points: 98,
        sessions: 6,
        lastSession: '2026-02-18',
        badges: [],
      },
      {
        id: '4',
        name: 'Emma Thompson',
        points: 87,
        sessions: 5,
        lastSession: '2026-02-17',
        badges: ['Quick Learner'],
      },
    ],
    sessions: [
      {
        id: 's1',
        title: 'Morning Conversation',
        topic: 'Everyday Life & Culture',
        date: '2026-02-28',
        time: '09:00',
        room: 'A101',
        floor: 1,
        duration: 60,
        instructor: 'Sarah Mitchell',
        attendees: 12,
      },
      {
        id: 's2',
        title: 'Business English Discussion',
        topic: 'Professional Communication',
        date: '2026-02-28',
        time: '10:30',
        room: 'B205',
        floor: 2,
        duration: 75,
        instructor: 'James Wilson',
        attendees: 18,
      },
      {
        id: 's3',
        title: 'Pronunciation Workshop',
        topic: 'British vs American English',
        date: '2026-03-01',
        time: '14:00',
        room: 'A102',
        floor: 1,
        duration: 90,
        instructor: 'Emma Johnson',
        maxCapacity: 12,
        attendees: 10,
      },
      {
        id: 's4',
        title: 'Movie Discussion Club',
        topic: 'Film Analysis & Vocabulary',
        date: '2026-03-01',
        time: '16:00',
        room: 'C301',
        floor: 3,
        duration: 60,
        instructor: 'Michael Brown',
        maxCapacity: 25,
        attendees: 20,
      },
    ],
  },
  {
    name: 'Russian',
    participants: [
      {
        id: '5',
        name: 'Ivan Petrov',
        points: 140,
        sessions: 9,
        lastSession: '2026-02-20',
        badges: ['Champion', 'Consistency Hero'],
      },
      {
        id: '6',
        name: 'Natasha Volkova',
        points: 115,
        sessions: 7,
        lastSession: '2026-02-19',
        badges: ['Active Speaker'],
      },
      {
        id: '7',
        name: 'Dmitri Sokolov',
        points: 92,
        sessions: 6,
        lastSession: '2026-02-18',
        badges: [],
      },
    ],
    sessions: [
      {
        id: 's5',
        title: 'Начальный разговор',
        topic: 'Daily Conversations',
        date: '2026-02-28',
        time: '09:30',
        room: 'B201',
        floor: 2,
        duration: 60,
        instructor: 'Katerina Ivanova',
        maxCapacity: 15,
        attendees: 14,
      },
      {
        id: 's6',
        title: 'Грамматика в Действии',
        topic: 'Advanced Grammar',
        date: '2026-02-28',
        time: '11:00',
        room: 'A103',
        floor: 1,
        duration: 90,
        instructor: 'Pavel Sokolov',
        maxCapacity: 18,
        attendees: 16,
      },
      {
        id: 's7',
        title: 'Русская Культура',
        topic: 'History & Literature',
        date: '2026-03-01',
        time: '13:00',
        room: 'B202',
        floor: 2,
        duration: 75,
        instructor: 'Alexei Markov',
        maxCapacity: 20,
        attendees: 19,
      },
    ],
  },
  {
    name: 'Japanese',
    participants: [
      {
        id: '8',
        name: 'Yuki Tanaka',
        points: 130,
        sessions: 8,
        lastSession: '2026-02-20',
        badges: ['Rising Star', 'Consistency Hero'],
      },
      {
        id: '9',
        name: 'Hiroshi Yamamoto',
        points: 110,
        sessions: 7,
        lastSession: '2026-02-19',
        badges: ['Active Speaker'],
      },
      {
        id: '10',
        name: 'Sakura Nakamura',
        points: 95,
        sessions: 6,
        lastSession: '2026-02-17',
        badges: [],
      },
    ],
    sessions: [
      {
        id: 's8',
        title: '日本語基礎',
        topic: 'Hiragana & Katakana',
        date: '2026-02-27',
        time: '10:00',
        room: 'C302',
        floor: 3,
        duration: 90,
        instructor: 'Tomoe Suzuki',
        maxCapacity: 12,
        attendees: 11,
      },
      {
        id: 's9',
        title: '会話練習',
        topic: 'Daily Conversations',
        date: '2026-02-28',
        time: '15:00',
        room: 'A104',
        floor: 1,
        duration: 60,
        instructor: 'Kenji Nakamura',
        maxCapacity: 14,
        attendees: 13,
      },
      {
        id: 's10',
        title: '日本文化研究',
        topic: 'Traditional Arts',
        date: '2026-03-01',
        time: '11:00',
        room: 'C303',
        floor: 3,
        duration: 75,
        instructor: 'Yuki Tanaka',
        maxCapacity: 16,
        attendees: 15,
      },
      {
        id: 's11',
        title: 'ニュース理解',
        topic: 'News & Current Events',
        date: '2026-03-02',
        time: '09:00',
        room: 'B203',
        floor: 2,
        duration: 60,
        instructor: 'Hiroshi Yamamoto',
        maxCapacity: 18,
        attendees: 17,
      },
    ],
  },
  {
    name: 'German',
    participants: [
      {
        id: '11',
        name: 'Klaus Mueller',
        points: 125,
        sessions: 8,
        lastSession: '2026-02-20',
        badges: ['Champion'],
      },
      {
        id: '12',
        name: 'Anna Schmidt',
        points: 108,
        sessions: 7,
        lastSession: '2026-02-19',
        badges: ['Quick Learner', 'Active Speaker'],
      },
      {
        id: '13',
        name: 'Anna Fischer',
        points: 89,
        sessions: 5,
        lastSession: '2026-02-17',
        badges: [],
      },
    ],
    sessions: [
      {
        id: 's12',
        title: 'Deutsch für Anfänger',
        topic: 'Basics & Greetings',
        date: '2026-02-27',
        time: '14:00',
        room: 'A105',
        floor: 1,
        duration: 90,
        instructor: 'Stefan Weber',
        maxCapacity: 14,
        attendees: 12,
      },
      {
        id: 's13',
        title: 'Konversation',
        topic: 'Free Conversation',
        date: '2026-02-28',
        time: '16:30',
        room: 'B204',
        floor: 2,
        duration: 60,
        instructor: 'Beate Schneider',
        maxCapacity: 16,
        attendees: 15,
      },
      {
        id: 's14',
        title: 'Deutsche Literatur',
        topic: 'Famous Authors',
        date: '2026-03-01',
        time: '10:00',
        room: 'C304',
        floor: 3,
        duration: 75,
        instructor: 'Thomas Mueller',
        maxCapacity: 20,
        attendees: 18,
      },
    ],
  },
];

const ClubsContext = createContext<ClubsContextType | undefined>(undefined);

export function ClubsProvider({ children }: { children: ReactNode }) {
  const [clubs, setClubs, forceReload, exportData, importData] = useLocalStorageSync('clubs', defaultClubs);

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
