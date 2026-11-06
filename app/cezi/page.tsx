'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '@/lib/i18n/LanguageContext';
import { useTheme } from '@/components/ThemeProvider';
import NavigationBar from '@/components/NavigationBar';
import SiteFooter from '@/components/SiteFooter';
import { useAuth } from '@/lib/auth/AuthContext';

import { interpretCharacter, FIVE_ELEMENT_ATTR } from '@/lib/cezi';
import AiDivine from '@/components/AiDivine';
import type { CeziResult, FiveElement } from '@/lib/cezi';
import dynamic from 'next/dynamic';

const CeziFrame = dynamic(() => import('@/components/DivinationDecorations').then(m => m.CeziFrame), { ssr: false });
const FiveElementMiniCycle = dynamic(() => import('@/components/DivinationDecorations').then(m => m.FiveElementMiniCycle), { ssr: false });
const StrokeAnimation = dynamic(() => import('@/components/DivinationDecorations').then(m => m.StrokeAnimation), { ssr: false });
const CeziPageDemo = dynamic(() => import('@/components/PageDemoAnimations').then(m => m.CeziPageDemo), { ssr: false });
import { QuestionSelector, buildPersonalContext, type QuestionTopic } from '@/components/PersonalParams';

const FORTUNE_LEVEL_EN: Record<string, string> = {
  '大吉': 'Great Fortune',
  '吉': 'Fortune',
  '中吉': 'Moderate Fortune',
  '平': 'Neutral',
  '小凶': 'Minor Misfortune',
  '凶': 'Misfortune',
};

const STRUCTURE_EN: Record<string, string> = {
  '独体': 'Single Body',
  '左右': 'Left-Right',
  '上下': 'Top-Bottom',
  '左中右': 'Left-Center-Right',
  '上中下': 'Top-Center-Bottom',
  '半包围': 'Semi-Enclosed',
  '全包围': 'Fully Enclosed',
  '品字': 'Tripartite',
};

const ELEMENT_EN: Record<string, string> = {
  '金': 'Metal',
  '木': 'Wood',
  '水': 'Water',
  '火': 'Fire',
  '土': 'Earth',
};

const EXAMPLE_CHARS = ['命', '财', '福', '吉', '运', '缘', '安', '康'];

