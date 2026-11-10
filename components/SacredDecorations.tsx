'use client';
import { motion } from 'framer-motion';

interface SacredProps {
  size?: number;
  color?: string;
  opacity?: number;
  className?: string;
}

// ─── 莲花 ──────────────────────────────────────────────
export function LotusFlower({ size = 120, color = '#d4a843', opacity = 0.15, className = '' }: SacredProps) {
  const petals = [
    { rotate: 0, delay: 0 },
    { rotate: 45, delay: 0.1 },
    { rotate: 90, delay: 0.2 },
    { rotate: 135, delay: 0.3 },
    { rotate: 180, delay: 0.4 },
    { rotate: 225, delay: 0.5 },
    { rotate: 270, delay: 0.6 },
    { rotate: 315, delay: 0.7 },
  ];
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className} style={{ opacity }}>
      <defs>
        <radialGradient id={`lotus-center-${size}`}>
          <stop offset="0%" stopColor={color} stopOpacity="0.6" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="12" fill={`url(#lotus-center-${size})`} />
      {petals.map((p, i) => (
        <motion.ellipse
          key={i}
          cx="50" cy="35" rx="6" ry="16"
          fill="none" stroke={color} strokeWidth="0.8"
          transform={`rotate(${p.rotate} 50 50)`}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 0.5, scale: 1 }}
          transition={{ delay: p.delay, duration: 0.6 }}
        />
      ))}
      {petals.map((p, i) => (
        <motion.ellipse
          key={`inner-${i}`}
          cx="50" cy="40" rx="4" ry="10"
          fill={color} fillOpacity="0.08"
          stroke={color} strokeWidth="0.5"
          transform={`rotate(${p.rotate} 50 50)`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ delay: p.delay + 0.3, duration: 0.6 }}
        />
      ))}
      <circle cx="50" cy="50" r="4" fill={color} opacity="0.4" />
    </svg>
  );
}

// ─── 佛光（光环放射）──────────────────────────────────
export function BuddhaHalo({ size = 200, color = '#d4a843', opacity = 0.12, className = '' }: SacredProps) {
  const rays = Array.from({ length: 24 }, (_, i) => i * 15);
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className} style={{ opacity }}>
      <defs>
        <radialGradient id={`halo-glow-${size}`}>
          <stop offset="0%" stopColor={color} stopOpacity="0" />
          <stop offset="30%" stopColor={color} stopOpacity="0.15" />
          <stop offset="60%" stopColor={color} stopOpacity="0.05" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="45" fill={`url(#halo-glow-${size})`} />
      <motion.circle
        cx="50" cy="50" r="35" fill="none" stroke={color} strokeWidth="0.5"
        animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.5, 0.3] }}
        style={{ transformOrigin: '50px 50px' }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <circle cx="50" cy="50" r="28" fill="none" stroke={color} strokeWidth="0.3" opacity="0.4" />
      {rays.map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x1 = +(50 + Math.cos(rad) * 28).toFixed(2);
        const y1 = +(50 + Math.sin(rad) * 28).toFixed(2);
        const x2 = +(50 + Math.cos(rad) * 45).toFixed(2);
        const y2 = +(50 + Math.sin(rad) * 45).toFixed(2);
        return (
          <motion.line
            key={i}
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={color} strokeWidth="0.4"
            animate={{ opacity: [0.15, 0.4, 0.15] }}
            transition={{ duration: 3, repeat: Infinity, delay: i * 0.08, ease: 'easeInOut' }}
          />
        );
      })}
    </svg>
  );
}

