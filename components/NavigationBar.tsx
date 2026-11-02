'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useTheme } from '@/components/ThemeProvider';
import { useLang } from '@/lib/i18n/LanguageContext';
import { useAuth } from '@/lib/auth/AuthContext';
import { t } from '@/lib/i18n/translations';
import WalletLoginButton from '@/components/WalletLoginButton';

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
  const { theme } = useTheme();
  const { lang, toggle: toggleLang } = useLang();
  const { user } = useAuth();
  const [toolsOpen, setToolsOpen] = useState(false);

  const isDark = theme === 'dark';
  const c = {
    navBg: isDark ? '#020810' : '#f5efe0',
    navBorder: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(160,120,30,0.15)',
    goldSolid: isDark ? '#d4a843' : '#8b6410',
    goldLine: isDark ? 'rgba(212,168,67,0.4)' : 'rgba(140,100,20,0.4)',
    textMuted: isDark ? '#9db0d0' : '#5a6275',
    cardBg: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.88)',
  };

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

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-8 py-3 sm:py-4 gap-2"
      style={{ background: c.navBg }}>
      <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
        <div className="relative">
          <button
            onClick={() => setToolsOpen(!toolsOpen)}
            className="text-[11px] sm:text-xs px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full transition-all duration-300 flex items-center gap-1"
            style={{ border: `1px solid ${toolsOpen ? c.goldLine : c.navBorder}`, color: toolsOpen ? c.goldSolid : c.textMuted }}
          >
            {lang === 'zh' ? '六术通天' : 'Tools'}
            <svg className="w-3 h-3 transition-transform duration-200" viewBox="0 0 12 12" fill="none" style={{ transform: toolsOpen ? 'rotate(180deg)' : 'none' }}>
              <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          {toolsOpen && (
            <div className="absolute left-0 top-full mt-1 flex flex-col gap-1 p-2 rounded-lg shadow-lg z-50 min-w-[140px]"
              style={{ background: c.cardBg, border: `1px solid ${c.navBorder}` }}>
              {toolItems.map(item => (
                <button
                  key={item.path}
                  onClick={() => { setToolsOpen(false); router.push(item.path); }}
                  className="text-xs px-3 py-1.5 rounded transition-all duration-200 text-left"
                  style={{ color: c.textMuted }}
                  onMouseEnter={e => { e.currentTarget.style.background = `${c.goldLine}20`; e.currentTarget.style.color = c.goldSolid; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = c.textMuted; }}
                >
                  {t(item.key, lang)}
                </button>
              ))}
            </div>
          )}
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          onClick={() => requireLogin('/chart')}
          className="text-[11px] sm:text-xs px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full transition-all duration-300"
          style={{ border: `1px solid ${c.goldLine}`, color: c.goldSolid }}>
          {t('nav_chart', lang)}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          onClick={() => requireLogin('/heming')}
          className="text-[11px] sm:text-xs px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full transition-all duration-300"
          style={{ border: `1px solid ${c.navBorder}`, color: c.textMuted }}>
          {t('nav_heming', lang)}
        </motion.button>
        <motion.a
          href="/library"
          className="text-[11px] sm:text-xs px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full transition-all duration-300"
          style={{ border: `1px solid ${c.navBorder}`, color: c.textMuted }}>
          {t('nav_library', lang)}
        </motion.a>
        <motion.a
          href="/about"
          className="text-[11px] sm:text-xs px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full transition-all duration-300"
          style={{ border: `1px solid ${c.navBorder}`, color: c.textMuted }}>
          {t('nav_about', lang)}
        </motion.a>
        <motion.a
          href="/fengshui"
          className="text-[11px] sm:text-xs px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full transition-all duration-300"
          style={{ border: `1px solid ${c.navBorder}`, color: c.textMuted }}>
          {t('nav_fengshui', lang)}
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