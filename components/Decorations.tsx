'use client';
import { motion } from 'framer-motion';

interface DecorProps {
  size?: number;
  color?: string;
  opacity?: number;
  className?: string;
}

// ─── 太极图（阴阳鱼）────────────────────────────────────
export function TaijiDiagram({ size = 120, color = '#d4a843', opacity = 0.15, className = '' }: DecorProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className} style={{ opacity }}>
      <circle cx="50" cy="50" r="48" fill="none" stroke={color} strokeWidth="1.5" />
      <path d="M50 2 A48 48 0 0 1 50 98 A24 24 0 0 1 50 50 A24 24 0 0 0 50 2 Z" fill={color} opacity="0.6" />
      <circle cx="50" cy="26" r="6" fill={color} />
      <circle cx="50" cy="74" r="6" fill="none" stroke={color} strokeWidth="1.5" />
    </svg>
  );
}

// ─── 星宿图（北斗七星连线）──────────────────────────────
export function StarConstellation({ size = 200, color = '#d4a843', opacity = 0.2, className = '' }: DecorProps) {
  const stars = [
    { x: 20, y: 30, r: 3 },
    { x: 35, y: 25, r: 2.5 },
    { x: 50, y: 35, r: 3.5 },
    { x: 65, y: 30, r: 2 },
    { x: 78, y: 45, r: 3 },
    { x: 85, y: 60, r: 2.5 },
    { x: 75, y: 75, r: 2 },
  ];
  return (
    <svg width={size} height={size * 0.6} viewBox="0 0 100 80" className={className} style={{ opacity }}>
      <polyline points={stars.map(s => `${s.x},${s.y}`).join(' ')} fill="none" stroke={color} strokeWidth="0.8" strokeDasharray="2 2" />
      {stars.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.r} fill={color} opacity={0.4 + i * 0.08} />
      ))}
      {stars.map((s, i) => (
        <circle key={`glow-${i}`} cx={s.x} cy={s.y} r={s.r * 2.5} fill={color} opacity="0.08" />
      ))}
    </svg>
  );
}

// ─── 八卦图 ────────────────────────────────────────────
export function BaguaDiagram({ size = 160, color = '#d4a843', opacity = 0.15, className = '' }: DecorProps) {
  const trigrams = [
    { name: '乾', lines: [1, 1, 1], angle: 0 },
    { name: '兑', lines: [1, 1, 0], angle: 45 },
    { name: '离', lines: [1, 0, 1], angle: 90 },
    { name: '震', lines: [1, 0, 0], angle: 135 },
    { name: '坤', lines: [0, 0, 0], angle: 180 },
    { name: '艮', lines: [0, 0, 1], angle: 225 },
    { name: '坎', lines: [0, 1, 0], angle: 270 },
    { name: '巽', lines: [0, 1, 1], angle: 315 },
  ];
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className} style={{ opacity }}>
      <circle cx="50" cy="50" r="48" fill="none" stroke={color} strokeWidth="0.8" />
      <circle cx="50" cy="50" r="35" fill="none" stroke={color} strokeWidth="0.5" opacity="0.5" />
      {trigrams.map((t, i) => {
        const rad = (t.angle * Math.PI) / 180;
        const cx = 50 + Math.cos(rad - Math.PI / 2) * 42;
        const cy = 50 + Math.sin(rad - Math.PI / 2) * 42;
        return (
          <g key={i} transform={`translate(${cx - 8} ${cy - 6})`}>
            {t.lines.map((line, j) => (
              line
                ? <line key={j} x1="0" y1={j * 4} x2="16" y2={j * 4} stroke={color} strokeWidth="2" />
                : <g key={j}>
                    <line x1="0" y1={j * 4} x2="6" y2={j * 4} stroke={color} strokeWidth="2" />
                    <line x1="10" y1={j * 4} x2="16" y2={j * 4} stroke={color} strokeWidth="2" />
                  </g>
            ))}
          </g>
        );
      })}
    </svg>
  );
}

