'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth/AuthContext';
import { useRouter } from 'next/navigation';
import { useLang } from '@/lib/i18n/LanguageContext';
import { t, T } from '@/lib/i18n/translations';
import NavigationBar from '@/components/NavigationBar';
import SiteFooter from '@/components/SiteFooter';

interface RechargeHistoryItem {
  id: number;
  tx_hash: string;
  amount: number;
  status: string;
  chain: string;
  token: string;
  created_at: number;
  confirmed_at: number | null;
}

interface CreditsLogItem {
  id: number;
  user_id: number;
  feature: string;
  amount: number;
  balance_after: number;
  created_at: number;
}

interface CheckinCalendarDay {
  date: string;
  count: number;
  types: string[];
}

interface CheckinOverview {
  calendar: CheckinCalendarDay[];
  stats: {
    total_days: number;
    total_checkins: number;
    by_type: Record<string, number>;
    current_streaks: Record<string, number>;
    longest_streak: number;
    this_week_count: number;
    this_month_count: number;
  };
  achievements: Array<{
    key: string;
    title_zh: string;
    title_en: string;
    desc_zh: string;
    desc_en: string;
    unlocked: boolean;
    progress: number;
    target: number;
    icon: string;
  }>;
}

const FEATURE_LABELS: Record<string, { zh: string; en: string }> = {
  new_user_bonus: { zh: '新用户赠送', en: 'New User Bonus' },
  recharge_bonus: { zh: '充值赠送', en: 'Recharge Bonus' },
  chart: { zh: '起盘', en: 'Chart' },
  heming: { zh: '合盘', en: 'Compatibility' },
  ai_interpret: { zh: 'AI解盘', en: 'AI Reading' },
  ai_qa: { zh: 'AI问答', en: 'AI Q&A' },
  tip: { zh: '打赏', en: 'Tip' },
  wellness_taichi: { zh: '太极修行', en: 'Tai Chi Check-in' },
  wellness_vegetarian: { zh: '吃斋修行', en: 'Vegetarian Check-in' },
  wellness_meditation: { zh: '打坐修行', en: 'Meditation Check-in' },
  wellness_reflection: { zh: '每日三省', en: 'Daily Reflection' },
  wellness_charity: { zh: '积德行善', en: 'Charity Check-in' },
  recitation_morning: { zh: '晨间诵经', en: 'Morning Recitation' },
  recitation_evening: { zh: '晚间诵经', en: 'Evening Recitation' },
};

const PRACTICE_LABELS: Record<string, { zh: string; en: string; color: string }> = {
  recitation: { zh: '诵经', en: 'Recitation', color: '#d4a843' },
  vegetarian: { zh: '吃斋', en: 'Vegetarian', color: '#4ade80' },
  meditation: { zh: '打坐', en: 'Meditation', color: '#60a5fa' },
  reflection: { zh: '三省', en: 'Reflection', color: '#f472b6' },
  taichi: { zh: '太极', en: 'Tai Chi', color: '#2dd4bf' },
  charity: { zh: '行善', en: 'Charity', color: '#fb923c' },
};

