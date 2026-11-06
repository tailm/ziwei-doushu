'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '@/lib/i18n/LanguageContext';
import { useTheme } from '@/components/ThemeProvider';
import NavigationBar from '@/components/NavigationBar';
import SiteFooter from '@/components/SiteFooter';
import { useAuth } from '@/lib/auth/AuthContext';

import { getRandomSign, SIGN_LEVEL_COLOR } from '@/lib/chouqian';
import AiDivine from '@/components/AiDivine';
import type { SignResult, SignFortuneLevel } from '@/lib/chouqian';
import dynamic from 'next/dynamic';

const SignTube = dynamic(() => import('@/components/DivinationDecorations').then(m => m.SignTube), { ssr: false });
const LotusDecoration = dynamic(() => import('@/components/DivinationDecorations').then(m => m.LotusDecoration), { ssr: false });
const ChouqianPageDemo = dynamic(() => import('@/components/PageDemoAnimations').then(m => m.ChouqianPageDemo), { ssr: false });
import { QuestionSelector, buildPersonalContext, type QuestionTopic } from '@/components/PersonalParams';

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
  const { user } = useAuth();

  const [sign, setSign] = useState<SignResult | null>(null);
  const [drawing, setDrawing] = useState(false);
  const [questionTopic, setQuestionTopic] = useState<QuestionTopic>('');

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
          <div className="text-center mb-10 relative">
            <div className="absolute left-1/2 -translate-x-1/2 top-0 pointer-events-none">
              <LotusDecoration color={c.goldSolid} size={80} opacity={0.06} />
    </div>
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

          {/* 个性化参数：求什么 */}
          <QuestionSelector
            value={questionTopic}
            onChange={setQuestionTopic}
            goldSolid={c.goldSolid}
            goldLine={c.goldLine}
            cardBg={c.cardBg}
            cardBorder={c.cardBorder}
            textMuted={c.textMuted}
            textFaint={c.textFaint}
          />

          {/* 未填写个人信息时提示 */}
          {user && !user.gender && !user.birth_date && !user.current_city && (
            <div className="text-[11px] mb-4 text-center" style={{ color: c.textFaint }}>
              <a href="/profile" style={{ color: c.goldSolid, textDecoration: 'underline' }}>
                {lang === 'zh' ? '点击填写个人信息，获取更精准的解读' : 'Click to fill in personal info for better insights'}
              </a>
    </div>
          )}

          {/* 签筒可视化 + 抽签按钮 */}
          <div className="flex flex-col items-center mb-8">
            <div className="mb-4">
              <SignTube color={c.goldSolid} size={70} shaking={drawing} />
    </div>
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
                className="text-center py-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                  className="inline-block mb-4">
                  <svg width="48" height="48" viewBox="0 0 48 48">
                    <circle cx="24" cy="24" r="20" fill="none" stroke={c.goldSolid} strokeWidth="1.5" />
                    <path d="M24 4 A20 20 0 0 1 24 44 A10 10 0 0 1 24 24 A10 10 0 0 0 24 4 Z" fill={c.goldSolid} opacity="0.2" />
                    <circle cx="24" cy="14" r="2.5" fill={c.goldSolid} />
                    <circle cx="24" cy="34" r="2.5" fill="none" stroke={c.goldSolid} strokeWidth="1" />
                  </svg>
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

                {/* 签纸卷轴效果 */}
                <div className="rounded-2xl p-8 text-center relative overflow-hidden"
                  style={{ background: c.cardBg, border: `1px solid ${levelColor(sign.level)}40`, boxShadow: c.cardShadow }}>
                  {/* 卷轴顶部装饰 */}
                  <div className="absolute top-0 left-0 right-0 h-2"
                    style={{ background: `linear-gradient(to right, transparent, ${levelColor(sign.level)}40, transparent)` }} />
                  {/* 签号 */}
                  <div className="text-[11px] tracking-[0.3em] mb-2" style={{ color: c.tagText }}>
                    {lang === 'zh' ? `第 ${sign.number} 签` : `Sign No. ${sign.number}`}
    </div>
                  <div className="text-2xl font-semibold mb-3" style={{ color: levelColor(sign.level) }}>
                    {sign.title}
    </div>
                  <div className="text-lg font-bold mb-4" style={{ color: levelColor(sign.level) }}>
                    {lang === 'zh' ? sign.level : SIGN_LEVEL_EN[sign.level]}
    </div>
                  {/* 签诗 - 卷轴展开效果 */}
                  <motion.div
                    initial={{ scaleY: 0, opacity: 0 }}
                    animate={{ scaleY: 1, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="py-4 px-6 rounded-xl relative"
                    style={{ background: c.starBg, border: `1px solid ${c.cardBorder}`, transformOrigin: 'top' }}>
                    {/* 卷轴左端 */}
                    <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-12 rounded-full"
                      style={{ background: `${levelColor(sign.level)}30` }} />
                    {/* 卷轴右端 */}
                    <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-12 rounded-full"
                      style={{ background: `${levelColor(sign.level)}30` }} />
                    {sign.poem.map((line, i) => (
                      <motion.p key={i}
                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + i * 0.15 }}
                        className="text-base leading-loose tracking-wider" style={{ color: c.textPrimary, fontFamily: 'serif' }}>
                        {line}
                      </motion.p>
                    ))}
                  </motion.div>
                  {/* 卷轴底部装饰 */}
                  <div className="absolute bottom-0 left-0 right-0 h-2"
                    style={{ background: `linear-gradient(to right, transparent, ${levelColor(sign.level)}40, transparent)` }} />
    </div>

                {/* 解签 + 典故 */}
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

                {/* 指引 */}
                <div className="rounded-2xl p-6"
                  style={{ background: c.cardBg, border: `1px solid ${c.cardBorder}` }}>
                  <h3 className="text-sm font-semibold mb-3" style={{ color: c.goldSolid }}>
                    {lang === 'zh' ? '指引' : 'Guidance'}
                  </h3>
                  <div className="space-y-2">
                    {sign.advice.map((a, i) => (
                      <motion.div key={i}
                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                        className="flex gap-3">
                        <div className="flex-shrink-0 mt-2 w-1 h-1 rounded-full" style={{ background: c.goldSolid, opacity: 0.6 }} />
                        <p className="text-sm leading-relaxed" style={{ color: c.textMuted }}>{a}</p>
                      </motion.div>
                    ))}
    </div>
    </div>

                <AiDivine
                  tool="chouqian"
                  context={`签号: 第${sign.number}签\n签题: ${sign.title}\n等级: ${sign.level}\n签诗: ${sign.poem.join('\n')}\n解签: ${sign.interpretation}\n典故: ${sign.story}\n指引: ${sign.advice.join('; ')}${buildPersonalContext(user, questionTopic, lang) ? '\n' + buildPersonalContext(user, questionTopic, lang) : ''}`}
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
            <ChouqianPageDemo c={c} lang={lang} />
          )}
        </motion.div>
    </div>
      <SiteFooter />
    </div>
  );
}