'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '@/lib/i18n/LanguageContext';
import { useTheme } from '@/components/ThemeProvider';
import { useAuth } from '@/lib/auth/AuthContext';
import NavigationBar from '@/components/NavigationBar';
import SiteFooter from '@/components/SiteFooter';
import { LotusFlower, AuspiciousCloud, BodhiLeaf } from '@/components/SacredDecorations';

const VEGETARIAN_TYPES = [
  { key: 'full', zh: '全素', en: 'Full Vegetarian', descZh: '不食任何动物制品', descEn: 'No animal products', icon: '🥬' },
  { key: 'egg_dairy', zh: '蛋奶素', en: 'Egg & Dairy', descZh: '可食蛋类和奶制品', descEn: 'Eggs and dairy allowed', icon: '🥚' },
  { key: 'occasional', zh: '花素', en: 'Occasional', descZh: '特定日子吃素（初一十五等）', descEn: 'Vegetarian on specific days', icon: '🌸' },
  { key: 'flexible', zh: '随喜素', en: 'Flexible', descZh: '随缘吃素，不严格限制', descEn: 'Flexible vegetarian', icon: '🍃' },
];

const VEGETARIAN_BENEFITS = [
  { zh: '慈悲护生', en: 'Compassion', descZh: '不杀生，培养慈悲心，与万物和谐共处', descEn: 'Non-killing, cultivate compassion' },
  { zh: '清净身心', en: 'Purify Body', descZh: '减轻肠胃负担，身体轻盈，精神清明', descEn: 'Lighten digestive load, clear mind' },
  { zh: '积累福报', en: 'Merit', descZh: '吃斋一餐，放生一次，功德无量', descEn: 'Each vegetarian meal is an act of merit' },
  { zh: '环保减碳', en: 'Eco-Friendly', descZh: '减少畜牧业碳排放，守护地球', descEn: 'Reduce carbon footprint' },
];

const VEGETARIAN_TIPS = [
  { zh: '蛋白质补充', en: 'Protein', descZh: '多食豆类、坚果、菌菇，保证蛋白质摄入', descEn: 'Beans, nuts, mushrooms for protein' },
  { zh: '铁质吸收', en: 'Iron', descZh: '搭配维生素C丰富的蔬果，促进铁质吸收', descEn: 'Pair with vitamin C for iron absorption' },
  { zh: '维生素B12', en: 'B12', descZh: '全素者需注意B12补充，可食发酵食品', descEn: 'Full vegetarians need B12 supplement' },
  { zh: '循序渐进', en: 'Gradual', descZh: '初学者可从花素开始，逐步适应', descEn: 'Start with occasional, gradually adapt' },
];


