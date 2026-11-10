'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '@/lib/i18n/LanguageContext';
import { useTheme } from '@/components/ThemeProvider';
import NavigationBar from '@/components/NavigationBar';
import SiteFooter from '@/components/SiteFooter';
import { AuspiciousCloud, BodhiLeaf, SeedSyllable } from '@/components/SacredDecorations';
import HeritageBanner from '@/components/HeritageBanner';
import { HERITAGE_ITEMS, HERITAGE_CATEGORIES, HeritageItem } from '@/lib/heritage-data';

export default function HeritagePage() {
  const { lang } = useLang();
  const { theme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState<HeritageItem | null>(null);

  const isZh = lang === 'zh';
  const isDark = theme === 'dark';

  const c = {
    bg: isDark ? '#0a0805' : '#f5efe0',
    bgTint: isDark ? '#15110a' : '#faf5e8',
    cardBg: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.85)',
    border: isDark ? 'rgba(212,168,67,0.15)' : 'rgba(140,100,20,0.12)',
    borderActive: isDark ? 'rgba(212,168,67,0.4)' : 'rgba(140,100,20,0.4)',
    gold: isDark ? '#d4a843' : '#8b6410',
    text: isDark ? '#e8dcc8' : '#3a2e1a',
    textMuted: isDark ? '#9db0d0' : '#5a6275',
    textFaint: isDark ? 'rgba(212,168,67,0.4)' : 'rgba(140,100,20,0.35)',
    accent: '#B8922A',
  };

  const filteredItems = selectedCategory === 'all'
    ? HERITAGE_ITEMS
    : HERITAGE_ITEMS.filter(item => item.category === selectedCategory);

  return (
    <div className="min-h-screen relative" style={{ background: c.bg }}>
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '10%', left: '5%', opacity: 0.04 }}>
          <AuspiciousCloud size={120} color={c.gold} opacity={0.5} />
        </div>
        <div style={{ position: 'absolute', bottom: '15%', right: '8%', opacity: 0.04 }}>
          <AuspiciousCloud size={100} color={c.gold} opacity={0.5} />
        </div>
        <div style={{ position: 'absolute', top: '40%', right: '3%', opacity: 0.03 }}>
          <BodhiLeaf size={80} color={c.gold} opacity={0.5} />
        </div>
        <div style={{ position: 'absolute', bottom: '30%', left: '10%', opacity: 0.03 }}>
          <SeedSyllable size={70} color={c.gold} opacity={0.5} />
        </div>
      </div>

      <NavigationBar />

      <div className="relative z-10 pt-20 pb-12 px-4 sm:px-8 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className="inline-block mb-3" style={{
            padding: '4px 16px',
            borderRadius: '20px',
            border: `1px solid ${c.borderActive}`,
            background: `${c.gold}10`,
            fontSize: '12px',
            color: c.gold,
            letterSpacing: '2px',
          }}>
            {isZh ? '联合国教科文组织 · 人类非物质文化遗产' : 'UNESCO · Intangible Cultural Heritage'}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3" style={{ color: c.text }}>
            {isZh ? '中国非物质文化遗产' : 'Chinese Intangible Cultural Heritage'}
          </h1>
          <p className="text-sm sm:text-base max-w-2xl mx-auto" style={{ color: c.textMuted }}>
            {isZh
              ? '五千余年文明积淀，中华民族世代传承的智慧结晶。从昆曲到书法，从节气到茶道，每一项非遗都是活着的历史。'
              : 'Five millennia of civilization, the crystallized wisdom of the Chinese people passed down through generations. From Kunqu to calligraphy, from solar terms to tea arts, each heritage is living history.'}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-2 mb-8"
        >
          {HERITAGE_CATEGORIES.map(cat => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className="px-4 py-2 rounded-full text-xs sm:text-sm transition-all duration-300"
              style={{
                border: `1px solid ${selectedCategory === cat.key ? c.borderActive : c.border}`,
                background: selectedCategory === cat.key ? `${c.gold}15` : 'transparent',
                color: selectedCategory === cat.key ? c.gold : c.textMuted,
                cursor: 'pointer',
              }}
            >
              {isZh ? cat.label_zh : cat.label_en}
            </button>
          ))}
        </motion.div>

        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, idx) => (
              <motion.div
                key={item.name_zh}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: idx * 0.03 }}
                whileHover={{ y: -4 }}
                onClick={() => setSelectedItem(item)}
                className="rounded-xl p-5 cursor-pointer transition-all duration-300"
                style={{
                  background: c.cardBg,
                  border: `1px solid ${c.border}`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = c.borderActive;
                  e.currentTarget.style.boxShadow = `0 8px 24px ${c.gold}20`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = c.border;
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="text-3xl">{item.icon}</div>
                  <div className="text-[10px] px-2 py-0.5 rounded-full" style={{
                    background: `${c.gold}15`,
                    color: c.gold,
                    border: `1px solid ${c.borderActive}`,
                  }}>
                    {item.year}
                  </div>
                </div>
                <h3 className="text-base font-semibold mb-1" style={{ color: c.text }}>
                  {isZh ? item.name_zh : item.name_en}
                </h3>
                <div className="text-[11px] mb-2" style={{ color: c.gold }}>
                  {isZh ? item.region_zh : item.region_en}
                </div>
                <p className="text-xs leading-relaxed line-clamp-3" style={{ color: c.textMuted }}>
                  {isZh ? item.description_zh : item.description_en}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8"
        >
          {[
            { num: '43', label_zh: '入选项目', label_en: 'Inscribed Items' },
            { num: '2001', label_zh: '首批入选', label_en: 'First Inscription' },
            { num: '8', label_zh: '类别覆盖', label_en: 'Categories' },
            { num: '∞', label_zh: '世代传承', label_en: 'Generations' },
          ].map((stat, i) => (
            <div
              key={i}
              className="rounded-xl p-4 text-center"
              style={{
                background: c.cardBg,
                border: `1px solid ${c.border}`,
              }}
            >
              <div className="text-2xl font-bold mb-1" style={{ color: c.gold }}>{stat.num}</div>
              <div className="text-[11px]" style={{ color: c.textMuted }}>
                {isZh ? stat.label_zh : stat.label_en}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setSelectedItem(null)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              background: 'rgba(20,12,2,0.75)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
            }}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              onClick={(e) => e.stopPropagation()}
              style={{
                maxWidth: '560px',
                width: '100%',
                maxHeight: '85vh',
                borderRadius: '16px',
                background: c.bgTint,
                border: `1px solid ${c.borderActive}`,
                boxShadow: `0 24px 80px rgba(0,0,0,0.4)`,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <HeritageBanner banner={selectedItem.banner} color={selectedItem.color} />
                <button
                  onClick={() => setSelectedItem(null)}
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'rgba(0,0,0,0.4)',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#fff',
                    fontSize: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  ✕
                </button>
                <div style={{
                  position: 'absolute',
                  bottom: '12px',
                  left: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}>
                  <div className="text-3xl">{selectedItem.icon}</div>
                  <div>
                    <h3 className="text-lg font-bold" style={{ color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
                      {isZh ? selectedItem.name_zh : selectedItem.name_en}
                    </h3>
                    <div className="text-[11px] flex gap-2" style={{ color: 'rgba(255,255,255,0.8)' }}>
                      <span>{isZh ? selectedItem.region_zh : selectedItem.region_en}</span>
                      <span>·</span>
                      <span>{selectedItem.year}</span>
                      <span>·</span>
                      <span>{HERITAGE_CATEGORIES.find(cat => cat.key === selectedItem.category)?.[isZh ? 'label_zh' : 'label_en']}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
                <p className="text-sm leading-relaxed mb-4" style={{ color: c.text }}>
                  {isZh ? selectedItem.description_zh : selectedItem.description_en}
                </p>

                <div className="mb-4">
                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-2" style={{ color: c.gold }}>
                    <span style={{ width: '3px', height: '14px', background: c.gold, borderRadius: '2px', display: 'inline-block' }} />
                    {isZh ? '历史沿革' : 'History'}
                  </h4>
                  <p className="text-xs leading-relaxed" style={{ color: c.textMuted }}>
                    {isZh ? selectedItem.history_zh : selectedItem.history_en}
                  </p>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-2" style={{ color: c.gold }}>
                    <span style={{ width: '3px', height: '14px', background: c.gold, borderRadius: '2px', display: 'inline-block' }} />
                    {isZh ? '文化意义' : 'Cultural Significance'}
                  </h4>
                  <p className="text-xs leading-relaxed" style={{ color: c.textMuted }}>
                    {isZh ? selectedItem.significance_zh : selectedItem.significance_en}
                  </p>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-2" style={{ color: c.gold }}>
                    <span style={{ width: '3px', height: '14px', background: c.gold, borderRadius: '2px', display: 'inline-block' }} />
                    {isZh ? '核心特征' : 'Key Features'}
                  </h4>
                  <div className="flex flex-col gap-2">
                    {(isZh ? selectedItem.features_zh : selectedItem.features_en).map((feature, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <div style={{
                          width: '4px',
                          height: '4px',
                          borderRadius: '50%',
                          background: c.gold,
                          marginTop: '6px',
                          flexShrink: 0,
                        }} />
                        <p className="text-xs leading-relaxed" style={{ color: c.text }}>
                          {feature}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-2">
                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-2" style={{ color: c.gold }}>
                    <span style={{ width: '3px', height: '14px', background: c.gold, borderRadius: '2px', display: 'inline-block' }} />
                    {isZh ? '传承保护' : 'Inheritance & Protection'}
                  </h4>
                  <p className="text-xs leading-relaxed" style={{ color: c.textMuted }}>
                    {isZh ? selectedItem.inheritance_zh : selectedItem.inheritance_en}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <SiteFooter />
    </div>
  );
}