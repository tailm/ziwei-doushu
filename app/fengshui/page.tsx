'use client';
import { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '@/lib/i18n/LanguageContext';
import { useTheme } from '@/components/ThemeProvider';
import { TaijiDiagram, BaguaDiagram, DiamondDivider, FloatingStars } from '@/components/Decorations';
import NavigationBar from '@/components/NavigationBar';
import SiteFooter from '@/components/SiteFooter';
import InsufficientCredits from '@/components/InsufficientCredits';

const BAGUA_DIRECTIONS = [
  { name: '乾', symbol: '☰', direction: '西北', element: '金', attribute: '天·父·君', degrees: '315°-345°', color: '#d4a843', angle: 330,
    body: '头·首', season: '秋冬', family: '父亲', nature: '天', virtue: '健' },
  { name: '坎', symbol: '☵', direction: '正北', element: '水', attribute: '水·中男·险', degrees: '0°-30°', color: '#3b82f6', angle: 0,
    body: '耳·血', season: '冬', family: '中男', nature: '水', virtue: '陷' },
  { name: '艮', symbol: '☶', direction: '东北', element: '土', attribute: '山·少男·止', degrees: '45°-75°', color: '#a855f7', angle: 60,
    body: '手·指', season: '冬春', family: '少男', nature: '山', virtue: '止' },
  { name: '震', symbol: '☳', direction: '正东', element: '木', attribute: '雷·长男·动', degrees: '90°-120°', color: '#22c55e', angle: 90,
    body: '足·腿', season: '春', family: '长男', nature: '雷', virtue: '动' },
  { name: '巽', symbol: '☴', direction: '东南', element: '木', attribute: '风·长女·入', degrees: '135°-165°', color: '#06b6d4', angle: 135,
    body: '股·胆', season: '春夏', family: '长女', nature: '风', virtue: '入' },
  { name: '离', symbol: '☲', direction: '正南', element: '火', attribute: '火·中女·明', degrees: '180°-210°', color: '#ef4444', angle: 180,
    body: '目·心', season: '夏', family: '中女', nature: '火', virtue: '丽' },
  { name: '坤', symbol: '☷', direction: '西南', element: '土', attribute: '地·母·顺', degrees: '225°-255°', color: '#f59e0b', angle: 240,
    body: '腹·脾', season: '夏秋', family: '母亲', nature: '地', virtue: '顺' },
  { name: '兑', symbol: '☱', direction: '正西', element: '金', attribute: '泽·少女·悦', degrees: '270°-300°', color: '#ec4899', angle: 270,
    body: '口·舌', season: '秋', family: '少女', nature: '泽', virtue: '悦' },
];

const HOUSE_TYPES = [
  { key: 'apartment', label_zh: '公寓/楼房', label_en: 'Apartment' },
  { key: 'house', label_zh: '独栋住宅', label_en: 'House' },
  { key: 'office', label_zh: '办公室', label_en: 'Office' },
  { key: 'shop', label_zh: '商铺', label_en: 'Shop' },
  { key: 'tomb', label_zh: '阴宅/墓地', label_en: 'Tomb/Cemetery' },
  { key: 'factory', label_zh: '工厂/企业', label_en: 'Factory/Enterprise' },
  { key: 'hotel', label_zh: '酒店/餐饮', label_en: 'Hotel/Restaurant' },
  { key: 'school', label_zh: '学校/教育', label_en: 'School/Education' },
];

const UNIT_TYPES = [
  { key: 'east', label_zh: '东边户', label_en: 'East Unit', element: '木', color: '#22c55e', desc_zh: '东侧采光，朝气旺盛', desc_en: 'East light, vital energy' },
  { key: 'west', label_zh: '西边户', label_en: 'West Unit', element: '金', color: '#d4a843', desc_zh: '西侧采光，下午阳光强', desc_en: 'West light, strong afternoon sun' },
  { key: 'south', label_zh: '南边户', label_en: 'South Unit', element: '火', color: '#ef4444', desc_zh: '南侧采光，阳气最旺', desc_en: 'South light, strongest Yang' },
  { key: 'north', label_zh: '北边户', label_en: 'North Unit', element: '水', color: '#3b82f6', desc_zh: '北侧采光弱，阴气较重', desc_en: 'North light, heavier Yin' },
  { key: 'middle', label_zh: '中间户型', label_en: 'Middle Unit', element: '土', color: '#f59e0b', desc_zh: '两侧不采光，气场稳定但通风差', desc_en: 'No side light, stable but poor ventilation' },
];

const FIVE_ELEMENTS = [
  { name: '金', color: '#d4a843', direction: '西/西北', attribute: '收敛·肃杀', generates: '水', destroys: '木', destroyedBy: '火' },
  { name: '木', color: '#22c55e', direction: '东/东南', attribute: '生长·舒展', generates: '火', destroys: '土', destroyedBy: '金' },
  { name: '水', color: '#3b82f6', direction: '北', attribute: '润下·流动', generates: '木', destroys: '火', destroyedBy: '土' },
  { name: '火', color: '#ef4444', direction: '南', attribute: '炎上·光明', generates: '土', destroys: '金', destroyedBy: '水' },
  { name: '土', color: '#f59e0b', direction: '中/东北/西南', attribute: '承载·化育', generates: '金', destroys: '水', destroyedBy: '木' },
];

const FLOOR_ELEMENTS = [
  { suffix: '1/6', element: '水', color: '#3b82f6', label_zh: '尾数1/6层', label_en: 'Floors ending 1/6' },
  { suffix: '2/7', element: '火', color: '#ef4444', label_zh: '尾数2/7层', label_en: 'Floors ending 2/7' },
  { suffix: '3/8', element: '木', color: '#22c55e', label_zh: '尾数3/8层', label_en: 'Floors ending 3/8' },
  { suffix: '4/9', element: '金', color: '#d4a843', label_zh: '尾数4/9层', label_en: 'Floors ending 4/9' },
  { suffix: '5/0', element: '土', color: '#f59e0b', label_zh: '尾数5/0层', label_en: 'Floors ending 5/0' },
];

const SURROUNDINGS = [
  { key: 'hospital', label_zh: '医院', label_en: 'Hospital', icon: '🏥', impact_zh: '阴气重', impact_en: 'Heavy Yin' },
  { key: 'temple', label_zh: '寺庙/教堂', label_en: 'Temple', icon: '⛩', impact_zh: '气场特殊', impact_en: 'Special Qi' },
  { key: 'river', label_zh: '河流/水池', label_en: 'River', icon: '🌊', impact_zh: '主财，位置重要', impact_en: 'Wealth, position matters' },
  { key: 'highrise', label_zh: '高楼/高架', label_en: 'High-rise', icon: '🏢', impact_zh: '压迫感', impact_en: 'Oppression' },
  { key: 'park', label_zh: '公园/绿地', label_en: 'Park', icon: '🌳', impact_zh: '生气旺', impact_en: 'Vital Qi' },
  { key: 'cemetery', label_zh: '墓地/殡仪馆', label_en: 'Cemetery', icon: '⚰', impact_zh: '阴气极重', impact_en: 'Extreme Yin' },
  { key: 'school', label_zh: '学校', label_en: 'School', icon: '📚', impact_zh: '阳气旺但噪音', impact_en: 'Yang but noise' },
  { key: 'market', label_zh: '市场/商业街', label_en: 'Market', icon: '🏪', impact_zh: '喧闹', impact_en: 'Noisy' },
  { key: 'crossroad', label_zh: '十字路口', label_en: 'Crossroad', icon: '🚦', impact_zh: '气场混乱', impact_en: 'Chaotic Qi' },
  { key: 'railway', label_zh: '铁路/地铁', label_en: 'Railway', icon: '🚇', impact_zh: '动气振动', impact_en: 'Movement Qi' },
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

function getFloorElement(floorNum: number) {
  const lastDigit = floorNum % 10;
  if (lastDigit === 1 || lastDigit === 6) return FLOOR_ELEMENTS[0];
  if (lastDigit === 2 || lastDigit === 7) return FLOOR_ELEMENTS[1];
  if (lastDigit === 3 || lastDigit === 8) return FLOOR_ELEMENTS[2];
  if (lastDigit === 4 || lastDigit === 9) return FLOOR_ELEMENTS[3];
  return FLOOR_ELEMENTS[4];
}

function renderMarkdown(text: string, colors: any): React.ReactNode {
  const lines = text.split('\n');
  const result: React.ReactNode[] = [];
  let listItems: React.ReactNode[] = [];
  let listKey = 0;

  const flushList = () => {
    if (listItems.length > 0) {
      result.push(
        <ul key={`list-${listKey++}`} className="space-y-1 my-2 pl-4">
          {listItems}
        </ul>
      );
      listItems = [];
    }
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    if (trimmed.startsWith('## ')) {
      flushList();
      const headerText = trimmed.slice(3);
      result.push(
        <div key={`h2-${idx}`} className="flex items-center gap-2 mt-4 mb-2">
          <span className="w-1 h-4 rounded" style={{ background: colors.goldSolid }} />
          <h3 className="text-sm font-bold tracking-wide" style={{ color: colors.goldSolid }}>{headerText}</h3>
    </div>
      );
    } else if (trimmed.startsWith('# ')) {
      flushList();
      result.push(
        <h2 key={`h1-${idx}`} className="text-base font-bold mt-4 mb-2" style={{ color: colors.goldSolid }}>
          {trimmed.slice(2)}
        </h2>
      );
    } else if (trimmed.startsWith('### ')) {
      flushList();
      result.push(
        <h4 key={`h3-${idx}`} className="text-xs font-bold mt-3 mb-1" style={{ color: colors.textPrimary }}>
          {trimmed.slice(4)}
        </h4>
      );
    } else if (trimmed.match(/^[-*] /)) {
      const content = trimmed.replace(/^[-*] /, '');
      listItems.push(
        <li key={`li-${idx}`} className="text-sm leading-relaxed flex items-start gap-2" style={{ color: colors.textSecond }}>
          <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0" style={{ background: colors.goldSolid, opacity: 0.6 }} />
          <span>{renderInline(content, colors)}</span>
        </li>
      );
    } else if (trimmed.match(/^\d+\./)) {
      const content = trimmed.replace(/^\d+\.\s*/, '');
      const num = trimmed.match(/^(\d+)\./)?.[1] || '';
      listItems.push(
        <li key={`ol-${idx}`} className="text-sm leading-relaxed flex items-start gap-2" style={{ color: colors.textSecond }}>
          <span className="text-xs font-bold flex-shrink-0" style={{ color: colors.goldSolid }}>{num}.</span>
          <span>{renderInline(content, colors)}</span>
        </li>
      );
    } else if (trimmed === '') {
      flushList();
    } else {
      flushList();
      result.push(
        <p key={`p-${idx}`} className="text-sm leading-relaxed my-1" style={{ color: colors.textSecond }}>
          {renderInline(trimmed, colors)}
        </p>
      );
    }
  });

  flushList();
  return result;
}

function renderInline(text: string, colors: any): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const regex = /\*\*(.+?)\*\*/g;
  let lastIndex = 0;
  let match;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(
      <strong key={`b-${key++}`} style={{ color: colors.goldSolid, fontWeight: 600 }}>
        {match[1]}
      </strong>
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}

function BaguaCompass({ selectedDirection, onSelect, colors }: {
  selectedDirection: string;
  onSelect: (dir: string) => void;
  colors: any;
}) {
  const radius = 140;
  const center = 160;
  const labelRadius = 105;
  const symbolRadius = 135;

  return (
    <svg width="320" height="320" viewBox="0 0 320 320" className="mx-auto">
      {Array.from({ length: 72 }).map((_, i) => {
        const tickAngle = i * 5;
        const isMajor = i % 9 === 0;
        const tickRad = (tickAngle - 90) * Math.PI / 180;
        const innerR = isMajor ? radius - 8 : radius - 4;
        const outerR = radius;
        const x1 = Math.round((center + innerR * Math.cos(tickRad)) * 100) / 100;
        const y1 = Math.round((center + innerR * Math.sin(tickRad)) * 100) / 100;
        const x2 = Math.round((center + outerR * Math.cos(tickRad)) * 100) / 100;
        const y2 = Math.round((center + outerR * Math.sin(tickRad)) * 100) / 100;
        return (
          <line key={`tick-${i}`} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={colors.goldLine} strokeWidth={isMajor ? 1 : 0.5}
            opacity={isMajor ? 0.4 : 0.15} />
        );
      })}

      <circle cx={center} cy={center} r={radius} fill="none" stroke={colors.goldLine} strokeWidth="1" opacity={0.3} />
      <circle cx={center} cy={center} r={radius - 20} fill="none" stroke={colors.goldLine} strokeWidth="0.5" opacity={0.2} />
      <circle cx={center} cy={center} r={labelRadius + 25} fill="none" stroke={colors.goldLine} strokeWidth="0.5" opacity={0.15} />

      {BAGUA_DIRECTIONS.map(dir => {
        const rad = (dir.angle - 90) * Math.PI / 180;
        const x = Math.round((center + symbolRadius * Math.cos(rad)) * 100) / 100;
        const y = Math.round((center + symbolRadius * Math.sin(rad)) * 100) / 100;
        const isSelected = selectedDirection === dir.direction;
        return (
          <text key={`sym-${dir.name}`} x={x} y={y + 3} textAnchor="middle" fontSize="12"
            fill={isSelected ? dir.color : colors.goldSolid}
            opacity={isSelected ? 0.9 : 0.4}
            fontFamily="serif" fontWeight="bold">
            {dir.symbol}
          </text>
        );
      })}

      {BAGUA_DIRECTIONS.map(dir => {
        const rad = (dir.angle - 90) * Math.PI / 180;
        const x = Math.round((center + labelRadius * Math.cos(rad)) * 100) / 100;
        const y = Math.round((center + labelRadius * Math.sin(rad)) * 100) / 100;
        const isSelected = selectedDirection === dir.direction;
        const innerR = isSelected ? 26 : 20;
        return (
          <g key={dir.name} onClick={() => onSelect(dir.direction)} style={{ cursor: 'pointer' }}>
            {isSelected && (
              <circle cx={x} cy={y} r={innerR + 4} fill="none" stroke={dir.color}
                strokeWidth="1" opacity={0.3}>
                <animate attributeName="r" values={`${innerR + 2};${innerR + 6};${innerR + 2}`}
                  dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.4;0.1;0.4"
                  dur="2s" repeatCount="indefinite" />
              </circle>
            )}
            <circle cx={x} cy={y} r={innerR}
              fill={isSelected ? dir.color : `${dir.color}15`}
              stroke={dir.color}
              strokeWidth={isSelected ? 2 : 1}
              opacity={isSelected ? 0.9 : 0.5} />
            <text x={x} y={y - 1} textAnchor="middle" fontSize="13" fontWeight="bold"
              fill={isSelected ? '#fff' : dir.color} fontFamily="serif">{dir.name}</text>
            <text x={x} y={y + 9} textAnchor="middle" fontSize="6"
              fill={isSelected ? '#fff' : colors.textFaint}>{dir.direction}</text>
          </g>
        );
      })}

      <circle cx={center} cy={center} r="24" fill="none" stroke={colors.goldSolid} strokeWidth="1.5" opacity={0.4} />
      <text x={center} y={center - 1} textAnchor="middle" fontSize="9" fill={colors.goldSolid} opacity={0.6} fontFamily="serif">太极</text>
      <text x={center} y={center + 9} textAnchor="middle" fontSize="5" fill={colors.goldSolid} opacity={0.4}>中心</text>
    </svg>
  );
}

function FiveElementCycle({ colors, selectedElement, onSelectElement, highlightedElement }: {
  colors: any;
  selectedElement: string | null;
  onSelectElement: (name: string | null) => void;
  highlightedElement?: string | null;
}) {
  const elements = [
    { name: '金', color: '#d4a843', angle: -90 },
    { name: '水', color: '#3b82f6', angle: -18 },
    { name: '木', color: '#22c55e', angle: 54 },
    { name: '火', color: '#ef4444', angle: 126 },
    { name: '土', color: '#f59e0b', angle: 198 },
  ];

  const destroyPairs: [number, number][] = [
    [0, 2], [2, 4], [4, 1], [1, 3], [3, 0],
  ];

  const r = 70;
  const cx = 100;
  const cy = 100;

  const activeElement = selectedElement || highlightedElement;
  const isElementActive = (name: string) => activeElement === name;
  const isGenArrowActive = (fromIdx: number) => {
    if (!activeElement) return false;
    return elements[fromIdx].name === activeElement;
  };
  const isDestArrowActive = (fromIdx: number, toIdx: number) => {
    if (!activeElement) return false;
    return elements[fromIdx].name === activeElement || elements[toIdx].name === activeElement;
  };

  return (
    <svg width="200" height="200" viewBox="0 0 200 200" className="mx-auto">
      <defs>
        <marker id="arrow-gen" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill={colors.goldSolid} opacity={0.6} />
        </marker>
        <marker id="arrow-dest" markerWidth="5" markerHeight="5" refX="4.5" refY="2.5" orient="auto">
          <path d="M0,0 L5,2.5 L0,5 Z" fill="#ef4444" opacity={0.5} />
        </marker>
      </defs>

      {elements.map((el, i) => {
        const next = elements[(i + 1) % 5];
        const rad = el.angle * Math.PI / 180;
        const nextRad = next.angle * Math.PI / 180;
        const x1 = Math.round((cx + r * Math.cos(rad)) * 100) / 100;
        const y1 = Math.round((cy + r * Math.sin(rad)) * 100) / 100;
        const x2 = Math.round((cx + r * Math.cos(nextRad)) * 100) / 100;
        const y2 = Math.round((cy + r * Math.sin(nextRad)) * 100) / 100;
        const active = isGenArrowActive(i);
        return (
          <path key={`gen-${el.name}`} d={`M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`}
            fill="none" stroke={active ? el.color : colors.goldSolid}
            strokeWidth={active ? 2.5 : 1.5}
            opacity={activeElement ? (active ? 0.8 : 0.15) : 0.4}
            markerEnd="url(#arrow-gen)" />
        );
      })}

      {destroyPairs.map(([fromIdx, toIdx], pairIdx) => {
        const fromEl = elements[fromIdx];
        const toEl = elements[toIdx];
        const fromRad = fromEl.angle * Math.PI / 180;
        const toRad = toEl.angle * Math.PI / 180;
        const fromR = r - 28;
        const toR = r - 28;
        const x1 = Math.round((cx + fromR * Math.cos(fromRad)) * 100) / 100;
        const y1 = Math.round((cy + fromR * Math.sin(fromRad)) * 100) / 100;
        const x2 = Math.round((cx + toR * Math.cos(toRad)) * 100) / 100;
        const y2 = Math.round((cy + toR * Math.sin(toRad)) * 100) / 100;
        const active = isDestArrowActive(fromIdx, toIdx);
        return (
          <line key={`dest-${pairIdx}`} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="#ef4444" strokeWidth={active ? 2 : 1}
            strokeDasharray="3 2"
            opacity={activeElement ? (active ? 0.6 : 0.08) : 0.25}
            markerEnd="url(#arrow-dest)" />
        );
      })}

      {elements.map(el => {
        const rad = el.angle * Math.PI / 180;
        const x = Math.round((cx + r * Math.cos(rad)) * 100) / 100;
        const y = Math.round((cy + r * Math.sin(rad)) * 100) / 100;
        const active = isElementActive(el.name);
        return (
          <g key={el.name} onClick={() => onSelectElement(active ? null : el.name)} style={{ cursor: 'pointer' }}>
            <circle cx={x} cy={y} r={active ? 20 : 18}
              fill={`${el.color}${active ? '30' : '20'}`}
              stroke={el.color} strokeWidth={active ? 2.5 : 1.5} />
            <text x={x} y={y + 4} textAnchor="middle" fontSize="12" fontWeight="bold"
              fill={el.color} fontFamily="serif">{el.name}</text>
          </g>
        );
      })}

      <circle cx={cx} cy={cy} r="18" fill="none" stroke={colors.goldSolid} strokeWidth="0.5" opacity={0.2} />
      <text x={cx} y={cy - 2} textAnchor="middle" fontSize="7" fill={colors.goldSolid} opacity={0.4}>相生</text>
      <text x={cx} y={cy + 7} textAnchor="middle" fontSize="7" fill="#ef4444" opacity={0.3}>相克</text>
    </svg>
  );
}

function BaguaDetailCard({ dir, colors, lang }: { dir: typeof BAGUA_DIRECTIONS[0]; colors: any; lang: 'zh' | 'en' }) {
  const items = lang === 'zh' ? [
    { label: '卦象', value: `${dir.symbol} ${dir.name}` },
    { label: '方位', value: dir.direction },
    { label: '五行', value: dir.element },
    { label: '属性', value: dir.attribute },
    { label: '自然', value: dir.nature },
    { label: '人物', value: dir.family },
    { label: '身体', value: dir.body },
    { label: '季节', value: dir.season },
    { label: '德性', value: dir.virtue },
  ] : [
    { label: 'Symbol', value: `${dir.symbol} ${dir.name}` },
    { label: 'Direction', value: dir.direction },
    { label: 'Element', value: dir.element },
    { label: 'Attribute', value: dir.attribute },
    { label: 'Nature', value: dir.nature },
    { label: 'Family', value: dir.family },
    { label: 'Body', value: dir.body },
    { label: 'Season', value: dir.season },
    { label: 'Virtue', value: dir.virtue },
  ];

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      className="rounded-xl p-4"
      style={{ border: `1px solid ${dir.color}30`, background: `${dir.color}06` }}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl" style={{ color: dir.color, fontFamily: 'serif' }}>{dir.symbol}</span>
        <span className="text-lg font-bold" style={{ color: dir.color, fontFamily: 'serif' }}>{dir.name}</span>
        <span className="text-xs" style={{ color: colors.textMuted }}>{dir.direction}</span>
    </div>
      <div className="grid grid-cols-3 gap-2">
        {items.map(item => (
          <div key={item.label} className="text-center">
            <div className="text-[9px] tracking-wider mb-0.5" style={{ color: colors.tagText }}>{item.label}</div>
            <div className="text-[10px] font-medium" style={{ color: colors.textPrimary }}>{item.value}</div>
    </div>
        ))}
    </div>
    </motion.div>
  );
}

