'use client';
import { motion } from 'framer-motion';

// ─── 测字：汉字方框装饰 ───
export function CeziFrame({ color, opacity = 0.06, size = 120 }: { color: string; opacity?: number; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" style={{ opacity }}>
      <rect x="10" y="10" width="100" height="100" rx="8" fill="none" stroke={color} strokeWidth="1" />
      <rect x="18" y="18" width="84" height="84" rx="4" fill="none" stroke={color} strokeWidth="0.5" />
      <line x1="60" y1="10" x2="60" y2="18" stroke={color} strokeWidth="0.5" />
      <line x1="60" y1="102" x2="60" y2="110" stroke={color} strokeWidth="0.5" />
      <line x1="10" y1="60" x2="18" y2="60" stroke={color} strokeWidth="0.5" />
      <line x1="102" y1="60" x2="110" y2="60" stroke={color} strokeWidth="0.5" />
      <circle cx="60" cy="60" r="3" fill={color} />
    </svg>
  );
}

// ─── 测字：五行相生相克小环图 ───
export function FiveElementMiniCycle({ color, highlight, size = 140 }: { color: string; highlight?: string; size?: number }) {
  const elements = [
    { name: '木', angle: -90, color: '#4ade80' },
    { name: '火', angle: -18, color: '#f87171' },
    { name: '土', angle: 54, color: '#d4a843' },
    { name: '金', angle: 126, color: '#e8eef6' },
    { name: '水', angle: 198, color: '#60a5fa' },
  ];
  const r = 50;
  const cx = 60, cy = 60;
  const pos = (angle: number) => ({
    x: cx + r * Math.cos((angle * Math.PI) / 180),
    y: cy + r * Math.sin((angle * Math.PI) / 180),
  });

  return (
    <svg width={size} height={size} viewBox="0 0 120 120">
      {/* 相生弧线（外圈顺时针） */}
      {elements.map((el, i) => {
        const next = elements[(i + 1) % 5];
        const p1 = pos(el.angle);
        const p2 = pos(next.angle);
        const midAngle = (el.angle + next.angle) / 2;
        const arcR = r + 8;
        const mp = { x: cx + arcR * Math.cos((midAngle * Math.PI) / 180), y: cy + arcR * Math.sin((midAngle * Math.PI) / 180) };
        return (
          <path key={`sheng-${i}`} d={`M ${p1.x} ${p1.y} Q ${mp.x} ${mp.y} ${p2.x} ${p2.y}`}
            fill="none" stroke={color} strokeWidth="0.6" opacity="0.3" />
        );
      })}
      {/* 相克直线（内圈星形） */}
      {elements.map((el, i) => {
        const opp = elements[(i + 2) % 5];
        const p1 = pos(el.angle);
        const p2 = pos(opp.angle);
        return (
          <line key={`ke-${i}`} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
            stroke={color} strokeWidth="0.4" opacity="0.15" strokeDasharray="1 1" />
        );
      })}
      {/* 五行节点 */}
      {elements.map((el) => {
        const p = pos(el.angle);
        const isHighlight = highlight === el.name;
        return (
          <g key={el.name}>
            <circle cx={p.x} cy={p.y} r={isHighlight ? 9 : 7}
              fill={isHighlight ? el.color : `${el.color}20`}
              stroke={el.color} strokeWidth={isHighlight ? 1.5 : 0.8} />
            <text x={p.x} y={p.y + 3} fontSize="8" fill={isHighlight ? '#08080a' : el.color}
              textAnchor="middle" fontFamily="serif" fontWeight="bold">{el.name}</text>
          </g>
        );
      })}
    </svg>
  );
}

