'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { useRouter } from 'next/navigation';
import NavigationBar from '@/components/NavigationBar';
import SiteFooter from '@/components/SiteFooter';

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

interface AdminStats {
  user_registration_trend: Array<{ date: string; count: number }>;
  daily_active_users: Array<{ date: string; count: number }>;
  checkin_by_type: Array<{ type: string; total: number; last_7d: number }>;
  checkin_trend_30d: Array<{ date: string; count: number }>;
  feature_usage: Array<{ feature: string; click_count: number; zh: string; icon: string; category: string }>;
  recharge_summary: {
    total_confirmed: number;
    total_pending: number;
    total_amount: number;
    last_30d_amount: number;
  };
  user_summary: {
    total: number;
    premium: number;
    free: number;
    new_7d: number;
    new_30d: number;
  };
}

interface AdminCreditsLog {
  id: number;
  user_id: number;
  feature: string;
  amount: number;
  balance_after: number;
  created_at: number;
}

interface AdminCheckinRecord {
  id: number;
  user_id: number;
  practice_type: string;
  sub_type: string | null;
  duration_minutes: number;
  note: string | null;
  created_at: string;
  wallet_address: string;
  nickname: string | null;
}

interface AdminRecitationRecord {
  id: number;
  user_id: number;
  session_type: string;
  sutra_key: string;
  sutra_name: string;
  duration_minutes: number;
  created_at: string;
  wallet_address: string;
  nickname: string | null;
}

interface AdminPrayerRecord {
  id: number;
  user_id: number;
  type: string;
  content: string;
  target: string | null;
  deity: string | null;
  category: string | null;
  created_at: string;
  wallet_address: string;
  nickname: string | null;
}