function PracticeBarChart({ overview, lang }: { overview: CheckinOverview; lang: string }) {
  const entries = Object.entries(PRACTICE_LABELS);
  const maxCount = Math.max(...entries.map(([key]) => overview.stats.by_type[key] || 0), 1);
  const chartHeight = 120;
  const barWidth = 28;
  const gap = 12;

  return (
    <div className="mt-4">
      <div className="text-xs mb-2" style={{ color: 'var(--tx-2)' }}>{lang === 'zh' ? '各项目修行次数' : 'Check-ins by Practice'}</div>
      <div className="flex items-end justify-center" style={{ height: chartHeight + 40, gap: `${gap}px` }}>
        {entries.map(([key, label], i) => {
          const count = overview.stats.by_type[key] || 0;
          const streak = overview.stats.current_streaks[key] || 0;
          const barHeight = Math.max((count / maxCount) * chartHeight, count > 0 ? 4 : 0);
          return (
            <div key={key} className="flex flex-col items-center" style={{ width: barWidth }}>
              <div className="text-[9px] mb-0.5" style={{ color: streak > 0 ? label.color : 'var(--tx-3)' }}>
                {streak > 0 ? (lang === 'zh' ? `${streak}天` : `${streak}d`) : ''}
              </div>
              <div className="text-[10px] font-medium" style={{ color: count > 0 ? label.color : 'var(--tx-3)' }}>
                {count}
              </div>
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: barHeight }}
                transition={{ delay: i * 0.08, type: 'spring', stiffness: 100, damping: 15 }}
                className="rounded-t-sm w-full"
                style={{
                  height: barHeight,
                  background: count > 0 ? label.color : 'var(--bg-2)',
                  opacity: count > 0 ? 0.85 : 0.3,
                  minHeight: count > 0 ? 4 : 2,
                }}
              />
              <div className="text-[9px] mt-1 text-center" style={{ color: 'var(--tx-2)' }}>
                {lang === 'zh' ? label.zh : label.en}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PracticeMonthCalendar({ calendar, lang }: { calendar: CheckinCalendarDay[]; lang: string }) {
  const [viewYear, setViewYear] = useState(new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(new Date().getMonth());

  const dayMap = new Map<string, CheckinCalendarDay>();
  for (const d of calendar) {
    dayMap.set(d.date, d);
  }

  const firstDay = new Date(viewYear, viewMonth, 1);
  const lastDay = new Date(viewYear, viewMonth + 1, 0);
  const startDayOfWeek = firstDay.getDay();
  const daysInMonth = lastDay.getDate();
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);

  const weekDayLabels = lang === 'zh' ? ['日', '一', '二', '三', '四', '五', '六'] : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthName = lang === 'zh' ? `${viewYear}年${viewMonth + 1}月` : new Date(viewYear, viewMonth, 1).toLocaleString('en-US', { year: 'numeric', month: 'long' });

  const cells: Array<{ day: number; dateStr: string; isToday: boolean; data: CheckinCalendarDay | null }> = [];
  for (let i = 0; i < startDayOfWeek; i++) {
    cells.push({ day: 0, dateStr: '', isToday: false, data: null });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    cells.push({
      day: d,
      dateStr,
      isToday: dateStr === todayStr,
      data: dayMap.get(dateStr) || null,
    });
  }
  while (cells.length % 7 !== 0) {
    cells.push({ day: 0, dateStr: '', isToday: false, data: null });
  }

  const goPrevMonth = () => {
    if (viewMonth === 0) {
      setViewYear(viewYear - 1);
      setViewMonth(11);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };
  const goNextMonth = () => {
    if (viewMonth === 11) {
      setViewYear(viewYear + 1);
      setViewMonth(0);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const getCellBg = (data: CheckinCalendarDay | null) => {
    if (!data || data.count === 0) return 'var(--bg-2)';
    if (data.count === 1) return 'rgba(212,168,67,0.20)';
    if (data.count === 2) return 'rgba(212,168,67,0.35)';
    if (data.count === 3) return 'rgba(212,168,67,0.50)';
    if (data.count === 4) return 'rgba(212,168,67,0.65)';
    return 'rgba(212,168,67,0.80)';
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <button onClick={goPrevMonth} className="px-2 py-1 rounded text-xs" style={{ background: 'var(--bg-2)', color: 'var(--tx-2)' }}>‹</button>
        <div className="text-sm font-medium" style={{ color: 'var(--tx-1)' }}>{monthName}</div>
        <button onClick={goNextMonth} className="px-2 py-1 rounded text-xs" style={{ background: 'var(--bg-2)', color: 'var(--tx-2)' }}>›</button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-1">
        {weekDayLabels.map((label, i) => (
          <div key={i} className="text-[9px] text-center font-medium" style={{ color: 'var(--tx-3)' }}>{label}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((cell, i) => (
          <div
            key={i}
            className="rounded text-center relative"
            style={{
              height: 32,
              background: cell.day > 0 ? getCellBg(cell.data) : 'transparent',
              border: cell.isToday ? '1px solid var(--ac)' : cell.day > 0 && cell.data && cell.data.count > 0 ? '0.5px solid rgba(212,168,67,0.3)' : '0.5px solid var(--bdr)',
            }}
          >
            {cell.day > 0 && (
              <>
                <div className="text-[10px]" style={{ color: cell.isToday ? 'var(--ac)' : cell.data && cell.data.count > 0 ? 'var(--ac)' : 'var(--tx-3)', fontWeight: cell.isToday ? 'bold' : 'normal' }}>
                  {cell.day}
                </div>
                {cell.data && cell.data.count > 0 && (
                  <div className="absolute bottom-0.5 left-0 right-0 flex justify-center gap-0.5">
                    {cell.data.types.slice(0, 4).map((type, ti) => (
                      <div key={ti} className="w-1 h-1 rounded-full" style={{ background: PRACTICE_LABELS[type]?.color || '#d4a843' }} />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1.5 mt-2 flex-wrap">
        <span className="text-[8px]" style={{ color: 'var(--tx-3)' }}>{lang === 'zh' ? '修行项' : 'Types:'}</span>
        {Object.entries(PRACTICE_LABELS).map(([key, label]) => (
          <div key={key} className="flex items-center gap-0.5">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: label.color }} />
            <span className="text-[8px]" style={{ color: 'var(--tx-3)' }}>{lang === 'zh' ? label.zh : label.en}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user, loading, refreshUser, refreshPermissions, permissions } = useAuth();
  const router = useRouter();
  const { lang } = useLang();
  const [rechargeHistory, setRechargeHistory] = useState<RechargeHistoryItem[]>([]);
  const [creditsLog, setCreditsLog] = useState<CreditsLogItem[]>([]);
  const [overview, setOverview] = useState<CheckinOverview | null>(null);

  const fetchRechargeHistory = useCallback(async () => {
    try {
      const res = await fetch('/api/wallet/history');
      if (res.ok) {
        const data = await res.json();
        setRechargeHistory(data.records || []);
      }
    } catch {
      // ignore
    }
  }, []);

  const fetchCreditsLog = useCallback(async () => {
    try {
      const res = await fetch('/api/credits/log');
      if (res.ok) {
        const data = await res.json();
        setCreditsLog(data.logs || []);
      }
    } catch {
      // ignore
    }
  }, []);

  const fetchOverview = useCallback(async () => {
    try {
      const res = await fetch('/api/wellness?action=overview');
      if (res.ok) {
        const data = await res.json();
        setOverview(data.overview || null);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
    if (user) {
      fetchRechargeHistory();
      fetchCreditsLog();
      fetchOverview();
    }
  }, [user, loading, router, fetchRechargeHistory, fetchCreditsLog, fetchOverview]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-sm" style={{ color: 'var(--tx-3)' }}>{t('recharge_loading', lang)}</div>
      </div>
    );
  }

  if (!user) return null;

  const isPremium = user.membership_tier === 'premium' || user.membership_tier === 'admin';
  const credits = permissions?.credits ?? user.credits ?? 0;

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-8 max-w-2xl mx-auto">
      <NavigationBar />
      <h1 className="text-2xl font-bold mb-8" style={{ color: 'var(--tx-1)' }}>{t('credits_title', lang)}</h1>

      {/* 积分概览 */}
      <div className="rounded-xl p-6 mb-6" style={{ background: 'var(--bg-1)', border: '1px solid var(--bdr)' }}>
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-medium" style={{ color: 'var(--tx-1)' }}>
            {isPremium ? t('recharge_premium', lang) : t('credits_normal', lang)}
          </div>
          <div className="text-xs" style={{ color: 'var(--tx-3)' }}>
            {user.nickname || `${user.wallet_address.slice(0, 6)}...${user.wallet_address.slice(-4)}`}
          </div>
        </div>

        <div className="flex items-center justify-between p-4 rounded-lg mb-4" style={{ background: 'rgba(184,146,42,0.08)', border: '1px solid rgba(184,146,42,0.2)' }}>
          <span className="text-sm" style={{ color: 'var(--ac)' }}>{t('credits_balance', lang)}</span>
          <span className="text-2xl font-bold" style={{ color: 'var(--ac)' }}>
            {isPremium ? t('credits_unlimited', lang) : credits}
          </span>
        </div>

        <div className="grid grid-cols-4 gap-3">
          <div className="text-center p-3 rounded-lg" style={{ background: 'var(--bg-2)' }}>
            <div className="text-[10px] mb-1" style={{ color: 'var(--tx-3)' }}>{t('credits_chart', lang)}</div>
            <div className="text-sm font-medium" style={{ color: 'var(--ac)' }}>{t('credits_20', lang)}</div>
          </div>
          <div className="text-center p-3 rounded-lg" style={{ background: 'var(--bg-2)' }}>
            <div className="text-[10px] mb-1" style={{ color: 'var(--tx-3)' }}>{t('credits_heming', lang)}</div>
            <div className="text-sm font-medium" style={{ color: 'var(--ac)' }}>{t('credits_50', lang)}</div>
          </div>
          <div className="text-center p-3 rounded-lg" style={{ background: 'var(--bg-2)' }}>
            <div className="text-[10px] mb-1" style={{ color: 'var(--tx-3)' }}>{t('credits_ai_interpret', lang)}</div>
            <div className="text-sm font-medium" style={{ color: 'var(--ac)' }}>{t('credits_100', lang)}</div>
          </div>
          <div className="text-center p-3 rounded-lg" style={{ background: 'var(--bg-2)' }}>
            <div className="text-[10px] mb-1" style={{ color: 'var(--tx-3)' }}>{t('credits_ai_qa', lang)}</div>
            <div className="text-sm font-medium" style={{ color: 'var(--ac)' }}>{t('credits_10', lang)}</div>
          </div>
        </div>
      </div>

      {/* 修行总览 */}
      {overview && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl p-6 mb-6" style={{ background: 'var(--bg-1)', border: '1px solid var(--bdr)' }}>
          <h2 className="text-sm font-medium mb-4" style={{ color: 'var(--tx-1)' }}>{lang === 'zh' ? '修行总览' : 'Practice Overview'}</h2>

          {overview.stats.total_checkins === 0 ? (
            <div className="text-center py-8">
              <div className="text-3xl mb-2">🧘</div>
              <p className="text-sm" style={{ color: 'var(--tx-2)' }}>{lang === 'zh' ? '尚未开始修行' : 'No practice check-ins yet'}</p>
              <p className="text-xs mt-1" style={{ color: 'var(--tx-3)' }}>{lang === 'zh' ? '完成每日修行，记录修行历程' : 'Start daily check-ins to track your practice'}</p>
              <button
                onClick={() => router.push('/recitation')}
                className="mt-4 px-4 py-2 rounded-lg text-xs"
                style={{ background: 'rgba(184,146,42,0.15)', color: 'var(--ac)', border: '1px solid rgba(184,146,42,0.25)' }}
              >
                {lang === 'zh' ? '开始修行' : 'Start Now'}
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-4 gap-3 mb-4">
                <div className="text-center p-3 rounded-lg" style={{ background: 'var(--bg-2)' }}>
                  <div className="text-xl font-bold" style={{ color: 'var(--ac)' }}>{overview.stats.total_days}</div>
                  <div className="text-[10px] mt-1" style={{ color: 'var(--tx-3)' }}>{lang === 'zh' ? '累计天数' : 'Total Days'}</div>
                </div>
                <div className="text-center p-3 rounded-lg" style={{ background: 'var(--bg-2)' }}>
                  <div className="text-xl font-bold" style={{ color: 'var(--ac)' }}>{overview.stats.total_checkins}</div>
                  <div className="text-[10px] mt-1" style={{ color: 'var(--tx-3)' }}>{lang === 'zh' ? '累计次数' : 'Total Check-ins'}</div>
                </div>
                <div className="text-center p-3 rounded-lg" style={{ background: 'var(--bg-2)' }}>
                  <div className="text-xl font-bold" style={{ color: 'var(--ac)' }}>{overview.stats.longest_streak}</div>
                  <div className="text-[10px] mt-1" style={{ color: 'var(--tx-3)' }}>{lang === 'zh' ? '最长连续' : 'Longest Streak'}</div>
                </div>
                <div className="text-center p-3 rounded-lg" style={{ background: 'var(--bg-2)' }}>
                  <div className="text-xl font-bold" style={{ color: 'var(--ac)' }}>{overview.stats.this_month_count}</div>
                  <div className="text-[10px] mt-1" style={{ color: 'var(--tx-3)' }}>{lang === 'zh' ? '本月天数' : 'This Month'}</div>
                </div>
              </div>

              <PracticeBarChart overview={overview} lang={lang} />

              <div className="mt-5">
                <div className="text-xs mb-2" style={{ color: 'var(--tx-2)' }}>{lang === 'zh' ? '修行日历' : 'Practice Calendar'}</div>
                <PracticeMonthCalendar calendar={overview.calendar} lang={lang} />
              </div>
            </>
          )}
        </motion.div>
      )}

      {/* 成就徽章 */}
      {overview && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-xl p-6 mb-6" style={{ background: 'var(--bg-1)', border: '1px solid var(--bdr)' }}>
          <h2 className="text-sm font-medium mb-4" style={{ color: 'var(--tx-1)' }}>{lang === 'zh' ? '修行成就' : 'Achievements'}</h2>
          <div className="grid grid-cols-4 gap-3">
            {overview.achievements.map((ach, i) => (
              <motion.div
                key={ach.key}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="flex flex-col items-center p-3 rounded-lg text-center"
                style={{
                  background: ach.unlocked ? 'rgba(212,168,67,0.10)' : 'var(--bg-2)',
                  border: `1px solid ${ach.unlocked ? 'rgba(212,168,67,0.35)' : 'var(--bdr)'}`,
                }}
              >
                <div className="text-xl mb-1" style={{ filter: ach.unlocked ? 'none' : 'grayscale(1) opacity(0.4)' }}>
                  {ach.icon}
                </div>
                <div className="text-[10px] font-medium" style={{ color: ach.unlocked ? 'var(--ac)' : 'var(--tx-3)' }}>
                  {lang === 'zh' ? ach.title_zh : ach.title_en}
                </div>
                <div className="text-[8px] mt-0.5" style={{ color: 'var(--tx-3)' }}>
                  {lang === 'zh' ? ach.desc_zh : ach.desc_en}
                </div>
                {!ach.unlocked && ach.progress > 0 && (
                  <div className="w-full mt-1.5 h-1 rounded-full overflow-hidden" style={{ background: 'var(--bg-1)' }}>
                    <div className="h-full rounded-full" style={{ width: `${(ach.progress / ach.target) * 100}%`, background: 'var(--ac)' }} />
                  </div>
                )}
                {ach.unlocked && (
                  <div className="text-[8px] mt-1" style={{ color: 'var(--ac)' }}>{lang === 'zh' ? '已解锁' : 'Unlocked'}</div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* 积分使用记录 */}
      {creditsLog.length > 0 && (
        <div className="rounded-xl p-6 mb-6" style={{ background: 'var(--bg-1)', border: '1px solid var(--bdr)' }}>
          <h2 className="text-sm font-medium mb-4" style={{ color: 'var(--tx-1)' }}>{t('credits_log', lang)}</h2>
          <div className="space-y-2">
            {creditsLog.map(item => (
              <div key={item.id} className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'var(--bg-2)' }}>
                <div className="flex items-center gap-3">
                  <span
                    className="text-[10px] px-2 py-1 rounded"
                    style={{
                      background: item.amount > 0 ? 'rgba(45,122,74,0.1)' : 'rgba(184,146,42,0.1)',
                      color: item.amount > 0 ? '#2D7A4A' : 'var(--ac)',
                    }}
                  >
                    {FEATURE_LABELS[item.feature]?.[lang] || item.feature}
                  </span>
                  <span className="text-[10px]" style={{ color: 'var(--tx-3)' }}>
                    {new Date(item.created_at * 1000).toLocaleString(lang === 'zh' ? 'zh-CN' : 'en-US', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium" style={{ color: item.amount > 0 ? '#2D7A4A' : 'var(--ac)' }}>
                    {item.amount > 0 ? `+${item.amount}` : item.amount}
                  </span>
                  <span className="text-[10px]" style={{ color: 'var(--tx-3)' }}>
                    {t('recharge_balance', lang)} {item.balance_after}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 充值入口 */}
      {!isPremium && (
        <div className="rounded-xl p-6 mb-6" style={{ background: 'var(--bg-1)', border: '1px solid rgba(184,146,42,0.22)' }}>
          <h2 className="text-sm font-medium mb-3" style={{ color: 'var(--ac)' }}>{t('credits_get_more', lang)}</h2>
          <div className="text-xs mb-4" style={{ color: 'var(--tx-2)' }}>
            <ul className="space-y-1 ml-4">
              <li>• {t('recharge_benefit_1', lang)}</li>
              <li>• {t('recharge_benefit_2', lang)}</li>
              <li>• {t('recharge_benefit_3', lang)}</li>
            </ul>
          </div>
          <button
            onClick={() => router.push('/recharge')}
            className="w-full px-6 py-3 rounded-lg text-sm transition-all duration-300"
            style={{ background: 'rgba(184,146,42,0.15)', color: 'var(--ac)', border: '1px solid rgba(184,146,42,0.25)' }}
          >
            {t('recharge_go', lang)}
          </button>
        </div>
      )}

      {/* 充值记录 */}
      {rechargeHistory.length > 0 && (
        <div className="rounded-xl p-6 mb-6" style={{ background: 'var(--bg-1)', border: '1px solid var(--bdr)' }}>
          <h2 className="text-sm font-medium mb-4" style={{ color: 'var(--tx-1)' }}>{t('recharge_history', lang)}</h2>
          <div className="space-y-3">
            {rechargeHistory.map(item => (
              <div key={item.id} className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'var(--bg-2)' }}>
                <div>
                  <div className="text-xs" style={{ color: 'var(--tx-2)' }}>
                    {item.amount} {item.token || 'USDT'}
                    <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'var(--bg-1)', color: 'var(--tx-3)' }}>
                      {T[`chain_${item.chain}` as keyof typeof T]?.[lang] ?? item.chain}
                    </span>
                  </div>
                  <div className="text-[10px] font-mono" style={{ color: 'var(--tx-3)' }}>
                    {item.tx_hash.slice(0, 18)}...
                  </div>
                </div>
                <span
                  className="text-[10px] px-2 py-1 rounded"
                  style={{
                    background: item.status === 'confirmed' ? 'rgba(184,146,42,0.15)' : 'var(--bg-1)',
                    color: item.status === 'confirmed' ? 'var(--ac)' : 'var(--tx-3)',
                  }}
                >
                  {item.status === 'confirmed' ? t('recharge_confirmed', lang) : t('recharge_pending', lang)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 功能说明 */}
      <div className="rounded-xl p-6" style={{ background: 'var(--bg-1)', border: '1px solid var(--bdr)' }}>
        <h2 className="text-sm font-medium mb-3" style={{ color: 'var(--tx-1)' }}>{t('credits_rules', lang)}</h2>
        <div className="text-xs space-y-2" style={{ color: 'var(--tx-2)' }}>
          <div className="flex items-start gap-2">
            <span style={{ color: 'var(--ac)' }}>{t('credits_new_user', lang)}</span>
            <span>{t('credits_new_user_desc', lang)}</span>
          </div>
          <div className="flex items-start gap-2">
            <span style={{ color: 'var(--ac)' }}>{t('credits_recharge', lang)}</span>
            <span>{t('credits_recharge_desc', lang)}</span>
          </div>
          <div className="flex items-start gap-2">
            <span style={{ color: 'var(--ac)' }}>{t('credits_consume', lang)}</span>
            <span>{t('credits_consume_desc', lang)}</span>
          </div>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}