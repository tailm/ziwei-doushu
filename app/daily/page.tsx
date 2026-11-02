'use client';
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useLang } from '@/lib/i18n/LanguageContext';
import { t } from '@/lib/i18n/translations';
import { useTheme } from '@/components/ThemeProvider';
import NavigationBar from '@/components/NavigationBar';

import {
  calculateDailyFortune, calculateGenericDailyFortune,
  calculateWeeklyTrend, calculateMonthlyTrend,
  fortuneLevelToChartValue, isLevelFavorable,
} from '@/lib/fortune/fortune';
import { getCalendarAlmanac, isBlackDay, getZhiShenDesc } from '@/lib/fortune/calendar';
import type { DailyFortune, FortuneLevel, CalendarAlmanacData } from '@/lib/fortune/types';
import type { BaziOutput, BaziInput } from '@/lib/bazi';
import { calculateBaziData } from '@/lib/bazi';
import { FortuneRadar } from '@/components/visualization/charts/FortuneRadar';
import { FortuneTrendChart } from '@/components/visualization/charts/FortuneTrendChart';
import AiDivine from '@/components/AiDivine';
import type { FortuneRadarData } from '@/lib/visualization/chart-types';
import type { FortuneTrendDataPoint } from '@/components/visualization/charts/FortuneTrendChart';

const FORTUNE_LEVEL_EN: Record<string, string> = {
  '大吉': 'Great Fortune',
  '吉': 'Fortune',
  '中吉': 'Moderate Fortune',
  '平': 'Neutral',
  '小凶': 'Minor Misfortune',
  '凶': 'Misfortune',
};

const TEN_GOD_EN: Record<string, string> = {
  '比肩': 'Peer',
  '劫财': 'Rob Wealth',
  '食神': 'Eating God',
  '伤官': 'Hurting Officer',
  '偏财': 'Indirect Wealth',
  '正财': 'Direct Wealth',
  '七杀': 'Seven Killings',
  '正官': 'Direct Officer',
  '偏印': 'Indirect Resource',
  '正印': 'Direct Resource',
};

const SHICHEN_NAMES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

function isValidDate(y: number, m: number, d: number): boolean {
  if (!y || !m || !d) return false;
  const date = new Date(y, m - 1, d);
  return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
}

