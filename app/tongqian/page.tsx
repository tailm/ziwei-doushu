'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '@/lib/i18n/LanguageContext';
import { useTheme } from '@/components/ThemeProvider';
import NavigationBar from '@/components/NavigationBar';

import { divine } from '@/lib/tongqian';
import AiDivine from '@/components/AiDivine';
import type { DivinationResult, LineType } from '@/lib/tongqian';

const FORTUNE_LEVEL_EN: Record<string, string> = {
  '大吉': 'Great Fortune',
  '吉': 'Fortune',
  '中吉': 'Moderate Fortune',
  '平': 'Neutral',
  '小凶': 'Minor Misfortune',
  '凶': 'Misfortune',
};

const LINE_SYMBOLS: Record<LineType, string> = {
  'yang': '━━━━━━━',
  'yin': '━━━ ━━━',
  'old_yang': '━━━○━━━',
  'old_yin': '━━━×━━━',
};

const LINE_LABELS_ZH: Record<LineType, string> = {
  'yang': '少阳',
  'yin': '少阴',
  'old_yang': '老阳（变）',
  'old_yin': '老阴（变）',
};

const LINE_LABELS_EN: Record<LineType, string> = {
  'yang': 'Young Yang',
  'yin': 'Young Yin',
  'old_yang': 'Old Yang (changing)',
  'old_yin': 'Old Yin (changing)',
};

const POSITION_NAMES_ZH = ['初爻', '二爻', '三爻', '四爻', '五爻', '上爻'];
const POSITION_NAMES_EN = ['Line 1', 'Line 2', 'Line 3', 'Line 4', 'Line 5', 'Line 6'];