// ─── 测字：笔画书写动画 ───
export function StrokeAnimation({ char, color, size = 120 }: { char: string; color: string; size?: number }) {
  const strokes: Record<string, { d: string }[][]> = {
    '命': [
      [{ d: 'M30 15 L30 35' }, { d: 'M30 15 L50 15' }, { d: 'M50 15 L50 35' }, { d: 'M30 25 L50 25' }],
      [{ d: 'M20 40 L60 40' }, { d: 'M20 40 L20 65' }, { d: 'M60 40 L60 65' }, { d: 'M20 65 L60 65' }],
    ],
    '财': [
      [{ d: 'M25 15 L45 15' }, { d: 'M35 15 L35 30' }],
      [{ d: 'M15 35 L55 35' }, { d: 'M15 35 L15 55' }, { d: 'M55 35 L55 55' }, { d: 'M15 55 L55 55' }],
      [{ d: 'M25 60 L45 60' }, { d: 'M35 60 L35 75' }],
    ],
    '福': [
      [{ d: 'M20 15 L40 15' }, { d: 'M30 15 L30 30' }],
      [{ d: 'M15 35 L45 35' }, { d: 'M15 35 L15 55' }, { d: 'M45 35 L45 55' }],
      [{ d: 'M15 55 L45 55' }, { d: 'M25 60 L35 60' }],
    ],
    '吉': [
      [{ d: 'M25 15 L45 15' }, { d: 'M35 15 L35 30' }],
      [{ d: 'M15 35 L55 35' }, { d: 'M15 35 L15 55' }, { d: 'M55 35 L55 55' }, { d: 'M15 55 L55 55' }],
    ],
    '运': [
      [{ d: 'M20 15 L50 15' }, { d: 'M35 15 L35 30' }],
      [{ d: 'M15 35 L55 35' }, { d: 'M15 35 L15 55' }, { d: 'M55 35 L55 55' }],
    ],
    '缘': [
      [{ d: 'M20 15 L50 15' }, { d: 'M35 15 L35 30' }],
      [{ d: 'M15 35 L55 35' }, { d: 'M15 35 L15 55' }, { d: 'M55 35 L55 55' }, { d: 'M15 55 L55 55' }],
    ],
    '安': [
      [{ d: 'M25 15 L45 15' }, { d: 'M35 15 L35 30' }],
      [{ d: 'M20 35 L50 35' }, { d: 'M35 35 L35 55' }],
    ],
    '康': [
      [{ d: 'M20 15 L50 15' }, { d: 'M35 15 L35 30' }],
      [{ d: 'M15 35 L55 35' }, { d: 'M15 35 L15 55' }, { d: 'M55 35 L55 55' }],
    ],
  };

  const charStrokes = strokes[char];
  if (!charStrokes) {
    return (
      <div style={{ width: size, height: size }} className="flex items-center justify-center">
        <span style={{ fontSize: size * 0.5, color, fontFamily: 'serif', fontWeight: 'bold' }}>{char}</span>
      </div>
    );
  }

  const allStrokes = charStrokes.flat();

  return (
    <svg width={size} height={size} viewBox="0 0 70 80">
      {allStrokes.map((s, i) => (
        <motion.path key={i} d={s.d} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: i * 0.25 }} />
      ))}
    </svg>
  );
}

// ─── 抽签：签筒SVG ───
export function SignTube({ color, size = 80, shaking = false }: { color: string; size?: number; shaking?: boolean }) {
  return (
    <motion.svg width={size} height={size * 1.6} viewBox="0 0 50 80"
      animate={shaking ? { rotate: [-4, 4, -4, 4, -2, 2, 0] } : { rotate: 0 }}
      transition={shaking ? { duration: 0.8, repeat: Infinity } : { duration: 0.3 }}>
      {/* 签筒主体 */}
      <path d="M8 8 L42 8 L40 72 L10 72 Z" fill={`${color}08`} stroke={color} strokeWidth="1.5" />
      {/* 筒口 */}
      <ellipse cx="25" cy="8" rx="17" ry="3" fill={`${color}12`} stroke={color} strokeWidth="1.2" />
      {/* 筒身纹饰 */}
      <line x1="12" y1="20" x2="38" y2="20" stroke={color} strokeWidth="0.4" opacity="0.4" />
      <line x1="12" y1="55" x2="38" y2="55" stroke={color} strokeWidth="0.4" opacity="0.4" />
      {/* 签条露出 */}
      <rect x="14" y="2" width="3" height="12" rx="1" fill={`${color}30`} stroke={color} strokeWidth="0.6" />
      <rect x="22" y="0" width="3" height="14" rx="1" fill={`${color}20`} stroke={color} strokeWidth="0.6" />
      <rect x="30" y="3" width="3" height="10" rx="1" fill={`${color}25`} stroke={color} strokeWidth="0.6" />
      {/* 筒底 */}
      <ellipse cx="25" cy="72" rx="15" ry="2.5" fill={`${color}08`} stroke={color} strokeWidth="0.8" />
    </motion.svg>
  );
}

// ─── 抽签：签条SVG ───
export function SignStick({ color, label, size = 30 }: { color: string; label?: string; size?: number }) {
  return (
    <svg width={size} height={size * 4} viewBox="0 0 20 80">
      <rect x="5" y="2" width="10" height="76" rx="2" fill={`${color}15`} stroke={color} strokeWidth="1" />
      <rect x="5" y="2" width="10" height="8" rx="2" fill={`${color}40`} stroke={color} strokeWidth="0.8" />
      {label && <text x="10" y="45" fontSize="6" fill={color} textAnchor="middle" fontFamily="serif">{label}</text>}
    </svg>
  );
}

