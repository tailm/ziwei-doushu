'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '@/lib/i18n/LanguageContext';
import { useTheme } from '@/components/ThemeProvider';
import { useAuth } from '@/lib/auth/AuthContext';
import NavigationBar from '@/components/NavigationBar';
import SiteFooter from '@/components/SiteFooter';
import { AuspiciousCloud, SacredFlame, SeedSyllable, BodhiLeaf, RippleWave } from '@/components/SacredDecorations';
import dynamic from 'next/dynamic';

const WishLantern = dynamic(() => import('@/components/RitualDecorations').then(m => m.WishLantern), { ssr: false });
import { CustomTargetGrid, type TargetItem } from '@/components/CustomTargetGrid';

const DEFAULT_CATEGORIES: TargetItem[] = [
  { key: 'career', zh: '事业', en: 'Career' },
  { key: 'health', zh: '健康', en: 'Health' },
  { key: 'love', zh: '姻缘', en: 'Love' },
  { key: 'study', zh: '学业', en: 'Study' },
  { key: 'wealth', zh: '财运', en: 'Wealth' },
  { key: 'family', zh: '家庭', en: 'Family' },
  { key: 'peace', zh: '平安', en: 'Peace' },
];

export default function WishPage() {
  const { lang } = useLang();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { user } = useAuth();

  const c = {
    bg: isDark ? '#020810' : '#f5efe0',
    cardBg: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.88)',
    border: isDark ? 'rgba(212,168,67,0.2)' : 'rgba(140,100,20,0.2)',
    goldSolid: isDark ? '#d4a843' : '#8b6410',
    text: isDark ? '#e8eef6' : '#1a1d24',
    textMuted: isDark ? '#9db0d0' : '#5a6275',
    textFaint: isDark ? 'rgba(240,246,255,0.4)' : '#9da4b3',
  };

  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [records, setRecords] = useState<Array<{ content: string; category: string; created_at: string }>>([]);
  const [showHistory, setShowHistory] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) return;
    try {
      await fetch('/api/prayer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'wish', content, category }),
      });
    } catch { /* not logged in */ }
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setContent('');
      setCategory('');
    }, 4000);
  };

  const loadHistory = async () => {
    try {
      const res = await fetch('/api/prayer?type=wish');
      const data = await res.json();
      if (data.records) setRecords(data.records);
      setShowHistory(true);
    } catch { /* not logged in */ }
  };

  return (
    <div style={{ minHeight: '100vh', background: c.bg, color: c.text, position: 'relative', overflow: 'hidden' }}>
      {/* 庄严装饰背景 */}
      <div className="absolute pointer-events-none" style={{ top: '8%', left: '5%', zIndex: 0 }}>
        <AuspiciousCloud size={140} color={c.goldSolid} opacity={0.06} />
    </div>
      <div className="absolute pointer-events-none" style={{ top: '12%', right: '5%', zIndex: 0 }}>
        <AuspiciousCloud size={120} color={c.goldSolid} opacity={0.05} />
    </div>
      <div className="absolute pointer-events-none" style={{ bottom: '10%', left: '8%', zIndex: 0 }}>
        <SacredFlame size={30} color={c.goldSolid} opacity={0.08} />
    </div>
      <div className="absolute pointer-events-none" style={{ bottom: '12%', right: '8%', zIndex: 0 }}>
        <SeedSyllable size={45} color={c.goldSolid} opacity={0.08} syllable="愿" />
    </div>
      <div className="absolute pointer-events-none" style={{ top: '20%', right: '10%', zIndex: 0 }}>
        <BodhiLeaf size={70} color={c.goldSolid} opacity={0.05} />
    </div>
      <div className="absolute pointer-events-none" style={{ bottom: '5%', left: '50%', transform: 'translateX(-50%)', zIndex: 0 }}>
        <RippleWave size={120} color={c.goldSolid} opacity={0.05} />
    </div>
      <NavigationBar />
      <div className="max-w-2xl mx-auto px-4 pt-20 pb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2" style={{ color: c.goldSolid }}>
            {lang === 'zh' ? '许愿' : 'Make a Wish'}
          </h1>
          <p className="text-sm" style={{ color: c.textMuted }}>
            {lang === 'zh' ? '点亮心愿，愿星光照亮前路' : 'Light your wish, may stars guide your path'}
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex flex-col items-center py-12"
            >
              <motion.div animate={{ y: [0, -30, -60] }} transition={{ duration: 3, times: [0, 0.5, 1] }}>
                <WishLantern size={80} color={c.goldSolid} />
              </motion.div>
              <motion.p
                className="mt-8 text-lg"
                style={{ color: c.goldSolid }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                {lang === 'zh' ? '心愿已放飞' : 'Your wish has been released'}
              </motion.p>
              <motion.p
                className="mt-2 text-sm"
                style={{ color: c.textMuted }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
              >
                {lang === 'zh' ? '愿所愿皆成真' : 'May all wishes come true'}
              </motion.p>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <CustomTargetGrid
                storageKey="wish_categories"
                defaultItems={DEFAULT_CATEGORIES}
                selectedKey={category}
                onSelect={setCategory}
                label={lang === 'zh' ? '愿望类别' : 'Wish Category'}
                c={c}
                lang={lang}
                layout="wrap"
              />

              <div>
                <label className="text-sm mb-2 block" style={{ color: c.textMuted }}>
                  {lang === 'zh' ? '愿望内容' : 'Wish Content'}
                </label>
                <textarea
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  rows={4}
                  placeholder={lang === 'zh' ? '请输入您的愿望...' : 'Enter your wish...'}
                  className="w-full px-4 py-3 rounded-xl text-sm resize-none"
                  style={{ background: c.cardBg, border: `1px solid ${c.border}`, color: c.text }}
                />
    </div>

              <div className="flex justify-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleSubmit}
                  disabled={!content.trim()}
                  className="px-8 py-2.5 rounded-xl font-medium"
                  style={{ background: content.trim() ? c.goldSolid : c.border, color: '#1a1a2e' }}
                >
                  {lang === 'zh' ? '放飞心愿' : 'Release Wish'}
                </motion.button>
                {user && (
                  <button
                    onClick={loadHistory}
                    className="px-4 py-2.5 rounded-xl text-sm"
                    style={{ background: c.cardBg, border: `1px solid ${c.border}`, color: c.textMuted }}
                  >
                    {lang === 'zh' ? '许愿记录' : 'History'}
                  </button>
                )}
    </div>

              {showHistory && records.length > 0 && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-2">
                  <h3 className="text-sm font-medium" style={{ color: c.goldSolid }}>
                    {lang === 'zh' ? '许愿记录' : 'Wish History'}
                  </h3>
                  {records.map((r, i) => (
                    <div key={i} className="p-3 rounded-lg text-sm" style={{ background: c.cardBg, border: `1px solid ${c.border}` }}>
                      <p style={{ color: c.text }}>{r.content}</p>
                      <p className="text-xs mt-1" style={{ color: c.textFaint }}>{r.created_at}</p>
    </div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
    </div>
      <SiteFooter />
    </div>
  );
}