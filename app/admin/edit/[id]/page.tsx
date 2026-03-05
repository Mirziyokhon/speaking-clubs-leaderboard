'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { DatabaseProvider, useDatabase } from '@/lib/redis-db-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

function EditParticipantContent() {
  const router = useRouter();
  const params = useParams();
  const participantId = params.id as string;
  const { clubs, updateParticipant } = useDatabase();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedClub, setSelectedClub] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    points: '0',
    sessions: '0',
    lastSession: '',
    badges: '',
  });

  useEffect(() => {
    // Find the participant in all clubs
    for (const club of clubs) {
      const participant = club.participants.find((p) => p.id === participantId);
      if (participant) {
        setSelectedClub(club.name);
        setFormData({
          name: participant.name,
          points: participant.points.toString(),
          sessions: participant.sessions.toString(),
          lastSession: participant.lastSession,
          badges: participant.badges.join(', '),
        });
        break;
      }
    }
    setIsLoading(false);
  }, [clubs, participantId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.name.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a participant name.',
        variant: 'destructive',
      });
      setIsSubmitting(false);
      return;
    }

    const updatedParticipant = {
      id: participantId,
      name: formData.name,
      points: parseInt(formData.points) || 0,
      sessions: parseInt(formData.sessions) || 0,
      lastSession: formData.lastSession,
      badges: formData.badges
        .split(',')
        .map((b) => b.trim())
        .filter((b) => b.length > 0),
    };

    updateParticipant(selectedClub, participantId, updatedParticipant);

    toast({
      title: 'Success',
      description: `${formData.name} has been updated!`,
    });

    setTimeout(() => {
      router.push('/admin/dashboard');
    }, 500);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!selectedClub) {
    return (
      <div className="min-h-screen bg-slate-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="gap-2 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <Card>
            <CardContent className="py-8 text-center text-slate-600">
              Participant not found
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Button
          onClick={() => router.back()}
          variant="outline"
          className="gap-2 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Edit Participant</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="e.g., Ali Karimov"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="club">Club</Label>
                  <Select value={selectedClub} disabled>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </Select>
                  <p className="text-xs text-slate-500">Club cannot be changed after creation</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="points">Points</Label>
                  <Input
                    id="points"
                    name="points"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formData.points}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sessions">Sessions Attended</Label>
                  <Input
                    id="sessions"
                    name="sessions"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formData.sessions}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="lastSession">Last Session Date</Label>
                  <Input
                    id="lastSession"
                    name="lastSession"
                    type="date"
                    value={formData.lastSession}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="badges">Badges (comma-separated)</Label>
                  <Input
                    id="badges"
                    name="badges"
                    placeholder="e.g., Active Speaker, Consistency Hero"
                    value={formData.badges}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !formData.name.trim()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function EditParticipant() {
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
    <EditParticipantContent />
  );
}
