'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '@/lib/i18n/LanguageContext';
import { useTheme } from '@/components/ThemeProvider';
import { useAuth } from '@/lib/auth/AuthContext';
import NavigationBar from '@/components/NavigationBar';
import SiteFooter from '@/components/SiteFooter';
import { BuddhaHalo, LotusFlower, AuspiciousCloud, SeedSyllable } from '@/components/SacredDecorations';
import dynamic from 'next/dynamic';

const LotusBloom = dynamic(() => import('@/components/RitualDecorations').then(m => m.LotusBloom), { ssr: false });
import { CustomTargetGrid, type TargetItem } from '@/components/CustomTargetGrid';

const DEFAULT_DEITIES: TargetItem[] = [
  { key: 'shakyamuni', zh: '释迦牟尼佛', en: 'Shakyamuni Buddha', img: '/images/deities/shakyamuni.jpg' },
  { key: 'amitabha', zh: '阿弥陀佛', en: 'Amitabha Buddha', img: '/images/deities/amitabha.jpg' },
  { key: 'guanyin', zh: '观世音菩萨', en: 'Guanyin Bodhisattva', img: '/images/deities/guanyin.jpg' },
  { key: 'wenshu', zh: '文殊菩萨', en: 'Manjusri Bodhisattva', img: '/images/deities/wenshu.jpg' },
  { key: 'puxian', zh: '普贤菩萨', en: 'Samantabhadra Bodhisattva', img: '/images/deities/puxian.jpg' },
  { key: 'guanyu', zh: '关圣帝君', en: 'Emperor Guan (Guan Yu)', img: '/images/deities/guanyu.jpg' },
  { key: 'mazu', zh: '妈祖', en: 'Mazu (Sea Goddess)', img: '/images/deities/mazu.jpg' },
  { key: 'ancestor', zh: '祖先', en: 'Ancestors', img: '/images/deities/ancestor.jpg' },
];

const DEFAULT_TARGETS: TargetItem[] = [
  { key: 'self', zh: '为自己', en: 'For Self' },
  { key: 'family', zh: '为家人', en: 'For Family' },
  { key: 'friend', zh: '为朋友', en: 'For Friends' },
  { key: 'all', zh: '为众生', en: 'For All Beings' },
];

const DEITY_STORAGE_KEY = 'incense_targets';

function DeityImage({ src, name, width = 120, goldColor }: { src: string; name: string; width?: number; goldColor: string }) {
  const height = Math.round(width * 16 / 9);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      style={{ position: 'relative', width, height }}
    >
      <motion.div
        style={{
          position: 'absolute',
          inset: -12,
          borderRadius: 16,
          background: `radial-gradient(ellipse, ${goldColor}40, transparent 70%)`,
          filter: 'blur(12px)',
        }}
        animate={{ scale: [1, 1.06, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div
        style={{
          width,
          height,
          borderRadius: 12,
          overflow: 'hidden',
          border: `2px solid ${goldColor}`,
          boxShadow: `0 0 20px ${goldColor}40, inset 0 0 10px ${goldColor}20`,
          position: 'relative',
        }}
      >
        <img src={src || undefined} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 12,
            background: `linear-gradient(to bottom, transparent 50%, ${goldColor}20)`,
            pointerEvents: 'none',
          }}
        />
    </div>
    </motion.div>
  );
}

