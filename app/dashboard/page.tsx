'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { useRouter } from 'next/navigation';
import { useLang } from '@/lib/i18n/LanguageContext';
import { t, T } from '@/lib/i18n/translations';
import NavigationBar from '@/components/NavigationBar';
import SiteFooter from '@/components/SiteFooter';

interface RechargeHistoryItem {
  id: number;
  tx_hash: string;
  amount: number;
  status: string;
  chain: string;
  token: string;
  created_at: number;
  confirmed_at: number | null;
}

interface CreditsLogItem {
  id: number;
  user_id: number;
  feature: string;
  amount: number;
  balance_after: number;
  created_at: number;
}

const FEATURE_LABELS: Record<string, { zh: string; en: string }> = {
  new_user_bonus: { zh: '新用户赠送', en: 'New User Bonus' },
  recharge_bonus: { zh: '充值赠送', en: 'Recharge Bonus' },
  chart: { zh: '起盘', en: 'Chart' },
  heming: { zh: '合盘', en: 'Compatibility' },
  ai_interpret: { zh: 'AI解盘', en: 'AI Reading' },
  ai_qa: { zh: 'AI问答', en: 'AI Q&A' },
  tip: { zh: '打赏', en: 'Tip' },
};

export default function DashboardPage() {
  const { user, loading, refreshUser, refreshPermissions, permissions } = useAuth();
  const router = useRouter();
  const { lang } = useLang();
  const [rechargeHistory, setRechargeHistory] = useState<RechargeHistoryItem[]>([]);
  const [creditsLog, setCreditsLog] = useState<CreditsLogItem[]>([]);

  const fetchRechargeHistory = useCallback(async () => {
    try {
      const res = await fetch('/api/wallet/history');
      if (res.ok) {
        const data = await res.json();
        setRechargeHistory(data.records || []);
      }
    } catch {
      // ignore
    }
  }, []);

  const fetchCreditsLog = useCallback(async () => {
    try {
      const res = await fetch('/api/credits/log');
      if (res.ok) {
        const data = await res.json();
        setCreditsLog(data.logs || []);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
    if (user) {
      fetchRechargeHistory();
      fetchCreditsLog();
    }
  }, [user, loading, router, fetchRechargeHistory, fetchCreditsLog]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-sm" style={{ color: 'var(--tx-3)' }}>{t('recharge_loading', lang)}</div>
    </div>
    );
  }

  if (!user) return null;

  const isPremium = user.membership_tier === 'premium' || user.membership_tier === 'admin';
  const credits = permissions?.credits ?? user.credits ?? 0;

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-8 max-w-2xl mx-auto">
      <NavigationBar />
      <h1 className="text-2xl font-bold mb-8" style={{ color: 'var(--tx-1)' }}>{t('credits_title', lang)}</h1>

      {/* 积分概览 */}
      <div className="rounded-xl p-6 mb-6" style={{ background: 'var(--bg-1)', border: '1px solid var(--bdr)' }}>
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-medium" style={{ color: 'var(--tx-1)' }}>
            {isPremium ? t('recharge_premium', lang) : t('credits_normal', lang)}
    </div>
          <div className="text-xs" style={{ color: 'var(--tx-3)' }}>
            {user.nickname || `${user.wallet_address.slice(0, 6)}...${user.wallet_address.slice(-4)}`}
    </div>
    </div>

        {/* 积分余额 */}
        <div className="flex items-center justify-between p-4 rounded-lg mb-4" style={{ background: 'rgba(184,146,42,0.08)', border: '1px solid rgba(184,146,42,0.2)' }}>
          <span className="text-sm" style={{ color: 'var(--ac)' }}>{t('credits_balance', lang)}</span>
          <span className="text-2xl font-bold" style={{ color: 'var(--ac)' }}>
            {isPremium ? t('credits_unlimited', lang) : credits}
          </span>
    </div>

        {/* 功能消耗说明 */}
        <div className="grid grid-cols-4 gap-3">
          <div className="text-center p-3 rounded-lg" style={{ background: 'var(--bg-2)' }}>
            <div className="text-[10px] mb-1" style={{ color: 'var(--tx-3)' }}>{t('credits_chart', lang)}</div>
            <div className="text-sm font-medium" style={{ color: 'var(--ac)' }}>{t('credits_20', lang)}</div>
    </div>
          <div className="text-center p-3 rounded-lg" style={{ background: 'var(--bg-2)' }}>
            <div className="text-[10px] mb-1" style={{ color: 'var(--tx-3)' }}>{t('credits_heming', lang)}</div>
            <div className="text-sm font-medium" style={{ color: 'var(--ac)' }}>{t('credits_50', lang)}</div>
    </div>
          <div className="text-center p-3 rounded-lg" style={{ background: 'var(--bg-2)' }}>
            <div className="text-[10px] mb-1" style={{ color: 'var(--tx-3)' }}>{t('credits_ai_interpret', lang)}</div>
            <div className="text-sm font-medium" style={{ color: 'var(--ac)' }}>{t('credits_100', lang)}</div>
    </div>
          <div className="text-center p-3 rounded-lg" style={{ background: 'var(--bg-2)' }}>
            <div className="text-[10px] mb-1" style={{ color: 'var(--tx-3)' }}>{t('credits_ai_qa', lang)}</div>
            <div className="text-sm font-medium" style={{ color: 'var(--ac)' }}>{t('credits_10', lang)}</div>
    </div>
    </div>
    </div>

      {/* 积分使用记录 */}
      {creditsLog.length > 0 && (
        <div className="rounded-xl p-6 mb-6" style={{ background: 'var(--bg-1)', border: '1px solid var(--bdr)' }}>
          <h2 className="text-sm font-medium mb-4" style={{ color: 'var(--tx-1)' }}>{t('credits_log', lang)}</h2>
          <div className="space-y-2">
            {creditsLog.map(item => (
              <div key={item.id} className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'var(--bg-2)' }}>
                <div className="flex items-center gap-3">
                  <span
                    className="text-[10px] px-2 py-1 rounded"
                    style={{
                      background: item.amount > 0 ? 'rgba(45,122,74,0.1)' : 'rgba(184,146,42,0.1)',
                      color: item.amount > 0 ? '#2D7A4A' : 'var(--ac)',
                    }}
                  >
                    {FEATURE_LABELS[item.feature]?.[lang] || item.feature}
                  </span>
                  <span className="text-[10px]" style={{ color: 'var(--tx-3)' }}>
                    {new Date(item.created_at * 1000).toLocaleString(lang === 'zh' ? 'zh-CN' : 'en-US', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
                  </span>
    </div>
                <div className="flex items-center gap-3">
                  <span
                    className="text-sm font-medium"
                    style={{ color: item.amount > 0 ? '#2D7A4A' : 'var(--ac)' }}
                  >
                    {item.amount > 0 ? `+${item.amount}` : item.amount}
                  </span>
                  <span className="text-[10px]" style={{ color: 'var(--tx-3)' }}>
                    {t('recharge_balance', lang)} {item.balance_after}
                  </span>
    </div>
    </div>
            ))}
    </div>
    </div>
      )}

      {/* 充值入口 */}
      {!isPremium && (
        <div className="rounded-xl p-6 mb-6" style={{ background: 'var(--bg-1)', border: '1px solid rgba(184,146,42,0.22)' }}>
          <h2 className="text-sm font-medium mb-3" style={{ color: 'var(--ac)' }}>{t('credits_get_more', lang)}</h2>
          <div className="text-xs mb-4" style={{ color: 'var(--tx-2)' }}>
            <ul className="space-y-1 ml-4">
              <li>• {t('recharge_benefit_1', lang)}</li>
              <li>• {t('recharge_benefit_2', lang)}</li>
              <li>• {t('recharge_benefit_3', lang)}</li>
            </ul>
    </div>
          <button
            onClick={() => router.push('/recharge')}
            className="w-full px-6 py-3 rounded-lg text-sm transition-all duration-300"
            style={{ background: 'rgba(184,146,42,0.15)', color: 'var(--ac)', border: '1px solid rgba(184,146,42,0.25)' }}
          >
            {t('recharge_go', lang)}
          </button>
    </div>
      )}

      {/* 充值记录 */}
      {rechargeHistory.length > 0 && (
        <div className="rounded-xl p-6 mb-6" style={{ background: 'var(--bg-1)', border: '1px solid var(--bdr)' }}>
          <h2 className="text-sm font-medium mb-4" style={{ color: 'var(--tx-1)' }}>{t('recharge_history', lang)}</h2>
          <div className="space-y-3">
            {rechargeHistory.map(item => (
              <div key={item.id} className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'var(--bg-2)' }}>
                <div>
                  <div className="text-xs" style={{ color: 'var(--tx-2)' }}>
                    {item.amount} {item.token || 'USDT'}
                    <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'var(--bg-1)', color: 'var(--tx-3)' }}>
                      {T[`chain_${item.chain}` as keyof typeof T]?.[lang] ?? item.chain}
                    </span>
    </div>
                  <div className="text-[10px] font-mono" style={{ color: 'var(--tx-3)' }}>
                    {item.tx_hash.slice(0, 18)}...
    </div>
    </div>
                <span
                  className="text-[10px] px-2 py-1 rounded"
                  style={{
                    background: item.status === 'confirmed' ? 'rgba(184,146,42,0.15)' : 'var(--bg-1)',
                    color: item.status === 'confirmed' ? 'var(--ac)' : 'var(--tx-3)',
                  }}
                >
                  {item.status === 'confirmed' ? t('recharge_confirmed', lang) : t('recharge_pending', lang)}
                </span>
    </div>
            ))}
    </div>
    </div>
      )}

      {/* 功能说明 */}
      <div className="rounded-xl p-6" style={{ background: 'var(--bg-1)', border: '1px solid var(--bdr)' }}>
        <h2 className="text-sm font-medium mb-3" style={{ color: 'var(--tx-1)' }}>{t('credits_rules', lang)}</h2>
        <div className="text-xs space-y-2" style={{ color: 'var(--tx-2)' }}>
          <div className="flex items-start gap-2">
            <span style={{ color: 'var(--ac)' }}>{t('credits_new_user', lang)}</span>
            <span>{t('credits_new_user_desc', lang)}</span>
    </div>
          <div className="flex items-start gap-2">
            <span style={{ color: 'var(--ac)' }}>{t('credits_recharge', lang)}</span>
            <span>{t('credits_recharge_desc', lang)}</span>
    </div>
          <div className="flex items-start gap-2">
            <span style={{ color: 'var(--ac)' }}>{t('credits_consume', lang)}</span>
            <span>{t('credits_consume_desc', lang)}</span>
    </div>
    </div>
    </div>
      <SiteFooter />
    </div>
  );
}