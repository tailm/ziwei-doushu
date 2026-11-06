'use client';

import { useLang } from '@/lib/i18n/LanguageContext';

interface InsufficientCreditsProps {
  message: string;
  goldSolid?: string;
}

export default function InsufficientCredits({ message, goldSolid = '#d4a843' }: InsufficientCreditsProps) {
  const { lang } = useLang();

  return (
    <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
      <p className="text-sm mb-2" style={{ color: '#f87171' }}>{message}</p>
      <a
        href="/recharge"
        className="inline-block text-sm font-medium px-4 py-1.5 rounded-lg transition-colors"
        style={{ background: goldSolid, color: '#1a1a2e' }}
      >
        {lang === 'zh' ? '前往充值' : 'Go to Recharge'}
      </a>
    </div>
  );
}