// ─── 紫微命盘十二宫格 ──────────────────────────────────
export function PalaceGrid({ size = 180, color = '#d4a843', opacity = 0.12, className = '' }: DecorProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className} style={{ opacity }}>
      <rect x="2" y="2" width="96" height="96" fill="none" stroke={color} strokeWidth="0.8" rx="4" />
      <rect x="2" y="2" width="32" height="32" fill="none" stroke={color} strokeWidth="0.5" />
      <rect x="34" y="2" width="32" height="32" fill="none" stroke={color} strokeWidth="0.5" />
      <rect x="66" y="2" width="32" height="32" fill="none" stroke={color} strokeWidth="0.5" />
      <rect x="2" y="34" width="32" height="32" fill="none" stroke={color} strokeWidth="0.5" />
      <rect x="34" y="34" width="32" height="32" fill="none" stroke={color} strokeWidth="0.5" />
      <rect x="66" y="34" width="32" height="32" fill="none" stroke={color} strokeWidth="0.5" />
      <rect x="2" y="66" width="32" height="32" fill="none" stroke={color} strokeWidth="0.5" />
      <rect x="34" y="66" width="32" height="32" fill="none" stroke={color} strokeWidth="0.5" />
      <rect x="66" y="66" width="32" height="32" fill="none" stroke={color} strokeWidth="0.5" />
      <circle cx="50" cy="50" r="3" fill={color} opacity="0.6" />
      <text x="18" y="20" fontSize="6" fill={color} opacity="0.5" textAnchor="middle">命</text>
      <text x="50" y="20" fontSize="6" fill={color} opacity="0.4" textAnchor="middle">兄</text>
      <text x="82" y="20" fontSize="6" fill={color} opacity="0.4" textAnchor="middle">夫</text>
      <text x="18" y="52" fontSize="6" fill={color} opacity="0.4" textAnchor="middle">子</text>
      <text x="82" y="52" fontSize="6" fill={color} opacity="0.4" textAnchor="middle">财</text>
      <text x="18" y="84" fontSize="6" fill={color} opacity="0.4" textAnchor="middle">疾</text>
      <text x="50" y="84" fontSize="6" fill={color} opacity="0.4" textAnchor="middle">迁</text>
      <text x="82" y="84" fontSize="6" fill={color} opacity="0.4" textAnchor="middle">官</text>
    </svg>
  );
}

// ─── 四化环形图标 ──────────────────────────────────────
export function SiHuaRing({ size = 100, opacity = 0.2, className = '' }: DecorProps) {
  const items = [
    { label: '禄', color: '#2D7A4A', angle: 0 },
    { label: '权', color: '#1A56A8', angle: 90 },
    { label: '科', color: '#8A7018', angle: 180 },
    { label: '忌', color: '#A83228', angle: 270 },
  ];
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className} style={{ opacity }}>
      <circle cx="50" cy="50" r="40" fill="none" stroke="#d4a843" strokeWidth="0.5" opacity="0.3" />
      {items.map((item, i) => {
        const rad = (item.angle * Math.PI) / 180;
        const cx = 50 + Math.cos(rad - Math.PI / 2) * 40;
        const cy = 50 + Math.sin(rad - Math.PI / 2) * 40;
        return (
          <g key={i}>
            <circle cx={cx} cy={cy} r="8" fill={item.color} opacity="0.15" />
            <circle cx={cx} cy={cy} r="5" fill="none" stroke={item.color} strokeWidth="1" opacity="0.5" />
            <text x={cx} y={cy + 2} fontSize="5" fill={item.color} textAnchor="middle" opacity="0.7">{item.label}</text>
          </g>
        );
      })}
    </svg>
  );
}

