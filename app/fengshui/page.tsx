'use client';
import { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '@/lib/i18n/LanguageContext';
import { useTheme } from '@/components/ThemeProvider';
import { TaijiDiagram, BaguaDiagram, DiamondDivider, FloatingStars } from '@/components/Decorations';
import NavigationBar from '@/components/NavigationBar';

const BAGUA_DIRECTIONS = [
  { name: '乾', direction: '西北', element: '金', attribute: '天·父·君', degrees: '315°-345°', color: '#d4a843', angle: 330 },
  { name: '坎', direction: '正北', element: '水', attribute: '水·中男·险', degrees: '0°-30°', color: '#3b82f6', angle: 0 },
  { name: '艮', direction: '东北', element: '土', attribute: '山·少男·止', degrees: '45°-75°', color: '#a855f7', angle: 60 },
  { name: '震', direction: '正东', element: '木', attribute: '雷·长男·动', degrees: '90°-120°', color: '#22c55e', angle: 90 },
  { name: '巽', direction: '东南', element: '木', attribute: '风·长女·入', degrees: '135°-165°', color: '#06b6d4', angle: 135 },
  { name: '离', direction: '正南', element: '火', attribute: '火·中女·明', degrees: '180°-210°', color: '#ef4444', angle: 180 },
  { name: '坤', direction: '西南', element: '土', attribute: '地·母·顺', degrees: '225°-255°', color: '#f59e0b', angle: 240 },
  { name: '兑', direction: '正西', element: '金', attribute: '泽·少女·悦', degrees: '270°-300°', color: '#ec4899', angle: 270 },
];

const HOUSE_TYPES = [
  { key: 'apartment', label_zh: '公寓/楼房', label_en: 'Apartment' },
  { key: 'house', label_zh: '独栋住宅', label_en: 'House' },
  { key: 'office', label_zh: '办公室', label_en: 'Office' },
  { key: 'shop', label_zh: '商铺', label_en: 'Shop' },
];

const FIVE_ELEMENTS = [
  { name: '金', color: '#d4a843', direction: '西/西北', attribute: '收敛·肃杀', generates: '水', destroys: '木' },
  { name: '木', color: '#22c55e', direction: '东/东南', attribute: '生长·舒展', generates: '火', destroys: '土' },
  { name: '水', color: '#3b82f6', direction: '北', attribute: '润下·流动', generates: '木', destroys: '火' },
  { name: '火', color: '#ef4444', direction: '南', attribute: '炎上·光明', generates: '土', destroys: '金' },
  { name: '土', color: '#f59e0b', direction: '中/东北/西南', attribute: '承载·化育', generates: '金', destroys: '水' },
];

const GUA_MAP: Record<number, { name: string; group: 'east' | 'west'; favorable: string[]; unfavorable: string[] }> = {
  1: { name: '坎', group: 'east', favorable: ['正北', '正东', '正南', '东南'], unfavorable: ['正西', '西北', '西南', '东北'] },
  2: { name: '坤', group: 'west', favorable: ['西南', '正西', '西北', '东北'], unfavorable: ['正北', '正东', '正南', '东南'] },
  3: { name: '震', group: 'east', favorable: ['正东', '正北', '正南', '东南'], unfavorable: ['正西', '西北', '西南', '东北'] },
  4: { name: '巽', group: 'east', favorable: ['东南', '正北', '正东', '正南'], unfavorable: ['正西', '西北', '西南', '东北'] },
  6: { name: '乾', group: 'west', favorable: ['西北', '正西', '西南', '东北'], unfavorable: ['正北', '正东', '正南', '东南'] },
  7: { name: '兑', group: 'west', favorable: ['正西', '西北', '西南', '东北'], unfavorable: ['正北', '正东', '正南', '东南'] },
  8: { name: '艮', group: 'west', favorable: ['东北', '正西', '西北', '西南'], unfavorable: ['正北', '正东', '正南', '东南'] },
  9: { name: '离', group: 'east', favorable: ['正南', '正东', '正北', '东南'], unfavorable: ['正西', '西北', '西南', '东北'] },
};

function calcMingGua(year: number, gender: 'male' | 'female'): number | null {
  if (year < 1900 || year > 2100) return null;
  const lastTwo = year % 100;
  let guaNum: number;
  if (year >= 2000) {
    if (gender === 'male') {
      guaNum = (9 - ((lastTwo) % 9)) % 9;
    } else {
      guaNum = ((lastTwo + 6) % 9) || 9;
    }
  } else {
    if (gender === 'male') {
      guaNum = (100 - lastTwo) % 9;
    } else {
      guaNum = (lastTwo - 4) % 9;
    }
  }
  if (guaNum === 0) guaNum = 9;
  if (guaNum === 5) {
    guaNum = gender === 'male' ? 2 : 8;
  }
  return guaNum;
}

function BaguaCompass({ selectedDirection, onSelect, colors }: {
  selectedDirection: string;
  onSelect: (dir: string) => void;
  colors: any;
}) {
  const radius = 130;
  const center = 160;
  const labelRadius = 100;

  return (
    <svg width="320" height="320" viewBox="0 0 320 320" className="mx-auto">
      <circle cx={center} cy={center} r={radius} fill="none" stroke={colors.goldLine} strokeWidth="1" opacity={0.3} />
      <circle cx={center} cy={center} r={radius - 20} fill="none" stroke={colors.goldLine} strokeWidth="0.5" opacity={0.2} />
      <circle cx={center} cy={center} r={labelRadius + 20} fill="none" stroke={colors.goldLine} strokeWidth="0.5" opacity={0.15} />

      {BAGUA_DIRECTIONS.map(dir => {
        const rad = (dir.angle - 90) * Math.PI / 180;
        const x = Math.round((center + labelRadius * Math.cos(rad)) * 100) / 100;
        const y = Math.round((center + labelRadius * Math.sin(rad)) * 100) / 100;
        const isSelected = selectedDirection === dir.direction;
        const innerR = isSelected ? 28 : 22;
        return (
          <g key={dir.name} onClick={() => onSelect(dir.direction)} style={{ cursor: 'pointer' }}>
            <circle cx={x} cy={y} r={innerR} fill={isSelected ? dir.color : `${dir.color}15`} stroke={dir.color} strokeWidth={isSelected ? 2 : 1} opacity={isSelected ? 0.9 : 0.5} />
            <text x={x} y={y - 2} textAnchor="middle" fontSize="14" fontWeight="bold" fill={isSelected ? '#fff' : dir.color} fontFamily="serif">{dir.name}</text>
            <text x={x} y={y + 10} textAnchor="middle" fontSize="7" fill={isSelected ? '#fff' : colors.textFaint}>{dir.direction}</text>
          </g>
        );
      })}

      <circle cx={center} cy={center} r="28" fill="none" stroke={colors.goldSolid} strokeWidth="1.5" opacity={0.4} />
      <text x={center} y={center - 2} textAnchor="middle" fontSize="10" fill={colors.goldSolid} opacity={0.6} fontFamily="serif">太极</text>
      <text x={center} y={center + 10} textAnchor="middle" fontSize="6" fill={colors.goldSolid} opacity={0.4}>中心</text>
    </svg>
  );
}

function FiveElementCycle({ colors }: { colors: any }) {
  const elements = [
    { name: '金', color: '#d4a843', angle: -90 },
    { name: '水', color: '#3b82f6', angle: -18 },
    { name: '木', color: '#22c55e', angle: 54 },
    { name: '火', color: '#ef4444', angle: 126 },
    { name: '土', color: '#f59e0b', angle: 198 },
  ];
  const r = 70;
  const cx = 100;
  const cy = 100;

  return (
    <svg width="200" height="200" viewBox="0 0 200 200" className="mx-auto">
      {elements.map((el, i) => {
        const next = elements[(i + 1) % 5];
        const rad = el.angle * Math.PI / 180;
        const nextRad = next.angle * Math.PI / 180;
        const x1 = Math.round((cx + r * Math.cos(rad)) * 100) / 100;
        const y1 = Math.round((cy + r * Math.sin(rad)) * 100) / 100;
        const x2 = Math.round((cx + r * Math.cos(nextRad)) * 100) / 100;
        const y2 = Math.round((cy + r * Math.sin(nextRad)) * 100) / 100;
        return (
          <g key={`gen-${el.name}`}>
            <path d={`M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`} fill="none" stroke={el.color} strokeWidth="1.5" opacity={0.4} markerEnd="url(#arrow-gen)" />
          </g>
        );
      })}

      <defs>
        <marker id="arrow-gen" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill={colors.goldSolid} opacity={0.5} />
        </marker>
      </defs>

      {elements.map(el => {
        const rad = el.angle * Math.PI / 180;
        const x = Math.round((cx + r * Math.cos(rad)) * 100) / 100;
        const y = Math.round((cy + r * Math.sin(rad)) * 100) / 100;
        return (
          <g key={el.name}>
            <circle cx={x} cy={y} r="18" fill={`${el.color}20`} stroke={el.color} strokeWidth="1.5" />
            <text x={x} y={y + 4} textAnchor="middle" fontSize="12" fontWeight="bold" fill={el.color} fontFamily="serif">{el.name}</text>
          </g>
        );
      })}

      <circle cx={cx} cy={cy} r="22" fill="none" stroke={colors.goldSolid} strokeWidth="0.5" opacity={0.2} />
      <text x={cx} y={cy + 3} textAnchor="middle" fontSize="8" fill={colors.goldSolid} opacity={0.4}>相生</text>
    </svg>
  );
}

export default function FengShuiPage() {
  const { lang } = useLang();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [houseType, setHouseType] = useState('');
  const [facingDirection, setFacingDirection] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [roomLayout, setRoomLayout] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState('');
  const abortRef = useRef<AbortController | null>(null);

  const mingGua = useMemo(() => {
    if (!birthYear) return null;
    const year = parseInt(birthYear);
    if (isNaN(year)) return null;
    return calcMingGua(year, gender);
  }, [birthYear, gender]);

  const guaInfo = mingGua ? GUA_MAP[mingGua] : null;
  const selectedBagua = BAGUA_DIRECTIONS.find(d => d.direction === facingDirection);

  const c = {
    bgBase: isDark ? '#020810' : '#f5efe0',
    goldSolid: isDark ? '#d4a843' : '#8b6410',
    goldLine: isDark ? 'rgba(212,168,67,0.4)' : 'rgba(140,100,20,0.4)',
    textPrimary: isDark ? '#e8eef6' : '#1a1d24',
    textSecond: isDark ? '#b8c6df' : '#3a3f4a',
    textMuted: isDark ? '#9db0d0' : '#5a6275',
    textFaint: isDark ? 'rgba(240,246,255,0.56)' : '#9da4b3',
    cardBg: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.88)',
    cardBorder: isDark ? 'rgba(255,255,255,0.10)' : 'rgba(200,160,60,0.25)',
    featureBg: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.75)',
    featureBord: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(200,160,60,0.2)',
    navBorder: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(160,120,30,0.15)',
    altSection: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.4)',
    tagText: isDark ? 'rgba(212,168,67,0.6)' : 'rgba(120,80,10,0.65)',
    tabActive: isDark ? 'rgba(212,168,67,0.15)' : 'rgba(140,100,20,0.12)',
    successBg: isDark ? 'rgba(34,197,94,0.08)' : 'rgba(34,197,94,0.06)',
    warningBg: isDark ? 'rgba(239,68,68,0.08)' : 'rgba(239,68,68,0.06)',
  };

  const handleAnalyze = async () => {
    if (!houseType || !facingDirection) {
      setError(lang === 'zh' ? '请选择房屋类型和朝向' : 'Please select house type and facing direction');
      return;
    }
    setError('');
    setAnalysis('');
    setStreaming(true);

    const abortController = new AbortController();
    abortRef.current = abortController;

    try {
      const response = await fetch('/api/fengshui-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          houseType,
          facingDirection,
          birthYear: birthYear || undefined,
          gender: birthYear ? gender : undefined,
          roomLayout: roomLayout || undefined,
          lang,
        }),
        signal: abortController.signal,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;
            try {
              const parsed = JSON.parse(data);
              const text = parsed.delta?.text ?? parsed.content ?? '';
              if (text) {
                setAnalysis(prev => prev + text);
              }
            } catch {}
          }
        }
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setError(err.message || (lang === 'zh' ? '分析失败，请稍后重试' : 'Analysis failed, please try again'));
      }
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  };

  const handleStop = () => {
    abortRef.current?.abort();
    setStreaming(false);
  };

  const handleReset = () => {
    setAnalysis('');
    setError('');
  };

  const isFavorableDirection = guaInfo && selectedBagua
    ? guaInfo.favorable.includes(selectedBagua.direction)
    : false;
  const isUnfavorableDirection = guaInfo && selectedBagua
    ? guaInfo.unfavorable.includes(selectedBagua.direction)
    : false;

  return (
    <div style={{ background: c.bgBase, minHeight: '100vh', transition: 'background 0.35s ease' }}>
      <NavigationBar />

      <div className="pt-20 px-4 sm:px-6 max-w-4xl mx-auto">
        {/* 标题区 */}
        <div className="text-center mb-10 relative">
          <FloatingStars count={6} color={c.goldSolid} opacity={0.08} />
          <div className="absolute left-1/2 -translate-x-1/2 -top-4 pointer-events-none">
            <TaijiDiagram size={80} color={c.goldSolid} opacity={0.06} />
          </div>
          <DiamondDivider color={c.goldSolid} opacity={0.4} className="mb-4" />
          <h1 className={`font-bold mt-3 tracking-tight ${isDark ? 'grad-text-dark' : 'grad-text-light'} grad-text`}
            style={{ fontSize: 'clamp(28px, 4vw, 44px)' }}>
            {lang === 'zh' ? '风水堪舆分析' : 'Feng Shui Analysis'}
          </h1>
          <p className="max-w-xl mx-auto text-sm leading-relaxed mt-3" style={{ color: c.textSecond }}>
            {lang === 'zh'
              ? '结合道家阴阳五行与八卦方位理论，分析住宅风水格局，提供方位吉凶、五行生克、布局建议等深度解读。'
              : 'Based on Daoist Yin-Yang, Five Elements and Bagua direction theory, analyze residential Feng Shui patterns for directional fortune, elemental interactions, and layout recommendations.'}
          </p>
        </div>

        {/* 八卦圆形罗盘 */}
        <div className="mb-8">
          <div className="text-center mb-4">
            <span className="text-[10px] tracking-[0.3em]" style={{ color: c.tagText }}>
              {lang === 'zh' ? '八卦方位罗盘 · 点击选择朝向' : 'Bagua Compass · Click to Select'}
            </span>
          </div>
          <BaguaCompass selectedDirection={facingDirection} onSelect={setFacingDirection} colors={c} />
        </div>

        {/* 选中方位信息 */}
        <AnimatePresence>
          {selectedBagua && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="rounded-2xl p-5 mb-8"
              style={{ border: `1px solid ${selectedBagua.color}40`, background: `${selectedBagua.color}08` }}>
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-4">
                  <div className="text-3xl font-bold" style={{ color: selectedBagua.color, fontFamily: 'serif' }}>
                    {selectedBagua.name}
                  </div>
                  <div>
                    <div className="text-sm font-medium" style={{ color: c.textPrimary }}>
                      {selectedBagua.direction} · {selectedBagua.element}
                    </div>
                    <div className="text-xs" style={{ color: c.textMuted }}>
                      {selectedBagua.attribute} · {selectedBagua.degrees}
                    </div>
                  </div>
                </div>
                {guaInfo && (
                  <div className="flex items-center gap-2">
                    {isFavorableDirection && (
                      <span className="text-xs px-3 py-1 rounded-full font-medium" style={{ background: c.successBg, color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)' }}>
                        {lang === 'zh' ? '吉方' : 'Favorable'}
                      </span>
                    )}
                    {isUnfavorableDirection && (
                      <span className="text-xs px-3 py-1 rounded-full font-medium" style={{ background: c.warningBg, color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' }}>
                        {lang === 'zh' ? '凶方' : 'Unfavorable'}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 五行相生图 + 五行方位 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <div>
            <div className="text-center mb-3">
              <span className="text-[10px] tracking-[0.3em]" style={{ color: c.tagText }}>
                {lang === 'zh' ? '五行相生循环' : 'Five Elements Generation'}
              </span>
            </div>
            <FiveElementCycle colors={c} />
          </div>
          <div>
            <div className="text-center mb-3">
              <span className="text-[10px] tracking-[0.3em]" style={{ color: c.tagText }}>
                {lang === 'zh' ? '五行方位属性' : 'Five Elements Directions'}
              </span>
            </div>
            <div className="space-y-2">
              {FIVE_ELEMENTS.map(el => (
                <div key={el.name} className="rounded-lg p-2.5 flex items-center gap-3"
                  style={{ border: `1px solid ${el.color}25`, background: `${el.color}06` }}>
                  <div className="text-lg font-bold w-8 text-center" style={{ color: el.color, fontFamily: 'serif' }}>{el.name}</div>
                  <div className="flex-1">
                    <div className="text-xs" style={{ color: c.textMuted }}>{el.direction}</div>
                    <div className="text-[10px]" style={{ color: el.color }}>{el.attribute}</div>
                  </div>
                  <div className="text-[10px] text-right" style={{ color: c.textFaint }}>
                    {lang === 'zh' ? `生${el.generates}` : `→ ${el.generates}`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 命卦推算结果 */}
        <AnimatePresence>
          {guaInfo && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="rounded-2xl p-5 mb-8"
              style={{ border: `1px solid ${c.goldLine}`, background: c.cardBg }}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs tracking-wider" style={{ color: c.goldSolid }}>
                  {lang === 'zh' ? '命卦推算结果' : 'Ming Gua Calculation'}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm mb-1" style={{ color: c.textPrimary }}>
                    {lang === 'zh' ? '命卦' : 'Life Gua'}:
                    <span className="font-bold ml-2" style={{ color: c.goldSolid, fontFamily: 'serif' }}>
                      {guaInfo.name} ({mingGua})
                    </span>
                  </div>
                  <div className="text-xs mb-3" style={{ color: c.textMuted }}>
                    {guaInfo.group === 'east'
                      ? (lang === 'zh' ? '东四命' : 'East Four Gua')
                      : (lang === 'zh' ? '西四命' : 'West Four Gua')}
                  </div>
                </div>
                <div>
                  <div className="text-xs mb-1" style={{ color: '#22c55e' }}>
                    {lang === 'zh' ? '吉方' : 'Favorable'}:
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {guaInfo.favorable.map(d => (
                      <span key={d} className="text-[10px] px-2 py-0.5 rounded" style={{ background: c.successBg, color: '#22c55e' }}>{d}</span>
                    ))}
                  </div>
                  <div className="text-xs mb-1" style={{ color: '#ef4444' }}>
                    {lang === 'zh' ? '凶方' : 'Unfavorable'}:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {guaInfo.unfavorable.map(d => (
                      <span key={d} className="text-[10px] px-2 py-0.5 rounded" style={{ background: c.warningBg, color: '#ef4444' }}>{d}</span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 输入表单 */}
        <div className="rounded-2xl p-6 mb-8"
          style={{ border: `1px solid ${c.cardBorder}`, background: c.cardBg }}>
          <div className="space-y-5">
            {/* 房屋类型 */}
            <div>
              <label className="text-xs tracking-wider mb-2 block" style={{ color: c.tagText }}>
                {lang === 'zh' ? '房屋类型' : 'House Type'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {HOUSE_TYPES.map(ht => (
                  <button key={ht.key} onClick={() => setHouseType(ht.key)}
                    className="text-xs px-3 py-2 rounded-lg transition-all duration-200"
                    style={{
                      border: houseType === ht.key ? `1px solid ${c.goldSolid}` : `1px solid ${c.cardBorder}`,
                      background: houseType === ht.key ? c.tabActive : 'transparent',
                      color: houseType === ht.key ? c.goldSolid : c.textMuted,
                    }}>
                    {lang === 'zh' ? ht.label_zh : ht.label_en}
                  </button>
                ))}
              </div>
            </div>

            {/* 朝向（也可在罗盘上选） */}
            <div>
              <label className="text-xs tracking-wider mb-2 block" style={{ color: c.tagText }}>
                {lang === 'zh' ? '房屋朝向（可在上方罗盘点击选择）' : 'Facing Direction (click compass above)'}
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                {BAGUA_DIRECTIONS.map(dir => (
                  <button key={dir.name} onClick={() => setFacingDirection(dir.direction)}
                    className="text-xs px-2 py-1.5 rounded-lg transition-all duration-200"
                    style={{
                      border: facingDirection === dir.direction ? `1px solid ${dir.color}` : `1px solid ${c.cardBorder}`,
                      background: facingDirection === dir.direction ? `${dir.color}15` : 'transparent',
                      color: facingDirection === dir.direction ? dir.color : c.textMuted,
                    }}>
                    <div className="font-bold" style={{ fontFamily: 'serif' }}>{dir.name}</div>
                    <div className="text-[9px]">{dir.direction}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 出生年份 + 性别 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="text-xs tracking-wider mb-2 block" style={{ color: c.tagText }}>
                  {lang === 'zh' ? '出生年份（选填，用于命卦推算）' : 'Birth Year (optional)'}
                </label>
                <input type="number" value={birthYear} onChange={e => setBirthYear(e.target.value)}
                  placeholder={lang === 'zh' ? '如：1990' : 'e.g. 1990'}
                  className="w-full px-4 py-2 rounded-lg text-sm"
                  style={{ border: `1px solid ${c.cardBorder}`, background: c.featureBg, color: c.textPrimary }} />
              </div>
              <div>
                <label className="text-xs tracking-wider mb-2 block" style={{ color: c.tagText }}>
                  {lang === 'zh' ? '性别' : 'Gender'}
                </label>
                <div className="flex gap-2">
                  <button onClick={() => setGender('male')}
                    className="text-xs px-4 py-2 rounded-lg transition-all duration-200 flex-1"
                    style={{
                      border: gender === 'male' ? `1px solid ${c.goldSolid}` : `1px solid ${c.cardBorder}`,
                      background: gender === 'male' ? c.tabActive : 'transparent',
                      color: gender === 'male' ? c.goldSolid : c.textMuted,
                    }}>
                    {lang === 'zh' ? '男' : 'Male'}
                  </button>
                  <button onClick={() => setGender('female')}
                    className="text-xs px-4 py-2 rounded-lg transition-all duration-200 flex-1"
                    style={{
                      border: gender === 'female' ? `1px solid ${c.goldSolid}` : `1px solid ${c.cardBorder}`,
                      background: gender === 'female' ? c.tabActive : 'transparent',
                      color: gender === 'female' ? c.goldSolid : c.textMuted,
                    }}>
                    {lang === 'zh' ? '女' : 'Female'}
                  </button>
                </div>
              </div>
            </div>

            {/* 房间布局描述（选填） */}
            <div>
              <label className="text-xs tracking-wider mb-2 block" style={{ color: c.tagText }}>
                {lang === 'zh' ? '房间布局描述（选填）' : 'Room Layout Description (optional)'}
              </label>
              <textarea value={roomLayout} onChange={e => setRoomLayout(e.target.value)}
                placeholder={lang === 'zh' ? '如：大门朝南，客厅在中央，卧室在东侧，厨房在西北...' : 'e.g. Main door faces south, living room in center, bedrooms on east side...'}
                rows={3}
                className="w-full px-4 py-2 rounded-lg text-sm resize-none"
                style={{ border: `1px solid ${c.cardBorder}`, background: c.featureBg, color: c.textPrimary }} />
            </div>

            {/* 错误提示 */}
            {error && (
              <div className="text-xs text-center px-4 py-2 rounded-lg" style={{ background: 'rgba(248,113,113,0.1)', color: '#f87171' }}>
                {error}
              </div>
            )}

            {/* 分析按钮 */}
            <div className="flex justify-center gap-3">
              {!streaming ? (
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={handleAnalyze}
                  className="px-10 py-3 font-medium text-sm tracking-widest rounded-full"
                  style={{ background: c.goldSolid, color: isDark ? '#08080a' : '#f8f3e8' }}>
                  {lang === 'zh' ? '开始风水分析' : 'Start Feng Shui Analysis'}
                </motion.button>
              ) : (
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={handleStop}
                  className="px-10 py-3 font-medium text-sm tracking-widest rounded-full"
                  style={{ background: 'rgba(248,113,113,0.15)', border: '1px solid rgba(248,113,113,0.4)', color: '#f87171' }}>
                  {lang === 'zh' ? '停止生成' : 'Stop'}
                </motion.button>
              )}
            </div>
          </div>
        </div>

        {/* 分析结果 */}
        <AnimatePresence>
          {analysis && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl p-6 mb-8"
              style={{ border: `1px solid ${c.goldLine}`, background: c.featureBg }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <BaguaDiagram size={32} color={c.goldSolid} opacity={0.8} />
                  <span className="text-xs tracking-wider" style={{ color: c.goldSolid }}>
                    {lang === 'zh' ? '风水分析结果' : 'Feng Shui Analysis Result'}
                  </span>
                </div>
                {!streaming && (
                  <button onClick={handleReset}
                    className="text-xs px-3 py-1 rounded-full"
                    style={{ border: `1px solid ${c.cardBorder}`, color: c.textMuted }}>
                    {lang === 'zh' ? '重新分析' : 'Re-analyze'}
                  </button>
                )}
              </div>
              <div className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: c.textSecond }}>
                {analysis}
                {streaming && (
                  <span className="inline-block w-2 h-4 ml-0.5 animate-pulse" style={{ background: c.goldSolid }} />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 底部装饰 */}
        <div className="text-center py-8">
          <DiamondDivider color={c.goldSolid} opacity={0.3} className="mb-4" />
          <p className="text-[10px]" style={{ color: c.textFaint }}>
            {lang === 'zh' ? '风水之道，在乎乘生气、避煞气，阴阳调和，五行相生' : 'The way of Feng Shui lies in capturing vital energy, avoiding harmful energy, harmonizing Yin and Yang, generating Five Elements'}
          </p>
        </div>
      </div>
    </div>
  );
}