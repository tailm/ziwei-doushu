import { Lunar, LunarMonth, LunarYear, Solar } from 'lunar-javascript';
import type {
  BaziInput, BaziOutput, BaziFiveElementsStats, BaziShenShaOutput,
  BaziLiuYueInfo, BaziLiuRiInfo, PillarInfo, PillarRelation,
  PillarPosition, StemPosition, TianGanWuHeItem, DiZhiBanHeItem,
  TianGanChongKeItem, DiZhiSanHuiItem, HiddenStemInfo,
  PillarKongWangInfo, TrueSolarTimeInfo,
} from './types';
import {
  TIAN_GAN, DI_ZHI, STEM_ELEMENTS, ZHI_WUXING, GAN_WUXING,
  NA_YIN_TABLE, HIDDEN_STEM_DETAILS, LIU_HE, LIU_HE_HUA, SAN_HE,
  LIU_CHONG, XIANG_HAI, XIANG_XING,
  TIAN_YI_GUI_REN, TAI_JI_GUI_REN, LU_SHEN, YANG_REN, WEN_CHANG,
  JIN_YU, TIAN_CHU, GUO_YIN, CI_GUAN, LIU_XIA, HONG_YAN, FEI_REN, FU_XING,
  YI_MA, TAO_HUA, HUA_GAI, JIE_SHA, WANG_SHEN,
  GU_CHEN, GUA_SU, JIANG_XING, HONG_LUAN, TIAN_XI, DIAO_KE, SANG_MEN, ZAI_SHA,
  calculateTenGod, getDiShi, getKongWang, getElementRelation,
} from './data';
import { calculatePillarShenSha, calculateBranchShenSha } from './shensha';

const DEFAULT_DIVINATION_TIMEZONE = 'Asia/Shanghai';

export function getNaYin(stem: string, branch: string): string {
  return NA_YIN_TABLE[`${stem}${branch}`] || '';
}

export function getNaYinElement(nayin: string): string {
  if (!nayin) return '';
  const last = nayin.charAt(nayin.length - 1);
  return ['金', '木', '水', '火', '土'].includes(last) ? last : '';
}

export function calculateBaziFiveElementsStats(
  fourPillars: BaziOutput['fourPillars'],
): BaziFiveElementsStats {
  const stats: BaziFiveElementsStats = { 金: 0, 木: 0, 水: 0, 火: 0, 土: 0 };
  const hiddenStemWeights = [0.6, 0.3, 0.1];
  const pillars = [fourPillars.year, fourPillars.month, fourPillars.day, fourPillars.hour];

  for (const pillar of pillars) {
    const stemElement = STEM_ELEMENTS[pillar.stem];
    if (stemElement && stemElement in stats) {
      stats[stemElement as keyof BaziFiveElementsStats] += 1;
    }
    const branchElement = ZHI_WUXING[pillar.branch];
    if (branchElement && branchElement in stats) {
      stats[branchElement as keyof BaziFiveElementsStats] += 1;
    }
    for (let i = 0; i < pillar.hiddenStems.length; i++) {
      const hiddenStem = pillar.hiddenStems[i]?.stem;
      const hiddenElement = hiddenStem ? STEM_ELEMENTS[hiddenStem] : '';
      const weight = hiddenStemWeights[i] ?? 0.1;
      if (hiddenElement && hiddenElement in stats) {
        stats[hiddenElement as keyof BaziFiveElementsStats] += weight;
      }
    }
  }

  for (const key of Object.keys(stats) as Array<keyof BaziFiveElementsStats>) {
    stats[key] = Math.round(stats[key] * 10) / 10;
  }

  return stats;
}

export function buildHiddenStems(branch: string, dayStem: string): HiddenStemInfo[] {
  const stems = HIDDEN_STEM_DETAILS[branch] || [];
  return stems.map((item) => ({
    stem: item.stem,
    qiType: item.qiType,
    tenGod: calculateTenGod(dayStem, item.stem),
  }));
}

