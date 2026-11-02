export type FaceShape = 'oval' | 'round' | 'square' | 'long' | 'diamond' | 'heart';
export type ForeheadType = 'wide' | 'narrow' | 'high' | 'low' | 'protruding' | 'flat';
export type EyebrowType = 'thick' | 'thin' | 'long' | 'short' | 'arched' | 'straight' | 'joined';
export type EyeType = 'big' | 'small' | 'phoenix' | 'almond' | 'round' | 'narrow' | 'deepset';
export type NoseType = 'straight' | 'high' | 'flat' | 'pointed' | 'wide' | 'long' | 'bulbous';
export type MouthType = 'big' | 'small' | 'thick-lips' | 'thin-lips' | 'upturned' | 'downturned' | 'wide';
export type ChinType = 'round' | 'pointed' | 'square' | 'long' | 'short' | 'protruding' | 'receding';
export type EarType = 'big' | 'small' | 'thick' | 'thin' | 'protruding' | 'close' | 'long-lobule' | 'short-lobule';

export interface FaceFeatures {
  faceShape: FaceShape;
  forehead: ForeheadType;
  eyebrow: EyebrowType;
  eye: EyeType;
  nose: NoseType;
  mouth: MouthType;
  chin: ChinType;
  ear: EarType;
}

export interface FeatureDetail {
  label: string;
  labelEn: string;
  description: string;
  descriptionEn: string;
  fortuneLevel: FortuneLevel;
}

export interface MianxiangResult {
  features: FaceFeatures;
  details: Record<keyof FaceFeatures, FeatureDetail>;
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
  key: keyof FaceFeatures;
  label: string;
  labelEn: string;
  icon: string;
  options: FeatureOption[];
}