'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '@/lib/i18n/LanguageContext';
import { useTheme } from '@/components/ThemeProvider';
import { useAuth } from '@/lib/auth/AuthContext';
import NavigationBar from '@/components/NavigationBar';
import SiteFooter from '@/components/SiteFooter';
import { BuddhaHalo, SeedSyllable, IncenseSmoke, AuspiciousCloud, TempleBell } from '@/components/SacredDecorations';
import {
  getSutrasBySession,
  getSutraByKey,

  getSessionTimeRange,
} from '@/lib/recitation/sutras';

export default function RecitationPage() {
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
    eveningBg: isDark ? 'rgba(80,120,200,0.08)' : 'rgba(80,120,200,0.12)',
  };

  const [activeTab, setActiveTab] = useState<'morning' | 'evening'>('morning');
  const [selectedSutra, setSelectedSutra] = useState('');
  const [checkedIn, setCheckedIn] = useState<{ morning: boolean; evening: boolean }>({ morning: false, evening: false });
  const [streak, setStreak] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [records, setRecords] = useState<Array<{ sutra_name: string; session_type: string; created_at: string }>>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showKnowledge, setShowKnowledge] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playProgress, setPlayProgress] = useState(0);
  const [playCompleted, setPlayCompleted] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);

  const [creditsAwarded, setCreditsAwarded] = useState(0);
  const playbackRef = useRef<{ chunks: string[]; currentChunk: number } | null>(null);

  const sutras = getSutrasBySession(activeTab);
  const selectedSutraData = getSutraByKey(selectedSutra);

  useEffect(() => {

    if (typeof window !== 'undefined' && !('speechSynthesis' in window)) {
      setSpeechSupported(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      loadStreak();
      loadHistory();
    }
  }, [user]);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const loadStreak = async () => {
    try {
      const res = await fetch('/api/recitation?action=streak');
      const data = await res.json();
      if (data.streak) {
        setStreak(data.streak.current_streak);
        setCheckedIn(data.streak.today_checked);
      }
    } catch { /* not logged in */ }
  };

  const loadHistory = async () => {
    try {
      const res = await fetch('/api/recitation');
      const data = await res.json();
      if (data.records) setRecords(data.records);
    } catch { /* not logged in */ }
  };

  const splitText = (text: string): string[] => {
    const sentences = text.split(/[。，；：]/);
    const chunks: string[] = [];
    let current = '';
    for (const s of sentences) {
      if ((current + s).length > 80) {
        if (current) chunks.push(current);
        current = s;
      } else {
        current += s;
      }
    }
    if (current) chunks.push(current);
    return chunks;
  };

  const startPlayback = useCallback(() => {
    if (!selectedSutraData || !speechSupported) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    setPlayCompleted(false);
    setPlayProgress(0);
    setIsPlaying(true);

    const chunks = splitText(selectedSutraData.text);
    playbackRef.current = { chunks, currentChunk: 0 };

    const speakChunk = (index: number) => {
      if (index >= chunks.length) {
        setIsPlaying(false);
        setPlayCompleted(true);
        setPlayProgress(100);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(chunks[index]);
      utterance.lang = 'zh-CN';
      utterance.rate = 0.8;
      utterance.pitch = 1;

      utterance.onend = () => {
        if (playbackRef.current && playbackRef.current.currentChunk === index) {
          playbackRef.current.currentChunk = index + 1;
          setPlayProgress(Math.round(((index + 1) / chunks.length) * 100));
          speakChunk(index + 1);
        }
      };

      utterance.onerror = () => {
        setIsPlaying(false);
      };

      window.speechSynthesis.speak(utterance);
    };

    speakChunk(0);
  }, [selectedSutraData, speechSupported]);

  const stopPlayback = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setPlayProgress(0);
    setPlayCompleted(false);
    playbackRef.current = null;
  }, []);

  const handleCheckIn = async () => {
    if (!selectedSutra || !playCompleted) return;

    try {
      const res = await fetch('/api/recitation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_type: activeTab,
          sutra_key: selectedSutraData!.key,
          sutra_name: lang === 'zh' ? selectedSutraData!.zh : selectedSutraData!.en,
          duration_minutes: selectedSutraData!.durationMin,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStreak(data.streak.current_streak);
        setCheckedIn(data.streak.today_checked);
        setCreditsAwarded(data.credits_awarded || 0);
        setShowSuccess(true);
        stopPlayback();
        setTimeout(() => {
          setShowSuccess(false);
          setSelectedSutra('');
          setPlayCompleted(false);
          setPlayProgress(0);
        }, 4000);
        loadHistory();
      }
    } catch { /* not logged in */ }
  };

  const canCheckIn = selectedSutra && playCompleted && !!user;

  return (
    <div style={{ minHeight: '100vh', background: c.bg, color: c.text, position: 'relative', overflow: 'hidden' }}>
      {/* 庄严装饰背景 */}
      <div className="absolute pointer-events-none" style={{ top: '5%', left: '50%', transform: 'translateX(-50%)', zIndex: 0 }}>
        <BuddhaHalo size={300} color={c.goldSolid} opacity={0.05} />
    </div>
      <div className="absolute pointer-events-none" style={{ top: '8%', left: '5%', zIndex: 0 }}>
        <AuspiciousCloud size={140} color={c.goldSolid} opacity={0.06} />
    </div>
      <div className="absolute pointer-events-none" style={{ top: '12%', right: '5%', zIndex: 0 }}>
        <AuspiciousCloud size={120} color={c.goldSolid} opacity={0.05} />
    </div>
      <div className="absolute pointer-events-none" style={{ top: '15%', right: '8%', zIndex: 0 }}>
        <SeedSyllable size={50} color={c.goldSolid} opacity={0.08} syllable="唵" />
    </div>
      <div className="absolute pointer-events-none" style={{ bottom: '10%', left: '8%', zIndex: 0 }}>
        <IncenseSmoke size={50} color={c.goldSolid} opacity={0.06} />
    </div>
      <div className="absolute pointer-events-none" style={{ bottom: '15%', right: '8%', zIndex: 0 }}>
        <TempleBell size={60} color={c.goldSolid} opacity={0.05} />
    </div>
      <NavigationBar />
      <div className="max-w-3xl mx-auto px-4 pt-20 pb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2" style={{ color: c.goldSolid }}>
            {lang === 'zh' ? '每日诵经修行' : 'Daily Recitation'}
          </h1>
          <p className="text-sm" style={{ color: c.textMuted }}>
            {lang === 'zh' ? '晨钟暮鼓，精进修行，持之以恒' : 'Morning bell, evening drum, practice with perseverance'}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex justify-center mb-6"
        >
          <div
            className="flex items-center gap-4 px-6 py-4 rounded-2xl"
            style={{ background: c.cardBg, border: `1px solid ${c.border}` }}
          >
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color: c.goldSolid }}>{streak}</div>
              <div className="text-xs mt-1" style={{ color: c.textMuted }}>
                {lang === 'zh' ? '连续天数' : 'Day Streak'}
    </div>
    </div>
            <div className="w-px h-12" style={{ background: c.border }} />
            <div className="flex gap-3">
              <div className="text-center">
                <motion.div
                  animate={checkedIn.morning ? { scale: [1, 1.2, 1] } : {}}
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{
                    background: checkedIn.morning ? c.goldSolid : c.cardBg,
                    border: `1px solid ${checkedIn.morning ? c.goldSolid : c.border}`,
                  }}
                >
                  {checkedIn.morning ? (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8L6.5 11.5L13 4.5" stroke="#1a1a2e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <span style={{ fontSize: 18 }}>☀</span>
                  )}
                </motion.div>
                <div className="text-xs mt-1" style={{ color: c.textMuted }}>
                  {lang === 'zh' ? '早课' : 'Morning'}
    </div>
    </div>
              <div className="text-center">
                <motion.div
                  animate={checkedIn.evening ? { scale: [1, 1.2, 1] } : {}}
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{
                    background: checkedIn.evening ? c.goldSolid : c.cardBg,
                    border: `1px solid ${checkedIn.evening ? c.goldSolid : c.border}`,
                  }}
                >
                  {checkedIn.evening ? (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8L6.5 11.5L13 4.5" stroke="#1a1a2e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <span style={{ fontSize: 18 }}>☾</span>
                  )}
                </motion.div>
                <div className="text-xs mt-1" style={{ color: c.textMuted }}>
                  {lang === 'zh' ? '晚课' : 'Evening'}
    </div>
    </div>
    </div>
    </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mb-4 text-xs"
          style={{ color: c.textFaint }}
        >
          {lang === 'zh'
            ? '每日修行 +2积分'
            : 'Daily check-in +2 credits'}
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

              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full"
                  style={{ width: 6, height: 6, background: c.goldSolid, top: '50%', left: '50%' }}
                  initial={{ x: 0, y: 0, opacity: 1 }}
                  animate={{
                    x: Math.cos((i * 60 * Math.PI) / 180) * 80,
                    y: Math.sin((i * 60 * Math.PI) / 180) * 80,
                    opacity: 0,
                    scale: 0,
                  }}
                  transition={{ duration: 1.5, delay: 0.2 }}
                />
              ))}

              <motion.p
                className="mt-8 text-lg font-medium"
                style={{ color: c.goldSolid }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {lang === 'zh' ? '修行完成！' : 'Check-in Successful!'}
              </motion.p>
              {creditsAwarded > 0 && (
                <motion.p
                  className="mt-2 text-sm font-medium"
                  style={{ color: c.goldSolid }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  {lang === 'zh' ? `获得 ${creditsAwarded} 积分` : `+${creditsAwarded} credits`}
                </motion.p>
              )}
              <motion.p
                className="mt-2 text-sm"
                style={{ color: c.textMuted }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                {lang === 'zh' ? `已连续修行 ${streak} 天` : `${streak} day streak`}
              </motion.p>
              <motion.p
                className="mt-1 text-xs"
                style={{ color: c.textFaint }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
              >
                {lang === 'zh' ? '愿此功德，回向一切众生' : 'May this merit be dedicated to all beings'}
              </motion.p>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              <div className="flex gap-2 justify-center">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => { setActiveTab('morning'); setSelectedSutra(''); stopPlayback(); }}
                  className="px-6 py-2.5 rounded-xl text-sm font-medium transition-all"
                  style={{
                    background: activeTab === 'morning' ? c.goldSolid : c.morningBg,
                    color: activeTab === 'morning' ? '#1a1a2e' : c.text,
                    border: `1px solid ${activeTab === 'morning' ? c.goldSolid : c.border}`,
                  }}
                >
                  {lang === 'zh' ? '☀ 早课' : '☀ Morning'}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => { setActiveTab('evening'); setSelectedSutra(''); stopPlayback(); }}
                  className="px-6 py-2.5 rounded-xl text-sm font-medium transition-all"
                  style={{
                    background: activeTab === 'evening' ? c.goldSolid : c.eveningBg,
                    color: activeTab === 'evening' ? '#1a1a2e' : c.text,
                    border: `1px solid ${activeTab === 'evening' ? c.goldSolid : c.border}`,
                  }}
                >
                  {lang === 'zh' ? '☾ 晚课' : '☾ Evening'}
                </motion.button>
    </div>

              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="text-center py-2 px-4 rounded-xl"
                style={{
                  background: `${c.goldSolid}15`,
                  border: `1px solid ${c.goldSolid}40`,
                }}
              >
                <p className="text-sm" style={{ color: c.goldSolid }}>
                  {lang === 'zh'
                    ? `${activeTab === 'morning' ? '早课' : '晚课'}建议时间 ${getSessionTimeRange(activeTab)}，随时皆可修行`
                    : `${activeTab === 'morning' ? 'Morning' : 'Evening'} suggested time ${getSessionTimeRange(activeTab)}, check-in anytime`}
                </p>
              </motion.div>


              <div>
                <label className="text-sm mb-3 block" style={{ color: c.textMuted }}>
                  {lang === 'zh' ? '选择诵经内容' : 'Select Sutra'}
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {sutras.map(sutra => (
                    <motion.button
                      key={sutra.key}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => { setSelectedSutra(sutra.key); stopPlayback(); }}
                      className="p-4 rounded-xl text-left transition-all"
                      style={{
                        background: selectedSutra === sutra.key ? c.goldSolid : c.cardBg,
                        color: selectedSutra === sutra.key ? '#1a1a2e' : c.text,
                        border: `1px solid ${selectedSutra === sutra.key ? c.goldSolid : c.border}`,
                      }}
                    >
                      <div className="font-medium text-sm">
                        {lang === 'zh' ? sutra.zh : sutra.en}
    </div>
                      <div className="text-xs mt-1 opacity-70">
                        {lang === 'zh' ? sutra.descZh : sutra.descEn}
    </div>
                      <div className="text-xs mt-2" style={{ opacity: 0.6 }}>
                        ~{sutra.durationMin} {lang === 'zh' ? '分钟' : 'min'}
    </div>
                    </motion.button>
                  ))}
    </div>
    </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                onClick={() => setShowKnowledge(!showKnowledge)}
                className="w-full py-2.5 rounded-xl text-sm flex items-center justify-center gap-2"
                style={{ background: `${c.goldSolid}15`, border: `1px solid ${c.goldSolid}30`, color: c.goldSolid }}
              >
                {lang === 'zh' ? '诵经知识' : 'Recitation Knowledge'} {showKnowledge ? '▾' : '▸'}
              </motion.button>

              <AnimatePresence>
                {showKnowledge && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-3">
                    <div className="p-4 rounded-xl" style={{ background: c.cardBg, border: `1px solid ${c.border}` }}>
                      <h4 className="text-sm font-medium mb-2" style={{ color: c.goldSolid }}>
                        {lang === 'zh' ? '诵经功德' : 'Benefits of Recitation'}
                      </h4>
                      <p className="text-xs leading-relaxed" style={{ color: c.textMuted }}>
                        {lang === 'zh'
                          ? '诵经是佛教修行之根本，功德不可思议。一者增长智慧，深入经藏；二者清净身心，消除业障；三者利益众生，回向功德；四者培养定力，专注一处；五者传承佛法，续佛慧命。日日诵经，智慧渐增，烦恼渐消。'
                          : 'Recitation is the foundation of Buddhist practice. It grows wisdom, purifies body and mind, benefits all beings through merit dedication, cultivates concentration, and preserves the Dharma lineage.'}
                      </p>
    </div>
                    <div className="p-4 rounded-xl" style={{ background: c.cardBg, border: `1px solid ${c.border}` }}>
                      <h4 className="text-sm font-medium mb-2" style={{ color: c.goldSolid }}>
                        {lang === 'zh' ? '诵经方法' : 'Method of Recitation'}
                      </h4>
                      <p className="text-xs leading-relaxed" style={{ color: c.textMuted }}>
                        {lang === 'zh'
                          ? '诵经贵在至诚，不在数量。先净手净口，端正身心；次以清净心朗读经文，字字分明；诵毕回向功德，愿一切众生离苦得乐。初学者宜从短经入手，循序渐进，切勿贪多求快。持之以恒，必有感应。'
                          : 'Recitation values sincerity over quantity. Purify body and speech first, then read clearly with a pure mind. Dedicate merit afterward. Beginners should start with shorter sutras and progress gradually.'}
                      </p>
    </div>
                    <div className="p-4 rounded-xl" style={{ background: c.cardBg, border: `1px solid ${c.border}` }}>
                      <h4 className="text-sm font-medium mb-2" style={{ color: c.goldSolid }}>
                        {lang === 'zh' ? '早课与晚课' : 'Morning and Evening Practice'}
                      </h4>
                      <p className="text-xs leading-relaxed" style={{ color: c.textMuted }}>
                        {lang === 'zh'
                          ? '早课宜在清晨进行，以清醒之心开启一日修行，诵《心经》《大悲咒》等，祈愿一日平安吉祥。晚课宜在傍晚或夜间，以反省之心回顾一日言行，诵《阿弥陀经》或《八十八佛忏悔文》，回向功德消除业障。早晚各诵，日日不断，是为精进。'
                          : 'Morning practice is best at dawn to start the day with clarity. Evening practice is for reflection and merit dedication. Both should be maintained daily for diligent cultivation.'}
                      </p>
    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {selectedSutraData && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="rounded-xl p-4"
                  style={{ background: c.cardBg, border: `1px solid ${c.border}` }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="font-medium text-sm" style={{ color: c.goldSolid }}>
                        {lang === 'zh' ? selectedSutraData.zh : selectedSutraData.en}
    </div>
                      <div className="text-xs mt-1" style={{ color: c.textMuted }}>
                        {lang === 'zh' ? '点击播放，跟随语音诵经' : 'Click play to recite along'}
    </div>
    </div>
                    {!speechSupported && (
                      <div className="text-xs px-2 py-1 rounded" style={{ background: 'rgba(220,53,53,0.1)', color: '#dc3535' }}>
                        {lang === 'zh' ? '浏览器不支持语音' : 'Speech not supported'}
    </div>
                    )}
    </div>

                  <div className="flex items-center gap-3">
                    {!isPlaying ? (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={startPlayback}
                        disabled={!speechSupported || playCompleted}
                        className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{
                          background: playCompleted ? `${c.goldSolid}30` : c.goldSolid,
                          color: '#1a1a2e',
                          opacity: !speechSupported || playCompleted ? 0.5 : 1,
                        }}
                      >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path d="M5 3L16 10L5 17V3Z" fill="currentColor" />
                        </svg>
                      </motion.button>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={stopPlayback}
                        className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{ background: '#dc3535', color: '#fff' }}
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <rect x="3" y="3" width="10" height="10" rx="1" fill="currentColor" />
                        </svg>
                      </motion.button>
                    )}

                    <div className="flex-1">
                      <div className="h-2 rounded-full overflow-hidden" style={{ background: c.border }}>
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: playCompleted ? c.goldSolid : isPlaying ? c.goldSolid : c.border }}
                          animate={{ width: `${playProgress}%` }}
                          transition={{ duration: 0.3 }}
                        />
    </div>
                      <div className="flex justify-between mt-1 text-xs" style={{ color: c.textFaint }}>
                        <span>
                          {playCompleted
                            ? (lang === 'zh' ? '诵经完成 ✓' : 'Completed ✓')
                            : isPlaying
                              ? (lang === 'zh' ? '正在诵经...' : 'Reciting...')
                              : (lang === 'zh' ? '等待播放' : 'Ready')}
                        </span>
                        <span>{playProgress}%</span>
    </div>
    </div>
    </div>

                  <div
                    className="mt-4 p-3 rounded-lg max-h-32 overflow-y-auto text-sm leading-relaxed"
                    style={{ background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.03)', color: c.text }}
                  >
                    {selectedSutraData.text}
    </div>

                  {playCompleted && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-3 text-center text-sm"
                      style={{ color: c.goldSolid }}
                    >
                      {lang === 'zh' ? '诵经已完成，可以修行了' : 'Recitation completed, ready to check in'}
                    </motion.div>
                  )}
                </motion.div>
              )}

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
                  {lang === 'zh' ? '开始修行' : 'Check In'}
                </motion.button>
                {user && (
                  <button
                    onClick={() => setShowHistory(!showHistory)}
                    className="px-4 py-3 rounded-xl text-sm"
                    style={{ background: c.cardBg, border: `1px solid ${c.border}`, color: c.textMuted }}
                  >
                    {lang === 'zh' ? '修行记录' : 'History'}
                  </button>
                )}
    </div>

              {!canCheckIn && selectedSutra && (
                <p className="text-center text-xs" style={{ color: c.textFaint }}>
                  {!playCompleted
                    ? (lang === 'zh' ? '请先完成诵经播放' : 'Please complete recitation first')
                    : ''}

                </p>
              )}

              {!user && (
                <p className="text-center text-xs" style={{ color: c.textFaint }}>
                  {lang === 'zh' ? '登录后可记录修行数据' : 'Sign in to track your progress'}
                </p>
              )}

              {showHistory && records.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-2"
                >
                  <h3 className="text-sm font-medium" style={{ color: c.goldSolid }}>
                    {lang === 'zh' ? '近期修行' : 'Recent Check-ins'}
                  </h3>
                  {records.slice(0, 10).map((r, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 rounded-lg text-sm"
            style={{ background: c.cardBg, border: `1px solid ${c.border}`, boxShadow: `0 4px 24px rgba(0,0,0,0.15), inset 0 0 40px ${c.goldSolid}08` }}
                    >
                      <div className="flex items-center gap-2">
                        <span style={{ color: r.session_type === 'morning' ? '#e8a030' : '#5078c8' }}>
                          {r.session_type === 'morning' ? '☀' : '☾'}
                        </span>
                        <span style={{ color: c.text }}>{r.sutra_name}</span>
    </div>
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