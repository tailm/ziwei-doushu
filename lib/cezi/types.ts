export type FiveElement = '金' | '木' | '水' | '火' | '土';

export type CharacterStructure =
  | '独体'
  | '左右'
  | '上下'
  | '左中右'
  | '上中下'
  | '半包围'
  | '全包围'
  | '品字';

export interface CeziResult {
  character: string;
  radical: string;
  radicalElement: FiveElement;
  strokeCount: number;
  kangxiStrokes: number;
  structure: CharacterStructure;
  element: FiveElement;
  meaning: string;
  interpretation: string;
  fortuneLevel: FortuneLevel;
  advice: string[];
}

export type FortuneLevel = '大吉' | '吉' | '中吉' | '平' | '小凶' | '凶';

export interface RadicalInfo {
  radical: string;
  element: FiveElement;
  meaning: string;
}