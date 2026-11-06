'use client';
import { useLang } from '@/lib/i18n/LanguageContext';
import { useTheme } from '@/components/ThemeProvider';

export default function SiteFooter() {
  const { lang } = useLang();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const footerText = isDark ? 'rgba(212,168,67,0.5)' : 'rgba(140,100,20,0.5)';

  return (
    <footer className="relative z-10 py-8 px-6" style={{ borderTop: `1px solid ${isDark ? 'rgba(212,168,67,0.1)' : 'rgba(140,100,20,0.1)'}` }}>
      <div className="text-center">
        <p className="text-[10px] tracking-wider mb-3 max-w-2xl mx-auto leading-relaxed" style={{ color: footerText, opacity: 0.85 }}>
          {lang === 'zh'
            ? '本平台基于中国传统文化研究，不构成医疗、投资、法律或重大决策建议'
            : 'This platform is based on Chinese traditional culture research. It does not constitute medical, investment, legal, or major decision advice.'}
        </p>
        <p className="text-[10px] tracking-wider" style={{ color: footerText }}>
          <a href="/terms" style={{ color: footerText, textDecoration: 'underline' }}>
            {lang === 'zh' ? '服务条款' : 'Terms of Service'}
          </a>
          {' · '}
          <a href="/privacy" style={{ color: footerText, textDecoration: 'underline' }}>
            {lang === 'zh' ? '隐私政策' : 'Privacy Policy'}
          </a>
        </p>
      </div>
    </footer>
  );
}