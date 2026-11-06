'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '@/lib/i18n/LanguageContext';
import { useTheme } from '@/components/ThemeProvider';
import { useAuth } from '@/lib/auth/AuthContext';
import NavigationBar from '@/components/NavigationBar';
import SiteFooter from '@/components/SiteFooter';
import { LotusFlower, RippleWave, SeedSyllable, AuspiciousCloud } from '@/components/SacredDecorations';
import dynamic from 'next/dynamic';

const WaterRipple = dynamic(() => import('@/components/RitualDecorations').then(m => m.WaterRipple), { ssr: false });
import { CustomTargetGrid, type TargetItem } from '@/components/CustomTargetGrid';

const DEFAULT_REPENT_TYPES: TargetItem[] = [
  { key: 'speech', zh: '口业', en: 'Speech Karma', desc: { zh: '妄言、绮语、两舌、恶口', en: 'Lying, frivolous speech, divisive speech, harsh words' } },
  { key: 'body', zh: '身业', en: 'Body Karma', desc: { zh: '杀生、偷盗、邪淫', en: 'Killing, stealing, sexual misconduct' } },
  { key: 'mind', zh: '意业', en: 'Mind Karma', desc: { zh: '贪、嗔、痴', en: 'Greed, anger, delusion' } },
];

export default function RepentPage() {
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

  const [repentType, setRepentType] = useState('');
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
        body: JSON.stringify({ type: 'repent', content, category: repentType }),
      });
    } catch { /* not logged in */ }
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setContent('');
      setRepentType('');
    }, 4000);
  };

  const loadHistory = async () => {
    try {
      const res = await fetch('/api/prayer?type=repent');
      const data = await res.json();
      if (data.records) setRecords(data.records);
      setShowHistory(true);
    } catch { /* not logged in */ }
  };

  return (
    <div style={{ minHeight: '100vh', background: c.bg, color: c.text, position: 'relative', overflow: 'hidden' }}>
      {/* 庄严装饰背景 */}
      <div className="absolute pointer-events-none" style={{ top: '5%', left: '50%', transform: 'translateX(-50%)', zIndex: 0 }}>
        <LotusFlower size={200} color={c.goldSolid} opacity={0.05} />
    </div>
      <div className="absolute pointer-events-none" style={{ top: '10%', left: '5%', zIndex: 0 }}>
        <AuspiciousCloud size={130} color={c.goldSolid} opacity={0.05} />
    </div>
      <div className="absolute pointer-events-none" style={{ top: '15%', right: '5%', zIndex: 0 }}>
        <RippleWave size={100} color={c.goldSolid} opacity={0.06} />
    </div>
      <div className="absolute pointer-events-none" style={{ bottom: '10%', right: '8%', zIndex: 0 }}>
        <SeedSyllable size={45} color={c.goldSolid} opacity={0.08} syllable="忏" />
    </div>
      <div className="absolute pointer-events-none" style={{ bottom: '8%', left: '8%', zIndex: 0 }}>
        <RippleWave size={80} color={c.goldSolid} opacity={0.05} />
    </div>
      <NavigationBar />
      <div className="max-w-2xl mx-auto px-4 pt-20 pb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2" style={{ color: c.goldSolid }}>
            {lang === 'zh' ? '忏悔' : 'Repentance'}
          </h1>
          <p className="text-sm" style={{ color: c.textMuted }}>
            {lang === 'zh' ? '至诚忏悔，净化身心，消业增慧' : 'Sincere repentance, purify body and mind'}
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
              <WaterRipple size={120} color={c.goldSolid} />
              <motion.p className="mt-6 text-lg" style={{ color: c.goldSolid }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
                {lang === 'zh' ? '忏悔已净化' : 'Your repentance has been purified'}
              </motion.p>
              <motion.p className="mt-2 text-sm" style={{ color: c.textMuted }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
                {lang === 'zh' ? '罪从心起将心忏，心若灭时罪亦亡' : 'When the mind is purified, karma is dissolved'}
              </motion.p>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              <CustomTargetGrid
                storageKey="repent_types"
                defaultItems={DEFAULT_REPENT_TYPES}
                selectedKey={repentType}
                onSelect={setRepentType}
                label={lang === 'zh' ? '忏悔类型' : 'Repentance Type'}
                c={c}
                lang={lang}
                columns={3}
                showDesc
              />

              <div>
                <label className="text-sm mb-2 block" style={{ color: c.textMuted }}>
                  {lang === 'zh' ? '忏悔内容' : 'Repentance Content'}
                </label>
                <textarea
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  rows={4}
                  placeholder={lang === 'zh' ? '请输入您要忏悔的内容...' : 'Enter your repentance...'}
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
                  {lang === 'zh' ? '至诚忏悔' : 'Submit Repentance'}
                </motion.button>
                {user && (
                  <button
                    onClick={loadHistory}
                    className="px-4 py-2.5 rounded-xl text-sm"
                    style={{ background: c.cardBg, border: `1px solid ${c.border}`, color: c.textMuted }}
                  >
                    {lang === 'zh' ? '忏悔记录' : 'History'}
                  </button>
                )}
    </div>

              {showHistory && records.length > 0 && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-2">
                  <h3 className="text-sm font-medium" style={{ color: c.goldSolid }}>
                    {lang === 'zh' ? '忏悔记录' : 'Repentance History'}
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