'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getTodayFestival, type Festival } from '@/lib/festivals';

export default function FestivalPopup() {
  const [festival, setFestival] = useState<Festival | null>(null);
  const [open, setOpen] = useState(false);
  const [decided, setDecided] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const f = getTodayFestival();
    if (f) {
      const storageKey = `festival_seen_${f.id}_${todayStr}`;
      try {
        const seen = localStorage.getItem(storageKey);
        if (!seen) {
          setFestival(f);
          setOpen(true);
        }
      } catch { /* localStorage disabled */ }
    }
    setDecided(true);
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [open]);

  const close = () => {
    setOpen(false);
    if (festival) {
      const today = new Date();
      const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      try {
        localStorage.setItem(`festival_seen_${festival.id}_${todayStr}`, '1');
      } catch { /* skip */ }
    }
  };

  if (!decided || !festival) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={close}
          style={{
            position: 'fixed', inset: 0, zIndex: 9998,
            background: 'rgba(20,12,2,0.85)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '16px',
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 24 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'linear-gradient(180deg, #fefcf6 0%, #faf3e3 100%)',
              borderRadius: '20px',
              width: '100%',
              maxWidth: '560px',
              maxHeight: 'min(88vh, 720px)',
              overflow: 'hidden',
              boxShadow: '0 24px 80px rgba(60,30,10,0.4), 0 4px 16px rgba(60,30,10,0.2)',
              border: '1px solid rgba(184,146,42,0.3)',
              display: 'flex',
              flexDirection: 'column',
              fontFamily: '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
            }}
          >
            {/* 顶部装饰区 */}
            <div style={{
              padding: '24px 28px 16px',
              borderBottom: '1px solid rgba(184,146,42,0.15)',
              background: 'linear-gradient(180deg, rgba(184,146,42,0.12) 0%, transparent 100%)',
              flexShrink: 0,
              position: 'relative',
              textAlign: 'center',
            }}>
              <button
                onClick={close}
                aria-label="关闭"
                style={{
                  position: 'absolute', top: '14px', right: '16px',
                  width: '28px', height: '28px',
                  background: 'rgba(184,146,42,0.08)',
                  border: '1px solid rgba(184,146,42,0.2)',
                  borderRadius: '50%',
                  color: '#7a5e2a', fontSize: '14px',
                  cursor: 'pointer', lineHeight: 1,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >×</button>

              <div style={{ fontSize: '36px', marginBottom: '8px', lineHeight: 1 }}>
                {festival.emoji}
              </div>
              <div style={{ fontSize: '10px', letterSpacing: '0.4em', color: '#b8922a', opacity: 0.7, marginBottom: '6px' }}>
                {festival.category === 'deity' ? 'DEITY BIRTHDAY · 神灵诞辰' : 'TRADITIONAL FESTIVAL · 传统节日'}
              </div>
              <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#3d2f10', letterSpacing: '0.08em', margin: 0 }}>
                {festival.name}
              </h2>
              <div style={{ fontSize: '12px', color: '#7a5e2a', marginTop: '4px', letterSpacing: '0.05em' }}>
                {festival.subtitle}
              </div>
            </div>

            {/* 祝福语 banner */}
            <div style={{
              margin: '14px 22px 0',
              padding: '12px 16px',
              background: 'linear-gradient(135deg, #fff5e3 0%, #ffe8c0 100%)',
              border: '1.5px dashed rgba(184,146,42,0.45)',
              borderRadius: '12px',
              flexShrink: 0,
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '10px', letterSpacing: '0.3em', color: '#b8922a', marginBottom: '4px', fontWeight: 600 }}>
                {festival.category === 'deity' ? 'DEITY BLESSING · 神灵祝福' : 'FESTIVAL BLESSING · 节日祝福'}
              </div>
              <div style={{ fontSize: '15px', color: '#8b3a1a', fontWeight: 600, lineHeight: 1.5 }}>
                {festival.blessing}
              </div>
            </div>

            {/* 正文（可滚动） */}
            <div style={{
              padding: '16px 28px 20px',
              overflowY: 'auto',
              flex: 1,
            }}>
              {/* 节日简介 */}
              <div style={{ fontSize: '10px', letterSpacing: '0.3em', color: '#b8922a', marginBottom: '8px', fontWeight: 600 }}>
                {festival.category === 'deity' ? '神灵简介 · INTRODUCTION' : '节日简介 · INTRODUCTION'}
              </div>
              <p style={{
                margin: '0 0 16px',
                fontSize: '14px',
                lineHeight: 1.85,
                color: '#5a4a30',
              }}>
                {festival.intro}
              </p>

              {/* 节日习俗 */}
              <div style={{ fontSize: '10px', letterSpacing: '0.3em', color: '#b8922a', marginBottom: '8px', fontWeight: 600 }}>
                {festival.category === 'deity' ? '神灵纪念 · DEITY CUSTOMS' : '节日纪念 · CUSTOMS'}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {festival.customs.map((custom, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex', gap: '10px', alignItems: 'flex-start',
                      padding: '10px 14px',
                      background: 'rgba(184,146,42,0.06)',
                      borderRadius: '8px',
                      borderLeft: '3px solid rgba(184,146,42,0.4)',
                    }}
                  >
                    <span style={{
                      flexShrink: 0, width: '20px', height: '20px',
                      background: 'rgba(184,146,42,0.15)',
                      borderRadius: '50%',
                      fontSize: '11px', color: '#7a5e2a', fontWeight: 600,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>{i + 1}</span>
                    <span style={{ fontSize: '13px', lineHeight: 1.7, color: '#5a4a30' }}>
                      {custom}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 底部按钮 */}
            <div style={{
              padding: '14px 22px',
              borderTop: '1px solid rgba(184,146,42,0.15)',
              background: 'rgba(184,146,42,0.04)',
              display: 'flex',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <button
                onClick={close}
                style={{
                  padding: '10px 32px',
                  background: 'linear-gradient(135deg, #b8922a 0%, #9a7a20 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '13px',
                  letterSpacing: '0.15em',
                  fontWeight: 500,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(184,146,42,0.3)',
                }}
              >
                {festival.category === 'deity' ? '虔诚礼敬' : '共庆佳节'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}