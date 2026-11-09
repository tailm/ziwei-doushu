'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '@/lib/i18n/LanguageContext';
import { useTheme } from '@/components/ThemeProvider';
import { useAuth } from '@/lib/auth/AuthContext';
import NavigationBar from '@/components/NavigationBar';
import SiteFooter from '@/components/SiteFooter';
import { TempleBell, SeedSyllable, AuspiciousCloud, SacredFlame } from '@/components/SacredDecorations';

const REFLECTION_SESSIONS = [
  {
    key: 'morning',
    zh: '早省',
    en: 'Morning Reflection',
    icon: '☀',
    timeRange: '5:00 - 9:00',
    promptZh: '今日所为何事\n今日如何修身',
    promptEn: 'What to do today\nHow to cultivate today',
    placeholderZh: '规划今日要做的事，设定修身目标...',
    placeholderEn: 'Plan today\'s tasks, set cultivation goals...',
    color: '#e8a030',
  },
  {
    key: 'noon',
    zh: '午省',
    en: 'Noon Reflection',
    icon: '🌤',
    timeRange: '11:00 - 14:00',
    promptZh: '上午所行何事\n是否合乎正道',
    promptEn: 'What done this morning\nWas it righteous',
    placeholderZh: '回顾上午言行，是否偏离初心...',
    placeholderEn: 'Review morning actions, stayed true?',
    color: '#5078c8',
  },
  {
    key: 'evening',
    zh: '晚省',
    en: 'Evening Reflection',
    icon: '☾',
    timeRange: '20:00 - 23:00',
    promptZh: '今日所行何事\n得失几何\n明日如何改进',
    promptEn: 'What done today\nGains and losses\nHow to improve tomorrow',
    placeholderZh: '总结今日得失，反思改进方向...',
    placeholderEn: 'Summarize today, reflect on improvements...',
    color: '#a868d0',
  },
];

const KNOWLEDGE_SECTIONS = [
  {
    titleZh: '三省之源',
    titleEn: 'Origin of Three Reflections',
    contentZh: '《论语·学而》载：曾子曰："吾日三省吾身——为人谋而不忠乎？与朋友交而不信乎？传不习乎？"曾子每日三次反省自身：替人谋事是否尽心竭力？与朋友交往是否诚实守信？老师传授的学业是否温习实践？此即"三省"之由来，后世儒家修身皆以此为圭臬。',
    contentEn: 'The Analerta records: Zengzi said, "I examine myself three times daily: Have I been loyal in working for others? Have I been trustworthy with friends? Have I practiced what was taught?" This is the origin of "three daily reflections," a cornerstone of Confucian self-cultivation.',
  },
  {
    titleZh: '三省之义',
    titleEn: 'Meaning of Three Reflections',
    contentZh: '三省非拘于三次，乃多次反省之意。早省规划，午省调整，晚省总结，贯穿一日始终。忠者，尽心竭力也；信者，诚实不欺也；习者，温故知新也。三者涵盖了为人、处世、求学三个维度，缺一不可。',
    contentEn: 'Three reflections means multiple reflections, not strictly three. Morning to plan, noon to adjust, evening to summarize. Loyalty, trustworthiness, and practice cover three dimensions: serving others, social relations, and learning.',
  },
  {
    titleZh: '修身之法',
    titleEn: 'Method of Self-Cultivation',
    contentZh: '反省贵在诚实，不可自欺。每日记录所行之事，分析得失原因，制定改进措施。积小善成大德，改小过避大错。王阳明云："破山中贼易，破心中贼难。"三省即是破心中贼之利器，持之以恒，必有所成。',
    contentEn: 'Reflection requires honesty. Record daily actions, analyze gains and losses, plan improvements. Wang Yangming said: "Breaking mountain thieves is easy, breaking mind thieves is hard." Three reflections is the weapon to break mind thieves.',
  },
];

