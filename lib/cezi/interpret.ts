import type { CeziResult, FiveElement, CharacterStructure, FortuneLevel, RadicalInfo } from './types';
import { RADICAL_ELEMENT_MAP, RADICAL_INFO, STROKE_FORTUNE_81, FIVE_ELEMENT_ATTR } from './data';

const COMMON_RADICALS = [
  '钅', '金', '木', '水', '氵', '火', '灬', '土', '日', '月', '山', '石', '田',
  '人', '亻', '口', '心', '忄', '手', '扌', '女', '子', '言', '讠', '刀', '刂',
  '力', '目', '耳', '足', '⻊', '车', '马', '鸟', '鱼', '虫', '艹', '竹', '禾',
  '米', '门', '广', '雨', '风', '衣', '衤', '贝', '示', '礻', '病', '疒', '穴',
  '王', '玉', '弓', '戈', '斗', '寸', '页', '骨', '血', '舟', '户', '厂', '立',
  '止', '邑', '阝', '斤', '矢', '白', '黑', '赤', '青', '黄', '色', '音', '香',
  '革', '韦', '瓦', '皿', '缶', '网', '糸', '纟', '老', '而', '至', '臼', '角',
  '麦', '韭', '鼓', '鼠', '鹿', '鬼', '走', '辶', '彳', '歹', '殳', '攵', '夂',
  '欠', '殸', '缶', '耒', '糸', '罒', '老', '而', '羽', '缶', '舌', '竹', '臼',
  '舟', '艮', '豕', '隶', '隹', '雨', '非', '面', '革', '韋', '音', '頁', '風',
  '飛', '食', '首', '香', '馬', '骨', '鬼', '魚', '鳥', '鹿', '麥', '麻', '黃',
  '黍', '黑', '鼎', '鼓', '鼠', '鼻', '齒',
];

function detectRadical(char: string): string {
  if (char.length === 0) return '';
  const firstChar = char[0];
  for (const radical of COMMON_RADICALS) {
    if (firstChar === radical) return radical;
  }
  if (char.length >= 2) {
    for (const radical of COMMON_RADICALS) {
      if (char.startsWith(radical)) return radical;
    }
  }
  const code = firstChar.charCodeAt(0);
  if (code >= 0x4e00 && code <= 0x9fff) {
    return firstChar;
  }
  return firstChar;
}

function detectStructure(char: string): CharacterStructure {
  if (char.length === 0) return '独体';
  if (char.length === 1) {
    const c = char[0];
    if (COMMON_RADICALS.includes(c)) return '独体';
    return '独体';
  }
  if (char.length === 2) return '左右';
  if (char.length === 3) return '左中右';
  if (char.length === 4) {
    if (char[0] === char[1] && char[2] === char[3]) return '品字';
    return '上下';
  }
  return '上下';
}

function getRadicalElement(radical: string): FiveElement {
  return RADICAL_ELEMENT_MAP[radical] ?? '土';
}

function getRadicalInfo(radical: string): RadicalInfo {
  return RADICAL_INFO[radical] ?? { radical, element: getRadicalElement(radical), meaning: '未知偏旁' };
}

function getStrokeFortune(strokes: number): { level: FortuneLevel; desc: string } {
  const mod = strokes > 81 ? (strokes % 80) + 1 : strokes;
  const entry = STROKE_FORTUNE_81[mod] ?? STROKE_FORTUNE_81[1];
  const levelMap: Record<string, FortuneLevel> = {
    '大吉': '大吉', '吉': '吉', '中吉': '中吉', '平': '平', '小凶': '小凶', '凶': '凶',
  };
  return { level: levelMap[entry.level] ?? '平', desc: entry.desc };
}

