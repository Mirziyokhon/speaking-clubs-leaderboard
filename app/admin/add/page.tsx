'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ClubsProvider, useClubs } from '@/lib/clubContext';
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

function AddParticipantContent() {
  const router = useRouter();
  const { clubs, addParticipant } = useClubs();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    club: 'English',
    points: '0',
    sessions: '0',
    lastSession: new Date().toISOString().split('T')[0],
    badges: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, club: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.name.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a participant name.',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    const newParticipant = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      points: parseInt(formData.points) || 0,
      sessions: parseInt(formData.sessions) || 0,
      lastSession: formData.lastSession,
      badges: formData.badges
        .split(',')
        .map((b) => b.trim())
        .filter((b) => b.length > 0),
    };

    addParticipant(formData.club, newParticipant);

    toast({
      title: 'Success',
      description: `${formData.name} has been added to ${formData.club} club!`,
    });

    setTimeout(() => {
      router.push('/admin/dashboard');
    }, 500);
  };

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
            <CardTitle>Add New Participant</CardTitle>
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
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="club">Club</Label>
                  <Select value={formData.club} onValueChange={handleSelectChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {clubs.map((club) => (
                        <SelectItem key={club.name} value={club.name}>
                          {club.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                    disabled={isLoading}
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
                    disabled={isLoading}
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
                    disabled={isLoading}
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
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading || !formData.name.trim()}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isLoading ? 'Adding...' : 'Add Participant'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function AddParticipant() {
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
      <AddParticipantContent />
    </ClubsProvider>
  );
}