function buildPillarKongWang(branch: string, kongWang: { xun: string; kongZhi: [string, string] }): PillarKongWangInfo {
  return { isKong: kongWang.kongZhi.includes(branch) };
}

function createPillar(stem: string, branch: string, dayStem: string): PillarInfo {
  return {
    stem,
    branch,
    tenGod: calculateTenGod(dayStem, stem),
    hiddenStems: buildHiddenStems(branch, dayStem),
    naYin: getNaYin(stem, branch),
    diShi: getDiShi(dayStem, branch),
    shenSha: [],
    kongWang: { isKong: false },
  };
}

const PILLAR_POSITION_MAP: Record<string, PillarPosition> = {
  year: '年支', month: '月支', day: '日支', hour: '时支',
  yearBranch: '年支', monthBranch: '月支', dayBranch: '日支', hourBranch: '时支',
  YearBranch: '年支', MonthBranch: '月支', DayBranch: '日支', HourBranch: '时支',
  年: '年支', 月: '月支', 日: '日支', 时: '年支',
  年柱: '年支', 月柱: '月支', 日柱: '日支', 时柱: '时支',
  年支: '年支', 月支: '月支', 日支: '日支', 时支: '时支',
};

function normalizePillarPosition(label: string): PillarPosition {
  const normalized = PILLAR_POSITION_MAP[label];
  if (!normalized) throw new Error(`无效的柱位标签: ${label}`);
  return normalized;
}

const TIAN_GAN_WU_HE_RESULT: Record<string, string> = {
  '甲己': '土', '己甲': '土',
  '乙庚': '金', '庚乙': '金',
  '丙辛': '水', '辛丙': '水',
  '丁壬': '木', '壬丁': '木',
  '戊癸': '火', '癸戊': '火',
};

function analyzeTianGanWuHe(
  yearStem: string, monthStem: string, dayStem: string, hourStem: string,
): TianGanWuHeItem[] {
  const stems = [yearStem, monthStem, dayStem, hourStem];
  const stemNames: StemPosition[] = ['年干', '月干', '日干', '时干'];
  const result: TianGanWuHeItem[] = [];
  for (let i = 0; i < stems.length; i++) {
    for (let j = i + 1; j < stems.length; j++) {
      const pair = `${stems[i]}${stems[j]}`;
      const element = TIAN_GAN_WU_HE_RESULT[pair];
      if (element) {
        result.push({
          stemA: stems[i], stemB: stems[j],
          resultElement: element,
          positions: [stemNames[i], stemNames[j]],
        });
      }
    }
  }
  return result;
}

const BAN_HE_PAIRS: Array<{ pair: [string, string]; missing: string; element: string }> = [
  { pair: ['申', '子'], missing: '辰', element: '水' },
  { pair: ['子', '辰'], missing: '申', element: '水' },
  { pair: ['亥', '卯'], missing: '未', element: '木' },
  { pair: ['卯', '未'], missing: '亥', element: '木' },
  { pair: ['寅', '午'], missing: '戌', element: '火' },
  { pair: ['午', '戌'], missing: '寅', element: '火' },
  { pair: ['巳', '酉'], missing: '丑', element: '金' },
  { pair: ['酉', '丑'], missing: '巳', element: '金' },
];

function analyzeDiZhiBanHe(
  yearBranch: string, monthBranch: string, dayBranch: string, hourBranch: string,
): DiZhiBanHeItem[] {
  const branches = [yearBranch, monthBranch, dayBranch, hourBranch];
  const pillarNames: PillarPosition[] = ['年支', '月支', '日支', '时支'];
  const result: DiZhiBanHeItem[] = [];
  const seen = new Set<string>();

  for (const banHe of BAN_HE_PAIRS) {
    const [a, b] = banHe.pair;
    const positionsA = branches.map((br, i) => br === a ? i : -1).filter(i => i >= 0);
    const positionsB = branches.map((br, i) => br === b ? i : -1).filter(i => i >= 0);
    if (positionsA.length > 0 && positionsB.length > 0) {
      if (branches.includes(banHe.missing)) continue;
      const key = [a, b].sort().join('') + banHe.element;
      if (seen.has(key)) continue;
      seen.add(key);
      const positions = [...positionsA, ...positionsB].map(i => pillarNames[i]);
      result.push({
        branches: [a, b],
        resultElement: banHe.element,
        missingBranch: banHe.missing,
        positions,
      });
    }
  }
  return result;
}

