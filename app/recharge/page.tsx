'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { useRouter } from 'next/navigation';
import { getAddress } from 'viem';
import { useLang } from '@/lib/i18n/LanguageContext';
import { t, T } from '@/lib/i18n/translations';
import NavigationBar from '@/components/NavigationBar';

interface ChainInfo {
  id: string;
  name: string;
  name_cn: string;
  chain_id: number;
  receiving_address: string;
  token_contracts: Record<string, string>;
  token_decimals: Record<string, number>;
}

interface WalletInfo {
  balance: number;
  membership_tier: string;
  supported_chains: ChainInfo[];
  supported_tokens: string[];
}

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

const CHAIN_HEX_IDS: Record<string, string> = {
  ethereum: '0x1',
  polygon: '0x89',
  bsc: '0x38',
};

const CHAIN_ICONS: Record<string, string> = {
  ethereum: '⟠',
  polygon: '⬡',
  bsc: '⬢',
};

const TOKEN_ICONS: Record<string, string> = {
  USDT: '₮',
  USDC: '₵',
  USDS: '§',
};

const CHAIN_COLORS: Record<string, string> = {
  ethereum: '#627eea',
  polygon: '#8247e5',
  bsc: '#f3ba2f',
};

const TOKEN_COLORS: Record<string, string> = {
  USDT: '#26a17b',
  USDC: '#2775ca',
  USDS: '#6f7c8c',
};