export default function DailyPage() {
  const { lang } = useLang();
  const { theme } = useTheme();
  const isDark = theme === 'dark';


  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showBirthForm, setShowBirthForm] = useState(false);
  const [baziResult, setBaziResult] = useState<BaziOutput | null>(null);
  const [form, setForm] = useState({
    year: '',
    month: '',
    day: '',
    clockHour: '8',
    clockMinute: '0',
    unknownTime: false,
    gender: 'male' as 'male' | 'female',
  });
  const [error, setError] = useState<string | null>(null);

  const c = {
    bg: isDark ? '#0a0e1a' : '#faf8f3',
    cardBg: isDark ? '#111729' : '#ffffff',
    border: isDark ? '#1e2a4a' : '#e0d8c8',
    text: isDark ? '#e8e0d0' : '#2a2a2a',
    textMuted: isDark ? '#8a8a9a' : '#6a6a6a',
    goldSolid: '#d4a843',
    goldLine: isDark ? 'rgba(212,168,67,0.35)' : 'rgba(180,140,40,0.4)',
    success: '#4caf50',
    warning: '#ff9800',
    danger: '#f44336',
    accent: isDark ? '#4a6fa5' : '#3b5998',
  };

  const isToday = selectedDate.toDateString() === new Date().toDateString();
  const isPersonalized = !!baziResult;

  const fortune = useMemo<DailyFortune>(() => {
    if (baziResult) {
      return calculateDailyFortune(baziResult, selectedDate);
    }
    const generic = calculateGenericDailyFortune(selectedDate);
    return {
      ...generic,
      date: `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`,
      dayStem: '',
      dayBranch: '',
      tenGod: '',
      luckyColor: '',
      luckyDirection: '',
    } as DailyFortune;
  }, [baziResult, selectedDate]);

  const almanac = useMemo<CalendarAlmanacData>(() => {
    return getCalendarAlmanac(selectedDate);
  }, [selectedDate]);

  const formatDate = (date: Date) => {
    if (lang === 'zh') {
      return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
    }
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const formatLevel = (level: FortuneLevel) => {
    if (lang === 'en') return FORTUNE_LEVEL_EN[level] || level;
    return level;
  };

  const trendData = useMemo<FortuneTrendDataPoint[]>(() => {
    if (!baziResult) return [];
    const raw = calculateWeeklyTrend(baziResult, selectedDate);
    return raw.map(d => ({
      date: d.date,
      fullDate: d.fullDate,
      dayOfMonth: d.dayOfMonth,
      scores: d.scores,
    }));
  }, [baziResult, selectedDate]);

  const radarData = useMemo<FortuneRadarData | null>(() => {
    if (!fortune) return null;
    const chart = (fortune as DailyFortune)._chart;
    if (!chart) return null;
    const isUp = (key: 'career' | 'love' | 'wealth' | 'health' | 'social') => {
      const level = fortune[key] as FortuneLevel;
      return isLevelFavorable(level) ? 'up' as const : 'down' as const;
    };
    return {
      chartType: 'fortune_radar',
      title: lang === 'zh' ? '今日运势雷达' : 'Today\'s Fortune Radar',
      subtitle: formatDate(selectedDate),
      data: {
        period: formatDate(selectedDate),
        scores: {
          career: { score: chart.career, label: lang === 'zh' ? '事业' : 'Career', trend: isUp('career') },
          wealth: { score: chart.wealth, label: lang === 'zh' ? '财运' : 'Wealth', trend: isUp('wealth') },
          love: { score: chart.love, label: lang === 'zh' ? '感情' : 'Love', trend: isUp('love') },
          health: { score: chart.health, label: lang === 'zh' ? '健康' : 'Health', trend: isUp('health') },
          social: { score: chart.social, label: lang === 'zh' ? '人际' : 'Social', trend: isUp('social') },
        },
        overallScore: chart.overall,
        overallLabel: formatLevel(fortune.overall as FortuneLevel),
        topAdvice: fortune.advice[0] || '',
      },
    };
  }, [fortune, selectedDate, lang]);

  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const goToToday = () => setSelectedDate(new Date());

  const handleCalculate = () => {
    setError(null);
    const y = parseInt(form.year);
    const m = parseInt(form.month);
    const d = parseInt(form.day);
    const h = form.unknownTime ? 0 : parseInt(form.clockHour);
    const min = form.unknownTime ? 0 : parseInt(form.clockMinute);

    if (!y || !m || !d) {
      setError(lang === 'zh' ? '请填写出生年月日' : 'Please fill in birth date');
      return;
    }
    if (!isValidDate(y, m, d)) {
      setError(lang === 'zh' ? '日期不合法' : 'Invalid date');
      return;
    }

    const input: BaziInput = {
      birthYear: y,
      birthMonth: m,
      birthDay: d,
      birthHour: h,
      birthMinute: min,
      gender: form.gender,
      calendarType: 'solar',
      dayBoundary: 'midnight',
    };

    try {
      const bazi = calculateBaziData(input);
      setBaziResult(bazi);
      setShowBirthForm(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  };

  const handleResetBazi = () => {
    setBaziResult(null);
    setForm({ year: '', month: '', day: '', clockHour: '8', clockMinute: '0', unknownTime: false, gender: 'male' });
  };

  const scoreItems = [
    { key: 'overall' as const, label: t('daily_overall', lang), color: c.goldSolid },
    { key: 'career' as const, label: t('daily_career', lang), color: '#4a90d9' },
    { key: 'love' as const, label: t('daily_love', lang), color: '#e57373' },
    { key: 'wealth' as const, label: t('daily_wealth', lang), color: '#66bb6a' },
    { key: 'health' as const, label: t('daily_health', lang), color: '#ff7043' },
    { key: 'social' as const, label: t('daily_social', lang), color: '#ab47bc' },
  ];


  const formatTenGod = (tenGod: string) => {
    if (lang === 'en') return TEN_GOD_EN[tenGod] || tenGod;
    return tenGod;
  };

  const zhiShenDesc = almanac.zhiShen ? getZhiShenDesc(almanac.zhiShen) : '';
  const isBlack = almanac.zhiShen ? isBlackDay(almanac.zhiShen) : false;

  return (
    <div className="min-h-screen pb-20" style={{ background: c.bg, color: c.text }}>
      <NavigationBar />
      <div className="max-w-5xl mx-auto px-4 pt-20 py-8 space-y-6">

        {/* 日期导航 */}
        <div className="flex items-center justify-between" style={{ background: c.cardBg, border: `1px solid ${c.border}`, borderRadius: 8, padding: '12px 16px' }}>
          <button
            onClick={() => changeDate(-1)}
            className="px-3 py-1.5 rounded text-sm transition-colors"
            style={{ border: `1px solid ${c.border}`, color: c.textMuted }}
          >
            {t('daily_prev_day', lang)}
          </button>
          <div className="text-center">
            <div className="text-base font-semibold">{formatDate(selectedDate)}</div>
            <div className="text-xs" style={{ color: c.textMuted }}>
              {almanac.weekday} · {almanac.lunarMonthDay}
            </div>
          </div>
          <div className="flex gap-2">
            {!isToday && (
              <button
                onClick={goToToday}
                className="px-3 py-1.5 rounded text-sm transition-colors"
                style={{ border: `1px solid ${c.goldLine}`, color: c.goldSolid }}
              >
                {t('daily_today', lang)}
              </button>
            )}
            <button
              onClick={() => changeDate(1)}
              className="px-3 py-1.5 rounded text-sm transition-colors"
              style={{ border: `1px solid ${c.border}`, color: c.textMuted }}
            >
              {t('daily_next_day', lang)}
            </button>
          </div>
        </div>

        {/* 个性化/通用标识 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className="px-2 py-0.5 rounded text-xs font-medium"
              style={{
                background: isPersonalized ? `${c.goldSolid}20` : `${c.accent}20`,
                color: isPersonalized ? c.goldSolid : c.accent,
              }}
            >
              {isPersonalized ? t('daily_personalized', lang) : t('daily_generic', lang)}
            </span>
            {isPersonalized && baziResult && (
              <span className="text-xs" style={{ color: c.textMuted }}>
                {baziResult.dayMaster}{lang === 'en' ? ' Day Master' : '日主'}
              </span>
            )}
          </div>
          {isPersonalized ? (
            <button
              onClick={handleResetBazi}
              className="text-xs px-2 py-1 rounded transition-colors"
              style={{ border: `1px solid ${c.border}`, color: c.textMuted }}
            >
              {lang === 'zh' ? '清除命盘' : 'Clear Chart'}
            </button>
          ) : (
            <button
              onClick={() => setShowBirthForm(true)}
              className="text-xs px-2 py-1 rounded transition-colors"
              style={{ border: `1px solid ${c.goldLine}`, color: c.goldSolid }}
            >
              {t('daily_set_birth', lang)}
            </button>
          )}
        </div>

        {/* 出生信息表单弹窗 */}
        {showBirthForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
            <div className="w-full max-w-md rounded-lg p-6 space-y-4" style={{ background: c.cardBg, border: `1px solid ${c.border}` }}>
              <h3 className="text-sm font-semibold">{t('daily_set_birth', lang)}</h3>
              {error && <div className="text-xs text-red-500">{error}</div>}

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs" style={{ color: c.textMuted }}>{t('form_year', lang)}</label>
                  <input
                    type="number"
                    value={form.year}
                    onChange={e => setForm({ ...form, year: e.target.value })}
                    className="w-full px-2 py-1.5 rounded text-sm"
                    style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.text }}
                    placeholder="1990"
                  />
                </div>
                <div>
                  <label className="text-xs" style={{ color: c.textMuted }}>{t('form_month', lang)}</label>
                  <input
                    type="number"
                    value={form.month}
                    onChange={e => setForm({ ...form, month: e.target.value })}
                    className="w-full px-2 py-1.5 rounded text-sm"
                    style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.text }}
                    placeholder="1-12"
                  />
                </div>
                <div>
                  <label className="text-xs" style={{ color: c.textMuted }}>{t('form_day', lang)}</label>
                  <input
                    type="number"
                    value={form.day}
                    onChange={e => setForm({ ...form, day: e.target.value })}
                    className="w-full px-2 py-1.5 rounded text-sm"
                    style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.text }}
                    placeholder="1-31"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs" style={{ color: c.textMuted }}>{t('form_hour', lang)}</label>
                  <select
                    value={form.clockHour}
                    onChange={e => setForm({ ...form, clockHour: e.target.value })}
                    disabled={form.unknownTime}
                    className="w-full px-2 py-1.5 rounded text-sm"
                    style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.text }}
                  >
                    {Array.from({ length: 24 }, (_, i) => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs" style={{ color: c.textMuted }}>{t('form_minute', lang)}</label>
                  <select
                    value={form.clockMinute}
                    onChange={e => setForm({ ...form, clockMinute: e.target.value })}
                    disabled={form.unknownTime}
                    className="w-full px-2 py-1.5 rounded text-sm"
                    style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.text }}
                  >
                    {[0, 15, 30, 45].map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="unknownTime"
                  checked={form.unknownTime}
                  onChange={e => setForm({ ...form, unknownTime: e.target.checked })}
                />
                <label htmlFor="unknownTime" className="text-xs" style={{ color: c.textMuted }}>
                  {t('form_unknown_time', lang)}
                </label>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => { setShowBirthForm(false); setError(null); }}
                  className="flex-1 px-3 py-2 rounded text-sm"
                  style={{ border: `1px solid ${c.border}`, color: c.textMuted }}
                >
                  {lang === 'zh' ? '取消' : 'Cancel'}
                </button>
                <button
                  onClick={handleCalculate}
                  className="flex-1 px-3 py-2 rounded text-sm font-medium"
                  style={{ background: c.goldSolid, color: '#fff' }}
                >
                  {lang === 'zh' ? '确定' : 'Confirm'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 主要内容：左侧黄历 + 右侧运势 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* 左侧：黄历信息 */}
          <div className="rounded-lg overflow-hidden" style={{ background: c.cardBg, border: `1px solid ${c.border}` }}>
            <div className="px-4 py-3" style={{ borderBottom: `1px solid ${c.border}` }}>
              <h2 className="text-sm font-semibold flex items-center gap-2">
                <span style={{ color: c.goldSolid }}>◆</span>
                {t('daily_almanac', lang)}
              </h2>
            </div>
            <div className="p-4 space-y-3 text-sm">
              {/* 农历 & 生肖 */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-xs" style={{ color: c.textMuted }}>{t('daily_lunar_date', lang)}</div>
                  <div className="font-medium">{almanac.lunarDate}</div>
                </div>
                <div>
                  <div className="text-xs" style={{ color: c.textMuted }}>{t('daily_shengxiao', lang)}</div>
                  <div className="font-medium">
                    {almanac.shengXiao.year} · {almanac.shengXiao.month} · {almanac.shengXiao.day}
                  </div>
                </div>
              </div>

              {/* 干支 & 纳音 */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-xs" style={{ color: c.textMuted }}>{t('daily_ganzhi', lang)}</div>
                  <div className="font-medium">
                    {almanac.ganZhi.year} / {almanac.ganZhi.month} / {almanac.ganZhi.day}
                  </div>
                </div>
                <div>
                  <div className="text-xs" style={{ color: c.textMuted }}>{t('daily_nayin', lang)}</div>
                  <div className="font-medium">
                    {almanac.naYin.year} · {almanac.naYin.month} · {almanac.naYin.day}
                  </div>
                </div>
              </div>

              {/* 节气 */}
              <div>
                <div className="text-xs" style={{ color: c.textMuted }}>{t('daily_jieqi', lang)}</div>
                <div className="font-medium">
                  {almanac.jieQi.current ? `${almanac.jieQi.current.name} (${almanac.jieQi.current.date})` : '-'}
                  {' → '}
                  {almanac.jieQi.next ? `${almanac.jieQi.next.name} (${almanac.jieQi.next.date})` : '-'}
                </div>
              </div>

              {/* 宜忌 */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-xs font-semibold" style={{ color: c.success }}>{t('daily_yi', lang)}</div>
                  <div className="text-xs leading-relaxed" style={{ color: c.text }}>
                    {almanac.yi.length > 0 ? almanac.yi.join(' · ') : '-'}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold" style={{ color: c.danger }}>{t('daily_ji', lang)}</div>
                  <div className="text-xs leading-relaxed" style={{ color: c.text }}>
                    {almanac.ji.length > 0 ? almanac.ji.join(' · ') : '-'}
                  </div>
                </div>
              </div>

              {/* 吉神凶煞 */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-xs font-semibold" style={{ color: c.success }}>{t('daily_jishen', lang)}</div>
                  <div className="text-xs leading-relaxed" style={{ color: c.text }}>
                    {almanac.jiShen.length > 0 ? almanac.jiShen.slice(0, 6).join(' · ') : '-'}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold" style={{ color: c.danger }}>{t('daily_xiongsha', lang)}</div>
                  <div className="text-xs leading-relaxed" style={{ color: c.text }}>
                    {almanac.xiongSha.length > 0 ? almanac.xiongSha.slice(0, 6).join(' · ') : '-'}
                  </div>
                </div>
              </div>

              {/* 冲煞 & 空亡 */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <div className="text-xs" style={{ color: c.textMuted }}>{t('daily_chongsha', lang)}</div>
                  <div className="text-xs font-medium">{almanac.chongSha.chong}</div>
                  <div className="text-xs" style={{ color: c.textMuted }}>{almanac.chongSha.sha}</div>
                </div>
                <div>
                  <div className="text-xs" style={{ color: c.textMuted }}>{t('daily_kongwang', lang)}</div>
                  <div className="text-xs font-medium">{almanac.kongWang}</div>
                </div>
                <div>
                  <div className="text-xs" style={{ color: c.textMuted }}>{t('daily_zhishen', lang)}</div>
                  <div className="text-xs font-medium" style={{ color: isBlack ? c.danger : c.success }}>
                    {zhiShenDesc}
                  </div>
                </div>
              </div>

              {/* 胎神 */}
              <div>
                <div className="text-xs" style={{ color: c.textMuted }}>{t('daily_taishen', lang)}</div>
                <div className="text-xs font-medium">{almanac.taiShen}</div>
              </div>

              {/* 神位 */}
              <div className="grid grid-cols-4 gap-2">
                <div>
                  <div className="text-xs" style={{ color: c.textMuted }}>{t('daily_cai_shen', lang)}</div>
                  <div className="text-xs font-medium">{almanac.shenWei.caiShen}</div>
                </div>
                <div>
                  <div className="text-xs" style={{ color: c.textMuted }}>{t('daily_xi_shen', lang)}</div>
                  <div className="text-xs font-medium">{almanac.shenWei.xiShen}</div>
                </div>
                <div>
                  <div className="text-xs" style={{ color: c.textMuted }}>{t('daily_fu_shen', lang)}</div>
                  <div className="text-xs font-medium">{almanac.shenWei.fuShen}</div>
                </div>
                <div>
                  <div className="text-xs" style={{ color: c.textMuted }}>{t('daily_yang_gui', lang)}</div>
                  <div className="text-xs font-medium">{almanac.shenWei.yangGuiShen}</div>
                </div>
              </div>

              {/* 二十八宿 & 月相 & 六曜 & 九星 & 物候 */}
              <div className="grid grid-cols-2 gap-3 pt-2" style={{ borderTop: `1px solid ${c.border}` }}>
                <div>
                  <div className="text-xs" style={{ color: c.textMuted }}>{t('daily_xiu', lang)}</div>
                  <div className="text-xs font-medium">
                    {almanac.xiu.name} · {almanac.xiu.gong} · {almanac.xiu.luck}
                  </div>
                </div>
                <div>
                  <div className="text-xs" style={{ color: c.textMuted }}>{t('daily_yuexiang', lang)}</div>
                  <div className="text-xs font-medium">{almanac.yueXiang}</div>
                </div>
                <div>
                  <div className="text-xs" style={{ color: c.textMuted }}>{t('daily_liuyao', lang)}</div>
                  <div className="text-xs font-medium">{almanac.liuYao}</div>
                </div>
                <div>
                  <div className="text-xs" style={{ color: c.textMuted }}>{t('daily_jiuxing', lang)}</div>
                  <div className="text-xs font-medium">{almanac.jiuXing}</div>
                </div>
              </div>
              <div>
                <div className="text-xs" style={{ color: c.textMuted }}>{t('daily_wuhou', lang)}</div>
                <div className="text-xs font-medium">{almanac.wuHou}</div>
              </div>
            </div>
          </div>

          {/* 右侧：运势分析 */}
          <div className="space-y-6">
            {/* 7日趋势（仅个性化模式） */}
            {isPersonalized && trendData.length > 0 && (
              <div className="rounded-lg p-4" style={{ background: c.cardBg, border: `1px solid ${c.border}` }}>
                <FortuneTrendChart
                  data={trendData}
                  selectedDate={fortune.date}
                  height={220}
                  defaultOverallOnly={true}
                  title={<span className="text-sm font-semibold">{t('daily_trend', lang)}</span>}
                />
              </div>
            )}

            {/* 运势雷达图 */}
            {radarData && (
              <div className="rounded-lg p-4" style={{ background: c.cardBg, border: `1px solid ${c.border}` }}>
                <FortuneRadar data={radarData} compact={false} />
              </div>
            )}

            {/* 运势评分详情 */}
            <div className="rounded-lg p-4" style={{ background: c.cardBg, border: `1px solid ${c.border}` }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold">{t('daily_fortune_analysis', lang)}</h3>
                {fortune.dayStem && fortune.dayBranch && (
                  <span className="text-xs" style={{ color: c.textMuted }}>
                    {t('daily_day_ganzhi', lang)}: {fortune.dayStem}{fortune.dayBranch}
                    {fortune.tenGod && ` · ${formatTenGod(fortune.tenGod)}`}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                {scoreItems.map(item => {
                  const level = fortune[item.key] as FortuneLevel;
                  const chartValue = fortuneLevelToChartValue(level);
                  const favorable = isLevelFavorable(level);
                  const neutral = level === '平';

                  return (
                    <div key={item.key}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium" style={{ color: c.text }}>
                          {item.label}
                        </span>
                        <span
                          className="text-xs font-semibold"
                          style={{ color: favorable ? c.success : neutral ? c.warning : c.danger }}
                        >
                          {formatLevel(level)}
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: isDark ? '#1a2238' : '#eee' }}>
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${chartValue}%`,
                            background: favorable ? c.success : neutral ? c.warning : c.danger,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 幸运信息 */}
              {isPersonalized && fortune.luckyColor && (
                <div className="grid grid-cols-2 gap-4 pt-3 mt-3" style={{ borderTop: `1px solid ${c.border}` }}>
                  <div>
                    <div className="text-xs" style={{ color: c.textMuted }}>{t('daily_lucky_color', lang)}</div>
                    <div className="text-sm font-medium">{fortune.luckyColor}</div>
                  </div>
                  <div>
                    <div className="text-xs" style={{ color: c.textMuted }}>{t('daily_lucky_direction', lang)}</div>
                    <div className="text-sm font-medium">{fortune.luckyDirection}</div>
                  </div>
                </div>
              )}

              {/* 运势指引 */}
              <div className="pt-3 mt-3" style={{ borderTop: `1px solid ${c.border}` }}>
                <h4 className="text-sm font-semibold mb-3">{t('daily_advice', lang)}</h4>
                <ul className="space-y-2">
                  {fortune.advice.map((advice, index) => (
                    <li key={index} className="flex gap-2 text-sm leading-relaxed" style={{ color: c.text }}>
                      <span
                        className="flex-shrink-0 w-5 h-5 rounded text-[10px] font-bold flex items-center justify-center"
                        style={{ background: isDark ? '#1a2238' : '#eee', color: c.textMuted }}
                      >
                        {index + 1}
                      </span>
                      <span>{advice}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* AI深度解读 */}
              <div className="pt-3 mt-3" style={{ borderTop: `1px solid ${c.border}` }}>
                <AiDivine
                  tool="daily"
                  context={`日期: ${fortune.date}\n日干支: ${fortune.dayStem}${fortune.dayBranch}\n十神: ${fortune.tenGod}\n综合运势: ${fortune.overall}\n事业: ${fortune.career}\n感情: ${fortune.love}\n财运: ${fortune.wealth}\n健康: ${fortune.health}\n人际: ${fortune.social}\n幸运颜色: ${fortune.luckyColor || '未知'}\n幸运方位: ${fortune.luckyDirection || '未知'}\n建议: ${fortune.advice.join('; ')}`}
                  goldSolid={c.goldSolid}
                  goldLine={c.goldLine}
                  cardBg={c.cardBg}
                  cardBorder={c.border}
                  textPrimary={c.text}
                  textSecond={c.textMuted}
                  textMuted={c.textMuted}
                  isDark={isDark}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}