const TIAN_GAN_CHONG_KE: Array<[string, string]> = [
  ['甲', '庚'], ['乙', '辛'], ['丙', '壬'], ['丁', '癸'],
];

function analyzeTianGanChongKe(
  yearStem: string, monthStem: string, dayStem: string, hourStem: string,
): TianGanChongKeItem[] {
  const stems = [yearStem, monthStem, dayStem, hourStem];
  const stemNames: StemPosition[] = ['年干', '月干', '日干', '时干'];
  const result: TianGanChongKeItem[] = [];
  for (let i = 0; i < stems.length; i++) {
    for (let j = i + 1; j < stems.length; j++) {
      for (const [a, b] of TIAN_GAN_CHONG_KE) {
        if ((stems[i] === a && stems[j] === b) || (stems[i] === b && stems[j] === a)) {
          result.push({
            stemA: stems[i], stemB: stems[j],
            positions: [stemNames[i], stemNames[j]],
          });
        }
      }
    }
  }
  return result;
}

const SAN_HUI: Array<{ branches: [string, string, string]; element: string }> = [
  { branches: ['寅', '卯', '辰'], element: '木' },
  { branches: ['巳', '午', '未'], element: '火' },
  { branches: ['申', '酉', '戌'], element: '金' },
  { branches: ['亥', '子', '丑'], element: '水' },
];

function analyzeDiZhiSanHui(
  yearBranch: string, monthBranch: string, dayBranch: string, hourBranch: string,
): DiZhiSanHuiItem[] {
  const branches = [yearBranch, monthBranch, dayBranch, hourBranch];
  const pillarNames: PillarPosition[] = ['年支', '月支', '日支', '时支'];
  const result: DiZhiSanHuiItem[] = [];
  for (const hui of SAN_HUI) {
    const matchIndices = branches
      .map((b, i) => hui.branches.includes(b) ? i : -1)
      .filter(i => i >= 0);
    const matchedUnique = new Set(matchIndices.map(i => branches[i]));
    if (matchedUnique.size === 3) {
      result.push({
        branches: hui.branches,
        resultElement: hui.element,
        positions: matchIndices.map(i => pillarNames[i]),
      });
    }
  }
  return result;
}

function calculateTaiYuan(monthStem: string, monthBranch: string): string {
  const stemIdx = TIAN_GAN.indexOf(monthStem as typeof TIAN_GAN[number]);
  const branchIdx = DI_ZHI.indexOf(monthBranch as typeof DI_ZHI[number]);
  if (stemIdx < 0 || branchIdx < 0) return '';
  const newStem = TIAN_GAN[(stemIdx + 1) % 10];
  const newBranch = DI_ZHI[(branchIdx + 3) % 12];
  return `${newStem}${newBranch}`;
}

function calculateMingGong(yearStem: string, monthBranch: string, hourBranch: string): string {
  const maoIdx = DI_ZHI.indexOf('卯');
  const monthIdx = DI_ZHI.indexOf(monthBranch as typeof DI_ZHI[number]);
  const hourIdx = DI_ZHI.indexOf(hourBranch as typeof DI_ZHI[number]);
  if (monthIdx < 0 || hourIdx < 0) return '';

  const yinIdx = DI_ZHI.indexOf('寅');
  const monthNum = (monthIdx - yinIdx + 12) % 12 + 1;
  const mingBranchIdx = (maoIdx - (monthNum - 1) + hourIdx + 12 * 10) % 12;
  const mingBranch = DI_ZHI[mingBranchIdx];

  const WU_HU_DUN: Record<string, number> = {
    '甲': 2, '己': 2,
    '乙': 4, '庚': 4,
    '丙': 6, '辛': 6,
    '丁': 8, '壬': 8,
    '戊': 0, '癸': 0,
  };
  const baseStemIdx = WU_HU_DUN[yearStem];
  if (baseStemIdx === undefined) return mingBranch;
  const offset = (mingBranchIdx - yinIdx + 12) % 12;
  const mingStem = TIAN_GAN[(baseStemIdx + offset) % 10];
  return `${mingStem}${mingBranch}`;
}

