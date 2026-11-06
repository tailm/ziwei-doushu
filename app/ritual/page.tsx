'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '@/lib/i18n/LanguageContext';
import { useTheme } from '@/components/ThemeProvider';
import { useAuth } from '@/lib/auth/AuthContext';
import NavigationBar from '@/components/NavigationBar';
import SiteFooter from '@/components/SiteFooter';
import { BuddhaHalo, LotusFlower, IncenseSmoke, TempleSilhouette, AuspiciousCloud } from '@/components/SacredDecorations';
import dynamic from 'next/dynamic';

const OfferingTable = dynamic(() => import('@/components/RitualDecorations').then(m => m.OfferingTable), { ssr: false });
import { CustomTargetGrid, type TargetItem } from '@/components/CustomTargetGrid';

const DEFAULT_RITUAL_TARGETS: TargetItem[] = [
  { key: 'ancestor', zh: '祭祀祖先', en: 'Ancestors', img: '/images/ritual-targets/ancestor.jpg' },
  { key: 'departed', zh: '祭祀故人', en: 'Departed Ones', img: '/images/ritual-targets/departed.jpg' },
  { key: 'sage', zh: '祭祀圣贤', en: 'Sages', img: '/images/ritual-targets/sage.jpg' },
];

const DEFAULT_OFFERINGS: TargetItem[] = [
  { key: 'flower', zh: '鲜花', en: 'Flowers', img: '/images/offerings/flower.jpg' },
  { key: 'fruit', zh: '水果', en: 'Fruits', img: '/images/offerings/fruit.jpg' },
  { key: 'tea', zh: '茶水', en: 'Tea', img: '/images/offerings/tea.jpg' },
  { key: 'incense', zh: '香烛', en: 'Incense', img: '/images/offerings/incense.jpg' },
  { key: 'rice', zh: '米饭', en: 'Rice', img: '/images/offerings/rice.jpg' },
  { key: 'wine', zh: '酒', en: 'Wine', img: '/images/offerings/wine.jpg' },
  { key: 'cake', zh: '糕点', en: 'Cake', img: '/images/offerings/cake.jpg' },
  { key: 'lamp', zh: '灯烛', en: 'Lamp', img: '/images/offerings/lamp.jpg' },
];