export default function TongqianPage() {
  const { lang } = useLang();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [result, setResult] = useState<DivinationResult | null>(null);
  const [divining, setDivining] = useState(false);
  const [currentThrow, setCurrentThrow] = useState<number>(-1);

  const handleDivine = () => {
    setDivining(true);
    setResult(null);
    setCurrentThrow(-1);

    let step = 0;
    const interval = setInterval(() => {
      step++;
      setCurrentThrow(step - 1);
      if (step >= 6) {
        clearInterval(interval);
        const r = divine();
        setResult(r);
        setDivining(false);
        setCurrentThrow(-1);
      }
    }, 400);
  };

  const c = {
    bgBase: isDark ? '#020810' : '#f5efe0',
    goldSolid: isDark ? '#d4a843' : '#8b6410',
    goldLine: isDark ? 'rgba(212,168,67,0.4)' : 'rgba(140,100,20,0.4)',
    textPrimary: isDark ? '#e8eef6' : '#1a1d24',
    textSecond: isDark ? '#b8c6df' : '#3a3f4a',
    textMuted: isDark ? '#9db0d0' : '#5a6275',
    textFaint: isDark ? 'rgba(240,246,255,0.56)' : '#9da4b3',
    cardBg: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.88)',
    cardBorder: isDark ? 'rgba(255,255,255,0.10)' : 'rgba(200,160,60,0.25)',
    cardShadow: isDark ? '0 4px 32px rgba(0,0,0,0.5)' : '0 4px 24px rgba(140,100,20,0.12)',
    tagText: isDark ? 'rgba(212,168,67,0.6)' : 'rgba(120,80,10,0.65)',
    starBg: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.7)',
    ctaBg: isDark ? 'linear-gradient(135deg,#b8892a,#f0d070,#b8892a)'
      : 'linear-gradient(135deg,#6a4206,#9a6810,#6a4206)',
    ctaText: isDark ? '#08080a' : '#f8f3e8',
  };

  const fortuneColor = (level: string) => {
    const map: Record<string, string> = {
      '大吉': '#d4a843', '吉': '#4ade80', '中吉': '#60a5fa',
      '平': '#9ca3af', '小凶': '#f87171', '凶': '#dc2626',
    };
    return map[level] ?? c.goldSolid;
  };

  return (
    <div style={{ background: c.bgBase, minHeight: '100vh' }} className="overflow-x-hidden">
      <NavigationBar />
      <div className="max-w-3xl mx-auto px-6 pt-20 pb-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}>
          <div className="text-center mb-10">
            <div className="text-[11px] tracking-[0.45em] mb-4" style={{ color: c.tagText }}>
              {lang === 'zh' ? '六爻占卜 · 铜钱起卦' : 'Six-Line Divination · Coin Oracle'}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4"
              style={{ color: c.goldSolid, letterSpacing: '0.05em' }}>
              {lang === 'zh' ? '铜钱起卦' : 'Coin Divination'}
            </h1>
            <p className="text-sm leading-relaxed max-w-lg mx-auto" style={{ color: c.textSecond }}>
              {lang === 'zh'
                ? '诚心默念所问之事，投掷三枚铜钱六次，得六爻卦象，以易经智慧解读吉凶。'
                : 'Focus on your question, then toss three coins six times to form a hexagram. The I Ching reveals your fortune.'}
            </p>
          </div>

          <div className="text-center mb-8">

            <motion.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={handleDivine}
              disabled={divining}
              className="px-12 py-4 font-semibold text-base tracking-widest rounded-full"
              style={{
                background: divining ? 'rgba(140,100,20,0.3)' : c.ctaBg,
                color: divining ? c.textFaint : c.ctaText,
                cursor: divining ? 'not-allowed' : 'pointer',
              }}>
              {divining
                ? (lang === 'zh' ? '投掷铜钱中…' : 'Tossing coins…')
                : (lang === 'zh' ? '诚心起卦' : 'Cast Hexagram')}
            </motion.button>
          </div>

          <AnimatePresence mode="wait">
            {divining && (
              <motion.div key="divining"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="py-8">
                <div className="space-y-3">
                  {Array.from({ length: 6 }).map((_, i) => {
                    const isCurrent = i === currentThrow;
                    const isDone = i < currentThrow;
                    return (
                      <motion.div key={i}
                        initial={{ opacity: 0.3 }}
                        animate={{ opacity: isCurrent ? 1 : isDone ? 0.8 : 0.3 }}
                        className="flex items-center justify-center gap-4 py-2">
                        <span className="text-xs w-16" style={{ color: c.textFaint }}>
                          {lang === 'zh' ? POSITION_NAMES_ZH[i] : POSITION_NAMES_EN[i]}
                        </span>
                        {isCurrent && (
                          <motion.div
                            animate={{ rotate: [0, 360] }}
                            transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                            className="text-2xl" style={{ color: c.goldSolid }}>
                            ◯
                          </motion.div>
                        )}
                        {isDone && result && result.throws[i] && (
                          <span className="text-lg font-mono" style={{ color: c.goldSolid }}>
                            {LINE_SYMBOLS[result.throws[i].lineType]}
                          </span>
                        )}
                        {!isCurrent && !isDone && (
                          <span className="text-lg" style={{ color: c.textFaint }}>— — —</span>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {result && !divining && (
              <motion.div key="result"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-4">
                <div className="rounded-2xl p-8 text-center"
                  style={{ background: c.cardBg, border: `1px solid ${fortuneColor(result.originalHexagram.fortuneLevel)}40`, boxShadow: c.cardShadow }}>
                  <div className="text-[11px] tracking-[0.3em] mb-2" style={{ color: c.tagText }}>
                    {lang === 'zh' ? `第 ${result.originalHexagram.number} 卦` : `Hexagram No. ${result.originalHexagram.number}`}
                  </div>
                  <div className="text-3xl font-bold mb-3" style={{ color: c.goldSolid }}>
                    {result.originalHexagram.chineseName}卦
                  </div>
                  <div className="text-lg font-semibold mb-4" style={{ color: fortuneColor(result.originalHexagram.fortuneLevel) }}>
                    {lang === 'zh' ? result.originalHexagram.fortuneLevel : FORTUNE_LEVEL_EN[result.originalHexagram.fortuneLevel]}
                  </div>
                  <div className="py-4 px-6 rounded-xl mb-4" style={{ background: c.starBg, border: `1px solid ${c.cardBorder}` }}>
                    {result.originalHexagram.lines.slice().reverse().map((line, i) => {
                      const originalIndex = 5 - i;
                      const isChanging = result.originalHexagram.changingLines.includes(originalIndex);
                      return (
                        <motion.div key={i}
                          initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 + i * 0.08 }}
                          className="flex items-center justify-center gap-3 py-1">
                          <span className="text-[10px] w-12 text-right" style={{ color: c.textFaint }}>
                            {lang === 'zh' ? POSITION_NAMES_ZH[originalIndex] : POSITION_NAMES_EN[originalIndex]}
                          </span>
                          <span className="text-lg font-mono tracking-wider" style={{
                            color: isChanging ? fortuneColor(result.originalHexagram.fortuneLevel) : c.textPrimary,
                            fontWeight: isChanging ? 700 : 400,
                          }}>
                            {LINE_SYMBOLS[line]}
                          </span>
                          {isChanging && (
                            <span className="text-[10px]" style={{ color: fortuneColor(result.originalHexagram.fortuneLevel) }}>
                              {lang === 'zh' ? '变' : 'chg'}
                            </span>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: c.textSecond }}>
                    {result.originalHexagram.judgment}
                  </p>
                </div>

                {result.changedHexagram && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="rounded-2xl p-6 text-center"
                    style={{ background: c.cardBg, border: `1px solid ${fortuneColor(result.changedHexagram.fortuneLevel)}40` }}>
                    <div className="text-[11px] tracking-[0.3em] mb-2" style={{ color: c.tagText }}>
                      {lang === 'zh' ? '变卦' : 'Changed Hexagram'}
                    </div>
                    <div className="text-2xl font-bold mb-2" style={{ color: c.goldSolid }}>
                      {result.changedHexagram.chineseName}卦
                    </div>
                    <div className="text-sm font-semibold mb-3" style={{ color: fortuneColor(result.changedHexagram.fortuneLevel) }}>
                      {lang === 'zh' ? result.changedHexagram.fortuneLevel : FORTUNE_LEVEL_EN[result.changedHexagram.fortuneLevel]}
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: c.textSecond }}>
                      {result.changedHexagram.judgment}
                    </p>
                  </motion.div>
                )}

                <div className="rounded-2xl p-6"
                  style={{ background: c.cardBg, border: `1px solid ${c.cardBorder}` }}>
                  <h3 className="text-sm font-semibold mb-3" style={{ color: c.goldSolid }}>
                    {lang === 'zh' ? '综合解读' : 'Interpretation'}
                  </h3>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: c.textSecond }}>
                    {result.interpretation}
                  </p>
                </div>

                <div className="rounded-2xl p-6"
                  style={{ background: c.cardBg, border: `1px solid ${c.cardBorder}` }}>
                  <h3 className="text-sm font-semibold mb-3" style={{ color: c.goldSolid }}>
                    {lang === 'zh' ? '行事指引' : 'Guidance'}
                  </h3>
                  <div className="space-y-2">
                    {result.originalHexagram.advice.map((a, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="flex-shrink-0 mt-2 w-1 h-1 rounded-full" style={{ background: c.goldSolid, opacity: 0.6 }} />
                        <p className="text-sm leading-relaxed" style={{ color: c.textMuted }}>{a}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <AiDivine
                  tool="tongqian"
                  context={`本卦: 第${result.originalHexagram.number}卦 ${result.originalHexagram.chineseName}卦\n运势: ${result.originalHexagram.fortuneLevel}\n卦辞: ${result.originalHexagram.judgment}\n变爻: ${result.originalHexagram.changingLines.length > 0 ? result.originalHexagram.changingLines.join(', ') : '无'}\n${result.changedHexagram ? `变卦: 第${result.changedHexagram.number}卦 ${result.changedHexagram.chineseName}卦\n变卦运势: ${result.changedHexagram.fortuneLevel}\n变卦卦辞: ${result.changedHexagram.judgment}` : ''}\n综合解读: ${result.interpretation}\n指引: ${result.originalHexagram.advice.join('; ')}`}
                  goldSolid={c.goldSolid}
                  goldLine={c.goldLine}
                  cardBg={c.cardBg}
                  cardBorder={c.cardBorder}
                  textPrimary={c.textPrimary}
                  textSecond={c.textSecond}
                  textMuted={c.textMuted}
                  isDark={isDark}
                />

                <div className="rounded-2xl p-4"
                  style={{ background: c.cardBg, border: `1px solid ${c.cardBorder}` }}>
                  <h3 className="text-xs font-semibold mb-3" style={{ color: c.goldSolid }}>
                    {lang === 'zh' ? '投掷记录' : 'Throw Record'}
                  </h3>
                  <div className="grid grid-cols-6 gap-2">
                    {result.throws.map((th, i) => (
                      <div key={i} className="text-center">
                        <div className="text-[9px] mb-1" style={{ color: c.textFaint }}>
                          {lang === 'zh' ? POSITION_NAMES_ZH[i].replace('爻', '') : `L${i + 1}`}
                        </div>
                        <div className="flex justify-center gap-0.5 mb-1">
                          {th.coins.map((coin, ci) => (
                            <span key={ci} className="text-xs" style={{ color: coin ? c.goldSolid : c.textMuted }}>
                              {coin ? '●' : '○'}
                            </span>
                          ))}
                        </div>
                        <div className="text-[10px]" style={{ color: c.textMuted }}>
                          {lang === 'zh' ? LINE_LABELS_ZH[th.lineType] : LINE_LABELS_EN[th.lineType]}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-center pt-4">
                  <motion.button
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={handleDivine}
                    className="px-8 py-3 font-medium text-sm tracking-widest rounded-full"
                    style={{ border: `1px solid ${c.goldLine}`, color: c.goldSolid, background: 'transparent' }}>
                    {lang === 'zh' ? '再起一卦' : 'Cast Again'}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!result && !divining && (
            <div className="text-center py-12">
              <p className="text-sm" style={{ color: c.textFaint }}>
                {lang === 'zh' ? '心诚则灵 · 静心默念所问之事' : 'Sincerity brings clarity · Focus on your question'}
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}