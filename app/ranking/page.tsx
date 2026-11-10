'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLang } from '@/lib/i18n/LanguageContext';
import { useTheme } from '@/components/ThemeProvider';
import { useRouter } from 'next/navigation';
import NavigationBar from '@/components/NavigationBar';
import SiteFooter from '@/components/SiteFooter';

interface RankingItem {
  feature: string;
  click_count: number;
  zh: string;
  en: string;
  icon: string;
  path: string;
  category: string;
}

const CATEGORY_LABELS: Record<string, { zh: string; en: string }> = {
  '命理': { zh: '命理推演', en: 'Destiny' },
  '占卜': { zh: '占卜问事', en: 'Divination' },
  '相术': { zh: '相术堪舆', en: 'Physiognomy' },
  '修行': { zh: '每日修行', en: 'Daily Practice' },
  '修持': { zh: '祈福修持', en: 'Rituals' },
  '知识': { zh: '知识学习', en: 'Knowledge' },
};

const CATEGORY_COLORS: Record<string, string> = {
  '命理': '#d4a843',
  '占卜': '#60a5fa',
  '相C': '#f472b6',
  '相术': '#f472b6',
  '修行': '#2dd4bf',
  '修持': '#fb923c',
  '知识': '#a78bfa',
};

export default function RankingPage() {
  const { lang } = useLang();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const router = useRouter();
  const [ranking, setRanking] = useState<RankingItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const c = {
    bg: isDark ? '#020810' : '#f5efe0',
    cardBg: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.88)',
    border: isDark ? 'rgba(212,168,67,0.2)' : 'rgba(140,100,20,0.2)',
    goldSolid: isDark ? '#d4a843' : '#8b6410',
    text: isDark ? '#e8eef6' : '#1a1d24',
    textMuted: isDark ? '#9db0d0' : '#5a6275',
    textFaint: isDark ? 'rgba(240,246,255,0.4)' : '#9da4b3',
  };

  useEffect(() => {
    fetch('/api/ranking')
      .then(res => res.json())
      .then(data => setRanking(data.ranking || []))
      .catch(() => {});
  }, []);

  const maxCount = Math.max(...ranking.map(r => r.click_count), 1);
  const filteredRanking = selectedCategory === 'all'
    ? ranking
    : ranking.filter(r => r.category === selectedCategory);

  const categories = ['all', ...Array.from(new Set(ranking.map(r => r.category)))];

  return (
    <div style={{ minHeight: '100vh', background: c.bg, color: c.text }}>
      <NavigationBar />
      <div className="max-w-2xl mx-auto px-4 pt-20 pb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2" style={{ color: c.goldSolid }}>
            {lang === 'zh' ? '功能热度排行榜' : 'Feature Popularity Ranking'}
          </h1>
          <p className="text-sm" style={{ color: c.textMuted }}>
            {lang === 'zh' ? '基于全站用户点击数据，实时统计各功能热度' : 'Real-time popularity based on user clicks'}
          </p>
        </motion.div>

        <div className="flex gap-2 justify-center mb-6 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className="px-3 py-1.5 rounded-lg text-xs transition-all"
              style={{
                background: selectedCategory === cat ? c.goldSolid : c.cardBg,
                color: selectedCategory === cat ? '#1a1a2e' : c.textMuted,
                border: `1px solid ${selectedCategory === cat ? c.goldSolid : c.border}`,
              }}
            >
              {cat === 'all' ? (lang === 'zh' ? '全部' : 'All') : (lang === 'zh' ? CATEGORY_LABELS[cat]?.zh || cat : CATEGORY_LABELS[cat]?.en || cat)}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          {filteredRanking.map((item, i) => {
            const barWidth = (item.click_count / maxCount) * 100;
            const categoryColor = CATEGORY_COLORS[item.category] || c.goldSolid;
            const isTop3 = i < 3;
            const rankColors = ['#d4a843', '#c0c0c0', '#cd7f32'];

            return (
              <motion.div
                key={item.feature}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => router.push(item.path)}
                className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all"
                style={{
                  background: isTop3 ? `${rankColors[i]}15` : c.cardBg,
                  border: `1px solid ${isTop3 ? `${rankColors[i]}40` : c.border}`,
                }}
              >
                <div
                  className="flex items-center justify-center rounded-full text-xs font-bold flex-shrink-0"
                  style={{
                    width: 28,
                    height: 28,
                    background: isTop3 ? rankColors[i] : c.cardBg,
                    color: isTop3 ? '#1a1a2e' : c.textMuted,
                    border: `1px solid ${isTop3 ? rankColors[i] : c.border}`,
                  }}
                >
                  {i + 1}
                </div>

                <div className="text-lg flex-shrink-0" style={{ filter: item.click_count > 0 ? 'none' : 'grayscale(0.5) opacity(0.5)' }}>
                  {item.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium" style={{ color: c.text }}>
                      {lang === 'zh' ? item.zh : item.en}
                    </span>
                    <span
                      className="text-[9px] px-1.5 py-0.5 rounded"
                      style={{ background: `${categoryColor}20`, color: categoryColor }}
                    >
                      {lang === 'zh' ? CATEGORY_LABELS[item.category]?.zh || item.category : CATEGORY_LABELS[item.category]?.en || item.category}
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 rounded-full overflow-hidden" style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
                    <motion.div
                      className="h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${barWidth}%` }}
                      transition={{ delay: i * 0.05 + 0.2, duration: 0.5 }}
                      style={{ background: categoryColor }}
                    />
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <div className="text-sm font-bold" style={{ color: item.click_count > 0 ? categoryColor : c.textFaint }}>
                    {item.click_count}
                  </div>
                  <div className="text-[8px]" style={{ color: c.textFaint }}>
                    {lang === 'zh' ? '次点击' : 'clicks'}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredRanking.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm" style={{ color: c.textMuted }}>
              {lang === 'zh' ? '暂无数据' : 'No data yet'}
            </p>
          </div>
        )}
      </div>
      <SiteFooter />
    </div>
  );
}