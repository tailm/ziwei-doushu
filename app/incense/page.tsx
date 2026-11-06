'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '@/lib/i18n/LanguageContext';
import { useTheme } from '@/components/ThemeProvider';
import { useAuth } from '@/lib/auth/AuthContext';
import NavigationBar from '@/components/NavigationBar';
import SiteFooter from '@/components/SiteFooter';
import { IncenseSmoke, BuddhaHalo, AuspiciousCloud, DharmaWheel, SeedSyllable } from '@/components/SacredDecorations';
import { CustomTargetGrid, type TargetItem } from '@/components/CustomTargetGrid';

const DEFAULT_TARGETS: TargetItem[] = [
  { key: 'shakyamuni', zh: '释迦牟尼佛', en: 'Shakyamuni Buddha', img: '/images/deities/shakyamuni.jpg' },
  { key: 'amitabha', zh: '阿弥陀佛', en: 'Amitabha Buddha', img: '/images/deities/amitabha.jpg' },
  { key: 'guanyin', zh: '观世音菩萨', en: 'Guanyin Bodhisattva', img: '/images/deities/guanyin.jpg' },
  { key: 'wenshu', zh: '文殊菩萨', en: 'Manjusri Bodhisattva', img: '/images/deities/wenshu.jpg' },
  { key: 'puxian', zh: '普贤菩萨', en: 'Samantabhadra Bodhisattva', img: '/images/deities/puxian.jpg' },
  { key: 'guanyu', zh: '关圣帝君', en: 'Emperor Guan (Guan Yu)', img: '/images/deities/guanyu.jpg' },
  { key: 'mazu', zh: '妈祖', en: 'Mazu (Sea Goddess)', img: '/images/deities/mazu.jpg' },
  { key: 'ancestor', zh: '祖先', en: 'Ancestors', img: '/images/deities/ancestor.jpg' },
];

const THREE_INCENSE_MEANING = [
  { zh: '戒香', en: 'Precept Incense', desc: { zh: '断一切恶，修一切善', en: 'Cease all evil, cultivate all good' } },
  { zh: '定香', en: 'Samadhi Incense', desc: { zh: '心不散乱，专注一境', en: 'Mind undisturbed, focused' } },
  { zh: '慧香', en: 'Wisdom Incense', desc: { zh: '破愚痴暗，见真实理', en: 'Break ignorance, see truth' } },
];

const STORAGE_KEY = 'incense_targets';

function loadTargets(): TargetItem[] {
  if (typeof window === 'undefined') return DEFAULT_TARGETS;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved) as TargetItem[];
  } catch { /* ignore */ }
  return DEFAULT_TARGETS;
}

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

function IncenseStickAnimated({ delay = 0, color = '#d4a843' }: { delay?: number; color?: string }) {
  return (
    <motion.div
      style={{ position: 'relative', width: 6, height: 120 }}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.8, ease: 'easeOut' }}
    >
      <div style={{ width: 3, height: 100, background: '#8b6410', margin: '0 auto', borderRadius: '1px' }} />
      <motion.div
        style={{
          position: 'absolute',
          top: -2,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 5,
          height: 8,
          background: '#ff6b35',
          borderRadius: '50%',
          boxShadow: '0 0 10px #ff6b35, 0 0 20px #ff6b3580',
        }}
        animate={{ opacity: [0, 1, 0.8, 1], scale: [0, 1.2, 1, 1.1] }}
        transition={{ delay: delay + 0.5, duration: 0.6 }}
      />
      <motion.div
        style={{
          position: 'absolute',
          top: -2,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 3,
          height: 5,
          background: '#fff8e0',
          borderRadius: '50%',
          boxShadow: '0 0 6px #fff8e0',
        }}
        animate={{ opacity: [0, 1, 0.7, 1], scale: [0, 1, 0.9, 1] }}
        transition={{ delay: delay + 0.7, duration: 0.4 }}
      />
      {[0, 1, 2, 3].map(i => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            top: -15 - i * 20,
            left: '50%',
            width: 3,
            height: 0,
            background: `${color}50`,
            borderRadius: '50%',
            filter: 'blur(3px)',
          }}
          animate={{
            height: [0, 25, 0],
            opacity: [0, 0.5, 0],
            x: [0, -4 + i * 2, 4 - i * 2, 0],
            y: [0, -10, -25],
          }}
          transition={{ duration: 4, repeat: Infinity, delay: delay + 1 + i * 0.4, ease: 'easeOut' }}
        />
      ))}
    </motion.div>
  );
}

