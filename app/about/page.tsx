'use client';
import { useLayoutEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import StarField from '@/components/StarField';
import { useTheme, type Theme } from '@/components/ThemeProvider';
import { useLang } from '@/lib/i18n/LanguageContext';
import { t, type TKey } from '@/lib/i18n/translations';
import { TaijiDiagram, StarConstellation, BaguaDiagram, PalaceGrid, SiHuaRing, StarGlow, SpinningTaiji, FloatingStars, CloudPattern, DiamondDivider } from '@/components/Decorations';
import NavigationBar from '@/components/NavigationBar';

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
  return (
    <div className="absolute top-0 left-0 right-0 h-16 pointer-events-none"
      style={{ background: `linear-gradient(to bottom, ${line}, transparent)`, opacity: 0.45 }} />
  );
}

const NI_TEACHINGS = [
  { titleKey: 'home_teaching1_title' as const, bodyKey: 'home_teaching1_body' as const },
  { titleKey: 'home_teaching2_title' as const, bodyKey: 'home_teaching2_body' as const },
  { titleKey: 'home_teaching3_title' as const, bodyKey: 'home_teaching3_body' as const },
  { titleKey: 'home_teaching4_title' as const, bodyKey: 'home_teaching4_body' as const },
];

function useColors(theme: Theme) {
  const d = theme === 'dark';
  return {
    bgBase:       d ? '#020810'                                : '#f5efe0',
    navBg:        d ? '#020810'                                : '#f5efe0',
    navBorder:    d ? 'rgba(255,255,255,0.05)'                : 'rgba(160,120,30,0.15)',
    goldSolid:    d ? '#d4a843'                               : '#8b6410',
    goldLine:     d ? 'rgba(212,168,67,0.4)'                  : 'rgba(140,100,20,0.4)',
    tagText:      d ? 'rgba(212,168,67,0.6)'                  : 'rgba(120,80,10,0.65)',
    textSecond:   d ? '#b8c6df'                               : '#3a3f4a',
    textMuted:    d ? '#9db0d0'                               : '#5a6275',
    textFaint:    d ? 'rgba(240,246,255,0.56)'                : '#9da4b3',
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
    altSection:   d ? 'rgba(255,255,255,0.02)'                : 'rgba(255,255,255,0.4)',
  };
}

const FEATURES = [
  {
    tagKey: 'home_feat0_tag' as const,
    titleKey: 'home_feat0_title' as const,
    subtitleKey: 'home_feat0_subtitle' as const,
    pointKeys: ['home_feat0_point1', 'home_feat0_point2', 'home_feat0_point3'] as const,
    icon: 'palace',
  },
  {
    tagKey: 'home_feat1_tag' as const,
    titleKey: 'home_feat1_title' as const,
    subtitleKey: 'home_feat1_subtitle' as const,
    pointKeys: ['home_feat1_point1', 'home_feat1_point2', 'home_feat1_point3'] as const,
    icon: 'stars',
  },
  {
    tagKey: 'home_feat2_tag' as const,
    titleKey: 'home_feat2_title' as const,
    subtitleKey: 'home_feat2_subtitle' as const,
    pointKeys: ['home_feat2_point1', 'home_feat2_point2', 'home_feat2_point3'] as const,
    icon: 'ai',
  },
  {
    tagKey: 'home_feat3_tag' as const,
    titleKey: 'home_feat3_title' as const,
    subtitleKey: 'home_feat3_subtitle' as const,
    pointKeys: ['home_feat3_point1', 'home_feat3_point2', 'home_feat3_point3'] as const,
    icon: 'pattern',
  },
];

const SIHUA_BRIEF: Record<string, { attrKey: TKey; briefKey: TKey }> = {
  '化禄': { attrKey: 'home_sihua_lu_attr', briefKey: 'home_sihua_lu_brief' },
  '化权': { attrKey: 'home_sihua_quan_attr', briefKey: 'home_sihua_quan_brief' },
  '化科': { attrKey: 'home_sihua_ke_attr', briefKey: 'home_sihua_ke_brief' },
  '化忌': { attrKey: 'home_sihua_ji_attr', briefKey: 'home_sihua_ji_brief' },
};

