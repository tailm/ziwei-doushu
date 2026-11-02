'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { useRouter } from 'next/navigation';
import { useLang } from '@/lib/i18n/LanguageContext';
import { t } from '@/lib/i18n/translations';
import NavigationBar from '@/components/NavigationBar';

export default function ProfilePage() {
  const { user, loading, logout, refreshUser } = useAuth();
  const router = useRouter();
  const { lang } = useLang();
  const [nickname, setNickname] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
    if (user) {
      setNickname(user.nickname || '');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-sm" style={{ color: 'var(--tx-3)' }}>{t('profile_loading', lang)}</div>
      </div>
    );
  }

  if (!user) return null;

  const shortAddress = `${user.wallet_address.slice(0, 8)}...${user.wallet_address.slice(-6)}`;
  const isPremium = user.membership_tier === 'premium' || user.membership_tier === 'admin';

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname }),
      });
      if (!res.ok) throw new Error('failed');
      setMessage(t('profile_save_success', lang));
      await refreshUser();
    } catch {
      setMessage(t('profile_save_failed', lang));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-8 max-w-2xl mx-auto">
      <NavigationBar />
      <h1 className="text-2xl font-bold mb-8" style={{ color: 'var(--tx-1)' }}>{t('profile_title', lang)}</h1>

      <div className="rounded-xl p-6 mb-6" style={{ background: 'var(--bg-1)', border: '1px solid var(--bdr)' }}>
        <div className="flex items-center gap-4 mb-6">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold"
            style={{ background: isPremium ? 'var(--gold-line)' : 'var(--bg-2)', color: isPremium ? 'var(--gold-solid)' : 'var(--tx-2)' }}
          >
            {isPremium ? '★' : '○'}
          </div>
          <div>
            <div className="text-lg font-medium" style={{ color: 'var(--tx-1)' }}>
              {user.nickname || t('nav_no_nickname', lang)}
            </div>
            <div className="text-xs mt-1" style={{ color: 'var(--tx-3)' }}>
              {shortAddress}
            </div>
            <div className="text-xs mt-1" style={{ color: isPremium ? 'var(--gold-solid)' : 'var(--tx-3)' }}>
              {isPremium ? t('recharge_premium', lang) : t('profile_user', lang)}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--tx-3)' }}>{t('profile_nickname', lang)}</label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              maxLength={20}
              placeholder={t('profile_nickname_placeholder', lang)}
              className="w-full px-4 py-2 rounded-lg text-sm outline-none"
              style={{ background: 'var(--bg-2)', border: '1px solid var(--bdr)', color: 'var(--tx-1)' }}
            />
          </div>

          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--tx-3)' }}>{t('profile_wallet_address', lang)}</label>
            <div className="px-4 py-2 rounded-lg text-xs font-mono" style={{ background: 'var(--bg-2)', border: '1px solid var(--bdr)', color: 'var(--tx-2)' }}>
              {user.wallet_address}
            </div>
          </div>

          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--tx-3)' }}>{t('profile_registered', lang)}</label>
            <div className="px-4 py-2 rounded-lg text-xs" style={{ background: 'var(--bg-2)', border: '1px solid var(--bdr)', color: 'var(--tx-2)' }}>
              {new Date(user.created_at * 1000).toLocaleDateString(lang === 'en' ? 'en-US' : 'zh-CN')}
            </div>
          </div>

          {message && (
            <div className="text-xs" style={{ color: message === t('profile_save_success', lang) ? 'var(--gold-solid)' : '#e74c3c' }}>
              {message}
            </div>
          )}

          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 rounded-lg text-sm transition-all duration-300 disabled:opacity-50"
            style={{ background: 'var(--gold-line)', color: 'var(--gold-solid)', border: '1px solid var(--gold-line)' }}
          >
            {saving ? t('profile_saving', lang) : t('profile_save', lang)}
          </button>
        </div>
      </div>

      {isPremium && user.membership_expires_at && (
        <div className="rounded-xl p-6 mb-6" style={{ background: 'var(--bg-1)', border: '1px solid var(--gold-line)' }}>
          <h2 className="text-sm font-medium mb-2" style={{ color: 'var(--gold-solid)' }}>{t('profile_member_info', lang)}</h2>
          <div className="text-xs" style={{ color: 'var(--tx-2)' }}>
            {t('profile_member_expires', lang)}{new Date(user.membership_expires_at * 1000).toLocaleDateString(lang === 'en' ? 'en-US' : 'zh-CN')}
          </div>
        </div>
      )}

      {!isPremium && (
        <div className="rounded-xl p-6 mb-6" style={{ background: 'var(--bg-1)', border: '1px solid var(--bdr)' }}>
          <h2 className="text-sm font-medium mb-2" style={{ color: 'var(--tx-1)' }}>{t('profile_upgrade', lang)}</h2>
          <div className="text-xs mb-4" style={{ color: 'var(--tx-3)' }}>
            {t('profile_upgrade_desc', lang)}
          </div>
          <button
            onClick={() => router.push('/recharge')}
            className="px-6 py-2 rounded-lg text-sm transition-all duration-300"
            style={{ background: 'var(--gold-line)', color: 'var(--gold-solid)', border: '1px solid var(--gold-line)' }}
          >
            {t('recharge_go', lang)}
          </button>
        </div>
      )}

      <button
        onClick={() => { logout(); router.push('/'); }}
        className="text-xs px-4 py-2 rounded-lg transition-all duration-300"
        style={{ border: '1px solid var(--bdr)', color: 'var(--tx-3)' }}
      >
        {t('nav_logout', lang)}
      </button>
    </div>
  );
}