function UnitTypeDiagram({ selectedUnit, onSelect, colors }: {
  selectedUnit: string;
  onSelect: (key: string) => void;
  colors: any;
}) {
  const w = 200;
  const h = 200;
  const pad = 20;
  const unitW = 50;
  const unitH = 40;

  const units = [
    { key: 'north', x: w / 2 - unitW / 2, y: pad, color: '#3b82f6', label: '北' },
    { key: 'west', x: pad, y: h / 2 - unitH / 2, color: '#d4a843', label: '西' },
    { key: 'middle', x: w / 2 - unitW / 2, y: h / 2 - unitH / 2, color: '#f59e0b', label: '中' },
    { key: 'east', x: w - pad - unitW, y: h / 2 - unitH / 2, color: '#22c55e', label: '东' },
    { key: 'south', x: w / 2 - unitW / 2, y: h - pad - unitH, color: '#ef4444', label: '南' },
  ];

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="mx-auto">
      {/* 外框（楼栋轮廓） */}
      <rect x={pad - 4} y={pad - 4} width={w - 2 * pad + 8} height={h - 2 * pad + 8}
        fill="none" stroke={colors.goldLine} strokeWidth="1" opacity={0.3} rx="4" />

      {/* 方位标注 */}
      <text x={w / 2} y={pad - 8} textAnchor="middle" fontSize="8" fill={colors.textFaint}>N</text>
      <text x={w / 2} y={h - pad + unitH + 12} textAnchor="middle" fontSize="8" fill={colors.textFaint}>S</text>
      <text x={pad - 10} y={h / 2 + 3} textAnchor="middle" fontSize="8" fill={colors.textFaint}>W</text>
      <text x={w - pad + 10} y={h / 2 + 3} textAnchor="middle" fontSize="8" fill={colors.textFaint}>E</text>

      {units.map(u => {
        const isSelected = selectedUnit === u.key;
        return (
          <g key={u.key} onClick={() => onSelect(u.key)} style={{ cursor: 'pointer' }}>
            <rect x={u.x} y={u.y} width={unitW} height={unitH} rx="3"
              fill={isSelected ? `${u.color}30` : `${u.color}08`}
              stroke={isSelected ? u.color : `${u.color}40`}
              strokeWidth={isSelected ? 2 : 1}
              opacity={isSelected ? 0.9 : 0.5} />
            <text x={u.x + unitW / 2} y={u.y + unitH / 2 + 4} textAnchor="middle"
              fontSize="12" fontWeight="bold"
              fill={isSelected ? u.color : colors.textMuted}
              fontFamily="serif">{u.label}</text>
          </g>
        );
      })}
    </svg>
  );
}

