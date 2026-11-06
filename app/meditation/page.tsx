'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '@/lib/i18n/LanguageContext';
import { useTheme } from '@/components/ThemeProvider';
import { useAuth } from '@/lib/auth/AuthContext';
import NavigationBar from '@/components/NavigationBar';
import SiteFooter from '@/components/SiteFooter';
import { Mandala, DharmaWheel, MeditationMudra, LotusFlower, BuddhaHalo } from '@/components/SacredDecorations';

const MEDITATION_DURATIONS = [
  { minutes: 15, zh: '15分钟', en: '15 min', descZh: '初学入门', descEn: 'Beginner' },
  { minutes: 30, zh: '30分钟', en: '30 min', descZh: '日常修习', descEn: 'Daily practice' },
  { minutes: 45, zh: '45分钟', en: '45 min', descZh: '深入禅定', descEn: 'Deep meditation' },
  { minutes: 60, zh: '60分钟', en: '60 min', descZh: '专业修行', descEn: 'Professional' },
];

const MEDITATION_POSTURES = [
  { zh: '盘腿坐', en: 'Cross-legged', descZh: '双腿盘坐，脊柱正直，双手结印', descEn: 'Legs crossed, spine straight, hands in mudra' },
  { zh: '椅坐', en: 'Chair Sitting', descZh: '端坐椅上，双脚平放，手放膝上', descEn: 'Sit on chair, feet flat, hands on knees' },
  { zh: '跪坐', en: 'Kneeling', descZh: '双膝跪地，臀部坐于脚跟', descEn: 'Kneel with hips on heels' },
];

const MEDITATION_BENEFITS = [
  { zh: '静心定慧', en: 'Calm Mind', descZh: '安定心神，增长智慧，远离烦恼', descEn: 'Calm the mind, grow wisdom' },
  { zh: '养生延年', en: 'Longevity', descZh: '调和气血，强健脏腑，延年益寿', descEn: 'Balance qi and blood, strengthen organs' },
  { zh: '减压安神', en: 'Stress Relief', descZh: '缓解压力，改善睡眠，安定情绪', descEn: 'Relieve stress, improve sleep' },
  { zh: '提升专注', en: 'Focus', descZh: '增强注意力，提升工作效率', descEn: 'Enhance concentration and productivity' },
];

const BREATHING_PHASES = [
  { zh: '吸气', en: 'Inhale', duration: 4 },
  { zh: '屏息', en: 'Hold', duration: 2 },
  { zh: '呼气', en: 'Exhale', duration: 6 },
];


function MeditationCircle({ color, isRunning }: { color: string; isRunning: boolean }) {
  return (
    <svg width={120} height={120} viewBox="0 0 120 120" fill="none">
      <motion.circle
        cx="60" cy="60" r="50"
        stroke={color}
        strokeWidth="1.5"
        opacity={0.2}
        animate={isRunning ? { scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] } : {}}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: 'center' }}
      />
      <motion.circle
        cx="60" cy="60" r="35"
        stroke={color}
        strokeWidth="1"
        opacity={0.15}
        animate={isRunning ? { scale: [1, 1.15, 1], opacity: [0.15, 0.3, 0.15] } : {}}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        style={{ transformOrigin: 'center' }}
      />
      <motion.circle
        cx="60" cy="60" r="20"
        stroke={color}
        strokeWidth="1"
        opacity={0.1}
        animate={isRunning ? { scale: [1, 1.2, 1], opacity: [0.1, 0.25, 0.1] } : {}}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        style={{ transformOrigin: 'center' }}
      />
      <circle cx="60" cy="60" r="6" fill={color} opacity={0.3} />
    </svg>
  );
}

