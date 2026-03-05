'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { DatabaseProvider, useDatabase } from '@/lib/redis-db-provider';
import { AdminHeader } from '@/components/admin-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit2, Trash2, Calendar, Clock, MapPin, Users, BookOpen } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

function SessionsContent() {
  const router = useRouter();
  const { clubs, deleteSession } = useDatabase();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [selectedClub, setSelectedClub] = useState('English');
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 1)); // February 2026
  const [deleteConfirm, setDeleteConfirm] = useState<{
    clubName: string;
    sessionId: string;
    title: string;
  } | null>(null);

  const currentClub = clubs.find((c) => c.name === selectedClub);

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
    const dateStr = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
      .toISOString()
      .split('T')[0];
    return allSessions.filter((session) => session.date === dateStr);
  };

  const getClubColor = (clubName: string) => {
    const colors: Record<string, string> = {
      English: 'bg-blue-100 text-blue-800 border-blue-300',
      Russian: 'bg-red-100 text-red-800 border-red-300',
      Japanese: 'bg-pink-100 text-pink-800 border-pink-300',
      German: 'bg-amber-100 text-amber-800 border-amber-300',
    };
    return colors[clubName] || 'bg-slate-100 text-slate-800 border-slate-300';
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

  const handleDelete = () => {
    if (deleteConfirm) {
      deleteSession(deleteConfirm.clubName, deleteConfirm.sessionId);
      toast({
        title: 'Success',
        description: `${deleteConfirm.title} has been removed.`,
      });
      setDeleteConfirm(null);
      // Force a refresh to ensure data is updated
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  };

  const handleEdit = (clubName: string, sessionId: string) => {
    router.push(`/admin/sessions/edit/${clubName}/${sessionId}`);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminHeader />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <Select value={selectedClub} onValueChange={setSelectedClub}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {clubs.map((club) => (
                    <SelectItem key={club.name} value={club.name}>
                      {club.name} ({club.sessions.length} sessions)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={() => router.push('/admin/sessions/add')}
                className="gap-2 bg-green-600 hover:bg-green-700"
              >
                <Plus className="w-4 h-4" />
                <span>Add Session</span>
              </Button>
              <Link href="/admin/dashboard">
                <Button variant="outline" className="gap-2">
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>

          {/* Calendar Card */}
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">{monthName}</CardTitle>
                <div className="flex gap-2">
                  <Button
                    onClick={prevMonth}
                    variant="ghost"
                    className="text-white hover:bg-blue-500"
                    size="sm"
                  >
                    ←
                  </Button>
                  <Button
                    onClick={nextMonth}
                    variant="ghost"
                    className="text-white hover:bg-blue-500"
                    size="sm"
                  >
                    →
                  </Button>
                </div>
              </div>
            </CardHeader>

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
                                )} truncate cursor-pointer hover:shadow-md transition-shadow group relative`}
                                title={`${session.title} at ${session.time}`}
                              >
                                <p className="font-semibold truncate">{session.time}</p>
                                <p className="truncate">{session.title}</p>

                                {/* Actions on hover */}
                                <div className="hidden group-hover:block absolute left-0 top-full z-50 mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg p-2">
                                  <div className="space-y-1">
                                    <Button
                                      onClick={() => handleEdit(session.club, session.id)}
                                      size="sm"
                                      variant="outline"
                                      className="w-full gap-1 text-xs"
                                    >
                                      <Edit2 className="w-3 h-3" />
                                      Edit
                                    </Button>
                                    <Button
                                      onClick={() =>
                                        setDeleteConfirm({
                                          clubName: session.club,
                                          sessionId: session.id,
                                          title: session.title,
                                        })
                                      }
                                      size="sm"
                                      variant="destructive"
                                      className="w-full gap-1 text-xs"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                      Delete
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-xs text-slate-400 italic">No sessions</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Sessions List */}
          <Card>
            <CardHeader>
              <CardTitle>All Sessions ({selectedClub} Club)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentClub?.sessions.length === 0 ? (
                  <p className="text-center text-slate-500 py-8">
                    No sessions scheduled for this club yet
                  </p>
                ) : (
                  currentClub?.sessions.map((session) => (
                    <div
                      key={session.id}
                      className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-slate-900">{session.title}</h3>
                            <Badge className={getClubColor(selectedClub)}>
                              {selectedClub}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-slate-600">
                            <p className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {session.date}
                            </p>
                            <p className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {session.time} ({session.duration} min)
                            </p>
                            <p className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              Room {session.room}, Floor {session.floor}
                            </p>
                            <p className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {session.attendees}/{session.maxCapacity}
                            </p>
                            <p className="flex items-center gap-1">
                              <BookOpen className="w-4 h-4" />
                              {session.topic}
                            </p>
                            <p className="flex items-center gap-1 font-semibold">
                              Instructor: {session.instructor}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleEdit(selectedClub, session.id)}
                            size="sm"
                            variant="outline"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() =>
                              setDeleteConfirm({
                                clubName: selectedClub,
                                sessionId: session.id,
                                title: session.title,
                              })
                            }
                            size="sm"
                            variant="destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Session?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteConfirm?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default function SessionsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const authenticated = localStorage.getItem('adminAuthenticated');
    if (authenticated === 'true') {
      setIsAuthenticated(true);
    } else {
      router.push('/admin');
    }
    setIsLoading(false);
  }, [router]);

  // Listen for storage changes to force refresh
  useEffect(() => {
    const handleStorageChange = () => {
      setRefreshKey(prev => prev + 1);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <DatabaseProvider>
      <SessionsContent />
    </DatabaseProvider>
  );
}