// ─── 祥云（缭绕云纹）──────────────────────────────────
export function AuspiciousCloud({ size = 160, color = '#d4a843', opacity = 0.1, className = '' }: SacredProps) {
  return (
    <svg width={size} height={size * 0.6} viewBox="0 0 100 60" className={className} style={{ opacity }}>
      <motion.path
        d="M5 40 Q10 25 20 30 Q25 18 35 22 Q42 12 52 20 Q60 14 68 22 Q78 18 82 30 Q92 25 95 40 Q90 50 82 45 Q78 55 68 48 Q60 55 52 48 Q42 55 35 45 Q25 52 20 45 Q10 50 5 40 Z"
        fill="none" stroke={color} strokeWidth="1"
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.path
        d="M15 42 Q20 35 28 38 Q35 32 42 36"
        fill="none" stroke={color} strokeWidth="0.5" opacity="0.5"
        animate={{ opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 4, repeat: Infinity, delay: 0.5, ease: 'easeInOut' }}
      />
      <motion.path
        d="M55 42 Q62 35 70 38 Q78 34 85 38"
        fill="none" stroke={color} strokeWidth="0.5" opacity="0.5"
        animate={{ opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 4, repeat: Infinity, delay: 1, ease: 'easeInOut' }}
      />
      <circle cx="20" cy="30" r="1.5" fill={color} opacity="0.4" />
      <circle cx="52" cy="20" r="1.5" fill={color} opacity="0.4" />
      <circle cx="82" cy="30" r="1.5" fill={color} opacity="0.4" />
    </svg>
  );
}

// ─── 经幡（飘动旗帜）──────────────────────────────────
export function PrayerFlag({ size = 100, color = '#d4a843', opacity = 0.15, className = '' }: SacredProps) {
  const flags = [
    { color: '#3a78d4', label: '空' },
    { color: '#2d7a4a', label: '风' },
    { color: '#d4a843', label: '火' },
    { color: '#a83228', label: '水' },
    { color: '#8a7018', label: '地' },
  ];
  return (
    <div className={className} style={{ opacity, width: size, height: size * 1.2 }}>
      <svg width={size} height={size * 1.2} viewBox="0 0 50 60">
        <line x1="25" y1="2" x2="25" y2="58" stroke={color} strokeWidth="0.5" opacity="0.3" />
        {flags.map((f, i) => (
          <motion.g
            key={i}
            animate={{ rotate: [0, 2, -2, 0], x: [0, 1, -1, 0] }}
            transition={{ duration: 3 + i * 0.3, repeat: Infinity, delay: i * 0.2, ease: 'easeInOut' }}
            style={{ transformOrigin: '25px 0px' }}
          >
            <rect
              x="25" y={4 + i * 11} width="18" height="9"
              fill={f.color} fillOpacity="0.15"
              stroke={f.color} strokeWidth="0.5"
            />
            <text
              x="34" y={10 + i * 11} fontSize="5"
              fill={f.color} textAnchor="middle"
              fontFamily="serif" opacity="0.6"
            >{f.label}</text>
          </motion.g>
        ))}
      </svg>
    </div>
  );
}

// ─── 金刚杵 ────────────────────────────────────────────
export function VajraScepter({ size = 80, color = '#d4a843', opacity = 0.15, className = '' }: SacredProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" className={className} style={{ opacity }}>
      <motion.g
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: '20px 20px' }}
      >
        <circle cx="20" cy="20" r="3" fill={color} opacity="0.4" />
        <circle cx="20" cy="20" r="6" fill="none" stroke={color} strokeWidth="0.5" opacity="0.3" />
        {[0, 90, 180, 270].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const x1 = +(20 + Math.cos(rad) * 6).toFixed(2);
          const y1 = +(20 + Math.sin(rad) * 6).toFixed(2);
          const x2 = +(20 + Math.cos(rad) * 16).toFixed(2);
          const y2 = +(20 + Math.sin(rad) * 16).toFixed(2);
          return (
            <g key={i}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="1" />
              <circle cx={x2} cy={y2} r="2" fill="none" stroke={color} strokeWidth="0.8" />
              <circle cx={x2} cy={y2} r="1" fill={color} opacity="0.3" />
            </g>
          );
        })}
      </motion.g>
    </svg>
  );
}

// ─── 香炉/香烟缭绕 ────────────────────────────────────
export function IncenseSmoke({ size = 80, color = '#d4a843', opacity = 0.15, className = '' }: SacredProps) {
  return (
    <div className={className} style={{ width: size, height: size * 1.5, opacity, position: 'relative' }}>
      <svg width={size} height={size * 1.5} viewBox="0 0 40 60">
        <ellipse cx="20" cy="52" rx="8" ry="3" fill="none" stroke={color} strokeWidth="0.8" />
        <ellipse cx="20" cy="52" rx="5" ry="2" fill={color} fillOpacity="0.08" />
        <line x1="18" y1="50" x2="18" y2="42" stroke={color} strokeWidth="0.5" />
        <line x1="22" y1="50" x2="22" y2="42" stroke={color} strokeWidth="0.5" />
        <line x1="20" y1="50" x2="20" y2="40" stroke={color} strokeWidth="0.5" />
        {[0, 1, 2].map(i => (
          <motion.path
            key={i}
            d={`M${18 + i * 2} 40 Q${15 + i * 2} 30 ${20 + i * 2} 20 Q${25 + i * 2} 10 ${18 + i * 2} 2`}
            fill="none" stroke={color} strokeWidth="0.4"
            animate={{
              opacity: [0.2, 0.5, 0.2],
              scaleX: [1, 0.9, 1],
              translateX: [0, 2, 0],
            }}
            style={{ transformOrigin: 'center' }}
            transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.5, ease: 'easeInOut' }}
          />
        ))}
      </svg>
    </div>
  );
}

