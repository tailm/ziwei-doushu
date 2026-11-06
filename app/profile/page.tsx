'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { useRouter } from 'next/navigation';
import { useLang } from '@/lib/i18n/LanguageContext';
import { t } from '@/lib/i18n/translations';
import NavigationBar from '@/components/NavigationBar';
import SiteFooter from '@/components/SiteFooter';

export default function ProfilePage() {
  const { user, loading, logout, refreshUser } = useAuth();
  const router = useRouter();
  const { lang } = useLang();
  const [nickname, setNickname] = useState('');
  const [gender, setGender] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [birthCity, setBirthCity] = useState('');
  const [currentCity, setCurrentCity] = useState('');
  const [saving, setSaving] = useState(false);
  const [savingPersonal, setSavingPersonal] = useState(false);
  const [message, setMessage] = useState('');
  const [personalMessage, setPersonalMessage] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
    if (user) {
      setNickname(user.nickname || '');
      setGender(user.gender || '');
      setBirthDate(user.birth_date || '');
      setBirthCity(user.birth_city || '');
      setCurrentCity(user.current_city || '');
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

  const handleSavePersonal = async () => {
    setSavingPersonal(true);
    setPersonalMessage('');
    try {
      const res = await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gender, birth_date: birthDate, birth_city: birthCity, current_city: currentCity }),
      });
      if (!res.ok) throw new Error('failed');
      setPersonalMessage(t('profile_save_success', lang));
      await refreshUser();
    } catch {
      setPersonalMessage(t('profile_save_failed', lang));
    } finally {
      setSavingPersonal(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-8 max-w-2xl mx-auto">
      <NavigationBar />
      <h1 className="text-2xl font-bold mb-8" style={{ color: 'var(--tx-1)' }}>{t('profile_title', lang)}</h1>

      {/* 基本信息卡片 */}
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

      {/* 个人信息卡片 */}
      <div className="rounded-xl p-6 mb-6" style={{ background: 'var(--bg-1)', border: '1px solid var(--bdr)' }}>
        <h2 className="text-sm font-medium mb-1" style={{ color: 'var(--gold-solid)' }}>{t('profile_personal_info', lang)}</h2>
        <p className="text-xs mb-5" style={{ color: 'var(--tx-3)' }}>{t('profile_personal_info_desc', lang)}</p>

        <div className="space-y-4">
          {/* 性别 */}
          <div>
            <label className="text-xs mb-2 block" style={{ color: 'var(--tx-3)' }}>{t('profile_gender', lang)}</label>
            <div className="flex gap-3">
              <button
                onClick={() => setGender('male')}
                className="px-4 py-2 rounded-lg text-sm transition-all duration-200"
                style={{
                  background: gender === 'male' ? 'var(--gold-line)' : 'var(--bg-2)',
                  border: `1px solid ${gender === 'male' ? 'var(--gold-solid)' : 'var(--bdr)'}`,
                  color: gender === 'male' ? 'var(--gold-solid)' : 'var(--tx-2)',
                }}>
                {t('profile_gender_male', lang)}
              </button>
              <button
                onClick={() => setGender('female')}
                className="px-4 py-2 rounded-lg text-sm transition-all duration-200"
                style={{
                  background: gender === 'female' ? 'var(--gold-line)' : 'var(--bg-2)',
                  border: `1px solid ${gender === 'female' ? 'var(--gold-solid)' : 'var(--bdr)'}`,
                  color: gender === 'female' ? 'var(--gold-solid)' : 'var(--tx-2)',
                }}>
                {t('profile_gender_female', lang)}
              </button>
    </div>
    </div>

          {/* 出生日期 */}
          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--tx-3)' }}>{t('profile_birth_date', lang)}</label>
            <input
              type="text"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              maxLength={20}
              placeholder={t('profile_birth_date_placeholder', lang)}
              className="w-full px-4 py-2 rounded-lg text-sm outline-none"
              style={{ background: 'var(--bg-2)', border: '1px solid var(--bdr)', color: 'var(--tx-1)' }}
            />
    </div>

          {/* 出生城市 */}
          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--tx-3)' }}>{t('profile_birth_city', lang)}</label>
            <input
              type="text"
              value={birthCity}
              onChange={(e) => setBirthCity(e.target.value)}
              maxLength={50}
              placeholder={t('profile_birth_city_placeholder', lang)}
              className="w-full px-4 py-2 rounded-lg text-sm outline-none"
              style={{ background: 'var(--bg-2)', border: '1px solid var(--bdr)', color: 'var(--tx-1)' }}
            />
    </div>

          {/* 所在城市 */}
          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--tx-3)' }}>{t('profile_current_city', lang)}</label>
            <input
              type="text"
              value={currentCity}
              onChange={(e) => setCurrentCity(e.target.value)}
              maxLength={50}
              placeholder={t('profile_current_city_placeholder', lang)}
              className="w-full px-4 py-2 rounded-lg text-sm outline-none"
              style={{ background: 'var(--bg-2)', border: '1px solid var(--bdr)', color: 'var(--tx-1)' }}
            />
    </div>

          {personalMessage && (
            <div className="text-xs" style={{ color: personalMessage === t('profile_save_success', lang) ? 'var(--gold-solid)' : '#e74c3c' }}>
              {personalMessage}
    </div>
          )}

          <button
            onClick={handleSavePersonal}
            disabled={savingPersonal}
            className="px-6 py-2 rounded-lg text-sm transition-all duration-300 disabled:opacity-50"
            style={{ background: 'var(--gold-line)', color: 'var(--gold-solid)', border: '1px solid var(--gold-line)' }}
          >
            {savingPersonal ? t('profile_saving', lang) : t('profile_save_personal', lang)}
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
      <SiteFooter />
    </div>
  );
}