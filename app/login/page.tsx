'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth/AuthContext';
import { useLang } from '@/lib/i18n/LanguageContext';
import { useTheme } from '@/components/ThemeProvider';

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <LoginPageInner />
    </Suspense>
  );
}

function LoginPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading, login } = useAuth();
  const { lang } = useLang();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [loginStatus, setLoginStatus] = useState<'idle' | 'connecting' | 'signing' | 'verifying' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const redirectPath = searchParams.get('redirect') || '/';

  const c = {
    bgBase: isDark ? '#020810' : '#f5efe0',
    goldSolid: isDark ? '#d4a843' : '#8b6410',
    goldLine: isDark ? 'rgba(184,137,42,0.35)' : 'rgba(140,100,20,0.25)',
    cardBg: isDark ? 'rgba(15,25,45,0.6)' : 'rgba(255,250,240,0.7)',
    border: isDark ? 'rgba(184,137,42,0.2)' : 'rgba(140,100,20,0.15)',
    text: isDark ? '#e8e0d0' : '#3a3528',
    textMuted: isDark ? '#8a8275' : '#7a7060',
    textFaint: isDark ? '#5a5448' : '#a09888',
  };

  const hasWallet = typeof window !== 'undefined' && !!window.ethereum;

  useEffect(() => {
    if (!loading && user) {
      router.push(redirectPath);
    }
  }, [user, loading, router, redirectPath]);

  const handleLogin = async () => {
    setLoginStatus('connecting');
    setErrorMsg('');

    if (!window.ethereum) {
      setLoginStatus('error');
      setErrorMsg(lang === 'zh' ? '未检测到钱包插件，请先安装 MetaMask' : 'No wallet detected. Please install MetaMask first.');
      return;
    }

    try {
      setLoginStatus('connecting');
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }) as string[];

      setLoginStatus('signing');
      const { getAddress } = await import('viem');
      const checksumAddress = getAddress(accounts[0]);

      const nonceRes = await fetch('/api/auth/nonce');
      const { nonce } = await nonceRes.json();

      const domain = window.location.host;
      const uri = window.location.origin;
      const issuedAt = new Date().toISOString();
      const message = [
        `${domain} wants you to sign in with your Ethereum account:`,
        checksumAddress,
        '',
        'Sign in to Ziwei Chart',
        '',
        `URI: ${uri}`,
        `Version: 1`,
        `Chain ID: 1`,
        `Nonce: ${nonce}`,
        `Issued At: ${issuedAt}`,
      ].join('\n');

      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [message, checksumAddress],
      }) as string;

      setLoginStatus('verifying');
      const verifyRes = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, signature }),
      });

      if (!verifyRes.ok) {
        const err = await verifyRes.json();
        throw new Error(err.error || 'Verification failed');
      }

      setLoginStatus('idle');
      router.push(redirectPath);
    } catch (error) {
      setLoginStatus('error');
      if (error instanceof Error && (error as Error & { code?: number }).code !== 4001) {
        setErrorMsg(error.message);
      } else if (error instanceof Error && (error as Error & { code?: number }).code === 4001) {
        setErrorMsg(lang === 'zh' ? '用户拒绝了签名请求' : 'User rejected the signature request');
      } else {
        setErrorMsg(lang === 'zh' ? '登录失败，请重试' : 'Login failed, please try again');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: c.bgBase }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* 品牌标识 */}
        <div className="text-center mb-8">
          <div className="inline-block mb-4">
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
              <circle cx="28" cy="28" r="26" stroke={c.goldSolid} strokeWidth="1.5" />
              <circle cx="28" cy="28" r="18" stroke={c.goldLine} strokeWidth="1" />
              <path d="M28 10 L28 46 M10 28 L46 28" stroke={c.goldSolid} strokeWidth="0.8" opacity="0.5" />
              <circle cx="28" cy="28" r="4" fill={c.goldSolid} opacity="0.8" />
            </svg>
          </div>
          <h1 className="text-xl font-bold tracking-wider" style={{ color: c.goldSolid }}>
            {lang === 'zh' ? '紫微命盘' : 'Ziwei Chart'}
          </h1>
          <p className="text-xs mt-2" style={{ color: c.textMuted }}>
            {lang === 'zh' ? '登录后即可使用起盘、合盘、AI解读等功能' : 'Sign in to access chart, compatibility, AI reading and more'}
          </p>
        </div>

        {/* 登录卡片 */}
        <div className="rounded-2xl p-6" style={{ background: c.cardBg, border: `1px solid ${c.border}` }}>
          {/* 钱包登录按钮 */}
          <button
            onClick={handleLogin}
            disabled={loginStatus !== 'idle' && loginStatus !== 'error'}
            className="w-full py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50"
            style={{
              background: `linear-gradient(135deg, ${c.goldSolid}, ${c.goldSolid}dd)`,
              color: isDark ? '#020810' : '#fff',
            }}
          >
            {loginStatus === 'idle' && (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M2 12C2 6.48 6.48 2 12 2C17.52 2 22 6.48 22 12C22 17.52 17.52 22 12 22" />
                  <path d="M12 2V12L19 16" />
                </svg>
                {lang === 'zh' ? '钱包登录' : 'Connect Wallet'}
              </>
            )}
            {loginStatus === 'connecting' && (
              <>
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                  ◯
                </motion.div>
                {lang === 'zh' ? '连接钱包中…' : 'Connecting…'}
              </>
            )}
            {loginStatus === 'signing' && (
              <>
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                  ◯
                </motion.div>
                {lang === 'zh' ? '等待签名…' : 'Waiting for signature…'}
              </>
            )}
            {loginStatus === 'verifying' && (
              <>
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                  ◯
                </motion.div>
                {lang === 'zh' ? '验证中…' : 'Verifying…'}
              </>
            )}
            {loginStatus === 'error' && (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M2 12C2 6.48 6.48 2 12 2C17.52 2 22 6.48 22 12C22 17.52 17.52 22 12 22" />
                  <path d="M12 2V12L19 16" />
                </svg>
                {lang === 'zh' ? '重新登录' : 'Retry Login'}
              </>
            )}
          </button>

          {/* 错误提示 */}
          {errorMsg && (
            <div className="mt-3 p-3 rounded-lg text-xs text-center" style={{ background: isDark ? 'rgba(239,68,68,0.1)' : 'rgba(239,68,68,0.08)', color: '#ef4444' }}>
              {errorMsg}
            </div>
          )}

          {/* 分隔线 */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px" style={{ background: c.border }} />
            <span className="text-[10px]" style={{ color: c.textFaint }}>
              {lang === 'zh' ? '没有钱包？' : 'No wallet?'}
            </span>
            <div className="flex-1 h-px" style={{ background: c.border }} />
          </div>

          {/* 安装钱包指引 */}
          <div className="space-y-3">
            <a
              href="https://metamask.io/download/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-xl transition-all duration-200"
              style={{ background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', border: `1px solid ${c.border}` }}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#f6851b' }}>
                  <span className="text-white text-sm font-bold">M</span>
                </div>
                <div>
                  <div className="text-sm font-medium" style={{ color: c.text }}>MetaMask</div>
                  <div className="text-[10px]" style={{ color: c.textMuted }}>
                    {lang === 'zh' ? '最流行的以太坊钱包' : 'Most popular Ethereum wallet'}
                  </div>
                </div>
              </div>
              <span className="text-xs" style={{ color: c.goldSolid }}>
                {lang === 'zh' ? '安装 →' : 'Install →'}
              </span>
            </a>

            <a
              href="https://www.rabby.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-xl transition-all duration-200"
              style={{ background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', border: `1px solid ${c.border}` }}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#7b3fe4' }}>
                  <span className="text-white text-sm font-bold">R</span>
                </div>
                <div>
                  <div className="text-sm font-medium" style={{ color: c.text }}>Rabby Wallet</div>
                  <div className="text-[10px]" style={{ color: c.textMuted }}>
                    {lang === 'zh' ? '安全易用的多链钱包' : 'Secure multi-chain wallet'}
                  </div>
                </div>
              </div>
              <span className="text-xs" style={{ color: c.goldSolid }}>
                {lang === 'zh' ? '安装 →' : 'Install →'}
              </span>
            </a>

            <a
              href="https://walletconnect.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-xl transition-all duration-200"
              style={{ background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', border: `1px solid ${c.border}` }}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#3b99fc' }}>
                  <span className="text-white text-sm font-bold">W</span>
                </div>
                <div>
                  <div className="text-sm font-medium" style={{ color: c.text }}>WalletConnect</div>
                  <div className="text-[10px]" style={{ color: c.textMuted }}>
                    {lang === 'zh' ? '连接200+钱包的协议' : 'Connect 200+ wallets'}
                  </div>
                </div>
              </div>
              <span className="text-xs" style={{ color: c.goldSolid }}>
                {lang === 'zh' ? '了解 →' : 'Learn →'}
              </span>
            </a>
          </div>

          {/* 说明 */}
          <div className="mt-5 pt-4 text-center" style={{ borderTop: `1px solid ${c.border}` }}>
            <p className="text-[10px] leading-relaxed" style={{ color: c.textFaint }}>
              {lang === 'zh'
                ? '登录使用 SIWE（Sign-In with Ethereum）协议，您的钱包签名即登录凭证，无需密码。我们不会存储您的私钥。'
                : 'Login uses SIWE (Sign-In with Ethereum) protocol. Your wallet signature is your credential. We never store your private keys.'}
            </p>
          </div>
        </div>

        {/* 返回首页 */}
        <div className="text-center mt-4">
          <button
            onClick={() => router.push('/')}
            className="text-xs transition-colors"
            style={{ color: c.textMuted }}
          >
            {lang === 'zh' ? '← 返回首页' : '← Back to home'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}