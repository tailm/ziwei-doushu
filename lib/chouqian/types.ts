export type SignFortuneLevel = '上上签' | '上签' | '中签' | '下签' | '下下签';

export interface SignResult {
  number: number;
  title: string;
  poem: string[];
  level: SignFortuneLevel;
  interpretation: string;
  story: string;
  advice: string[];
}