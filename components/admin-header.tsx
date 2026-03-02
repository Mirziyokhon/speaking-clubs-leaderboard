'use client';

import { Button } from '@/components/ui/button';
import { LogOut, Users, Calendar } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

export function AdminHeader() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    router.push('/admin');
  };

  return (
    <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Admin Dashboard</h1>
            <p className="text-xs sm:text-sm text-slate-600">Manage speaking clubs</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </Button>
        </div>
        
        {/* Navigation */}
        <nav className="flex flex-wrap gap-2">
          <Button
            onClick={() => router.push('/admin/dashboard')}
            variant={pathname === '/admin/dashboard' ? 'default' : 'outline'}
            className="gap-2"
          >
            <Users className="w-4 h-4" />
            Participants
          </Button>
          <Button
            onClick={() => router.push('/admin/sessions')}
            variant={pathname === '/admin/sessions' ? 'default' : 'outline'}
            className="gap-2"
          >
            <Calendar className="w-4 h-4" />
            Sessions
          </Button>
        </nav>
      </div>
    </header>
  );
}
