'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/components/ThemeProvider';
import { useLang } from '@/lib/i18n/LanguageContext';
import { useAuth } from '@/lib/auth/AuthContext';
import { t } from '@/lib/i18n/translations';
import WalletLoginButton from '@/components/WalletLoginButton';
import { AuspiciousCloud } from '@/components/SacredDecorations';

function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const { lang } = useLang();
  const isDark = theme === 'dark';
  return (
    <motion.button
      onClick={toggle}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.93 }}
      aria-label={isDark ? t('theme_toggle_dark', lang) : t('theme_toggle_light', lang)}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full border"
      style={{
        borderColor: isDark ? 'rgba(212,168,67,0.3)' : 'rgba(140,100,20,0.35)',
        background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,252,242,0.85)',
        transition: 'background 0.35s ease, border-color 0.35s ease',
      }}
    >
      <div className="relative w-10 h-5 rounded-full flex-shrink-0"
        style={{
          background: isDark ? 'rgba(12,24,64,0.95)' : 'rgba(230,195,80,0.55)',
          transition: 'background 0.35s ease',
        }}>
        <motion.div
          animate={{ x: isDark ? 2 : 22 }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          className="absolute top-1 w-3.5 h-3.5 rounded-full"
          style={{
            background: isDark
              ? 'linear-gradient(135deg, #b8a050, #e8d090)'
              : 'linear-gradient(135deg, #e89010, #f8d050)',
          }}
        />
      </div>
      <span className="text-[11px] font-medium tracking-wide select-none"
        style={{
          color: isDark ? 'rgba(212,180,100,0.85)' : 'rgba(110,72,8,0.8)',
          transition: 'color 0.35s ease',
        }}>
        {isDark ? t('theme_dark', lang) : t('theme_light', lang)}
      </span>
    </motion.button>
  );
}

