export type LifeLineType = 'long' | 'short' | 'deep' | 'shallow' | 'curved' | 'straight' | 'chained' | 'broken';
export type HeadLineType = 'long' | 'short' | 'deep' | 'shallow' | 'straight' | 'curved' | 'forked' | 'chained';
export type HeartLineType = 'long' | 'short' | 'deep' | 'shallow' | 'curved' | 'straight' | 'forked' | 'chained';
export type FateLineType = 'present' | 'absent' | 'deep' | 'shallow' | 'long' | 'short' | 'broken' | 'double';
export type FingerType = 'long' | 'short' | 'thick' | 'thin' | 'straight' | 'curved';
export type ThumbType = 'big' | 'small' | 'long' | 'short' | 'thick' | 'thin' | 'flexible' | 'stiff';
export type PalmType = 'square' | 'long' | 'wide' | 'narrow' | 'thick' | 'thin';

export interface HandFeatures {
  lifeLine: LifeLineType;
  headLine: HeadLineType;
  heartLine: HeartLineType;
  fateLine: FateLineType;
  finger: FingerType;
  thumb: ThumbType;
  palm: PalmType;
}

export interface FeatureDetail {
  label: string;
  labelEn: string;
  description: string;
  descriptionEn: string;
  fortuneLevel: FortuneLevel;
}

export interface ShouxiangResult {
  features: HandFeatures;
  details: Record<keyof HandFeatures, FeatureDetail>;
  overallFortune: FortuneLevel;
  interpretation: string;
  advice: string[];
}

export type FortuneLevel = '大吉' | '吉' | '中吉' | '平' | '小凶' | '凶';

export interface FeatureOption {
  value: string;
  label: string;
  labelEn: string;
}

export interface FeatureCategory {
  key: keyof HandFeatures;
  label: string;
  labelEn: string;
  icon: string;
  options: FeatureOption[];
}