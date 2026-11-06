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
import { TaijiDiagram, StarConstellation, SpinningTaiji, FloatingStars, DiamondDivider, CloudPattern } from '@/components/Decorations';
import { LotusFlower, BuddhaHalo, AuspiciousCloud, DharmaWheel, Mandala, SeedSyllable, TempleSilhouette, IncenseSmoke, BodhiLeaf, SacredFlame } from '@/components/SacredDecorations';
import NavigationBar from '@/components/NavigationBar';
import ToolDemo from '@/components/ToolDemo';

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
        {/* 佛光放射 */}
        <div className="absolute pointer-events-none" style={{ top: '8%', left: '50%', transform: 'translateX(-50%)' }}>
          <BuddhaHalo size={400} color={c.goldSolid} opacity={0.06} />
        </div>
        {/* 莲花装饰 */}
        <div className="absolute pointer-events-none" style={{ bottom: '5%', left: '50%', transform: 'translateX(-50%)' }}>
          <LotusFlower size={180} color={c.goldSolid} opacity={0.08} />
        </div>
        {/* 祥云缭绕 */}
        <div className="absolute pointer-events-none" style={{ top: '12%', left: '3%' }}>
          <AuspiciousCloud size={200} color={c.goldSolid} opacity={0.08} />
        </div>
        <div className="absolute pointer-events-none" style={{ top: '18%', right: '3%' }}>
          <AuspiciousCloud size={180} color={c.goldSolid} opacity={0.06} />
        </div>
        {/* 法轮 */}
        <div className="absolute pointer-events-none" style={{ top: '15%', right: '8%' }}>
          <DharmaWheel size={80} color={c.goldSolid} opacity={0.08} />
        </div>
        {/* 种子字 */}
        <div className="absolute pointer-events-none" style={{ bottom: '20%', right: '10%' }}>
          <SeedSyllable size={50} color={c.goldSolid} opacity={0.1} syllable="唵" />
        </div>
        <div className="absolute pointer-events-none" style={{ top: '25%', left: '8%' }}>
          <SeedSyllable size={40} color={c.goldSolid} opacity={0.08} syllable="吽" />
        </div>
        {/* 星宿图 */}
        <div className="absolute pointer-events-none" style={{ top: '15%', right: '8%' }}>
          <StarConstellation size={200} color="#d4a843" opacity={0.08} />
        </div>
        <div className="absolute pointer-events-none" style={{ bottom: '10%', left: '5%' }}>
          <CloudPattern size={160} color="#d4a843" opacity={0.06} />
        </div>
        {/* 香烟缭绕 */}
        <div className="absolute pointer-events-none" style={{ bottom: '8%', right: '8%' }}>
          <IncenseSmoke size={60} color={c.goldSolid} opacity={0.08} />
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

      {/* ══ 紫微命盘（起盘入口） ═══════════════════════════ */}
      <section className="relative z-10 py-40 px-6 text-center overflow-hidden" style={{ background: c.altSection }}>
        {/* 星光装饰 */}
        <FloatingStars count={8} color={c.goldSolid} opacity={0.12} />
        {/* 曼陀罗坛城 */}
        <div className="absolute pointer-events-none" style={{ top: '10%', left: '50%', transform: 'translateX(-50%)' }}>
          <Mandala size={500} color={c.goldSolid} opacity={0.04} />
        </div>
        {/* 太极图装饰 */}
        <div className="absolute hidden lg:block pointer-events-none" style={{ top: '20%', left: '8%' }}>
          <SpinningTaiji size={70} color={c.goldSolid} opacity={0.05} />
        </div>
        <div className="absolute hidden lg:block pointer-events-none" style={{ bottom: '20%', right: '8%' }}>
          <StarConstellation size={140} color={c.goldSolid} opacity={0.06} />
        </div>
        {/* 菩提叶 */}
        <div className="absolute hidden lg:block pointer-events-none" style={{ top: '25%', right: '5%' }}>
          <BodhiLeaf size={80} color={c.goldSolid} opacity={0.06} />
        </div>
        {/* 烛火 */}
        <div className="absolute pointer-events-none" style={{ bottom: '15%', left: '10%' }}>
          <SacredFlame size={30} color={c.goldSolid} opacity={0.1} />
        </div>
        <div className="absolute pointer-events-none" style={{ bottom: '15%', right: '10%' }}>
          <SacredFlame size={30} color={c.goldSolid} opacity={0.1} />
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
        {/* 祥云装饰 */}
        <div className="absolute pointer-events-none" style={{ top: '10%', right: '5%' }}>
          <AuspiciousCloud size={140} color={c.goldSolid} opacity={0.06} />
        </div>
        {/* 寺庙轮廓 */}
        <div className="absolute pointer-events-none" style={{ bottom: '5%', left: '50%', transform: 'translateX(-50%)' }}>
          <TempleSilhouette size={300} color={c.goldSolid} opacity={0.04} />
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
        {/* 法轮装饰 */}
        <div className="absolute pointer-events-none" style={{ top: '5%', right: '5%' }}>
          <DharmaWheel size={100} color={c.goldSolid} opacity={0.05} />
        </div>
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
                      <ToolDemo index={i} colors={c} accent={tool.accent} lang={lang} />
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
