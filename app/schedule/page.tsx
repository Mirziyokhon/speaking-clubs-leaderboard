'use client';

import { useDatabase } from '@/lib/redis-db-provider';
import { LeaderboardHeader } from '@/components/leaderboard-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Users, BookOpen, ChevronRight, ChevronLeft, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

function ScheduleContent() {
  const { clubs } = useDatabase();
  const [currentMonth, setCurrentMonth] = useState(new Date()); // Current month in Tashkent time (GMT+5)
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const { t } = useTranslation();

  const getAllSessions = () => {
    const allSessions: any[] = [];
    clubs.forEach((club) => {
      club.sessions.forEach((session) => {
        allSessions.push({ ...session, club: club.name });
      });
    });
    return allSessions;
  };

  const allSessions = getAllSessions();

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getSessionsForDate = (day: number) => {
    // Use local timezone to avoid date shifting
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const dateStr = `${year}-${month}-${dayStr}`;
    return allSessions.filter((session) => session.date === dateStr);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const getClubColor = (clubName: string) => {
    // Use English club names since that's what's stored in the data
    const colors: Record<string, string> = {
      'English': 'bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200',
      'Russian': 'bg-red-100 text-red-800 border-red-300 hover:bg-red-200',
      'Japanese': 'bg-pink-100 text-pink-800 border-pink-300 hover:bg-pink-200',
      'German': 'bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200',
    };
    return colors[clubName] || 'bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200';
  };

  const getClubColorTranslated = (clubName: string) => {
    // For display purposes, use translated names
    const translatedName = {
      'English': t('clubs.english'),
      'Russian': t('clubs.russian'),
      'Japanese': t('clubs.japanese'),
      'German': t('clubs.german'),
    }[clubName] || clubName;
    
    const colors: Record<string, string> = {
      [t('clubs.english')]: 'bg-blue-100 text-blue-800 border-blue-300',
      [t('clubs.russian')]: 'bg-red-100 text-red-800 border-red-300',
      [t('clubs.japanese')]: 'bg-pink-100 text-pink-800 border-pink-300',
      [t('clubs.german')]: 'bg-amber-100 text-amber-800 border-amber-300',
    };
    return colors[translatedName] || 'bg-slate-100 text-slate-800 border-slate-300';
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <LeaderboardHeader />

      <main className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">{t('schedule.title')}</h1>
          <p className="text-slate-600">{t('schedule.subtitle')}</p>
        </div>

        {/* Calendar Card */}
        <Card className="shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">{monthName}</h2>
              <div className="flex gap-2">
                <Button
                  onClick={prevMonth}
                  variant="ghost"
                  className="text-white hover:bg-blue-500"
                  size="sm"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button
                  onClick={nextMonth}
                  variant="ghost"
                  className="text-white hover:bg-blue-500"
                  size="sm"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>

          <CardContent className="p-6">
            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {dayNames.map((day) => (
                <div
                  key={day}
                  className="text-center font-semibold text-slate-700 py-2 bg-slate-100 rounded"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {/* Empty cells for days before month starts */}
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square" />
              ))}

              {/* Day cells */}
              {daysArray.map((day) => {
                const daysSessions = getSessionsForDate(day);
                return (
                  <div
                    key={day}
                    className="aspect-square border-2 border-slate-200 rounded-lg p-2 bg-white hover:border-blue-400 transition-colors overflow-hidden"
                  >
                    <div className="h-full flex flex-col">
                      <p className="font-bold text-slate-900 text-sm mb-1">{day}</p>
                      <div className="flex-1 overflow-y-auto space-y-1">
                        {daysSessions.length > 0 ? (
                          daysSessions.map((session) => (
                            <div
                              key={session.id}
                              className={`text-xs p-1 rounded border ${getClubColor(
                                session.club
                              )} truncate cursor-pointer hover:shadow-md transition-shadow`}
                              title={`${session.title} at ${session.time}`}
                              onClick={() => setSelectedSession(session)}
                            >
                              <p className="font-semibold truncate">{session.time}</p>
                              <p className="truncate">{session.title}</p>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-slate-400 italic">{t('schedule.noSessions')}</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Legend */}
        <Card className="mt-8 border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg">{t('schedule.clubLegend')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-blue-100 border border-blue-300" />
                <span className="text-sm text-slate-700">{t('clubs.english')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-red-100 border border-red-300" />
                <span className="text-sm text-slate-700">{t('clubs.russian')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-pink-100 border border-pink-300" />
                <span className="text-sm text-slate-700">{t('clubs.japanese')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-amber-100 border border-amber-300" />
                <span className="text-sm text-slate-700">{t('clubs.german')}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Back */}
        <div className="mt-8 flex gap-2 justify-center">
          <Link href="/">
            <Button variant="outline" className="gap-2">
              <ChevronRight className="w-4 h-4 rotate-180" />
              {t('schedule.backToLeaderboard')}
            </Button>
          </Link>
        </div>

        {/* Session Detail Dialog */}
        <Dialog open={!!selectedSession} onOpenChange={() => setSelectedSession(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <div className={`px-2 py-1 rounded text-xs font-semibold ${getClubColor(selectedSession?.club || '')}`}>
                  {selectedSession?.club}
                </div>
                {selectedSession?.title}
              </DialogTitle>
            </DialogHeader>
            {selectedSession && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-slate-500" />
                      <span className="font-medium">{t('schedule.time')}:</span>
                    </div>
                    <p className="text-sm text-slate-700 ml-6">
                      {selectedSession.time} ({selectedSession.duration} {t('schedule.minutes')})
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-slate-500" />
                      <span className="font-medium">{t('schedule.room')}:</span>
                    </div>
                    <p className="text-sm text-slate-700 ml-6">
                      {selectedSession.room}, {t('schedule.floor')} {selectedSession.floor}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <BookOpen className="w-4 h-4 text-slate-500" />
                    <span className="font-medium">{t('schedule.topic')}:</span>
                  </div>
                  <p className="text-sm text-slate-700 ml-6">{selectedSession.topic}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-slate-500" />
                    <span className="font-medium">{t('schedule.attendees')}:</span>
                  </div>
                  <p className="text-sm text-slate-700 ml-6">
                    {selectedSession.attendees}/{selectedSession.maxCapacity} {t('schedule.participants')}
                  </p>
                  <div className="ml-6">
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${(selectedSession.attendees / selectedSession.maxCapacity) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-slate-500" />
                    <span className="font-medium">{t('schedule.instructor')}:</span>
                  </div>
                  <p className="text-sm text-slate-700 ml-6 font-semibold">{selectedSession.instructor}</p>
                </div>

                <div className="pt-4 border-t">
                  <Button 
                    onClick={() => setSelectedSession(null)}
                    className="w-full"
                  >
                    {t('schedule.close')}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}

export default function SchedulePage() {
  return <ScheduleContent />;
}