export function analyzePillarRelations(
  yearBranch: string, monthBranch: string, dayBranch: string, hourBranch: string,
): PillarRelation[] {
  const branches = [yearBranch, monthBranch, dayBranch, hourBranch];
  const pillarNames = ['year', 'month', 'day', 'hour'] as const;
  const relations: PillarRelation[] = [];

  for (let i = 0; i < branches.length; i++) {
    for (let j = i + 1; j < branches.length; j++) {
      if (LIU_HE[branches[i]] === branches[j]) {
        const huaElement = LIU_HE_HUA[branches[i]] || '';
        relations.push({
          type: '合',
          pillars: [normalizePillarPosition(pillarNames[i]), normalizePillarPosition(pillarNames[j])],
          description: `${branches[i]}${branches[j]}六合${huaElement ? '化' + huaElement : ''}`,
        });
      }
    }
  }

  for (const sanHe of SAN_HE) {
    const matchingBranches = branches.filter((b) => sanHe.branches.includes(b));
    const uniqueBranches = Array.from(new Set(matchingBranches));
    if (uniqueBranches.length >= 2) {
      const matchingPillars = branches
        .map((b, i) => (sanHe.branches.includes(b) ? normalizePillarPosition(pillarNames[i]) : null))
        .filter(Boolean) as PillarPosition[];
      if (uniqueBranches.length === 3) {
        relations.push({
          type: '合',
          pillars: matchingPillars,
          description: `${uniqueBranches.join('')}三合${sanHe.element}`,
        });
      } else {
        relations.push({
          type: '合',
          pillars: matchingPillars,
          description: `${uniqueBranches.join('')}半合${sanHe.element}`,
        });
      }
    }
  }

  for (let i = 0; i < branches.length; i++) {
    for (let j = i + 1; j < branches.length; j++) {
      if (LIU_CHONG[branches[i]] === branches[j]) {
        relations.push({
          type: '冲',
          pillars: [normalizePillarPosition(pillarNames[i]), normalizePillarPosition(pillarNames[j])],
          description: `${branches[i]}${branches[j]}相冲`,
        });
      }
    }
  }

  for (let i = 0; i < branches.length; i++) {
    for (let j = i + 1; j < branches.length; j++) {
      if (XIANG_HAI[branches[i]] === branches[j]) {
        relations.push({
          type: '害',
          pillars: [normalizePillarPosition(pillarNames[i]), normalizePillarPosition(pillarNames[j])],
          description: `${branches[i]}${branches[j]}相害`,
        });
      }
    }
  }

  for (const xing of XIANG_XING) {
    const matchingBranches = branches.filter((b) => xing.combination.includes(b));
    if (xing.combination.length === 1) {
      const count = branches.filter((b) => b === xing.combination[0]).length;
      if (count >= 2) {
        const matchingPillars = branches
          .map((b, i) => (b === xing.combination[0] ? normalizePillarPosition(pillarNames[i]) : null))
          .filter(Boolean) as PillarPosition[];
        relations.push({
          type: '刑',
          pillars: matchingPillars,
          description: xing.name,
        });
      }
    } else if (new Set(matchingBranches).size >= 2) {
      const matchingPillars = branches
        .map((b, i) => (xing.combination.includes(b) ? normalizePillarPosition(pillarNames[i]) : null))
        .filter(Boolean) as PillarPosition[];
      relations.push({
        type: '刑',
        pillars: matchingPillars,
        description: xing.name,
      });
    }
  }

  return relations;
}

type FortuneRuntimeContext = {
  dayStem: string;
  dayBranch: string;
  yearBranch: string;
};