export default function CeziPage() {
  const { lang } = useLang();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { user } = useAuth();

  const [input, setInput] = useState('');
  const [result, setResult] = useState<CeziResult | null>(null);
  const [error, setError] = useState('');
  const [animateStrokes, setAnimateStrokes] = useState(false);
  const [questionTopic, setQuestionTopic] = useState<QuestionTopic>('');

  const handleSubmit = () => {
    if (!input.trim()) {
      setError(lang === 'zh' ? '请输入一个汉字' : 'Please enter a Chinese character');
      setResult(null);
      return;
    }
    const char = input.trim()[0];
    if (char.charCodeAt(0) < 0x4e00 || char.charCodeAt(0) > 0x9fff) {
      setError(lang === 'zh' ? '请输入汉字（不支持其他字符）' : 'Please enter a Chinese character');
      setResult(null);
      return;
    }
    setError('');
    setAnimateStrokes(false);
    setTimeout(() => setAnimateStrokes(true), 100);

    const r = interpretCharacter(char);
    setResult(r);
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
    starBorder: isDark ? 'rgba(212,168,67,0.22)' : 'rgba(160,120,30,0.3)',
    accent: isDark ? '#3a78d4' : '#3a5a82',
  };

  const elementColor = (el: FiveElement) => FIVE_ELEMENT_ATTR[el]?.color ?? c.goldSolid;

  return (
    <div style={{ background: c.bgBase, minHeight: '100vh' }} className="overflow-x-hidden">
      <NavigationBar />
      <div className="max-w-3xl mx-auto px-6 pt-20 pb-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}>
          <div className="text-center mb-10 relative">
            <div className="absolute left-1/2 -translate-x-1/2 -top-4 pointer-events-none">
              <CeziFrame color={c.goldSolid} size={100} />
    </div>
            <div className="text-[11px] tracking-[0.45em] mb-4" style={{ color: c.tagText }}>
              {lang === 'zh' ? '一字一命 · 见微知著' : 'One Character, One Destiny'}
    </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4"
              style={{ color: c.goldSolid, letterSpacing: '0.05em' }}>
              {lang === 'zh' ? '测字解字' : 'Character Divination'}
            </h1>
            <p className="text-sm leading-relaxed max-w-lg mx-auto" style={{ color: c.textSecond }}>
              {lang === 'zh'
                ? '输入一个汉字，从偏旁部首、五行属性、笔画数理、字形结构四个维度解读命运玄机。'
                : 'Enter a Chinese character. We interpret its destiny through radical, Five Elements, stroke numerology, and character structure.'}
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

          <div className="flex gap-3 mb-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              maxLength={1}
              placeholder={lang === 'zh' ? '输入一个汉字' : 'Enter a Chinese character'}
              className="flex-1 px-4 py-3 rounded-xl text-center text-2xl"
              style={{
                background: c.cardBg,
                border: `1px solid ${c.cardBorder}`,
                color: c.textPrimary,
                outline: 'none',
              }}
            />
            <motion.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={handleSubmit}
              className="px-6 py-3 rounded-xl font-medium text-sm tracking-widest"
              style={{ background: c.goldSolid, color: isDark ? '#08080a' : '#f8f3e8' }}>
              {lang === 'zh' ? '测字' : 'Divine'}
            </motion.button>
    </div>

          {/* 示例字快捷按钮 */}
          {!result && (
            <div className="flex justify-center gap-2 mb-6 flex-wrap">
              {EXAMPLE_CHARS.map(ch => (
                <motion.button key={ch}
                  whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                  onClick={() => { setInput(ch); }}
                  className="text-lg w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{
                    background: c.cardBg,
                    border: `1px solid ${c.cardBorder}`,
                    color: c.goldSolid,
                    fontFamily: 'serif',
                  }}>
                  {ch}
                </motion.button>
              ))}
    </div>
          )}

          {error && (
            <p className="text-center text-sm mb-6" style={{ color: '#f87171' }}>{error}</p>
          )}

          <AnimatePresence mode="wait">
            {result && (
              <motion.div key={result.character}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="space-y-4">

                {/* 主卡片：笔画动画 + 大字 + 属性标签 */}
                <div className="rounded-2xl p-8 text-center"
                  style={{ background: c.cardBg, border: `1px solid ${c.cardBorder}`, boxShadow: c.cardShadow }}>
                  {/* 笔画书写动画 */}
                  <div className="flex justify-center mb-4">
                    {animateStrokes ? (
                      <StrokeAnimation char={result.character} color={c.goldSolid} size={120} />
                    ) : (
                      <div className="text-7xl font-bold" style={{ color: c.goldSolid, fontFamily: 'serif' }}>
                        {result.character}
    </div>
                    )}
    </div>
                  {/* 大字展示 */}
                  <div className="text-7xl font-bold mb-4" style={{ color: c.goldSolid, fontFamily: 'serif' }}>
                    {result.character}
    </div>
                  {/* 属性标签 */}
                  <div className="flex justify-center gap-3 flex-wrap mb-4">
                    <span className="text-xs px-3 py-1 rounded-full"
                      style={{ background: `${elementColor(result.element)}20`, border: `1px solid ${elementColor(result.element)}40`, color: elementColor(result.element) }}>
                      {lang === 'zh' ? `五行 · ${result.element}` : `Element · ${ELEMENT_EN[result.element]}`}
                    </span>
                    <span className="text-xs px-3 py-1 rounded-full"
                      style={{ border: `1px solid ${c.goldLine}`, color: c.tagText }}>
                      {lang === 'zh' ? `部首 · ${result.radical}` : `Radical · ${result.radical}`}
                    </span>
                    <span className="text-xs px-3 py-1 rounded-full"
                      style={{ border: `1px solid ${c.goldLine}`, color: c.tagText }}>
                      {lang === 'zh' ? `${result.strokeCount}画` : `${result.strokeCount} strokes`}
                    </span>
                    <span className="text-xs px-3 py-1 rounded-full"
                      style={{ border: `1px solid ${c.goldLine}`, color: c.tagText }}>
                      {lang === 'zh' ? result.structure : STRUCTURE_EN[result.structure]}
                    </span>
    </div>
                  <div className="text-lg font-semibold mb-2" style={{ color: c.goldSolid }}>
                    {lang === 'zh' ? result.fortuneLevel : FORTUNE_LEVEL_EN[result.fortuneLevel]}
    </div>
    </div>

                {/* 五行关系图 + 字义解读 并排 */}
                <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-4 items-center">
                  {/* 五行相生相克小环图 */}
                  <div className="rounded-2xl p-4 flex flex-col items-center justify-center"
                    style={{ background: c.cardBg, border: `1px solid ${c.cardBorder}` }}>
                    <div className="text-[10px] mb-2" style={{ color: c.tagText }}>
                      {lang === 'zh' ? '五行生克' : 'Five Elements'}
    </div>
                    <FiveElementMiniCycle color={c.goldSolid} highlight={result.element} size={140} />
    </div>

                  {/* 字义解读 */}
                  <div className="rounded-2xl p-6"
                    style={{ background: c.cardBg, border: `1px solid ${c.cardBorder}` }}>
                    <h3 className="text-sm font-semibold mb-3" style={{ color: c.goldSolid }}>
                      {lang === 'zh' ? '字义解读' : 'Interpretation'}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: c.textSecond }}>
                      {result.interpretation}
                    </p>
    </div>
    </div>

                {/* 行事建议 */}
                <div className="rounded-2xl p-6"
                  style={{ background: c.cardBg, border: `1px solid ${c.cardBorder}` }}>
                  <h3 className="text-sm font-semibold mb-3" style={{ color: c.goldSolid }}>
                    {lang === 'zh' ? '行事建议' : 'Advice'}
                  </h3>
                  <div className="space-y-2">
                    {result.advice.map((a, i) => (
                      <motion.div key={i}
                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + i * 0.1 }}
                        className="flex gap-3">
                        <div className="flex-shrink-0 mt-2 w-1 h-1 rounded-full" style={{ background: c.goldSolid, opacity: 0.6 }} />
                        <p className="text-sm leading-relaxed" style={{ color: c.textMuted }}>{a}</p>
                      </motion.div>
                    ))}
    </div>
    </div>

                <AiDivine
                  tool="cezi"
                  context={`汉字: ${result.character}\n五行: ${result.element}\n部首: ${result.radical}\n笔画: ${result.strokeCount}\n字形结构: ${result.structure}\n运势等级: ${result.fortuneLevel}\n字义解读: ${result.interpretation}\n建议: ${result.advice.join('; ')}${buildPersonalContext(user, questionTopic, lang) ? '\n' + buildPersonalContext(user, questionTopic, lang) : ''}`}
                  goldSolid={c.goldSolid}
                  goldLine={c.goldLine}
                  cardBg={c.cardBg}
                  cardBorder={c.cardBorder}
                  textPrimary={c.textPrimary}
                  textSecond={c.textSecond}
                  textMuted={c.textMuted}
                  isDark={isDark}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {!result && !error && (
            <CeziPageDemo c={c} lang={lang} />
          )}
        </motion.div>
    </div>
      <SiteFooter />
    </div>
  );
}