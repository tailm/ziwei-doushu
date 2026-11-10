'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '@/lib/i18n/LanguageContext';
import { useTheme } from '@/components/ThemeProvider';
import { useAuth } from '@/lib/auth/AuthContext';
import NavigationBar from '@/components/NavigationBar';
import SiteFooter from '@/components/SiteFooter';
import { AuspiciousCloud, RippleWave } from '@/components/SacredDecorations';
import { SpinningTaiji, BaguaDiagram } from '@/components/Decorations';

const TAICHI_FORMS = [
  { key: 'yang', zh: '杨式太极', en: 'Yang Style', descZh: '舒展大方，柔和缓慢', descEn: 'Open, gentle, slow movements' },
  { key: 'chen', zh: '陈式太极', en: 'Chen Style', descZh: '刚柔相济，快慢相间', descEn: 'Hard and soft, fast and slow' },
  { key: 'simplified', zh: '简化太极', en: 'Simplified', descZh: '24式简化太极拳', descEn: '24-form simplified Tai Chi' },
  { key: 'qigong', zh: '太极气功', en: 'Tai Chi Qigong', descZh: '以气导动，内外兼修', descEn: 'Qi-led movement, internal cultivation' },
  { key: 'sword', zh: '太极剑', en: 'Tai Chi Sword', descZh: '剑法与身法合一，刚柔并济', descEn: 'Sword and body as one, hard and soft' },
];

function TaijiFormIcon({ type, color, size = 22 }: { type: string; color: string; size?: number }) {
  switch (type) {
    case 'yang':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5" />
          <path d="M12 2 A10 10 0 0 1 12 22 A5 5 0 0 1 12 12 A5 5 0 0 0 12 2 Z" fill={color} opacity="0.6" />
          <circle cx="12" cy="7" r="1.5" fill={color} opacity="0.3" />
          <circle cx="12" cy="17" r="1.5" fill={color} opacity="0.8" />
        </svg>
      );
    case 'chen':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5" />
          <path d="M12 2 A10 10 0 0 1 12 22 A5 5 0 0 1 12 12 A5 5 0 0 0 12 2 Z" fill={color} opacity="0.6" />
          <path d="M4 12 L7 9 L4 6" stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
          <path d="M20 12 L17 15 L20 18" stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
          <circle cx="12" cy="7" r="1.5" fill={color} opacity="0.3" />
          <circle cx="12" cy="17" r="1.5" fill={color} opacity="0.8" />
        </svg>
      );
    case 'simplified':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5" />
          <path d="M12 2 A10 10 0 0 1 12 22 A5 5 0 0 1 12 12 A5 5 0 0 0 12 2 Z" fill={color} opacity="0.5" />
          <text x="12" y="15" textAnchor="middle" fontSize="7" fill={color} fontWeight="bold">24</text>
        </svg>
      );
    case 'qigong':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5" opacity="0.4" />
          <circle cx="12" cy="12" r="6" stroke={color} strokeWidth="1.2" opacity="0.6" />
          <circle cx="12" cy="12" r="2.5" fill={color} opacity="0.8" />
          <path d="M12 4 L12 2 M12 22 L12 20 M4 12 L2 12 M22 12 L20 12" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.5" />
        </svg>
      );
    case 'sword':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path d="M12 2 L12 16" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M8 16 L16 16" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M12 16 L10 20 M12 16 L14 20" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
          <circle cx="12" cy="3" r="1.5" fill={color} opacity="0.6" />
          <path d="M6 8 Q4 10 6 12" stroke={color} strokeWidth="0.8" opacity="0.4" fill="none" />
          <path d="M18 8 Q20 10 18 12" stroke={color} strokeWidth="0.8" opacity="0.4" fill="none" />
        </svg>
      );
    default:
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5" />
          <path d="M12 2 A10 10 0 0 1 12 22 A5 5 0 0 1 12 12 A5 5 0 0 0 12 2 Z" fill={color} opacity="0.5" />
        </svg>
      );
  }
}

function BookScrollIcon({ color, size = 16 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M4 4 H10 V20 H4 Z" stroke={color} strokeWidth="1.2" opacity="0.6" />
      <path d="M14 4 H20 V20 H14 Z" stroke={color} strokeWidth="1.2" opacity="0.6" />
      <path d="M10 4 H14" stroke={color} strokeWidth="1.2" />
      <path d="M6 8 H8 M6 11 H8 M6 14 H8" stroke={color} strokeWidth="0.8" opacity="0.4" />
      <path d="M16 8 H18 M16 11 H18 M16 14 H18" stroke={color} strokeWidth="0.8" opacity="0.4" />
    </svg>
  );
}

function PlayCircleIcon({ color, size = 16 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.2" opacity="0.5" />
      <path d="M10 8 L16 12 L10 16 Z" fill={color} opacity="0.7" />
    </svg>
  );
}