function KnowledgeSection({ colors, lang }: { colors: any; lang: 'zh' | 'en' }) {
  const [expanded, setExpanded] = useState<string | null>(null);

  const sections = lang === 'zh' ? [
    {
      key: 'yinyang',
      title: '阴阳理论',
      icon: '☯',
      brief: '阴阳是风水的基础——万物皆有阴阳两面，阴阳调和则吉，阴阳失衡则凶。',
      detail: '阳代表光明、活跃、温暖、上升；阴代表黑暗、静止、寒冷、下降。住宅风水中，采光充足为阳，阴暗潮湿为阴；动静分区合理即阴阳调和。卧室宜阴（安静），客厅宜阳（明亮）。',
    },
    {
      key: 'wuxing',
      title: '五行理论',
      icon: '五行',
      brief: '金木水火土五种元素相生相克，构成万物运行的基本规律。',
      detail: '相生：金生水、水生木、木生火、火生土、土生金——循环不息。相克：金克木、木克土、土克水、水克火、火克金——制约平衡。风水中，房屋朝向、楼层、颜色、材质都与五行相关。',
    },
    {
      key: 'bagua',
      title: '八卦方位',
      icon: '☰',
      brief: '八卦对应八个方位，每个方位有不同的五行属性和象征意义。',
      detail: '乾(西北/金)、坎(正北/水)、艮(东北/土)、震(正东/木)、巽(东南/木)、离(正南/火)、坤(西南/土)、兑(正西/金)。每个方位对应家中不同成员和身体部位，布局需兼顾各方。',
    },
    {
      key: 'fangwei',
      title: '方位原则',
      icon: '方位',
      brief: '房屋朝向决定整体风水格局，门、主、灶是三大关键。',
      detail: '大门是气口，决定纳气方向；主卧是核心，影响主人运势；厨房是火位，不宜在乾宫(西北)。东四命宜住东四宅(坐北朝南、坐东朝西等)，西四命宜住西四宅(坐西朝东、坐西北朝东南等)。',
    },
  ] : [
    {
      key: 'yinyang',
      title: 'Yin-Yang Theory',
      icon: '☯',
      brief: 'Yin-Yang is the foundation of Feng Shui — all things have two aspects, harmony brings fortune, imbalance brings misfortune.',
      detail: 'Yang represents light, activity, warmth, ascent; Yin represents darkness, stillness, cold, descent. In residential Feng Shui, good lighting is Yang, dampness is Yin. Proper zoning of active and quiet areas achieves Yin-Yang harmony.',
    },
    {
      key: 'wuxing',
      title: 'Five Elements',
      icon: 'Wu',
      brief: 'Metal, Wood, Water, Fire, Earth — five elements that generate and control each other.',
      detail: 'Generation: Metal→Water→Wood→Fire→Earth→Metal. Destruction: Metal→Wood→Earth→Water→Fire→Metal. House direction, floor, color, and material all relate to Five Elements.',
    },
    {
      key: 'bagua',
      title: 'Bagua Directions',
      icon: '☰',
      brief: 'Eight trigrams correspond to eight directions, each with different elemental attributes and symbolism.',
      detail: 'Qian(NW/Metal), Kan(N/Water), Gen(NE/Earth), Zhen(E/Wood), Xun(SE/Wood), Li(S/Fire), Kun(SW/Earth), Dui(W/Metal). Each direction corresponds to different family members and body parts.',
    },
    {
      key: 'fangwei',
      title: 'Direction Principles',
      icon: 'Dir',
      brief: 'House facing determines overall Feng Shui pattern. Door, master bedroom, and kitchen are three key areas.',
      detail: 'The main door is the Qi entrance; the master bedroom affects the owner\'s fortune; the kitchen (fire position) should not be in Qian (NW). East Four Gua people should live in East Four houses, West Four Gua people in West Four houses.',
    },
  ];

  return (
    <div className="mb-8">
      <div className="text-center mb-4">
        <span className="text-[10px] tracking-[0.3em]" style={{ color: colors.tagText }}>
          {lang === 'zh' ? '风水基础知识 · 点击展开' : 'Feng Shui Basics · Click to Expand'}
        </span>
    </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {sections.map(sec => (
          <div key={sec.key}
            onClick={() => setExpanded(expanded === sec.key ? null : sec.key)}
            className="rounded-xl p-3 transition-all duration-200 cursor-pointer"
            style={{
              border: expanded === sec.key ? `1px solid ${colors.goldSolid}` : `1px solid ${colors.cardBorder}`,
              background: expanded === sec.key ? colors.tabActive : colors.featureBg,
            }}>
            <div className="text-center mb-2">
              <span className="text-lg font-bold" style={{ color: colors.goldSolid, fontFamily: 'serif' }}>{sec.icon}</span>
    </div>
            <div className="text-xs font-bold text-center mb-1" style={{ color: expanded === sec.key ? colors.goldSolid : colors.textPrimary }}>
              {sec.title}
    </div>
            <div className="text-[10px] leading-relaxed text-center" style={{ color: colors.textMuted }}>
              {sec.brief}
    </div>
    </div>
        ))}
    </div>
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="mt-3">
            {sections.filter(s => s.key === expanded).map(s => (
              <div key={s.key} className="rounded-xl p-4"
                style={{ border: `1px solid ${colors.goldLine}`, background: colors.cardBg }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-base font-bold" style={{ color: colors.goldSolid, fontFamily: 'serif' }}>{s.icon}</span>
                  <span className="text-sm font-bold" style={{ color: colors.goldSolid }}>{s.title}</span>
    </div>
                <p className="text-sm leading-relaxed" style={{ color: colors.textSecond }}>{s.detail}</p>
    </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
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
  const [floor, setFloor] = useState('');
  const [unitType, setUnitType] = useState('');
  const [surroundings, setSurroundings] = useState<string[]>([]);
  const [roomLayout, setRoomLayout] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState('');
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [expandedBagua, setExpandedBagua] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const mingGua = useMemo(() => {
    if (!birthYear) return null;
    const year = parseInt(birthYear);
    if (isNaN(year)) return null;
    return calcMingGua(year, gender);
  }, [birthYear, gender]);

  const guaInfo = mingGua ? GUA_MAP[mingGua] : null;
  const selectedBagua = BAGUA_DIRECTIONS.find(d => d.direction === facingDirection);
  const expandedBaguaData = BAGUA_DIRECTIONS.find(d => d.name === expandedBagua);
  const floorElement = floor ? getFloorElement(parseInt(floor)) : null;

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
          floor: floor || undefined,
          unitType: unitType || undefined,
          surroundings: surroundings.length > 0 ? surroundings : undefined,
          roomLayout: roomLayout || undefined,
          lang,
        }),
        signal: abortController.signal,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || errData.error || `HTTP ${response.status}`);
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

  const toggleSurrounding = (key: string) => {
    setSurroundings(prev => prev.includes(key) ? prev.filter(s => s !== key) : [...prev, key]);
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
              ? '结合道家阴阳五行与八卦方位理论，分析住宅风水格局，提供方位吉凶、五行生克、楼层属性、周边环境、布局建议等深度解读。'
              : 'Based on Daoist Yin-Yang, Five Elements and Bagua direction theory, analyze residential Feng Shui for directional fortune, elemental interactions, floor attributes, surroundings, and layout recommendations.'}
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
                  <div className="flex items-center gap-2">
                    <span className="text-2xl" style={{ color: selectedBagua.color, fontFamily: 'serif' }}>
                      {selectedBagua.symbol}
                    </span>
                    <div className="text-3xl font-bold" style={{ color: selectedBagua.color, fontFamily: 'serif' }}>
                      {selectedBagua.name}
    </div>
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

        {/* 五行相生相克图 + 五行方位 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <div>
            <div className="text-center mb-3">
              <span className="text-[10px] tracking-[0.3em]" style={{ color: c.tagText }}>
                {lang === 'zh' ? '五行相生相克 · 点击高亮' : 'Five Elements · Click to Highlight'}
              </span>
    </div>
            <FiveElementCycle colors={c} selectedElement={selectedElement} onSelectElement={setSelectedElement}
              highlightedElement={unitType ? UNIT_TYPES.find(ut => ut.key === unitType)?.element ?? null : null} />
            <div className="text-center mt-2 space-y-1">
              <div className="text-[10px]" style={{ color: c.goldSolid, opacity: 0.6 }}>
                {lang === 'zh' ? '━━ 相生（金生水·水生木·木生火·火生土·土生金）' : '━━ Generation cycle'}
    </div>
              <div className="text-[10px]" style={{ color: '#ef4444', opacity: 0.5 }}>
                {lang === 'zh' ? '╌╌ 相克（金克木·木克土·土克水·水克火·火克金）' : '╌╌ Destruction cycle'}
    </div>
    </div>
    </div>
          <div>
            <div className="text-center mb-3">
              <span className="text-[10px] tracking-[0.3em]" style={{ color: c.tagText }}>
                {lang === 'zh' ? '五行方位属性' : 'Five Elements Directions'}
              </span>
    </div>
            <div className="space-y-2">
              {FIVE_ELEMENTS.map(el => {
                const isActive = selectedElement === el.name;
                const isRelated = selectedElement && (
                  el.generates === selectedElement || el.destroys === selectedElement ||
                  el.destroyedBy === selectedElement || el.name === selectedElement
                );
                return (
                  <div key={el.name}
                    onClick={() => setSelectedElement(isActive ? null : el.name)}
                    className="rounded-lg p-2.5 flex items-center gap-3 transition-all duration-200"
                    style={{
                      border: `1px solid ${isActive ? el.color : `${el.color}25`}`,
                      background: isActive ? `${el.color}12` : `${el.color}06`,
                      cursor: 'pointer',
                      opacity: selectedElement && !isRelated ? 0.4 : 1,
                    }}>
                    <div className="text-lg font-bold w-8 text-center" style={{ color: el.color, fontFamily: 'serif' }}>{el.name}</div>
                    <div className="flex-1">
                      <div className="text-xs" style={{ color: c.textMuted }}>{el.direction}</div>
                      <div className="text-[10px]" style={{ color: el.color }}>{el.attribute}</div>
    </div>
                    <div className="text-[10px] text-right space-y-0.5">
                      <div style={{ color: c.goldSolid, opacity: 0.7 }}>
                        {lang === 'zh' ? `生 ${el.generates}` : `→ ${el.generates}`}
    </div>
                      <div style={{ color: '#ef4444', opacity: 0.6 }}>
                        {lang === 'zh' ? `克 ${el.destroys}` : `✕ ${el.destroys}`}
    </div>
    </div>
    </div>
                );
              })}
    </div>
    </div>
    </div>

        {/* 八卦详解 */}
        <div className="mb-8">
          <div className="text-center mb-4">
            <span className="text-[10px] tracking-[0.3em]" style={{ color: c.tagText }}>
              {lang === 'zh' ? '八卦详解 · 点击展开' : 'Bagua Details · Click to Expand'}
            </span>
    </div>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 mb-4">
            {BAGUA_DIRECTIONS.map(dir => (
              <button key={dir.name} onClick={() => setExpandedBagua(expandedBagua === dir.name ? null : dir.name)}
                className="rounded-lg p-2 transition-all duration-200 text-center"
                style={{
                  border: expandedBagua === dir.name ? `1px solid ${dir.color}` : `1px solid ${c.cardBorder}`,
                  background: expandedBagua === dir.name ? `${dir.color}12` : 'transparent',
                }}>
                <div className="text-base" style={{ color: dir.color, fontFamily: 'serif' }}>{dir.symbol}</div>
                <div className="text-xs font-bold" style={{ color: expandedBagua === dir.name ? dir.color : c.textMuted, fontFamily: 'serif' }}>{dir.name}</div>
                <div className="text-[8px]" style={{ color: c.textFaint }}>{dir.direction}</div>
              </button>
            ))}
    </div>
          <AnimatePresence>
            {expandedBaguaData && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                <BaguaDetailCard dir={expandedBaguaData} colors={c} lang={lang} />
              </motion.div>
            )}
          </AnimatePresence>
    </div>

        {/* 风水基础知识科普 */}
        <KnowledgeSection colors={c} lang={lang} />

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

          {/* 分组1：基本信息 */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-1 h-3 rounded" style={{ background: c.goldSolid }} />
              <span className="text-xs font-bold tracking-wider" style={{ color: c.goldSolid }}>
                {lang === 'zh' ? '基本信息' : 'Basic Info'}
              </span>
    </div>

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

              {/* 朝向 */}
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
                      <div className="font-bold" style={{ fontFamily: 'serif' }}>{dir.symbol} {dir.name}</div>
                      <div className="text-[9px]">{dir.direction}</div>
                    </button>
                  ))}
    </div>
    </div>

              {/* 户型 + 平面图 */}
              <div>
                <label className="text-xs tracking-wider mb-2 block" style={{ color: c.tagText }}>
                  {lang === 'zh' ? '户型（选填）' : 'Unit Type (optional)'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <UnitTypeDiagram selectedUnit={unitType} onSelect={(key) => setUnitType(unitType === key ? '' : key)} colors={c} />
    </div>
                  <div className="grid grid-cols-1 gap-2">
                    {UNIT_TYPES.map(ut => (
                      <button key={ut.key} onClick={() => setUnitType(unitType === ut.key ? '' : ut.key)}
                        className="text-xs px-3 py-2 rounded-lg transition-all duration-200 text-left flex items-center gap-2"
                        style={{
                          border: unitType === ut.key ? `1px solid ${ut.color}` : `1px solid ${c.cardBorder}`,
                          background: unitType === ut.key ? `${ut.color}12` : 'transparent',
                          color: unitType === ut.key ? ut.color : c.textMuted,
                        }}>
                        <span className="font-bold w-6 text-center" style={{ color: ut.color, fontFamily: 'serif' }}>{ut.element}</span>
                        <div className="flex-1">
                          <div className="font-medium">{lang === 'zh' ? ut.label_zh : ut.label_en}</div>
                          <div className="text-[8px]" style={{ color: unitType === ut.key ? ut.color : c.textFaint }}>
                            {lang === 'zh' ? ut.desc_zh : ut.desc_en}
    </div>
    </div>
                      </button>
                    ))}
    </div>
    </div>
    </div>

              {/* 楼层 */}
              <div>
                <label className="text-xs tracking-wider mb-2 block" style={{ color: c.tagText }}>
                  {lang === 'zh' ? '楼层（选填，用于楼层五行分析）' : 'Floor (optional, for floor element analysis)'}
                </label>
                <div className="flex gap-3 items-center">
                  <input type="number" value={floor} onChange={e => setFloor(e.target.value)}
                    placeholder={lang === 'zh' ? '如：12' : 'e.g.1 2'}
                    min="1" max="99"
                    className="w-24 px-4 py-2 rounded-lg text-sm"
                    style={{ border: `1px solid ${c.cardBorder}`, background: c.featureBg, color: c.textPrimary }} />
                  {floorElement && floor && parseInt(floor) > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs" style={{ color: c.textMuted }}>
                        {lang === 'zh' ? '五行属' : 'Element:'}
                      </span>
                      <span className="text-sm font-bold px-3 py-1 rounded-lg"
                        style={{ color: floorElement.color, background: `${floorElement.color}15`, border: `1px solid ${floorElement.color}30`, fontFamily: 'serif' }}>
                        {floorElement.element}
                      </span>
    </div>
                  )}
    </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {FLOOR_ELEMENTS.map(fe => (
                    <span key={fe.suffix} className="text-[9px] px-2 py-0.5 rounded"
                      style={{ color: fe.color, background: `${fe.color}08`, border: `1px solid ${fe.color}20` }}>
                      {lang === 'zh' ? `${fe.label_zh}→${fe.element}` : `${fe.label_en}→${fe.element}`}
                    </span>
                  ))}
    </div>
    </div>
    </div>
    </div>

          {/* 分组分隔线 */}
          <div className="my-4" style={{ borderTop: `1px solid ${c.cardBorder}` }} />

          {/* 分组2：居住者信息 */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-1 h-3 rounded" style={{ background: c.goldSolid }} />
              <span className="text-xs font-bold tracking-wider" style={{ color: c.goldSolid }}>
                {lang === 'zh' ? '居住者信息' : 'Occupant Info'}
              </span>
    </div>

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
    </div>

          {/* 分组分隔线 */}
          <div className="my-4" style={{ borderTop: `1px solid ${c.cardBorder}` }} />

          {/* 分组3：环境描述 */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-1 h-3 rounded" style={{ background: c.goldSolid }} />
              <span className="text-xs font-bold tracking-wider" style={{ color: c.goldSolid }}>
                {lang === 'zh' ? '环境描述' : 'Environment'}
              </span>
    </div>



            <div className="space-y-5">
              {/* 周边环境 */}
              <div>
                <label className="text-xs tracking-wider mb-2 block" style={{ color: c.tagText }}>
                  {lang === 'zh' ? '周边环境（选填，可多选）' : 'Surrounding Environment (optional, multi-select)'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {SURROUNDINGS.map(s => {
                    const isSelected = surroundings.includes(s.key);
                    return (
                      <button key={s.key} onClick={() => toggleSurrounding(s.key)}
                        className="text-xs px-2 py-1.5 rounded-lg transition-all duration-200 text-center"
                        style={{
                          border: isSelected ? `1px solid ${c.goldSolid}` : `1px solid ${c.cardBorder}`,
                          background: isSelected ? c.tabActive : 'transparent',
                          color: isSelected ? c.goldSolid : c.textMuted,
                        }}>
                        <div className="font-medium">{lang === 'zh' ? s.label_zh : s.label_en}</div>
                        <div className="text-[8px]" style={{ color: isSelected ? c.goldSolid : c.textFaint }}>
                          {lang === 'zh' ? s.impact_zh : s.impact_en}
    </div>
                      </button>
                    );
                  })}
    </div>
    </div>

              {/* 房间布局描述 */}
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
    </div>
    </div>

          {/* 参数汇总卡片 */}
          {(houseType || facingDirection || unitType || floor || birthYear || surroundings.length > 0 || roomLayout) && (
            <div className="rounded-xl p-4 mb-4"
              style={{ border: `1px solid ${c.goldLine}`, background: c.altSection }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] tracking-wider" style={{ color: c.goldSolid }}>
                  {lang === 'zh' ? '当前选择' : 'Current Selection'}
                </span>
    </div>
              <div className="flex flex-wrap gap-2">
                {houseType && (
                  <span className="text-[10px] px-2 py-1 rounded" style={{ background: c.tabActive, color: c.goldSolid }}>
                    {lang === 'zh' ? HOUSE_TYPES.find(ht => ht.key === houseType)?.label_zh : HOUSE_TYPES.find(ht => ht.key === houseType)?.label_en}
                  </span>
                )}
                {facingDirection && (
                  <span className="text-[10px] px-2 py-1 rounded" style={{ background: `${selectedBagua?.color}15`, color: selectedBagua?.color }}>
                    {selectedBagua?.symbol} {facingDirection}
                  </span>
                )}
                {unitType && (
                  <span className="text-[10px] px-2 py-1 rounded" style={{ background: `${UNIT_TYPES.find(ut => ut.key === unitType)?.color}15`, color: UNIT_TYPES.find(ut => ut.key === unitType)?.color }}>
                    {lang === 'zh' ? UNIT_TYPES.find(ut => ut.key === unitType)?.label_zh : UNIT_TYPES.find(ut => ut.key === unitType)?.label_en}
                  </span>
                )}
                {floor && parseInt(floor) > 0 && (
                  <span className="text-[10px] px-2 py-1 rounded" style={{ background: `${floorElement?.color}15`, color: floorElement?.color }}>
                    {floor}F · {floorElement?.element}
                  </span>
                )}
                {birthYear && (
                  <span className="text-[10px] px-2 py-1 rounded" style={{ background: c.tabActive, color: c.goldSolid }}>
                    {birthYear} · {gender === 'male' ? (lang === 'zh' ? '男' : 'Male') : (lang === 'zh' ? '女' : 'Female')}
                  </span>
                )}
                {guaInfo && (
                  <span className="text-[10px] px-2 py-1 rounded" style={{ background: c.tabActive, color: c.goldSolid }}>
                    {lang === 'zh' ? `命卦:${guaInfo.name}` : `Gua:${guaInfo.name}`}
                  </span>
                )}
                {surroundings.length > 0 && surroundings.map(s => (
                  <span key={s} className="text-[10px] px-2 py-1 rounded" style={{ background: c.tabActive, color: c.goldSolid }}>
                    {lang === 'zh' ? SURROUNDINGS.find(sr => sr.key === s)?.label_zh : SURROUNDINGS.find(sr => sr.key === s)?.label_en}
                  </span>
                ))}
    </div>
    </div>
          )}

          {/* 错误提示 */}
          {error && (
            <InsufficientCredits message={error} goldSolid={c.goldSolid} />
          )}

          {/* 分析按钮 */}
          <div className="flex justify-center gap-3 mt-4">
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

        {/* 分析结果 - Markdown结构化展示 */}
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
              <div className="leading-relaxed">
                {renderMarkdown(analysis, c)}
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
      <SiteFooter />
    </div>
  );
}