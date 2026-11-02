'use client';
import { useLayoutEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useInView } from 'framer-motion';
import StarField from '@/components/StarField';
import { useTheme, type Theme } from '@/components/ThemeProvider';
import AnnouncementModal from '@/components/AnnouncementModal';

import { useLang } from '@/lib/i18n/LanguageContext';
import { useAuth } from '@/lib/auth/AuthContext';
import { t, type TKey } from '@/lib/i18n/translations';
import { TaijiDiagram, StarConstellation, SpinningTaiji, FloatingStars, DiamondDivider } from '@/components/Decorations';
import NavigationBar from '@/components/NavigationBar';

// ─── 滚动入场 wrapper ────────────────────────────────────
function FadeIn({
  children, delay = 0, y = 28, className = '',
}: {
  children: React.ReactNode; delay?: number; y?: number; className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function WeakBoundary({ line }: { line: string }) {
  // 之前的版本有 1px 实线 + 12px 渐变阴影，主题切换时形成清晰横线很硬。
  // 改为更柔和的 24px 渐变 + 低 opacity，section 衔接更自然。
  return (
    <div className="absolute top-0 left-0 right-0 h-16 pointer-events-none"
      style={{ background: `linear-gradient(to bottom, ${line}, transparent)`, opacity: 0.45 }} />
  );
}


function useColors(theme: Theme) {
  const d = theme === 'dark';
  return {
    bgBase:       d ? '#020810'                                : '#f5efe0',
    navBg:        d ? '#020810'                                : '#f5efe0',
    navBorder:    d ? 'rgba(255,255,255,0.05)'                : 'rgba(160,120,30,0.15)',
    goldSolid:    d ? '#d4a843'                               : '#8b6410',
    goldLine:     d ? 'rgba(212,168,67,0.4)'                  : 'rgba(140,100,20,0.4)',
    tagText:      d ? 'rgba(212,168,67,0.6)'                  : 'rgba(120,80,10,0.65)',
    textPrimary:  d ? '#e8eef6'                               : '#1a1d24',
    textSecond:   d ? '#b8c6df'                               : '#3a3f4a',
    textMuted:    d ? '#9db0d0'                               : '#5a6275',
    textFaint:    d ? 'rgba(240,246,255,0.56)'                : '#9da4b3',
    accent:       d ? '#3a78d4'                               : '#3a5a82',
    accentSoft:   d ? 'rgba(58,120,212,0.18)'                 : 'rgba(58,90,130,0.10)',
    cardBg:       d ? 'rgba(255,255,255,0.05)'                : 'rgba(255,255,255,0.88)',
    cardBorder:   d ? 'rgba(255,255,255,0.10)'                : 'rgba(200,160,60,0.25)',
    cardShadow:   d ? '0 4px 32px rgba(0,0,0,0.5)'           : '0 4px 24px rgba(140,100,20,0.12)',
    featureBg:    d ? 'rgba(255,255,255,0.04)'                : 'rgba(255,255,255,0.75)',
    featureBord:  d ? 'rgba(255,255,255,0.08)'                : 'rgba(200,160,60,0.2)',
    glowTint:     d ? 'rgba(212,168,67,0.07)'                 : 'rgba(180,140,40,0.06)',
    glowBlue:     d ? 'rgba(40,80,160,0.12)'                  : 'rgba(58,90,130,0.06)',
    glowPurple:   d ? 'rgba(120,50,180,0.08)'                 : 'rgba(96,80,140,0.04)',
    niBg:         d ? 'rgba(255,255,255,0.04)'                : 'rgba(255,255,255,0.8)',
    niBorder:     d ? 'rgba(212,168,67,0.2)'                  : 'rgba(180,130,40,0.25)',
    niDivider:    d ? 'rgba(255,255,255,0.08)'                : 'rgba(180,130,40,0.12)',
    niCardBg:     d ? 'rgba(255,255,255,0.04)'                : 'rgba(255,255,255,0.9)',
    niCardBord:   d ? 'rgba(255,255,255,0.08)'                : 'rgba(200,160,60,0.2)',
    niCardShadow: d ? '0 2px 20px rgba(0,0,0,0.4)'           : '0 2px 16px rgba(140,100,20,0.1)',
    starBg:       d ? 'rgba(255,255,255,0.04)'                : 'rgba(255,255,255,0.7)',
    starBorder:   d ? 'rgba(212,168,67,0.22)'                 : 'rgba(160,120,30,0.3)',
    starText:     d ? 'rgba(212,168,67,0.7)'                  : 'rgba(120,80,10,0.7)',
    ctaBg:        d ? 'linear-gradient(135deg,#b8892a,#f0d070,#b8892a)'
                    : 'linear-gradient(135deg,#6a4206,#9a6810,#6a4206)',
    ctaText:      d ? '#08080a'                               : '#f8f3e8',
    footerText:   d ? 'rgba(255,255,255,0.08)'                : '#d0b878',
    scrollLine:   d ? 'rgba(212,168,67,0.3)'                  : 'rgba(140,100,20,0.3)',
    scrollText:   d ? 'rgba(255,255,255,0.12)'                : '#c0a870',
    altSection:   d ? 'rgba(255,255,255,0.02)'                : 'rgba(255,255,255,0.4)',
    quoteBg:      d ? 'rgba(212,168,67,0.04)'                 : 'rgba(255,255,255,0.9)',
  };
}

// ─── 命理工具视觉装饰 ────────────────────────────────────
function ToolVisual({ index, colors: c, accent, lang }: {
  index: number; colors: ReturnType<typeof useColors>; accent: string; icon: string; lang: 'zh' | 'en';
}) {

  if (index === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-5 w-full">
        <svg width="48" height="48" viewBox="0 0 48 48" style={{ opacity: 0.9 }}>
          <circle cx="24" cy="24" r="20" fill="none" stroke={accent} strokeWidth="1.5" />
          <circle cx="24" cy="24" r="14" fill="none" stroke={accent} strokeWidth="0.8" opacity="0.5" />
          <path d="M24 4 A20 20 0 0 1 24 44 A10 10 0 0 1 24 24 A10 10 0 0 0 24 4 Z" fill={accent} opacity="0.15" />
          <circle cx="24" cy="14" r="2.5" fill={accent} />
          <circle cx="24" cy="34" r="2.5" fill="none" stroke={accent} strokeWidth="1" />
        </svg>
        <div className="rounded-xl p-5 w-full max-w-[280px]" style={{ border: `1px solid ${accent}30`, background: `${accent}08` }}>
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
              { label: lang === 'zh' ? '事业' : 'Career', level: 4 },
              { label: lang === 'zh' ? '财运' : 'Wealth', level: 3 },
              { label: lang === 'zh' ? '感情' : 'Love', level: 5 },
            ].map((item, i) => (
              <div key={i} className="text-center rounded-lg py-2" style={{ background: `${accent}10` }}>
                <div className="text-[10px]" style={{ color: c.textMuted }}>{item.label}</div>
                <div className="flex justify-center gap-0.5 mt-1">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <div key={j} className="w-1 h-1 rounded-full"
                      style={{ background: j < item.level ? accent : `${accent}20` }} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (index === 1) {
    return (
      <div className="flex flex-col items-center justify-center gap-5 w-full">
        <svg width="56" height="56" viewBox="0 0 56 56" style={{ opacity: 0.9 }}>
          <rect x="8" y="8" width="40" height="40" rx="4" fill="none" stroke={accent} strokeWidth="1.5" />
          <rect x="12" y="12" width="32" height="32" rx="2" fill="none" stroke={accent} strokeWidth="0.5" opacity="0.4" />
          <path d="M20 18 L20 38 M28 14 L28 42 M36 18 L36 38" stroke={accent} strokeWidth="1" opacity="0.3" />
          <text x="28" y="34" fontSize="18" fill={accent} textAnchor="middle" fontFamily="serif" fontWeight="bold">命</text>
        </svg>
        <div className="rounded-xl p-5 w-full max-w-[260px]" style={{ border: `1px solid ${accent}30`, background: `${accent}08` }}>
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
        </div>
      </div>
    );
  }

  if (index === 2) {
    return (
      <div className="flex flex-col items-center justify-center gap-5 w-full">
        <svg width="56" height="56" viewBox="0 0 56 56" style={{ opacity: 0.9 }}>
          <rect x="16" y="4" width="6" height="48" rx="2" fill="none" stroke={accent} strokeWidth="1.5" />
          <rect x="26" y="8" width="6" height="44" rx="2" fill="none" stroke={accent} strokeWidth="1" opacity="0.6" />
          <rect x="36" y="2" width="6" height="50" rx="2" fill="none" stroke={accent} strokeWidth="1.2" opacity="0.8" />
          <rect x="16" y="4" width="6" height="8" rx="2" fill={accent} opacity="0.2" />
          <rect x="36" y="2" width="6" height="6" rx="2" fill={accent} opacity="0.15" />
        </svg>
        <div className="rounded-xl p-5 w-full max-w-[280px]" style={{ border: `1px solid ${accent}30`, background: `${accent}08` }}>
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
        </div>
      </div>
    );
  }

  if (index === 3) {
    return (
      <div className="flex flex-col items-center justify-center gap-5 w-full">
        <svg width="56" height="56" viewBox="0 0 56 56" style={{ opacity: 0.9 }}>
          {[0, 1, 2].map(i => (
            <g key={i} transform={`translate(${8 + i * 16} 8)`}>
              <circle cx="8" cy="8" r="7" fill="none" stroke={accent} strokeWidth="1.5" />
              <rect x="5" y="5" width="6" height="6" fill="none" stroke={accent} strokeWidth="0.8" />
              <circle cx="8" cy="8" r="2" fill={accent} opacity="0.3" />
            </g>
          ))}
        </svg>
        <div className="rounded-xl p-5 w-full max-w-[280px]" style={{ border: `1px solid ${accent}30`, background: `${accent}08` }}>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {['初爻', '二爻', '三爻', '四爻', '五爻', '上爻'].map((yao, i) => (
              <div key={i} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg"
                style={{ border: `1px solid ${accent}25`, background: `${accent}06` }}>
                <div className="flex gap-0.5">
                  {[0, 1, 2].map(j => (
                    <div key={j} className="w-2.5 h-0.5 rounded-sm"
                      style={{ background: (i + j) % 2 === 0 ? accent : `${accent}30` }} />
                  ))}
                </div>
                <span className="text-[10px]" style={{ color: c.textMuted }}>{yao}</span>
              </div>
            ))}
          </div>
          <div className="rounded-lg px-3 py-2 text-center" style={{ border: `1px solid ${accent}30`, background: `${accent}10` }}>
            <span className="text-xs font-medium" style={{ color: accent }}>
              {lang === 'zh' ? '天火同人卦' : 'Hexagram: Fellowship'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (index === 4) {
    return (
      <div className="flex flex-col items-center justify-center gap-5 w-full">
        <svg width="64" height="64" viewBox="0 0 64 64" style={{ opacity: 0.9 }}>
          <ellipse cx="32" cy="36" rx="18" ry="24" fill="none" stroke={accent} strokeWidth="1.5" />
          <ellipse cx="32" cy="20" rx="14" ry="10" fill="none" stroke={accent} strokeWidth="1" opacity="0.5" />
          <circle cx="24" cy="28" r="2" fill={accent} opacity="0.4" />
          <circle cx="40" cy="28" r="2" fill={accent} opacity="0.4" />
          <path d="M26 40 Q32 44 38 40" fill="none" stroke={accent} strokeWidth="0.8" opacity="0.4" />
          <line x1="32" y1="32" x2="32" y2="42" stroke={accent} strokeWidth="0.5" opacity="0.3" />
          <line x1="20" y1="36" x2="44" y2="36" stroke={accent} strokeWidth="0.3" opacity="0.2" strokeDasharray="1 2" />
        </svg>
        <div className="rounded-xl p-5 w-full max-w-[280px]" style={{ border: `1px solid ${accent}30`, background: `${accent}08` }}>
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
              <div key={i} className="flex items-center justify-between text-[11px] px-3 py-1.5 rounded-lg"
                style={{ background: `${accent}08` }}>
                <span style={{ color: c.textMuted }}>{item.label}</span>
                <span style={{ color: accent }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (index === 5) {
    return (
      <div className="flex flex-col items-center justify-center gap-5 w-full">
        <svg width="64" height="64" viewBox="0 0 64 64" style={{ opacity: 0.9 }}>
          <path d="M20 60 L20 30 Q20 20 28 18 L36 18 Q44 20 44 30 L44 60"
            fill="none" stroke={accent} strokeWidth="1.5" />
          <path d="M20 30 Q14 28 12 22 Q10 16 14 14 Q18 12 20 18"
            fill="none" stroke={accent} strokeWidth="1" opacity="0.6" />
          <path d="M44 30 Q50 28 52 22 Q54 16 50 14 Q46 12 44 18"
            fill="none" stroke={accent} strokeWidth="1" opacity="0.6" />
          <path d="M28 18 Q26 8 30 4 Q34 2 36 6 Q38 10 36 18"
            fill="none" stroke={accent} strokeWidth="1" opacity="0.5" />
          <path d="M22 40 Q32 35 42 40" fill="none" stroke={accent} strokeWidth="0.6" opacity="0.4" strokeDasharray="2 1" />
          <path d="M24 48 Q32 44 40 48" fill="none" stroke={accent} strokeWidth="0.6" opacity="0.4" strokeDasharray="2 1" />
          <path d="M26 55 Q32 52 38 55" fill="none" stroke={accent} strokeWidth="0.6" opacity="0.4" strokeDasharray="2 1" />
        </svg>
        <div className="rounded-xl p-5 w-full max-w-[280px]" style={{ border: `1px solid ${accent}30`, background: `${accent}08` }}>
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
              <div key={i} className="flex items-center justify-between text-[11px] px-3 py-1.5 rounded-lg"
                style={{ background: `${accent}08` }}>
                <span style={{ color: c.textMuted }}>{item.label}</span>
                <span style={{ color: accent }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
}

// ─── 命理工具展示数据 ──────────────────────────────────
const TOOLS = [
  {
    tagKey: 'home_tool_daily_tag' as TKey,
    titleKey: 'home_tool_daily_title' as TKey,
    descKey: 'home_tool_daily_desc' as TKey,
    pointKeys: ['home_tool_daily_p1', 'home_tool_daily_p2'] as TKey[],
    ctaKey: 'home_tool_daily_cta' as TKey,
    path: '/daily',
    icon: '',
    accent: '#f59e0b',
  },
  {
    tagKey: 'home_tool_cezi_tag' as TKey,
    titleKey: 'home_tool_cezi_title' as TKey,
    descKey: 'home_tool_cezi_desc' as TKey,
    pointKeys: ['home_tool_cezi_p1', 'home_tool_cezi_p2'] as TKey[],
    ctaKey: 'home_tool_cezi_cta' as TKey,
    path: '/cezi',
    icon: '',
    accent: '#3b82f6',
  },
  {
    tagKey: 'home_tool_chouqian_tag' as TKey,
    titleKey: 'home_tool_chouqian_title' as TKey,
    descKey: 'home_tool_chouqian_desc' as TKey,
    pointKeys: ['home_tool_chouqian_p1', 'home_tool_chouqian_p2'] as TKey[],
    ctaKey: 'home_tool_chouqian_cta' as TKey,
    path: '/chouqian',
    icon: '',
    accent: '#22c55e',
  },
  {
    tagKey: 'home_tool_tongqian_tag' as TKey,
    titleKey: 'home_tool_tongqian_title' as TKey,
    descKey: 'home_tool_tongqian_desc' as TKey,
    pointKeys: ['home_tool_tongqian_p1', 'home_tool_tongqian_p2'] as TKey[],
    ctaKey: 'home_tool_tongqian_cta' as TKey,
    path: '/tongqian',
    icon: '',
    accent: '#a855f7',
  },
  {
    tagKey: 'home_tool_mianxiang_tag' as TKey,
    titleKey: 'home_tool_mianxiang_title' as TKey,
    descKey: 'home_tool_mianxiang_desc' as TKey,
    pointKeys: ['home_tool_mianxiang_p1', 'home_tool_mianxiang_p2'] as TKey[],
    ctaKey: 'home_tool_mianxiang_cta' as TKey,
    path: '/mianxiang',
    icon: '',
    accent: '#ec4899',
  },
  {
    tagKey: 'home_tool_shouxiang_tag' as TKey,
    titleKey: 'home_tool_shouxiang_title' as TKey,
    descKey: 'home_tool_shouxiang_desc' as TKey,
    pointKeys: ['home_tool_shouxiang_p1', 'home_tool_shouxiang_p2'] as TKey[],
    ctaKey: 'home_tool_shouxiang_cta' as TKey,
    path: '/shouxiang',
    icon: '',
    accent: '#06b6d4',
  },
];


// ─── 主页 ─────────────────────────────────────────────────
export default function HomePage() {
  const router = useRouter();
  const { theme } = useTheme();
  const c = useColors(theme);
  const { lang } = useLang();
  const { user } = useAuth();

  const requireLogin = (path: string) => {
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent(path)}`);
      return;
    }
    router.push(path);
  };


  // 把 body / html 背景同步到 home 主题色，消除半透明 nav 透出 #fafaf9 的色差
  // useLayoutEffect 保证在浏览器绘制前同步更新，避免与根 div 的 transition 不同步
  useLayoutEffect(() => {
    document.documentElement.style.background = c.bgBase;
    document.body.style.background = c.bgBase;
    return () => {
      document.documentElement.style.background = '';
      document.body.style.background = '';
    };
  }, [c.bgBase]);

  return (
    <div style={{ background: c.bgBase, transition: 'background 0.35s ease' }} className="overflow-x-hidden">
      {/* 致用户公告——首次访问全屏覆盖，关闭后才进入首页 */}
      <AnnouncementModal />

      <StarField />

      {/* 全局光晕 */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full"
          style={{ background: `radial-gradient(ellipse, ${c.glowTint} 0%, transparent 70%)` }} />
        <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full"
          style={{ background: `radial-gradient(ellipse, ${c.glowBlue} 0%, transparent 70%)` }} />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full"
          style={{ background: `radial-gradient(ellipse, ${c.glowPurple} 0%, transparent 70%)` }} />
      </div>

      <NavigationBar />

      {/* ══ 紫微命盘（起盘入口） ═══════════════════════════ */}
      <section className="relative z-10 py-40 px-6 text-center overflow-hidden" style={{ background: c.altSection }}>
        {/* 星光装饰 */}
        <FloatingStars count={8} color={c.goldSolid} opacity={0.12} />
        {/* 太极图装饰 */}
        <div className="absolute hidden lg:block pointer-events-none" style={{ top: '20%', left: '8%' }}>
          <SpinningTaiji size={70} color={c.goldSolid} opacity={0.05} />
        </div>
        <div className="absolute hidden lg:block pointer-events-none" style={{ bottom: '20%', right: '8%' }}>
          <StarConstellation size={140} color={c.goldSolid} opacity={0.06} />
        </div>
        <FadeIn>
          <DiamondDivider color={c.goldSolid} opacity={0.4} className="mb-6" />

          <h2 className={`grad-text ${theme === 'dark' ? 'grad-text-dark' : 'grad-text-light'} font-bold mb-8 tracking-tight leading-tight`}
            style={{ fontSize: 'clamp(32px, 5vw, 60px)' }}>
            {t('home_cta_title', lang)}
          </h2>
          <p className="text-sm mb-10 max-w-md mx-auto leading-relaxed" style={{ color: c.textSecond }}>
            {t('home_cta_desc', lang)}
          </p>
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => requireLogin('/chart')}
            className="px-14 py-4 font-semibold text-base tracking-widest rounded-full"
            style={{ background: c.ctaBg, color: c.ctaText }}>
                {t('home_free_chart', lang)}
          </motion.button>
          <div className="mt-4 flex flex-wrap gap-3 justify-center">
            <motion.a
              href="/knowledge"
              whileHover={{ scale: 1.02 }}
              className="text-xs tracking-[0.2em] inline-flex items-center gap-2 px-4 py-2 rounded-full"
              style={{
                color: c.goldSolid,
                border: `1px solid ${c.goldLine}`,
                background: 'transparent',
                textDecoration: 'none',
              }}>
              {t('home_cta_knowledge', lang)}
            </motion.a>
            <motion.a
              href="/library"
              whileHover={{ scale: 1.02 }}
              className="text-xs tracking-[0.2em] inline-flex items-center gap-2 px-4 py-2 rounded-full"
              style={{
                color: c.goldSolid,
                border: `1px solid ${c.goldLine}`,
                background: 'transparent',
                textDecoration: 'none',
              }}>
              {t('home_cta_library', lang)}
            </motion.a>
          </div>
        </FadeIn>
      </section>

      {/* ══ 紫微合盘 ══════════════════════════════════════ */}
      <section className="relative z-10 px-6 md:px-10 lg:px-14 py-20">
        {/* 星宿装饰 */}
        <div className="absolute hidden lg:block pointer-events-none" style={{ top: '15%', left: '5%' }}>
          <StarConstellation size={160} color={c.goldSolid} opacity={0.06} />
        </div>
        <div className="mx-auto" style={{ maxWidth: '1280px' }}>
          <div className="rounded-2xl p-10 md:p-14 text-center relative overflow-hidden"
            style={{
              background: theme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.8)',
              border: `1px solid ${c.cardBorder}`,
              boxShadow: c.cardShadow,
            }}>
            {/* 太极图装饰 */}
            <div className="absolute pointer-events-none" style={{ top: '10%', right: '8%' }}>
              <TaijiDiagram size={60} color={c.goldSolid} opacity={0.06} />
            </div>
            <FadeIn>
              <DiamondDivider color={c.goldSolid} opacity={0.4} className="mb-6" />
              <h2 className={`grad-text ${theme === 'dark' ? 'grad-text-dark' : 'grad-text-light'} font-bold mb-4 tracking-tight`}
                style={{ fontSize: 'clamp(26px, 3.5vw, 40px)' }}>
                {t('home_heming_entry_title', lang)}
              </h2>
              <p className="text-sm leading-relaxed mb-8 max-w-lg mx-auto" style={{ color: c.textSecond }}>
                {t('home_heming_entry_desc', lang)}
              </p>
              <div className="flex justify-center gap-3 flex-wrap mb-6">
                {(['home_heming_tag1', 'home_heming_tag2', 'home_heming_tag3', 'home_heming_tag4'] as TKey[]).map(tagKey => (
                  <span key={tagKey} style={{
                    fontSize: '12px', padding: '5px 14px', borderRadius: '20px',
                    background: theme === 'dark' ? 'rgba(212,168,67,0.08)' : 'rgba(212,168,67,0.12)',
                    border: `1px solid ${c.goldLine}`,
                    color: c.goldSolid,
                  }}>
                    {t(tagKey, lang)}
                  </span>
                ))}
              </div>
              <motion.button
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => requireLogin('/heming')}
                className="px-10 py-3 font-medium text-sm tracking-widest rounded-full"
                style={{
                  background: theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(140,100,20,0.1)',
                  border: `1px solid ${c.goldLine}`,
                  color: c.goldSolid,
                  cursor: 'pointer',
                }}>
                {t('home_start_heming', lang)}
              </motion.button>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ══ 命理工具展示 ════════════════════════════════════ */}
      <section className="relative z-10">
        <WeakBoundary line={c.navBorder} />
        <FadeIn className="text-center mb-12 pt-20">
          <DiamondDivider color={c.goldSolid} opacity={0.4} className="mb-6" />
          <h2 className={`grad-text ${theme === 'dark' ? 'grad-text-dark' : 'grad-text-light'} font-bold mt-4 tracking-tight`}
            style={{ fontSize: 'clamp(32px, 4vw, 48px)' }}>
            {lang === 'zh' ? '六术通天' : 'Six Arts of Destiny'}
          </h2>
          <p className="max-w-xl mx-auto text-sm leading-relaxed mt-4" style={{ color: c.textSecond }}>
            {lang === 'zh'
              ? '从每日运势到AI面相手相，六种命理术数各有千秋，为你提供全方位的命运洞察。'
              : 'From daily fortune to AI face & palm reading, six divination arts for comprehensive destiny insight.'}
          </p>
        </FadeIn>
        {TOOLS.map((tool, i) => (
          <div key={i}
            className="flex items-center px-6 md:px-10 lg:px-14 py-16 md:py-20 min-h-[82svh] lg:min-h-[92vh]"
            style={{ background: i % 2 === 1 ? c.altSection : 'transparent' }}>
            <div className="mx-auto w-full" style={{ maxWidth: '1280px' }}>
              <div className={`grid grid-cols-1 ${i % 2 === 0 ? 'lg:grid-cols-[0.45fr_0.55fr]' : 'lg:grid-cols-[0.55fr_0.45fr]'} gap-10 lg:gap-16 items-center ${i % 2 === 1 ? 'lg:grid-flow-dense' : ''}`}>
                <div className={i % 2 === 1 ? 'lg:col-start-2' : ''}>
                  <FadeIn delay={0}>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ background: `${tool.accent}15`, border: `1px solid ${tool.accent}40` }}>
                        <svg width="20" height="20" viewBox="0 0 20 20">
                          {i === 0 && <circle cx="10" cy="10" r="8" fill="none" stroke={tool.accent} strokeWidth="1.5" />}
                          {i === 0 && <path d="M10 2 A8 8 0 0 1 10 18 A4 4 0 0 1 10 10 A4 4 0 0 0 10 2 Z" fill={tool.accent} opacity="0.3" />}
                          {i === 1 && <rect x="3" y="3" width="14" height="14" rx="2" fill="none" stroke={tool.accent} strokeWidth="1.5" />}
                          {i === 1 && <text x="10" y="14" fontSize="8" fill={tool.accent} textAnchor="middle" fontFamily="serif" fontWeight="bold">字</text>}
                          {i === 2 && <rect x="6" y="2" width="3" height="16" rx="1" fill="none" stroke={tool.accent} strokeWidth="1.5" />}
                          {i === 2 && <rect x="11" y="4" width="3" height="14" rx="1" fill="none" stroke={tool.accent} strokeWidth="1" opacity="0.6" />}
                          {i === 3 && <circle cx="10" cy="10" r="7" fill="none" stroke={tool.accent} strokeWidth="1.5" />}
                          {i === 3 && <rect x="7" y="7" width="6" height="6" fill="none" stroke={tool.accent} strokeWidth="0.8" />}
                          {i === 4 && <ellipse cx="10" cy="11" rx="6" ry="8" fill="none" stroke={tool.accent} strokeWidth="1.5" />}
                          {i === 4 && <circle cx="7" cy="8" r="0.8" fill={tool.accent} />}
                          {i === 4 && <circle cx="13" cy="8" r="0.8" fill={tool.accent} />}
                          {i === 5 && <path d="M7 18 L7 8 Q7 4 10 3 Q13 4 13 8 L13 18" fill="none" stroke={tool.accent} strokeWidth="1.5" />}
                          {i === 5 && <path d="M7 8 Q4 7 3 4" fill="none" stroke={tool.accent} strokeWidth="1" opacity="0.6" />}
                          {i === 5 && <path d="M13 8 Q16 7 17 4" fill="none" stroke={tool.accent} strokeWidth="1" opacity="0.6" />}
                        </svg>
                      </div>
                      <div className="h-px w-8" style={{ background: c.goldLine }} />
                      <span className="text-[10px] tracking-[0.5em] uppercase" style={{ color: c.tagText }}>{t(tool.tagKey, lang)}</span>
                    </div>
                  </FadeIn>
                  <FadeIn delay={0.1}>
                    <h2 className={`grad-text ${theme === 'dark' ? 'grad-text-dark' : 'grad-text-light'} font-bold leading-tight mb-5 tracking-tight`}
                      style={{ fontSize: 'clamp(30px, 3.5vw, 48px)', whiteSpace: 'pre-line' }}>
                      {t(tool.titleKey, lang)}
                    </h2>
                  </FadeIn>
                  <FadeIn delay={0.2}>
                    <p className="text-base mb-6 leading-relaxed" style={{ color: c.textSecond }}>{t(tool.descKey, lang)}</p>
                  </FadeIn>
                  <div className="space-y-3 mb-8">
                    {tool.pointKeys.map((pointKey, j) => (
                      <FadeIn key={j} delay={0.25 + j * 0.08}>
                        <div className="flex gap-3">
                          <div className="flex-shrink-0 mt-2 w-1 h-1 rounded-full" style={{ background: tool.accent, opacity: 0.7 }} />
                          <p className="text-sm leading-relaxed" style={{ color: c.textMuted }}>{t(pointKey, lang)}</p>
                        </div>
                      </FadeIn>
                    ))}
                  </div>
                  <FadeIn delay={0.4}>
                    <motion.button
                      whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      onClick={() => router.push(tool.path)}
                      className="px-8 py-3 font-medium text-sm tracking-widest rounded-full"
                      style={{ background: `${tool.accent}15`, border: `1px solid ${tool.accent}40`, color: tool.accent }}>
                      {t(tool.ctaKey, lang)}
                    </motion.button>
                  </FadeIn>
                </div>
                <div className={i % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}>
                  <FadeIn delay={0.15}>
                    <div className="relative rounded-2xl overflow-hidden p-8 md:p-12 flex items-center justify-center"
                      style={{ border: `1px solid ${c.featureBord}`, background: c.featureBg, minHeight: '400px', boxShadow: c.cardShadow }}>
                      <ToolVisual index={i} colors={c} accent={tool.accent} icon={tool.icon} lang={lang} />
                    </div>
                  </FadeIn>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-10 px-6"
        style={{ borderTop: `1px solid ${c.niCardBord}` }}>


        <div className="text-center">

          <p className="text-[10px] tracking-wider mb-3 max-w-2xl mx-auto leading-relaxed"
            style={{ color: c.footerText, opacity: 0.85 }}>
            {t('home_footer_line2', lang)}
          </p>
          <p className="text-[10px] tracking-wider" style={{ color: c.footerText }}>
            <a href="/terms" style={{ color: c.footerText, textDecoration: 'underline' }}>{t('home_footer_terms', lang)}</a>
            {' · '}
            <a href="/privacy" style={{ color: c.footerText, textDecoration: 'underline' }}>{t('home_footer_privacy', lang)}</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