export default function RitualPage() {
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

  const [target, setTarget] = useState('');
  const [selectedOfferings, setSelectedOfferings] = useState<string[]>([]);
  const [offerings, setOfferings] = useState<TargetItem[]>(DEFAULT_OFFERINGS);

  const [content, setContent] = useState('');
  const [completed, setCompleted] = useState(false);
  const [records, setRecords] = useState<Array<{ content: string; target: string; created_at: string }>>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('ritual_offerings');
      if (saved) setOfferings(JSON.parse(saved) as TargetItem[]);
    } catch { /* ignore */ }
  }, []);

  const handleComplete = async () => {
    if (!target || selectedOfferings.length === 0) return;
    const offeringNames = selectedOfferings.map(k => {
      const o = offerings.find(item => item.key === k);
      return o ? (lang === 'zh' ? o.zh : o.en) : k;
    }).join('、');
    const fullContent = `${content || (lang === 'zh' ? '虔诚祭祀' : 'Sincere ritual')}（${offeringNames}）`;
    try {
      await fetch('/api/prayer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'ritual', content: fullContent, target }),
      });
    } catch { /* not logged in */ }
    setCompleted(true);
    setTimeout(() => {
      setCompleted(false);
      setTarget('');
      setSelectedOfferings([]);

      setContent('');
    }, 5000);
  };

  const loadHistory = async () => {
    try {
      const res = await fetch('/api/prayer?type=ritual');
      const data = await res.json();
      if (data.records) setRecords(data.records);
      setShowHistory(true);
    } catch { /* not logged in */ }
  };

  return (
    <div style={{ minHeight: '100vh', background: c.bg, color: c.text, position: 'relative', overflow: 'hidden' }}>
      {/* 庄严装饰背景 */}
      <div className="absolute pointer-events-none" style={{ top: '5%', left: '50%', transform: 'translateX(-50%)', zIndex: 0 }}>
        <BuddhaHalo size={300} color={c.goldSolid} opacity={0.05} />
    </div>
      <div className="absolute pointer-events-none" style={{ top: '10%', left: '5%', zIndex: 0 }}>
        <AuspiciousCloud size={140} color={c.goldSolid} opacity={0.06} />
    </div>
      <div className="absolute pointer-events-none" style={{ top: '15%', right: '5%', zIndex: 0 }}>
        <IncenseSmoke size={55} color={c.goldSolid} opacity={0.07} />
    </div>
      <div className="absolute pointer-events-none" style={{ bottom: '5%', left: '50%', transform: 'translateX(-50%)', zIndex: 0 }}>
        <TempleSilhouette size={300} color={c.goldSolid} opacity={0.04} />
    </div>
      <div className="absolute pointer-events-none" style={{ bottom: '10%', right: '8%', zIndex: 0 }}>
        <LotusFlower size={80} color={c.goldSolid} opacity={0.05} />
    </div>
      <NavigationBar />
      <div className="max-w-2xl mx-auto px-4 pt-20 pb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2" style={{ color: c.goldSolid }}>
            {lang === 'zh' ? '祭祀' : 'Memorial Ritual'}
          </h1>
          <p className="text-sm" style={{ color: c.textMuted }}>
            {lang === 'zh' ? '慎终追远，缅怀先人，寄托哀思' : 'Honor the departed, remember with reverence'}
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {completed ? (
            <motion.div
              key="completed"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex flex-col items-center py-12"
            >
              <OfferingTable items={selectedOfferings} />
              <motion.p className="mt-8 text-lg" style={{ color: c.goldSolid }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
                {lang === 'zh' ? '祭祀已完成' : 'Ritual completed'}
              </motion.p>
              <motion.p className="mt-2 text-sm" style={{ color: c.textMuted }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
                {lang === 'zh' ? '愿先人安息，福荫后人' : 'May the departed rest in peace'}
              </motion.p>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              <CustomTargetGrid
                storageKey="ritual_targets"
                defaultItems={DEFAULT_RITUAL_TARGETS}
                selectedKey={target}
                onSelect={setTarget}
                label={lang === 'zh' ? '祭祀对象' : 'Ritual Target'}
                c={c}
                lang={lang}
                columns={3}
                showImage
              />


              <CustomTargetGrid
                storageKey="ritual_offerings"
                defaultItems={DEFAULT_OFFERINGS}
                selectedKeys={selectedOfferings}
                onMultiSelect={setSelectedOfferings}
                label={lang === 'zh' ? '选择祭品' : 'Select Offerings'}
                c={c}
                lang={lang}
                columns={3}
                showImage
                multiSelect
              />

              <div>
                <label className="text-sm mb-2 block" style={{ color: c.textMuted }}>
                  {lang === 'zh' ? '祭文（可选）' : 'Memorial Text (optional)'}
                </label>
                <textarea
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  rows={3}
                  placeholder={lang === 'zh' ? '输入祭文内容...' : 'Enter memorial text...'}
                  className="w-full px-4 py-3 rounded-xl text-sm resize-none"
                  style={{ background: c.cardBg, border: `1px solid ${c.border}`, color: c.text }}
                />
    </div>

              <div className="flex justify-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleComplete}
                  disabled={!target || selectedOfferings.length === 0}
                  className="px-8 py-2.5 rounded-xl font-medium"
                  style={{ background: target && selectedOfferings.length > 0 ? c.goldSolid : c.border, color: '#1a1a2e' }}
                >
                  {lang === 'zh' ? '完成祭祀' : 'Complete Ritual'}
                </motion.button>
                {user && (
                  <button
                    onClick={loadHistory}
                    className="px-4 py-2.5 rounded-xl text-sm"
                    style={{ background: c.cardBg, border: `1px solid ${c.border}`, color: c.textMuted }}
                  >
                    {lang === 'zh' ? '祭祀记录' : 'History'}
                  </button>
                )}
    </div>

              {showHistory && records.length > 0 && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-2">
                  <h3 className="text-sm font-medium" style={{ color: c.goldSolid }}>
                    {lang === 'zh' ? '祭祀记录' : 'Ritual History'}
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