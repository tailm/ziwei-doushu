'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '@/lib/i18n/LanguageContext';
import { useTheme } from '@/components/ThemeProvider';
import { useAuth } from '@/lib/auth/AuthContext';
import NavigationBar from '@/components/NavigationBar';
import SiteFooter from '@/components/SiteFooter';
import { DharmaWheel, AuspiciousCloud, LotusFlower, RippleWave } from '@/components/SacredDecorations';
import { SpinningTaiji, BaguaDiagram } from '@/components/Decorations';

const TAICHI_FORMS = [
  { key: 'yang', zh: '杨式太极', en: 'Yang Style', descZh: '舒展大方，柔和缓慢', descEn: 'Open, gentle, slow movements', icon: '🌤' },
  { key: 'chen', zh: '陈式太极', en: 'Chen Style', descZh: '刚柔相济，快慢相间', descEn: 'Hard and soft, fast and slow', icon: '⚡' },
  { key: 'simplified', zh: '简化太极', en: 'Simplified', descZh: '24式简化太极拳', descEn: '24-form simplified Tai Chi', icon: '📋' },
  { key: 'qigong', zh: '太极气功', en: 'Tai Chi Qigong', descZh: '以气导动，内外兼修', descEn: 'Qi-led movement, internal cultivation', icon: '🌀' },
];

const TAICHI_BENEFITS = [
  { zh: '调和阴阳', en: 'Balance Yin-Yang', descZh: '阴阳互补，气血调和，身心平衡', descEn: 'Balance yin and yang, harmonize qi' },
  { zh: '强身健体', en: 'Strengthen Body', descZh: '增强体质，提高免疫力，延缓衰老', descEn: 'Strengthen body, boost immunity' },
  { zh: '疏通经络', en: 'Meridians', descZh: '动作导引，疏通经络，气血畅通', descEn: 'Guide qi through meridians' },
  { zh: '修身养性', en: 'Cultivate Mind', descZh: '以柔克刚，心静如水，涵养品格', descEn: 'Soft overcomes hard, cultivate character' },
];

const TAICHI_PRINCIPLES = [
  { zh: '松静自然', en: 'Relaxed & Natural', descZh: '身体放松，心神安静，动作自然', descEn: 'Body relaxed, mind calm, natural movement' },
  { zh: '意气相随', en: 'Mind & Qi', descZh: '以意导气，以气运身，意气合一', descEn: 'Mind leads qi, qi moves body' },
  { zh: '圆活连贯', en: 'Circular Flow', descZh: '动作圆活，连绵不断，一气呵成', descEn: 'Circular, continuous, flowing' },
  { zh: '虚实分明', en: 'Empty & Full', descZh: '重心转换，虚实清楚，步法稳健', descEn: 'Clear weight shifts, stable stance' },
];


function TaijiSymbol({ color, size = 80 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
      <motion.circle
        cx="40" cy="40" r="35"
        stroke={color}
        strokeWidth="1.5"
        opacity={0.3}
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: 'center' }}
      />
      <motion.g
        animate={{ rotate: 360 }}
        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: 'center' }}
      >
        <path
          d="M40 5 C40 22, 58 22, 58 40 C58 58, 40 58, 40 75 C22 75, 22 58, 22 40 C22 22, 40 22, 40 5 Z"
          fill={color}
          opacity={0.15}
        />
        <circle cx="40" cy="22" r="4" fill={color} opacity={0.4} />
        <circle cx="40" cy="58" r="4" fill={color} opacity={0.2} />
      </motion.g>
      <circle cx="40" cy="40" r="2" fill={color} opacity={0.5} />
    </svg>
  );
}

