'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '@/lib/i18n/LanguageContext';
import { useTheme } from '@/components/ThemeProvider';
import { useAuth } from '@/lib/auth/AuthContext';
import NavigationBar from '@/components/NavigationBar';
import SiteFooter from '@/components/SiteFooter';
import { LotusFlower, BuddhaHalo, SeedSyllable, SacredFlame, AuspiciousCloud } from '@/components/SacredDecorations';

const CHARITY_TYPES = [
  { key: 'help', zh: '乐于助人', en: 'Helping Others', descZh: '帮助他人解决困难，伸出援手', descEn: 'Help others in need', icon: '🤝' },
  { key: 'environment', zh: '爱护环境', en: 'Environment', descZh: '保护环境，节约资源，垃圾分类', descEn: 'Protect environment, save resources', icon: '🌱' },
  { key: 'donate', zh: '捐款捐物', en: 'Donation', descZh: '捐助善款物资，支持公益慈善', descEn: 'Donate money or goods to charity', icon: '💝' },
  { key: 'volunteer', zh: '志愿服务', en: 'Volunteer', descZh: '参与志愿活动，奉献时间和精力', descEn: 'Volunteer time and effort', icon: '🙋' },
  { key: 'kindness', zh: '日行一善', en: 'Daily Kindness', descZh: '每天做一件善事，积少成多', descEn: 'One good deed per day', icon: '✨' },
  { key: 'care', zh: '关爱生命', en: 'Care for Life', descZh: '关爱老人儿童，放生护生', descEn: 'Care for elderly, children, animals', icon: '❤️' },
];

const CHARITY_BENEFITS = [
  { zh: '积累福报', en: 'Merit', descZh: '善行积德，福报无量，因果不虚', descEn: 'Good deeds accumulate merit' },
  { zh: '温暖人心', en: 'Warm Hearts', descZh: '善意传递，温暖他人，照亮世界', descEn: 'Kindness warms hearts and lights the world' },
  { zh: '提升境界', en: 'Elevate Mind', descZh: '行善修心，提升精神境界，超越自我', descEn: 'Elevate spiritual level through charity' },
  { zh: '社会和谐', en: 'Harmony', descZh: '人人行善，社会和谐，世界和平', descEn: 'Universal charity creates social harmony' },
];


function CharityHeart({ color, size = 70 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 70 70" fill="none">
      <motion.path
        d="M35 12 C25 12, 18 20, 18 30 C18 42, 35 55, 35 55 C35 55, 52 42, 52 30 C52 20, 45 12, 35 12 Z"
        fill={color}
        opacity={0.12}
        animate={{ scale: [1, 1.08, 1], opacity: [0.08, 0.18, 0.08] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: 'center' }}
      />
      <path
        d="M35 12 C25 12, 18 20, 18 30 C18 42, 35 55, 35 55 C35 55, 52 42, 52 30 C52 20, 45 12, 35 12 Z"
        stroke={color}
        strokeWidth="1.5"
        opacity={0.35}
      />
      <motion.circle
        cx="35" cy="30" r="3"
        fill={color}
        opacity={0.4}
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />
    </svg>
  );
}