export default function MeditationPage() {
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
    blueAccent: isDark ? '#60a5fa' : '#3b82f6',
    blueBg: isDark ? 'rgba(96,165,250,0.08)' : 'rgba(59,130,246,0.08)',
  };

  const [selectedDuration, setSelectedDuration] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [remainingSec, setRemainingSec] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [todayChecked, setTodayChecked] = useState(false);
  const [streak, setStreak] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [creditsAwarded, setCreditsAwarded] = useState(0);
  const [records, setRecords] = useState<Array<{ duration_minutes: number; created_at: string }>>([]);
  const [showHistory, setShowHistory] = useState(false);

  const [showKnowledge, setShowKnowledge] = useState(false);
  const [breathPhase, setBreathPhase] = useState(0);
  const [showBreathing, setShowBreathing] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const breathRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (user) {
      loadStreak();
      loadHistory();

    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (breathRef.current) clearInterval(breathRef.current);
    };
  }, [user]);

  useEffect(() => {
    if (showBreathing && !isRunning) {
      let phase = 0;
      breathRef.current = setInterval(() => {
        phase = (phase + 1) % BREATHING_PHASES.length;
        setBreathPhase(phase);
      }, 2000);
      return () => { if (breathRef.current) clearInterval(breathRef.current); };
    }
  }, [showBreathing, isRunning]);

  const loadStreak = async () => {
    try {
      const res = await fetch('/api/wellness?action=streak&practice_type=meditation');
      const data = await res.json();
      if (data.streak) {
        setStreak(data.streak.current_streak);
        setTodayChecked(data.streak.today_checked);
      }
    } catch { /* not logged in */ }
  };

  const loadHistory = async () => {
    try {
      const res = await fetch('/api/wellness?practice_type=meditation');
      const data = await res.json();
      if (data.records) setRecords(data.records);
    } catch { /* not logged in */ }
  };


  const startTimer = () => {
    if (!selectedDuration || isRunning) return;
    setRemainingSec(selectedDuration * 60);
    setIsRunning(true);
    setCompleted(false);
    setShowBreathing(true);
    timerRef.current = setInterval(() => {
      setRemainingSec(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          if (breathRef.current) clearInterval(breathRef.current);
          setIsRunning(false);
          setCompleted(true);
          setShowBreathing(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (breathRef.current) clearInterval(breathRef.current);
    setIsRunning(false);
    setRemainingSec(0);
    setCompleted(false);
    setShowBreathing(false);
  };

  const handleCheckIn = async () => {
    if (!completed) return;
    try {
      const res = await fetch('/api/wellness', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          practice_type: 'meditation',
          duration_minutes: selectedDuration,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStreak(data.streak.current_streak);
        setTodayChecked(data.streak.today_checked);
        setCreditsAwarded(data.credits_awarded || 0);
        setShowSuccess(true);
        setTimeout(() => { setShowSuccess(false); setSelectedDuration(0); setCompleted(false); }, 4000);
        loadHistory();

      }
    } catch { /* not logged in */ }
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };


  return (
    <div style={{ minHeight: '100vh', background: c.bg, color: c.text, position: 'relative', overflow: 'hidden' }}>
      {/* 庄严装饰背景 */}
      <div className="absolute pointer-events-none" style={{ top: '5%', left: '50%', transform: 'translateX(-50%)', zIndex: 0 }}>
        <Mandala size={400} color={c.goldSolid} opacity={0.04} />
    </div>
      <div className="absolute pointer-events-none" style={{ top: '8%', left: '5%', zIndex: 0 }}>
        <DharmaWheel size={80} color={c.goldSolid} opacity={0.06} />
    </div>
      <div className="absolute pointer-events-none" style={{ top: '12%', right: '5%', zIndex: 0 }}>
        <BuddhaHalo size={200} color={c.goldSolid} opacity={0.05} />
    </div>
      <div className="absolute pointer-events-none" style={{ bottom: '10%', left: '50%', transform: 'translateX(-50%)', zIndex: 0 }}>
        <LotusFlower size={150} color={c.goldSolid} opacity={0.06} />
    </div>
      <div className="absolute pointer-events-none" style={{ bottom: '15%', right: '8%', zIndex: 0 }}>
        <MeditationMudra size={70} color={c.goldSolid} opacity={0.06} />
    </div>
      <NavigationBar />
      <div className="max-w-2xl mx-auto px-4 pt-20 pb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
          <motion.div className="flex justify-center mb-2" animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}>
            <MeditationCircle color={c.blueAccent} isRunning={isRunning} />
          </motion.div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: c.blueAccent }}>{lang === 'zh' ? '打坐打卡' : 'Meditation Check-in'}</h1>
          <p className="text-sm" style={{ color: c.textMuted }}>{lang === 'zh' ? '静心定慧，养生延年' : 'Still the mind, cultivate wisdom and longevity'}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex justify-center mb-4">
          <div className="flex items-center gap-4 px-6 py-4 rounded-2xl" style={{ background: c.cardBg, border: `1px solid ${c.border}` }}>
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color: c.blueAccent }}>{streak}</div>
              <div className="text-xs mt-1" style={{ color: c.textMuted }}>{lang === 'zh' ? '连续天数' : 'Day Streak'}</div>
    </div>
            <div className="w-px h-12" style={{ background: c.border }} />
            <div className="text-center">
              <motion.div animate={todayChecked ? { scale: [1, 1.2, 1] } : {}} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: todayChecked ? c.blueAccent : c.cardBg, border: `1px solid ${todayChecked ? c.blueAccent : c.border}` }}>
                {todayChecked ? <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8L6.5 11.5L13 4.5" stroke="#1a1a2e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg> : <span style={{ fontSize: 18 }}>🧘</span>}
              </motion.div>
              <div className="text-xs mt-1" style={{ color: c.textMuted }}>{lang === 'zh' ? '今日打坐' : 'Today'}</div>
    </div>
    </div>
        </motion.div>


        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-4 text-xs" style={{ color: c.textFaint }}>{lang === 'zh' ? '每日打卡 +2积分' : 'Daily check-in +2 credits'}</motion.div>

        <AnimatePresence mode="wait">
          {showSuccess ? (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="flex flex-col items-center py-12">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }} className="relative">
                <motion.div className="absolute inset-0 rounded-full" style={{ background: `radial-gradient(circle, ${c.blueAccent}40, transparent 70%)`, filter: 'blur(20px)' }} animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 2, repeat: Infinity }} />
                <motion.div className="w-24 h-24 rounded-full flex items-center justify-center relative" style={{ border: `3px solid ${c.blueAccent}`, boxShadow: `0 0 30px ${c.blueAccent}60` }} animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}>
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><path d="M8 20L16 28L32 12" stroke={c.blueAccent} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </motion.div>
              </motion.div>
              <motion.p className="mt-8 text-lg font-medium" style={{ color: c.blueAccent }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>{lang === 'zh' ? '打卡成功！' : 'Check-in Successful!'}</motion.p>
              {creditsAwarded > 0 && <motion.p className="mt-2 text-sm font-medium" style={{ color: c.blueAccent }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>{lang === 'zh' ? `获得 ${creditsAwarded} 积分` : `+${creditsAwarded} credits`}</motion.p>}
              <motion.p className="mt-2 text-sm" style={{ color: c.textMuted }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>{lang === 'zh' ? `已连续打坐 ${streak} 天` : `${streak} day streak`}</motion.p>
              <motion.p className="mt-1 text-xs" style={{ color: c.textFaint }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>{lang === 'zh' ? '静定生慧，心安自在' : 'Stillness breeds wisdom, peace within'}</motion.p>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">

              <div>
                <label className="text-sm mb-3 block" style={{ color: c.textMuted }}>{lang === 'zh' ? '选择打坐时长' : 'Select Duration'}</label>
                <div className="grid grid-cols-4 gap-3">
                  {MEDITATION_DURATIONS.map(d => (
                    <motion.button key={d.minutes} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={() => { setSelectedDuration(d.minutes); stopTimer(); }} disabled={isRunning} className="p-3 rounded-xl text-center transition-all" style={{ background: selectedDuration === d.minutes ? c.blueAccent : c.cardBg, color: selectedDuration === d.minutes ? '#1a1a2e' : c.text, border: `1px solid ${selectedDuration === d.minutes ? c.blueAccent : c.border}`, opacity: isRunning ? 0.5 : 1 }}>
                      <div className="font-medium text-sm">{lang === 'zh' ? d.zh : d.en}</div>
                      <div className="text-xs mt-0.5 opacity-60">{lang === 'zh' ? d.descZh : d.descEn}</div>
                    </motion.button>
                  ))}
    </div>
    </div>

              {showBreathing && isRunning && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="rounded-xl p-6" style={{ background: c.cardBg, border: `1px solid ${c.blueAccent}40` }}>
                  <div className="text-center">
                    <motion.div
                      className="w-20 h-20 mx-auto rounded-full flex items-center justify-center"
                      style={{ background: `${c.blueAccent}20`, border: `2px solid ${c.blueAccent}` }}
                      animate={{
                        scale: breathPhase === 0 ? [1, 1.3, 1] : breathPhase === 2 ? [1.3, 1, 1] : 1.3,
                      }}
                      transition={{ duration: breathPhase === 0 ? 4 : breathPhase === 2 ? 6 : 2, ease: 'easeInOut' }}
                    >
                      <span className="text-sm font-medium" style={{ color: c.blueAccent }}>
                        {lang === 'zh' ? BREATHING_PHASES[breathPhase].zh : BREATHING_PHASES[breathPhase].en}
                      </span>
                    </motion.div>
                    <p className="text-xs mt-3" style={{ color: c.textMuted }}>
                      {lang === 'zh' ? '跟随节奏，调整呼吸' : 'Follow the rhythm, adjust your breath'}
                    </p>
    </div>
                </motion.div>
              )}

              {selectedDuration > 0 && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="rounded-xl p-6" style={{ background: c.cardBg, border: `1px solid ${c.border}` }}>
                  <div className="text-center">
                    <div className="text-5xl font-bold mb-4" style={{ color: isRunning ? c.blueAccent : completed ? c.blueAccent : c.text }}>
                      {isRunning ? formatTime(remainingSec) : completed ? '00:00' : `${selectedDuration}:00`}
    </div>
                    <div className="w-full h-2 rounded-full overflow-hidden mb-4" style={{ background: c.border }}>
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: c.blueAccent }}
                        animate={{ width: isRunning ? `${((selectedDuration * 60 - remainingSec) / (selectedDuration * 60)) * 100}%` : completed ? '100%' : '0%' }}
                        transition={{ duration: 0.5 }}
                      />
    </div>
                    {!isRunning && !completed && (
                      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={startTimer} className="px-8 py-2.5 rounded-xl font-medium" style={{ background: c.blueAccent, color: '#1a1a2e' }}>
                        {lang === 'zh' ? '开始打坐' : 'Start'}
                      </motion.button>
                    )}
                    {isRunning && (
                      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={stopTimer} className="px-8 py-2.5 rounded-xl font-medium" style={{ background: '#dc3535', color: '#fff' }}>
                        {lang === 'zh' ? '停止' : 'Stop'}
                      </motion.button>
                    )}
                    {completed && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <p className="text-sm mb-3" style={{ color: c.blueAccent }}>{lang === 'zh' ? '打坐完成 ✓' : 'Meditation completed ✓'}</p>
                      </motion.div>
                    )}
    </div>
                </motion.div>
              )}

              <motion.button
                whileHover={{ scale: 1.01 }}
                onClick={() => setShowKnowledge(!showKnowledge)}
                className="w-full py-2.5 rounded-xl text-sm flex items-center justify-center gap-2"
                style={{ background: c.blueBg, border: `1px solid ${c.blueAccent}30`, color: c.blueAccent }}
              >
                {lang === 'zh' ? '打坐知识' : 'Meditation Knowledge'} {showKnowledge ? '▾' : '▸'}
              </motion.button>

              <AnimatePresence>
                {showKnowledge && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2" style={{ color: c.blueAccent }}>{lang === 'zh' ? '打坐功效' : 'Benefits'}</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {MEDITATION_BENEFITS.map(b => (
                          <div key={b.zh} className="p-3 rounded-lg" style={{ background: c.cardBg, border: `1px solid ${c.border}` }}>
                            <div className="text-sm font-medium" style={{ color: c.blueAccent }}>{lang === 'zh' ? b.zh : b.en}</div>
                            <div className="text-xs mt-1" style={{ color: c.textMuted }}>{lang === 'zh' ? b.descZh : b.descEn}</div>
    </div>
                        ))}
    </div>
    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-2" style={{ color: c.blueAccent }}>{lang === 'zh' ? '坐姿方法' : 'Postures'}</h3>
                      <div className="space-y-2">
                        {MEDITATION_POSTURES.map(p => (
                          <div key={p.zh} className="p-3 rounded-lg flex items-start gap-3" style={{ background: c.cardBg, border: `1px solid ${c.border}` }}>
                            <div className="flex-1">
                              <div className="text-sm font-medium" style={{ color: c.blueAccent }}>{lang === 'zh' ? p.zh : p.en}</div>
                              <div className="text-xs mt-1" style={{ color: c.textMuted }}>{lang === 'zh' ? p.descZh : p.descEn}</div>
    </div>
    </div>
                        ))}
    </div>
    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-2" style={{ color: c.blueAccent }}>{lang === 'zh' ? '呼吸引导' : 'Breathing Guide'}</h3>
                      <div className="p-3 rounded-lg" style={{ background: c.cardBg, border: `1px solid ${c.border}` }}>
                        <div className="flex justify-around text-center">
                          {BREATHING_PHASES.map((phase) => (
                            <div key={phase.zh}>
                              <div className="text-sm font-medium" style={{ color: c.blueAccent }}>{lang === 'zh' ? phase.zh : phase.en}</div>
                              <div className="text-xs mt-1" style={{ color: c.textMuted }}>{phase.duration}{lang === 'zh' ? '秒' : 's'}</div>
    </div>
                          ))}
    </div>
                        <p className="text-xs mt-2 text-center" style={{ color: c.textFaint }}>{lang === 'zh' ? '4秒吸气 → 2秒屏息 → 6秒呼气，循环往复' : '4s inhale → 2s hold → 6s exhale, repeat'}</p>
    </div>
    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex justify-center gap-3">
                <motion.button whileHover={{ scale: completed ? 1.03 : 1 }} whileTap={{ scale: completed ? 0.97 : 1 }} onClick={handleCheckIn} disabled={!completed || !user} className="px-10 py-3 rounded-xl font-medium" style={{ background: completed && user ? c.blueAccent : c.border, color: '#1a1a2e', cursor: completed && user ? 'pointer' : 'not-allowed' }}>
                  {lang === 'zh' ? '打卡打坐' : 'Check In'}
                </motion.button>
                {user && (
                  <button onClick={() => setShowHistory(!showHistory)} className="px-4 py-3 rounded-xl text-sm" style={{ background: c.cardBg, border: `1px solid ${c.border}`, color: c.textMuted }}>{lang === 'zh' ? '打卡记录' : 'History'}</button>
                )}
    </div>

              {!completed && selectedDuration > 0 && <p className="text-center text-xs" style={{ color: c.textFaint }}>{lang === 'zh' ? '请先完成打坐计时' : 'Please complete meditation timer first'}</p>}
              {!user && <p className="text-center text-xs" style={{ color: c.textFaint }}>{lang === 'zh' ? '登录后可记录打卡数据' : 'Sign in to track your progress'}</p>}

              {showHistory && records.length > 0 && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-2">
                  <h3 className="text-sm font-medium" style={{ color: c.blueAccent }}>{lang === 'zh' ? '近期打卡' : 'Recent Check-ins'}</h3>
                  {records.slice(0, 10).map((r, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg text-sm" style={{ background: c.cardBg, border: `1px solid ${c.border}` }}>
                      <span style={{ color: c.text }}>{r.duration_minutes} {lang === 'zh' ? '分钟' : 'min'}</span>
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