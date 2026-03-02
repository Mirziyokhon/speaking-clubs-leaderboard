'use client';

import { ClubsProvider } from '@/lib/clubContext';
import { LeaderboardHeader } from '@/components/leaderboard-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Gift, RotateCcw } from 'lucide-react';
import { useTranslation } from 'react-i18next';

function InstructionsContent() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <LeaderboardHeader />

      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Point System Section */}
        <div className="mb-12 fade-in">
          <div className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2 text-balance">
              {t('instructions.pointSystemGuide')}
            </h2>
            <p className="text-slate-600 text-lg">
              {t('instructions.pointSystemSubtitle')}
            </p>
          </div>

          <Card className="mb-8 border-blue-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200">
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <CheckCircle2 className="w-6 h-6" />
                {t('instructions.howToEarnPoints')}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-8">
              <div className="space-y-6">
                {/* Attendance */}
                <div className="flex items-start gap-4 pb-6 border-b border-slate-200">
                  <div className="bg-blue-100 rounded-full p-3 flex-shrink-0">
                    <span className="text-2xl font-bold text-blue-600">+1</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 text-lg mb-1">
                      {t('instructions.attendance.title')}
                    </h3>
                    <p className="text-slate-600">
                      {t('instructions.attendance.description')}
                    </p>
                  </div>
                </div>

                {/* Active Speaking */}
                <div className="flex items-start gap-4 pb-6 border-b border-slate-200">
                  <div className="bg-green-100 rounded-full p-3 flex-shrink-0">
                    <span className="text-2xl font-bold text-green-600">+1</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 text-lg mb-1">
                      {t('instructions.activeSpeaking.title')}
                    </h3>
                    <p className="text-slate-600">
                      {t('instructions.activeSpeaking.description')}
                    </p>
                  </div>
                </div>

                {/* Winning Activity */}
                <div className="flex items-start gap-4 pb-6 border-b border-slate-200">
                  <div className="bg-yellow-100 rounded-full p-3 flex-shrink-0">
                    <span className="text-2xl font-bold text-yellow-600">+2</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 text-lg mb-1">
                      {t('instructions.winningActivity.title')}
                    </h3>
                    <p className="text-slate-600">
                      {t('instructions.winningActivity.description')}
                    </p>
                  </div>
                </div>

                {/* Bringing Friend */}
                <div className="flex items-start gap-4">
                  <div className="bg-purple-100 rounded-full p-3 flex-shrink-0">
                    <span className="text-2xl font-bold text-purple-600">+1</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 text-lg mb-1">
                      {t('instructions.bringingFriend.title')}
                    </h3>
                    <p className="text-slate-600">
                      {t('instructions.bringingFriend.description')}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Prizes Section */}
        <div className="mb-12 fade-in">
          <div className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2 text-balance">
              {t('instructions.monthlyPrizes')}
            </h2>
            <p className="text-slate-600 text-lg">
              {t('instructions.monthlyPrizesSubtitle')}
            </p>
          </div>

          <Card className="border-amber-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200">
              <CardTitle className="flex items-center gap-2 text-amber-900">
                <Gift className="w-6 h-6" />
                {t('instructions.prizeBreakdown')}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-8">
              <div className="space-y-6">
                {/* 1st Place */}
                <div className="flex items-start gap-4 pb-6 border-b border-slate-200">
                  <div className="bg-gradient-to-br from-yellow-300 to-yellow-400 rounded-full p-3 flex-shrink-0">
                    <span className="text-2xl">🥇</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-slate-900 text-lg">
                        {t('instructions.firstPlace.title')}
                      </h3>
                      <Badge className="bg-yellow-500 hover:bg-yellow-600">{t('instructions.firstPlace.badge')}</Badge>
                    </div>
                    <p className="text-slate-600 mb-2">
                      <strong>Prize:</strong> {t('instructions.firstPlace.prize')}
                    </p>
                    <p className="text-sm text-slate-500">
                      {t('instructions.firstPlace.description')}
                    </p>
                  </div>
                </div>

                {/* 2nd Place */}
                <div className="flex items-start gap-4 pb-6 border-b border-slate-200">
                  <div className="bg-gray-300 rounded-full p-3 flex-shrink-0">
                    <span className="text-2xl">🥈</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-slate-900 text-lg">
                        {t('instructions.secondPlace.title')}
                      </h3>
                      <Badge className="bg-gray-400 hover:bg-gray-500">{t('instructions.secondPlace.badge')}</Badge>
                    </div>
                    <p className="text-slate-600 mb-2">
                      <strong>Prize:</strong> {t('instructions.secondPlace.prize')}
                    </p>
                    <p className="text-sm text-slate-500">
                      {t('instructions.secondPlace.description')}
                    </p>
                  </div>
                </div>

                {/* 3rd Place */}
                <div className="flex items-start gap-4">
                  <div className="bg-orange-400 rounded-full p-3 flex-shrink-0">
                    <span className="text-2xl">🥉</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-slate-900 text-lg">
                        {t('instructions.thirdPlace.title')}
                      </h3>
                      <Badge className="bg-orange-500 hover:bg-orange-600">{t('instructions.thirdPlace.badge')}</Badge>
                    </div>
                    <p className="text-slate-600 mb-2">
                      <strong>Prize:</strong> {t('instructions.thirdPlace.prize')}
                    </p>
                    <p className="text-sm text-slate-500">
                      {t('instructions.thirdPlace.description')}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Points Reset Section */}
        <div className="fade-in">
          <Card className="border-red-200 shadow-lg bg-gradient-to-br from-red-50 to-orange-50">
            <CardHeader className="border-b border-red-200">
              <CardTitle className="flex items-center gap-2 text-red-900">
                <RotateCcw className="w-6 h-6" />
                {t('instructions.pointsReset.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <p className="text-slate-700 leading-relaxed">
                  {t('instructions.pointsReset.description')}
                </p>
                <div className="bg-white border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-slate-600">
                    <strong>Example:</strong> {t('instructions.pointsReset.example')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

export default function InstructionsPage() {
  return (
    <ClubsProvider>
      <InstructionsContent />
    </ClubsProvider>
  );
}
