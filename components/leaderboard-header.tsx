'use client';

import { Trophy, Calendar, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from './ui/button';
import { LanguageSwitcher } from './language-switcher';
import { useTranslation } from 'react-i18next';

export function LeaderboardHeader() {
  const pathname = usePathname();
  const { t } = useTranslation();

  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
        <div className="flex items-center justify-between gap-2 sm:gap-4 mb-4 flex-wrap">
          <Link href="/" className="flex items-center gap-3 flex-1 min-w-fit">
            <Trophy className="w-8 h-8 sm:w-10 sm:h-10 drop-shadow-md flex-shrink-0" />
            <h1 className="text-2xl sm:text-4xl font-bold text-balance">
              {t('header.title')}
            </h1>
          </Link>
          <nav className="flex gap-1 sm:gap-2 flex-wrap justify-end">
            <LanguageSwitcher />
            <Link href="/">
              <Button
                variant={pathname === '/' ? 'default' : 'ghost'}
                className={`${
                  pathname === '/'
                    ? 'bg-white text-blue-600 hover:bg-blue-50'
                    : 'text-white hover:bg-blue-500'
                } text-xs sm:text-sm`}
              >
                <Trophy className="w-4 h-4 sm:hidden" />
                <span className="hidden sm:inline">{t('navigation.leaderboard')}</span>
              </Button>
            </Link>
            <Link href="/schedule">
              <Button
                variant={pathname === '/schedule' ? 'default' : 'ghost'}
                className={`${
                  pathname === '/schedule'
                    ? 'bg-white text-blue-600 hover:bg-blue-50'
                    : 'text-white hover:bg-blue-500'
                } gap-1 text-xs sm:text-sm`}
              >
                <Calendar className="w-4 h-4" />
                <span className="hidden sm:inline">{t('navigation.schedule')}</span>
              </Button>
            </Link>
            <Link href="/instructions">
              <Button
                variant={pathname === '/instructions' ? 'default' : 'ghost'}
                className={`${
                  pathname === '/instructions'
                    ? 'bg-white text-blue-600 hover:bg-blue-50'
                    : 'text-white hover:bg-blue-500'
                } gap-1 text-xs sm:text-sm`}
              >
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline">{t('navigation.instructions')}</span>
              </Button>
            </Link>
          </nav>
        </div>
        <p className="text-center text-blue-100 text-xs sm:text-base">
          {t('header.subtitle')}
        </p>
      </div>
    </header>
  );
}
