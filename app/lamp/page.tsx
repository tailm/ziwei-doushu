'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '@/lib/i18n/LanguageContext';
import { useTheme } from '@/components/ThemeProvider';
import { useAuth } from '@/lib/auth/AuthContext';
import NavigationBar from '@/components/NavigationBar';
import SiteFooter from '@/components/SiteFooter';
import { SacredFlame, BuddhaHalo, SeedSyllable, AuspiciousCloud } from '@/components/SacredDecorations';
import dynamic from 'next/dynamic';

const LampFlame = dynamic(() => import('@/components/RitualDecorations').then(m => m.LampFlame), { ssr: false });
import { CustomTargetGrid, type TargetItem } from '@/components/CustomTargetGrid';

const DEFAULT_LAMP_TYPES: TargetItem[] = [
  { key: 'fortune', zh: '福灯', en: 'Fortune Lamp', desc: { zh: '祈福消灾，增添福报', en: 'Bless and increase fortune' } },
  { key: 'wisdom', zh: '慧灯', en: 'Wisdom Lamp', desc: { zh: '开启智慧，破除无明', en: 'Open wisdom, dispel ignorance' } },
  { key: 'peace', zh: '平安灯', en: 'Peace Lamp', desc: { zh: '祈求平安，远离灾厄', en: 'Pray for peace and safety' } },
  { key: 'health', zh: '健康灯', en: 'Health Lamp', desc: { zh: '消除病障，身心安康', en: 'Heal illness, body and mind well' } },
];

export default function LampPage() {
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

  const [lampType, setLampType] = useState('');
  const [target, setTarget] = useState('');
  const [content, setContent] = useState('');
  const [lit, setLit] = useState(false);
  const [lamps, setLamps] = useState<Array<{ content: string; deity: string; target: string; created_at: string }>>([]);
  const [showHistory, setShowHistory] = useState(false);

  const handleLight = async () => {
    if (!lampType) return;
    try {
      await fetch('/api/prayer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'lamp', content: content || (lang === 'zh' ? '点灯祈福' : 'Light a lamp'), deity: lampType, target }),
      });
    } catch { /* not logged in */ }
    setLit(true);
    setTimeout(() => {
      setLit(false);
      setContent('');
      setLampType('');
      setTarget('');
    }, 5000);
  };

  const loadHistory = async () => {
    try {
      const res = await fetch('/api/prayer?type=lamp');
      const data = await res.json();
      if (data.records) setLamps(data.records);
      setShowHistory(true);
    } catch { /* not logged in */ }
  };

  return (
    <div style={{ minHeight: '100vh', background: c.bg, color: c.text, position: 'relative', overflow: 'hidden' }}>
      {/* 庄严装饰背景 */}
      <div className="absolute pointer-events-none" style={{ top: '5%', left: '50%', transform: 'translateX(-50%)', zIndex: 0 }}>
        <BuddhaHalo size={250} color={c.goldSolid} opacity={0.05} />
    </div>
      <div className="absolute pointer-events-none" style={{ top: '10%', left: '5%', zIndex: 0 }}>
        <AuspiciousCloud size={130} color={c.goldSolid} opacity={0.06} />
    </div>
      <div className="absolute pointer-events-none" style={{ top: '15%', right: '5%', zIndex: 0 }}>
        <SacredFlame size={35} color={c.goldSolid} opacity={0.08} />
    </div>
      <div className="absolute pointer-events-none" style={{ bottom: '10%', left: '8%', zIndex: 0 }}>
        <SacredFlame size={30} color={c.goldSolid} opacity={0.06} />
    </div>
      <div className="absolute pointer-events-none" style={{ bottom: '12%', right: '8%', zIndex: 0 }}>
        <SeedSyllable size={45} color={c.goldSolid} opacity={0.08} syllable="明" />
    </div>
      <NavigationBar />
      <div className="max-w-2xl mx-auto px-4 pt-20 pb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2" style={{ color: c.goldSolid }}>
            {lang === 'zh' ? '长明灯' : 'Eternal Lamp'}
          </h1>
          <p className="text-sm" style={{ color: c.textMuted }}>
            {lang === 'zh' ? '点燃心灯，照亮前程，福慧双增' : 'Light the lamp of heart, illuminate the path'}
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {lit ? (
            <motion.div
              key="lit"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex flex-col items-center py-12"
            >
              <div className="flex gap-4">
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.3 }}
                  >
                    <LampFlame size={50} color={c.goldSolid} />
                  </motion.div>
                ))}
    </div>
              <motion.p className="mt-8 text-lg" style={{ color: c.goldSolid }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
                {lang === 'zh' ? '长明灯已点燃' : 'The eternal lamp has been lit'}
              </motion.p>
              <motion.p className="mt-2 text-sm" style={{ color: c.textMuted }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
                {lang === 'zh' ? '一灯能除千年暗，一智能灭万年愚' : 'One lamp dispels a thousand years of darkness'}
              </motion.p>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              <CustomTargetGrid
                storageKey="lamp_types"
                defaultItems={DEFAULT_LAMP_TYPES}
                selectedKey={lampType}
                onSelect={setLampType}
                label={lang === 'zh' ? '选择灯的类型' : 'Select Lamp Type'}
                c={c}
                lang={lang}
                columns={2}
                showDesc
              />

              <div>
                <label className="text-sm mb-2 block" style={{ color: c.textMuted }}>
                  {lang === 'zh' ? '为谁点灯' : 'Light For Whom'}
                </label>
                <input
                  value={target}
                  onChange={e => setTarget(e.target.value)}
                  placeholder={lang === 'zh' ? '输入姓名（可选）' : 'Enter name (optional)'}
                  className="w-full px-4 py-2.5 rounded-xl text-sm"
                  style={{ background: c.cardBg, border: `1px solid ${c.border}`, color: c.text }}
                />
    </div>

              <div>
                <label className="text-sm mb-2 block" style={{ color: c.textMuted }}>
                  {lang === 'zh' ? '祈愿内容（可选）' : 'Prayer (optional)'}
                </label>
                <textarea
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  rows={3}
                  placeholder={lang === 'zh' ? '输入您的祈愿...' : 'Enter your prayer...'}
                  className="w-full px-4 py-3 rounded-xl text-sm resize-none"
                  style={{ background: c.cardBg, border: `1px solid ${c.border}`, color: c.text }}
                />
    </div>

              <div className="flex justify-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleLight}
                  disabled={!lampType}
                  className="px-8 py-2.5 rounded-xl font-medium"
                  style={{ background: lampType ? c.goldSolid : c.border, color: '#1a1a2e' }}
                >
                  {lang === 'zh' ? '点灯' : 'Light Lamp'}
                </motion.button>
                {user && (
                  <button
                    onClick={loadHistory}
                    className="px-4 py-2.5 rounded-xl text-sm"
                    style={{ background: c.cardBg, border: `1px solid ${c.border}`, color: c.textMuted }}
                  >
                    {lang === 'zh' ? '点灯记录' : 'History'}
                  </button>
                )}
    </div>

              {showHistory && lamps.length > 0 && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-2">
                  <h3 className="text-sm font-medium" style={{ color: c.goldSolid }}>
                    {lang === 'zh' ? '点灯记录' : 'Lamp History'}
                  </h3>
                  {lamps.map((l, i) => (
                    <div key={i} className="p-3 rounded-lg text-sm" style={{ background: c.cardBg, border: `1px solid ${c.border}` }}>
                      <p style={{ color: c.text }}>{l.content}</p>
                      <p className="text-xs mt-1" style={{ color: c.textFaint }}>{l.created_at}</p>
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