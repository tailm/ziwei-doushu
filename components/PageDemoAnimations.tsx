'use client';
import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { SignTube, CoinSvg, TrigramSymbol, YaoLine, FiveElementMiniCycle } from '@/components/DivinationDecorations';

type PageColors = {
  goldSolid: string; goldLine: string; textPrimary: string; textSecond: string;
  textMuted: string; textFaint: string; cardBg: string; cardBorder: string;
  starBg: string; tagText: string;
};

// ─── 测字页面演示动画 ───
export function CeziPageDemo({ c, lang }: { c: PageColors; lang: 'zh' | 'en' }) {
  const [strokeStep, setStrokeStep] = useState(0);
  const [showTags, setShowTags] = useState(false);
  const [showCycle, setShowCycle] = useState(false);
  const [showInterp, setShowInterp] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: false });

  useEffect(() => {
    if (!inView) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 1; i <= 8; i++) {
      timers.push(setTimeout(() => setStrokeStep(i), 400 + i * 350));
    }
    timers.push(setTimeout(() => setShowTags(true), 3400));
    timers.push(setTimeout(() => setShowCycle(true), 3800));
    timers.push(setTimeout(() => setShowInterp(true), 4400));
    const reset = setTimeout(() => {
      setStrokeStep(0); setShowTags(false); setShowCycle(false); setShowInterp(false);
    }, 8000);
    timers.push(reset);
    return () => timers.forEach(clearTimeout);
  }, [inView]);

  const strokes = [
    { d: 'M18 10 L18 22', step: 1 },
    { d: 'M18 10 L26 10', step: 2 },
    { d: 'M26 10 L26 22', step: 3 },
    { d: 'M18 16 L26 16', step: 4 },
    { d: 'M14 26 L30 26', step: 5 },
    { d: 'M14 26 L14 38', step: 6 },
    { d: 'M30 26 L30 38', step: 7 },
    { d: 'M14 38 L30 38', step: 8 },
  ];

  const tags = [
    { label: lang === 'zh' ? '五行 · 水' : 'Element · Water', color: '#60a5fa' },
    { label: lang === 'zh' ? '部首 · 人' : 'Radical · Person', color: c.goldSolid },
    { label: lang === 'zh' ? '8画' : '8 strokes', color: c.goldSolid },
    { label: lang === 'zh' ? '上下' : 'Top-Bottom', color: c.goldSolid },
  ];

  return (
    <div ref={ref} className="flex flex-col items-center gap-6 py-4">
      {/* 方框 + 笔画书写 */}
      <div className="relative">
        <svg width="120" height="100" viewBox="0 0 44 48" style={{ opacity: 0.95 }}>
          <rect x="4" y="2" width="36" height="44" rx="4" fill="none" stroke={c.goldSolid} strokeWidth="1.5" opacity="0.25" />
          <rect x="8" y="6" width="28" height="36" rx="2" fill="none" stroke={c.goldSolid} strokeWidth="0.6" opacity="0.15" />
          {strokes.map((s, i) => (
            <motion.path key={i} d={s.d} fill="none" stroke={c.goldSolid} strokeWidth="2.5" strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={strokeStep >= s.step ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
              transition={{ duration: 0.3 }} />
          ))}
        </svg>
        {/* 角标装饰 */}
        <div className="absolute -top-1 -left-1 w-3 h-3 border-t border-l" style={{ borderColor: c.goldSolid, opacity: 0.4 }} />
        <div className="absolute -top-1 -right-1 w-3 h-3 border-t border-r" style={{ borderColor: c.goldSolid, opacity: 0.4 }} />
        <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b border-l" style={{ borderColor: c.goldSolid, opacity: 0.4 }} />
        <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b border-r" style={{ borderColor: c.goldSolid, opacity: 0.4 }} />
      </div>

      {/* 属性标签 */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={showTags ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={{ duration: 0.4 }}
        className="flex justify-center gap-2 flex-wrap">
        {tags.map((tag, i) => (
          <motion.span key={i}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={showTags ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ delay: i * 0.1 }}
            className="text-xs px-3 py-1 rounded-full"
            style={{ background: `${tag.color}15`, border: `1px solid ${tag.color}40`, color: tag.color }}>
            {tag.label}
          </motion.span>
        ))}
      </motion.div>

      {/* 五行环图 + 解读卡片 并排 */}
      <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-4 items-center max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={showCycle ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.7 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center">
          <div className="text-[10px] mb-1" style={{ color: c.tagText }}>
            {lang === 'zh' ? '五行生克' : 'Five Elements'}
          </div>
          <FiveElementMiniCycle color={c.goldSolid} highlight="水" size={120} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={showInterp ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
          transition={{ duration: 0.4 }}
          className="rounded-2xl p-4"
          style={{ background: c.cardBg, border: `1px solid ${c.cardBorder}` }}>
          <h3 className="text-xs font-semibold mb-2" style={{ color: c.goldSolid }}>
            {lang === 'zh' ? '字义解读' : 'Interpretation'}
          </h3>
          <p className="text-xs leading-relaxed" style={{ color: c.textSecond }}>
            {lang === 'zh'
              ? '「命」字从口从令，口为言语，令为号令，合则为主宰之意。五行属水，水主智，命带水者聪慧灵动。'
              : 'The character "Ming" combines mouth and command, meaning to govern. Its Water element signifies wisdom and adaptability.'}
          </p>
        </motion.div>
      </div>
    </div>
  );
}

// ─── 抽签页面演示动画 ───
export function ChouqianPageDemo({ c, lang }: { c: PageColors; lang: 'zh' | 'en' }) {
  const [shake, setShake] = useState(false);
  const [popOut, setPopOut] = useState(false);
  const [unfurl, setUnfurl] = useState(false);
  const [showPoem, setShowPoem] = useState(false);
  const [showLevel, setShowLevel] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: false });

  useEffect(() => {
    if (!inView) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => setShake(true), 300));
    timers.push(setTimeout(() => setShake(false), 2000));
    timers.push(setTimeout(() => setPopOut(true), 2400));
    timers.push(setTimeout(() => setUnfurl(true), 3000));
    timers.push(setTimeout(() => setShowPoem(true), 3600));
    timers.push(setTimeout(() => setShowLevel(true), 4500));
    const reset = setTimeout(() => {
      setShake(false); setPopOut(false); setUnfurl(false); setShowPoem(false); setShowLevel(false);
    }, 8000);
    timers.push(reset);
    return () => timers.forEach(clearTimeout);
  }, [inView]);

  const poemLines = lang === 'zh'
    ? ['日出扶桑万万里', '祥云瑞气满乾坤', '行人问事皆如意', '祸散灾消福自臻']
    : ['Sun rises from the east', 'Auspicious clouds fill the sky', 'All endeavors prosper', 'Misfortune fades, fortune comes'];

  return (
    <div ref={ref} className="flex flex-col items-center gap-6 py-4">
      {/* 签筒 + 弹出签条 */}
      <div className="relative" style={{ width: 120, height: 100 }}>
        <motion.div
          animate={shake ? { rotate: [-4, 4, -4, 4, -2, 2, 0] } : { rotate: 0 }}
          transition={{ duration: 0.8, repeat: shake ? Infinity : 0 }}
          style={{ position: 'absolute', left: 30, top: 0 }}>
          <SignTube color={c.goldSolid} size={60} shaking={false} />
        </motion.div>
        {/* 弹出的签条 */}
        <motion.div
          initial={{ x: 0, y: 0, opacity: 0, rotate: 0 }}
          animate={popOut ? { x: 40, y: -15, opacity: 1, rotate: 12 } : { x: 0, y: 0, opacity: 0, rotate: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{ position: 'absolute', left: 30, top: 0 }}>
          <svg width="14" height="70" viewBox="0 0 14 70">
            <rect x="2" y="0" width="10" height="66" rx="2" fill={`${c.goldSolid}30`} stroke={c.goldSolid} strokeWidth="1" />
            <rect x="2" y="0" width="10" height="8" rx="2" fill={`${c.goldSolid}50`} />
            <text x="7" y="40" fontSize="6" fill={c.goldSolid} textAnchor="middle" fontFamily="serif" opacity="0.5">签</text>
          </svg>
        </motion.div>
      </div>

      {/* 签纸卷轴展开 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={unfurl ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-sm w-full">
        <motion.div
          initial={{ scaleY: 0, opacity: 0 }}
          animate={unfurl ? { scaleY: 1, opacity: 1 } : { scaleY: 0, opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{ transformOrigin: 'top', background: c.cardBg, border: `1px solid ${c.goldLine}` }}
          className="rounded-2xl p-6 text-center relative overflow-hidden">
          {/* 卷轴顶部装饰 */}
          <div className="absolute top-0 left-0 right-0 h-2"
            style={{ background: `linear-gradient(to right, transparent, ${c.goldSolid}40, transparent)` }} />
          {/* 卷轴左右端轴 */}
          <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-16 rounded-full"
            style={{ background: `${c.goldSolid}30` }} />
          <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-16 rounded-full"
            style={{ background: `${c.goldSolid}30` }} />

          {/* 签号 */}
          <div className="text-[11px] tracking-[0.3em] mb-2" style={{ color: c.tagText }}>
            {lang === 'zh' ? '第 28 签' : 'Sign No. 28'}
          </div>

          {/* 签诗 */}
          <div className="py-3 px-4">
            {poemLines.map((line, i) => (
              <motion.p key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={showPoem ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                transition={{ delay: i * 0.2 }}
                className="text-sm leading-loose tracking-wider" style={{ color: c.textPrimary, fontFamily: 'serif' }}>
                {line}
              </motion.p>
            ))}
          </div>

          {/* 签等级 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={showLevel ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.4 }}
            className="flex items-center justify-center gap-2 pt-2">
            <div className="h-px w-10" style={{ background: `${c.goldSolid}40` }} />
            <span className="text-xs font-medium" style={{ color: c.goldSolid }}>
              {lang === 'zh' ? '上上签' : 'Supreme Fortune'}
            </span>
            <div className="h-px w-10" style={{ background: `${c.goldSolid}40` }} />
          </motion.div>

          {/* 卷轴底部装饰 */}
          <div className="absolute bottom-0 left-0 right-0 h-2"
            style={{ background: `linear-gradient(to right, transparent, ${c.goldSolid}40, transparent)` }} />
        </motion.div>
      </motion.div>
    </div>
  );
}

// ─── 铜钱卦页面演示动画 ───
export function TongqianPageDemo({ c, lang }: { c: PageColors; lang: 'zh' | 'en' }) {
  const [coinFlip, setCoinFlip] = useState([false, false, false]);
  const [coinResult, setCoinResult] = useState(['yang', 'yin', 'yang'] as ('yang' | 'yin')[]);
  const [showYao, setShowYao] = useState(0);
  const [showGua, setShowGua] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: false });

  useEffect(() => {
    if (!inView) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => setCoinFlip([true, false, false]), 300));
    timers.push(setTimeout(() => setCoinFlip([true, true, false]), 600));
    timers.push(setTimeout(() => setCoinFlip([true, true, true]), 900));
    timers.push(setTimeout(() => setCoinResult(['yang', 'yin', 'yang']), 1300));
    for (let i = 1; i <= 6; i++) {
      timers.push(setTimeout(() => setShowYao(i), 1600 + i * 300));
    }
    timers.push(setTimeout(() => setShowGua(true), 3600));
    const reset = setTimeout(() => {
      setCoinFlip([false, false, false]);
      setCoinResult(['yang', 'yin', 'yang']);
      setShowYao(0); setShowGua(false);
    }, 8000);
    timers.push(reset);
    return () => timers.forEach(clearTimeout);
  }, [inView]);

  const yaoLines = [
    { isYang: true, label: lang === 'zh' ? '初爻' : 'Line 1' },
    { isYang: false, label: lang === 'zh' ? '二爻' : 'Line 2' },
    { isYang: true, label: lang === 'zh' ? '三爻' : 'Line 3' },
    { isYang: true, label: lang === 'zh' ? '四爻' : 'Line 4' },
    { isYang: false, label: lang === 'zh' ? '五爻' : 'Line 5' },
    { isYang: true, label: lang === 'zh' ? '上爻' : 'Line 6' },
  ];

  return (
    <div ref={ref} className="flex flex-col items-center gap-6 py-4">
      {/* 三枚铜钱翻转 */}
      <div className="flex gap-4">
        {[0, 1, 2].map(i => (
          <motion.div key={i}
            animate={coinFlip[i] ? { rotateY: [0, 360, 360], y: [0, -20, 0] } : { rotateY: 0, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{ perspective: 100 }}>
            <CoinSvg color={c.goldSolid} size={40} face={coinResult[i]} />
          </motion.div>
        ))}
      </div>

      {/* 六爻排列 + 卦名 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={showYao > 0 ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-2xl p-5 max-w-sm w-full"
        style={{ background: c.cardBg, border: `1px solid ${c.cardBorder}` }}>
        {/* 六爻 */}
        <div className="space-y-2 mb-4">
          {yaoLines.map((yao, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, x: -15 }}
              animate={showYao > i ? { opacity: 1, x: 0 } : { opacity: 0, x: -15 }}
              transition={{ duration: 0.25 }}
              className="flex items-center gap-3 justify-center">
              <span className="text-[10px] w-12 text-right" style={{ color: c.textFaint }}>{yao.label}</span>
              <YaoLine isYang={yao.isYang} isChanging={false}
                color={c.textPrimary} changingColor={c.goldSolid} width={160} />
            </motion.div>
          ))}
        </div>

        {/* 卦名 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={showGua ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-center gap-3 rounded-xl py-3"
          style={{ background: `${c.goldSolid}08`, border: `1px solid ${c.goldLine}` }}>
          <TrigramSymbol trigram="☰" color={c.goldSolid} size={28} />
          <span className="text-lg font-bold" style={{ color: c.goldSolid, fontFamily: 'serif' }}>
            {lang === 'zh' ? '天火同人卦' : 'Fellowship Hexagram'}
          </span>
          <TrigramSymbol trigram="☲" color={c.goldSolid} size={28} />
        </motion.div>

        {/* 卦辞简述 */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={showGua ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.3 }}
          className="text-xs leading-relaxed text-center mt-3" style={{ color: c.textMuted }}>
          {lang === 'zh'
            ? '同人于野，亨。利涉大川，利君子贞。'
            : 'Fellowship in the wild. Success. Favorable to cross great waters.'}
        </motion.p>
      </motion.div>
    </div>
  );
}