const STAR_BRIEF: Record<string, { attrKey: TKey; briefKey: TKey }> = {
  '紫微': { attrKey: 'home_star_ziwei_attr', briefKey: 'home_star_ziwei_brief' },
  '天机': { attrKey: 'home_star_tianji_attr', briefKey: 'home_star_tianji_brief' },
  '太阳': { attrKey: 'home_star_taiyang_attr', briefKey: 'home_star_taiyang_brief' },
  '武曲': { attrKey: 'home_star_wuqu_attr', briefKey: 'home_star_wuqu_brief' },
  '天同': { attrKey: 'home_star_tiantong_attr', briefKey: 'home_star_tiantong_brief' },
  '廉贞': { attrKey: 'home_star_lianzhen_attr', briefKey: 'home_star_lianzhen_brief' },
  '天府': { attrKey: 'home_star_tianfu_attr', briefKey: 'home_star_tianfu_brief' },
  '太阴': { attrKey: 'home_star_taiyin_attr', briefKey: 'home_star_taiyin_brief' },
  '贪狼': { attrKey: 'home_star_tanlang_attr', briefKey: 'home_star_tanlang_brief' },
  '巨门': { attrKey: 'home_star_jumen_attr', briefKey: 'home_star_jumen_brief' },
  '天相': { attrKey: 'home_star_tianxiang_attr', briefKey: 'home_star_tianxiang_brief' },
  '天梁': { attrKey: 'home_star_tianliang_attr', briefKey: 'home_star_tianliang_brief' },
  '七杀': { attrKey: 'home_star_qisha_attr', briefKey: 'home_star_qisha_brief' },
  '破军': { attrKey: 'home_star_pojun_attr', briefKey: 'home_star_pojun_brief' },
};