export default function IncensePage() {
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

  const [targets, setTargets] = useState<TargetItem[]>(DEFAULT_TARGETS);
  const [target, setTarget] = useState('');
  const [offered, setOffered] = useState(false);
  const [records, setRecords] = useState<Array<{ content: string; target: string; created_at: string }>>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    setTargets(loadTargets());
  }, []);

  const selectedTarget = targets.find(t => t.key === target);

  const handleOffer = async () => {
    if (!target) return;
    try {
      await fetch('/api/prayer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'incense', content: lang === 'zh' ? `上香·${selectedTarget?.zh}` : `Incense·${selectedTarget?.en}`, target }),
      });
    } catch { /* not logged in */ }
    setOffered(true);
    setTimeout(() => {
      setOffered(false);
      setTarget('');
    }, 6000);
  };

  const loadHistory = async () => {
    try {
      const res = await fetch('/api/prayer?type=incense');
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
        <IncenseSmoke size={60} color={c.goldSolid} opacity={0.07} />
    </div>
      <div className="absolute pointer-events-none" style={{ bottom: '10%', left: '8%', zIndex: 0 }}>
        <DharmaWheel size={70} color={c.goldSolid} opacity={0.06} />
    </div>
      <div className="absolute pointer-events-none" style={{ bottom: '12%', right: '8%', zIndex: 0 }}>
        <SeedSyllable size={45} color={c.goldSolid} opacity={0.08} syllable="香" />
    </div>
      <NavigationBar />
      <div className="max-w-2xl mx-auto px-4 pt-20 pb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2" style={{ color: c.goldSolid }}>
            {lang === 'zh' ? '上香' : 'Offer Incense'}
          </h1>
          <p className="text-sm" style={{ color: c.textMuted }}>
            {lang === 'zh' ? '三支清香，戒定慧香，虔诚供养' : 'Three incense sticks: Precept, Samadhi, Wisdom'}
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {offered ? (
            <motion.div
              key="offered"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center py-8"
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              >
                <DeityImage
                  src={selectedTarget?.img ?? ''}
                  name={lang === 'zh' ? selectedTarget?.zh ?? '' : selectedTarget?.en ?? ''}
                  width={135}
                  goldColor={c.goldSolid}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center mt-4 mb-6"
              >
                <p className="text-lg font-medium" style={{ color: c.goldSolid }}>
                  {lang === 'zh' ? selectedTarget?.zh : selectedTarget?.en}
                </p>
              </motion.div>

              <div className="flex gap-8 items-end">
                {[0, 1, 2].map(i => (
                  <IncenseStickAnimated key={i} delay={i * 0.3} color={c.goldSolid} />
                ))}
    </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                className="mt-8 text-center"
              >
                <motion.p
                  className="text-lg"
                  style={{ color: c.goldSolid }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2 }}
                >
                  {lang === 'zh' ? '香已上达' : 'Incense has been offered'}
                </motion.p>
                <div className="mt-4 space-y-1">
                  {THREE_INCENSE_MEANING.map((m, i) => (
                    <motion.p
                      key={i}
                      className="text-sm text-center"
                      style={{ color: c.textMuted }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 2.5 + i * 0.3 }}
                    >
                      {lang === 'zh' ? `${m.zh}：${m.desc.zh}` : `${m.en}: ${m.desc.en}`}
                    </motion.p>
                  ))}
    </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              <CustomTargetGrid
                storageKey={STORAGE_KEY}
                defaultItems={DEFAULT_TARGETS}
                selectedKey={target}
                onSelect={setTarget}
                label={lang === 'zh' ? '供养对象' : 'Offer To'}
                c={c}
                lang={lang}
                columns={3}
                showImage
              />

              <AnimatePresence>
                {target && selectedTarget?.img && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex flex-col items-center py-6"
                    style={{ background: c.cardBg, borderRadius: 16, border: `1px solid ${c.border}` }}
                  >
                    <DeityImage
                      src={selectedTarget.img}
                      name={lang === 'zh' ? selectedTarget.zh : selectedTarget.en}
                      width={120}
                      goldColor={c.goldSolid}
                    />
                    <p className="mt-4 text-sm font-medium" style={{ color: c.goldSolid }}>
                      {lang === 'zh' ? selectedTarget.zh : selectedTarget.en}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="rounded-xl p-4" style={{ background: c.cardBg, border: `1px solid ${c.border}` }}>
                <p className="text-sm text-center" style={{ color: c.textMuted }}>
                  {lang === 'zh' ? '三支香代表戒、定、慧三学' : 'Three sticks represent Precept, Samadhi, Wisdom'}
                </p>
                <div className="grid grid-cols-3 gap-2 mt-3">
                  {THREE_INCENSE_MEANING.map((m, i) => (
                    <div key={i} className="text-center text-xs" style={{ color: c.textFaint }}>
                      <div style={{ color: c.goldSolid }}>{lang === 'zh' ? m.zh : m.en}</div>
                      <div className="mt-1">{lang === 'zh' ? m.desc.zh : m.desc.en}</div>
    </div>
                  ))}
    </div>
    </div>

              <div className="flex justify-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleOffer}
                  disabled={!target}
                  className="px-8 py-2.5 rounded-xl font-medium"
                  style={{ background: target ? c.goldSolid : c.border, color: '#1a1a2e' }}
                >
                  {lang === 'zh' ? '虔诚上香' : 'Offer Incense'}
                </motion.button>
                {user && (
                  <button
                    onClick={loadHistory}
                    className="px-4 py-2.5 rounded-xl text-sm"
                    style={{ background: c.cardBg, border: `1px solid ${c.border}`, color: c.textMuted }}
                  >
                    {lang === 'zh' ? '上香记录' : 'History'}
                  </button>
                )}
    </div>

              {showHistory && records.length > 0 && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-2">
                  <h3 className="text-sm font-medium" style={{ color: c.goldSolid }}>
                    {lang === 'zh' ? '上香记录' : 'Incense History'}
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