export default function PrayerPage() {
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

  const [deities, setDeities] = useState<TargetItem[]>(DEFAULT_DEITIES);
  const [deity, setDeity] = useState('');
  const [target, setTarget] = useState('');
  const [content, setContent] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [records, setRecords] = useState<Array<{ content: string; deity: string; target: string; created_at: string }>>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(DEITY_STORAGE_KEY);
      if (saved) setDeities(JSON.parse(saved) as TargetItem[]);
    } catch { /* ignore */ }
  }, []);

  const selectedDeity = deities.find(t => t.key === deity);

  const handleSubmit = async () => {
    if (!content.trim()) return;
    try {
      await fetch('/api/prayer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'prayer', content, deity, target }),
      });
    } catch { /* not logged in */ }
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setContent('');
      setDeity('');
      setTarget('');
    }, 4000);
  };

  const loadHistory = async () => {
    try {
      const res = await fetch('/api/prayer?type=prayer');
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
        <AuspiciousCloud size={130} color={c.goldSolid} opacity={0.06} />
    </div>
      <div className="absolute pointer-events-none" style={{ top: '15%', right: '5%', zIndex: 0 }}>
        <LotusFlower size={100} color={c.goldSolid} opacity={0.06} />
    </div>
      <div className="absolute pointer-events-none" style={{ bottom: '10%', left: '8%', zIndex: 0 }}>
        <SeedSyllable size={45} color={c.goldSolid} opacity={0.08} syllable="祈" />
    </div>
      <div className="absolute pointer-events-none" style={{ bottom: '8%', right: '8%', zIndex: 0 }}>
        <LotusFlower size={80} color={c.goldSolid} opacity={0.05} />
    </div>
      <NavigationBar />
      <div className="max-w-2xl mx-auto px-4 pt-20 pb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2" style={{ color: c.goldSolid }}>
            {lang === 'zh' ? '祈福' : 'Prayer'}
          </h1>
          <p className="text-sm" style={{ color: c.textMuted }}>
            {lang === 'zh' ? '虔诚祈福，愿佛菩萨加持护佑' : 'Sincere prayer, may Buddhas bless and protect'}
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
              {selectedDeity?.img ? (
                <DeityImage
                  src={selectedDeity.img}
                  name={lang === 'zh' ? selectedDeity.zh : selectedDeity.en}
                  width={135}
                  goldColor={c.goldSolid}
                />
              ) : (
                <LotusBloom size={140} color={c.goldSolid} />
              )}
              <motion.p
                className="mt-6 text-lg"
                style={{ color: c.goldSolid }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                {lang === 'zh' ? '祈福已上达天听' : 'Your prayer has been heard'}
              </motion.p>
              <motion.p
                className="mt-2 text-sm"
                style={{ color: c.textMuted }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
              >
                {lang === 'zh' ? '愿所求皆如愿，所行皆坦途' : 'May all wishes come true'}
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
                storageKey="prayer_targets"
                defaultItems={DEFAULT_TARGETS}
                selectedKey={target}
                onSelect={setTarget}
                label={lang === 'zh' ? '祈福对象' : 'Prayer Target'}
                c={c}
                lang={lang}
                layout="wrap"
              />

              <CustomTargetGrid
                storageKey={DEITY_STORAGE_KEY}
                defaultItems={DEFAULT_DEITIES}
                selectedKey={deity}
                onSelect={setDeity}
                label={lang === 'zh' ? '祈请佛菩萨' : 'Invoke Bodhisattva'}
                c={c}
                lang={lang}
                columns={3}
                showImage
              />

              <AnimatePresence>
                {deity && selectedDeity?.img && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex flex-col items-center py-6"
                    style={{ background: c.cardBg, borderRadius: 16, border: `1px solid ${c.border}` }}
                  >
                    <DeityImage
                      src={selectedDeity.img}
                      name={lang === 'zh' ? selectedDeity.zh : selectedDeity.en}
                      width={120}
                      goldColor={c.goldSolid}
                    />
                    <p className="mt-4 text-sm font-medium" style={{ color: c.goldSolid }}>
                      {lang === 'zh' ? selectedDeity.zh : selectedDeity.en}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label className="text-sm mb-2 block" style={{ color: c.textMuted }}>
                  {lang === 'zh' ? '祈福内容' : 'Prayer Content'}
                </label>
                <textarea
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  rows={4}
                  placeholder={lang === 'zh' ? '请输入您的祈福内容...' : 'Enter your prayer...'}
                  className="w-full px-4 py-3 rounded-xl text-sm resize-none"
                  style={{
                    background: c.cardBg,
                    border: `1px solid ${c.border}`,
                    color: c.text,
                  }}
                />
    </div>

              <div className="flex justify-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleSubmit}
                  disabled={!content.trim()}
                  className="px-8 py-2.5 rounded-xl font-medium"
                  style={{
                    background: content.trim() ? c.goldSolid : c.border,
                    color: '#1a1a2e',
                  }}
                >
                  {lang === 'zh' ? '虔诚祈福' : 'Submit Prayer'}
                </motion.button>
                {user && (
                  <button
                    onClick={loadHistory}
                    className="px-4 py-2.5 rounded-xl text-sm"
                    style={{
                      background: c.cardBg,
                      border: `1px solid ${c.border}`,
                      color: c.textMuted,
                    }}
                  >
                    {lang === 'zh' ? '祈福记录' : 'History'}
                  </button>
                )}
    </div>

              {showHistory && records.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-2"
                >
                  <h3 className="text-sm font-medium" style={{ color: c.goldSolid }}>
                    {lang === 'zh' ? '祈福记录' : 'Prayer History'}
                  </h3>
                  {records.map((r, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-lg text-sm"
                      style={{ background: c.cardBg, border: `1px solid ${c.border}` }}
                    >
                      <p style={{ color: c.text }}>{r.content}</p>
                      <p className="text-xs mt-1" style={{ color: c.textFaint }}>
                        {r.created_at}
                      </p>
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