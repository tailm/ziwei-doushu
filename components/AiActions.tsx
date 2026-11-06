'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { useLang } from '@/lib/i18n/LanguageContext';
import { t } from '@/lib/i18n/translations';

interface AiActionsProps {
  content: string;
  variant?: 'insight' | 'heming';
}

export default function AiActions({ content, variant = 'insight' }: AiActionsProps) {
  const router = useRouter();
  const { permissions, refreshPermissions } = useAuth();
  const { lang } = useLang();
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);
  const [copied, setCopied] = useState(false);
  const [tipStatus, setTipStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard not available */ }
  };

  const handleTip = async () => {
    setTipStatus('idle');
    try {
      const res = await fetch('/api/credits/deduct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feature: 'tip' }),
      });
      if (res.status === 402) {
        router.push('/recharge');
        return;
      }
      if (res.ok) {
        setTipStatus('success');
        refreshPermissions();
        setTimeout(() => setTipStatus('idle'), 3000);
        return;
      }
    } catch { /* not logged in */ }
    router.push('/recharge');
  };

  const isInsight = variant === 'insight';

  const btnBase = isInsight
    ? 'flex items-center gap-1 px-2 py-1 rounded-md text-[10px] transition-all duration-150'
    : 'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] transition-all duration-150';

  const iconSize = isInsight ? '12px' : '14px';

  return (
    <div className={`flex items-center gap-1.5 mt-3 ${isInsight ? '' : 'mt-4'}`}>
      <button
        onClick={() => setFeedback(feedback === 'up' ? null : 'up')}
        className={btnBase}
        style={{
          background: feedback === 'up' ? 'rgba(45,122,74,0.12)' : 'transparent',
          border: `1px solid ${feedback === 'up' ? 'rgba(45,122,74,0.3)' : 'var(--bdr)'}`,
          color: feedback === 'up' ? '#2D7A4A' : 'var(--tx-3)',
        }}
      >
        <span style={{ fontSize: iconSize }}>{feedback === 'up' ? '👍' : '👍'}</span>
        <span>{t('action_like', lang)}</span>
      </button>

      <button
        onClick={() => setFeedback(feedback === 'down' ? null : 'down')}
        className={btnBase}
        style={{
          background: feedback === 'down' ? 'rgba(168,50,40,0.12)' : 'transparent',
          border: `1px solid ${feedback === 'down' ? 'rgba(168,50,40,0.3)' : 'var(--bdr)'}`,
          color: feedback === 'down' ? '#A83228' : 'var(--tx-3)',
        }}
      >
        <span style={{ fontSize: iconSize }}>👎</span>
        <span>{t('action_dislike', lang)}</span>
      </button>

      <button
        onClick={handleTip}
        className={btnBase}
        style={{
          background: tipStatus === 'success' ? 'rgba(45,122,74,0.12)' : tipStatus === 'error' ? 'rgba(168,50,40,0.12)' : 'rgba(184,146,42,0.08)',
          border: `1px solid ${tipStatus === 'success' ? 'rgba(45,122,74,0.3)' : tipStatus === 'error' ? 'rgba(168,50,40,0.3)' : 'rgba(184,146,42,0.22)'}`,
          color: tipStatus === 'success' ? '#2D7A4A' : tipStatus === 'error' ? '#A83228' : 'var(--ac)',
        }}
      >
        <span style={{ fontSize: iconSize }}>{tipStatus === 'success' ? '✓' : tipStatus === 'error' ? '✕' : '☕'}</span>
        <span>{tipStatus === 'success' ? t('action_tipped', lang) : tipStatus === 'error' ? t('action_no_credits', lang) : t('action_tip', lang)}</span>
      </button>

      <button
        onClick={handleCopy}
        className={btnBase}
        style={{
          background: copied ? 'rgba(45,122,74,0.12)' : 'transparent',
          border: `1px solid ${copied ? 'rgba(45,122,74,0.3)' : 'var(--bdr)'}`,
          color: copied ? '#2D7A4A' : 'var(--tx-3)',
        }}
      >
        <span style={{ fontSize: iconSize }}>{copied ? '✓' : '📋'}</span>
        <span>{copied ? t('action_copied', lang) : t('action_copy', lang)}</span>
      </button>
    </div>
  );
}