export default function RechargePage() {
  const { user, loading, refreshUser, refreshPermissions } = useAuth();
  const router = useRouter();
  const { lang } = useLang();
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [rechargeHistory, setRechargeHistory] = useState<RechargeHistoryItem[]>([]);
  const [creditsLog, setCreditsLog] = useState<CreditsLogItem[]>([]);
  const [selectedChain, setSelectedChain] = useState<string>('ethereum');
  const [selectedToken, setSelectedToken] = useState<string>('USDT');
  const [rechargeAmount, setRechargeAmount] = useState('');
  const [recharging, setRecharging] = useState(false);
  const [rechargeMsg, setRechargeMsg] = useState('');
  const [verifying, setVerifying] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'error' | 'info' } | null>(null);

  const chainName = (chain: ChainInfo) => lang === 'zh' ? chain.name_cn : chain.name;

  const fetchWalletInfo = useCallback(async () => {
    try {
      const res = await fetch('/api/wallet/balance');
      if (res.ok) {
        const data = await res.json();
        setWalletInfo(data);
      }
    } catch {
      // ignore
    }
  }, []);

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
      fetchWalletInfo();
      fetchRechargeHistory();
      fetchCreditsLog();
    }
  }, [user, loading, router, fetchWalletInfo, fetchRechargeHistory, fetchCreditsLog]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-sm" style={{ color: 'var(--tx-3)' }}>{t('recharge_loading', lang)}</div>
      </div>
    );
  }

  if (!user) return null;

  const isPremium = user.membership_tier === 'premium' || user.membership_tier === 'admin';

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '') {
      setRechargeAmount('');
      return;
    }
    const intVal = parseInt(val, 10);
    if (!isNaN(intVal) && intVal > 0) {
      setRechargeAmount(String(intVal));
    }
  };


  const showToast = (msg: string, type: 'error' | 'info' = 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleRecharge = async () => {
    if (!window.ethereum) {
      showToast(t('recharge_err_metamask', lang));
      return;
    }

    const amount = parseInt(rechargeAmount, 10);
    if (!amount || amount <= 0) {
      showToast(t('recharge_err_amount', lang));
      return;
    }

    setRecharging(true);
    setRechargeMsg('');

    try {
      const chainHexId = CHAIN_HEX_IDS[selectedChain];
      if (chainHexId) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: chainHexId }],
          });
        } catch (switchError) {
          const err = switchError as Error & { code?: number };
          if (err.code === 4902) {
            const chainParams = getChainParams(selectedChain);
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [chainParams],
            });
          } else {
            throw switchError;
          }
        }
      }

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }) as string[];
      const fromAddress = getAddress(accounts[0]);

      const chainInfo = walletInfo?.supported_chains.find(c => c.id === selectedChain);
      if (!chainInfo) {
        showToast(t('recharge_err_chain', lang));
        setRecharging(false);
        return;
      }

      const receivingAddress = chainInfo.receiving_address;
      const tokenContract = chainInfo.token_contracts[selectedToken];

      if (!receivingAddress || receivingAddress === '0x0000000000000000000000000000000000000000') {
        showToast(t('recharge_err_addr', lang));
        setRecharging(false);
        return;
      }

      const decimals = chainInfo.token_decimals?.[selectedToken] ?? 6;
      const amountInSmallestUnit = BigInt(amount) * BigInt(10) ** BigInt(decimals);
      const data = encodeTransferCall(receivingAddress, amountInSmallestUnit);

      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{ to: tokenContract, from: fromAddress, data }],
      }) as string;

      setRechargeMsg(`${t('recharge_tx_submitted', lang)}: ${txHash.slice(0, 18)}...`);

      const rechargeRes = await fetch('/api/wallet/recharge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tx_hash: txHash,
          amount,
          from_address: fromAddress,
          chain: selectedChain,
          token: selectedToken,
        }),
      });

      if (!rechargeRes.ok) {
        const err = await rechargeRes.json();
        throw new Error(err.error || 'Recharge record creation failed');
      }

      setRechargeMsg(t('recharge_tx_waiting', lang));
      fetchRechargeHistory();
    } catch (error) {
      if (error instanceof Error && (error as Error & { code?: number }).code !== 4001) {
        setRechargeMsg(`${t('recharge_tx_failed', lang)}: ${error.message}`);
      }
    } finally {
      setRecharging(false);
    }
  };

  const handleVerify = async (txHash: string) => {
    setVerifying(txHash);
    try {
      const res = await fetch('/api/wallet/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tx_hash: txHash }),
      });

      const data = await res.json();

      if (data.status === 'confirmed') {
        setRechargeMsg(`${t('recharge_tx_success', lang)} +${data.amount} ${data.token}, ${t('recharge_balance', lang)}: ${data.new_balance?.toFixed(2)}`);
        await refreshUser();
        await refreshPermissions();
        fetchWalletInfo();
        fetchRechargeHistory();
      } else {
        setRechargeMsg(t('recharge_tx_unconfirmed', lang));
      }
    } catch {
      setRechargeMsg(t('recharge_tx_failed', lang));
    } finally {
      setVerifying(null);
    }
  };

  const currentChainInfo = walletInfo?.supported_chains.find(c => c.id === selectedChain);

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-8 max-w-2xl mx-auto">
      <NavigationBar />
      {toast && (
        <div
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-lg text-xs shadow-lg"
          style={{
            background: toast.type === 'error' ? 'rgba(248,113,113,0.15)' : 'var(--bg-2)',
            border: `1px solid ${toast.type === 'error' ? 'rgba(248,113,113,0.5)' : 'var(--bdr)'}`,
            color: toast.type === 'error' ? '#f87171' : 'var(--tx-2)',
          }}
        >
          {toast.msg}
        </div>
      )}
      <h1 className="text-2xl font-bold mb-8" style={{ color: 'var(--tx-1)' }}>{t('recharge_title', lang)}</h1>

      <div className="rounded-xl p-6 mb-6" style={{ background: 'var(--bg-1)', border: '1px solid var(--bdr)' }}>
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-medium" style={{ color: 'var(--tx-1)' }}>
            {isPremium ? t('recharge_premium', lang) : user.balance > 0 ? t('recharge_paid', lang) : t('recharge_user', lang)}
          </div>
          <div className="text-xs" style={{ color: 'var(--tx-3)' }}>
            {user.nickname || `${user.wallet_address.slice(0, 6)}...${user.wallet_address.slice(-4)}`}
          </div>
        </div>

      </div>

      {!isPremium && (
        <div className="rounded-xl p-6 mb-6" style={{ background: 'var(--bg-1)', border: '1px solid var(--gold-line)' }}>
          <h2 className="text-sm font-medium mb-4" style={{ color: 'var(--gold-solid)' }}>{t('recharge_section', lang)}</h2>

          <div className="text-xs mb-4" style={{ color: 'var(--tx-2)' }}>
            <ul className="space-y-1 ml-4">
              <li>• {t('recharge_benefit_1', lang)}</li>
              <li>• {t('recharge_benefit_2', lang)}</li>
              <li>• {t('recharge_benefit_3', lang)}</li>
            </ul>
          </div>

          <div className="mb-4">
            <label className="text-xs mb-2 block" style={{ color: 'var(--tx-3)' }}>{t('recharge_select_chain', lang)}</label>
            <div className="flex gap-3">
              {walletInfo?.supported_chains.map(chain => (
                <button
                  key={chain.id}
                  onClick={() => setSelectedChain(chain.id)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs transition-all"
                  style={{
                    border: selectedChain === chain.id ? `1px solid ${CHAIN_COLORS[chain.id]}` : '1px solid var(--bdr)',
                    color: selectedChain === chain.id ? CHAIN_COLORS[chain.id] : 'var(--tx-2)',
                    background: selectedChain === chain.id ? 'var(--bg-2)' : 'transparent',
                  }}
                >
                  <span
                    className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[11px] font-bold"
                    style={{
                      background: selectedChain === chain.id ? CHAIN_COLORS[chain.id] : 'var(--bg-1)',
                      color: selectedChain === chain.id ? '#fff' : CHAIN_COLORS[chain.id],
                    }}
                  >
                    {CHAIN_ICONS[chain.id]}
                  </span>
                  {chainName(chain)}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="text-xs mb-2 block" style={{ color: 'var(--tx-3)' }}>{t('recharge_select_token', lang)}</label>
            <div className="flex gap-3">
              {walletInfo?.supported_tokens.map(token => (
                <button
                  key={token}
                  onClick={() => setSelectedToken(token)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs transition-all"
                  style={{
                    border: selectedToken === token ? `1px solid ${TOKEN_COLORS[token]}` : '1px solid var(--bdr)',
                    color: selectedToken === token ? TOKEN_COLORS[token] : 'var(--tx-2)',
                    background: selectedToken === token ? 'var(--bg-2)' : 'transparent',
                  }}
                >
                  <span
                    className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[11px] font-bold"
                    style={{
                      background: selectedToken === token ? TOKEN_COLORS[token] : 'var(--bg-1)',
                      color: selectedToken === token ? '#fff' : TOKEN_COLORS[token],
                    }}
                  >
                    {TOKEN_ICONS[token]}
                  </span>
                  {token}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="text-xs mb-1 block" style={{ color: 'var(--tx-3)' }}>{t('recharge_amount', lang)} ({selectedToken})</label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={rechargeAmount}
              onChange={handleAmountChange}
              placeholder={t('recharge_amount_placeholder', lang)}
              className="w-full px-4 py-2.5 rounded-lg text-sm outline-none"
              style={{ background: 'var(--bg-2)', border: '1px solid var(--bdr)', color: 'var(--tx-1)' }}
            />
          </div>

          {currentChainInfo && (
            <div className="mb-4 p-3 rounded-lg space-y-2" style={{ background: 'var(--bg-2)' }}>
              <div className="flex items-center gap-2">
                <span
                  className="inline-flex items-center justify-center w-4 h-4 rounded-full text-[9px] font-bold"
                  style={{ background: CHAIN_COLORS[selectedChain], color: '#fff' }}
                >
                  {CHAIN_ICONS[selectedChain]}
                </span>
                <span className="text-[10px]" style={{ color: 'var(--tx-3)' }}>{t('recharge_receiving_addr', lang)} ({chainName(currentChainInfo)})</span>
              </div>
              <div className="text-xs font-mono break-all" style={{ color: 'var(--tx-2)' }}>
                {currentChainInfo.receiving_address}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span
                  className="inline-flex items-center justify-center w-4 h-4 rounded-full text-[9px] font-bold"
                  style={{ background: TOKEN_COLORS[selectedToken], color: '#fff' }}
                >
                  {TOKEN_ICONS[selectedToken]}
                </span>
                <span className="text-[10px]" style={{ color: 'var(--tx-3)' }}>{selectedToken} {t('recharge_contract_addr', lang)}</span>
              </div>
              <div className="text-xs font-mono break-all" style={{ color: 'var(--tx-2)' }}>
                {currentChainInfo.token_contracts[selectedToken]}
              </div>
            </div>
          )}

          <button
            onClick={handleRecharge}
            disabled={recharging || !rechargeAmount}
            className="w-full px-6 py-3 rounded-lg text-sm transition-all duration-300 disabled:opacity-50"
            style={{ background: 'var(--gold-line)', color: 'var(--gold-solid)', border: '1px solid var(--gold-line)' }}
          >
            {recharging
              ? t('recharge_processing', lang)
              : lang === 'zh'
                ? `通过 ${currentChainInfo?.name_cn || ''} 充值 ${rechargeAmount || '0'} ${selectedToken}`
                : `Recharge ${rechargeAmount || '0'} ${selectedToken} via ${currentChainInfo?.name || ''}`
            }
          </button>

          {rechargeMsg && (
            <div className="mt-3 text-xs" style={{ color: rechargeMsg.includes(t('recharge_tx_success', lang)) ? 'var(--gold-solid)' : 'var(--tx-2)' }}>
              {rechargeMsg}
            </div>
          )}
        </div>
      )}

      {rechargeHistory.length > 0 && (
        <div className="rounded-xl p-6 mb-6" style={{ background: 'var(--bg-1)', border: '1px solid var(--bdr)' }}>
          <h2 className="text-sm font-medium mb-4" style={{ color: 'var(--tx-1)' }}>{t('recharge_history', lang)}</h2>
          <div className="space-y-3">
            {rechargeHistory.map(item => (
              <div key={item.id} className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'var(--bg-2)' }}>
                <div>
                  <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--tx-2)' }}>
                    <span
                      className="inline-flex items-center justify-center w-4 h-4 rounded-full text-[8px] font-bold"
                      style={{ background: TOKEN_COLORS[item.token] || TOKEN_COLORS.USDT, color: '#fff' }}
                    >
                      {TOKEN_ICONS[item.token] || '₮'}
                    </span>
                    {item.amount} {item.token || 'USDT'}
                    <span
                      className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded"
                      style={{ background: 'var(--bg-1)', color: 'var(--tx-3)' }}
                    >
                      <span
                        className="inline-flex items-center justify-center w-3 h-3 rounded-full text-[7px] font-bold"
                        style={{ background: CHAIN_COLORS[item.chain] || CHAIN_COLORS.ethereum, color: '#fff' }}
                      >
                        {CHAIN_ICONS[item.chain] || '⟠'}
                      </span>
                      {T[`chain_${item.chain}` as keyof typeof T]?.[lang] ?? item.chain}
                    </span>
                  </div>
                  <div className="text-[10px] font-mono" style={{ color: 'var(--tx-3)' }}>
                    {item.tx_hash.slice(0, 18)}...
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="text-[10px] px-2 py-1 rounded"
                    style={{
                      background: item.status === 'confirmed' ? 'var(--gold-line)' : 'var(--bg-1)',
                      color: item.status === 'confirmed' ? 'var(--gold-solid)' : 'var(--tx-3)',
                    }}
                  >
                    {item.status === 'confirmed' ? t('recharge_confirmed', lang) : t('recharge_pending', lang)}
                  </span>
                  {item.status === 'pending' && (
                    <button
                      onClick={() => handleVerify(item.tx_hash)}
                      disabled={verifying === item.tx_hash}
                      className="text-[10px] px-2 py-1 rounded transition-all disabled:opacity-50"
                      style={{ border: '1px solid var(--gold-line)', color: 'var(--gold-solid)' }}
                    >
                      {verifying === item.tx_hash ? t('recharge_verifying', lang) : t('recharge_verify', lang)}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {creditsLog.length > 0 && (
        <div className="rounded-xl p-6 mb-6" style={{ background: 'var(--bg-1)', border: '1px solid var(--bdr)' }}>
          <h2 className="text-sm font-medium mb-4" style={{ color: 'var(--tx-1)' }}>{t('recharge_credits_log', lang)}</h2>
          <div className="space-y-2">
            {creditsLog.map(item => (
              <div key={item.id} className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'var(--bg-2)' }}>
                <div className="flex items-center gap-3">
                  <span
                    className="text-[10px] px-2 py-1 rounded"
                    style={{
                      background: item.amount > 0 ? 'rgba(45,122,74,0.1)' : 'rgba(184,146,42,0.1)',
                      color: item.amount > 0 ? '#2D7A4A' : 'var(--gold-solid)',
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
                    style={{ color: item.amount > 0 ? '#2D7A4A' : 'var(--gold-solid)' }}
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
    </div>
  );
}

function encodeTransferCall(to: string, amount: bigint): string {
  const transferSelector = '0xa9059cbb';
  const toPadded = to.slice(2).toLowerCase().padStart(64, '0');
  const amountHex = amount.toString(16).padStart(64, '0');
  return transferSelector + toPadded + amountHex;
}

function getChainParams(chainId: string): Record<string, unknown> {
  const params: Record<string, Record<string, unknown>> = {
    ethereum: {
      chainId: '0x1',
      chainName: 'Ethereum Mainnet',
      nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: '18' },
      rpcUrls: [process.env.NEXT_PUBLIC_ETH_RPC_URL || 'https://eth.llamarpc.com'],
      blockExplorerUrls: ['https://etherscan.io'],
    },
    polygon: {
      chainId: '0x89',
      chainName: 'Polygon Mainnet',
      nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: '18' },
      rpcUrls: [process.env.NEXT_PUBLIC_POLYGON_RPC_URL || 'https://polygon-rpc.com'],
      blockExplorerUrls: ['https://polygonscan.com'],
    },
    bsc: {
      chainId: '0x38',
      chainName: 'BSC Mainnet',
      nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: '18' },
      rpcUrls: [process.env.NEXT_PUBLIC_BSC_RPC_URL || 'https://bsc-dataseed1.binance.org'],
      blockExplorerUrls: ['https://bscscan.com'],
    },
  };
  return params[chainId] || params.ethereum;
}