export default function TaichiPage() {
  const { lang } = useLang();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { user } = useAuth();

  const c = {
    bg: isDark ? '#020810' : '#f5efe0',
    cardBg: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.88)',
    border: isDark ? 'rgba(212,168,67,0.2)' : 'rgba(140,100,20,0.2)',
    goldSolid: isDark ? '#d4a843' : '#8b6410',
    text: isDark ? '#e8eef6' : '#1a1d24',
    textMuted: isDark ? '#9db0d0' : '#5a6275',
    textFaint: isDark ? 'rgba(240,246,255,0.4)' : '#9da4b3',
    tealAccent: isDark ? '#2dd4bf' : '#0d9488',
    tealBg: isDark ? 'rgba(45,212,191,0.08)' : 'rgba(13,148,136,0.08)',
  };

  const [selectedForm, setSelectedForm] = useState('');
  const [todayChecked, setTodayChecked] = useState(false);
  const [streak, setStreak] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [creditsAwarded, setCreditsAwarded] = useState(0);
  const [records, setRecords] = useState<Array<{ sub_type: string; created_at: string }>>([]);
  const [showHistory, setShowHistory] = useState(false);

  const [showKnowledge, setShowKnowledge] = useState(false);

  useEffect(() => {
    if (user) {
      loadStreak();
      loadHistory();

    }
  }, [user]);

  const loadStreak = async () => {
    try {
      const res = await fetch('/api/wellness?action=streak&practice_type=taichi');
      const data = await res.json();
      if (data.streak) {
        setStreak(data.streak.current_streak);
        setTodayChecked(data.streak.today_checked);
      }
    } catch { /* not logged in */ }
  };

  const loadHistory = async () => {
    try {
      const res = await fetch('/api/wellness?practice_type=taichi');
      const data = await res.json();
      if (data.records) setRecords(data.records);
    } catch { /* not logged in */ }
  };


  const handleCheckIn = async () => {
    if (!selectedForm) return;
    const formObj = TAICHI_FORMS.find(f => f.key === selectedForm);
    try {
      const res = await fetch('/api/wellness', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          practice_type: 'taichi',
          sub_type: lang === 'zh' ? formObj!.zh : formObj!.en,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStreak(data.streak.current_streak);
        setTodayChecked(data.streak.today_checked);
        setCreditsAwarded(data.credits_awarded || 0);
        setShowSuccess(true);
        setTimeout(() => { setShowSuccess(false); setSelectedForm(''); }, 4000);
        loadHistory();

      }
    } catch { /* not logged in */ }
  };


  return (
    <div style={{ minHeight: '100vh', background: c.bg, color: c.text, position: 'relative', overflow: 'hidden' }}>
      {/* 庄严装饰背景 */}
      <div className="absolute pointer-events-none" style={{ top: '5%', left: '50%', transform: 'translateX(-50%)', zIndex: 0 }}>
        <SpinningTaiji size={200} color={c.goldSolid} opacity={0.04} />
    </div>
      <div className="absolute pointer-events-none" style={{ top: '10%', left: '5%', zIndex: 0 }}>
        <BaguaDiagram size={120} color={c.goldSolid} opacity={0.05} />
    </div>
      <div className="absolute pointer-events-none" style={{ top: '15%', right: '5%', zIndex: 0 }}>
        <DharmaWheel size={80} color={c.goldSolid} opacity={0.06} />
    </div>
      <div className="absolute pointer-events-none" style={{ bottom: '10%', left: '8%', zIndex: 0 }}>
        <AuspiciousCloud size={130} color={c.goldSolid} opacity={0.05} />
    </div>
      <div className="absolute pointer-events-none" style={{ bottom: '15%', right: '8%', zIndex: 0 }}>
        <RippleWave size={100} color={c.goldSolid} opacity={0.06} />
    </div>
      <div className="absolute pointer-events-none" style={{ bottom: '5%', left: '50%', transform: 'translateX(-50%)', zIndex: 0 }}>
        <LotusFlower size={120} color={c.goldSolid} opacity={0.04} />
    </div>
      <NavigationBar />
      <div className="max-w-2xl mx-auto px-4 pt-20 pb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
          <motion.div className="flex justify-center mb-2" animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}>
            <TaijiSymbol color={c.tealAccent} size={70} />
          </motion.div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: c.tealAccent }}>{lang === 'zh' ? '太极打卡' : 'Tai Chi Check-in'}</h1>
          <p className="text-sm" style={{ color: c.textMuted }}>{lang === 'zh' ? '以柔克刚，阴阳调和，气血畅通' : 'Soft overcomes hard, balance yin and yang'}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex justify-center mb-4">
          <div className="flex items-center gap-4 px-6 py-4 rounded-2xl" style={{ background: c.cardBg, border: `1px solid ${c.border}` }}>
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color: c.tealAccent }}>{streak}</div>
              <div className="text-xs mt-1" style={{ color: c.textMuted }}>{lang === 'zh' ? '连续天数' : 'Day Streak'}</div>
    </div>
            <div className="w-px h-12" style={{ background: c.border }} />
            <div className="text-center">
              <motion.div animate={todayChecked ? { scale: [1, 1.2, 1] } : {}} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: todayChecked ? c.tealAccent : c.cardBg, border: `1px solid ${todayChecked ? c.tealAccent : c.border}` }}>
                {todayChecked ? <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8L6.5 11.5L13 4.5" stroke="#1a1a2e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg> : <span style={{ fontSize: 18 }}>☯</span>}
              </motion.div>
              <div className="text-xs mt-1" style={{ color: c.textMuted }}>{lang === 'zh' ? '今日太极' : 'Today'}</div>
    </div>
    </div>
        </motion.div>


        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-4 text-xs" style={{ color: c.textFaint }}>{lang === 'zh' ? '每日打卡 +2积分' : 'Daily check-in +2 credits'}</motion.div>

        <AnimatePresence mode="wait">
          {showSuccess ? (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="flex flex-col items-center py-12">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }} className="relative">
                <motion.div className="absolute inset-0 rounded-full" style={{ background: `radial-gradient(circle, ${c.tealAccent}40, transparent 70%)`, filter: 'blur(20px)' }} animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 2, repeat: Infinity }} />
                <motion.div className="w-24 h-24 rounded-full flex items-center justify-center relative" style={{ border: `3px solid ${c.tealAccent}`, boxShadow: `0 0 30px ${c.tealAccent}60` }} animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}>
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><path d="M8 20L16 28L32 12" stroke={c.tealAccent} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </motion.div>
              </motion.div>
              <motion.p className="mt-8 text-lg font-medium" style={{ color: c.tealAccent }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>{lang === 'zh' ? '打卡成功！' : 'Check-in Successful!'}</motion.p>
              {creditsAwarded > 0 && <motion.p className="mt-2 text-sm font-medium" style={{ color: c.tealAccent }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>{lang === 'zh' ? `获得 ${creditsAwarded} 积分` : `+${creditsAwarded} credits`}</motion.p>}
              <motion.p className="mt-2 text-sm" style={{ color: c.textMuted }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>{lang === 'zh' ? `已连续练太极 ${streak} 天` : `${streak} day streak`}</motion.p>
              <motion.p className="mt-1 text-xs" style={{ color: c.textFaint }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>{lang === 'zh' ? '阴阳调和，身心合一' : 'Yin and yang in harmony, body and mind as one'}</motion.p>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">

              <div>
                <label className="text-sm mb-3 block" style={{ color: c.textMuted }}>{lang === 'zh' ? '选择太极类型' : 'Select Tai Chi Style'}</label>
                <div className="grid grid-cols-2 gap-3">
                  {TAICHI_FORMS.map(form => (
                    <motion.button key={form.key} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={() => setSelectedForm(form.key)} className="p-4 rounded-xl text-left transition-all" style={{ background: selectedForm === form.key ? c.tealAccent : c.cardBg, color: selectedForm === form.key ? '#1a1a2e' : c.text, border: `1px solid ${selectedForm === form.key ? c.tealAccent : c.border}` }}>
                      <div className="flex items-center gap-2">
                        <span style={{ fontSize: 18 }}>{form.icon}</span>
                        <div className="font-medium text-sm">{lang === 'zh' ? form.zh : form.en}</div>
    </div>
                      <div className="text-xs mt-1 opacity-70">{lang === 'zh' ? form.descZh : form.descEn}</div>
                    </motion.button>
                  ))}
    </div>
    </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                onClick={() => setShowKnowledge(!showKnowledge)}
                className="w-full py-2.5 rounded-xl text-sm flex items-center justify-center gap-2"
                style={{ background: c.tealBg, border: `1px solid ${c.tealAccent}30`, color: c.tealAccent }}
              >
                {lang === 'zh' ? '太极知识' : 'Tai Chi Knowledge'} {showKnowledge ? '▾' : '▸'}
              </motion.button>

              <AnimatePresence>
                {showKnowledge && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2" style={{ color: c.tealAccent }}>{lang === 'zh' ? '太极功效' : 'Benefits'}</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {TAICHI_BENEFITS.map(b => (
                          <div key={b.zh} className="p-3 rounded-lg" style={{ background: c.cardBg, border: `1px solid ${c.border}` }}>
                            <div className="text-sm font-medium" style={{ color: c.tealAccent }}>{lang === 'zh' ? b.zh : b.en}</div>
                            <div className="text-xs mt-1" style={{ color: c.textMuted }}>{lang === 'zh' ? b.descZh : b.descEn}</div>
    </div>
                        ))}
    </div>
    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-2" style={{ color: c.tealAccent }}>{lang === 'zh' ? '太极要领' : 'Principles'}</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {TAICHI_PRINCIPLES.map(p => (
                          <div key={p.zh} className="p-3 rounded-lg" style={{ background: c.cardBg, border: `1px solid ${c.border}` }}>
                            <div className="text-sm font-medium" style={{ color: c.tealAccent }}>{lang === 'zh' ? p.zh : p.en}</div>
                            <div className="text-xs mt-1" style={{ color: c.textMuted }}>{lang === 'zh' ? p.descZh : p.descEn}</div>
    </div>
                        ))}
    </div>
    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex justify-center gap-3">
                <motion.button whileHover={{ scale: selectedForm ? 1.03 : 1 }} whileTap={{ scale: selectedForm ? 0.97 : 1 }} onClick={handleCheckIn} disabled={!selectedForm || !user} className="px-10 py-3 rounded-xl font-medium" style={{ background: selectedForm && user ? c.tealAccent : c.border, color: '#1a1a2e', cursor: selectedForm && user ? 'pointer' : 'not-allowed' }}>
                  {lang === 'zh' ? '打卡太极' : 'Check In'}
                </motion.button>
                {user && (
                  <button onClick={() => setShowHistory(!showHistory)} className="px-4 py-3 rounded-xl text-sm" style={{ background: c.cardBg, border: `1px solid ${c.border}`, color: c.textMuted }}>{lang === 'zh' ? '打卡记录' : 'History'}</button>
                )}
    </div>

              {!user && <p className="text-center text-xs" style={{ color: c.textFaint }}>{lang === 'zh' ? '登录后可记录打卡数据' : 'Sign in to track your progress'}</p>}

              {showHistory && records.length > 0 && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-2">
                  <h3 className="text-sm font-medium" style={{ color: c.tealAccent }}>{lang === 'zh' ? '近期打卡' : 'Recent Check-ins'}</h3>
                  {records.slice(0, 10).map((r, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg text-sm" style={{ background: c.cardBg, border: `1px solid ${c.border}` }}>
                      <span style={{ color: c.text }}>{r.sub_type}</span>
                      <span className="text-xs" style={{ color: c.textFaint }}>{r.created_at}</span>
    </div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
    </div>
      <SiteFooter />
    </div>
  );
}