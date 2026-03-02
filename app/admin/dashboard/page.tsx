'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ClubsProvider, useClubs } from '@/lib/clubContext';
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
import { Plus, Edit2, Trash2 } from 'lucide-react';
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

function DashboardContent() {
  const router = useRouter();
  const { clubs, deleteParticipant } = useClubs();
  const { toast } = useToast();
  const [selectedClub, setSelectedClub] = useState('English');
  const [deleteConfirm, setDeleteConfirm] = useState<{
    clubName: string;
    participantId: string;
    name: string;
  } | null>(null);

  const currentClub = clubs.find((c) => c.name === selectedClub);

  const handleDelete = () => {
    if (deleteConfirm) {
      deleteParticipant(deleteConfirm.clubName, deleteConfirm.participantId);
      toast({
        title: 'Success',
        description: `${deleteConfirm.name} has been removed.`,
      });
      setDeleteConfirm(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminHeader />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Club Selector */}
          <Card>
            <CardHeader>
              <CardTitle>Select Club</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedClub} onValueChange={setSelectedClub}>
                <SelectTrigger className="w-full sm:w-64">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {clubs.map((club) => (
                    <SelectItem key={club.name} value={club.name}>
                      {club.name} ({club.participants.length} members)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Participants Table */}
          <Card>
            <CardHeader className="flex items-center justify-between flex-col sm:flex-row gap-4">
              <CardTitle className="text-lg sm:text-2xl">{selectedClub} Club - Participants</CardTitle>
              <Button
                onClick={() => router.push('/admin/add')}
                className="gap-2 bg-green-600 hover:bg-green-700 w-full sm:w-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Add Participant</span>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                        Name
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-slate-700 w-20">
                        Points
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-slate-700 w-28">
                        Sessions
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-slate-700 w-32">
                        Last Session
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-slate-700 w-24">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {!currentClub || currentClub.participants.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                          No participants in this club yet
                        </td>
                      </tr>
                    ) : (
                      currentClub.participants
                        .sort((a, b) => b.points - a.points)
                        .map((participant) => (
                          <tr
                            key={participant.id}
                            className="border-b border-slate-200 hover:bg-slate-50 transition-colors"
                          >
                            <td className="px-4 py-3">
                              <span className="font-semibold text-slate-900">
                                {participant.name}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center text-slate-700">
                              {participant.points}
                            </td>
                            <td className="px-4 py-3 text-center text-slate-700">
                              {participant.sessions}
                            </td>
                            <td className="px-4 py-3 text-center text-slate-600 text-sm">
                              {participant.lastSession}
                            </td>
                            <td className="px-4 py-3 text-center flex items-center justify-center gap-1 flex-wrap">
                              <Button
                                onClick={() =>
                                  router.push(`/admin/edit/${participant.id}`)
                                }
                                size="sm"
                                variant="outline"
                                className="gap-1 text-xs"
                              >
                                <Edit2 className="w-3 h-3" />
                                <span className="hidden sm:inline">Edit</span>
                              </Button>
                              <Button
                                onClick={() =>
                                  setDeleteConfirm({
                                    clubName: selectedClub,
                                    participantId: participant.id,
                                    name: participant.name,
                                  })
                                }
                                size="sm"
                                variant="destructive"
                                className="gap-1 text-xs"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span className="hidden sm:inline">Delete</span>
                              </Button>
                            </td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Participant?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {deleteConfirm?.name}? This action cannot be undone.
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

export default function Dashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
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

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <ClubsProvider>
      <DashboardContent />
    </ClubsProvider>
  );
}