export default function NavigationBar() {
  const router = useRouter();
  const pathname = usePathname();
  const { theme } = useTheme();
  const { lang, toggle: toggleLang } = useLang();
  const { user } = useAuth();
  const [toolsOpen, setToolsOpen] = useState(false);
  const [ritualsOpen, setRitualsOpen] = useState(false);
  const [wellnessOpen, setWellnessOpen] = useState(false);

  const isDark = theme === 'dark';
  const c = {
    navBg: isDark ? '#020810' : '#f5efe0',
    navBorder: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(160,120,30,0.15)',
    goldSolid: isDark ? '#d4a843' : '#8b6410',
    goldLine: isDark ? 'rgba(212,168,67,0.4)' : 'rgba(140,100,20,0.4)',
    textMuted: isDark ? '#9db0d0' : '#5a6275',
    cardBg: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.88)',
    activeBg: isDark ? 'rgba(212,168,67,0.12)' : 'rgba(140,100,20,0.08)',
  };

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  const navItemStyle = (path: string) => ({
    border: `1px solid ${isActive(path) ? c.goldLine : c.navBorder}`,
    color: isActive(path) ? c.goldSolid : c.textMuted,
    background: isActive(path) ? c.activeBg : 'transparent',
  });

  const requireLogin = (path: string) => {
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent(path)}`);
      return;
    }
    router.push(path);
  };

  const toolItems = [
    { path: '/daily', key: 'nav_daily' as const },
    { path: '/cezi', key: 'nav_cezi' as const },
    { path: '/chouqian', key: 'nav_chouqian' as const },
    { path: '/tongqian', key: 'nav_tongqian' as const },
    { path: '/mianxiang', key: 'nav_mianxiang' as const },
    { path: '/shouxiang', key: 'nav_shouxiang' as const },
  ];

  const ritualItems = [
    { path: '/prayer', key: 'nav_prayer' as const },
    { path: '/wish', key: 'nav_wish' as const },
    { path: '/repent', key: 'nav_repent' as const },
    { path: '/lamp', key: 'nav_lamp' as const },
    { path: '/incense', key: 'nav_incense' as const },
    { path: '/ritual', key: 'nav_ritual' as const },
  ];

  const wellnessItems = [
    { path: '/recitation', key: 'nav_recitation' as const },
    { path: '/vegetarian', key: 'nav_vegetarian' as const },
    { path: '/meditation', key: 'nav_meditation' as const },
    { path: '/reflection', key: 'nav_reflection' as const },
    { path: '/taichi', key: 'nav_taichi' as const },
    { path: '/charity', key: 'nav_charity' as const },
  ];

  const toolPaths = toolItems.map(i => i.path);
  const ritualPaths = ritualItems.map(i => i.path);
  const wellnessPaths = wellnessItems.map(i => i.path);
  const isToolActive = toolPaths.some(p => isActive(p));
  const isRitualActive = ritualPaths.some(p => isActive(p));
  const isWellnessActive = wellnessPaths.some(p => isActive(p));

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-8 py-3 sm:py-4 gap-2"
      style={{ background: c.navBg }}>
      {/* 底部庄严金色流光线 */}
      <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: `linear-gradient(to right, transparent, ${c.goldSolid}40, transparent)` }} />
      {/* 祥云纹饰 */}
      <div className="absolute pointer-events-none" style={{ top: '100%', left: '10%', opacity: 0.04 }}>
        <AuspiciousCloud size={80} color={c.goldSolid} opacity={0.5} />
      </div>
      <div className="absolute pointer-events-none" style={{ top: '100%', right: '10%', opacity: 0.04 }}>
        <AuspiciousCloud size={60} color={c.goldSolid} opacity={0.5} />
      </div>
      <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
        <motion.a
          href="/"
          className="text-[11px] sm:text-xs px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full transition-all duration-300"
          style={navItemStyle('/')}>
          {t('nav_home', lang)}
        </motion.a>
        <div className="relative">
          <button
            onClick={() => setToolsOpen(!toolsOpen)}
            className="text-[11px] sm:text-xs px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full transition-all duration-300 flex items-center gap-1"
            style={{
              border: `1px solid ${toolsOpen || isToolActive ? c.goldLine : c.navBorder}`,
              color: toolsOpen || isToolActive ? c.goldSolid : c.textMuted,
              background: isToolActive && !toolsOpen ? c.activeBg : 'transparent',
            }}
          >
            {lang === 'zh' ? '六术通天' : 'Tools'}
            <svg className="w-3 h-3 transition-transform duration-200" viewBox="0 0 12 12" fill="none" style={{ transform: toolsOpen ? 'rotate(180deg)' : 'none' }}>
              <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <AnimatePresence>
            {toolsOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="absolute left-0 top-full mt-1 flex flex-col gap-1 p-2 rounded-lg z-50 min-w-[140px]"
                style={{ background: c.cardBg, border: `1px solid ${c.navBorder}`, boxShadow: `0 8px 24px rgba(0,0,0,0.2), 0 2px 8px rgba(0,0,0,0.1)` }}>
                {toolItems.map((item, idx) => (
                  <motion.button
                    key={item.path}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    onClick={() => { setToolsOpen(false); router.push(item.path); }}
                    className="text-xs px-3 py-1.5 rounded transition-all duration-200 text-left"
                    style={{ color: c.textMuted }}
                    onMouseEnter={e => { e.currentTarget.style.background = `${c.goldLine}20`; e.currentTarget.style.color = c.goldSolid; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = c.textMuted; }}
                  >
                    {t(item.key, lang)}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="relative">
          <button
            onClick={() => setRitualsOpen(!ritualsOpen)}
            className="text-[11px] sm:text-xs px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full transition-all duration-300 flex items-center gap-1"
            style={{
              border: `1px solid ${ritualsOpen || isRitualActive ? c.goldLine : c.navBorder}`,
              color: ritualsOpen || isRitualActive ? c.goldSolid : c.textMuted,
              background: isRitualActive && !ritualsOpen ? c.activeBg : 'transparent',
            }}
          >
            {lang === 'zh' ? '祈福修持' : 'Rituals'}
            <svg className="w-3 h-3 transition-transform duration-200" viewBox="0 0 12 12" fill="none" style={{ transform: ritualsOpen ? 'rotate(180deg)' : 'none' }}>
              <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <AnimatePresence>
            {ritualsOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="absolute left-0 top-full mt-1 flex flex-col gap-1 p-2 rounded-lg z-50 min-w-[140px]"
                style={{ background: c.cardBg, border: `1px solid ${c.navBorder}`, boxShadow: `0 8px 24px rgba(0,0,0,0.2), 0 2px 8px rgba(0,0,0,0.1)` }}>
                {ritualItems.map((item, idx) => (
                  <motion.button
                    key={item.path}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    onClick={() => { setRitualsOpen(false); router.push(item.path); }}
                    className="text-xs px-3 py-1.5 rounded transition-all duration-200 text-left"
                    style={{ color: c.textMuted }}
                    onMouseEnter={e => { e.currentTarget.style.background = `${c.goldLine}20`; e.currentTarget.style.color = c.goldSolid; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = c.textMuted; }}
                  >
                    {t(item.key, lang)}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="relative">
          <button
            onClick={() => setWellnessOpen(!wellnessOpen)}
            className="text-[11px] sm:text-xs px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full transition-all duration-300 flex items-center gap-1"
            style={{
              border: `1px solid ${wellnessOpen || isWellnessActive ? c.goldLine : c.navBorder}`,
              color: wellnessOpen || isWellnessActive ? c.goldSolid : c.textMuted,
              background: isWellnessActive && !wellnessOpen ? c.activeBg : 'transparent',
            }}
          >
            {lang === 'zh' ? '每日修行' : 'Daily Check-in'}
            <svg className="w-3 h-3 transition-transform duration-200" viewBox="0 0 12 12" fill="none" style={{ transform: wellnessOpen ? 'rotate(180deg)' : 'none' }}>
              <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <AnimatePresence>
            {wellnessOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="absolute left-0 top-full mt-1 flex flex-col gap-1 p-2 rounded-lg z-50 min-w-[140px]"
                style={{ background: c.cardBg, border: `1px solid ${c.navBorder}`, boxShadow: `0 8px 24px rgba(0,0,0,0.2), 0 2px 8px rgba(0,0,0,0.1)` }}>
                {wellnessItems.map((item, idx) => (
                  <motion.button
                    key={item.path}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    onClick={() => { setWellnessOpen(false); router.push(item.path); }}
                    className="text-xs px-3 py-1.5 rounded transition-all8duration-200 text-left"
                    style={{ color: c.textMuted }}
                    onMouseEnter={e => { e.currentTarget.style.background = `${c.goldLine}20`; e.currentTarget.style.color = c.goldSolid; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = c.textMuted; }}
                  >
                    {t(item.key, lang)}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          onClick={() => requireLogin('/chart')}
          className="text-[11px] sm:text-xs px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full transition-all duration-300"
          style={navItemStyle('/chart')}>
          {t('nav_chart', lang)}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          onClick={() => requireLogin('/heming')}
          className="text-[11px] sm:text-xs px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full transition-all duration-300"
          style={navItemStyle('/heming')}>
          {t('nav_heming', lang)}
        </motion.button>
        <motion.a
          href="/fengshui"
          className="text-[11px] sm:text-xs px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full transition-all duration-300"
          style={navItemStyle('/fengshui')}>
          {t('nav_fengshui', lang)}
        </motion.a>
        <motion.a
          href="/library"
          className="text-[11px] sm:text-xs px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full transition-all duration-300"
          style={navItemStyle('/library')}>
          {t('nav_library', lang)}
        </motion.a>
        <motion.a
          href="/heritage"
          className="text-[11px] sm:text-xs px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full transition-all duration-300"
          style={navItemStyle('/heritage')}>
          {t('nav_heritage', lang)}
        </motion.a>
        <motion.a
          href="/cuisine"
          className="text-[11px] sm:text-xs px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full transition-all duration-300"
          style={navItemStyle('/cuisine')}>
          {t('nav_cuisine', lang)}
        </motion.a>
        <motion.a
          href="/ranking"
          className="text-[11px] sm:text-xs px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full transition-all duration-300"
          style={navItemStyle('/ranking')}>
          {lang === 'zh' ? '排行榜' : 'Ranking'}
        </motion.a>

      </div>
      <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
        <ThemeToggle />
        <button
          onClick={toggleLang}
          className="text-[11px] sm:text-xs px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-full transition-all duration-300"
          style={{ border: `1px solid ${c.navBorder}`, color: c.textMuted }}
        >
          {lang === 'zh' ? 'EN' : '中'}
        </button>
        <WalletLoginButton />
      </div>
    </nav>
  );
}