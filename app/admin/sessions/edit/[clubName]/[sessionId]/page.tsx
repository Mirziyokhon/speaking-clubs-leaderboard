'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { DatabaseProvider, useDatabase } from '@/lib/redis-db-provider';
import { AdminHeader } from '@/components/admin-header';
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
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

function EditSessionContent() {
  const router = useRouter();
  const params = useParams();
  const { clubs, updateSession } = useDatabase();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [sessionFound, setSessionFound] = useState(true);
  const [formData, setFormData] = useState({
    clubName: '',
    title: '',
    topic: '',
    date: '',
    time: '',
    room: '',
    floor: 1,
    duration: 60,
    instructor: '',
    attendees: 0,
  });

  useEffect(() => {
    const clubName = params.clubName as string;
    const sessionId = params.sessionId as string;
    
    const club = clubs.find((c) => c.name === clubName);
    if (club) {
      const session = club.sessions.find((s) => s.id === sessionId);
      if (session) {
        setFormData({
          clubName: clubName,
          title: session.title,
          topic: session.topic,
          date: session.date,
          time: session.time,
          room: session.room,
          floor: session.floor,
          duration: session.duration,
          instructor: session.instructor,
          maxCapacity: session.maxCapacity,
          attendees: session.attendees,
        });
      } else {
        setSessionFound(false);
      }
    } else {
      setSessionFound(false);
    }
  }, [params, clubs]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const updatedSession = {
        id: params.sessionId as string,
        ...formData,
      };

      updateSession(formData.clubName, updatedSession.id, updatedSession);
      
      toast({
        title: 'Success',
        description: 'Session has been updated successfully.',
      });
      
      // Force refresh after a short delay to ensure data is saved
      setTimeout(() => {
        router.push('/admin/sessions');
      }, 100);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update session. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  if (!sessionFound) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-slate-900 mb-2">Session Not Found</h2>
              <p className="text-slate-600 mb-4">The session you're trying to edit doesn't exist.</p>
              <Button onClick={() => router.push('/admin/sessions')}>
                Back to Sessions
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminHeader />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Edit Session</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Club Selection */}
              <div className="space-y-2">
                <Label htmlFor="clubName">Club</Label>
                <Select value={formData.clubName} onValueChange={(value) => handleInputChange('clubName', value)}>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Session Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Session Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="e.g., Morning Conversation"
                    required
                  />
                </div>

                {/* Topic */}
                <div className="space-y-2">
                  <Label htmlFor="topic">Topic</Label>
                  <Input
                    id="topic"
                    value={formData.topic}
                    onChange={(e) => handleInputChange('topic', e.target.value)}
                    placeholder="e.g., Everyday Life & Culture"
                    required
                  />
                </div>

                {/* Date */}
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    required
                  />
                </div>

                {/* Time */}
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => handleInputChange('time', e.target.value)}
                    required
                  />
                </div>

                {/* Room */}
                <div className="space-y-2">
                  <Label htmlFor="room">Room</Label>
                  <Input
                    id="room"
                    value={formData.room}
                    onChange={(e) => handleInputChange('room', e.target.value)}
                    placeholder="e.g., A101"
                    required
                  />
                </div>

                {/* Floor */}
                <div className="space-y-2">
                  <Label htmlFor="floor">Floor</Label>
                  <Select value={formData.floor.toString()} onValueChange={(value) => handleInputChange('floor', parseInt(value))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Floor 1</SelectItem>
                      <SelectItem value="2">Floor 2</SelectItem>
                      <SelectItem value="3">Floor 3</SelectItem>
                      <SelectItem value="4">Floor 4</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Duration */}
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Select value={formData.duration.toString()} onValueChange={(value) => handleInputChange('duration', parseInt(value))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                      <SelectItem value="60">60 minutes</SelectItem>
                      <SelectItem value="75">75 minutes</SelectItem>
                      <SelectItem value="90">90 minutes</SelectItem>
                      <SelectItem value="120">120 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Instructor */}
                <div className="space-y-2">
                  <Label htmlFor="instructor">Instructor</Label>
                  <Input
                    id="instructor"
                    value={formData.instructor}
                    onChange={(e) => handleInputChange('instructor', e.target.value)}
                    placeholder="e.g., Sarah Mitchell"
                    required
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex gap-3 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/admin/sessions')}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? 'Updating...' : 'Update Session'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

export default function EditSession() {
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
    <EditSessionContent />
  );
}
