'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { useLang } from '@/lib/i18n/LanguageContext';
import { t } from '@/lib/i18n/translations';

export default function WalletLoginButton() {
  const { user, loading, logout } = useAuth();
  const { lang } = useLang();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  if (loading) {
    return (
      <div className="w-8 h-8 rounded-full border animate-pulse" style={{ borderColor: 'var(--bdr)' }} />
    );
  }

  if (!user) {
    return (
      <button
        onClick={() => router.push('/login')}
        className="text-[11px] sm:text-xs px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full transition-all duration-300 flex items-center gap-1.5"
        style={{ border: '1px solid var(--gold-line)', color: 'var(--gold-solid)' }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M2 12C2 6.48 6.48 2 12 2C17.52 2 22 6.48 22 12C22 17.52 17.52 22 12 22" />
          <path d="M12 2V12L19 16" />
        </svg>
        {t('nav_wallet_login', lang)}
      </button>
    );
  }

  const shortAddress = `${user.wallet_address.slice(0, 6)}...${user.wallet_address.slice(-4)}`;
  const isPremium = user.membership_tier === 'premium' || user.membership_tier === 'admin';

  return (
    <div className="relative">
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="text-[11px] sm:text-xs px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full transition-all duration-300 flex items-center gap-1.5"
        style={{ border: `1px solid ${isPremium ? 'var(--gold-line)' : 'var(--bdr)'}`, color: isPremium ? 'var(--gold-solid)' : 'var(--tx-2)' }}
      >
        {isPremium && <span className="text-[9px]">★</span>}
        {user.nickname || shortAddress}
        {!isPremium && user.balance > 0 && (
          <span className="text-[9px] px-1 rounded" style={{ background: 'var(--gold-line)', color: 'var(--gold-solid)' }}>
            {user.balance.toFixed(1)}U
          </span>
        )}
      </button>

      {menuOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
          <div
            className="absolute right-0 top-full mt-2 z-50 rounded-lg shadow-lg overflow-hidden min-w-[220px]"
            style={{ background: 'var(--bg-1)', border: '1px solid var(--bdr)' }}
          >
            <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--bdr)' }}>
              <div className="text-xs font-medium" style={{ color: 'var(--tx-1)' }}>
                {user.nickname || t('nav_no_nickname', lang)}
              </div>
              <div className="text-[10px] mt-0.5" style={{ color: 'var(--tx-3)' }}>
                {shortAddress}
              </div>

            </div>
            <Link
              href="/profile"
              className="block px-4 py-2 text-xs transition-colors hover:bg-[var(--bg-2)]"
              style={{ color: 'var(--tx-2)' }}
              onClick={() => setMenuOpen(false)}
            >
              {t('nav_profile', lang)}
            </Link>
            <Link
              href="/dashboard"
              className="block px-4 py-2 text-xs transition-colors hover:bg-[var(--bg-2)]"
              style={{ color: 'var(--tx-2)' }}
              onClick={() => setMenuOpen(false)}
            >
              {t('nav_credits', lang)}
            </Link>
            <Link
              href="/recharge"
              className="block px-4 py-2 text-xs transition-colors hover:bg-[var(--bg-2)]"
              style={{ color: 'var(--tx-2)' }}
              onClick={() => setMenuOpen(false)}
            >
              {t('nav_recharge', lang)}
            </Link>
            {user.membership_tier === 'admin' && (
              <Link
                href="/admin"
                className="block px-4 py-2 text-xs transition-colors hover:bg-[var(--bg-2)]"
                style={{ color: 'var(--gold-solid)' }}
                onClick={() => setMenuOpen(false)}
              >
                {t('nav_admin', lang)}
              </Link>
            )}
            <button
              onClick={() => { logout(); setMenuOpen(false); }}
              className="block w-full text-left px-4 py-2 text-xs transition-colors"
              style={{ color: 'var(--tx-2)', borderTop: '1px solid var(--bdr)' }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-2)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              {t('nav_logout', lang)}
            </button>
          </div>
        </>
      )}
    </div>
  );
}