const TAICHI_RESOURCES: Record<string, {
  books: Array<{ title: string; author: string; desc: string; url: string }>;
  videos: Array<{ title: string; platform: string; desc: string; url: string }>
}> = {
  yang: {
    books: [
      { title: '《杨式太极拳法精解》', author: '杨振铎', desc: '杨式太极拳嫡传大师亲述，详解108式动作要领与内功心法', url: 'https://search.douban.com/book/subject_search?search_text=杨式太极拳法精解+杨振铎' },
      { title: '《杨式太极拳真传》', author: '庞大明', desc: '系统梳理杨式太极拳源流、套路、推手与散手', url: 'https://search.douban.com/book/subject_search?search_text=杨式太极拳真传+庞大明' },
      { title: '《太极拳术》', author: '顾留馨', desc: '经典太极拳理论著作，涵盖杨式太极拳技法与养生原理', url: 'https://search.douban.com/book/subject_search?search_text=太极拳术+顾留馨' },
    ],
    videos: [
      { title: '杨式太极拳103式教学', platform: 'YouTube', desc: '杨振铎大师完整103式套路演示与分解教学', url: 'https://www.youtube.com/results?search_query=杨式太极拳103式教学' },
      { title: '杨式太极拳入门28式', platform: 'YouTube', desc: '适合初学者的简化28式杨式太极拳教学视频', url: 'https://www.youtube.com/results?search_query=杨式太极拳入门28式' },
      { title: '杨式太极推手技法', platform: 'B站', desc: '推手基本手法、身法与劲路运用详解', url: 'https://search.bilibili.com/all?keyword=杨式太极推手技法' },
    ],
  },
  chen: {
    books: [
      { title: '《陈式太极拳图说》', author: '陈鑫', desc: '陈式太极拳经典原著，图文详解缠丝劲与套路要领', url: 'https://search.douban.com/book/subject_search?search_text=陈式太极拳图说+陈鑫' },
      { title: '《陈式太极拳入门》', author: '冯志强', desc: '陈式太极拳名家入门教程，从基本功到老架一路', url: 'https://search.douban.com/book/subject_search?search_text=陈式太极拳入门+冯志强' },
      { title: '《陈式太极拳术》', author: '陈正雷', desc: '陈式太极拳嫡传系统教材，涵盖老架、新架与推手', url: 'https://search.douban.com/book/subject_search?search_text=陈式太极拳术+陈正雷' },
    ],
    videos: [
      { title: '陈式太极拳老架一路教学', platform: 'YouTube', desc: '陈正雷大师老架一路74式完整教学', url: 'https://www.youtube.com/results?search_query=陈式太极拳老架一路教学' },
      { title: '陈式太极拳缠丝劲训练', platform: 'B站', desc: '缠丝劲基本功法与内劲修炼方法详解', url: 'https://search.bilibili.com/all?keyword=陈式太极拳缠丝劲训练' },
      { title: '陈式太极新架83式', platform: 'YouTube', desc: '陈小星新架套路演示与动作分解', url: 'https://www.youtube.com/results?search_query=陈式太极新架83式' },
    ],
  },
  simplified: {
    books: [
      { title: '《24式简化太极拳》', author: '国家体育总局', desc: '官方编订24式简化太极拳标准教材，最适合初学者', url: 'https://search.douban.com/book/subject_search?search_text=24式简化太极拳+国家体育总局' },
      { title: '《简化太极拳教与学》', author: '李德印', desc: '著名太极拳教育家详解24式每一式的动作规格与常见错误', url: 'https://search.douban.com/book/subject_search?search_text=简化太极拳教与学+李德印' },
      { title: '《太极拳入门与提高》', author: '邱丕相', desc: '从24式入门到42式提高的系统学习路径', url: 'https://search.douban.com/book/subject_search?search_text=太极拳入门与提高+邱丕相' },
    ],
    videos: [
      { title: '24式简化太极拳完整教学', platform: 'YouTube', desc: '李德印教授24式太极拳标准教学，动作分解清晰', url: 'https://www.youtube.com/results?search_query=24式简化太极拳完整教学+李德印' },
      { title: '24式太极拳背向演示', platform: 'B站', desc: '背向领做视频，方便跟随练习', url: 'https://search.bilibili.com/all?keyword=24式太极拳背向演示' },
      { title: '42式太极拳竞赛套路', platform: 'YouTube', desc: '国际竞赛标准套路，适合进阶学习', url: 'https://www.youtube.com/results?search_query=42式太极拳竞赛套路' },
    ],
  },
  qigong: {
    books: [
      { title: '《太极气功十八式》', author: '林厚省', desc: '太极气功经典功法，结合太极拳与气功的十八式套路', url: 'https://search.douban.com/book/subject_search?search_text=太极气功十八式+林厚省' },
      { title: '《太极内功》', author: '王培生', desc: '详解太极内功修炼方法，从站桩到行气', url: 'https://search.douban.com/book/subject_search?search_text=太极内功+王培生' },
      { title: '《气功与太极》', author: '马礼堂', desc: '养气功与太极拳结合修炼的系统方法', url: 'https://search.douban.com/book/subject_search?search_text=气功与太极+马礼堂' },
    ],
    videos: [
      { title: '太极气功十八式教学', platform: 'YouTube', desc: '林厚省太极气功十八式完整教学演示', url: 'https://www.youtube.com/results?search_query=太极气功十八式教学+林厚省' },
      { title: '太极站桩功法详解', platform: 'B站', desc: '站桩基本功法，混元桩、开合桩等内功修炼', url: 'https://search.bilibili.com/all?keyword=太极站桩功法详解' },
      { title: '太极导引养生功', platform: 'B站', desc: '以意导气、以气运身的导引养生功法教学', url: 'https://search.bilibili.com/all?keyword=太极导引养生功' },
    ],
  },
  sword: {
    books: [
      { title: '《太极剑术》', author: '李天骥', desc: '32式太极剑标准教材，太极剑入门必学', url: 'https://search.douban.com/book/subject_search?search_text=太极剑术+李天骥' },
      { title: '《杨式太极剑》', author: '杨振铎', desc: '杨式太极剑55式详解，剑法与身法合一', url: 'https://search.douban.com/book/subject_search?search_text=杨式太极剑+杨振铎' },
      { title: '《太极剑法精解》', author: '于志钧', desc: '系统讲解太极剑十三剑法与实战应用', url: 'https://search.douban.com/book/subject_search?search_text=太极剑法精解+于志钧' },
    ],
    videos: [
      { title: '32式太极剑教学', platform: 'YouTube', desc: '32式太极剑标准套路分解教学', url: 'https://www.youtube.com/results?search_query=32式太极剑教学' },
      { title: '杨式太极剑55式', platform: 'B站', desc: '杨振铎嫡传太极剑完整演示与讲解', url: 'https://search.bilibili.com/all?keyword=杨式太极剑55式' },
      { title: '太极剑基本功法', platform: 'B站', desc: '剑法基本技法：刺、劈、撩、扫、点等详解', url: 'https://search.bilibili.com/all?keyword=太极剑基本功法' },
    ],
  },
};

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
  const [showResources, setShowResources] = useState(false);

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
      <div className="absolute pointer-events-none" style={{ top: '5%', left: '50%', transform: 'translateX(-50%)', zIndex: 0 }}>
        <SpinningTaiji size={200} color={c.goldSolid} opacity={0.04} />
      </div>
      <div className="absolute pointer-events-none" style={{ top: '10%', left: '5%', zIndex: 0 }}>
        <BaguaDiagram size={120} color={c.goldSolid} opacity={0.05} />
      </div>
      <div className="absolute pointer-events-none" style={{ top: '15%', right: '5%', zIndex: 0 }}>
        <SpinningTaiji size={80} color={c.goldSolid} opacity={0.06} />
      </div>
      <div className="absolute pointer-events-none" style={{ bottom: '10%', left: '8%', zIndex: 0 }}>
        <BaguaDiagram size={100} color={c.goldSolid} opacity={0.05} />
      </div>
      <div className="absolute pointer-events-none" style={{ bottom: '15%', right: '8%', zIndex: 0 }}>
        <RippleWave size={100} color={c.goldSolid} opacity={0.06} />
      </div>
      <div className="absolute pointer-events-none" style={{ bottom: '5%', left: '50%', transform: 'translateX(-50%)', zIndex: 0 }}>
        <SpinningTaiji size={120} color={c.goldSolid} opacity={0.04} />
      </div>
      <NavigationBar />
      <div className="max-w-2xl mx-auto px-4 pt-20 pb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">

          <h1 className="text-2xl font-bold mb-2" style={{ color: c.tealAccent }}>{lang === 'zh' ? '太极修行' : 'Tai Chi Check-in'}</h1>
          <p className="text-sm" style={{ color: c.textMuted }}>{lang === 'zh' ? '以柔克刚，阴阳调和，气血畅通' : 'Soft overcomes hard, balance yin and yang'}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex justify-center mb-4">
          <div className="flex items-center gap-4 px-6 py-4 rounded-2xl" style={{ background: c.cardBg, border: `1px solid ${c.border}`, boxShadow: `0 4px 24px rgba(0,0,0,0.15), inset 0 0 40px ${c.tealAccent}08` }}>
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color: c.tealAccent }}>{streak}</div>
              <div className="text-xs mt-1" style={{ color: c.textMuted }}>{lang === 'zh' ? '连续天数' : 'Day Streak'}</div>
            </div>
            <div className="w-px h-12" style={{ background: c.border }} />
            <div className="text-center">
              <motion.div animate={todayChecked ? { scale: [1, 1.2, 1] } : {}} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: todayChecked ? c.tealAccent : c.cardBg, border: `1px solid ${todayChecked ? c.tealAccent : c.border}` }}>
                {todayChecked ? (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8L6.5 11.5L13 4.5" stroke="#1a1a2e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                ) : (
                  <TaijiFormIcon type="default" color={c.tealAccent} size={18} />
                )}
              </motion.div>
              <div className="text-xs mt-1" style={{ color: c.textMuted }}>{lang === 'zh' ? '今日太极' : 'Today'}</div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-4 text-xs" style={{ color: c.textFaint }}>{lang === 'zh' ? '每日修行 +2积分' : 'Daily check-in +2 credits'}</motion.div>

        <AnimatePresence mode="wait">
          {showSuccess ? (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="flex flex-col items-center py-12">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }} className="relative">
                <motion.div className="absolute inset-0 rounded-full" style={{ background: `radial-gradient(circle, ${c.tealAccent}40, transparent 70%)`, filter: 'blur(20px)' }} animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 2, repeat: Infinity }} />
                <motion.div className="w-24 h-24 rounded-full flex items-center justify-center relative" style={{ border: `3px solid ${c.tealAccent}`, boxShadow: `0 0 30px ${c.tealAccent}60` }} animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}>
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><path d="M8 20L16 28L32 12" stroke={c.tealAccent} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </motion.div>
              </motion.div>
              <motion.p className="mt-8 text-lg font-medium" style={{ color: c.tealAccent }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>{lang === 'zh' ? '修行完成！' : 'Check-in Successful!'}</motion.p>
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
                        <TaijiFormIcon type={form.key} color={selectedForm === form.key ? '#1a1a2e' : c.tealAccent} size={22} />
                        <div className="font-medium text-sm">{lang === 'zh' ? form.zh : form.en}</div>
                      </div>
                      <div className="text-xs mt-1 opacity-70">{lang === 'zh' ? form.descZh : form.descEn}</div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {selectedForm && (
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  onClick={() => setShowResources(!showResources)}
                  className="w-full py-2.5 rounded-xl text-sm flex items-center justify-center gap-2"
                  style={{ background: c.tealBg, border: `1px solid ${c.tealAccent}30`, color: c.tealAccent }}
                >
                  {lang === 'zh' ? '学习资源' : 'Learning Resources'} {showResources ? '▾' : '▸'}
                </motion.button>
              )}

              <AnimatePresence>
                {showResources && selectedForm && TAICHI_RESOURCES[selectedForm] && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-4 overflow-hidden">
                    <div>
                      <h3 className="text-sm font-medium mb-2 flex items-center gap-1.5" style={{ color: c.tealAccent }}>
                        <PlayCircleIcon color={c.tealAccent} size={16} /> {lang === 'zh' ? '推荐视频' : 'Recommended Videos'}
                      </h3>
                      <div className="space-y-2">
                        {TAICHI_RESOURCES[selectedForm].videos.map((video, i) => (
                          <motion.a
                            key={i}
                            href={video.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ scale: 1.01 }}
                            className="block p-3 rounded-lg transition-all"
                            style={{ background: c.cardBg, border: `1px solid ${c.border}`, textDecoration: 'none' }}
                          >
                            <div className="flex items-baseline justify-between">
                              <div className="text-sm font-medium" style={{ color: c.text }}>{video.title}</div>
                              <div className="text-xs px-1.5 py-0.5 rounded" style={{ background: c.tealBg, color: c.tealAccent }}>{video.platform}</div>
                            </div>
                            <div className="text-xs mt-1" style={{ color: c.textMuted }}>{video.desc}</div>
                          </motion.a>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

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
                  {lang === 'zh' ? '开始修行' : 'Check In'}
                </motion.button>
                {user && (
                  <button onClick={() => setShowHistory(!showHistory)} className="px-4 py-3 rounded-xl text-sm" style={{ background: c.cardBg, border: `1px solid ${c.border}`, color: c.textMuted }}>{lang === 'zh' ? '修行记录' : 'History'}</button>
                )}
              </div>

              {!user && <p className="text-center text-xs" style={{ color: c.textFaint }}>{lang === 'zh' ? '登录后可记录修行数据' : 'Sign in to track your progress'}</p>}

              {showHistory && records.length > 0 && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-2">
                  <h3 className="text-sm font-medium" style={{ color: c.tealAccent }}>{lang === 'zh' ? '近期修行' : 'Recent Check-ins'}</h3>
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