// ─── 抽签：莲花装饰 ───
export function LotusDecoration({ color, size = 60, opacity = 0.08 }: { color: string; size?: number; opacity?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" style={{ opacity }}>
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <ellipse key={angle} cx="30" cy="20" rx="6" ry="14"
          fill="none" stroke={color} strokeWidth="0.8"
          transform={`rotate(${angle} 30 30)`} />
      ))}
      <circle cx="30" cy="30" r="5" fill={color} opacity="0.3" />
    </svg>
  );
}

// ─── 铜钱卦：铜钱SVG ───
export function CoinSvg({ color, size = 36, face = 'yang', flipping = false, delay = 0 }: {
  color: string; size?: number; face?: 'yang' | 'yin'; flipping?: boolean; delay?: number;
}) {
  return (
    <motion.svg width={size} height={size} viewBox="0 0 36 36"
      animate={flipping ? { rotateY: [0, 360, 360], y: [0, -15, 0] } : {}}
      transition={flipping ? { duration: 0.6, delay, ease: 'easeOut' } : {}}>
      {/* 外圈 */}
      <circle cx="18" cy="18" r="16" fill={`${color}10`} stroke={color} strokeWidth="1.5" />
      {/* 内圈纹 */}
      <circle cx="18" cy="18" r="13" fill="none" stroke={color} strokeWidth="0.4" opacity="0.4" />
      {/* 方孔 */}
      <rect x="14" y="14" width="8" height="8" fill="none" stroke={color} strokeWidth="1" />
      <rect x="15" y="15" width="6" height="6" fill={`${color}08`} />
      {/* 正面(阳)标记 - 方孔四周4个点 */}
      {face === 'yang' && (
        <>
          <circle cx="10" cy="10" r="1.2" fill={color} />
          <circle cx="26" cy="10" r="1.2" fill={color} />
          <circle cx="10" cy="26" r="1.2" fill={color} />
          <circle cx="26" cy="26" r="1.2" fill={color} />
        </>
      )}
      {/* 反面(阴)标记 - 方孔上下2个点 */}
      {face === 'yin' && (
        <>
          <circle cx="18" cy="8" r="1.2" fill={color} />
          <circle cx="18" cy="28" r="1.2" fill={color} />
        </>
      )}
    </motion.svg>
  );
}

// ─── 铜钱卦：八卦符号 ───
export function TrigramSymbol({ trigram, color, size = 40 }: { trigram: string; color: string; size?: number }) {
  const trigramLines: Record<string, boolean[]> = {
    '☰': [true, true, true],   // 乾
    '☱': [true, true, false],  // 兑
    '☲': [true, false, true],  // 离
    '☳': [true, false, false], // 震
    '☴': [false, true, true],  // 巽
    '☵': [false, true, false], // 坎
    '☶': [false, false, true], // 艮
    '☷': [false, false, false],// 坤
  };
  const lines = trigramLines[trigram] || [true, true, true];

  return (
    <svg width={size} height={size} viewBox="0 0 40 40">
      {lines.map((isYang, i) => (
        <g key={i}>
          {isYang ? (
            <rect x="6" y={6 + i * 10} width="28" height="4" rx="1" fill={color} />
          ) : (
            <>
              <rect x="6" y={6 + i * 10} width="12" height="4" rx="1" fill={color} />
              <rect x="22" y={6 + i * 10} width="12" height="4" rx="1" fill={color} />
            </>
          )}
        </g>
      ))}
    </svg>
  );
}

