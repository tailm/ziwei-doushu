'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

export function DeityIcon({ deityKey, size = 120, color = '#d4a843' }: { deityKey: string; size?: number; color?: string }) {
  const icons: Record<string, ReactNode> = {
    shakyamuni: (
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <circle cx="50" cy="20" r="14" fill="none" stroke={color} strokeWidth="1.5" opacity="0.3" />
        <circle cx="50" cy="22" r="8" fill="none" stroke={color} strokeWidth="2" />
        <path d="M50 14 Q48 10 50 6 Q52 10 50 14" fill={color} opacity="0.8" />
        <path d="M35 40 Q35 35 40 33 L60 33 Q65 35 65 40 L65 55 Q65 60 60 62 L40 62 Q35 60 35 55 Z" fill="none" stroke={color} strokeWidth="2" />
        <path d="M40 45 Q45 43 50 43 Q55 43 60 45" fill="none" stroke={color} strokeWidth="1.5" opacity="0.6" />
        <path d="M42 52 Q50 50 58 52" fill="none" stroke={color} strokeWidth="1.5" opacity="0.6" />
        <path d="M30 62 Q25 68 22 75 L78 75 Q75 68 70 62" fill="none" stroke={color} strokeWidth="2" />
        <path d="M22 75 Q20 80 25 82 L75 82 Q80 80 78 75" fill={color} opacity="0.15" stroke={color} strokeWidth="1.5" />
        <path d="M30 82 Q28 88 35 90 L65 90 Q72 88 70 82" fill="none" stroke={color} strokeWidth="2" />
        <path d="M35 90 Q33 95 40 96 L60 96 Q67 95 65 90" fill={color} opacity="0.1" stroke={color} strokeWidth="1.5" />
      </svg>
    ),
    amitabha: (
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <circle cx="50" cy="20" r="16" fill="none" stroke={color} strokeWidth="1.5" opacity="0.3" />
        <circle cx="50" cy="22" r="8" fill="none" stroke={color} strokeWidth="2" />
        <path d="M50 14 Q48 10 50 6 Q52 10 50 14" fill={color} opacity="0.8" />
        <path d="M35 40 Q35 35 40 33 L60 33 Q65 35 65 40 L65 55 Q65 60 60 62 L40 62 Q35 60 35 55 Z" fill="none" stroke={color} strokeWidth="2" />
        <ellipse cx="50" cy="48" rx="8" ry="4" fill={color} opacity="0.2" stroke={color} strokeWidth="1.5" />
        <path d="M30 62 Q25 68 22 75 L78 75 Q75 68 70 62" fill="none" stroke={color} strokeWidth="2" />
        <path d="M22 75 Q20 80 25 82 L75 82 Q80 80 78 75" fill={color} opacity="0.15" stroke={color} strokeWidth="1.5" />
        <path d="M30 82 Q28 88 35 90 L65 90 Q72 88 70 82" fill="none" stroke={color} strokeWidth="2" />
        <path d="M35 90 Q33 95 40 96 L60 96 Q67 95 65 90" fill={color} opacity="0.1" stroke={color} strokeWidth="1.5" />
      </svg>
    ),
    medicine: (
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <circle cx="50" cy="20" r="14" fill="none" stroke={color} strokeWidth="1.5" opacity="0.3" />
        <circle cx="50" cy="22" r="8" fill="none" stroke={color} strokeWidth="2" />
        <path d="M50 14 Q48 10 50 6 Q52 10 50 14" fill={color} opacity="0.8" />
        <path d="M35 40 Q35 35 40 33 L60 33 Q65 35 65 40 L65 55 Q65 60 60 62 L40 62 Q35 60 35 55 Z" fill="none" stroke={color} strokeWidth="2" />
        <circle cx="50" cy="48" r="5" fill={color} opacity="0.25" stroke={color} strokeWidth="1.5" />
        <path d="M47 45 L53 51 M53 45 L47 51" stroke={color} strokeWidth="1" opacity="0.6" />
        <path d="M30 62 Q25 68 22 75 L78 75 Q75 68 70 62" fill="none" stroke={color} strokeWidth="2" />
        <path d="M22 75 Q20 80 25 82 L75 82 Q80 80 78 75" fill={color} opacity="0.15" stroke={color} strokeWidth="1.5" />
        <path d="M30 82 Q28 88 35 90 L65 90 Q72 88 70 82" fill="none" stroke={color} strokeWidth="2" />
        <path d="M35 90 Q33 95 40 96 L60 96 Q67 95 65 90" fill={color} opacity="0.1" stroke={color} strokeWidth="1.5" />
      </svg>
    ),
    guanyin: (
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <circle cx="50" cy="18" r="14" fill="none" stroke={color} strokeWidth="1.5" opacity="0.3" />
        <path d="M42 12 Q44 8 42 4" fill="none" stroke={color} strokeWidth="1.5" opacity="0.5" />
        <path d="M58 12 Q56 8 58 4" fill="none" stroke={color} strokeWidth="1.5" opacity="0.5" />
        <circle cx="50" cy="20" r="7" fill="none" stroke={color} strokeWidth="2" />
        <path d="M50 14 Q48 10 50 6 Q52 10 50 14" fill={color} opacity="0.8" />
        <path d="M35 38 Q35 33 40 31 L60 31 Q65 33 65 38 L65 52 Q65 57 60 59 L40 59 Q35 57 35 52 Z" fill="none" stroke={color} strokeWidth="2" />
        <path d="M30 42 Q22 45 18 52 Q16 56 20 58 Q24 56 28 50" fill="none" stroke={color} strokeWidth="1.5" opacity="0.7" />
        <ellipse cx="20" cy="55" rx="4" ry="6" fill={color} opacity="0.15" stroke={color} strokeWidth="1.5" />
        <path d="M18 50 Q16 46 20 44" fill="none" stroke={color} strokeWidth="1" opacity="0.5" />
        <path d="M30 59 Q25 65 22 72 L78 72 Q75 65 70 59" fill="none" stroke={color} strokeWidth="2" />
        <path d="M22 72 Q20 77 25 79 L75 79 Q80 77 78 72" fill={color} opacity="0.15" stroke={color} strokeWidth="1.5" />
        <path d="M30 79 Q28 84 35 86 L65 86 Q72 84 70 79" fill="none" stroke={color} strokeWidth="2" />
        <path d="M35 86 Q33 91 40 92 L60 92 Q67 91 65 86" fill={color} opacity="0.1" stroke={color} strokeWidth="1.5" />
      </svg>
    ),
    dizang: (
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <circle cx="50" cy="18" r="14" fill="none" stroke={color} strokeWidth="1.5" opacity="0.3" />
        <circle cx="50" cy="20" r="7" fill="none" stroke={color} strokeWidth="2" />
        <path d="M50 14 Q48 10 50 6 Q52 10 50 14" fill={color} opacity="0.8" />
        <path d="M35 38 Q35 33 40 31 L60 31 Q65 33 65 38 L65 52 Q65 57 60 59 L40 59 Q35 57 35 52 Z" fill="none" stroke={color} strokeWidth="2" />
        <path d="M28 35 L28 65" stroke={color} strokeWidth="2" />
        <circle cx="28" cy="33" r="3" fill={color} opacity="0.4" stroke={color} strokeWidth="1.5" />
        <path d="M25 40 Q28 38 31 40" fill="none" stroke={color} strokeWidth="1" opacity="0.5" />
        <path d="M25 50 Q28 48 31 50" fill="none" stroke={color} strokeWidth="1" opacity="0.5" />
        <path d="M25 60 Q28 58 31 60" fill="none" stroke={color} strokeWidth="1" opacity="0.5" />
        <path d="M30 59 Q25 65 22 72 L78 72 Q75 65 70 59" fill="none" stroke={color} strokeWidth="2" />
        <path d="M22 72 Q20 77 25 79 L75 79 Q80 77 78 72" fill={color} opacity="0.15" stroke={color} strokeWidth="1.5" />
        <path d="M30 79 Q28 84 35 86 L65 86 Q72 84 70 79" fill="none" stroke={color} strokeWidth="2" />
        <path d="M35 86 Q33 91 40 92 L60 92 Q67 91 65 86" fill={color} opacity="0.1" stroke={color} strokeWidth="1.5" />
      </svg>
    ),
    wenshu: (
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <circle cx="50" cy="18" r="14" fill="none" stroke={color} strokeWidth="1.5" opacity="0.3" />
        <circle cx="50" cy="20" r="7" fill="none" stroke={color} strokeWidth="2" />
        <path d="M50 14 Q48 10 50 6 Q52 10 50 14" fill={color} opacity="0.8" />
        <path d="M35 38 Q35 33 40 31 L60 31 Q65 33 65 38 L65 52 Q65 57 60 59 L40 59 Q35 57 35 52 Z" fill="none" stroke={color} strokeWidth="2" />
        <path d="M68 35 L75 30 L78 35 L72 40" fill="none" stroke={color} strokeWidth="1.5" opacity="0.7" />
        <path d="M75 30 L82 22" stroke={color} strokeWidth="2" />
        <path d="M80 20 L84 24 L78 28" fill="none" stroke={color} strokeWidth="1.5" />
        <path d="M15 65 Q20 55 30 58 Q35 62 30 68 Q25 72 18 70 Q12 68 15 65" fill="none" stroke={color} strokeWidth="2" opacity="0.6" />
        <circle cx="22" cy="63" r="2" fill={color} opacity="0.4" />
        <path d="M30 59 Q25 65 22 72 L78 72 Q75 65 70 59" fill="none" stroke={color} strokeWidth="2" />
        <path d="M22 72 Q20 77 25 79 L75 79 Q80 77 78 72" fill={color} opacity="0.15" stroke={color} strokeWidth="1.5" />
        <path d="M30 79 Q28 84 35 86 L65 86 Q72 84 70 79" fill="none" stroke={color} strokeWidth="2" />
        <path d="M35 86 Q33 91 40 92 L60 92 Q67 91 65 86" fill={color} opacity="0.1" stroke={color} strokeWidth="1.5" />
      </svg>
    ),
    puxian: (
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <circle cx="50" cy="18" r="14" fill="none" stroke={color} strokeWidth="1.5" opacity="0.3" />
        <circle cx="50" cy="20" r="7" fill="none" stroke={color} strokeWidth="2" />
        <path d="M50 14 Q48 10 50 6 Q52 10 50 14" fill={color} opacity="0.8" />
        <path d="M35 38 Q35 33 40 31 L60 31 Q65 33 65 38 L65 52 Q65 57 60 59 L40 59 Q35 57 35 52 Z" fill="none" stroke={color} strokeWidth="2" />
        <path d="M70 38 Q78 42 80 50 Q78 55 72 52" fill="none" stroke={color} strokeWidth="1.5" opacity="0.7" />
        <circle cx="76" cy="46" r="3" fill={color} opacity="0.2" stroke={color} strokeWidth="1" />
        <path d="M12 62 Q18 52 28 55 Q35 60 30 66 Q22 72 15 68 Q8 65 12 62" fill="none" stroke={color} strokeWidth="2" opacity="0.6" />
        <path d="M18 58 Q22 55 26 58" fill="none" stroke={color} strokeWidth="1" opacity="0.4" />
        <path d="M30 59 Q25 65 22 72 L78 72 Q75 65 70 59" fill="none" stroke={color} strokeWidth="2" />
        <path d="M22 72 Q20 77 25 79 L75 79 Q80 77 78 72" fill={color} opacity="0.15" stroke={color} strokeWidth="1.5" />
        <path d="M30 79 Q28 84 35 86 L65 86 Q72 84 70 79" fill="none" stroke={color} strokeWidth="2" />
        <path d="M35 86 Q33 91 40 92 L60 92 Q67 91 65 86" fill={color} opacity="0.1" stroke={color} strokeWidth="1.5" />
      </svg>
    ),
    guanyu: (
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <path d="M40 8 Q50 4 60 8" fill="none" stroke={color} strokeWidth="2" />
        <path d="M42 10 Q50 6 58 10 L58 18 Q56 22 50 22 Q44 22 42 18 Z" fill={color} opacity="0.15" stroke={color} strokeWidth="2" />
        <path d="M42 14 Q38 16 36 20" fill="none" stroke={color} strokeWidth="2" />
        <path d="M58 14 Q62 16 64 20" fill="none" stroke={color} strokeWidth="2" />
        <circle cx="50" cy="16" r="6" fill="none" stroke={color} strokeWidth="2" />
        <path d="M46 14 Q48 12 50 14 Q52 12 54 14" fill="none" stroke={color} strokeWidth="1" opacity="0.5" />
        <path d="M35 28 Q35 24 40 22 L60 22 Q65 24 65 28 L65 45 Q65 50 60 52 L40 52 Q35 50 35 45 Z" fill="none" stroke={color} strokeWidth="2" />
        <path d="M40 35 Q45 33 50 33 Q55 33 60 35" fill="none" stroke={color} strokeWidth="1.5" opacity="0.5" />
        <path d="M42 42 Q50 40 58 42" fill="none" stroke={color} strokeWidth="1.5" opacity="0.5" />
        <path d="M65 30 L80 20 L85 25 L70 35" fill="none" stroke={color} strokeWidth="2" />
        <path d="M80 20 Q88 15 92 18 Q90 22 85 25" fill={color} opacity="0.2" stroke={color} strokeWidth="1.5" />
        <path d="M30 52 Q25 58 22 65 L78 65 Q75 58 70 52" fill="none" stroke={color} strokeWidth="2" />
        <path d="M22 65 Q20 70 25 72 L75 72 Q80 70 78 65" fill={color} opacity="0.15" stroke={color} strokeWidth="1.5" />
        <path d="M30 72 Q28 78 35 80 L65 80 Q72 78 70 72" fill="none" stroke={color} strokeWidth="2" />
        <path d="M35 80 Q33 86 40 88 L60 88 Q67 86 65 80" fill={color} opacity="0.1" stroke={color} strokeWidth="1.5" />
      </svg>
    ),
    mazu: (
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <path d="M40 8 Q50 4 60 8" fill="none" stroke={color} strokeWidth="2" />
        <path d="M42 10 Q50 6 58 10 L58 18 Q56 22 50 22 Q44 22 42 18 Z" fill={color} opacity="0.15" stroke={color} strokeWidth="2" />
        <path d="M44 12 Q47 10 50 12 Q53 10 56 12" fill="none" stroke={color} strokeWidth="1" opacity="0.5" />
        <circle cx="50" cy="16" r="6" fill="none" stroke={color} strokeWidth="2" />
        <path d="M35 28 Q35 24 40 22 L60 22 Q65 24 65 28 L65 45 Q65 50 60 52 L40 52 Q35 50 35 45 Z" fill="none" stroke={color} strokeWidth="2" />
        <path d="M40 35 Q45 33 50 33 Q55 33 60 35" fill="none" stroke={color} strokeWidth="1.5" opacity="0.5" />
        <path d="M42 42 Q50 40 58 42" fill="none" stroke={color} strokeWidth="1.5" opacity="0.5" />
        <path d="M68 35 Q75 38 78 44 Q75 48 70 45" fill="none" stroke={color} strokeWidth="1.5" opacity="0.7" />
        <path d="M72 38 Q78 36 82 40 Q78 44 74 42" fill={color} opacity="0.15" stroke={color} strokeWidth="1.5" />
        <path d="M30 52 Q25 58 22 65 L78 65 Q75 58 70 52" fill="none" stroke={color} strokeWidth="2" />
        <path d="M22 65 Q20 70 25 72 L75 72 Q80 70 78 65" fill={color} opacity="0.15" stroke={color} strokeWidth="1.5" />
        <path d="M30 72 Q28 78 35 80 L65 80 Q72 78 70 72" fill="none" stroke={color} strokeWidth="2" />
        <path d="M35 80 Q33 86 40 88 L60 88 Q67 86 65 80" fill={color} opacity="0.1" stroke={color} strokeWidth="1.5" />
      </svg>
    ),
    ancestor: (
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <path d="M35 10 L65 10 L68 18 L32 18 Z" fill={color} opacity="0.2" stroke={color} strokeWidth="2" />
        <path d="M32 18 L68 18 L70 25 L30 25 Z" fill={color} opacity="0.15" stroke={color} strokeWidth="2" />
        <rect x="30" y="25" width="40" height="55" rx="2" fill="none" stroke={color} strokeWidth="2" />
        <rect x="33" y="28" width="34" height="49" rx="1" fill={color} opacity="0.08" stroke={color} strokeWidth="1" />
        <path d="M40 35 L60 35" stroke={color} strokeWidth="1.5" opacity="0.5" />
        <rect x="42" y="40" width="16" height="20" rx="1" fill="none" stroke={color} strokeWidth="1.5" opacity="0.6" />
        <path d="M45 45 L55 45" stroke={color} strokeWidth="1" opacity="0.4" />
        <path d="M45 50 L55 50" stroke={color} strokeWidth="1" opacity="0.4" />
        <path d="M45 55 L55 55" stroke={color} strokeWidth="1" opacity="0.4" />
        <path d="M25 80 L75 80 L78 88 L22 88 Z" fill={color} opacity="0.15" stroke={color} strokeWidth="2" />
        <path d="M22 88 L78 88 L80 95 L20 95 Z" fill={color} opacity="0.1" stroke={color} strokeWidth="1.5" />
      </svg>
    ),
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      style={{ position: 'relative' }}
    >
      <motion.div
        style={{
          position: 'absolute',
          inset: -20,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${color}30, transparent 70%)`,
          filter: 'blur(8px)',
        }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
      {icons[deityKey] ?? icons.shakyamuni}
    </motion.div>
  );
}

export function LotusBloom({ size = 120, color = '#d4a843' }: { size?: number; color?: string }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 1.5, ease: 'easeOut' }}
    >
      {[0, 60, 120, 180, 240, 300].map((angle, i) => (
        <motion.ellipse
          key={i}
          cx="50"
          cy="35"
          rx="12"
          ry="28"
          fill={color}
          opacity={0.6}
          transform={`rotate(${angle} 50 50)`}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: i * 0.15, duration: 0.8, ease: 'easeOut' }}
          style={{ transformOrigin: '50px 50px' }}
        />
      ))}
      <circle cx="50" cy="50" r="8" fill={color} opacity={0.9} />
    </motion.svg>
  );
}

export function LampFlame({ size = 60, color = '#f59e0b' }: { size?: number; color?: string }) {
  return (
    <motion.div
      style={{ width: size, height: size * 1.5, position: 'relative' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: size * 0.3,
          height: size * 0.15,
          background: '#8b6410',
          borderRadius: '2px',
        }}
      />
      <motion.div
        style={{
          position: 'absolute',
          bottom: size * 0.12,
          left: '50%',
          transform: 'translateX(-50%)',
          width: size * 0.15,
          height: size * 0.5,
          background: `radial-gradient(ellipse at bottom, ${color}, ${color}80, transparent)`,
          borderRadius: '50% 50% 20% 20%',
          filter: 'blur(1px)',
        }}
        animate={{
          scaleY: [1, 1.1, 0.95, 1.05, 1],
          scaleX: [1, 0.95, 1.05, 0.98, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        style={{
          position: 'absolute',
          bottom: size * 0.12,
          left: '50%',
          transform: 'translateX(-50%)',
          width: size * 0.08,
          height: size * 0.3,
          background: '#fff8e0',
          borderRadius: '50% 50% 20% 20%',
          filter: 'blur(0.5px)',
        }}
        animate={{
          scaleY: [1, 1.15, 0.9, 1.1, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </motion.div>
  );
}

export function IncenseStick({ height = 120, color = '#d4a843' }: { height?: number; color?: string }) {
  return (
    <div style={{ position: 'relative', width: 4, height }}>
      <div style={{ width: 2, height: height * 0.85, background: '#8b6410', margin: '0 auto' }} />
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 3,
          height: 6,
          background: '#ff6b35',
          borderRadius: '50%',
          boxShadow: '0 0 8px #ff6b35',
        }}
        animate={{ opacity: [1, 0.7, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
      />
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            top: -10 - i * 15,
            left: '50%',
            width: 2,
            height: 0,
            background: `${color}40`,
            borderRadius: '50%',
            filter: 'blur(2px)',
          }}
          animate={{
            height: [0, 20, 0],
            opacity: [0, 0.4, 0],
            x: [0, -3 + i * 3, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.5,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
}

export function WishLantern({ size = 80, color = '#f59e0b' }: { size?: number; color?: string }) {
  return (
    <motion.div
      style={{ width: size, height: size * 1.4, position: 'relative' }}
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
    >
      <motion.div
        style={{
          width: size,
          height: size,
          background: `radial-gradient(circle at 50% 60%, ${color}, ${color}60, transparent)`,
          borderRadius: '50%',
          filter: 'blur(3px)',
        }}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div style={{
        width: size * 0.6,
        height: size * 0.3,
        margin: '0 auto',
        background: color,
        borderRadius: '4px 4px 0 0',
        opacity: 0.8,
      }} />
    </motion.div>
  );
}

export function WaterRipple({ size = 100, color = '#3b82f6' }: { size?: number; color?: string }) {
  return (
    <motion.svg width={size} height={size} viewBox="0 0 100 100">
      {[0, 1, 2].map(i => (
        <motion.circle
          key={i}
          cx="50"
          cy="50"
          r="10"
          fill="none"
          stroke={color}
          strokeWidth="2"
          opacity={0.6}
          animate={{
            r: [10, 40],
            opacity: [0.6, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.6,
            ease: 'easeOut',
          }}
        />
      ))}
      <circle cx="50" cy="50" r="6" fill={color} opacity={0.8} />
    </motion.svg>
  );
}

export function OfferingTable({ items }: { items: string[] }) {
  const itemIcons: Record<string, string> = {
    flower: '🌸',
    fruit: '🍎',
    tea: '🍵',
    incense: '🕯️',
    rice: '🌾',
    wine: '🍶',
    cake: '🥮',
    lamp: '🪔',
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      gap: 8,
      padding: '8px 12px',
      borderRadius: 8,
      background: 'rgba(212,168,67,0.08)',
      border: '1px solid rgba(212,168,67,0.2)',
    }}>
      {items.map((item, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: i * 0.2, duration: 0.5 }}
          style={{ fontSize: 28 }}
        >
          {itemIcons[item] ?? '🙏'}
        </motion.div>
      ))}
    </div>
  );
}