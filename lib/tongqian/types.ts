export type LineType = 'yang' | 'yin' | 'old_yang' | 'old_yin';

export type FortuneLevel = '大吉' | '吉' | '中吉' | '平' | '小凶' | '凶';

export interface CoinThrow {
  coins: [boolean, boolean, boolean];
  value: number;
  lineType: LineType;
}

export interface HexagramLine {
  position: number;
  lineType: LineType;
  isChanging: boolean;
  text: string;
}

export interface Hexagram {
  number: number;
  name: string;
  chineseName: string;
  symbol: string;
  lines: LineType[];
  judgment: string;
  fortuneLevel: FortuneLevel;
  advice: string[];
  changingLines: number[];
  changedHexagram?: Hexagram;
}

export interface DivinationResult {
  throws: CoinThrow[];
  originalHexagram: Hexagram;
  changedHexagram: Hexagram | null;
  interpretation: string;
  changingLineTexts: { position: number; originalText: string; changedText: string }[];
}