// ─── 铜钱卦：六爻SVG线条 ───
export function YaoLine({ isYang, isChanging, color, changingColor, width = 200 }: {
  isYang: boolean; isChanging: boolean; color: string; changingColor: string; width?: number;
}) {
  const h = 6;
  const gap = 8;
  const halfW = (width - gap) / 2;

  if (isYang) {
    return (
      <svg width={width} height={h + 4} viewBox={`0 0 ${width} ${h + 4}`}>
        <rect x="0" y="2" width={width} height={h} rx="2"
          fill={isChanging ? changingColor : color}
          opacity={isChanging ? 0.8 : 1} />
        {isChanging && (
          <circle cx={width / 2} cy={h / 2 + 2} r="2" fill="#08080a" />
        )}
      </svg>
    );
  }
  return (
    <svg width={width} height={h + 4} viewBox={`0 0 ${width} ${h + 4}`}>
      <rect x="0" y="2" width={halfW} height={h} rx="2"
        fill={isChanging ? changingColor : color}
        opacity={isChanging ? 0.8 : 1} />
      <rect x={halfW + gap} y="2" width={halfW} height={h} rx="2"
        fill={isChanging ? changingColor : color}
        opacity={isChanging ? 0.8 : 1} />
      {isChanging && (
        <text x={width / 2} y={h + 1} fontSize="6" fill={changingColor} textAnchor="middle">×</text>
      )}
    </svg>
  );
}
// ─── 面相：面部SVG示意图（可标注各部位）───
export function FaceDiagram({ color, size = 200, highlightParts = [] }: {
  color: string; size?: number; highlightParts?: string[];
}) {
  const partColors: Record<string, string> = {
    faceShape: '#ec4899', forehead: '#f59e0b', eyebrows: '#8b5cf6',
    eyes: '#3b82f6', nose: '#4ade80', mouth: '#f87171',
    chin: '#06b6d4', ears: '#a855f7',
  };
  const isActive = (part: string) => highlightParts.includes(part);
  const partColor = (part: string) => isActive(part) ? partColors[part] : `${color}40`;
  const partOpacity = (part: string) => isActive(part) ? 1 : 0.3;

  return (
    <svg width={size} height={size * 1.2} viewBox="0 0 100 120">
      {/* 脸型轮廓 */}
      <ellipse cx="50" cy="60" rx="28" ry="38" fill="none"
        stroke={partColor('faceShape')} strokeWidth={isActive('faceShape') ? 2 : 1}
        opacity={partOpacity('faceShape')} />
      {/* 额头区域 */}
      <ellipse cx="50" cy="32" rx="22" ry="12" fill="none"
        stroke={partColor('forehead')} strokeWidth={isActive('forehead') ? 1.5 : 0.6}
        opacity={partOpacity('forehead')} strokeDasharray="2 1" />
      {/* 眉毛 */}
      <path d="M32 44 Q38 42 44 44" fill="none"
        stroke={partColor('eyebrows')} strokeWidth={isActive('eyebrows') ? 2 : 0.8}
        opacity={partOpacity('eyebrows')} />
      <path d="M56 44 Q62 42 68 44" fill="none"
        stroke={partColor('eyebrows')} strokeWidth={isActive('eyebrows') ? 2 : 0.8}
        opacity={partOpacity('eyebrows')} />
      {/* 眼睛 */}
      <ellipse cx="38" cy="50" rx="4" ry="2.5" fill="none"
        stroke={partColor('eyes')} strokeWidth={isActive('eyes') ? 1.5 : 0.8}
        opacity={partOpacity('eyes')} />
      <ellipse cx="62" cy="50" rx="4" ry="2.5" fill="none"
        stroke={partColor('eyes')} strokeWidth={isActive('eyes') ? 1.5 : 0.8}
        opacity={partOpacity('eyes')} />
      <circle cx="38" cy="50" r="1.2" fill={partColor('eyes')} opacity={partOpacity('eyes')} />
      <circle cx="62" cy="50" r="1.2" fill={partColor('eyes')} opacity={partOpacity('eyes')} />
      {/* 鼻子 */}
      <path d="M50 52 L48 64 L50 66 L52 64 Z" fill="none"
        stroke={partColor('nose')} strokeWidth={isActive('nose') ? 1.5 : 0.8}
        opacity={partOpacity('nose')} />
      {/* 嘴 */}
      <path d="M42 72 Q50 76 58 72" fill="none"
        stroke={partColor('mouth')} strokeWidth={isActive('mouth') ? 1.5 : 0.8}
        opacity={partOpacity('mouth')} />
      {/* 下巴 */}
      <ellipse cx="50" cy="84" rx="12" ry="6" fill="none"
        stroke={partColor('chin')} strokeWidth={isActive('chin') ? 1.5 : 0.6}
        opacity={partOpacity('chin')} strokeDasharray="2 1" />
      {/* 耳朵 */}
      <ellipse cx="22" cy="58" rx="4" ry="8" fill="none"
        stroke={partColor('ears')} strokeWidth={isActive('ears') ? 1.5 : 0.8}
        opacity={partOpacity('ears')} />
      <ellipse cx="78" cy="58" rx="4" ry="8" fill="none"
        stroke={partColor('ears')} strokeWidth={isActive('ears') ? 1.5 : 0.8}
        opacity={partOpacity('ears')} />
      {/* 标注线（当某部位高亮时显示） */}
      {isActive('faceShape') && <text x="80" y="60" fontSize="5" fill={partColors.faceShape}>脸型</text>}
      {isActive('forehead') && <text x="80" y="32" fontSize="5" fill={partColors.forehead}>额头</text>}
      {isActive('eyes') && <text x="80" y="50" fontSize="5" fill={partColors.eyes}>眼睛</text>}
      {isActive('nose') && <text x="80" y="64" fontSize="5" fill={partColors.nose}>鼻子</text>}
      {isActive('mouth') && <text x="80" y="74" fontSize="5" fill={partColors.mouth}>嘴巴</text>}
    </svg>
  );
}

