export type FortuneDimensionKey =
  | 'career'
  | 'wealth'
  | 'love'
  | 'health'
  | 'family'
  | 'social'
  | 'windfall'
  | 'travel'
  | 'creativity'
  | 'children'
  | 'legal'
  | 'spiritual';

export interface DimensionConfig {
  key: FortuneDimensionKey;
  label: string;
  labelEn: string;
  icon: string;
  color: string;
  description: string;
  descriptionEn: string;
  tier: 'core' | 'advanced';
}

const DIMENSION_KEYS = new Set<string>([
  'career', 'wealth', 'love', 'health', 'family', 'social',
  'windfall', 'travel', 'creativity', 'children', 'legal', 'spiritual',
]);

export const ALL_DIMENSIONS: DimensionConfig[] = [
  { key: 'career', label: '事业/学业', labelEn: 'Career', icon: '💼', color: '#3b82f6', description: '职场晋升、学业成绩、能力发展', descriptionEn: 'Career growth, academic performance, skill development', tier: 'core' },
  { key: 'wealth', label: '财富', labelEn: 'Wealth', icon: '💰', color: '#22c55e', description: '正财收入、投资回报、理财运', descriptionEn: 'Income, investment returns, financial management', tier: 'core' },
  { key: 'love', label: '感情/婚姻', labelEn: 'Love', icon: '❤️', color: '#ec4899', description: '桃花运、婚姻关系、情感状态', descriptionEn: 'Romance, marriage, emotional state', tier: 'core' },
  { key: 'health', label: '健康', labelEn: 'Health', icon: '🏥', color: '#ef4444', description: '身体状况、精力旺衰、疾病风险', descriptionEn: 'Physical condition, vitality, health risks', tier: 'core' },
  { key: 'family', label: '家庭/长辈', labelEn: 'Family', icon: '👨‍👩‍👧‍👦', color: '#f97316', description: '父母健康、家庭和睦、六亲关系', descriptionEn: 'Parents health, family harmony, relatives', tier: 'core' },
  { key: 'social', label: '人际/贵人', labelEn: 'Social', icon: '🤝', color: '#8b5cf6', description: '社交运、贵人相助、人脉拓展', descriptionEn: 'Social luck, mentors, networking', tier: 'core' },
  { key: 'windfall', label: '偏财/投资', labelEn: 'Windfall', icon: '🎰', color: '#14b8a6', description: '偏财运、投机运、意外收入', descriptionEn: 'Unexpected income, speculation, windfall', tier: 'advanced' },
  { key: 'travel', label: '出行/迁移', labelEn: 'Travel', icon: '✈️', color: '#06b6d4', description: '出行顺利度、搬迁运、异地发展', descriptionEn: 'Travel smoothness, relocation, overseas development', tier: 'advanced' },
  { key: 'creativity', label: '创意/灵感', labelEn: 'Creativity', icon: '🎨', color: '#a855f7', description: '文昌运、创作灵感、学习新技能', descriptionEn: 'Inspiration, creative flow, learning new skills', tier: 'advanced' },
  { key: 'children', label: '子女', labelEn: 'Children', icon: '👶', color: '#f472b6', description: '子女运势、生育、亲子关系', descriptionEn: 'Children fortune, fertility, parent-child relationship', tier: 'advanced' },
  { key: 'legal', label: '官非/法律', labelEn: 'Legal', icon: '⚖️', color: '#64748b', description: '官司风险、合同纠纷（越高越安全）', descriptionEn: 'Legal risks, contracts (higher = safer)', tier: 'advanced' },
  { key: 'spiritual', label: '精神/心灵', labelEn: 'Spiritual', icon: '🧘', color: '#d946ef', description: '情绪状态、精神内耗、内心平静', descriptionEn: 'Emotional state, mental wellbeing, inner peace', tier: 'advanced' },
];

export const DEFAULT_DIMENSIONS: FortuneDimensionKey[] = [
  'career', 'wealth', 'love', 'health', 'family', 'social',
];

export const CORE_DIMENSIONS = ALL_DIMENSIONS.filter(d => d.tier === 'core');
export const ADVANCED_DIMENSIONS = ALL_DIMENSIONS.filter(d => d.tier === 'advanced');

const dimensionMap = new Map(ALL_DIMENSIONS.map(d => [d.key, d]));

const labelToKeyMap = new Map<string, FortuneDimensionKey>();
for (const d of ALL_DIMENSIONS) {
  labelToKeyMap.set(d.label, d.key);
  labelToKeyMap.set(d.labelEn.toLowerCase(), d.key);
  const normalized = d.label.replace(/[/／·、]/g, '');
  if (normalized !== d.label) {
    labelToKeyMap.set(normalized, d.key);
  }
}

export function normalizeDimensionKey(raw: string): FortuneDimensionKey | undefined {
  if (DIMENSION_KEYS.has(raw)) return raw as FortuneDimensionKey;
  return labelToKeyMap.get(raw);
}

export function getDimensionConfig(key: FortuneDimensionKey): DimensionConfig {
  const config = dimensionMap.get(key);
  if (!config) throw new Error(`Unknown dimension key: ${key}`);
  return config;
}

export function getDimensionsByKeys(keys: FortuneDimensionKey[]): DimensionConfig[] {
  return keys.map(getDimensionConfig);
}

export function isDimensionKey(value: string): value is FortuneDimensionKey {
  return DIMENSION_KEYS.has(value);
}