export default function CharityPage() {
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
    roseAccent: isDark ? '#fb7185' : '#be123c',
    roseBg: isDark ? 'rgba(251,113,133,0.08)' : 'rgba(190,18,60,0.08)',
  };

  const [selectedType, setSelectedType] = useState('');
  const [note, setNote] = useState('');
  const [todayChecked, setTodayChecked] = useState(false);
  const [streak, setStreak] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [creditsAwarded, setCreditsAwarded] = useState(0);
  const [records, setRecords] = useState<Array<{ sub_type: string; note: string; created_at: string }>>([]);
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
      const res = await fetch('/api/wellness?action=streak&practice_type=charity');
      const data = await res.json();
      if (data.streak) {
        setStreak(data.streak.current_streak);
        setTodayChecked(data.streak.today_checked);
      }
    } catch { /* not logged in */ }
  };

  const loadHistory = async () => {
    try {
      const res = await fetch('/api/wellness?practice_type=charity');
      const data = await res.json();
      if (data.records) setRecords(data.records);
    } catch { /* not logged in */ }
  };


  const handleCheckIn = async () => {
    if (!selectedType) return;
    const typeObj = CHARITY_TYPES.find(t => t.key === selectedType);
    try {
      const res = await fetch('/api/wellness', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          practice_type: 'charity',
          sub_type: lang === 'zh' ? typeObj!.zh : typeObj!.en,
          note: note || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStreak(data.streak.current_streak);
        setTodayChecked(data.streak.today_checked);
        setCreditsAwarded(data.credits_awarded || 0);
        setShowSuccess(true);
        setTimeout(() => { setShowSuccess(false); setSelectedType(''); setNote(''); }, 4000);
        loadHistory();

      }
    } catch { /* not logged in */ }
  };


  return (
    <div style={{ minHeight: '100vh', background: c.bg, color: c.text, position: 'relative', overflow: 'hidden' }}>
      {/* 庄严装饰背景 */}
      <div className="absolute pointer-events-none" style={{ top: '5%', left: '50%', transform: 'translateX(-50%)', zIndex: 0 }}>
        <BuddhaHalo size={300} color={c.goldSolid} opacity={0.05} />
    </div>
      <div className="absolute pointer-events-none" style={{ top: '10%', left: '5%', zIndex: 0 }}>
        <LotusFlower size={120} color={c.goldSolid} opacity={0.06} />
    </div>
      <div className="absolute pointer-events-none" style={{ top: '15%', right: '5%', zIndex: 0 }}>
        <AuspiciousCloud size={130} color={c.goldSolid} opacity={0.05} />
    </div>
      <div className="absolute pointer-events-none" style={{ bottom: '10%', left: '8%', zIndex: 0 }}>
        <SacredFlame size={30} color={c.goldSolid} opacity={0.08} />
    </div>
      <div className="absolute pointer-events-none" style={{ bottom: '12%', right: '8%', zIndex: 0 }}>
        <SeedSyllable size={50} color={c.goldSolid} opacity={0.08} syllable="善" />
    </div>
      <div className="absolute pointer-events-none" style={{ bottom: '5%', left: '50%', transform: 'translateX(-50%)', zIndex: 0 }}>
        <LotusFlower size={150} color={c.goldSolid} opacity={0.04} />
    </div>
      <NavigationBar />
      <div className="max-w-2xl mx-auto px-4 pt-20 pb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">

          <h1 className="text-2xl font-bold mb-2" style={{ color: c.roseAccent }}>{lang === 'zh' ? '积德行善打卡' : 'Charity Check-in'}</h1>
          <p className="text-sm" style={{ color: c.textMuted }}>{lang === 'zh' ? '日行一善，积德累功，福报无量' : 'One good deed per day, accumulate merit'}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex justify-center mb-4">
          <div className="flex items-center gap-4 px-6 py-4 rounded-2xl" style={{ background: c.cardBg, border: `1px solid ${c.border}`, boxShadow: `0 4px 24px rgba(0,0,0,0.15), inset 0 0 40px ${c.roseAccent}08` }}>
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color: c.roseAccent }}>{streak}</div>
              <div className="text-xs mt-1" style={{ color: c.textMuted }}>{lang === 'zh' ? '连续天数' : 'Day Streak'}</div>
    </div>
            <div className="w-px h-12" style={{ background: c.border }} />
            <div className="text-center">
              <motion.div animate={todayChecked ? { scale: [1, 1.2, 1] } : {}} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: todayChecked ? c.roseAccent : c.cardBg, border: `1px solid ${todayChecked ? c.roseAccent : c.border}` }}>
                {todayChecked ? <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8L6.5 11.5L13 4.5" stroke="#1a1a2e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg> : null}
              </motion.div>
              <div className="text-xs mt-1" style={{ color: c.textMuted }}>{lang === 'zh' ? '今日行善' : 'Today'}</div>
    </div>
    </div>
        </motion.div>


        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-4 text-xs" style={{ color: c.textFaint }}>{lang === 'zh' ? '每日打卡 +2积分' : 'Daily check-in +2 credits'}</motion.div>

        <AnimatePresence mode="wait">
          {showSuccess ? (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="flex flex-col items-center py-12">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }} className="relative">
                <motion.div className="absolute inset-0 rounded-full" style={{ background: `radial-gradient(circle, ${c.roseAccent}40, transparent 70%)`, filter: 'blur(20px)' }} animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 2, repeat: Infinity }} />
                <motion.div className="w-24 h-24 rounded-full flex items-center justify-center relative" style={{ border: `3px solid ${c.roseAccent}`, boxShadow: `0 0 30px ${c.roseAccent}60` }} animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}>
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><path d="M8 20L16 28L32 12" stroke={c.roseAccent} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </motion.div>
              </motion.div>
              <motion.p className="mt-8 text-lg font-medium" style={{ color: c.roseAccent }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>{lang === 'zh' ? '打卡成功！' : 'Check-in Successful!'}</motion.p>
              {creditsAwarded > 0 && <motion.p className="mt-2 text-sm font-medium" style={{ color: c.roseAccent }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>{lang === 'zh' ? `获得 ${creditsAwarded} 积分` : `+${creditsAwarded} credits`}</motion.p>}
              <motion.p className="mt-2 text-sm" style={{ color: c.textMuted }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>{lang === 'zh' ? `已连续行善 ${streak} 天` : `${streak} day streak`}</motion.p>
              <motion.p className="mt-1 text-xs" style={{ color: c.textFaint }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>{lang === 'zh' ? '善行无疆，福报无边' : 'Boundless kindness, boundless merit'}</motion.p>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">

              <div>
                <label className="text-sm mb-3 block" style={{ color: c.textMuted }}>{lang === 'zh' ? '选择善行类型' : 'Select Charity Type'}</label>
                <div className="grid grid-cols-3 gap-3">
                  {CHARITY_TYPES.map(ctype => (
                    <motion.button key={ctype.key} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={() => setSelectedType(ctype.key)} className="p-3 rounded-xl text-center transition-all" style={{ background: selectedType === ctype.key ? c.roseAccent : c.cardBg, color: selectedType === ctype.key ? '#1a1a2e' : c.text, border: `1px solid ${selectedType === ctype.key ? c.roseAccent : c.border}`, cursor: 'pointer' }}>
                      <div style={{ fontSize: 22 }}>{ctype.icon}</div>
                      <div className="font-medium text-sm mt-1">{lang === 'zh' ? ctype.zh : ctype.en}</div>
                      <div className="text-xs mt-0.5 opacity-60">{lang === 'zh' ? ctype.descZh : ctype.descEn}</div>
                    </motion.button>
                  ))}
    </div>
    </div>

              {selectedType && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="rounded-xl p-4" style={{ background: c.cardBg, border: `1px solid ${c.border}` }}>
                  <label className="text-sm mb-2 block" style={{ color: c.textMuted }}>{lang === 'zh' ? '善行记录（可选）' : 'Note (optional)'}</label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value.slice(0, 200))}
                    placeholder={lang === 'zh' ? '记录今日善行内容...' : 'Describe your good deed...'}
                    rows={3}
                    className="w-full p-3 rounded-lg text-sm resize-none"
                    style={{ background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.03)', color: c.text, border: `1px solid ${c.border}` }}
                  />
                  <div className="text-xs text-right mt-1" style={{ color: c.textFaint }}>{note.length}/200</div>
                </motion.div>
              )}

              <motion.button
                whileHover={{ scale: 1.01 }}
                onClick={() => setShowKnowledge(!showKnowledge)}
                className="w-full py-2.5 rounded-xl text-sm flex items-center justify-center gap-2"
                style={{ background: c.roseBg, border: `1px solid ${c.roseAccent}30`, color: c.roseAccent }}
              >
                {lang === 'zh' ? '行善知识' : 'Charity Knowledge'} {showKnowledge ? '▾' : '▸'}
              </motion.button>

              <AnimatePresence>
                {showKnowledge && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2" style={{ color: c.roseAccent }}>{lang === 'zh' ? '行善功德' : 'Benefits'}</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {CHARITY_BENEFITS.map(b => (
                          <div key={b.zh} className="p-3 rounded-lg" style={{ background: c.cardBg, border: `1px solid ${c.border}` }}>
                            <div className="text-sm font-medium" style={{ color: c.roseAccent }}>{lang === 'zh' ? b.zh : b.en}</div>
                            <div className="text-xs mt-1" style={{ color: c.textMuted }}>{lang === 'zh' ? b.descZh : b.descEn}</div>
    </div>
                        ))}
    </div>
    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex justify-center gap-3">
                <motion.button whileHover={{ scale: selectedType && user ? 1.03 : 1 }} whileTap={{ scale: selectedType && user ? 0.97 : 1 }} onClick={handleCheckIn} disabled={!selectedType || !user} className="px-10 py-3 rounded-xl font-medium" style={{ background: selectedType && user ? c.roseAccent : c.border, color: '#1a1a2e', cursor: selectedType && user ? 'pointer' : 'not-allowed' }}>
                  {lang === 'zh' ? '打卡行善' : 'Check In'}
                </motion.button>
                {user && (
                  <button onClick={() => setShowHistory(!showHistory)} className="px-4 py-3 rounded-xl text-sm" style={{ background: c.cardBg, border: `1px solid ${c.border}`, color: c.textMuted }}>{lang === 'zh' ? '打卡记录' : 'History'}</button>
                )}
    </div>

              {!user && <p className="text-center text-xs" style={{ color: c.textFaint }}>{lang === 'zh' ? '登录后可记录打卡数据' : 'Sign in to track your progress'}</p>}

              {showHistory && records.length > 0 && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-2">
                  <h3 className="text-sm font-medium" style={{ color: c.roseAccent }}>{lang === 'zh' ? '近期打卡' : 'Recent Check-ins'}</h3>
                  {records.slice(0, 10).map((r, i) => (
                    <div key={i} className="p-3 rounded-lg text-sm" style={{ background: c.cardBg, border: `1px solid ${c.border}` }}>
                      <div className="flex items-center justify-between">
                        <span style={{ color: c.text }}>{r.sub_type}</span>
                        <span className="text-xs" style={{ color: c.textFaint }}>{r.created_at}</span>
    </div>
                      {r.note && <div className="text-xs mt-1" style={{ color: c.textMuted }}>{r.note}</div>}
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