// ─── 晨钟/暮鼓 ────────────────────────────────────────
export function TempleBell({ size = 80, color = '#d4a843', opacity = 0.15, className = '' }: SacredProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" className={className} style={{ opacity }}>
      <motion.g
        animate={{ rotate: [0, -3, 3, -2, 2, 0] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3, ease: 'easeInOut' }}
        style={{ transformOrigin: '20px 8px' }}
      >
        <line x1="20" y1="2" x2="20" y2="8" stroke={color} strokeWidth="0.5" />
        <circle cx="20" cy="8" r="1.5" fill={color} opacity="0.4" />
        <path d="M12 10 Q12 8 14 8 L26 8 Q28 8 28 10 L28 24 Q28 28 20 28 Q12 28 12 24 Z"
          fill="none" stroke={color} strokeWidth="1" />
        <path d="M12 10 Q12 8 14 8 L26 8 Q28 8 28 10 L28 24 Q28 28 20 28 Q12 28 12 24 Z"
          fill={color} fillOpacity="0.05" />
        <line x1="14" y1="14" x2="26" y2="14" stroke={color} strokeWidth="0.3" opacity="0.4" />
        <line x1="14" y1="18" x2="26" y2="18" stroke={color} strokeWidth="0.3" opacity="0.4" />
        <text x="20" y="22" fontSize="4" fill={color} textAnchor="middle" fontFamily="serif" opacity="0.5">钟</text>
        <line x1="20" y1="28" x2="20" y2="34" stroke={color} strokeWidth="0.5" />
        <circle cx="20" cy="35" r="1.5" fill={color} opacity="0.3" />
      </motion.g>
      <motion.circle
        cx="20" cy="20" r="18" fill="none" stroke={color} strokeWidth="0.3"
        animate={{ scale: [0.89, 1.11, 0.89], opacity: [0, 0.3, 0] }}
        style={{ transformOrigin: '20px 20px' }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3, ease: 'easeOut' }}
      />
    </svg>
  );
}

// ─── 梵文/种子字 ──────────────────────────────────────
export function SeedSyllable({ size = 60, color = '#d4a843', opacity = 0.2, className = '', syllable = '唵' }: SacredProps & { syllable?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" className={className} style={{ opacity }}>
      <defs>
        <radialGradient id={`seed-glow-${size}-${syllable}`}>
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="20" cy="20" r="18" fill={`url(#seed-glow-${size}-${syllable})`} />
      <motion.circle
        cx="20" cy="20" r="16" fill="none" stroke={color} strokeWidth="0.3"
        animate={{ opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.text
        x="20" y="26" fontSize="14" fill={color}
        textAnchor="middle" fontFamily="serif" fontWeight="bold"
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >{syllable}</motion.text>
    </svg>
  );
}

// ─── 曼陀罗（坛城）────────────────────────────────────
export function Mandala({ size = 200, color = '#d4a843', opacity = 0.1, className = '' }: SacredProps) {
  const rings = [
    { r: 45, segments: 8 },
    { r: 35, segments: 12 },
    { r: 25, segments: 6 },
    { r: 15, segments: 4 },
  ];
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className} style={{ opacity }}>
      <motion.g
        animate={{ rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: '50px 50px' }}
      >
        <circle cx="50" cy="50" r="48" fill="none" stroke={color} strokeWidth="0.3" />
        <circle cx="50" cy="50" r="45" fill="none" stroke={color} strokeWidth="0.5" />
        {rings.map((ring, ri) => (
          <g key={ri}>
            <circle cx="50" cy="50" r={ring.r} fill="none" stroke={color} strokeWidth="0.3" />
            {Array.from({ length: ring.segments }, (_, i) => {
              const angle = (i * 360) / ring.segments;
              const rad = (angle * Math.PI) / 180;
              const x1 = +(50 + Math.cos(rad) * ring.r).toFixed(2);
              const y1 = +(50 + Math.sin(rad) * ring.r).toFixed(2);
              const x2 = +(50 + Math.cos(rad) * (ring.r - 8)).toFixed(2);
              const y2 = +(50 + Math.sin(rad) * (ring.r - 8)).toFixed(2);
              return (
                <g key={i}>
                  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="0.3" />
                  <circle cx={x1} cy={y1} r="1.5" fill={color} opacity="0.3" />
                </g>
              );
            })}
          </g>
        ))}
        <circle cx="50" cy="50" r="8" fill={color} fillOpacity="0.1" stroke={color} strokeWidth="0.5" />
        <circle cx="50" cy="50" r="3" fill={color} opacity="0.4" />
      </motion.g>
    </svg>
  );
}

