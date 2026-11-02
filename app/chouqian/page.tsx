'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '@/lib/i18n/LanguageContext';
import { useTheme } from '@/components/ThemeProvider';
import NavigationBar from '@/components/NavigationBar';

import { getRandomSign, SIGN_LEVEL_COLOR } from '@/lib/chouqian';
import AiDivine from '@/components/AiDivine';
import type { SignResult, SignFortuneLevel } from '@/lib/chouqian';

const SIGN_LEVEL_EN: Record<string, string> = {
  '上上签': 'Supreme Fortune',
  '上签': 'Excellent Fortune',
  '中签': 'Moderate Fortune',
  '下签': 'Minor Misfortune',
  '下下签': 'Misfortune',
};

export default function ChouqianPage() {
  const { lang } = useLang();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [sign, setSign] = useState<SignResult | null>(null);
  const [drawing, setDrawing] = useState(false);

  const handleDraw = () => {
    setDrawing(true);
    setSign(null);
    setTimeout(() => {
      setSign(getRandomSign());
      setDrawing(false);
    }, 1500);
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

  const levelColor = (level: SignFortuneLevel) => SIGN_LEVEL_COLOR[level] ?? c.goldSolid;

  return (
    <div style={{ background: c.bgBase, minHeight: '100vh' }} className="overflow-x-hidden">
      <NavigationBar />
      <div className="max-w-3xl mx-auto px-6 pt-20 pb-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}>
          <div className="text-center mb-10">
            <div className="text-[11px] tracking-[0.45em] mb-4" style={{ color: c.tagText }}>
              {lang === 'zh' ? '观音灵签 · 百签解运' : 'Guanyin Oracle · 100 Signs'}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4"
              style={{ color: c.goldSolid, letterSpacing: '0.05em' }}>
              {lang === 'zh' ? '抽签解签' : 'Draw a Sign'}
            </h1>
            <p className="text-sm leading-relaxed max-w-lg mx-auto" style={{ color: c.textSecond }}>
              {lang === 'zh'
                ? '诚心默念所问之事，点击抽签，观音灵签将为你指引方向。'
                : 'Focus on your question, then draw a sign. The Guanyin Oracle will guide your path.'}
            </p>
          </div>

          <div className="text-center mb-8">

            <motion.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={handleDraw}
              disabled={drawing}
              className="px-12 py-4 font-semibold text-base tracking-widest rounded-full"
              style={{
                background: drawing ? 'rgba(140,100,20,0.3)' : c.ctaBg,
                color: drawing ? c.textFaint : c.ctaText,
                cursor: drawing ? 'not-allowed' : 'pointer',
              }}>
              {drawing
                ? (lang === 'zh' ? '抽签中…' : 'Drawing…')
                : (lang === 'zh' ? '诚心抽签' : 'Draw a Sign')}
            </motion.button>
          </div>

          <AnimatePresence mode="wait">
            {drawing && (
              <motion.div key="drawing"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="text-center py-16">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                  className="inline-block text-5xl mb-4" style={{ color: c.goldSolid }}>
                  ☯
                </motion.div>
                <p className="text-sm" style={{ color: c.textMuted }}>
                  {lang === 'zh' ? '天机正在显现…' : 'The oracle is revealing…'}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {sign && !drawing && (
              <motion.div key={sign.number}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-4">
                <div className="rounded-2xl p-8 text-center"
                  style={{ background: c.cardBg, border: `1px solid ${levelColor(sign.level)}40`, boxShadow: c.cardShadow }}>
                  <div className="text-[11px] tracking-[0.3em] mb-2" style={{ color: c.tagText }}>
                    {lang === 'zh' ? `第 ${sign.number} 签` : `Sign No. ${sign.number}`}
                  </div>
                  <div className="text-2xl font-semibold mb-3" style={{ color: levelColor(sign.level) }}>
                    {sign.title}
                  </div>
                  <div className="text-lg font-bold mb-4" style={{ color: levelColor(sign.level) }}>
                    {lang === 'zh' ? sign.level : SIGN_LEVEL_EN[sign.level]}
                  </div>
                  <div className="py-4 px-6 rounded-xl" style={{ background: c.starBg, border: `1px solid ${c.cardBorder}` }}>
                    {sign.poem.map((line, i) => (
                      <motion.p key={i}
                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + i * 0.15 }}
                        className="text-base leading-loose tracking-wider" style={{ color: c.textPrimary, fontFamily: 'serif' }}>
                        {line}
                      </motion.p>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl p-6"
                  style={{ background: c.cardBg, border: `1px solid ${c.cardBorder}` }}>
                  <h3 className="text-sm font-semibold mb-3" style={{ color: c.goldSolid }}>
                    {lang === 'zh' ? '解签' : 'Interpretation'}
                  </h3>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: c.textSecond }}>
                    {sign.interpretation}
                  </p>
                  <h3 className="text-sm font-semibold mb-2" style={{ color: c.goldSolid }}>
                    {lang === 'zh' ? '典故' : 'Story'}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: c.textMuted }}>
                    {sign.story}
                  </p>
                </div>

                <div className="rounded-2xl p-6"
                  style={{ background: c.cardBg, border: `1px solid ${c.cardBorder}` }}>
                  <h3 className="text-sm font-semibold mb-3" style={{ color: c.goldSolid }}>
                    {lang === 'zh' ? '指引' : 'Guidance'}
                  </h3>
                  <div className="space-y-2">
                    {sign.advice.map((a, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="flex-shrink-0 mt-2 w-1 h-1 rounded-full" style={{ background: c.goldSolid, opacity: 0.6 }} />
                        <p className="text-sm leading-relaxed" style={{ color: c.textMuted }}>{a}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <AiDivine
                  tool="chouqian"
                  context={`签号: 第${sign.number}签\n签题: ${sign.title}\n等级: ${sign.level}\n签诗: ${sign.poem.join('\n')}\n解签: ${sign.interpretation}\n典故: ${sign.story}\n指引: ${sign.advice.join('; ')}`}
                  goldSolid={c.goldSolid}
                  goldLine={c.goldLine}
                  cardBg={c.cardBg}
                  cardBorder={c.cardBorder}
                  textPrimary={c.textPrimary}
                  textSecond={c.textSecond}
                  textMuted={c.textMuted}
                  isDark={isDark}
                />

                <div className="text-center pt-4">
                  <motion.button
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={handleDraw}
                    className="px-8 py-3 font-medium text-sm tracking-widest rounded-full"
                    style={{ border: `1px solid ${c.goldLine}`, color: c.goldSolid, background: 'transparent' }}>
                    {lang === 'zh' ? '再抽一签' : 'Draw Again'}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!sign && !drawing && (
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