function generateInterpretation(
  char: string,
  radical: string,
  element: FiveElement,
  structure: CharacterStructure,
  strokeFortune: { level: FortuneLevel; desc: string },
  radicalInfo: RadicalInfo,
): string {
  const parts: string[] = [];

  parts.push(`「${char}」字以「${radical}」为部首，五行属${element}，主${radicalInfo.meaning}。`);

  const structDesc: Record<CharacterStructure, string> = {
    '独体': '字形独立完整，自成一体，主个性鲜明、独立自主',
    '左右': '字形左右相称，阴阳调和，主人际关系和谐、内外兼顾',
    '上下': '字形上下相承，根基稳固，主有根基有传承、承上启下',
    '左中右': '字形三段并列，变化丰富，主多才多艺、灵活变通',
    '上中下': '字形三层叠起，层次分明，主循序渐进、步步高升',
    '半包围': '字形半围半开，内外有别，主有庇护有空间、守中有进',
    '全包围': '字形全围闭合，内敛含蓄，主收藏蓄积、厚积薄发',
    '品字': '字形品叠成形，三才齐备，主人才汇聚、众星拱月',
  };
  parts.push(structDesc[structure] + '。');

  parts.push(`笔画数${strokeFortune.desc}。`);

  const elemAttr = FIVE_ELEMENT_ATTR[element];
  parts.push(`五行${element}主${elemAttr.trait}，方位在${elemAttr.direction}。`);

  if (strokeFortune.level === '大吉' || strokeFortune.level === '吉') {
    parts.push('整体而言，此字吉兆明显，宜进取行事。');
  } else if (strokeFortune.level === '中吉' || strokeFortune.level === '平') {
    parts.push('整体而言，此字吉凶参半，宜稳中求进。');
  } else {
    parts.push('整体而言，此字需谨慎应对，宜守不宜进。');
  }

  return parts.join('');
}

function generateAdvice(
  element: FiveElement,
  strokeFortune: { level: FortuneLevel; desc: string },
  structure: CharacterStructure,
): string[] {
  const advice: string[] = [];
  const elemAttr = FIVE_ELEMENT_ATTR[element];

  if (strokeFortune.level === '大吉' || strokeFortune.level === '吉') {
    advice.push(`宜往${elemAttr.direction}方行事，顺应${element}气运`);
    advice.push('把握时机，积极进取，可成大事');
    if (structure === '左右' || structure === '上下') {
      advice.push('字形均衡，宜合作共事，借力成事');
    }
  } else if (strokeFortune.level === '中吉' || strokeFortune.level === '平') {
    advice.push(`宜守${elemAttr.direction}方，静待时机`);
    advice.push('稳扎稳打，不宜冒进，蓄势待发');
    advice.push('修身养性，提升内在，时机自至');
  } else {
    advice.push(`忌往${elemAttr.direction}方冒进，宜避其锋`);
    advice.push('守成为上，不宜大动，静守为安');
    advice.push('行善积德，化解不利，待时转运');
  }

  return advice;
}

export function interpretCharacter(char: string): CeziResult | null {
  if (!char || char.trim().length === 0) return null;

  const trimmed = char.trim();
  const firstChar = trimmed[0];

  if (firstChar.charCodeAt(0) < 0x4e00 || firstChar.charCodeAt(0) > 0x9fff) {
    return null;
  }

  const radical = detectRadical(firstChar);
  const radicalInfo = getRadicalInfo(radical);
  const element = getRadicalElement(radical);
  const structure = detectStructure(firstChar);

  const strokeCount = trimmed.length;
  const kangxiStrokes = strokeCount;
  const strokeFortune = getStrokeFortune(strokeCount);

  const interpretation = generateInterpretation(
    firstChar, radical, element, structure, strokeFortune, radicalInfo,
  );
  const advice = generateAdvice(element, strokeFortune, structure);

  return {
    character: firstChar,
    radical,
    radicalElement: element,
    strokeCount,
    kangxiStrokes,
    structure,
    element,
    meaning: radicalInfo.meaning,
    interpretation,
    fortuneLevel: strokeFortune.level,
    advice,
  };
}