export function calculateBaziFortuneShenSha(params: {
  targetBranch: string;
  dayStem: string;
  dayBranch: string;
  yearBranch: string;
}): string[] {
  const { targetBranch, dayStem, dayBranch, yearBranch } = params;
  const names: string[] = [];
  const addUnique = (name: string) => {
    if (name && !names.includes(name)) names.push(name);
  };

  if ((TIAN_YI_GUI_REN[dayStem] || []).includes(targetBranch)) addUnique('天乙贵人');
  if ((TAI_JI_GUI_REN[dayStem] || []).includes(targetBranch)) addUnique('太极贵人');
  if (LU_SHEN[dayStem] === targetBranch) addUnique('禄神');
  if (YANG_REN[dayStem] === targetBranch) addUnique('羊刃');
  if (WEN_CHANG[dayStem] === targetBranch) addUnique('文昌');
  if (JIN_YU[dayStem] === targetBranch) addUnique('金舆');
  if (TIAN_CHU[dayStem] === targetBranch) addUnique('天厨');
  if (GUO_YIN[dayStem] === targetBranch) addUnique('国印');
  if (CI_GUAN[dayStem] === targetBranch) addUnique('词馆');
  if (LIU_XIA[dayStem] === targetBranch) addUnique('流霞');
  if (HONG_YAN[dayStem] === targetBranch) addUnique('红艳');
  if (FEI_REN[dayStem] === targetBranch) addUnique('飞刃');
  if (FU_XING[dayStem] === targetBranch) addUnique('福星');

  if (YI_MA[dayBranch] === targetBranch) addUnique('驿马');
  if (TAO_HUA[dayBranch] === targetBranch) addUnique('桃花');
  if (HUA_GAI[dayBranch] === targetBranch) addUnique('华盖');
  if (JIE_SHA[dayBranch] === targetBranch) addUnique('劫煞');
  if (WANG_SHEN[dayBranch] === targetBranch) addUnique('亡神');

  if (GU_CHEN[yearBranch] === targetBranch) addUnique('孤辰');
  if (GUA_SU[yearBranch] === targetBranch) addUnique('寡宿');
  if (JIANG_XING[yearBranch] === targetBranch) addUnique('将星');
  if (HONG_LUAN[yearBranch] === targetBranch) addUnique('红鸾');
  if (TIAN_XI[yearBranch] === targetBranch) addUnique('天喜');
  if (DIAO_KE[yearBranch] === targetBranch) addUnique('吊客');
  if (SANG_MEN[yearBranch] === targetBranch) addUnique('丧门');
  if (ZAI_SHA[yearBranch] === targetBranch) addUnique('灾煞');

  return names;
}


