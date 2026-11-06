import cnchar from 'cnchar-all';
import type { CeziResult, FiveElement, CharacterStructure, FortuneLevel, RadicalInfo } from './types';
import { RADICAL_ELEMENT_MAP, RADICAL_INFO, STROKE_FORTUNE_81, FIVE_ELEMENT_ATTR } from './data';

const STRUCTURE_MAP: Record<string, CharacterStructure> = {
  '左右结构': '左右',
  '上下结构': '上下',
  '左中右结构': '左中右',
  '上中下结构': '上中下',
  '半包围结构': '半包围',
  '全包围结构': '全包围',
  '品字结构': '品字',
  '独体结构': '独体',
};

function getRadicalInfo(char: string): { radical: string; structure: CharacterStructure } {
  const result = cnchar.radical(char);
  if (Array.isArray(result) && result.length > 0) {
    const r = result[0];
    const structure = STRUCTURE_MAP[r.struct] ?? '独体';
    return { radical: r.radical, structure };
  }
  return { radical: char, structure: '独体' };
}

function getRadicalElement(radical: string): FiveElement {
  return RADICAL_ELEMENT_MAP[radical] ?? '土';
}

function getRadicalMeaning(radical: string): RadicalInfo {
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
  strokeCount: number,
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

  parts.push(`笔画数${strokeCount}，${strokeFortune.desc}。`);

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

  const { radical, structure } = getRadicalInfo(firstChar);
  const radicalInfo = getRadicalMeaning(radical);
  const element = getRadicalElement(radical);

  const strokeResult = cnchar.stroke(firstChar);
  const strokeCount = typeof strokeResult === 'number' ? strokeResult : Array.isArray(strokeResult) ? strokeResult[0] : 1;
  const kangxiStrokes = strokeCount;
  const strokeFortune = getStrokeFortune(strokeCount);

  const interpretation = generateInterpretation(
    firstChar, radical, element, structure, strokeFortune, radicalInfo, strokeCount,
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