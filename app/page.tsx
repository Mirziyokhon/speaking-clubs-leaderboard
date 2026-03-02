'use client';

import { ClubsProvider, useClubs } from '@/lib/clubContext';
import { LeaderboardHeader } from '@/components/leaderboard-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

function LeaderboardContent() {
  const { clubs } = useClubs();
  const { t } = useTranslation();
  const [currentMonth, setCurrentMonth] = useState(new Date()); // Current month in Tashkent time (GMT+5)
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const months = [
    { value: 0, name: 'January' },
    { value: 1, name: 'February' },
    { value: 2, name: 'March' },
    { value: 3, name: 'April' },
    { value: 4, name: 'May' },
    { value: 5, name: 'June' },
    { value: 6, name: 'July' },
    { value: 7, name: 'August' },
    { value: 8, name: 'September' },
    { value: 9, name: 'October' },
    { value: 10, name: 'November' },
    { value: 11, name: 'December' },
  ];

  const years = Array.from({ length: 10 }, (_, i) => 2026 + i); // 2026-2035

  const handleMonthChange = (monthValue: number) => {
    setCurrentMonth(new Date(currentYear, monthValue));
  };

  const handleYearChange = (yearValue: number) => {
    setCurrentYear(yearValue);
    setCurrentMonth(new Date(yearValue, currentMonth.getMonth()));
  };

  // Check if selected month/year is current month
  const today = new Date();
  const isCurrentMonth = currentYear === today.getFullYear() && currentMonth.getMonth() === today.getMonth();

  const getMedalEmoji = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return '';
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'bg-yellow-50 border-l-4 border-yellow-400';
    if (rank === 2) return 'bg-gray-50 border-l-4 border-gray-400';
    if (rank === 3) return 'bg-orange-50 border-l-4 border-orange-400';
    return '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <LeaderboardHeader />

      <main className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
        <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">{t('leaderboard.chooseMonth')}</h1>
            <p className="text-slate-600">{t('leaderboard.toSeeYourPoints')}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-700 font-medium">Year:</span>
            <select
              value={currentYear}
              onChange={(e) => handleYearChange(parseInt(e.target.value))}
              className="bg-white border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <span className="text-slate-700 font-medium">Month:</span>
            <select
              value={currentMonth.getMonth()}
              onChange={(e) => handleMonthChange(parseInt(e.target.value))}
              className="bg-white border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {months.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {!isCurrentMonth && (
          <div className="mb-8 p-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl text-center">
            <div className="max-w-md mx-auto">
              <div className="mb-4">
                <svg className="w-16 h-16 mx-auto text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-blue-900 mb-2">
                {months[currentMonth.getMonth()].name} {currentYear}
              </h3>
              <p className="text-blue-700 mb-4">
                {t('leaderboard.monthNotOccurred')}
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-blue-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{t('leaderboard.currentData', { 
                  month: months[today.getMonth()].name, 
                  year: today.getFullYear() 
                })}</span>
              </div>
            </div>
          </div>
        )}

        {isCurrentMonth && (
          <Tabs defaultValue="English" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-8">
              {clubs.map((club) => (
                <TabsTrigger key={club.name} value={club.name}>
                  <span className="text-xs sm:text-sm">{t(`clubs.${club.name.toLowerCase()}`)}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {clubs.map((club) => {
              const sorted = [...club.participants].sort((a, b) => b.points - a.points);
              return (
                <TabsContent key={club.name} value={club.name} className="space-y-4">
                  <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-slate-100 border-b border-slate-200">
                          <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 w-12">
                            {t('leaderboard.rank')}
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                            {t('leaderboard.name')}
                          </th>
                          <th className="px-4 py-3 text-center text-sm font-semibold text-slate-700 w-24">
                            {t('leaderboard.points')}
                          </th>
                          <th className="px-4 py-3 text-center text-sm font-semibold text-slate-700 w-28">
                            {t('leaderboard.sessions')}
                          </th>
                          <th className="px-4 py-3 text-center text-sm font-semibold text-slate-700 w-32">
                            {t('leaderboard.lastSession')}
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                            {t('leaderboard.badges')}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {sorted.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                              {t('leaderboard.noParticipants')}
                            </td>
                          </tr>
                        ) : (
                          sorted.map((participant, index) => {
                            const rank = index + 1;
                            return (
                              <tr
                                key={participant.id}
                                className={`border-b border-slate-200 hover:bg-slate-50 transition-colors ${getRankColor(
                                  rank
                                )}`}
                              >
                                <td className="px-4 py-3 text-center">
                                  <span className="medal-badge">
                                    {getMedalEmoji(rank)}
                                  </span>
                                  <div className="text-sm font-semibold text-slate-700">
                                    {rank}
                                  </div>
                                </td>
                                <td className="px-4 py-3">
                                  <span className="font-semibold text-slate-900">
                                    {participant.name}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-bold text-sm">
                                    {participant.points}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-center text-slate-700">
                                  {participant.sessions}
                                </td>
                                <td className="px-4 py-3 text-center text-slate-600 text-sm">
                                  {participant.lastSession}
                                </td>
                                <td className="px-4 py-3">
                                  <div className="flex flex-wrap gap-1">
                                    {participant.badges.length === 0 ? (
                                      <span className="text-xs text-slate-400">—</span>
                                    ) : (
                                      participant.badges.map((badge) => (
                                        <Badge key={badge} variant="secondary" className="text-xs glow-badge">
                                          {badge}
                                        </Badge>
                                      ))
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 mt-12">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center">
          <p className="text-slate-600 text-sm">
            {t('leaderboard.footer')}
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function Home() {
  return (
    <ClubsProvider>
      <LeaderboardContent />
    </ClubsProvider>
  );
}