// ─── 手相：手掌SVG示意图（可标注各纹路）───
export function PalmDiagram({ color, size = 200, highlightLines = [] }: {
  color: string; size?: number; highlightLines?: string[];
}) {
  const lineColors: Record<string, string> = {
    lifeLine: '#4ade80', headLine: '#3b82f6',
    heartLine: '#f87171', fateLine: '#f59e0b',
  };
  const isActive = (line: string) => highlightLines.includes(line);
  const lineColor = (line: string) => isActive(line) ? lineColors[line] : `${color}40`;
  const lineOpacity = (line: string) => isActive(line) ? 1 : 0.3;

  return (
    <svg width={size} height={size * 1.1} viewBox="0 0 100 110">
      {/* 手掌轮廓 */}
      <path d="M30 100 L30 55 Q30 42 38 38 L62 38 Q70 42 70 55 L70 100"
        fill="none" stroke={`${color}60`} strokeWidth="1.2" />
      {/* 拇指 */}
      <path d="M30 55 Q22 52 18 45 Q15 38 20 34 Q25 32 30 42"
        fill="none" stroke={`${color}60`} strokeWidth="1" />
      {/* 食指 */}
      <path d="M38 38 Q36 22 40 15 Q44 12 46 18 Q47 25 44 38"
        fill="none" stroke={`${color}60`} strokeWidth="0.8" opacity="0.5" />
      {/* 中指 */}
      <path d="M50 38 Q48 18 52 10 Q56 8 57 16 Q57 25 54 38"
        fill="none" stroke={`${color}60`} strokeWidth="0.8" opacity="0.5" />
      {/* 无名指 */}
      <path d="M62 38 Q60 22 64 16 Q68 14 69 22 Q69 28 66 38"
        fill="none" stroke={`${color}60`} strokeWidth="0.8" opacity="0.5" />
      {/* 小指 */}
      <path d="M70 55 Q72 42 76 38 Q80 38 80 44 Q79 50 74 58"
        fill="none" stroke={`${color}60`} strokeWidth="0.8" opacity="0.5" />

      {/* 生命线 */}
      <motion.path d="M34 70 Q50 55 66 70" fill="none"
        stroke={lineColor('lifeLine')} strokeWidth={isActive('lifeLine') ? 2 : 0.8}
        opacity={lineOpacity('lifeLine')} strokeDasharray={isActive('lifeLine') ? '' : '2 1'} />
      {/* 智慧线 */}
      <motion.path d="M36 80 Q50 72 64 80" fill="none"
        stroke={lineColor('headLine')} strokeWidth={isActive('headLine') ? 2 : 0.8}
        opacity={lineOpacity('headLine')} strokeDasharray={isActive('headLine') ? '' : '2 1'} />
      {/* 感情线 */}
      <motion.path d="M38 88 Q50 82 62 88" fill="none"
        stroke={lineColor('heartLine')} strokeWidth={isActive('heartLine') ? 2 : 0.8}
        opacity={lineOpacity('heartLine')} strokeDasharray={isActive('heartLine') ? '' : '2 1'} />
      {/* 命运线 */}
      <motion.path d="M50 38 L50 90" fill="none"
        stroke={lineColor('fateLine')} strokeWidth={isActive('fateLine') ? 2 : 0.8}
        opacity={lineOpacity('fateLine')} strokeDasharray={isActive('fateLine') ? '' : '2 1'} />

      {/* 标注 */}
      {isActive('lifeLine') && <text x="72" y="68" fontSize="5" fill={lineColors.lifeLine}>生命线</text>}
      {isActive('headLine') && <text x="72" y="80" fontSize="5" fill={lineColors.headLine}>智慧线</text>}
      {isActive('heartLine') && <text x="72" y="90" fontSize="5" fill={lineColors.heartLine}>感情线</text>}
      {isActive('fateLine') && <text x="55" y="50" fontSize="5" fill={lineColors.fateLine}>命运线</text>}
    </svg>
  );
}