type Tab = 'users' | 'recharge' | 'credits' | 'checkins' | 'prayers';

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('users');
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [records, setRecords] = useState<AdminRechargeRecord[]>([]);
  const [creditsLog, setCreditsLog] = useState<AdminCreditsLog[]>([]);
  const [statsData, setStatsData] = useState<AdminStats | null>(null);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [showStats, setShowStats] = useState(false);
  const [editTier, setEditTier] = useState('free');
  const [editExpires, setEditExpires] = useState('');
  const [editBalance, setEditBalance] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [searchAddr, setSearchAddr] = useState('');
  const [tierFilter, setTierFilter] = useState<'all' | 'free' | 'premium' | 'admin'>('all');
  const [rechargeStatusFilter, setRechargeStatusFilter] = useState<'all' | 'confirmed' | 'pending'>('all');
  const [creditsSearch, setCreditsSearch] = useState('');
  const [creditsSortBy, setCreditsSortBy] = useState<'balance' | 'gained' | 'spent' | 'count'>('balance');
  const [creditsFeatureFilter, setCreditsFeatureFilter] = useState<'all' | string>('all');
  const [showUserCredits, setShowUserCredits] = useState(false);
  const [userCreditsDetail, setUserCreditsDetail] = useState<AdminCreditsLog[]>([]);
  const [checkinRecords, setCheckinRecords] = useState<{ wellness: AdminCheckinRecord[]; recitation: AdminRecitationRecord[] }>({ wellness: [], recitation: [] });
  const [prayerRecords, setPrayerRecords] = useState<AdminPrayerRecord[]>([]);
  const [checkinTypeFilter, setCheckinTypeFilter] = useState<'all' | string>('all');
  const [checkinSearch, setCheckinSearch] = useState('');
  const [checkinDateFrom, setCheckinDateFrom] = useState('');
  const [checkinDateTo, setCheckinDateTo] = useState('');
  const [prayerTypeFilter, setPrayerTypeFilter] = useState<'all' | string>('all');
  const [prayerSearch, setPrayerSearch] = useState('');
  const [rechargeSearch, setRechargeSearch] = useState('');
  const [confirmingId, setConfirmingId] = useState<number | null>(null);
  const [confirmMsg, setConfirmMsg] = useState('');

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

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/stats');
      if (res.ok) {
        const data = await res.json();
        setStatsData(data.stats || null);
      }
    } catch {
      // ignore
    }
  }, []);

  const fetchCreditsLog = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/credits');
      if (res.ok) {
        const data = await res.json();
        setCreditsLog(data.records || []);
      }
    } catch {
      // ignore
    }
  }, []);

  const fetchCheckins = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/checkins');
      if (res.ok) {
        const data = await res.json();
        setCheckinRecords({ wellness: data.wellness || [], recitation: data.recitation || [] });
      }
    } catch {
      // ignore
    }
  }, []);

  const fetchPrayers = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/prayers');
      if (res.ok) {
        const data = await res.json();
        setPrayerRecords(data.records || []);
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
      fetchCreditsLog();
      fetchCheckins();
      fetchPrayers();
    }
  }, [user, loading, router, fetchUsers, fetchRecords, fetchCreditsLog, fetchCheckins, fetchPrayers]);

  const handleOpenStats = () => {
    fetchStats();
    setShowStats(true);
  };

  const handleConfirmRecharge = async (recordId: number, action: 'confirm' | 'reject') => {
    setConfirmingId(recordId);
    setConfirmMsg('');
    try {
      const res = await fetch('/api/admin/recharge/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ record_id: recordId, action }),
      });
      const data = await res.json();
      if (res.ok) {
        setConfirmMsg(data.message || '操作成功');
        fetchRecords();
        fetchUsers();
      } else {
        setConfirmMsg(data.error || '操作失败');
      }
    } catch {
      setConfirmMsg('网络错误');
    } finally {
      setConfirmingId(null);
    }
  };

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

  const filteredUsers = users.filter(u => {
    const matchSearch = !searchAddr ||
      u.wallet_address.toLowerCase().includes(searchAddr.toLowerCase()) ||
      (u.nickname || '').toLowerCase().includes(searchAddr.toLowerCase());
    const matchTier = tierFilter === 'all' || u.membership_tier === tierFilter;
    return matchSearch && matchTier;
  });

  const filteredRecords = records.filter(r => {
    const matchStatus = rechargeStatusFilter === 'all' || r.status === rechargeStatusFilter;
    const matchSearch = !rechargeSearch ||
      r.tx_hash.toLowerCase().includes(rechargeSearch.toLowerCase()) ||
      r.from_address.toLowerCase().includes(rechargeSearch.toLowerCase());
    return matchStatus && matchSearch;
  });

  const allFeatures = Array.from(new Set(creditsLog.map(l => l.feature))).sort();

  const checkinTypeLabels: Record<string, string> = {
    vegetarian: '吃斋',
    meditation: '打坐',
    reflection: '每日三省',
    taichi: '太极',
    charity: '积德行善',
    recitation: '诵经',
  };

  const allCheckinRecords: Array<{
    id: number; user_id: number; type: string; typeLabel: string; detail: string;
    duration: number; note: string | null; created_at: string;
    wallet_address: string; nickname: string | null;
  }> = [
    ...checkinRecords.wellness.map(w => ({
      id: w.id,
      user_id: w.user_id,
      type: w.practice_type,
      typeLabel: checkinTypeLabels[w.practice_type] || w.practice_type,
      detail: w.sub_type || '',
      duration: w.duration_minutes,
      note: w.note,
      created_at: w.created_at,
      wallet_address: w.wallet_address,
      nickname: w.nickname,
    })),
    ...checkinRecords.recitation.map(r => ({
      id: r.id + 100000,
      user_id: r.user_id,
      type: 'recitation',
      typeLabel: '诵经',
      detail: r.sutra_name + (r.session_type === 'morning' ? ' (早课)' : ' (晚课)'),
      duration: r.duration_minutes,
      note: null,
      created_at: r.created_at,
      wallet_address: r.wallet_address,
      nickname: r.nickname,
    })),
  ].sort((a, b) => b.created_at.localeCompare(a.created_at));

  const filteredCheckins = allCheckinRecords.filter(r => {
    const matchType = checkinTypeFilter === 'all' || r.type === checkinTypeFilter;
    const matchSearch = !checkinSearch ||
      r.wallet_address.toLowerCase().includes(checkinSearch.toLowerCase()) ||
      (r.nickname || '').toLowerCase().includes(checkinSearch.toLowerCase());
    const recordDate = r.created_at.slice(0, 10);
    const matchDateFrom = !checkinDateFrom || recordDate >= checkinDateFrom;
    const matchDateTo = !checkinDateTo || recordDate <= checkinDateTo;
    return matchType && matchSearch && matchDateFrom && matchDateTo;
  });

  const filteredPrayers = prayerRecords.filter(r => {
    const matchType = prayerTypeFilter === 'all' || r.type === prayerTypeFilter;
    const matchSearch = !prayerSearch ||
      r.wallet_address.toLowerCase().includes(prayerSearch.toLowerCase()) ||
      (r.nickname || '').toLowerCase().includes(prayerSearch.toLowerCase()) ||
      r.content.toLowerCase().includes(prayerSearch.toLowerCase());
    return matchType && matchSearch;
  });

  const allPrayerTypes = Array.from(new Set(prayerRecords.map(r => r.type))).sort();

  const creditsSummary = users.map(u => {
    const userLogs = creditsLog.filter(l => {
      if (l.user_id !== u.id) return false;
      if (creditsFeatureFilter !== 'all' && l.feature !== creditsFeatureFilter) return false;
      return true;
    });
    const gained = userLogs.filter(l => l.amount > 0).reduce((s, l) => s + l.amount, 0);
    const spent = userLogs.filter(l => l.amount < 0).reduce((s, l) => s + l.amount, 0);
    return {
      ...u,
      gained,
      spent,
      count: userLogs.length,
      logs: userLogs,
    };
  }).filter(u => {
    const matchSearch = !creditsSearch ||
      u.wallet_address.toLowerCase().includes(creditsSearch.toLowerCase()) ||
      (u.nickname || '').toLowerCase().includes(creditsSearch.toLowerCase());
    return matchSearch;
  }).sort((a, b) => {
    switch (creditsSortBy) {
      case 'gained': return b.gained - a.gained;
      case 'spent': return a.spent - b.spent;
      case 'count': return b.count - a.count;
      default: return b.balance - a.balance;
    }
  });

  const stats = {
    total: users.length,
    premium: users.filter(u => u.membership_tier === 'premium').length,
    free: users.filter(u => u.membership_tier === 'free').length,
    totalBalance: users.reduce((sum, u) => sum + u.balance, 0),
    pendingRecharges: records.filter(r => r.status === 'pending').length,
    confirmedRecharges: records.filter(r => r.status === 'confirmed').length,
    totalRechargeAmount: records.filter(r => r.status === 'confirmed').reduce((sum, r) => sum + r.amount, 0),
    totalCheckins: checkinRecords.wellness.length + checkinRecords.recitation.length,
    totalCreditsGained: creditsLog.filter(l => l.amount > 0).reduce((s, l) => s + l.amount, 0),
  };

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-8 max-w-5xl mx-auto">
      <NavigationBar />
      <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--tx-1)' }}>管理后台</h1>
      <div className="text-xs mb-6" style={{ color: 'var(--tx-3)' }}>
        管理员: {user.wallet_address.slice(0, 10)}...
      </div>

      <div className="grid grid-cols-6 gap-3 mb-6">
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
        <div className="rounded-lg p-3" style={{ background: 'var(--bg-1)', border: '1px solid var(--bdr)' }}>
          <div className="text-[10px]" style={{ color: 'var(--tx-3)' }}>总修行次数</div>
          <div className="text-lg font-bold" style={{ color: 'var(--gold-solid)' }}>{stats.totalCheckins}</div>
        </div>
        <div className="rounded-lg p-3" style={{ background: 'var(--bg-1)', border: '1px solid var(--bdr)' }}>
          <div className="text-[10px]" style={{ color: 'var(--tx-3)' }}>总积分发放</div>
          <div className="text-lg font-bold" style={{ color: 'var(--gold-solid)' }}>{stats.totalCreditsGained}</div>
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
        <button
          onClick={() => setTab('credits')}
          className="px-4 py-2 rounded-lg text-xs transition-all"
          style={{
            background: tab === 'credits' ? 'var(--bg-2)' : 'transparent',
            border: `1px solid ${tab === 'credits' ? 'var(--gold-line)' : 'var(--bdr)'}`,
            color: tab === 'credits' ? 'var(--gold-solid)' : 'var(--tx-2)',
          }}
        >
          积分管理
        </button>
        <button
          onClick={() => setTab('checkins')}
          className="px-4 py-2 rounded-lg text-xs transition-all"
          style={{
            background: tab === 'checkins' ? 'var(--bg-2)' : 'transparent',
            border: `1px solid ${tab === 'checkins' ? 'var(--gold-line)' : 'var(--bdr)'}`,
            color: tab === 'checkins' ? 'var(--gold-solid)' : 'var(--tx-2)',
          }}
        >
          修行记录
        </button>
        <button
          onClick={() => setTab('prayers')}
          className="px-4 py-2 rounded-lg text-xs transition-all"
          style={{
            background: tab === 'prayers' ? 'var(--bg-2)' : 'transparent',
            border: `1px solid ${tab === 'prayers' ? 'var(--gold-line)' : 'var(--bdr)'}`,
            color: tab === 'prayers' ? 'var(--gold-solid)' : 'var(--tx-2)',
          }}
        >
          祈福/许愿
        </button>
      </div>

      {tab === 'users' && (
        <div className="rounded-xl p-4" style={{ background: 'var(--bg-1)', border: '1px solid var(--bdr)' }}>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              placeholder="搜索钱包地址或昵称..."
              value={searchAddr}
              onChange={e => setSearchAddr(e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg text-xs outline-none"
              style={{ background: 'var(--bg-2)', border: '1px solid var(--bdr)', color: 'var(--tx-1)' }}
            />
            <select
              value={tierFilter}
              onChange={e => setTierFilter(e.target.value as 'all' | 'free' | 'premium' | 'admin')}
              className="px-3 py-2 rounded-lg text-xs outline-none cursor-pointer"
              style={{ background: 'var(--bg-2)', border: '1px solid var(--bdr)', color: 'var(--tx-2)' }}
            >
              <option value="all">全部等级</option>
              <option value="free">免费</option>
              <option value="premium">会员</option>
              <option value="admin">管理员</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--bdr)' }}>
                  <th className="text-left py-2 px-2" style={{ color: 'var(--tx-3)' }}>ID</th>
                  <th className="text-left py-2 px-2" style={{ color: 'var(--tx-3)' }}>钱包地址</th>
                  <th className="text-left py-2 px-2" style={{ color: 'var(--tx-3)' }}>昵称</th>
                  <th className="text-left py-2 px-2" style={{ color: 'var(--tx-3)' }}>等级</th>
                  <th className="text-right py-2 px-2" style={{ color: 'var(--tx-3)' }}>余额</th>
                  <th className="text-right py-2 px-2" style={{ color: 'var(--tx-3)' }}>修行</th>
                  <th className="text-right py-2 px-2" style={{ color: 'var(--tx-3)' }}>积分变动</th>
                  <th className="text-left py-2 px-2" style={{ color: 'var(--tx-3)' }}>注册时间</th>
                  <th className="text-center py-2 px-2" style={{ color: 'var(--tx-3)' }}>操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(u => {
                  const userCheckinCount = checkinRecords.wellness.filter(w => w.user_id === u.id).length
                    + checkinRecords.recitation.filter(r => r.user_id === u.id).length;
                  const userCreditsCount = creditsLog.filter(l => l.user_id === u.id).length;
                  return (
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
                    <td className="py-2 px-2 text-right" style={{ color: userCheckinCount > 0 ? 'var(--gold-solid)' : 'var(--tx-3)' }}>{userCheckinCount}</td>
                    <td className="py-2 px-2 text-right" style={{ color: userCreditsCount > 0 ? 'var(--tx-2)' : 'var(--tx-3)' }}>{userCreditsCount}</td>
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
                  );
                })}
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

          <div className="flex gap-2 mb-3">
            <input
              type="text"
              placeholder="搜索Tx Hash或发送地址..."
              value={rechargeSearch}
              onChange={e => setRechargeSearch(e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg text-xs outline-none"
              style={{ background: 'var(--bg-2)', border: '1px solid var(--bdr)', color: 'var(--tx-1)' }}
            />
            {(['all', 'confirmed', 'pending'] as const).map(s => (
              <button
                key={s}
                onClick={() => setRechargeStatusFilter(s)}
                className="px-3 py-1.5 rounded-lg text-xs transition-all"
                style={{
                  background: rechargeStatusFilter === s ? 'var(--bg-2)' : 'transparent',
                  border: `1px solid ${rechargeStatusFilter === s ? 'var(--gold-line)' : 'var(--bdr)'}`,
                  color: rechargeStatusFilter === s ? 'var(--gold-solid)' : 'var(--tx-2)',
                }}
              >
                {s === 'all' ? '全部' : s === 'confirmed' ? '已确认' : '待确认'}
              </button>
            ))}
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
                  <th className="text-center py-2 px-2" style={{ color: 'var(--tx-3)' }}>操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map(r => {
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
                            background: r.status === 'confirmed' ? 'var(--gold-line)' : r.status === 'rejected' ? 'var(--bg-2)' : 'var(--bg-2)',
                            color: r.status === 'confirmed' ? 'var(--gold-solid)' : r.status === 'rejected' ? '#ef4444' : 'var(--tx-3)',
                          }}
                        >
                          {r.status === 'confirmed' ? '已确认' : r.status === 'rejected' ? '已拒绝' : '待确认'}
                        </span>
                      </td>
                      <td className="py-2 px-2" style={{ color: 'var(--tx-3)' }}>
                        {new Date(r.created_at * 1000).toLocaleDateString('zh-CN')}
                      </td>
                      <td className="py-2 px-2 text-center">
                        {r.status === 'pending' && (
                          <div className="flex gap-1 justify-center">
                            <button
                              onClick={() => handleConfirmRecharge(r.id, 'confirm')}
                              disabled={confirmingId === r.id}
                              className="text-[10px] px-2 py-1 rounded transition-all disabled:opacity-50"
                              style={{ border: '1px solid var(--gold-line)', color: 'var(--gold-solid)' }}
                            >
                              {confirmingId === r.id ? '...' : '确认'}
                            </button>
                            <button
                              onClick={() => handleConfirmRecharge(r.id, 'reject')}
                              disabled={confirmingId === r.id}
                              className="text-[10px] px-2 py-1 rounded transition-all disabled:opacity-50"
                              style={{ border: '1px solid var(--bdr)', color: '#ef4444' }}
                            >
                              拒绝
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredRecords.length === 0 && (
            <div className="text-center py-8 text-xs" style={{ color: 'var(--tx-3)' }}>暂无充值记录</div>
          )}

          {confirmMsg && (
            <div className="mt-3 text-xs text-center" style={{ color: confirmMsg.includes('失败') || confirmMsg.includes('错误') ? '#ef4444' : 'var(--gold-solid)' }}>
              {confirmMsg}
            </div>
          )}
        </div>
      )}

      {tab === 'credits' && (
        <div className="rounded-xl p-4" style={{ background: 'var(--bg-1)', border: '1px solid var(--bdr)' }}>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center p-2 rounded-lg" style={{ background: 'var(--bg-2)' }}>
              <div className="text-[10px]" style={{ color: 'var(--tx-3)' }}>总积分发放</div>
              <div className="text-sm font-bold" style={{ color: 'var(--gold-solid)' }}>
                {creditsLog.filter(l => l.amount > 0).reduce((s, l) => s + l.amount, 0)}
              </div>
            </div>
            <div className="text-center p-2 rounded-lg" style={{ background: 'var(--bg-2)' }}>
              <div className="text-[10px]" style={{ color: 'var(--tx-3)' }}>总积分消耗</div>
              <div className="text-sm font-bold" style={{ color: '#ef4444' }}>
                {creditsLog.filter(l => l.amount < 0).reduce((s, l) => s + l.amount, 0)}
              </div>
            </div>
            <div className="text-center p-2 rounded-lg" style={{ background: 'var(--bg-2)' }}>
              <div className="text-[10px]" style={{ color: 'var(--tx-3)' }}>当前总余额</div>
              <div className="text-sm font-bold" style={{ color: 'var(--gold-solid)' }}>
                {users.reduce((s, u) => s + u.balance, 0).toFixed(0)}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
            <input
              type="text"
              placeholder="搜索用户..."
              value={creditsSearch}
              onChange={e => setCreditsSearch(e.target.value)}
              className="flex-1 min-w-[120px] px-3 py-2 rounded-lg text-xs outline-none"
              style={{ background: 'var(--bg-2)', border: '1px solid var(--bdr)', color: 'var(--tx-1)' }}
            />
            <select
              value={creditsFeatureFilter}
              onChange={e => setCreditsFeatureFilter(e.target.value)}
              className="px-3 py-2 rounded-lg text-xs outline-none cursor-pointer"
              style={{ background: 'var(--bg-2)', border: '1px solid var(--bdr)', color: 'var(--tx-2)' }}
            >
              <option value="all">全部功能</option>
              {allFeatures.map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
            <select
              value={creditsSortBy}
              onChange={e => setCreditsSortBy(e.target.value as 'balance' | 'gained' | 'spent' | 'count')}
              className="px-3 py-2 rounded-lg text-xs outline-none cursor-pointer"
              style={{ background: 'var(--bg-2)', border: '1px solid var(--bdr)', color: 'var(--tx-2)' }}
            >
              <option value="balance">按余额排序</option>
              <option value="gained">按获得排序</option>
              <option value="spent">按消耗排序</option>
              <option value="count">按变动次数排序</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--bdr)' }}>
                  <th className="text-left py-2 px-2" style={{ color: 'var(--tx-3)' }}>用户</th>
                  <th className="text-left py-2 px-2" style={{ color: 'var(--tx-3)' }}>等级</th>
                  <th className="text-right py-2 px-2" style={{ color: 'var(--tx-3)' }}>获得</th>
                  <th className="text-right py-2 px-2" style={{ color: 'var(--tx-3)' }}>消耗</th>
                  <th className="text-right py-2 px-2" style={{ color: 'var(--tx-3)' }}>当前余额</th>
                  <th className="text-right py-2 px-2" style={{ color: 'var(--tx-3)' }}>变动次数</th>
                  <th className="text-center py-2 px-2" style={{ color: 'var(--tx-3)' }}>明细</th>
                </tr>
              </thead>
              <tbody>
                {creditsSummary.map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid var(--bdr)' }}>
                    <td className="py-2 px-2 font-mono" style={{ color: 'var(--tx-2)' }}>
                      {u.wallet_address.slice(0, 6)}...{u.wallet_address.slice(-4)}
                      {u.nickname && <span className="ml-2" style={{ color: 'var(--tx-3)' }}>({u.nickname})</span>}
                    </td>
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
                    <td className="py-2 px-2 text-right" style={{ color: 'var(--gold-solid)' }}>+{u.gained}</td>
                    <td className="py-2 px-2 text-right" style={{ color: '#ef4444' }}>{u.spent}</td>
                    <td className="py-2 px-2 text-right font-bold" style={{ color: 'var(--gold-solid)' }}>{u.balance.toFixed(0)}</td>
                    <td className="py-2 px-2 text-right" style={{ color: 'var(--tx-3)' }}>{u.count}</td>
                    <td className="py-2 px-2 text-center">
                      {u.count > 0 && (
                        <button
                          onClick={() => {
                            setUserCreditsDetail(u.logs);
                            setShowUserCredits(true);
                          }}
                          className="text-[10px] px-2 py-1 rounded transition-all"
                          style={{ border: '1px solid var(--gold-line)', color: 'var(--gold-solid)' }}
                        >
                          查看
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {creditsSummary.length === 0 && (
            <div className="text-center py-8 text-xs" style={{ color: 'var(--tx-3)' }}>暂无数据</div>
          )}
        </div>
      )}

      {tab === 'checkins' && (
        <div className="rounded-xl p-4" style={{ background: 'var(--bg-1)', border: '1px solid var(--bdr)' }}>
          <div className="grid grid-cols-6 gap-2 mb-4">
            {Object.entries(checkinTypeLabels).map(([key, label]) => {
              const count = key === 'recitation'
                ? checkinRecords.recitation.length
                : checkinRecords.wellness.filter(w => w.practice_type === key).length;
              return (
                <div key={key} className="text-center p-2 rounded-lg" style={{ background: 'var(--bg-2)' }}>
                  <div className="text-[10px]" style={{ color: 'var(--tx-3)' }}>{label}</div>
                  <div className="text-sm font-bold" style={{ color: 'var(--gold-solid)' }}>{count}</div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
            <input
              type="text"
              placeholder="搜索用户..."
              value={checkinSearch}
              onChange={e => setCheckinSearch(e.target.value)}
              className="flex-1 min-w-[120px] px-3 py-2 rounded-lg text-xs outline-none"
              style={{ background: 'var(--bg-2)', border: '1px solid var(--bdr)', color: 'var(--tx-1)' }}
            />
            <select
              value={checkinTypeFilter}
              onChange={e => setCheckinTypeFilter(e.target.value)}
              className="px-3 py-2 rounded-lg text-xs outline-none cursor-pointer"
              style={{ background: 'var(--bg-2)', border: '1px solid var(--bdr)', color: 'var(--tx-2)' }}
            >
              <option value="all">全部类型</option>
              {Object.entries(checkinTypeLabels).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
            <input
              type="date"
              value={checkinDateFrom}
              onChange={e => setCheckinDateFrom(e.target.value)}
              className="px-3 py-2 rounded-lg text-xs outline-none cursor-pointer"
              style={{ background: 'var(--bg-2)', border: '1px solid var(--bdr)', color: 'var(--tx-2)' }}
            />
            <input
              type="date"
              value={checkinDateTo}
              onChange={e => setCheckinDateTo(e.target.value)}
              className="px-3 py-2 rounded-lg text-xs outline-none cursor-pointer"
              style={{ background: 'var(--bg-2)', border: '1px solid var(--bdr)', color: 'var(--tx-2)' }}
            />
          </div>

          <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
            <table className="w-full text-xs">
              <thead className="sticky top-0" style={{ background: 'var(--bg-1)' }}>
                <tr style={{ borderBottom: '1px solid var(--bdr)' }}>
                  <th className="text-left py-2 px-2" style={{ color: 'var(--tx-3)' }}>用户</th>
                  <th className="text-left py-2 px-2" style={{ color: 'var(--tx-3)' }}>类型</th>
                  <th className="text-left py-2 px-2" style={{ color: 'var(--tx-3)' }}>详情</th>
                  <th className="text-right py-2 px-2" style={{ color: 'var(--tx-3)' }}>时长(分)</th>
                  <th className="text-left py-2 px-2" style={{ color: 'var(--tx-3)' }}>备注</th>
                  <th className="text-left py-2 px-2" style={{ color: 'var(--tx-3)' }}>时间</th>
                </tr>
              </thead>
              <tbody>
                {filteredCheckins.map(r => (
                  <tr key={`${r.type}-${r.id}`} style={{ borderBottom: '1px solid var(--bdr)' }}>
                    <td className="py-2 px-2 font-mono" style={{ color: 'var(--tx-2)' }}>
                      {r.wallet_address.slice(0, 6)}...{r.wallet_address.slice(-4)}
                      {r.nickname && <span className="ml-1" style={{ color: 'var(--tx-3)' }}>({r.nickname})</span>}
                    </td>
                    <td className="py-2 px-2">
                      <span
                        className="text-[10px] px-1.5 py-0.5 rounded"
                        style={{ background: 'var(--gold-line)', color: 'var(--gold-solid)' }}
                      >
                        {r.typeLabel}
                      </span>
                    </td>
                    <td className="py-2 px-2" style={{ color: 'var(--tx-2)' }}>{r.detail || '-'}</td>
                    <td className="py-2 px-2 text-right" style={{ color: 'var(--tx-3)' }}>{r.duration || '-'}</td>
                    <td className="py-2 px-2" style={{ color: 'var(--tx-3)' }}>{r.note || '-'}</td>
                    <td className="py-2 px-2" style={{ color: 'var(--tx-3)' }}>
                      {new Date(r.created_at).toLocaleDateString('zh-CN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredCheckins.length === 0 && (
            <div className="text-center py-8 text-xs" style={{ color: 'var(--tx-3)' }}>暂无修行记录</div>
          )}
        </div>
      )}

      {tab === 'prayers' && (
        <div className="rounded-xl p-4" style={{ background: 'var(--bg-1)', border: '1px solid var(--bdr)' }}>
          {allPrayerTypes.length > 0 && (
            <div className="grid gap-2 mb-4" style={{ gridTemplateColumns: `repeat(${Math.min(allPrayerTypes.length, 6)}, 1fr)` }}>
              {allPrayerTypes.map(t => {
                const count = prayerRecords.filter(r => r.type === t).length;
                return (
                  <div key={t} className="text-center p-2 rounded-lg" style={{ background: 'var(--bg-2)' }}>
                    <div className="text-[10px]" style={{ color: 'var(--tx-3)' }}>{t}</div>
                    <div className="text-sm font-bold" style={{ color: 'var(--gold-solid)' }}>{count}</div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex flex-wrap gap-2 mb-3">
            <input
              type="text"
              placeholder="搜索用户或内容..."
              value={prayerSearch}
              onChange={e => setPrayerSearch(e.target.value)}
              className="flex-1 min-w-[120px] px-3 py-2 rounded-lg text-xs outline-none"
              style={{ background: 'var(--bg-2)', border: '1px solid var(--bdr)', color: 'var(--tx-1)' }}
            />
            <select
              value={prayerTypeFilter}
              onChange={e => setPrayerTypeFilter(e.target.value)}
              className="px-3 py-2 rounded-lg text-xs outline-none cursor-pointer"
              style={{ background: 'var(--bg-2)', border: '1px solid var(--bdr)', color: 'var(--tx-2)' }}
            >
              <option value="all">全部类型</option>
              {allPrayerTypes.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
            <table className="w-full text-xs">
              <thead className="sticky top-0" style={{ background: 'var(--bg-1)' }}>
                <tr style={{ borderBottom: '1px solid var(--bdr)' }}>
                  <th className="text-left py-2 px-2" style={{ color: 'var(--tx-3)' }}>用户</th>
                  <th className="text-left py-2 px-2" style={{ color: 'var(--tx-3)' }}>类型</th>
                  <th className="text-left py-2 px-2" style={{ color: 'var(--tx-3)' }}>内容</th>
                  <th className="text-left py-2 px-2" style={{ color: 'var(--tx-3)' }}>对象/神明</th>
                  <th className="text-left py-2 px-2" style={{ color: 'var(--tx-3)' }}>时间</th>
                </tr>
              </thead>
              <tbody>
                {filteredPrayers.map(r => (
                  <tr key={r.id} style={{ borderBottom: '1px solid var(--bdr)' }}>
                    <td className="py-2 px-2 font-mono" style={{ color: 'var(--tx-2)' }}>
                      {r.wallet_address.slice(0, 6)}...{r.wallet_address.slice(-4)}
                      {r.nickname && <span className="ml-1" style={{ color: 'var(--tx-3)' }}>({r.nickname})</span>}
                    </td>
                    <td className="py-2 px-2">
                      <span
                        className="text-[10px] px-1.5 py-0.5 rounded"
                        style={{ background: 'var(--gold-line)', color: 'var(--gold-solid)' }}
                      >
                        {r.type}
                      </span>
                    </td>
                    <td className="py-2 px-2 max-w-[200px] truncate" style={{ color: 'var(--tx-2)' }} title={r.content}>
                      {r.content}
                    </td>
                    <td className="py-2 px-2" style={{ color: 'var(--tx-3)' }}>
                      {r.target || r.deity || '-'}
                    </td>
                    <td className="py-2 px-2" style={{ color: 'var(--tx-3)' }}>
                      {new Date(r.created_at).toLocaleDateString('zh-CN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredPrayers.length === 0 && (
            <div className="text-center py-8 text-xs" style={{ color: 'var(--tx-3)' }}>暂无祈福/许愿记录</div>
          )}
        </div>
      )}

      {showUserCredits && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={() => setShowUserCredits(false)}>
          <div
            className="rounded-xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto"
            style={{ background: 'var(--bg-1)', border: '1px solid var(--bdr)' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold" style={{ color: 'var(--tx-1)' }}>积分变动明细</h2>
              <button
                onClick={() => setShowUserCredits(false)}
                className="text-xs px-3 py-1 rounded-lg transition-all"
                style={{ border: '1px solid var(--bdr)', color: 'var(--tx-2)' }}
              >
                关闭
              </button>
            </div>

            <div className="space-y-1">
              {userCreditsDetail.map(log => (
                <div
                  key={log.id}
                  className="flex items-center justify-between py-2 px-3 rounded-lg"
                  style={{ background: 'var(--bg-2)' }}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="text-xs font-bold"
                      style={{ color: log.amount > 0 ? 'var(--gold-solid)' : '#ef4444' }}
                    >
                      {log.amount > 0 ? `+${log.amount}` : log.amount}
                    </span>
                    <span className="text-xs" style={{ color: 'var(--tx-2)' }}>{log.feature}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px]" style={{ color: 'var(--tx-3)' }}>
                      余额: {log.balance_after}
                    </span>
                    <span className="text-[10px]" style={{ color: 'var(--tx-3)' }}>
                      {new Date(log.created_at * 1000).toLocaleDateString('zh-CN')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={() => setEditingUser(null)}>
          <div
            className="rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
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

            <div className="flex gap-3 mb-5">
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
              <div className="mb-4 text-xs" style={{ color: msg.includes('已更新') ? 'var(--gold-solid)' : 'var(--tx-2)' }}>
                {msg}
              </div>
            )}

            <div className="pt-4" style={{ borderTop: '1px solid var(--bdr)' }}>
              <div className="text-xs font-bold mb-3" style={{ color: 'var(--tx-1)' }}>个人中心</div>
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="rounded-lg p-2" style={{ background: 'var(--bg-2)' }}>
                  <div className="text-[10px]" style={{ color: 'var(--tx-3)' }}>注册时间</div>
                  <div className="text-xs font-medium" style={{ color: 'var(--tx-1)' }}>
                    {new Date(editingUser.created_at * 1000).toLocaleDateString('zh-CN')}
                  </div>
                </div>
                <div className="rounded-lg p-2" style={{ background: 'var(--bg-2)' }}>
                  <div className="text-[10px]" style={{ color: 'var(--tx-3)' }}>当前等级</div>
                  <div className="text-xs font-medium" style={{ color: editingUser.membership_tier === 'premium' ? 'var(--gold-solid)' : 'var(--tx-1)' }}>
                    {editingUser.membership_tier === 'premium' ? '★ 会员' : '免费用户'}
                  </div>
                </div>
                <div className="rounded-lg p-2" style={{ background: 'var(--bg-2)' }}>
                  <div className="text-[10px]" style={{ color: 'var(--tx-3)' }}>钱包余额</div>
                  <div className="text-xs font-medium" style={{ color: 'var(--gold-solid)' }}>{editingUser.balance.toFixed(2)} U</div>
                </div>
                <div className="rounded-lg p-2" style={{ background: 'var(--bg-2)' }}>
                  <div className="text-[10px]" style={{ color: 'var(--tx-3)' }}>钱包地址</div>
                  <div className="text-xs font-mono" style={{ color: 'var(--tx-2)' }}>
                    {editingUser.wallet_address.slice(0, 6)}...{editingUser.wallet_address.slice(-4)}
                  </div>
                </div>
              </div>

              {(() => {
                const editUserLogs = creditsLog.filter(l => l.user_id === editingUser.id);
                const editGained = editUserLogs.filter(l => l.amount > 0).reduce((s, l) => s + l.amount, 0);
                const editSpent = editUserLogs.filter(l => l.amount < 0).reduce((s, l) => s + l.amount, 0);
                const editWellness = checkinRecords.wellness.filter(w => w.user_id === editingUser.id);
                const editRecitation = checkinRecords.recitation.filter(r => r.user_id === editingUser.id);
                const editCheckinByType: Record<string, number> = {};
                for (const w of editWellness) {
                  editCheckinByType[w.practice_type] = (editCheckinByType[w.practice_type] || 0) + 1;
                }
                editCheckinByType['recitation'] = editRecitation.length;
                const totalEditCheckins = editWellness.length + editRecitation.length;
                return (
                  <>
                  {totalEditCheckins > 0 && (
                    <div className="mb-4">
                      <div className="text-xs font-bold mb-2" style={{ color: 'var(--tx-1)' }}>修行统计</div>
                      <div className="grid grid-cols-3 gap-2 mb-2">
                        <div className="rounded-lg p-2 text-center" style={{ background: 'var(--bg-2)' }}>
                          <div className="text-[10px]" style={{ color: 'var(--tx-3)' }}>总修行次数</div>
                          <div className="text-xs font-bold" style={{ color: 'var(--gold-solid)' }}>{totalEditCheckins}</div>
                        </div>
                        <div className="rounded-lg p-2 text-center" style={{ background: 'var(--bg-2)' }}>
                          <div className="text-[10px]" style={{ color: 'var(--tx-3)' }}>修行类型数</div>
                          <div className="text-xs font-bold" style={{ color: 'var(--tx-1)' }}>
                            {Object.values(editCheckinByType).filter(v => v > 0).length}
                          </div>
                        </div>
                        <div className="rounded-lg p-2 text-center" style={{ background: 'var(--bg-2)' }}>
                          <div className="text-[10px]" style={{ color: 'var(--tx-3)' }}>诵经次数</div>
                          <div className="text-xs font-bold" style={{ color: 'var(--tx-1)' }}>{editCheckinByType['recitation'] || 0}</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-6 gap-1">
                        {Object.entries(checkinTypeLabels).map(([key, label]) => (
                          <div key={key} className="text-center p-1 rounded" style={{ background: 'var(--bg-2)' }}>
                            <div className="text-[9px]" style={{ color: 'var(--tx-3)' }}>{label}</div>
                            <div className="text-[10px] font-bold" style={{ color: editCheckinByType[key] ? 'var(--gold-solid)' : 'var(--tx-3)' }}>
                              {editCheckinByType[key] || 0}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {editUserLogs.length > 0 && (
                    <div className="mb-4">
                      <div className="text-xs font-bold mb-2" style={{ color: 'var(--tx-1)' }}>积分变动明细</div>
                      <div className="grid grid-cols-3 gap-2 mb-2">
                        <div className="rounded-lg p-2 text-center" style={{ background: 'var(--bg-2)' }}>
                          <div className="text-[10px]" style={{ color: 'var(--tx-3)' }}>获得</div>
                          <div className="text-xs font-bold" style={{ color: 'var(--gold-solid)' }}>+{editGained}</div>
                        </div>
                        <div className="rounded-lg p-2 text-center" style={{ background: 'var(--bg-2)' }}>
                          <div className="text-[10px]" style={{ color: 'var(--tx-3)' }}>消耗</div>
                          <div className="text-xs font-bold" style={{ color: '#ef4444' }}>{editSpent}</div>
                        </div>
                        <div className="rounded-lg p-2 text-center" style={{ background: 'var(--bg-2)' }}>
                          <div className="text-[10px]" style={{ color: 'var(--tx-3)' }}>变动次数</div>
                          <div className="text-xs font-bold" style={{ color: 'var(--tx-1)' }}>{editUserLogs.length}</div>
                        </div>
                      </div>
                      <div className="space-y-1 max-h-32 overflow-y-auto">
                        {editUserLogs.slice(-10).reverse().map(log => (
                          <div
                            key={log.id}
                            className="flex items-center justify-between py-1.5 px-2 rounded"
                            style={{ background: 'var(--bg-2)' }}
                          >
                            <div className="flex items-center gap-2">
                              <span
                                className="text-[10px] font-bold"
                                style={{ color: log.amount > 0 ? 'var(--gold-solid)' : '#ef4444' }}
                              >
                                {log.amount > 0 ? `+${log.amount}` : log.amount}
                              </span>
                              <span className="text-[10px]" style={{ color: 'var(--tx-2)' }}>{log.feature}</span>
                            </div>
                            <span className="text-[10px]" style={{ color: 'var(--tx-3)' }}>
                              {new Date(log.created_at * 1000).toLocaleDateString('zh-CN')}
                            </span>
                          </div>
                        ))}
                      </div>
                      {editUserLogs.length > 10 && (
                        <div className="text-[10px] text-center mt-1" style={{ color: 'var(--tx-3)' }}>
                          显示最近10条，共{editUserLogs.length}条
                        </div>
                      )}
                    </div>
                  )}
                  </>
                );
              })()}

              <button
                onClick={handleOpenStats}
                className="w-full py-2.5 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-2"
                style={{ background: 'var(--bg-2)', border: '1px solid var(--gold-line)', color: 'var(--gold-solid)' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 3v18h18" />
                  <path d="M7 14l4-4 4 4 5-5" />
                </svg>
                数据统计
              </button>
            </div>
          </div>
        </div>
      )}

      {showStats && (
        <div className="fixed inset-0 z-50 overflow-y-auto" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={() => setShowStats(false)}>
          <div
            className="min-h-screen flex items-start justify-center p-4 pt-10"
          >
            <div
              className="rounded-xl p-6 max-w-4xl w-full"
              style={{ background: 'var(--bg-0)', border: '1px solid var(--bdr)' }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold" style={{ color: 'var(--tx-1)' }}>数据统计</h2>
                <button
                  onClick={() => setShowStats(false)}
                  className="text-xs px-3 py-1 rounded-lg transition-all"
                  style={{ border: '1px solid var(--bdr)', color: 'var(--tx-2)' }}
                >
                  关闭
                </button>
              </div>

              {statsData ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-5 gap-3">
                    <div className="rounded-lg p-3" style={{ background: 'var(--bg-1)', border: '1px solid var(--bdr)' }}>
                      <div className="text-[10px]" style={{ color: 'var(--tx-3)' }}>总用户</div>
                      <div className="text-lg font-bold" style={{ color: 'var(--tx-1)' }}>{statsData.user_summary.total}</div>
                    </div>
                    <div className="rounded-lg p-3" style={{ background: 'var(--bg-1)', border: '1px solid var(--bdr)' }}>
                      <div className="text-[10px]" style={{ color: 'var(--tx-3)' }}>近7天新增</div>
                      <div className="text-lg font-bold" style={{ color: 'var(--gold-solid)' }}>{statsData.user_summary.new_7d}</div>
                    </div>
                    <div className="rounded-lg p-3" style={{ background: 'var(--bg-1)', border: '1px solid var(--bdr)' }}>
                      <div className="text-[10px]" style={{ color: 'var(--tx-3)' }}>近30天新增</div>
                      <div className="text-lg font-bold" style={{ color: 'var(--gold-solid)' }}>{statsData.user_summary.new_30d}</div>
                    </div>
                    <div className="rounded-lg p-3" style={{ background: 'var(--bg-1)', border: '1px solid var(--bdr)' }}>
                      <div className="text-[10px]" style={{ color: 'var(--tx-3)' }}>会员/免费</div>
                      <div className="text-lg font-bold" style={{ color: 'var(--tx-1)' }}>
                        <span style={{ color: 'var(--gold-solid)' }}>{statsData.user_summary.premium}</span>
                        <span style={{ color: 'var(--tx-3)' }}> / </span>
                        {statsData.user_summary.free}
                      </div>
                    </div>
                    <div className="rounded-lg p-3" style={{ background: 'var(--bg-1)', border: '1px solid var(--bdr)' }}>
                      <div className="text-[10px]" style={{ color: 'var(--tx-3)' }}>近30天充值</div>
                      <div className="text-lg font-bold" style={{ color: 'var(--gold-solid)' }}>{statsData.recharge_summary.last_30d_amount.toFixed(1)}U</div>
                    </div>
                  </div>

                  <div className="rounded-xl p-4" style={{ background: 'var(--bg-1)', border: '1px solid var(--bdr)' }}>
                    <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--tx-1)' }}>用户注册趋势（近30天）</h3>
                    <LineChart
                      data={statsData.user_registration_trend}
                      color="var(--gold-solid)"
                      height={120}
                    />
                  </div>

                  <div className="rounded-xl p-4" style={{ background: 'var(--bg-1)', border: '1px solid var(--bdr)' }}>
                    <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--tx-1)' }}>日活跃用户（近30天）</h3>
                    <LineChart
                      data={statsData.daily_active_users}
                      color="#4ade80"
                      height={120}
                    />
                  </div>

                  <div className="rounded-xl p-4" style={{ background: 'var(--bg-1)', border: '1px solid var(--bdr)' }}>
                    <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--tx-1)' }}>修行次数趋势（近30天）</h3>
                    <LineChart
                      data={statsData.checkin_trend_30d}
                      color="#60a5fa"
                      height={120}
                    />
                  </div>

                  <div className="rounded-xl p-4" style={{ background: 'var(--bg-1)', border: '1px solid var(--bdr)' }}>
                    <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--tx-1)' }}>各修行项目统计</h3>
                    <div className="space-y-2">
                      {statsData.checkin_by_type.map(item => {
                        const maxTotal = Math.max(...statsData.checkin_by_type.map(c => c.total), 1);
                        return (
                          <div key={item.type} className="flex items-center gap-3">
                            <div className="w-16 text-xs" style={{ color: 'var(--tx-2)' }}>{item.type}</div>
                            <div className="flex-1 relative h-6 rounded" style={{ background: 'var(--bg-2)' }}>
                              <div
                                className="absolute inset-y-0 left-0 rounded transition-all"
                                style={{
                                  width: `${(item.total / maxTotal) * 100}%`,
                                  background: 'linear-gradient(90deg, var(--gold-line), var(--gold-solid))',
                                  minWidth: item.total > 0 ? '4px' : '0',
                                }}
                              />
                              <div className="absolute inset-0 flex items-center px-2">
                                <span className="text-[10px] font-bold" style={{ color: item.total > 0 ? '#fff' : 'var(--tx-3)' }}>
                                  {item.total}
                                </span>
                                <span className="text-[10px] ml-auto" style={{ color: 'var(--tx-3)' }}>
                                  近7天: {item.last_7d}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="rounded-xl p-4" style={{ background: 'var(--bg-1)', border: '1px solid var(--bdr)' }}>
                    <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--tx-1)' }}>功能使用热度</h3>
                    <div className="space-y-2">
                      {statsData.feature_usage.slice(0, 15).map(item => {
                        const maxClick = Math.max(...statsData.feature_usage.map(f => f.click_count), 1);
                        return (
                          <div key={item.feature} className="flex items-center gap-3">
                            <div className="w-8 text-center text-sm">{item.icon}</div>
                            <div className="w-20 text-xs" style={{ color: 'var(--tx-2)' }}>{item.zh}</div>
                            <div className="w-12 text-[10px]" style={{ color: 'var(--tx-3)' }}>{item.category}</div>
                            <div className="flex-1 relative h-5 rounded" style={{ background: 'var(--bg-2)' }}>
                              <div
                                className="absolute inset-y-0 left-0 rounded transition-all"
                                style={{
                                  width: `${(item.click_count / maxClick) * 100}%`,
                                  background: 'linear-gradient(90deg, var(--gold-line), var(--gold-solid))',
                                  minWidth: item.click_count > 0 ? '4px' : '0',
                                }}
                              />
                              <div className="absolute inset-0 flex items-center px-2">
                                <span className="text-[10px] font-bold" style={{ color: item.click_count > 0 ? '#fff' : 'var(--tx-3)' }}>
                                  {item.click_count}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-xs" style={{ color: 'var(--tx-3)' }}>加载统计数据中...</div>
              )}
            </div>
          </div>
        </div>
      )}
      <SiteFooter />
    </div>
  );
}

function LineChart({ data, color, height = 120 }: { data: Array<{ date: string; count: number }>; color: string; height?: number }) {
  if (data.length === 0) {
    return <div className="text-center text-xs py-8" style={{ color: 'var(--tx-3)' }}>暂无数据</div>;
  }

  const width = 800;
  const padding = { top: 10, right: 10, bottom: 20, left: 30 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const maxCount = Math.max(...data.map(d => d.count), 1);
  const dateRange = data.length > 1 ? data.length - 1 : 1;

  const points = data.map((d, i) => {
    const x = padding.left + (i / dateRange) * chartWidth;
    const y = padding.top + chartHeight - (d.count / maxCount) * chartHeight;
    return { x, y, ...d };
  });

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${padding.top + chartHeight} L ${points[0].x} ${padding.top + chartHeight} Z`;

  const yTicks = [0, Math.ceil(maxCount * 0.25), Math.ceil(maxCount * 0.5), Math.ceil(maxCount * 0.75), Math.ceil(maxCount)];

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ height }}>
      <defs>
        <linearGradient id={`area-${color.replace(/[^a-z0-9]/gi, '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>

      {yTicks.map((tick, i) => {
        const y = padding.top + chartHeight - (tick / maxCount) * chartHeight;
        return (
          <g key={i}>
            <line
              x1={padding.left}
              y1={y}
              x2={width - padding.right}
              y2={y}
              stroke="var(--bdr)"
              strokeWidth="0.5"
              strokeDasharray="2 2"
            />
            <text
              x={padding.left - 4}
              y={y + 3}
              textAnchor="end"
              fontSize="8"
              fill="var(--tx-3)"
            >
              {tick}
            </text>
          </g>
        );
      })}

      <path d={areaPath} fill={`url(#area-${color.replace(/[^a-z0-9]/gi, '')})`} />
      <path d={linePath} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />

      {points.map((p, i) => {
        if (data.length > 15 && i % Math.ceil(data.length / 10) !== 0) return null;
        return (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="2" fill={color} />
            <text
              x={p.x}
              y={height - 4}
              textAnchor="middle"
              fontSize="7"
              fill="var(--tx-3)"
            >
              {p.date.slice(5)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}