'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLang } from '@/lib/i18n/LanguageContext';

const ALL_CHECKINS = [
  { key: 'recitation', zh: '诵经', en: 'Recitation', icon: '📖' },
  { key: 'vegetarian', zh: '吃斋', en: 'Vegetarian', icon: '🥬' },
  { key: 'meditation', zh: '打坐', en: 'Meditation', icon: '🧘' },
  { key: 'reflection', zh: '每日三省', en: 'Reflection', icon: '🪔' },
  { key: 'taichi', zh: '太极', en: 'Tai Chi', icon: '☯' },
  { key: 'charity', zh: '积德行善', en: 'Charity', icon: '🤝' },
];

export default function DailyCheckinProgress() {
  const { lang } = useLang();
  const [allCheckins, setAllCheckins] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadAllCheckins();
  }, []);

  const loadAllCheckins = async () => {
    try {
      const results: Record<string, boolean> = {};
      for (const item of ALL_CHECKINS) {
        if (item.key === 'recitation') {
          const res = await fetch('/api/recitation?action=streak');
          const data = await res.json();
          if (data.streak) {
            results[item.key] = data.streak.today_checked?.morning || data.streak.today_checked?.evening || false;
          }
        } else {
          const res = await fetch(`/api/wellness?action=streak&practice_type=${item.key}`);
          const data = await res.json();
          if (data.streak) {
            results[item.key] = data.streak.today_checked || false;
          }
        }
      }
      setAllCheckins(results);
    } catch { /* not logged in */ }
  };

  const completedCount = Object.values(allCheckins).filter(Boolean).length;

  return (
    <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--bdr)' }}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs" style={{ color: 'var(--tx-3)' }}>
          {lang === 'zh' ? '每日打卡进度' : 'Daily Check-in Progress'}
        </span>
        <span className="text-xs font-medium" style={{ color: 'var(--gold-solid)' }}>
          {completedCount}/6
        </span>
      </div>
      <div className="flex gap-1.5">
        {ALL_CHECKINS.map(item => (
          <div key={item.key} className="flex-1">
            <motion.div
              className="h-2 rounded-full"
              style={{ background: allCheckins[item.key] ? 'var(--gold-solid)' : 'var(--bdr)' }}
              animate={allCheckins[item.key] ? { boxShadow: '0 0 8px var(--gold-solid)' } : {}}
            />
            <div className="text-center text-xs mt-1" style={{
              color: allCheckins[item.key] ? 'var(--gold-solid)' : 'var(--tx-3)',
            }}>
              {item.icon}
            </div>
          </div>
        ))}
      </div>
      {completedCount === 6 && (
        <motion.p
          className="text-center text-sm mt-3"
          style={{ color: 'var(--gold-solid)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {lang === 'zh' ? '🎉 今日六项打卡全部完成！' : '🎉 All 6 check-ins completed today!'}
        </motion.p>
      )}
    </div>
  );
}