function VeggieLeaf({ color, size = 80 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
      <motion.path
        d="M40 10 C20 20, 15 45, 40 70 C65 45, 60 20, 40 10 Z"
        fill={color}
        opacity={0.15}
        animate={{ scale: [1, 1.05, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <path d="M40 10 L40 70" stroke={color} strokeWidth="1" opacity={0.3} />
      <path d="M40 25 C30 28, 25 35, 28 42" stroke={color} strokeWidth="0.8" opacity={0.25} fill="none" />
      <path d="M40 25 C50 28, 55 35, 52 42" stroke={color} strokeWidth="0.8" opacity={0.25} fill="none" />
      <path d="M40 40 C30 43, 25 50, 30 55" stroke={color} strokeWidth="0.8" opacity={0.25} fill="none" />
      <path d="M40 40 C50 43, 55 50, 50 55" stroke={color} strokeWidth="0.8" opacity={0.25} fill="none" />
    </svg>
  );
}

export default function VegetarianPage() {
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
    greenAccent: isDark ? '#4ade80' : '#2D7A4A',
    greenBg: isDark ? 'rgba(74,222,128,0.08)' : 'rgba(45,122,74,0.08)',
  };

  const [selectedType, setSelectedType] = useState('');
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
      const res = await fetch('/api/wellness?action=streak&practice_type=vegetarian');
      const data = await res.json();
      if (data.streak) {
        setStreak(data.streak.current_streak);
        setTodayChecked(data.streak.today_checked);
      }
    } catch { /* not logged in */ }
  };

  const loadHistory = async () => {
    try {
      const res = await fetch('/api/wellness?practice_type=vegetarian');
      const data = await res.json();
      if (data.records) setRecords(data.records);
    } catch { /* not logged in */ }
  };


  const handleCheckIn = async () => {
    if (!selectedType) return;
    const subType = VEGETARIAN_TYPES.find(t => t.key === selectedType);
    try {
      const res = await fetch('/api/wellness', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          practice_type: 'vegetarian',
          sub_type: lang === 'zh' ? subType!.zh : subType!.en,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStreak(data.streak.current_streak);
        setTodayChecked(data.streak.today_checked);
        setCreditsAwarded(data.credits_awarded || 0);
        setShowSuccess(true);
        setTimeout(() => { setShowSuccess(false); setSelectedType(''); }, 4000);
        loadHistory();

      }
    } catch { /* not logged in */ }
  };


  return (
    <div style={{ minHeight: '100vh', background: c.bg, color: c.text, position: 'relative', overflow: 'hidden' }}>
      {/* 庄严装饰背景 */}
      <div className="absolute pointer-events-none" style={{ top: '5%', left: '50%', transform: 'translateX(-50%)', zIndex: 0 }}>
        <LotusFlower size={250} color={c.goldSolid} opacity={0.05} />
    </div>
      <div className="absolute pointer-events-none" style={{ top: '10%', left: '5%', zIndex: 0 }}>
        <AuspiciousCloud size={130} color={c.goldSolid} opacity={0.06} />
    </div>
      <div className="absolute pointer-events-none" style={{ top: '15%', right: '5%', zIndex: 0 }}>
        <AuspiciousCloud size={110} color={c.goldSolid} opacity={0.05} />
    </div>
      <div className="absolute pointer-events-none" style={{ bottom: '10%', right: '8%', zIndex: 0 }}>
        <BodhiLeaf size={70} color={c.greenAccent} opacity={0.06} />
    </div>
      <div className="absolute pointer-events-none" style={{ bottom: '8%', left: '8%', zIndex: 0 }}>
        <LotusFlower size={100} color={c.greenAccent} opacity={0.05} />
    </div>
      <NavigationBar />
      <div className="max-w-2xl mx-auto px-4 pt-20 pb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">

          <h1 className="text-2xl font-bold mb-2" style={{ color: c.greenAccent }}>
            {lang === 'zh' ? '吃斋打卡' : 'Vegetarian Check-in'}
          </h1>
          <p className="text-sm" style={{ color: c.textMuted }}>
            {lang === 'zh' ? '慈悲护生，清净身心，积累福报' : 'Compassion for all beings, purify body and mind'}
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex justify-center mb-4">
          <div className="flex items-center gap-4 px-6 py-4 rounded-2xl" style={{ background: c.cardBg, border: `1px solid ${c.border}`, boxShadow: `0 4px 24px rgba(0,0,0,0.15), inset 0 0 40px ${c.greenAccent}08` }}>
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color: c.greenAccent }}>{streak}</div>
              <div className="text-xs mt-1" style={{ color: c.textMuted }}>{lang === 'zh' ? '连续天数' : 'Day Streak'}</div>
    </div>
            <div className="w-px h-12" style={{ background: c.border }} />
            <div className="text-center">
              <motion.div animate={todayChecked ? { scale: [1, 1.2, 1] } : {}} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: todayChecked ? c.greenAccent : c.cardBg, border: `1px solid ${todayChecked ? c.greenAccent : c.border}` }}>
                {todayChecked ? <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8L6.5 11.5L13 4.5" stroke="#1a1a2e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg> : <span style={{ fontSize: 18 }}>🥬</span>}
              </motion.div>
              <div className="text-xs mt-1" style={{ color: c.textMuted }}>{lang === 'zh' ? '今日吃斋' : 'Today'}</div>
    </div>
    </div>
        </motion.div>


        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-4 text-xs" style={{ color: c.textFaint }}>
          {lang === 'zh' ? '每日打卡 +2积分' : 'Daily check-in +2 credits'}
        </motion.div>

        <AnimatePresence mode="wait">
          {showSuccess ? (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="flex flex-col items-center py-12">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }} className="relative">
                <motion.div className="absolute inset-0 rounded-full" style={{ background: `radial-gradient(circle, ${c.greenAccent}40, transparent 70%)`, filter: 'blur(20px)' }} animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 2, repeat: Infinity }} />
                <motion.div className="w-24 h-24 rounded-full flex items-center justify-center relative" style={{ border: `3px solid ${c.greenAccent}`, boxShadow: `0 0 30px ${c.greenAccent}60` }} animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}>
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><path d="M8 20L16 28L32 12" stroke={c.greenAccent} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </motion.div>
              </motion.div>
              <motion.p className="mt-8 text-lg font-medium" style={{ color: c.greenAccent }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>{lang === 'zh' ? '打卡成功！' : 'Check-in Successful!'}</motion.p>
              {creditsAwarded > 0 && <motion.p className="mt-2 text-sm font-medium" style={{ color: c.greenAccent }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>{lang === 'zh' ? `获得 ${creditsAwarded} 积分` : `+${creditsAwarded} credits`}</motion.p>}
              <motion.p className="mt-2 text-sm" style={{ color: c.textMuted }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>{lang === 'zh' ? `已连续吃斋 ${streak} 天` : `${streak} day streak`}</motion.p>
              <motion.p className="mt-1 text-xs" style={{ color: c.textFaint }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>{lang === 'zh' ? '慈悲护生，功德无量' : 'Compassion for all beings, merit boundless'}</motion.p>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">

              <div>
                <label className="text-sm mb-3 block" style={{ color: c.textMuted }}>{lang === 'zh' ? '选择吃斋类型' : 'Select Vegetarian Type'}</label>
                <div className="grid grid-cols-2 gap-3">
                  {VEGETARIAN_TYPES.map(vtype => (
                    <motion.button key={vtype.key} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={() => setSelectedType(vtype.key)} className="p-4 rounded-xl text-left transition-all" style={{ background: selectedType === vtype.key ? c.greenAccent : c.cardBg, color: selectedType === vtype.key ? '#1a1a2e' : c.text, border: `1px solid ${selectedType === vtype.key ? c.greenAccent : c.border}`, cursor: 'pointer' }}>
                      <div className="flex items-center gap-2">
                        <span style={{ fontSize: 20 }}>{vtype.icon}</span>
                        <div className="font-medium text-sm">{lang === 'zh' ? vtype.zh : vtype.en}</div>
    </div>
                      <div className="text-xs mt-1 opacity-70">{lang === 'zh' ? vtype.descZh : vtype.descEn}</div>
                    </motion.button>
                  ))}
    </div>
    </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                onClick={() => setShowKnowledge(!showKnowledge)}
                className="w-full py-2.5 rounded-xl text-sm flex items-center justify-center gap-2"
                style={{ background: c.greenBg, border: `1px solid ${c.greenAccent}30`, color: c.greenAccent }}
              >
                {lang === 'zh' ? '吃斋知识' : 'Vegetarian Knowledge'} {showKnowledge ? '▾' : '▸'}
              </motion.button>

              <AnimatePresence>
                {showKnowledge && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2" style={{ color: c.greenAccent }}>{lang === 'zh' ? '吃斋功德' : 'Benefits of Vegetarianism'}</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {VEGETARIAN_BENEFITS.map(b => (
                          <div key={b.zh} className="p-3 rounded-lg" style={{ background: c.cardBg, border: `1px solid ${c.border}` }}>
                            <div className="text-sm font-medium" style={{ color: c.greenAccent }}>{lang === 'zh' ? b.zh : b.en}</div>
                            <div className="text-xs mt-1" style={{ color: c.textMuted }}>{lang === 'zh' ? b.descZh : b.descEn}</div>
    </div>
                        ))}
    </div>
    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-2" style={{ color: c.greenAccent }}>{lang === 'zh' ? '营养建议' : 'Nutrition Tips'}</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {VEGETARIAN_TIPS.map(t => (
                          <div key={t.zh} className="p-3 rounded-lg" style={{ background: c.cardBg, border: `1px solid ${c.border}` }}>
                            <div className="text-sm font-medium" style={{ color: c.greenAccent }}>{lang === 'zh' ? t.zh : t.en}</div>
                            <div className="text-xs mt-1" style={{ color: c.textMuted }}>{lang === 'zh' ? t.descZh : t.descEn}</div>
    </div>
                        ))}
    </div>
    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex justify-center gap-3">
                <motion.button whileHover={{ scale: selectedType ? 1.03 : 1 }} whileTap={{ scale: selectedType ? 0.97 : 1 }} onClick={handleCheckIn} disabled={!selectedType || !user} className="px-10 py-3 rounded-xl font-medium" style={{ background: selectedType && user ? c.greenAccent : c.border, color: '#1a1a2e', cursor: selectedType && user ? 'pointer' : 'not-allowed' }}>
                  {lang === 'zh' ? '打卡吃斋' : 'Check In'}
                </motion.button>
                {user && (
                  <button onClick={() => setShowHistory(!showHistory)} className="px-4 py-3 rounded-xl text-sm" style={{ background: c.cardBg, border: `1px solid ${c.border}`, color: c.textMuted }}>{lang === 'zh' ? '打卡记录' : 'History'}</button>
                )}
    </div>

              {!user && <p className="text-center text-xs" style={{ color: c.textFaint }}>{lang === 'zh' ? '登录后可记录打卡数据' : 'Sign in to track your progress'}</p>}

              {showHistory && records.length > 0 && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-2">
                  <h3 className="text-sm font-medium" style={{ color: c.greenAccent }}>{lang === 'zh' ? '近期打卡' : 'Recent Check-ins'}</h3>
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