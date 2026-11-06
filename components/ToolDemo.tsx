'use client';
import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

type Colors = {
  textPrimary: string; textSecond: string; textMuted: string; textFaint: string;
  cardBg: string; cardBorder: string; featureBg: string;
};

// ─── 1. 每日运势：太极旋转 → 天干地支浮现 → 星级逐颗点亮 ───
function DailyDemo({ accent, c, lang }: { accent: string; c: Colors; lang: 'zh' | 'en' }) {
  const [stars, setStars] = useState([0, 0, 0]);
  const [showCard, setShowCard] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: false });

  useEffect(() => {
    if (!inView) return;
    let step = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => { setShowCard(true); step = 1; }, 600));
    timers.push(setTimeout(() => { setStars([1, 0, 0]); }, 1400));
    timers.push(setTimeout(() => { setStars([2, 0, 0]); }, 1700));
    timers.push(setTimeout(() => { setStars([3, 0, 0]); }, 2000));
    timers.push(setTimeout(() => { setStars([3, 1, 0]); }, 2300));
    timers.push(setTimeout(() => { setStars([3, 2, 0]); }, 2600));
    timers.push(setTimeout(() => { setStars([3, 3, 0]); }, 2900));
    timers.push(setTimeout(() => { setStars([3, 3, 1]); }, 3200));
    timers.push(setTimeout(() => { setStars([3, 3, 2]); }, 3500));
    timers.push(setTimeout(() => { setStars([3, 3, 3]); }, 3800));
    timers.push(setTimeout(() => { setStars([4, 3, 4]); }, 4100));
    timers.push(setTimeout(() => { setStars([5, 3, 5]); }, 4400));
    const reset = setTimeout(() => {
      setShowCard(false); setStars([0, 0, 0]);
    }, 7000);
    timers.push(reset);
    return () => timers.forEach(clearTimeout);
  }, [inView]);

  return (
    <div ref={ref} className="flex flex-col items-center justify-center gap-5 w-full">
      <motion.svg width="56" height="56" viewBox="0 0 56 56"
        animate={inView ? { rotate: 360 } : {}}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}>
        <circle cx="28" cy="28" r="24" fill="none" stroke={accent} strokeWidth="1.5" />
        <circle cx="28" cy="28" r="16" fill="none" stroke={accent} strokeWidth="0.8" opacity="0.5" />
        <path d="M28 4 A24 24 0 0 1 28 52 A12 12 0 0 1 28 28 A12 12 0 0 0 28 4 Z" fill={accent} opacity="0.15" />
        <circle cx="28" cy="16" r="3" fill={accent} />
        <circle cx="28" cy="40" r="3" fill="none" stroke={accent} strokeWidth="1" />
      </motion.svg>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={showCard ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
        className="rounded-xl p-5 w-full max-w-[280px]"
        style={{ border: `1px solid ${accent}30`, background: `${accent}08` }}>
        <div className="text-center mb-3">
          <div className="text-2xl font-bold tracking-widest" style={{ color: accent, fontFamily: 'serif' }}>
            {lang === 'zh' ? '甲子日' : 'Jia-Zi Day'}
          </div>
          <div className="text-[10px] mt-1" style={{ color: c.textMuted }}>
            {lang === 'zh' ? '天干: 甲 · 地支: 子 · 五行: 木水' : 'Stem: Jia · Branch: Zi · Element: Wood-Water'}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-3">
          {[
            { label: lang === 'zh' ? '事业' : 'Career', target: 4 },
            { label: lang === 'zh' ? '财运' : 'Wealth', target: 3 },
            { label: lang === 'zh' ? '感情' : 'Love', target: 5 },
          ].map((item, i) => (
            <div key={i} className="text-center rounded-lg py-2" style={{ background: `${accent}10` }}>
              <div className="text-[10px]" style={{ color: c.textMuted }}>{item.label}</div>
              <div className="flex justify-center gap-0.5 mt-1">
                {Array.from({ length: 5 }).map((_, j) => (
                  <motion.div key={j} className="w-1 h-1 rounded-full"
                    animate={{
                      background: j < stars[i] ? accent : `${accent}20`,
                      scale: j < stars[i] ? 1.3 : 1,
                    }}
                    transition={{ duration: 0.2 }} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// ─── 2. 测字：方框出现 → "命"字逐笔书写 → 解析滑入 ───
function CeziDemo({ accent, c, lang }: { accent: string; c: Colors; lang: 'zh' | 'en' }) {
  const [strokeStep, setStrokeStep] = useState(0);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: false });

  useEffect(() => {
    if (!inView) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 1; i <= 8; i++) {
      timers.push(setTimeout(() => setStrokeStep(i), 400 + i * 350));
    }
    timers.push(setTimeout(() => setShowAnalysis(true), 3600));
    const reset = setTimeout(() => { setStrokeStep(0); setShowAnalysis(false); }, 7000);
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

  return (
    <div ref={ref} className="flex flex-col items-center justify-center gap-5 w-full">
      <svg width="80" height="60" viewBox="0 0 44 48" style={{ opacity: 0.9 }}>
        <rect x="6" y="4" width="32" height="40" rx="3" fill="none" stroke={accent} strokeWidth="1.2" opacity="0.3" />
        {strokes.map((s, i) => (
          <motion.path key={i} d={s.d} fill="none" stroke={accent} strokeWidth="2" strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={strokeStep >= s.step ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
            transition={{ duration: 0.3 }} />
        ))}
      </svg>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={showAnalysis ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
        transition={{ duration: 0.4 }}
        className="rounded-xl p-5 w-full max-w-[260px]"
        style={{ border: `1px solid ${accent}30`, background: `${accent}08` }}>
        <div className="text-center mb-3">
          <div className="text-4xl font-bold mb-2" style={{ color: accent, fontFamily: 'serif' }}>命</div>
          <div className="text-[10px]" style={{ color: c.textMuted }}>
            {lang === 'zh' ? '偏旁: 人 · 五行: 水 · 笔画: 8' : 'Radical: Person · Element: Water · Strokes: 8'}
          </div>
        </div>
        <div className="border-t pt-3" style={{ borderColor: `${accent}20` }}>
          <div className="text-[11px] leading-relaxed text-center" style={{ color: c.textSecond }}>
            {lang === 'zh' ? '「命」字从口从令，口为言语，令为号令，合则为主宰之意。' : 'The character "Ming" combines mouth and command, meaning to govern.'}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── 3. 抽签：签筒摇晃 → 签条弹出 → 签文展开 ───
function QianDemo({ accent, c, lang }: { accent: string; c: Colors; lang: 'zh' | 'en' }) {
  const [shake, setShake] = useState(false);
  const [popOut, setPopOut] = useState(false);
  const [showText, setShowText] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: false });

  useEffect(() => {
    if (!inView) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => setShake(true), 200));
    timers.push(setTimeout(() => setShake(false), 1800));
    timers.push(setTimeout(() => setPopOut(true), 2200));
    timers.push(setTimeout(() => setShowText(true), 3000));
    const reset = setTimeout(() => { setShake(false); setPopOut(false); setShowText(false); }, 7000);
    timers.push(reset);
    return () => timers.forEach(clearTimeout);
  }, [inView]);

  return (
    <div ref={ref} className="flex flex-col items-center justify-center gap-5 w-full">
      <div className="relative" style={{ width: 80, height: 60 }}>
        {/* 签筒 */}
        <motion.div
          animate={shake ? { rotate: [-3, 3, -3, 3, -2, 2, 0] } : { rotate: 0 }}
          transition={{ duration: 1.6, repeat: shake ? Infinity : 0 }}
          style={{ position: 'absolute', left: 10, top: 0 }}>
          <svg width="36" height="56" viewBox="0 0 36 56">
            <path d="M6 4 L30 4 L28 52 L8 52 Z" fill="none" stroke={accent} strokeWidth="1.5" />
            <path d="M6 4 L30 4" stroke={accent} strokeWidth="2" />
            <rect x="10" y="8" width="16" height="4" fill={accent} opacity="0.2" />
            <text x="18" y="30" fontSize="8" fill={accent} textAnchor="middle" fontFamily="serif" opacity="0.4">签</text>
          </svg>
        </motion.div>
        {/* 弹出的签条 */}
        <motion.div
          initial={{ x: 0, y: 0, opacity: 0, rotate: 0 }}
          animate={popOut ? { x: 30, y: -10, opacity: 1, rotate: 15 } : { x: 0, y: 0, opacity: 0, rotate: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{ position: 'absolute', left: 10, top: 0 }}>
          <svg width="10" height="50" viewBox="0 0 10 50">
            <rect x="1" y="0" width="8" height="48" rx="2" fill={accent} opacity="0.3" stroke={accent} strokeWidth="1" />
            <rect x="1" y="0" width="8" height="6" rx="2" fill={accent} opacity="0.5" />
          </svg>
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={showText ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.5 }}
        className="rounded-xl p-5 w-full max-w-[280px]"
        style={{ border: `1px solid ${accent}30`, background: `${accent}08` }}>
        <div className="text-center mb-3">
          <span className="text-xs px-3 py-1 rounded-full inline-block" style={{ background: `${accent}20`, color: accent }}>
            {lang === 'zh' ? '第28签' : 'Sign #28'}
          </span>
        </div>
        <div className="text-sm leading-relaxed text-center mb-3" style={{ color: c.textSecond, fontFamily: 'serif' }}>
          {lang === 'zh' ? '日出扶桑万万里\n祥云瑞气满乾坤' : 'Sun rises from the east\nAuspicious clouds fill the sky'}
        </div>
        <div className="flex items-center justify-center gap-2">
          <div className="h-px w-8" style={{ background: `${accent}40` }} />
          <span className="text-[10px]" style={{ color: accent }}>{lang === 'zh' ? '上吉签' : 'Excellent Sign'}</span>
          <div className="h-px w-8" style={{ background: `${accent}40` }} />
        </div>
      </motion.div>
    </div>
  );
}

// ─── 4. 铜钱卦：三枚铜钱翻转 → 落定显阴阳 → 六爻排列 → 卦名浮现 ───
function TongqianDemo({ accent, c, lang }: { accent: string; c: Colors; lang: 'zh' | 'en' }) {
  const [coinFlip, setCoinFlip] = useState([false, false, false]);
  const [coinResult, setCoinResult] = useState([0, 0, 0]);
  const [showYao, setShowYao] = useState(0);
  const [showGua, setShowGua] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: false });

  useEffect(() => {
    if (!inView) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => setCoinFlip([true, false, false]), 200));
    timers.push(setTimeout(() => setCoinFlip([true, true, false]), 500));
    timers.push(setTimeout(() => setCoinFlip([true, true, true]), 800));
    timers.push(setTimeout(() => { setCoinResult([1, 0, 1]); }, 1200));
    timers.push(setTimeout(() => setShowYao(1), 1600));
    timers.push(setTimeout(() => setShowYao(2), 1900));
    timers.push(setTimeout(() => setShowYao(3), 2200));
    timers.push(setTimeout(() => setShowYao(4), 2500));
    timers.push(setTimeout(() => setShowYao(5), 2800));
    timers.push(setTimeout(() => setShowYao(6), 3100));
    timers.push(setTimeout(() => setShowGua(true), 3600));
    const reset = setTimeout(() => {
      setCoinFlip([false, false, false]); setCoinResult([0, 0, 0]);
      setShowYao(0); setShowGua(false);
    }, 7000);
    timers.push(reset);
    return () => timers.forEach(clearTimeout);
  }, [inView]);

  const yaoLines = [
    { broken: false, label: lang === 'zh' ? '初爻' : '1st' },
    { broken: true, label: lang === 'zh' ? '二爻' : '2nd' },
    { broken: false, label: lang === 'zh' ? '三爻' : '3rd' },
    { broken: false, label: lang === 'zh' ? '四爻' : '4th' },
    { broken: true, label: lang === 'zh' ? '五爻' : '5th' },
    { broken: false, label: lang === 'zh' ? '上爻' : '6th' },
  ];

  return (
    <div ref={ref} className="flex flex-col items-center justify-center gap-5 w-full">
      {/* 三枚铜钱 */}
      <div className="flex gap-3">
        {[0, 1, 2].map(i => (
          <motion.div key={i}
            animate={coinFlip[i] ? { rotateY: [0, 360, 360], y: [0, -20, 0] } : { rotateY: 0, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{ perspective: 100 }}>
            <svg width="28" height="28" viewBox="0 0 28 28">
              <circle cx="14" cy="14" r="12" fill="none" stroke={accent} strokeWidth="1.5" />
              <rect x="9" y="9" width="10" height="10" fill="none" stroke={accent} strokeWidth="0.8" />
              {coinResult[i] === 1 && <circle cx="14" cy="14" r="3" fill={accent} opacity="0.4" />}
            </svg>
          </motion.div>
        ))}
      </div>
      {/* 六爻排列 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={showYao > 0 ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-xl p-5 w-full max-w-[280px]"
        style={{ border: `1px solid ${accent}30`, background: `${accent}08` }}>
        <div className="space-y-1.5 mb-3">
          {yaoLines.map((yao, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={showYao > i ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-between px-2.5 py-1 rounded-lg"
              style={{ background: `${accent}06` }}>
              <div className="flex gap-1">
                {yao.broken ? (
                  <>
                    <div className="w-3 h-1 rounded-sm" style={{ background: accent }} />
                    <div className="w-1 h-1" />
                    <div className="w-3 h-1 rounded-sm" style={{ background: accent }} />
                  </>
                ) : (
                  <div className="w-7 h-1 rounded-sm" style={{ background: accent }} />
                )}
              </div>
              <span className="text-[9px]" style={{ color: c.textMuted }}>{yao.label}</span>
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={showGua ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.4 }}
          className="rounded-lg px-3 py-2 text-center"
          style={{ border: `1px solid ${accent}30`, background: `${accent}10` }}>
          <span className="text-xs font-medium" style={{ color: accent }}>
            {lang === 'zh' ? '天火同人卦' : 'Hexagram: Fellowship'}
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
}

// ─── 5. 面相：人脸轮廓绘制 → 扫描线扫过 → 特征点高亮 → 结果出现 ───
function MianxiangDemo({ accent, c, lang }: { accent: string; c: Colors; lang: 'zh' | 'en' }) {
  const [drawProgress, setDrawProgress] = useState(0);
  const [scanY, setScanY] = useState(0);
  const [highlightStep, setHighlightStep] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: false });

  useEffect(() => {
    if (!inView) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 1; i <= 10; i++) {
      timers.push(setTimeout(() => setDrawProgress(i), 200 + i * 120));
    }
    timers.push(setTimeout(() => setScanY(1), 1600));
    timers.push(setTimeout(() => setHighlightStep(1), 2200));
    timers.push(setTimeout(() => setHighlightStep(2), 2600));
    timers.push(setTimeout(() => setHighlightStep(3), 3000));
    timers.push(setTimeout(() => setShowResult(true), 3500));
    const reset = setTimeout(() => {
      setDrawProgress(0); setScanY(0); setHighlightStep(0); setShowResult(false);
    }, 7000);
    timers.push(reset);
    return () => timers.forEach(clearTimeout);
  }, [inView]);

  return (
    <div ref={ref} className="flex flex-col items-center justify-center gap-5 w-full">
      <svg width="80" height="80" viewBox="0 0 64 64" style={{ opacity: 0.9 }}>
        {/* 人脸轮廓 */}
        <motion.ellipse cx="32" cy="36" rx="18" ry="24" fill="none" stroke={accent} strokeWidth="1.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: drawProgress / 10 }}
          transition={{ duration: 0.1 }} />
        <motion.ellipse cx="32" cy="20" rx="14" ry="10" fill="none" stroke={accent} strokeWidth="1" opacity="0.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: drawProgress >= 6 ? 1 : 0 }}
          transition={{ duration: 0.3 }} />
        {/* 扫描线 */}
        {scanY > 0 && (
          <motion.line x1="14" y1="14" x2="50" y2="14" stroke={accent} strokeWidth="0.5" strokeDasharray="2 1"
            initial={{ y1: 14, y2: 14 }}
            animate={{ y1: [14, 58, 14], y2: [14, 58, 14] }}
            transition={{ duration: 1.5, ease: 'easeInOut' }} />
        )}
        {/* 特征点 */}
        <motion.circle cx="24" cy="28" r="2.5" fill={accent}
          animate={{ opacity: highlightStep >= 1 ? 1 : 0.3, scale: highlightStep >= 1 ? 1.2 : 1 }}
          transition={{ duration: 0.3 }} />
        <motion.circle cx="40" cy="28" r="2.5" fill={accent}
          animate={{ opacity: highlightStep >= 1 ? 1 : 0.3, scale: highlightStep >= 1 ? 1.2 : 1 }}
          transition={{ duration: 0.3 }} />
        <motion.path d="M26 40 Q32 44 38 40" fill="none" stroke={accent} strokeWidth="1"
          animate={{ opacity: highlightStep >= 2 ? 1 : 0.3 }}
          transition={{ duration: 0.3 }} />
        <motion.line x1="32" y1="32" x2="32" y2="42" stroke={accent} strokeWidth="0.5"
          animate={{ opacity: highlightStep >= 3 ? 1 : 0.2 }}
          transition={{ duration: 0.3 }} />
      </svg>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={showResult ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
        transition={{ duration: 0.4 }}
        className="rounded-xl p-5 w-full max-w-[280px]"
        style={{ border: `1px solid ${accent}30`, background: `${accent}08` }}>
        <div className="text-center mb-3">
          <div className="text-xs font-medium mb-3" style={{ color: accent }}>
            {lang === 'zh' ? 'AI面相分析' : 'AI Face Analysis'}
          </div>
        </div>
        <div className="space-y-2">
          {[
            { label: lang === 'zh' ? '脸型' : 'Face Shape', value: lang === 'zh' ? '鹅蛋脸' : 'Oval' },
            { label: lang === 'zh' ? '眼睛' : 'Eyes', value: lang === 'zh' ? '凤眼' : 'Phoenix' },
            { label: lang === 'zh' ? '鼻子' : 'Nose', value: lang === 'zh' ? '挺直' : 'Straight' },
          ].map((item, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={highlightStep > i ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-between text-[11px] px-3 py-1.5 rounded-lg"
              style={{ background: `${accent}08` }}>
              <span style={{ color: c.textMuted }}>{item.label}</span>
              <span style={{ color: accent }}>{item.value}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// ─── 6. 手相：手掌轮廓绘制 → 三条掌纹逐一绘制 → 结果出现 ───
function ShouxiangDemo({ accent, c, lang }: { accent: string; c: Colors; lang: 'zh' | 'en' }) {
  const [drawPalm, setDrawPalm] = useState(0);
  const [drawLine, setDrawLine] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: false });

  useEffect(() => {
    if (!inView) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 1; i <= 8; i++) {
      timers.push(setTimeout(() => setDrawPalm(i), 200 + i * 120));
    }
    timers.push(setTimeout(() => setDrawLine(1), 1400));
    timers.push(setTimeout(() => setDrawLine(2), 1900));
    timers.push(setTimeout(() => setDrawLine(3), 2400));
    timers.push(setTimeout(() => setShowResult(true), 3000));
    const reset = setTimeout(() => {
      setDrawPalm(0); setDrawLine(0); setShowResult(false);
    }, 7000);
    timers.push(reset);
    return () => timers.forEach(clearTimeout);
  }, [inView]);

  return (
    <div ref={ref} className="flex flex-col items-center justify-center gap-5 w-full">
      <svg width="80" height="80" viewBox="0 0 64 64" style={{ opacity: 0.9 }}>
        {/* 手掌轮廓 */}
        <motion.path d="M20 60 L20 30 Q20 20 28 18 L36 18 Q44 20 44 30 L44 60"
          fill="none" stroke={accent} strokeWidth="1.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: drawPalm / 8 }}
          transition={{ duration: 0.1 }} />
        <motion.path d="M20 30 Q14 28 12 22 Q10 16 14 14 Q18 12 20 18"
          fill="none" stroke={accent} strokeWidth="1" opacity="0.6"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: drawPalm >= 5 ? 1 : 0 }}
          transition={{ duration: 0.3 }} />
        <motion.path d="M44 30 Q50 28 52 22 Q54 16 50 14 Q46 12 44 18"
          fill="none" stroke={accent} strokeWidth="1" opacity="0.6"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: drawPalm >= 6 ? 1 : 0 }}
          transition={{ duration: 0.3 }} />
        <motion.path d="M28 18 Q26 8 30 4 Q34 2 36 6 Q38 10 36 18"
          fill="none" stroke={accent} strokeWidth="1" opacity="0.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: drawPalm >= 7 ? 1 : 0 }}
          transition={{ duration: 0.3 }} />
        {/* 生命线 */}
        <motion.path d="M22 40 Q32 35 42 40" fill="none" stroke={accent} strokeWidth="1" strokeDasharray="2 1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: drawLine >= 1 ? 1 : 0 }}
          transition={{ duration: 0.5 }} />
        {/* 智慧线 */}
        <motion.path d="M24 48 Q32 44 40 48" fill="none" stroke={accent} strokeWidth="1" strokeDasharray="2 1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: drawLine >= 2 ? 1 : 0 }}
          transition={{ duration: 0.5 }} />
        {/* 感情线 */}
        <motion.path d="M26 55 Q32 52 38 55" fill="none" stroke={accent} strokeWidth="1" strokeDasharray="2 1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: drawLine >= 3 ? 1 : 0 }}
          transition={{ duration: 0.5 }} />
      </svg>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={showResult ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
        transition={{ duration: 0.4 }}
        className="rounded-xl p-5 w-full max-w-[280px]"
        style={{ border: `1px solid ${accent}30`, background: `${accent}08` }}>
        <div className="text-center mb-3">
          <div className="text-xs font-medium mb-3" style={{ color: accent }}>
            {lang === 'zh' ? 'AI手相分析' : 'AI Palm Analysis'}
          </div>
        </div>
        <div className="space-y-2">
          {[
            { label: lang === 'zh' ? '生命线' : 'Life Line', value: lang === 'zh' ? '深长' : 'Deep & Long' },
            { label: lang === 'zh' ? '智慧线' : 'Head Line', value: lang === 'zh' ? '清晰' : 'Clear' },
            { label: lang === 'zh' ? '感情线' : 'Heart Line', value: lang === 'zh' ? '上扬' : 'Upturned' },
          ].map((item, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={drawLine > i ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-between text-[11px] px-3 py-1.5 rounded-lg"
              style={{ background: `${accent}08` }}>
              <span style={{ color: c.textMuted }}>{item.label}</span>
              <span style={{ color: accent }}>{item.value}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// ─── 主组件 ───
export default function ToolDemo({ index, colors, accent, lang }: {
  index: number; colors: Colors; accent: string; lang: 'zh' | 'en';
}) {
  const demos = [
    DailyDemo, CeziDemo, QianDemo, TongqianDemo, MianxiangDemo, ShouxiangDemo,
  ];
  const Demo = demos[index];
  if (!Demo) return null;
  return <Demo accent={accent} c={colors} lang={lang} />;
}