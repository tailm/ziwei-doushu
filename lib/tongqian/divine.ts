import type { CoinThrow, LineType, Hexagram, DivinationResult, HexagramLine } from './types';
import { HEXAGRAMS, getHexagramByLines, type HexagramData } from './data';

function throwCoins(): CoinThrow {
  const coins: [boolean, boolean, boolean] = [
    Math.random() < 0.5,
    Math.random() < 0.5,
    Math.random() < 0.5,
  ];
  const value = coins.filter(c => !c).length * 2 + coins.filter(c => c).length * 3;

  let lineType: LineType;
  if (value === 6) lineType = 'old_yin';
  else if (value === 7) lineType = 'yang';
  else if (value === 8) lineType = 'yin';
  else lineType = 'old_yang';

  return { coins, value, lineType };
}

function convertChangingLines(lines: LineType[]): LineType[] {
  return lines.map(l => {
    if (l === 'old_yang') return 'yin';
    if (l === 'old_yin') return 'yang';
    return l;
  });
}

function buildHexagram(data: HexagramData, changingLines: number[] = []): Hexagram {
  const symbol = data.lines.map(l => {
    if (l === 'yang' || l === 'old_yang') return '━━━━━';
    return '━━ ━━';
  }).join('\n');

  return {
    number: data.number,
    name: data.name,
    chineseName: data.chineseName,
    symbol,
    lines: data.lines,
    judgment: data.judgment,
    fortuneLevel: data.fortuneLevel,
    advice: data.advice,
    changingLines,
  };
}

export function divine(): DivinationResult {
  const throws: CoinThrow[] = [];
  for (let i = 0; i < 6; i++) {
    throws.push(throwCoins());
  }

  const originalLines: LineType[] = throws.map(t => t.lineType);
  const changingLineIndices: number[] = originalLines
    .map((l, i) => (l === 'old_yang' || l === 'old_yin') ? i : -1)
    .filter(i => i >= 0);

  const originalData = getHexagramByLines(originalLines);
  if (!originalData) {
    throw new Error('Failed to determine hexagram');
  }

  const originalHexagram = buildHexagram(originalData, changingLineIndices);

  let changedHexagram: Hexagram | null = null;
  let changingLineTexts: { position: number; originalText: string; changedText: string }[] = [];

  if (changingLineIndices.length > 0) {
    const changedLines = convertChangingLines(originalLines);
    const changedData = getHexagramByLines(changedLines);
    if (changedData) {
      changedHexagram = buildHexagram(changedData);
    }
  }

  let interpretation: string;
  if (changingLineIndices.length === 0) {
    interpretation = originalData.judgment;
  } else if (changingLineIndices.length === 6) {
    interpretation = changedHexagram
      ? `六爻皆变，以变卦${changedHexagram.chineseName}卦辞为准：${changedHexagram.judgment}`
      : originalData.judgment;
  } else {
    const changedName = changedHexagram?.chineseName ?? '';
    interpretation = `本卦${originalData.chineseName}，变卦${changedName}。以变爻解读为主：${originalData.judgment}`;
  }

  return {
    throws,
    originalHexagram,
    changedHexagram,
    interpretation,
    changingLineTexts,
  };
}

export { HEXAGRAMS };