// ─── 法轮（转法轮）────────────────────────────────────
export function DharmaWheel({ size = 100, color = '#d4a843', opacity = 0.15, className = '' }: SacredProps) {
  const spokes = Array.from({ length: 8 }, (_, i) => i * 45);
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" className={className} style={{ opacity }}>
      <motion.g
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: '20px 20px' }}
      >
        <circle cx="20" cy="20" r="18" fill="none" stroke={color} strokeWidth="1" />
        <circle cx="20" cy="20" r="14" fill="none" stroke={color} strokeWidth="0.5" opacity="0.5" />
        <circle cx="20" cy="20" r="4" fill={color} opacity="0.3" />
        <circle cx="20" cy="20" r="2" fill={color} opacity="0.5" />
        {spokes.map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const x1 = +(20 + Math.cos(rad) * 4).toFixed(2);
          const y1 = +(20 + Math.sin(rad) * 4).toFixed(2);
          const x2 = +(20 + Math.cos(rad) * 18).toFixed(2);
          const y2 = +(20 + Math.sin(rad) * 18).toFixed(2);
          return (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="0.5" />
          );
        })}
      </motion.g>
    </svg>
  );
}

// ─── 菩提树叶 ─────────────────────────────────────────
export function BodhiLeaf({ size = 80, color = '#d4a843', opacity = 0.12, className = '' }: SacredProps) {
  return (
    <svg width={size} height={size * 1.2} viewBox="0 0 40 50" className={className} style={{ opacity }}>
      <motion.path
        d="M20 5 Q5 15 8 30 Q12 42 20 48 Q28 42 32 30 Q35 15 20 5 Z"
        fill="none" stroke={color} strokeWidth="0.8"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.path
        d="M20 5 Q5 15 8 30 Q12 42 20 48 Q28 42 32 30 Q35 15 20 5 Z"
        fill={color} fillOpacity="0.05"
        animate={{ opacity: [0.05, 0.12, 0.05] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <line x1="20" y1="8" x2="20" y2="45" stroke={color} strokeWidth="0.3" opacity="0.4" />
      <path d="M20 15 Q14 18 12 24" fill="none" stroke={color} strokeWidth="0.3" opacity="0.3" />
      <path d="M20 15 Q26 18 28 24" fill="none" stroke={color} strokeWidth="0.3" opacity="0.3" />
      <path d="M20 25 Q14 28 12 34" fill="none" stroke={color} strokeWidth="0.3" opacity="0.3" />
      <path d="M20 25 Q26 28 28 34" fill="none" stroke={color} strokeWidth="0.3" opacity="0.3" />
    </svg>
  );
}

// ─── 水波纹/涟漪 ──────────────────────────────────────
export function RippleWave({ size = 100, color = '#d4a843', opacity = 0.1, className = '' }: SacredProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" className={className} style={{ opacity }}>
      {[0, 1, 2, 3].map(i => (
        <motion.circle
          key={i}
          cx="20" cy="20" fill="none" stroke={color} strokeWidth="0.5"
          animate={{
            r: [4, 18],
            opacity: [0.4, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.75,
            ease: 'easeOut',
          }}
        />
      ))}
      <circle cx="20" cy="20" r="2" fill={color} opacity="0.4" />
    </svg>
  );
}

// ─── 佛手印（禅定印）──────────────────────────────────
export function MeditationMudra({ size = 80, color = '#d4a843', opacity = 0.12, className = '' }: SacredProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" className={className} style={{ opacity }}>
      <motion.g
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ellipse cx="20" cy="28" rx="14" ry="4" fill="none" stroke={color} strokeWidth="0.8" />
        <ellipse cx="20" cy="28" rx="14" ry="4" fill={color} fillOpacity="0.05" />
        <path d="M8 26 Q6 20 8 16 Q10 14 14 16" fill="none" stroke={color} strokeWidth="0.6" />
        <path d="M32 26 Q34 20 32 16 Q30 14 26 16" fill="none" stroke={color} strokeWidth="0.6" />
        <ellipse cx="20" cy="24" rx="8" ry="2" fill="none" stroke={color} strokeWidth="0.5" opacity="0.5" />
        <circle cx="20" cy="24" r="1.5" fill={color} opacity="0.4" />
      </motion.g>
    </svg>
  );
}

// ─── 山门/寺庙轮廓 ────────────────────────────────────
export function TempleSilhouette({ size = 120, color = '#d4a843', opacity = 0.08, className = '' }: SacredProps) {
  return (
    <svg width={size} height={size * 0.5} viewBox="0 0 100 50" className={className} style={{ opacity }}>
      <motion.g
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <path d="M10 45 L10 25 L20 20 L30 25 L30 45 Z" fill="none" stroke={color} strokeWidth="0.8" />
        <path d="M35 45 L35 20 L50 12 L65 20 L65 45 Z" fill="none" stroke={color} strokeWidth="1" />
        <path d="M70 45 L70 25 L80 20 L90 25 L90 45 Z" fill="none" stroke={color} strokeWidth="0.8" />
        <path d="M35 20 L50 12 L65 20" fill={color} fillOpacity="0.05" />
        <rect x="45" y="30" width="10" height="15" fill="none" stroke={color} strokeWidth="0.5" />
        <line x1="50" y1="12" x2="50" y2="6" stroke={color} strokeWidth="0.5" />
        <circle cx="50" cy="5" r="1.5" fill={color} opacity="0.4" />
        <line x1="20" y1="20" x2="20" y2="16" stroke={color} strokeWidth="0.3" />
        <circle cx="20" cy="15" r="1" fill={color} opacity="0.3" />
        <line x1="80" y1="20" x2="80" y2="16" stroke={color} strokeWidth="0.3" />
        <circle cx="80" cy="15" r="1" fill={color} opacity="0.3" />
      </motion.g>
    </svg>
  );
}

// ─── 金色边框装饰（威严框线）──────────────────────────
export function SacredBorder({ color = '#d4a843', opacity = 0.2, className = '' }: { color?: string; opacity?: number; className?: string }) {
  return (
    <div className={className} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity }}>
      <svg width="100%" height="100%" preserveAspectRatio="none">
        <defs>
          <pattern id="sacred-corner" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M0 0 L40 0 L40 40" fill="none" stroke={color} strokeWidth="0.5" opacity="0.3" />
          </pattern>
        </defs>
        <rect x="0" y="0" width="100%" height="100%" fill="url(#sacred-corner)" />
      </svg>
    </div>
  );
}

// ─── 烛火/灯明 ────────────────────────────────────────
export function SacredFlame({ size = 40, color = '#d4a843', opacity = 0.2, className = '' }: SacredProps) {
  return (
    <svg width={size} height={size * 1.5} viewBox="0 0 20 30" className={className} style={{ opacity }}>
      <motion.path
        d="M10 5 Q6 10 8 16 Q10 20 10 22 Q10 20 12 16 Q14 10 10 5 Z"
        fill={color} fillOpacity="0.2"
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.2, 0.35, 0.2],
        }}
        style={{ transformOrigin: 'center' }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.path
        d="M10 8 Q8 12 9 16 Q10 18 10 20 Q10 18 11 16 Q12 12 10 8 Z"
        fill={color} fillOpacity="0.3"
        animate={{ opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <rect x="8" y="22" width="4" height="6" fill="none" stroke={color} strokeWidth="0.5" />
      <rect x="8" y="22" width="4" height="6" fill={color} fillOpacity="0.05" />
    </svg>
  );
}