'use client';
import { useState } from 'react';
import BirthForm from '@/components/BirthForm';
import ChartBoard from '@/components/ChartBoard';
import InsightPanel from '@/components/InsightPanel';
import TimeNav, { type TimeView } from '@/components/TimeNav';
import { generateChart } from '@/lib/ziwei/algorithm';
import type { BirthInfo, ZiweiChart, Palace } from '@/lib/ziwei/types';
import { useAuth } from '@/lib/auth/AuthContext';
import { useLang } from '@/lib/i18n/LanguageContext';
import { t } from '@/lib/i18n/translations';
import NavigationBar from '@/components/NavigationBar';
import SiteFooter from '@/components/SiteFooter';
import InsufficientCredits from '@/components/InsufficientCredits';

export default function ChartPage() {
  const [chart, setChart] = useState<ZiweiChart | null>(null);
  const [selectedPalace, setSelectedPalace] = useState<Palace | null>(null);
  const [view, setView] = useState<TimeView>('mingpan');
  const [liunianYear, setLiunianYear] = useState(() => new Date().getFullYear());
  const [creditsError, setCreditsError] = useState<string | null>(null);
  const { permissions, refreshPermissions } = useAuth();
  const { lang } = useLang();

  const handleChartGenerate = async (info: BirthInfo) => {
    setCreditsError(null);
    try {
      const res = await fetch('/api/credits/deduct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feature: 'chart' }),
      });
      if (res.status === 402) {
        const data = await res.json();
        setCreditsError(data.message || t('chart_insufficient', lang));
        return;
      }
      if (!res.ok) {
        setCreditsError(t('chart_failed', lang));
        return;
      }
      refreshPermissions();
    } catch {
      // 未登录用户也允许起盘（前端排盘引擎不依赖API）
    }
    setChart(generateChart(info));
  };

  // ── 未起盘：展示出生信息表单 ──
  if (!chart) {
    return (
      <>
        <NavigationBar />
        <main style={{ maxWidth: 720, margin: '0 auto', padding: '80px 20px 48px' }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>{t('chart_page_title', lang)}</h1>
        <p style={{ color: '#888', marginBottom: 32, fontSize: 14, lineHeight: 1.7 }}>
          {t('chart_page_desc', lang)}
        </p>
        {permissions && permissions.credits !== undefined && (
          <div style={{ marginBottom: 16, padding: '8px 14px', borderRadius: 10, background: 'rgba(184,146,42,0.08)', border: '1px solid rgba(184,146,42,0.2)', fontSize: 13, color: 'var(--ac)' }}>
            {t('chart_credits_info', lang)}: {permissions.credits} · {t('chart_cost_20', lang)}
    </div>
        )}
        {creditsError && (
          <div style={{ marginBottom: 16 }}>
            <InsufficientCredits message={creditsError} />
    </div>
        )}
        <BirthForm onSubmit={handleChartGenerate} />
      </main>
      </>
    );
  }

  // ── 已起盘：命盘 + 解读 ──
  return (
    <>
      <NavigationBar />
      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '80px 16px 24px' }}>
      <button
        type="button"
        onClick={() => { setChart(null); setSelectedPalace(null); setCreditsError(null); }}
        style={{
          marginBottom: 16, padding: '6px 14px', cursor: 'pointer',
          border: '1px solid #ccc', borderRadius: 8, background: 'transparent',
        }}
      >
        {t('chart_rechart', lang)}
      </button>

      <TimeNav
        chart={chart}
        view={view}
        liunianYear={liunianYear}
        onViewChange={setView}
        onYearChange={setLiunianYear}
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 380px)',
          gap: 20, marginTop: 16, alignItems: 'start',
        }}
      >
        <ChartBoard chart={chart} onPalaceSelect={setSelectedPalace} />
        <InsightPanel chart={chart} selectedPalace={selectedPalace} />
    </div>
    </main>
    <SiteFooter />
    </>
  );
}
