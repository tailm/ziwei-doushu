export type Gender = 'male' | 'female';
export type CalendarType = 'solar' | 'lunar';
export type DetailLevel = 'default' | 'more' | 'full';

export interface BirthTimeInput {
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  birthHour: number;
  birthMinute?: number;
  calendarType?: CalendarType;
  isLeapMonth?: boolean;
  timezone?: string;
  disambiguation?: 'reject' | 'earlier' | 'later' | 'compatible';
}

export interface BaziInput extends BirthTimeInput {
  gender: Gender;
  birthPlace?: string;
  longitude?: number;
  dayBoundary?: 'midnight' | 'zi';
}

export interface HiddenStemInfo {
  stem: string;
  qiType: '本气' | '中气' | '余气';
  tenGod: string;
}

export interface GlobalKongWangInfo {
  xun: string;
  kongZhi: [string, string];
}

export interface PillarKongWangInfo {
  isKong: boolean;
}

export type PillarPosition = '年支' | '月支' | '日支' | '时支';
export type StemPosition = '年干' | '月干' | '日干' | '时干';

export interface PillarRelation {
  type: '合' | '冲' | '刑' | '害';
  pillars: PillarPosition[];
  description: string;
}

export interface TianGanWuHeItem {
  stemA: string;
  stemB: string;
  resultElement: string;
  positions: [StemPosition, StemPosition];
}

export interface DiZhiBanHeItem {
  branches: [string, string];
  resultElement: string;
  missingBranch: string;
  positions: PillarPosition[];
}

export interface TianGanChongKeItem {
  stemA: string;
  stemB: string;
  positions: [StemPosition, StemPosition];
}

export interface DiZhiSanHuiItem {
  branches: [string, string, string];
  resultElement: string;
  positions: PillarPosition[];
}

export interface TrueSolarTimeInfo {
  clockTime: string;
  trueSolarTime: string;
  longitude: number;
  correctionMinutes: number;
  trueTimeIndex: number;
  dayOffset: number;
  timezone?: string;
  utcOffsetMinutes?: number;
  equationOfTimeMinutes?: number;
  ruleVersion?: string;
}

export interface PillarInfo {
  stem: string;
  branch: string;
  tenGod?: string;
  hiddenStems: HiddenStemInfo[];
  naYin?: string;
  diShi?: string;
  shenSha: string[];
  kongWang: PillarKongWangInfo;
}

export interface BaziFiveElementsStats {
  金: number;
  木: number;
  水: number;
  火: number;
  土: number;
}

export interface BaziOutput {
  gender: Gender;
  birthPlace?: string;
  dayMaster: string;
  kongWang: GlobalKongWangInfo;
  fourPillars: {
    year: PillarInfo;
    month: PillarInfo;
    day: PillarInfo;
    hour: PillarInfo;
  };
  relations: PillarRelation[];
  tianGanWuHe: TianGanWuHeItem[];
  tianGanChongKe: TianGanChongKeItem[];
  diZhiBanHe: DiZhiBanHeItem[];
  diZhiSanHui: DiZhiSanHuiItem[];
  taiYuan?: string;
  mingGong?: string;
  trueSolarTimeInfo?: TrueSolarTimeInfo;
  calculationOptions?: {
    dayBoundary: 'midnight' | 'zi';
    timezone: string;
    solarTermBasis: 'instant';
    disambiguation?: BirthTimeInput['disambiguation'];
    ruleVersion?: string;
  };
}

export interface BaziShenShaOutput {
  jiShen: string[];
  xiongSha: string[];
  dayYi: string[];
  dayJi: string[];
  pillarShenSha: {
    year: string[];
    month: string[];
    day: string[];
    hour: string[];
  };
  warnings?: string[];
}

export interface BaziLiuYueInfo {
  month: number;
  ganZhi: string;
  jieQi: string;
  startDate: string;
  endDate: string;
  startDateTime?: string;
  endDateTime?: string;
  endExclusive?: boolean;
  timezone?: string;
  gan?: string;
  zhi?: string;
  tenGod?: string;
  hiddenStems?: HiddenStemInfo[];
  naYin?: string;
  diShi?: string;
  shenSha?: string[];
}

export interface BaziLiuRiInfo {
  date: string;
  day: number;
  ganZhi: string;
  gan: string;
  zhi: string;
  tenGod?: string;
  hiddenStems?: HiddenStemInfo[];
  naYin?: string;
  diShi?: string;
  shenSha?: string[];
}

export interface BranchRelation {
  type: '六合' | '六冲' | '三合' | '相刑' | '相害';
  branches: string[];
  description: string;
}

export interface LiunianInfo {
  year: number;
  age: number;
  ganZhi: string;
  gan: string;
  zhi: string;
  tenGod: string;
  nayin: string;
  hiddenStems: HiddenStemInfo[];
  diShi: string;
  shenSha: string[];
  branchRelations: BranchRelation[];
  taiSui: string[];
}

export interface XiaoyunInfo {
  age: number;
  ganZhi: string;
  tenGod: string;
}

export interface DayunInput extends BaziInput {
  yunSect?: 1 | 2;
}

export interface DayunOutput {
  startAge: number;
  startAgeDetail: string;
  startSolar?: string;
  direction?: 'forward' | 'backward';
  yunSect?: 1 | 2;
  dayBoundary?: 'midnight' | 'zi';
  trueSolarTimeInfo?: TrueSolarTimeInfo;
  calculationOptions?: Record<string, unknown>;
  xiaoYun: XiaoyunInfo[];
  list: Array<{
    startYear: number;
    startAge: number;
    ganZhi: string;
    stem: string;
    branch: string;
    tenGod: string;
    branchTenGod: string;
    hiddenStems: HiddenStemInfo[];
    naYin: string;
    diShi: string;
    shenSha: string[];
    branchRelations: BranchRelation[];
    liunianList: LiunianInfo[];
  }>;
}

export interface ShenShaContext {
  yearStem: string;
  yearBranch: string;
  monthStem: string;
  monthBranch: string;
  dayStem: string;
  dayBranch: string;
  hourStem: string;
  hourBranch: string;
  kongWang?: { xun: string; kongZhi: [string, string] };
  yearNaYinElement?: string;
}

export type ShenShaPillarPosition = 'year' | 'month' | 'day' | 'hour';

export interface PillarShenShaByPosition {
  year: string[];
  month: string[];
  day: string[];
  hour: string[];
}