function FeatureVisual({ index, colors: c }: { index: number; colors: ReturnType<typeof useColors> }) {
  const [sel, setSel] = useState<string | null>(null);
  const { lang } = useLang();

  if (index === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-5">
        <div className="grid grid-cols-4 gap-1.5 w-72 mx-auto">
          {Array.from({ length: 16 }).map((_, i) => {
            const isCenter = [5, 6, 9, 10].includes(i);
            const isActive = [0, 3, 12, 15].includes(i);
            return (
              <motion.div key={i}
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="h-14 rounded-sm flex items-center justify-center text-xs transition-all duration-300"
                style={{
                  border: `1px solid ${isActive ? c.goldLine : c.cardBorder}`,
                  background: isCenter ? 'transparent' : isActive ? c.starBg : c.featureBg,
                  color: isActive ? c.goldSolid : c.textFaint,
                  opacity: isCenter ? 0 : 1,
                }}>
                {isActive ? '★' : ''}
              </motion.div>
            );
          })}
        </div>
        <p className="text-[10px] tracking-widest transition-colors duration-300"
          style={{ color: c.textFaint }}>{t('home_fv0_label', lang)}</p>
      </div>
    );
  }

  if (index === 1) {
    const selInfo = sel ? (STAR_BRIEF[sel] ?? SIHUA_BRIEF[sel] ?? null) : null;
    return (
      <div className="flex flex-col gap-4 h-full justify-center">
        {[
          { groupKey: 'home_fv1_group1' as TKey, stars: ['紫微', '天机', '太阳', '武曲', '天同', '廉贞'] },
          { groupKey: 'home_fv1_group2' as TKey, stars: ['天府', '太阴', '贪狼', '巨门', '天相', '天梁', '七杀', '破军'] },
        ].map(group => (
          <div key={group.groupKey}>
            <div className="text-[11px] tracking-widest mb-2 transition-colors duration-300"
              style={{ color: c.textFaint }}>{t(group.groupKey, lang)}</div>
            <div className="flex flex-wrap gap-1.5">
              {group.stars.map(s => (
                <motion.button key={s}
                  onClick={() => setSel(sel === s ? null : s)}
                  whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.1 }}
                  className="text-xs px-2 py-1 rounded-md cursor-pointer"
                  style={{
                    border: `1px solid ${sel === s ? c.goldSolid : c.goldLine}`,
                    color: c.goldSolid,
                    background: sel === s ? `${c.goldLine}30` : 'transparent',
                    fontWeight: sel === s ? 600 : 400,
                  }}>
                  {s}
                </motion.button>
              ))}
            </div>
          </div>
        ))}
        <div>
          <div className="text-[11px] tracking-widest mb-2 transition-colors duration-300"
            style={{ color: c.textFaint }}>{t('home_fv1_sihua', lang)}</div>
          <div className="flex gap-2 flex-wrap">
            {[['化禄', 'rgba(52,211,153,0.7)'], ['化权', 'rgba(96,165,250,0.7)'], ['化科', 'rgba(250,204,21,0.7)'], ['化忌', 'rgba(248,113,113,0.7)']].map(([label, color]) => (
              <motion.button key={label}
                onClick={() => setSel(sel === label ? null : label)}
                whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.1 }}
                className="text-xs px-2.5 py-1 rounded-md cursor-pointer"
                style={{
                  border: `1px solid ${color}`,
                  color,
                  background: sel === label ? `${color.replace('0.7', '0.15')}` : 'transparent',
                  fontWeight: sel === label ? 600 : 400,
                }}>
                {label}
              </motion.button>
            ))}
          </div>
        </div>
        <AnimatePresence mode="wait">
          {selInfo && (
            <motion.div key={sel}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="rounded-xl p-4 mt-1.5"
              style={{ border: `1px solid ${c.goldLine}`, background: c.featureBg }}>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-sm font-semibold" style={{ color: c.goldSolid }}>{sel}</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full" style={{ color: c.tagText, border: `1px solid ${c.goldLine}` }}>{t(selInfo.attrKey, lang)}</span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: c.textSecond }}>{t(selInfo.briefKey, lang)}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  if (index === 2) {
    const msgs = [
      { role: 'user', text: t('home_fv2_user1', lang) },
      { role: 'ai', text: t('home_fv2_ai1', lang) },
      { role: 'user', text: t('home_fv2_user2', lang) },
    ];
    return (
      <div className="flex flex-col gap-2 h-full justify-center">
        {msgs.map((m, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, x: m.role === 'user' ? 10 : -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.15 }}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className="max-w-[85%] text-[11px] px-3 py-2 rounded-lg leading-relaxed"
              style={{
                border: `1px solid ${m.role === 'user' ? c.goldLine : c.cardBorder}`,
                background: m.role === 'user' ? c.starBg : c.featureBg,
                color: m.role === 'user' ? c.goldSolid : c.textSecond,
              }}>
              {m.text}
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (index === 3) {
    const patterns = [
      { name: t('home_fv3_pattern1_name', lang), desc: t('home_fv3_pattern1_desc', lang), ok: true },
      { name: t('home_fv3_pattern2_name', lang), desc: t('home_fv3_pattern2_desc', lang), ok: true },
      { name: t('home_fv3_pattern3_name', lang), desc: t('home_fv3_pattern3_desc', lang), ok: false },
    ];
    return (
      <div className="flex flex-col gap-3 h-full justify-center">
        {patterns.map((p, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.12 }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
            style={{
              border: `1px solid ${p.ok ? 'rgba(96,165,250,0.25)' : 'rgba(251,146,60,0.25)'}`,
              background: p.ok ? 'rgba(96,165,250,0.05)' : 'rgba(251,146,60,0.05)',
            }}>
            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: p.ok ? 'rgba(96,165,250,0.6)' : 'rgba(251,146,60,0.6)' }} />
            <div>
              <div className="text-[11px] font-medium"
                style={{ color: p.ok ? 'rgba(147,197,253,0.8)' : 'rgba(253,186,116,0.8)' }}>{p.name}</div>
              <div className="text-[10px]" style={{ color: c.textMuted }}>{p.desc}</div>
            </div>
          </motion.div>
        ))}
        <div className="text-[9px] mt-2 tracking-wider text-center" style={{ color: c.textFaint }}>
          {t('home_fv3_footer', lang)}
        </div>
      </div>
    );
  }

  return null;
}


