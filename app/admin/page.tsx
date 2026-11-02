'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { useRouter } from 'next/navigation';
import NavigationBar from '@/components/NavigationBar';

interface AdminUser {
  id: number;
  wallet_address: string;
  nickname: string | null;
  membership_tier: string;
  membership_expires_at: number | null;
  balance: number;
  created_at: number;
}

interface AdminRechargeRecord {
  id: number;
  user_id: number;
  tx_hash: string;
  amount: number;
  status: string;
  from_address: string;
  to_address: string;
  chain: string;
  token: string;
  created_at: number;
  confirmed_at: number | null;
}

type Tab = 'users' | 'recharge';

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('users');
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [records, setRecords] = useState<AdminRechargeRecord[]>([]);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [editTier, setEditTier] = useState('free');
  const [editExpires, setEditExpires] = useState('');
  const [editBalance, setEditBalance] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [searchAddr, setSearchAddr] = useState('');

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      }
    } catch {
      // ignore
    }
  }, []);

  const fetchRecords = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/recharge');
      if (res.ok) {
        const data = await res.json();
        setRecords(data.records || []);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/');
        return;
      }
      if (user.membership_tier !== 'admin') {
        router.push('/');
        return;
      }
      fetchUsers();
      fetchRecords();
    }
  }, [user, loading, router, fetchUsers, fetchRecords]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-sm" style={{ color: 'var(--tx-3)' }}>加载中...</div>
      </div>
    );
  }

  if (!user || user.membership_tier !== 'admin') return null;

  const handleEditUser = (u: AdminUser) => {
    setEditingUser(u);
    setEditTier(u.membership_tier === 'admin' ? 'free' : u.membership_tier);
    setEditExpires(u.membership_expires_at ? new Date(u.membership_expires_at * 1000).toISOString().slice(0, 10) : '');
    setEditBalance(String(u.balance));
    setMsg('');
  };

  const handleSaveUser = async () => {
    if (!editingUser) return;
    setSaving(true);
    setMsg('');

    try {
      let expiresAt: number | null = null;
      if (editExpires && editTier === 'premium') {
        expiresAt = Math.floor(new Date(editExpires).getTime() / 1000);
      }

      const tierRes = await fetch('/api/admin/membership', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: editingUser.id, tier: editTier, expires_at: expiresAt }),
      });

      if (!tierRes.ok) {
        const err = await tierRes.json();
        throw new Error(err.error || '会员设置失败');
      }

      const balanceRes = await fetch('/api/admin/balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: editingUser.id, balance: parseFloat(editBalance) || 0 }),
      });

      if (!balanceRes.ok) {
        const err = await balanceRes.json();
        throw new Error(err.error || '余额设置失败');
      }

      setMsg(`用户 ${editingUser.wallet_address.slice(0, 8)}... 已更新`);
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      setMsg(error instanceof Error ? error.message : '保存失败');
    } finally {
      setSaving(false);
    }
  };

  const filteredUsers = searchAddr
    ? users.filter(u => u.wallet_address.toLowerCase().includes(searchAddr.toLowerCase()) || (u.nickname || '').toLowerCase().includes(searchAddr.toLowerCase()))
    : users;

  const stats = {
    total: users.length,
    premium: users.filter(u => u.membership_tier === 'premium').length,
    free: users.filter(u => u.membership_tier === 'free').length,
    totalBalance: users.reduce((sum, u) => sum + u.balance, 0),
    pendingRecharges: records.filter(r => r.status === 'pending').length,
    confirmedRecharges: records.filter(r => r.status === 'confirmed').length,
    totalRechargeAmount: records.filter(r => r.status === 'confirmed').reduce((sum, r) => sum + r.amount, 0),
  };

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-8 max-w-5xl mx-auto">
      <NavigationBar />
      <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--tx-1)' }}>管理后台</h1>
      <div className="text-xs mb-6" style={{ color: 'var(--tx-3)' }}>
        管理员: {user.wallet_address.slice(0, 10)}...
      </div>

      <div className="grid grid-cols-4 gap-3 mb-6">
        <div className="rounded-lg p-3" style={{ background: 'var(--bg-1)', border: '1px solid var(--bdr)' }}>
          <div className="text-[10px]" style={{ color: 'var(--tx-3)' }}>总用户</div>
          <div className="text-lg font-bold" style={{ color: 'var(--tx-1)' }}>{stats.total}</div>
        </div>
        <div className="rounded-lg p-3" style={{ background: 'var(--bg-1)', border: '1px solid var(--bdr)' }}>
          <div className="text-[10px]" style={{ color: 'var(--tx-3)' }}>会员</div>
          <div className="text-lg font-bold" style={{ color: 'var(--gold-solid)' }}>{stats.premium}</div>
        </div>
        <div className="rounded-lg p-3" style={{ background: 'var(--bg-1)', border: '1px solid var(--bdr)' }}>
          <div className="text-[10px]" style={{ color: 'var(--tx-3)' }}>总余额</div>
          <div className="text-lg font-bold" style={{ color: 'var(--gold-solid)' }}>{stats.totalBalance.toFixed(1)}U</div>
        </div>
        <div className="rounded-lg p-3" style={{ background: 'var(--bg-1)', border: '1px solid var(--bdr)' }}>
          <div className="text-[10px]" style={{ color: 'var(--tx-3)' }}>待确认充值</div>
          <div className="text-lg font-bold" style={{ color: stats.pendingRecharges > 0 ? 'var(--gold-solid)' : 'var(--tx-1)' }}>{stats.pendingRecharges}</div>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setTab('users')}
          className="px-4 py-2 rounded-lg text-xs transition-all"
          style={{
            background: tab === 'users' ? 'var(--bg-2)' : 'transparent',
            border: `1px solid ${tab === 'users' ? 'var(--gold-line)' : 'var(--bdr)'}`,
            color: tab === 'users' ? 'var(--gold-solid)' : 'var(--tx-2)',
          }}
        >
          用户管理
        </button>
        <button
          onClick={() => setTab('recharge')}
          className="px-4 py-2 rounded-lg text-xs transition-all"
          style={{
            background: tab === 'recharge' ? 'var(--bg-2)' : 'transparent',
            border: `1px solid ${tab === 'recharge' ? 'var(--gold-line)' : 'var(--bdr)'}`,
            color: tab === 'recharge' ? 'var(--gold-solid)' : 'var(--tx-2)',
          }}
        >
          充值记录
        </button>
      </div>

      {tab === 'users' && (
        <div className="rounded-xl p-4" style={{ background: 'var(--bg-1)', border: '1px solid var(--bdr)' }}>
          <input
            type="text"
            placeholder="搜索钱包地址或昵称..."
            value={searchAddr}
            onChange={e => setSearchAddr(e.target.value)}
            className="w-full px-3 py-2 rounded-lg text-xs mb-3 outline-none"
            style={{ background: 'var(--bg-2)', border: '1px solid var(--bdr)', color: 'var(--tx-1)' }}
          />

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--bdr)' }}>
                  <th className="text-left py-2 px-2" style={{ color: 'var(--tx-3)' }}>ID</th>
                  <th className="text-left py-2 px-2" style={{ color: 'var(--tx-3)' }}>钱包地址</th>
                  <th className="text-left py-2 px-2" style={{ color: 'var(--tx-3)' }}>昵称</th>
                  <th className="text-left py-2 px-2" style={{ color: 'var(--tx-3)' }}>等级</th>
                  <th className="text-right py-2 px-2" style={{ color: 'var(--tx-3)' }}>余额</th>
                  <th className="text-left py-2 px-2" style={{ color: 'var(--tx-3)' }}>注册时间</th>
                  <th className="text-center py-2 px-2" style={{ color: 'var(--tx-3)' }}>操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid var(--bdr)' }}>
                    <td className="py-2 px-2" style={{ color: 'var(--tx-3)' }}>{u.id}</td>
                    <td className="py-2 px-2 font-mono" style={{ color: 'var(--tx-2)' }}>
                      {u.wallet_address.slice(0, 8)}...{u.wallet_address.slice(-4)}
                    </td>
                    <td className="py-2 px-2" style={{ color: 'var(--tx-2)' }}>{u.nickname || '-'}</td>
                    <td className="py-2 px-2">
                      <span
                        className="text-[10px] px-1.5 py-0.5 rounded"
                        style={{
                          background: u.membership_tier === 'premium' ? 'var(--gold-line)' : u.membership_tier === 'admin' ? 'var(--gold-solid)' : 'var(--bg-2)',
                          color: u.membership_tier === 'premium' ? 'var(--gold-solid)' : u.membership_tier === 'admin' ? '#fff' : 'var(--tx-3)',
                        }}
                      >
                        {u.membership_tier === 'premium' ? '★ 会员' : u.membership_tier === 'admin' ? '管理员' : '免费'}
                      </span>
                    </td>
                    <td className="py-2 px-2 text-right" style={{ color: 'var(--gold-solid)' }}>{u.balance.toFixed(2)}</td>
                    <td className="py-2 px-2" style={{ color: 'var(--tx-3)' }}>
                      {new Date(u.created_at * 1000).toLocaleDateString('zh-CN')}
                    </td>
                    <td className="py-2 px-2 text-center">
                      {u.membership_tier !== 'admin' && (
                        <button
                          onClick={() => handleEditUser(u)}
                          className="text-[10px] px-2 py-1 rounded transition-all"
                          style={{ border: '1px solid var(--gold-line)', color: 'var(--gold-solid)' }}
                        >
                          编辑
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-8 text-xs" style={{ color: 'var(--tx-3)' }}>暂无用户数据</div>
          )}
        </div>
      )}

      {tab === 'recharge' && (
        <div className="rounded-xl p-4" style={{ background: 'var(--bg-1)', border: '1px solid var(--bdr)' }}>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center p-2 rounded-lg" style={{ background: 'var(--bg-2)' }}>
              <div className="text-[10px]" style={{ color: 'var(--tx-3)' }}>已确认</div>
              <div className="text-sm font-bold" style={{ color: 'var(--gold-solid)' }}>{stats.confirmedRecharges}</div>
            </div>
            <div className="text-center p-2 rounded-lg" style={{ background: 'var(--bg-2)' }}>
              <div className="text-[10px]" style={{ color: 'var(--tx-3)' }}>待确认</div>
              <div className="text-sm font-bold" style={{ color: 'var(--tx-1)' }}>{stats.pendingRecharges}</div>
            </div>
            <div className="text-center p-2 rounded-lg" style={{ background: 'var(--bg-2)' }}>
              <div className="text-[10px]" style={{ color: 'var(--tx-3)' }}>总充值额</div>
              <div className="text-sm font-bold" style={{ color: 'var(--gold-solid)' }}>{stats.totalRechargeAmount.toFixed(1)}U</div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--bdr)' }}>
                  <th className="text-left py-2 px-2" style={{ color: 'var(--tx-3)' }}>ID</th>
                  <th className="text-left py-2 px-2" style={{ color: 'var(--tx-3)' }}>用户</th>
                  <th className="text-left py-2 px-2" style={{ color: 'var(--tx-3)' }}>Tx Hash</th>
                  <th className="text-right py-2 px-2" style={{ color: 'var(--tx-3)' }}>金额</th>
                  <th className="text-left py-2 px-2" style={{ color: 'var(--tx-3)' }}>链/代币</th>
                  <th className="text-left py-2 px-2" style={{ color: 'var(--tx-3)' }}>状态</th>
                  <th className="text-left py-2 px-2" style={{ color: 'var(--tx-3)' }}>时间</th>
                </tr>
              </thead>
              <tbody>
                {records.map(r => {
                  const userRecord = users.find(u => u.id === r.user_id);
                  return (
                    <tr key={r.id} style={{ borderBottom: '1px solid var(--bdr)' }}>
                      <td className="py-2 px-2" style={{ color: 'var(--tx-3)' }}>{r.id}</td>
                      <td className="py-2 px-2 font-mono" style={{ color: 'var(--tx-2)' }}>
                        {userRecord ? `${userRecord.wallet_address.slice(0, 6)}...${userRecord.wallet_address.slice(-4)}` : `User#${r.user_id}`}
                      </td>
                      <td className="py-2 px-2 font-mono" style={{ color: 'var(--tx-3)' }}>
                        {r.tx_hash.slice(0, 12)}...{r.tx_hash.slice(-4)}
                      </td>
                      <td className="py-2 px-2 text-right" style={{ color: 'var(--gold-solid)' }}>{r.amount} {r.token}</td>
                      <td className="py-2 px-2" style={{ color: 'var(--tx-2)' }}>{r.chain}/{r.token}</td>
                      <td className="py-2 px-2">
                        <span
                          className="text-[10px] px-1.5 py-0.5 rounded"
                          style={{
                            background: r.status === 'confirmed' ? 'var(--gold-line)' : 'var(--bg-2)',
                            color: r.status === 'confirmed' ? 'var(--gold-solid)' : 'var(--tx-3)',
                          }}
                        >
                          {r.status === 'confirmed' ? '已确认' : '待确认'}
                        </span>
                      </td>
                      <td className="py-2 px-2" style={{ color: 'var(--tx-3)' }}>
                        {new Date(r.created_at * 1000).toLocaleDateString('zh-CN')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {records.length === 0 && (
            <div className="text-center py-8 text-xs" style={{ color: 'var(--tx-3)' }}>暂无充值记录</div>
          )}
        </div>
      )}

      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={() => setEditingUser(null)}>
          <div
            className="rounded-xl p-6 max-w-md w-full"
            style={{ background: 'var(--bg-1)', border: '1px solid var(--bdr)' }}
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-sm font-bold mb-4" style={{ color: 'var(--tx-1)' }}>
              编辑用户 {editingUser.wallet_address.slice(0, 8)}...
            </h2>

            <div className="mb-4">
              <label className="text-xs mb-1 block" style={{ color: 'var(--tx-3)' }}>会员等级</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditTier('free')}
                  className="px-3 py-1.5 rounded-lg text-xs transition-all"
                  style={{
                    border: editTier === 'free' ? '1px solid var(--gold-line)' : '1px solid var(--bdr)',
                    color: editTier === 'free' ? 'var(--gold-solid)' : 'var(--tx-2)',
                  }}
                >
                  免费
                </button>
                <button
                  onClick={() => setEditTier('premium')}
                  className="px-3 py-1.5 rounded-lg text-xs transition-all"
                  style={{
                    border: editTier === 'premium' ? '1px solid var(--gold-line)' : '1px solid var(--bdr)',
                    color: editTier === 'premium' ? 'var(--gold-solid)' : 'var(--tx-2)',
                  }}
                >
                  ★ 会员
                </button>
              </div>
            </div>

            {editTier === 'premium' && (
              <div className="mb-4">
                <label className="text-xs mb-1 block" style={{ color: 'var(--tx-3)' }}>会员到期日（留空=永久）</label>
                <input
                  type="date"
                  value={editExpires}
                  onChange={e => setEditExpires(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-xs outline-none"
                  style={{ background: 'var(--bg-2)', border: '1px solid var(--bdr)', color: 'var(--tx-1)' }}
                />
              </div>
            )}

            <div className="mb-4">
              <label className="text-xs mb-1 block" style={{ color: 'var(--tx-3)' }}>余额 (USDT)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={editBalance}
                onChange={e => setEditBalance(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-xs outline-none"
                style={{ background: 'var(--bg-2)', border: '1px solid var(--bdr)', color: 'var(--tx-1)' }}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSaveUser}
                disabled={saving}
                className="flex-1 px-4 py-2 rounded-lg text-xs transition-all disabled:opacity-50"
                style={{ background: 'var(--gold-line)', color: 'var(--gold-solid)', border: '1px solid var(--gold-line)' }}
              >
                {saving ? '保存中...' : '保存'}
              </button>
              <button
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 rounded-lg text-xs transition-all"
                style={{ border: '1px solid var(--bdr)', color: 'var(--tx-2)' }}
              >
                取消
              </button>
            </div>

            {msg && (
              <div className="mt-3 text-xs" style={{ color: msg.includes('已更新') ? 'var(--gold-solid)' : 'var(--tx-2)' }}>
                {msg}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}