export function calculateBaziLiuYueData(year: number, context?: FortuneRuntimeContext): BaziLiuYueInfo[] {
  const jieQiConfig = [
    { month: 2, jieQi: '立春' }, { month: 3, jieQi: '惊蛰' },
    { month: 4, jieQi: '清明' }, { month: 5, jieQi: '立夏' },
    { month: 6, jieQi: '芒种' }, { month: 7, jieQi: '小暑' },
    { month: 8, jieQi: '立秋' }, { month: 9, jieQi: '白露' },
    { month: 10, jieQi: '寒露' }, { month: 11, jieQi: '立冬' },
    { month: 12, jieQi: '大雪' }, { month: 1, jieQi: '小寒' },
  ] as const;

  const liuYue: BaziLiuYueInfo[] = [];
  const jieQiTable = Solar.fromYmd(year, 6, 15).getLunar().getJieQiTable();
  const nextYearJieQiTable = Solar.fromYmd(year + 1, 6, 15).getLunar().getJieQiTable();

  const formatYmd = (date: Date) => {
    const y = date.getUTCFullYear();
    const m = String(date.getUTCMonth() + 1).padStart(2, '0');
    const d = String(date.getUTCDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  for (let i = 0; i < 12; i++) {
    const config = jieQiConfig[i];
    const segmentYear = config.month === 1 ? year + 1 : year;
    const startTable = segmentYear === year ? jieQiTable : nextYearJieQiTable;
    const startSolar = startTable[config.jieQi];
    if (!startSolar) continue;

    const nextConfig = jieQiConfig[(i + 1) % 12];
    const nextSegmentYear = config.month === 1
      ? year + 1
      : (nextConfig.month === 1 ? year + 1 : year);
    const nextTable = nextSegmentYear === year ? jieQiTable : nextYearJieQiTable;
    const nextStartSolar = nextTable[nextConfig.jieQi];
    if (!nextStartSolar) continue;

    const startDate = new Date(Date.UTC(startSolar.getYear(), startSolar.getMonth() - 1, startSolar.getDay()));
    const endDate = new Date(startDate.getTime() - 24 * 60 * 60 * 1000);
    const monthLunar = startSolar.getLunar();
    const ganZhi = monthLunar.getMonthInGanZhiExact();
    const gan = ganZhi[0] || '';
    const zhi = ganZhi[1] || '';
    const hiddenStems = context ? buildHiddenStems(zhi, context.dayStem) : undefined;

    liuYue.push({
      month: i + 1,
      ganZhi,
      jieQi: config.jieQi,
      startDate: formatYmd(startDate),
      endDate: formatYmd(endDate),
      gan: gan || undefined,
      zhi: zhi || undefined,
      tenGod: context && gan ? calculateTenGod(context.dayStem, gan) : undefined,
      hiddenStems,
      naYin: gan && zhi ? getNaYin(gan, zhi) : undefined,
      diShi: context && zhi ? getDiShi(context.dayStem, zhi) : undefined,
      shenSha: context && zhi
        ? calculateBaziFortuneShenSha({
          targetBranch: zhi,
          dayStem: context.dayStem,
          dayBranch: context.dayBranch,
          yearBranch: context.yearBranch,
        })
        : undefined,
    });
  }

  return liuYue;
}

export function calculateBaziLiuRiData(startDate: string, endDate: string, context?: FortuneRuntimeContext): BaziLiuRiInfo[] {
  const start = new Date(startDate + 'T00:00:00Z');
  const end = new Date(endDate + 'T00:00:00Z');
  const days: BaziLiuRiInfo[] = [];

  for (let cursor = new Date(start); cursor <= end; cursor.setUTCDate(cursor.getUTCDate() + 1)) {
    const year = cursor.getUTCFullYear();
    const month = cursor.getUTCMonth() + 1;
    const day = cursor.getUTCDate();
    const solar = Solar.fromYmd(year, month, day);
    const lunar = solar.getLunar();
    const ganZhi = lunar.getDayInGanZhi();
    const gan = ganZhi[0] || '';
    const zhi = ganZhi[1] || '';
    const hiddenStems = context ? buildHiddenStems(zhi, context.dayStem) : undefined;

    days.push({
      date: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
      day,
      ganZhi,
      gan,
      zhi,
      tenGod: context && gan ? calculateTenGod(context.dayStem, gan) : undefined,
      hiddenStems,
      naYin: gan && zhi ? getNaYin(gan, zhi) : undefined,
      diShi: context && zhi ? getDiShi(context.dayStem, zhi) : undefined,
      shenSha: context && zhi
        ? calculateBaziFortuneShenSha({
          targetBranch: zhi,
          dayStem: context.dayStem,
          dayBranch: context.dayBranch,
          yearBranch: context.yearBranch,
        })
        : undefined,
    });
  }

  return days;
}

export function resolveBaziCalendarContext(input: BaziInput): {
  solar: ReturnType<typeof Solar.fromYmdHms>;
  lunar: ReturnType<typeof Lunar.fromYmdHms>;
  termLunar: ReturnType<typeof Lunar.fromYmdHms>;
  trueSolarTimeInfo?: TrueSolarTimeInfo;
} {
  const {
    birthYear, birthMonth, birthDay, birthHour, birthMinute = 0,
    calendarType = 'solar', isLeapMonth = false, longitude,
  } = input;

  let solar: ReturnType<typeof Solar.fromYmdHms>;
  let lunar: ReturnType<typeof Lunar.fromYmdHms>;

  if (calendarType === 'lunar') {
    const lunarMonth = isLeapMonth ? -Math.abs(birthMonth) : birthMonth;
    lunar = Lunar.fromYmdHms(birthYear, lunarMonth, birthDay, birthHour, birthMinute, 0);
    solar = lunar.getSolar();
  } else {
    solar = Solar.fromYmdHms(birthYear, birthMonth, birthDay, birthHour, birthMinute, 0);
    lunar = solar.getLunar();
  }

  const termLunar = solar.getLunar();

  let trueSolarTimeInfo: TrueSolarTimeInfo | undefined;
  if (longitude != null) {
    const utcOffsetMinutes = 8 * 60;
    const longitudeCorrection = longitude * 4 - utcOffsetMinutes;
    const totalCorrectionMinutes = longitudeCorrection;
    const correctedMinutes = birthHour * 60 + birthMinute + totalCorrectionMinutes;
    const dayOffset = Math.floor(correctedMinutes / 1440);
    const remainingMinutes = ((correctedMinutes % 1440) + 1440) % 1440;
    const correctedHour = Math.floor(remainingMinutes / 60);
    const correctedMinute = Math.floor(remainingMinutes % 60);

    trueSolarTimeInfo = {
      clockTime: `${String(birthHour).padStart(2, '0')}:${String(birthMinute).padStart(2, '0')}`,
      trueSolarTime: `${String(correctedHour).padStart(2, '0')}:${String(correctedMinute).padStart(2, '0')}`,
      longitude,
      correctionMinutes: Math.round(totalCorrectionMinutes * 10) / 10,
      trueTimeIndex: correctedHour >= 23 ? 12 : correctedHour < 1 ? 0 : Math.floor((correctedHour + 1) / 2),
      dayOffset,
      timezone: DEFAULT_DIVINATION_TIMEZONE,
      utcOffsetMinutes,
      ruleVersion: 'simplified-2026.10',
    };

    if (dayOffset !== 0) {
      const adjustedDate = new Date(Date.UTC(birthYear, birthMonth - 1, birthDay + dayOffset));
      solar = Solar.fromYmdHms(
        adjustedDate.getUTCFullYear(),
        adjustedDate.getUTCMonth() + 1,
        adjustedDate.getUTCDate(),
        correctedHour,
        correctedMinute,
        0,
      );
      lunar = solar.getLunar();
    }
  }

  return { solar, lunar, termLunar, trueSolarTimeInfo };
}

export function calculateBaziData(input: BaziInput): BaziOutput {
  const { gender, birthPlace } = input;
  const { lunar, termLunar, trueSolarTimeInfo } = resolveBaziCalendarContext(input);

  const eightChar = lunar.getEightChar();
  eightChar.setSect(input.dayBoundary === 'zi' ? 1 : 2);
  const termEightChar = termLunar.getEightChar();
  termEightChar.setSect(input.dayBoundary === 'zi' ? 1 : 2);

  const yearStem = termEightChar.getYearGan();
  const yearBranch = termEightChar.getYearZhi();
  const monthStem = termEightChar.getMonthGan();
  const monthBranch = termEightChar.getMonthZhi();
  const dayStem = eightChar.getDayGan();
  const dayBranch = eightChar.getDayZhi();
  const hourStem = eightChar.getTimeGan();
  const hourBranch = eightChar.getTimeZhi();

  const kongWang = getKongWang(dayStem, dayBranch);
  const yearNaYin = getNaYin(yearStem, yearBranch);
  const yearNaYinElement = getNaYinElement(yearNaYin);

  const pillarShenSha = calculatePillarShenSha({
    yearStem, yearBranch, monthStem, monthBranch,
    dayStem, dayBranch, hourStem, hourBranch,
    kongWang, yearNaYinElement,
  });

  const fourPillars = {
    year: {
      ...createPillar(yearStem, yearBranch, dayStem),
      shenSha: pillarShenSha.year,
      kongWang: buildPillarKongWang(yearBranch, kongWang),
    },
    month: {
      ...createPillar(monthStem, monthBranch, dayStem),
      shenSha: pillarShenSha.month,
      kongWang: buildPillarKongWang(monthBranch, kongWang),
    },
    day: {
      ...createPillar(dayStem, dayBranch, dayStem),
      shenSha: pillarShenSha.day,
      kongWang: buildPillarKongWang(dayBranch, kongWang),
    },
    hour: {
      ...createPillar(hourStem, hourBranch, dayStem),
      shenSha: pillarShenSha.hour,
      kongWang: buildPillarKongWang(hourBranch, kongWang),
    },
  };

  fourPillars.day.tenGod = undefined;

  const relations = analyzePillarRelations(yearBranch, monthBranch, dayBranch, hourBranch);
  const tianGanWuHe = analyzeTianGanWuHe(yearStem, monthStem, dayStem, hourStem);
  const tianGanChongKe = analyzeTianGanChongKe(yearStem, monthStem, dayStem, hourStem);
  const diZhiBanHe = analyzeDiZhiBanHe(yearBranch, monthBranch, dayBranch, hourBranch);
  const diZhiSanHui = analyzeDiZhiSanHui(yearBranch, monthBranch, dayBranch, hourBranch);
  const taiYuan = calculateTaiYuan(monthStem, monthBranch);
  const mingGong = calculateMingGong(yearStem, monthBranch, hourBranch);

  return {
    gender,
    birthPlace,
    dayMaster: dayStem,
    kongWang,
    fourPillars,
    relations,
    tianGanWuHe,
    tianGanChongKe,
    diZhiBanHe,
    diZhiSanHui,
    taiYuan: taiYuan || undefined,
    mingGong: mingGong || undefined,
    trueSolarTimeInfo,
    calculationOptions: {
      dayBoundary: input.dayBoundary ?? 'midnight',
      timezone: input.timezone ?? DEFAULT_DIVINATION_TIMEZONE,
      solarTermBasis: 'instant',
      disambiguation: input.disambiguation ?? 'reject',
      ruleVersion: 'bazi-2026.10',
    },
  };
}

export function calculateBaziShenShaData(input: BaziInput): BaziShenShaOutput {
  const coreBazi = calculateBaziData(input);
  const { lunar } = resolveBaziCalendarContext(input);

  let jiShen: string[] = [];
  let xiongSha: string[] = [];
  let dayYi: string[] = [];
  let dayJi: string[] = [];
  const warnings: string[] = [];

  try { jiShen = lunar.getDayJiShen() || []; } catch (e) { warnings.push(`吉神数据获取失败: ${e instanceof Error ? e.message : String(e)}`); }
  try { xiongSha = lunar.getDayXiongSha() || []; } catch (e) { warnings.push(`凶煞数据获取失败: ${e instanceof Error ? e.message : String(e)}`); }
  try { dayYi = lunar.getDayYi() || []; } catch (e) { warnings.push(`日宜数据获取失败: ${e instanceof Error ? e.message : String(e)}`); }
  try { dayJi = lunar.getDayJi() || []; } catch (e) { warnings.push(`日忌数据获取失败: ${e instanceof Error ? e.message : String(e)}`); }

  const pillarShenSha = calculatePillarShenSha({
    yearStem: coreBazi.fourPillars.year.stem,
    yearBranch: coreBazi.fourPillars.year.branch,
    monthStem: coreBazi.fourPillars.month.stem,
    monthBranch: coreBazi.fourPillars.month.branch,
    dayStem: coreBazi.fourPillars.day.stem,
    dayBranch: coreBazi.fourPillars.day.branch,
    hourStem: coreBazi.fourPillars.hour.stem,
    hourBranch: coreBazi.fourPillars.hour.branch,
    kongWang: {
      xun: coreBazi.kongWang.xun,
      kongZhi: [...coreBazi.kongWang.kongZhi] as [string, string],
    },
    yearNaYinElement: getNaYinElement(coreBazi.fourPillars.year.naYin || ''),
  });

  return {
    jiShen,
    xiongSha,
    dayYi,
    dayJi,
    pillarShenSha,
    ...(warnings.length > 0 ? { warnings } : {}),
  };
}