export default function AboutPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const c = useColors(theme);
  const { lang, toggle: toggleLang } = useLang();

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

      {/* 顶部导航 */}
      <NavigationBar />

      {/* ══ 哲学引言 ══════════════════════════════════════ */}
      <section className="relative z-10 overflow-hidden min-h-[82svh] lg:min-h-[92vh] flex items-center" style={{ padding: '72px 24px' }}>
        <WeakBoundary line={c.navBorder} />
        <div className="absolute inset-0"
          style={{
            background: theme === 'dark'
              ? 'linear-gradient(to bottom, #020810 0%, #020810 6%, #030a18 22%, #0d0820 40%, #0a0618 68%, #030a18 86%, #020810 100%)'
              : 'linear-gradient(to bottom, #f5efe0 0%, #f5efe0 6%, #c08055 18%, #6a2810 32%, #1e0a02 50%, #1e0a02 70%, #6a2810 84%, #f5efe0 100%)',
            transition: 'background 0.4s ease',
          }} />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <span className="font-bold" style={{ fontSize: 'clamp(220px, 38vw, 460px)', color: 'rgba(212,168,67,0.012)', lineHeight: 1, fontFamily: 'serif' }}>命</span>
        </div>
        <div className="absolute pointer-events-none" style={{ top: '15%', right: '8%' }}>
          <StarConstellation size={200} color="#d4a843" opacity={0.08} />
        </div>
        <div className="absolute pointer-events-none" style={{ bottom: '10%', left: '5%' }}>
          <CloudPattern size={160} color="#d4a843" opacity={0.06} />
        </div>
        <FadeIn className="relative mx-auto text-center w-full" y={20}>
          <DiamondDivider color="#d4a843" opacity={0.4} className="mb-8" />
          <div className="space-y-3" style={{ maxWidth: '840px', margin: '0 auto' }}>
            {[
              { textKey: 'home_phil_line1' as TKey, size: 'clamp(17px, 2.2vw, 28px)', color: 'rgba(215,228,252,0.72)', delay: 0.1 },
              { textKey: 'home_phil_line2' as TKey, size: 'clamp(21px, 2.6vw, 32px)', color: 'rgba(220,232,250,0.74)', delay: 0.25 },
              { textKey: 'home_phil_line3' as TKey, size: 'clamp(24px, 3vw, 40px)', color: 'rgba(218,230,248,0.8)', delay: 0.34 },
            ].map((line, i) => (
              <motion.p key={i}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: line.delay }}
                className="tracking-wider" style={{ fontSize: line.size, color: line.color, fontWeight: 400 }}>
                {t(line.textKey, lang)}
              </motion.p>
            ))}
            <motion.p
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.45 }}
              className={`grad-text ${theme === 'dark' ? 'grad-text-dark' : 'grad-text-light'} font-bold`}
              style={{ fontSize: 'clamp(24px, 3.4vw, 48px)', letterSpacing: '0.05em', lineHeight: 1.35 }}>
              {t('home_phil_conclusion', lang)}
            </motion.p>
          </div>
        </FadeIn>
      </section>

      {/* ══ 功能详解 ══════════════════════════════════════ */}
      <section className="relative z-10">
        <div className="absolute hidden lg:block pointer-events-none right-0" style={{ top: '5%' }}>
          <SiHuaRing size={120} opacity={0.06} />
        </div>
        {FEATURES.map((feature, i) => (
          <div key={i}
            className={`flex items-center px-6 md:px-10 lg:px-14 py-20 md:py-24 ${i <= 2 ? 'min-h-[82svh] lg:min-h-[92vh]' : ''}`}
            style={{ background: i % 2 === 1 ? c.altSection : 'transparent' }}>
            <div className="mx-auto w-full" style={{ maxWidth: '1280px' }}>
              <div className={`grid grid-cols-1 ${i % 2 === 0 ? 'lg:grid-cols-[0.45fr_0.55fr]' : 'lg:grid-cols-[0.55fr_0.45fr]'} gap-10 lg:gap-16 items-start ${i % 2 === 1 ? 'lg:grid-flow-dense' : ''}`}>
                <div className={i % 2 === 1 ? 'lg:col-start-2' : ''}>
                  <FadeIn delay={0}>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="flex-shrink-0">
                        {feature.icon === 'palace' && <PalaceGrid size={28} color={c.goldSolid} opacity={0.8} />}
                        {feature.icon === 'stars' && <StarConstellation size={36} color={c.goldSolid} opacity={0.8} />}
                        {feature.icon === 'ai' && <TaijiDiagram size={28} color={c.goldSolid} opacity={0.8} />}
                        {feature.icon === 'pattern' && <BaguaDiagram size={28} color={c.goldSolid} opacity={0.8} />}
                      </div>
                      <div className="h-px w-8" style={{ background: c.goldLine }} />
                      <span className="text-[10px] tracking-[0.5em] uppercase" style={{ color: c.tagText }}>{t(feature.tagKey, lang)}</span>
                    </div>
                  </FadeIn>
                  <FadeIn delay={0.1}>
                    <h2 className={`grad-text ${theme === 'dark' ? 'grad-text-dark' : 'grad-text-light'} font-bold leading-tight mb-5 tracking-tight`}
                      style={{ fontSize: i < 2 ? 'clamp(36px, 4vw, 56px)' : 'clamp(30px, 3.5vw, 48px)', whiteSpace: 'pre-line' }}>
                      {t(feature.titleKey, lang)}
                    </h2>
                  </FadeIn>
                  <FadeIn delay={0.2}>
                    <p className="text-base mb-8 leading-relaxed" style={{ color: c.textSecond }}>{t(feature.subtitleKey, lang)}</p>
                  </FadeIn>
                  <div className="space-y-4">
                    {feature.pointKeys.map((pointKey, j) => (
                      <FadeIn key={j} delay={0.25 + j * 0.08}>
                        <div className="flex gap-3">
                          <div className="flex-shrink-0 mt-2 w-1 h-1 rounded-full" style={{ background: c.goldSolid, opacity: 0.6 }} />
                          <p className="text-sm leading-relaxed" style={{ color: c.textMuted }}>{t(pointKey, lang)}</p>
                        </div>
                      </FadeIn>
                    ))}
                  </div>
                </div>
                <div className={i % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}>
                  <FadeIn delay={0.15}>
                    <div className="relative rounded-2xl overflow-hidden p-8 md:p-12"
                      style={{ border: `1px solid ${c.featureBord}`, background: c.featureBg, minHeight: i <= 1 ? '540px' : i === 2 ? '460px' : '320px', boxShadow: c.cardShadow }}>
                      <FeatureVisual index={i} colors={c} />
                    </div>
                  </FadeIn>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* ══ 天·地·人 三分理论 ════════════════════════════ */}
      <section className="relative z-10 flex items-center px-6 md:px-10 lg:px-14 py-20"
        style={{ background: c.altSection, minHeight: '82svh' }}>
        <WeakBoundary line={c.navBorder} />
        <FloatingStars count={6} color={c.goldSolid} opacity={0.15} />
        <div className="mx-auto w-full" style={{ maxWidth: '1280px' }}>
          <FadeIn>
            <div className="text-center mb-10">
              <DiamondDivider color={c.goldSolid} opacity={0.5} className="mb-6" />
              <h2 className={`grad-text ${theme === 'dark' ? 'grad-text-dark' : 'grad-text-light'} font-bold mb-5 tracking-tight`}
                style={{ fontSize: 'clamp(32px, 4vw, 48px)' }}>
                {t('home_tian_title', lang)}
              </h2>
              <p className="max-w-xl mx-auto text-sm leading-relaxed" style={{ color: c.textSecond }}>
                {t('home_tian_desc', lang)}
              </p>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            {[
              { glyph: '天', labelKey: 'home_tian_card1_label' as TKey, pct: '⅓', color: c.goldSolid, borderColor: c.goldLine, descKey: 'home_tian_card1_desc' as TKey, subKey: 'home_tian_card1_sub' as TKey, icon: <StarConstellation size={40} color={c.goldSolid} opacity={0.5} /> },
              { glyph: '地', labelKey: 'home_tian_card2_label' as TKey, pct: '⅓', color: 'rgba(96,165,250,0.9)', borderColor: 'rgba(96,165,250,0.3)', descKey: 'home_tian_card2_desc' as TKey, subKey: 'home_tian_card2_sub' as TKey, icon: <PalaceGrid size={40} color="rgba(96,165,250,0.9)" opacity={0.5} /> },
              { glyph: '人', labelKey: 'home_tian_card3_label' as TKey, pct: '⅓', color: 'rgba(100,216,139,0.9)', borderColor: 'rgba(100,216,139,0.3)', descKey: 'home_tian_card3_desc' as TKey, subKey: 'home_tian_card3_sub' as TKey, icon: <TaijiDiagram size={40} color="rgba(100,216,139,0.9)" opacity={0.5} /> },
            ].map((item, i) => (
              <FadeIn key={item.glyph} delay={0.1 + i * 0.12}>
                <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.1 }}
                  className="rounded-2xl p-7 h-full flex flex-col"
                  style={{ background: c.cardBg, border: `1px solid ${item.borderColor}`, boxShadow: c.cardShadow }}>
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className="text-5xl font-bold leading-none" style={{ color: item.color }}>{item.glyph}</div>
                      {item.icon}
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold" style={{ color: item.color }}>{item.pct}</div>
                      <div className="text-[9px] mt-0.5 tracking-widest" style={{ color: c.textMuted }}>of life</div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="text-sm font-medium mb-0.5" style={{ color: item.color }}>{t(item.labelKey, lang)}</div>
                    <div className="text-[10px] tracking-wider" style={{ color: c.textMuted }}>{t(item.subKey, lang)}</div>
                  </div>
                  <div className="h-px mb-4" style={{ background: item.borderColor }} />
                  <p className="text-xs leading-relaxed flex-1" style={{ color: c.textSecond }}>{t(item.descKey, lang)}</p>
                </motion.div>
              </FadeIn>
            ))}
          </div>
          <FadeIn delay={0.3}>
            <div className="mt-10 text-center">
              <p className="text-sm leading-relaxed" style={{ color: c.textSecond }}>
                {t('home_tian_quote', lang)}
              </p>
              <p className="mt-2 text-[10px] tracking-widest" style={{ color: c.tagText }}>{t('home_tian_quote_author', lang)}</p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══ 倪海厦介绍 ════════════════════════════════════ */}
      <section className="relative z-10 flex items-center px-6 md:px-10 lg:px-14 py-20" style={{ minHeight: '82svh' }}>
        <WeakBoundary line={c.navBorder} />
        <div className="absolute hidden lg:block pointer-events-none" style={{ top: '8%', right: '6%' }}>
          <SpinningTaiji size={80} color={c.goldSolid} opacity={0.05} />
        </div>
        <div className="mx-auto w-full" style={{ maxWidth: '1280px' }}>
          <FadeIn>
            <div className="text-center mb-10">
              <DiamondDivider color={c.goldSolid} opacity={0.5} className="mb-6" />
              <h2 className={`grad-text ${theme === 'dark' ? 'grad-text-dark' : 'grad-text-light'} font-bold mb-4 tracking-tight`}
                style={{ fontSize: 'clamp(32px, 4vw, 48px)' }}>
                {t('home_ni_title', lang)}
              </h2>
              <p className="max-w-xl mx-auto leading-relaxed text-sm" style={{ color: c.textSecond }}>
                {t('home_ni_desc', lang)}
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {[
                { labelKey: 'home_ni_card1_label' as TKey, value: '1954', subKey: 'home_ni_card1_sub' as TKey, icon: <StarGlow size={40} color={c.goldSolid} opacity={0.4} /> },
                { labelKey: 'home_ni_card2_label' as TKey, value: '2012', subKey: 'home_ni_card2_sub' as TKey, icon: <CloudPattern size={50} color={c.goldSolid} opacity={0.3} /> },
                { labelKey: 'home_ni_card3_label' as TKey, valueKey: 'home_ni_card3_value' as TKey, subKey: 'home_ni_card3_sub' as TKey, icon: <TaijiDiagram size={40} color={c.goldSolid} opacity={0.4} /> },
              ].map(item => (
                <div key={item.labelKey} className="rounded-xl px-4 py-5 text-center flex flex-col items-center gap-2"
                  style={{ border: `1px solid ${c.niBorder}`, background: c.niBg }}>
                  {item.icon}
                  <div className="text-[10px] tracking-[0.3em]" style={{ color: c.textFaint }}>{t(item.labelKey, lang)}</div>
                  <div className="text-xl font-semibold" style={{ color: c.goldSolid }}>{item.value ?? t(item.valueKey!, lang)}</div>
                  <div className="text-[11px]" style={{ color: c.textMuted }}>{t(item.subKey, lang)}</div>
                </div>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { titleKey: 'home_ni_concept1_title' as TKey, bodyKey: 'home_ni_concept1_body' as TKey, icon: 'book' },
                { titleKey: 'home_ni_concept2_title' as TKey, bodyKey: 'home_ni_concept2_body' as TKey, icon: 'star' },
                { titleKey: 'home_ni_concept3_title' as TKey, bodyKey: 'home_ni_concept3_body' as TKey, icon: 'lamp' },
                { titleKey: 'home_ni_concept4_title' as TKey, bodyKey: 'home_ni_concept4_body' as TKey, icon: 'wave' },
              ].map((item, i) => (
                <motion.div key={i} whileHover={{ y: -3 }} transition={{ duration: 0.1 }}
                  className="rounded-xl p-5"
                  style={{ border: `1px solid ${c.niCardBord}`, background: c.niCardBg, boxShadow: c.niCardShadow }}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ background: theme === 'dark' ? 'rgba(212,168,67,0.1)' : 'rgba(212,168,67,0.08)', border: `1px solid ${c.goldLine}` }}>
                      {item.icon === 'book' && <span style={{ color: c.goldSolid, fontSize: '14px' }}>📖</span>}
                      {item.icon === 'star' && <span style={{ color: c.goldSolid, fontSize: '14px' }}>★</span>}
                      {item.icon === 'lamp' && <span style={{ color: c.goldSolid, fontSize: '14px' }}>✦</span>}
                      {item.icon === 'wave' && <span style={{ color: c.goldSolid, fontSize: '14px' }}>◈</span>}
                    </div>
                    <h3 className="text-sm font-medium" style={{ color: c.goldSolid }}>{t(item.titleKey, lang)}</h3>
                  </div>
                  <p className="text-xs leading-relaxed pl-11" style={{ color: c.textSecond }}>{t(item.bodyKey, lang)}</p>
                </motion.div>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {NI_TEACHINGS.map((teaching, i) => (
                <motion.div key={i} whileHover={{ y: -3 }} transition={{ duration: 0.1 }}
                  className="rounded-xl p-5 h-full"
                  style={{ border: `1px solid ${c.niCardBord}`, background: c.niCardBg, boxShadow: c.niCardShadow }}>
                  <div className="flex items-start gap-3 mb-2">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center mt-0.5"
                      style={{ borderColor: c.goldLine }}>
                      <span className="text-[9px]" style={{ color: c.goldSolid }}>{i + 1}</span>
                    </div>
                    <h3 className="text-sm font-medium leading-relaxed" style={{ color: c.goldSolid }}>{t(teaching.titleKey, lang)}</h3>
                  </div>
                  <p className="text-xs leading-relaxed pl-8" style={{ color: c.textSecond }}>{t(teaching.bodyKey, lang)}</p>
                </motion.div>
              ))}
            </div>
          </FadeIn>

        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-10 px-6" style={{ borderTop: `1px solid ${c.niCardBord}` }}>
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