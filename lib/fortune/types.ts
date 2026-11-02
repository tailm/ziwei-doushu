export type HeavenlyStem = string;
export type FiveElement = string;
export type FortuneLevel = '大吉' | '吉' | '中吉' | '平' | '小凶' | '凶';

export interface FortuneLevels {
  overall: FortuneLevel;
  career: FortuneLevel;
  love: FortuneLevel;
  wealth: FortuneLevel;
  health: FortuneLevel;
  social: FortuneLevel;
}

export interface FortuneChartScores {
  overall: number;
  career: number;
  love: number;
  wealth: number;
  health: number;
  social: number;
}

export interface DailyFortune extends FortuneLevels {
  date: string;
  dayStem: HeavenlyStem;
  dayBranch: string;
  tenGod: string;
  advice: string[];
  luckyColor: string;
  luckyDirection: string;
  _chart: FortuneChartScores;
}

export interface MonthlyFortune extends FortuneLevels {
  year: number;
  month: number;
  monthStem: HeavenlyStem;
  monthBranch: string;
  tenGod: string;
  summary: string;
  keyDates: { date: number; desc: string; type?: 'lucky' | 'warning' | 'turning' }[];
  _chart: FortuneChartScores;
}

export interface EnhancedKeyDate {
  date: number;
  type: 'lucky' | 'warning' | 'turning' | 'peak' | 'valley';
  levels: FortuneLevels;
  summary: string;
  recommendation: string;
}

export type InterpretationMode = 'colloquial' | 'professional' | 'technical';
export interface CalendarAlmanacData {
  solarDate: string;
  solarDateChinese: string;
  weekday: string;
  lunarDate: string;
  lunarMonthDay: string;
  shengXiao: { year: string; month: string; day: string };
  ganZhi: { year: string; month: string; day: string; time: string };
  naYin: { year: string; month: string; day: string };
  jieQi: {
    current: { name: string; date: string; time: string } | null;
    next: { name: string; date: string; time: string } | null;
  };
  yi: string[];
  ji: string[];
  jiShen: string[];
  xiongSha: string[];
  chongSha: { chong: string; sha: string };
  kongWang: string;
  taiShen: string;
  zhiShen: string;
  shenWei: { caiShen: string; xiShen: string; fuShen: string; yangGuiShen: string };
  xiu: { name: string; gong: string; luck: string };
  yueXiang: string;
  liuYao: string;
  jiuXing: string;
  wuHou: string;
}