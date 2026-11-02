import type { FortuneDimensionKey } from './dimensions';
import type { WuxingElement } from './chart-theme';

export type { WuxingElement } from './chart-theme';

export interface BaseChartData {
  chartType: string;
  title: string;
  subtitle?: string;
}

export interface LifeFortuneTrendData extends BaseChartData {
  chartType: 'life_fortune_trend';
  data: {
    currentAge: number;
    currentYear: number;
    periods: Array<{
      label: string;
      startAge: number;
      endAge: number;
      startYear: number;
      endYear: number;
      scores: Partial<Record<FortuneDimensionKey, number>>;
      summary: string;
      highlights: string[];
      warnings: string[];
      yearlyScores?: Array<{ year: number; age: number; overall: number }>;
    }>;
    lifeHighlight: {
      bestPeriod: { label: string; ages: string; reason: string };
      currentStatus: string;
      nextTurningPoint: { age: number; direction: 'up' | 'down'; reason: string };
    };
  };
}

export interface FortuneRadarData extends BaseChartData {
  chartType: 'fortune_radar';
  data: {
    period: string;
    scores: Partial<Record<FortuneDimensionKey, {
      score: number;
      label: string;
      trend: 'up' | 'down' | 'stable';
    }>>;
    previousScores?: Partial<Record<FortuneDimensionKey, number>>;
    overallScore: number;
    overallLabel: string;
    topAdvice: string;
  };
}

export interface FortuneCalendarData extends BaseChartData {
  chartType: 'fortune_calendar';
  data: {
    year: number;
    month: number;
    days: Array<{
      date: number;
      overallScore: number;
      level: string;
      highlight: string | null;
    }>;
    monthSummary: {
      bestDays: number[];
      cautionDays: number[];
      luckyDayCount: number;
      normalDayCount: number;
      cautionDayCount: number;
    };
  };
}

export interface WuxingElementData {
  strength: number;
  level: string;
  stars: string[];
}

export interface WuxingInteraction {
  from: WuxingElement;
  to: WuxingElement;
  type: string;
  impact: string;
}

export interface WuxingEnergyData extends BaseChartData {
  chartType: 'wuxing_energy';
  data: {
    elements: Record<WuxingElement, WuxingElementData>;
    favorableElement: WuxingElement;
    unfavorableElement: WuxingElement;
    advice: string;
    interactions: WuxingInteraction[];
  };
}

export interface LifeTimelineMilestone {
  age: number;
  year: number;
  label: string;
  type: 'positive' | 'negative' | 'neutral' | 'turning' | 'peak';
  icon: string;
  summary: string;
  detail: string | null;
}

export interface LifeTimelineData extends BaseChartData {
  chartType: 'life_timeline';
  data: {
    currentAge: number;
    milestones: LifeTimelineMilestone[];
  };
}

export interface CompatibilityGaugeData extends BaseChartData {
  chartType: 'compatibility_gauge';
  data: {
    overallScore: number;
    overallLabel: string;
    dimensions: Array<{
      key: string;
      label: string;
      score: number;
      detail: string;
    }>;
    highlights: string[];
    challenges: string[];
    advice: string;
  };
}

export interface DivinationVerdictData extends BaseChartData {
  chartType: 'divination_verdict';
  data: {
    verdict: string;
    verdictScore: number;
    confidence: 'high' | 'medium' | 'low';
    question: string;
    keyFactors: Array<{
      factor: string;
      impact: 'positive' | 'negative' | 'neutral';
      detail: string;
    }>;
    timeline: Array<{
      time: string;
      event: string;
      advice: string;
    }>;
    actionAdvice: string;
  };
}

export interface YearlySparklinesData extends BaseChartData {
  chartType: 'yearly_sparklines';
  data: {
    year: number;
    dimensions: Array<{
      key: FortuneDimensionKey;
      label: string;
      currentScore: number;
      trend: 'up' | 'down' | 'stable';
      monthlyScores: number[];
    }>;
  };
}

export interface FortuneComparisonData extends BaseChartData {
  chartType: 'fortune_comparison';
  data: {
    periodA: { label: string; year: number };
    periodB: { label: string; year: number };
    dimensions: Array<{
      key: FortuneDimensionKey;
      label: string;
      scoreA: number;
      scoreB: number;
      change: string;
    }>;
    summary: string;
  };
}

export type ChartData =
  | LifeFortuneTrendData
  | FortuneRadarData
  | FortuneCalendarData
  | WuxingEnergyData
  | LifeTimelineData
  | CompatibilityGaugeData
  | DivinationVerdictData
  | YearlySparklinesData
  | FortuneComparisonData;

export type ChartType = ChartData['chartType'];