function ReflectionLantern({ color, size = 60 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none">
      <motion.g
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ellipse cx="30" cy="20" rx="14" ry="4" fill={color} opacity="0.2" />
        <path d="M22 22 Q22 14 30 14 Q38 14 38 22 L38 38 Q38 46 30 46 Q22 46 22 38 Z" fill={color} opacity="0.15" stroke={color} strokeWidth="1" />
        <line x1="30" y1="8" x2="30" y2="14" stroke={color} strokeWidth="1" />
        <circle cx="30" cy="8" r="2" fill={color} opacity="0.4" />
        <line x1="26" y1="22" x2="34" y2="22" stroke={color} strokeWidth="0.5" opacity="0.5" />
        <line x1="26" y1="30" x2="34" y2="30" stroke={color} strokeWidth="0.5" opacity="0.5" />
        <line x1="26" y1="38" x2="34" y2="38" stroke={color} strokeWidth="0.5" opacity="0.5" />
        <motion.circle
          cx="30"
          cy="30"
          r="4"
          fill={color}
          opacity="0.6"
          animate={{ opacity: [0.4, 0.8, 0.4], r: [3, 5, 3] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.g>
    </svg>
  );
}

export default function ReflectionPage() {
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
    morningBg: isDark ? 'rgba(255,180,80,0.08)' : 'rgba(255,180,80,0.12)',
    noonBg: isDark ? 'rgba(80,120,200,0.08)' : 'rgba(80,120,200,0.12)',
    eveningBg: isDark ? 'rgba(168,104,208,0.08)' : 'rgba(168,104,208,0.12)',
  };

  const [activeSession, setActiveSession] = useState<'morning' | 'noon' | 'evening'>('morning');
  const [reflections, setReflections] = useState<Record<string, string>>({ morning: '', noon: '', evening: '' });
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
      const res = await fetch('/api/wellness?action=streak&practice_type=reflection');
      const data = await res.json();
      if (data.streak) {
        setStreak(data.streak.current_streak);
        setTodayChecked(data.streak.today_checked);
      }
    } catch { /* not logged in */ }
  };

  const loadHistory = async () => {
    try {
      const res = await fetch('/api/wellness?practice_type=reflection');
      const data = await res.json();
      if (data.records) setRecords(data.records);
    } catch { /* not logged in */ }
  };

  const handleCheckIn = async () => {
    const session = REFLECTION_SESSIONS.find(s => s.key === activeSession)!;
    const content = reflections[activeSession];
    if (!content.trim()) return;

    try {
      const res = await fetch('/api/wellness', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          practice_type: 'reflection',
          sub_type: lang === 'zh' ? session.zh : session.en,
          note: content.slice(0, 200),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStreak(data.streak.current_streak);
        setTodayChecked(data.streak.today_checked);
        setCreditsAwarded(data.credits_awarded || 0);
        setShowSuccess(true);
        setTimeout(() => { setShowSuccess(false); }, 4000);
        loadHistory();
      }
    } catch { /* not logged in */ }
  };

  const canCheckIn = reflections[activeSession]?.trim() && !!user;
  const currentSession = REFLECTION_SESSIONS.find(s => s.key === activeSession)!;

  return (
    <div style={{ minHeight: '100vh', background: c.bg, color: c.text, position: 'relative', overflow: 'hidden' }}>
      {/* 庄严装饰背景 */}
      <div className="absolute pointer-events-none" style={{ top: '8%', left: '5%', zIndex: 0 }}>
        <TempleBell size={60} color={c.goldSolid} opacity={0.06} />
    </div>
      <div className="absolute pointer-events-none" style={{ top: '10%', right: '5%', zIndex: 0 }}>
        <TempleBell size={50} color={c.goldSolid} opacity={0.05} />
    </div>
      <div className="absolute pointer-events-none" style={{ top: '15%', left: '8%', zIndex: 0 }}>
        <SeedSyllable size={45} color={c.goldSolid} opacity={0.08} syllable="省" />
    </div>
      <div className="absolute pointer-events-none" style={{ top: '20%', right: '8%', zIndex: 0 }}>
        <AuspiciousCloud size={120} color={c.goldSolid} opacity={0.05} />
    </div>
      <div className="absolute pointer-events-none" style={{ bottom: '10%', left: '50%', transform: 'translateX(-50%)', zIndex: 0 }}>
        <SacredFlame size={30} color={c.goldSolid} opacity={0.08} />
    </div>
      <NavigationBar />
      <div className="max-w-2xl mx-auto px-4 pt-20 pb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2" style={{ color: c.goldSolid }}>
            {lang === 'zh' ? '每日三省' : 'Daily Reflection'}
          </h1>
          <p className="text-sm" style={{ color: c.textMuted }}>
            {lang === 'zh' ? '吾日三省吾身，为人谋而不忠乎' : 'I examine myself three times daily'}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex justify-center mb-6"
        >
          <div className="flex items-center gap-4 px-6 py-4 rounded-2xl" style={{ background: c.cardBg, border: `1px solid ${c.border}`, boxShadow: `0 4px 24px rgba(0,0,0,0.15), inset 0 0 40px ${c.goldSolid}08` }}>
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color: c.goldSolid }}>{streak}</div>
              <div className="text-xs mt-1" style={{ color: c.textMuted }}>
                {lang === 'zh' ? '连续天数' : 'Day Streak'}
    </div>
    </div>
            <div className="w-px h-12" style={{ background: c.border }} />
            <div className="flex gap-3">
              {REFLECTION_SESSIONS.map(s => (
                <div key={s.key} className="text-center">
                  <motion.div
                    animate={activeSession === s.key ? { scale: [1, 1.15, 1] } : {}}
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{
                      background: activeSession === s.key ? s.color : c.cardBg,
                      border: `1px solid ${activeSession === s.key ? s.color : c.border}`,
                    }}
                  >
                    <span style={{ fontSize: 18 }}>{s.icon}</span>
                  </motion.div>
                  <div className="text-xs mt-1" style={{ color: c.textMuted }}>
                    {lang === 'zh' ? s.zh : s.en.split(' ')[0]}
    </div>
    </div>
              ))}
    </div>
    </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-4 text-xs" style={{ color: c.textFaint }}>
          {lang === 'zh' ? '每日打卡 +2积分' : 'Daily check-in +2 credits'}
        </motion.div>

        <AnimatePresence mode="wait">
          {showSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex flex-col items-center py-12"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="relative"
              >
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{ background: `radial-gradient(circle, ${c.goldSolid}40, transparent 70%)`, filter: 'blur(20px)' }}
                  animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.8, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.div
                  className="w-24 h-24 rounded-full flex items-center justify-center relative"
                  style={{ border: `3px solid ${c.goldSolid}`, boxShadow: `0 0 30px ${c.goldSolid}60` }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                >
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                    <path d="M8 20L16 28L32 12" stroke={c.goldSolid} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </motion.div>
              </motion.div>

              <motion.p className="mt-8 text-lg font-medium" style={{ color: c.goldSolid }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                {lang === 'zh' ? '三省打卡成功！' : 'Reflection Complete!'}
              </motion.p>
              {creditsAwarded > 0 && (
                <motion.p className="mt-2 text-sm font-medium" style={{ color: c.goldSolid }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
                  {lang === 'zh' ? `获得 ${creditsAwarded} 积分` : `+${creditsAwarded} credits`}
                </motion.p>
              )}
              <motion.p className="mt-2 text-sm" style={{ color: c.textMuted }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
                {lang === 'zh' ? `已连续打卡 ${streak} 天` : `${streak} day streak`}
              </motion.p>
              <motion.p className="mt-1 text-xs" style={{ color: c.textFaint }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
                {lang === 'zh' ? '日日反省，日日精进' : 'Reflect daily, improve daily'}
              </motion.p>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              <div className="flex gap-2 justify-center">
                {REFLECTION_SESSIONS.map(s => (
                  <motion.button
                    key={s.key}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setActiveSession(s.key as 'morning' | 'noon' | 'evening')}
                    className="px-5 py-2.5 rounded-xl text-sm font-medium transition-all"
                    style={{
                      background: activeSession === s.key ? s.color : activeSession === 'morning' ? c.morningBg : activeSession === 'noon' ? c.noonBg : c.eveningBg,
                      color: activeSession === s.key ? '#1a1a2e' : c.text,
                      border: `1px solid ${activeSession === s.key ? s.color : c.border}`,
                    }}
                  >
                    {s.icon} {lang === 'zh' ? s.zh : s.en.split(' ')[0]}
                  </motion.button>
                ))}
    </div>

              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="text-center py-2 px-4 rounded-xl"
                style={{ background: `${currentSession.color}15`, border: `1px solid ${currentSession.color}40` }}
              >
                <p className="text-sm" style={{ color: currentSession.color }}>
                  {lang === 'zh'
                    ? `${currentSession.zh}建议时间 ${currentSession.timeRange}，随时皆可打卡`
                    : `${currentSession.en} suggested time ${currentSession.timeRange}, check-in anytime`}
                </p>
              </motion.div>


              <motion.div
                key={activeSession}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="rounded-xl p-4"
                style={{ background: c.cardBg, border: `1px solid ${c.border}` }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <ReflectionLantern color={currentSession.color} size={50} />
                  <div>
                    <div className="font-medium text-sm" style={{ color: currentSession.color }}>
                      {lang === 'zh' ? currentSession.zh : currentSession.en}
    </div>
                    <div className="text-xs mt-1" style={{ color: c.textMuted }}>
                      {lang === 'zh' ? currentSession.promptZh : currentSession.promptEn}
    </div>
    </div>
    </div>

                <textarea
                  value={reflections[activeSession]}
                  onChange={e => setReflections(prev => ({ ...prev, [activeSession]: e.target.value }))}
                  rows={5}
                  placeholder={lang === 'zh' ? currentSession.placeholderZh : currentSession.placeholderEn}
                  className="w-full px-4 py-3 rounded-xl text-sm resize-none"
                  style={{ background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.03)', border: `1px solid ${c.border}`, color: c.text }}

                />

                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs" style={{ color: c.textFaint }}>
                    {reflections[activeSession]?.length || 0}/200
                  </span>
                  {reflections[activeSession]?.trim() && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-xs"
                      style={{ color: currentSession.color }}
                    >
                      {lang === 'zh' ? '内容已就绪，可以打卡' : 'Ready to check in'}
                    </motion.span>
                  )}
    </div>
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                onClick={() => setShowKnowledge(!showKnowledge)}
                className="w-full py-2.5 rounded-xl text-sm flex items-center justify-center gap-2"
                style={{ background: `${c.goldSolid}15`, border: `1px solid ${c.goldSolid}30`, color: c.goldSolid }}
              >
                {lang === 'zh' ? '三省知识' : 'Reflection Knowledge'} {showKnowledge ? '▾' : '▸'}
              </motion.button>

              <AnimatePresence>
                {showKnowledge && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-3">
                    {KNOWLEDGE_SECTIONS.map((section, i) => (
                      <div key={i} className="p-4 rounded-xl" style={{ background: c.cardBg, border: `1px solid ${c.border}` }}>
                        <h4 className="text-sm font-medium mb-2" style={{ color: c.goldSolid }}>
                          {lang === 'zh' ? section.titleZh : section.titleEn}
                        </h4>
                        <p className="text-xs leading-relaxed" style={{ color: c.textMuted }}>
                          {lang === 'zh' ? section.contentZh : section.contentEn}
                        </p>
    </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex justify-center gap-3">
                <motion.button
                  whileHover={{ scale: canCheckIn ? 1.03 : 1 }}
                  whileTap={{ scale: canCheckIn ? 0.97 : 1 }}
                  onClick={handleCheckIn}
                  disabled={!canCheckIn}
                  className="px-10 py-3 rounded-xl font-medium"
                  style={{
                    background: canCheckIn ? c.goldSolid : c.border,
                    color: '#1a1a2e',
                    cursor: canCheckIn ? 'pointer' : 'not-allowed',
                  }}
                >
                  {lang === 'zh' ? '打卡三省' : 'Check In'}
                </motion.button>
                {user && (
                  <button
                    onClick={() => setShowHistory(!showHistory)}
                    className="px-4 py-3 rounded-xl text-sm"
                    style={{ background: c.cardBg, border: `1px solid ${c.border}`, color: c.textMuted }}
                  >
                    {lang === 'zh' ? '打卡记录' : 'History'}
                  </button>
                )}
    </div>

              {!user && (
                <p className="text-center text-xs" style={{ color: c.textFaint }}>
                  {lang === 'zh' ? '登录后可记录打卡数据' : 'Sign in to track your progress'}
                </p>
              )}

              {showHistory && records.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-2"
                >
                  <h3 className="text-sm font-medium" style={{ color: c.goldSolid }}>
                    {lang === 'zh' ? '近期三省记录' : 'Recent Reflections'}
                  </h3>
                  {records.slice(0, 10).map((r, i) => (
                    <div key={i} className="p-3 rounded-lg text-sm" style={{ background: c.cardBg, border: `1px solid ${c.border}` }}>
                      <div className="flex items-center justify-between mb-1">
                        <span style={{ color: c.goldSolid }}>{r.sub_type}</span>
                        <span className="text-xs" style={{ color: c.textFaint }}>{r.created_at}</span>
    </div>
                      <p style={{ color: c.text }}>{r.note}</p>
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