// ─── 流光装饰线 ────────────────────────────────────────
export function GlowLine({ width = 200, color = '#d4a843', opacity = 0.3, className = '' }: { width?: number; color?: string; opacity?: number; className?: string }) {
  return (
    <div className={className} style={{ width, height: 1, opacity }}>
      <svg width={width} height="2" viewBox={`0 0 ${width} 2`}>
        <defs>
          <linearGradient id={`glow-${width}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={color} stopOpacity="0" />
            <stop offset="50%" stopColor={color} stopOpacity="0.6" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <line x1="0" y1="1" x2={width} y2="1" stroke={`url(#glow-${width})`} strokeWidth="1" />
      </svg>
    </div>
  );
}

// ─── 星曜光晕 ──────────────────────────────────────────
export function StarGlow({ size = 80, color = '#d4a843', opacity = 0.15, className = '' }: DecorProps) {
  return (
    <div className={className} style={{ width: size, height: size, opacity, position: 'relative' }}>
      <svg width={size} height={size} viewBox="0 0 100 100">
        <defs>
          <radialGradient id={`star-glow-${size}`}>
            <stop offset="0%" stopColor={color} stopOpacity="0.4" />
            <stop offset="40%" stopColor={color} stopOpacity="0.1" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="50" fill={`url(#star-glow-${size})`} />
        <circle cx="50" cy="50" r="3" fill={color} opacity="0.8" />
        <circle cx="50" cy="50" r="6" fill="none" stroke={color} strokeWidth="0.5" opacity="0.4" />
      </svg>
    </div>
  );
}

// ─── 旋转太极动画 ──────────────────────────────────────
export function SpinningTaiji({ size = 80, color = '#d4a843', opacity = 0.1, className = '' }: DecorProps) {
  return (
    <motion.div className={className} style={{ width: size, height: size, opacity }}
      animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 60, ease: 'linear' }}>
      <TaijiDiagram size={size} color={color} opacity={1} />
    </motion.div>
  );
}

// ─── 浮动星点装饰 ──────────────────────────────────────
export function FloatingStars({ count = 8, color = '#d4a843', opacity = 0.2, className = '' }: { count?: number; color?: string; opacity?: number; className?: string }) {
  const positions = [
    { x: 10, y: 20 }, { x: 25, y: 60 }, { x: 40, y: 15 }, { x: 55, y: 80 },
    { x: 70, y: 35 }, { x: 85, y: 70 }, { x: 15, y: 85 }, { x: 90, y: 10 },
  ];
  return (
    <div className={className} style={{ position: 'absolute', inset: 0, opacity, pointerEvents: 'none' }}>
      {positions.slice(0, count).map((p, i) => (
        <motion.div key={i}
          style={{ position: 'absolute', left: `${p.x}%`, top: `${p.y}%` }}
          animate={{ opacity: [0.3, 0.8, 0.3], scale: [0.8, 1.2, 0.8] }}
          transition={{ repeat: Infinity, duration: 3 + i * 0.5, delay: i * 0.3, ease: 'easeInOut' }}>
          <svg width="12" height="12" viewBox="0 0 12 12">
            <circle cx="6" cy="6" r="1.5" fill={color} />
            <circle cx="6" cy="6" r="3" fill="none" stroke={color} strokeWidth="0.3" opacity="0.4" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}

// ─── 云纹装饰 ──────────────────────────────────────────
export function CloudPattern({ size = 120, color = '#d4a843', opacity = 0.08, className = '' }: DecorProps) {
  return (
    <svg width={size} height={size * 0.5} viewBox="0 0 100 50" className={className} style={{ opacity }}>
      <path d="M10 30 Q15 20 25 25 Q30 15 40 20 Q50 10 60 20 Q70 15 75 25 Q85 20 90 30 Q85 40 75 35 Q70 45 60 40 Q50 50 40 40 Q30 45 25 35 Q15 40 10 30 Z"
        fill="none" stroke={color} strokeWidth="1" />
      <path d="M20 32 Q25 28 30 32 Q35 28 40 32" fill="none" stroke={color} strokeWidth="0.5" opacity="0.5" />
    </svg>
  );
}

// ─── 分隔装饰（菱形+线条）──────────────────────────────
export function DiamondDivider({ color = '#d4a843', opacity = 0.4, className = '' }: { color?: string; opacity?: number; className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`} style={{ opacity }}>
      <div className="h-px w-16" style={{ background: `linear-gradient(to right, transparent, ${color})` }} />
      <svg width="16" height="16" viewBox="0 0 16 16">
        <rect x="4" y="4" width="8" height="8" fill="none" stroke={color} strokeWidth="1" transform="rotate(45 8 8)" />
        <rect x="6" y="6" width="4" height="4" fill={color} opacity="0.3" transform="rotate(45 8 8)" />
      </svg>
      <div className="h-px w-16" style={{ background: `linear-gradient(to left, transparent, ${color})` }} />
    </div>
  );
}