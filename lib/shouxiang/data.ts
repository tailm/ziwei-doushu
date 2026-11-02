import type {
  LifeLineType, HeadLineType, HeartLineType, FateLineType,
  FingerType, ThumbType, PalmType, FortuneLevel,
  FeatureCategory, FeatureDetail, HandFeatures,
} from './types';

export const FEATURE_CATEGORIES: FeatureCategory[] = [
  {
    key: 'lifeLine', label: '生命线', labelEn: 'Life Line', icon: '❤️',
    options: [
      { value: 'long', label: '长', labelEn: 'Long' },
      { value: 'short', label: '短', labelEn: 'Short' },
      { value: 'deep', label: '深', labelEn: 'Deep' },
      { value: 'shallow', label: '浅', labelEn: 'Shallow' },
      { value: 'curved', label: '弯曲', labelEn: 'Curved' },
      { value: 'straight', label: '平直', labelEn: 'Straight' },
      { value: 'chained', label: '链状', labelEn: 'Chained' },
      { value: 'broken', label: '断裂', labelEn: 'Broken' },
    ],
  },
  {
    key: 'headLine', label: '智慧线', labelEn: 'Head Line', icon: '🧠',
    options: [
      { value: 'long', label: '长', labelEn: 'Long' },
      { value: 'short', label: '短', labelEn: 'Short' },
      { value: 'deep', label: '深', labelEn: 'Deep' },
      { value: 'shallow', label: '浅', labelEn: 'Shallow' },
      { value: 'straight', label: '平直', labelEn: 'Straight' },
      { value: 'curved', label: '弯曲', labelEn: 'Curved' },
      { value: 'forked', label: '分叉', labelEn: 'Forked' },
      { value: 'chained', label: '链状', labelEn: 'Chained' },
    ],
  },
  {
    key: 'heartLine', label: '感情线', labelEn: 'Heart Line', icon: '💕',
    options: [
      { value: 'long', label: '长', labelEn: 'Long' },
      { value: 'short', label: '短', labelEn: 'Short' },
      { value: 'deep', label: '深', labelEn: 'Deep' },
      { value: 'shallow', label: '浅', labelEn: 'Shallow' },
      { value: 'curved', label: '弯曲', labelEn: 'Curved' },
      { value: 'straight', label: '平直', labelEn: 'Straight' },
      { value: 'forked', label: '分叉', labelEn: 'Forked' },
      { value: 'chained', label: '链状', labelEn: 'Chained' },
    ],
  },
  {
    key: 'fateLine', label: '命运线', labelEn: 'Fate Line', icon: '⭐',
    options: [
      { value: 'present', label: '有', labelEn: 'Present' },
      { value: 'absent', label: '无', labelEn: 'Absent' },
      { value: 'deep', label: '深', labelEn: 'Deep' },
      { value: 'shallow', label: '浅', labelEn: 'Shallow' },
      { value: 'long', label: '长', labelEn: 'Long' },
      { value: 'short', label: '短', labelEn: 'Short' },
      { value: 'broken', label: '断裂', labelEn: 'Broken' },
      { value: 'double', label: '双线', labelEn: 'Double' },
    ],
  },
  {
    key: 'finger', label: '手指', labelEn: 'Fingers', icon: '✋',
    options: [
      { value: 'long', label: '长', labelEn: 'Long' },
      { value: 'short', label: '短', labelEn: 'Short' },
      { value: 'thick', label: '粗', labelEn: 'Thick' },
      { value: 'thin', label: '细', labelEn: 'Thin' },
      { value: 'straight', label: '直', labelEn: 'Straight' },
      { value: 'curved', label: '弯', labelEn: 'Curved' },
    ],
  },
  {
    key: 'thumb', label: '拇指', labelEn: 'Thumb', icon: '👍',
    options: [
      { value: 'big', label: '大', labelEn: 'Big' },
      { value: 'small', label: '小', labelEn: 'Small' },
      { value: 'long', label: '长', labelEn: 'Long' },
      { value: 'short', label: '短', labelEn: 'Short' },
      { value: 'thick', label: '厚', labelEn: 'Thick' },
      { value: 'thin', label: '薄', labelEn: 'Thin' },
      { value: 'flexible', label: '柔软', labelEn: 'Flexible' },
      { value: 'stiff', label: '僵硬', labelEn: 'Stiff' },
    ],
  },
  {
    key: 'palm', label: '掌型', labelEn: 'Palm Shape', icon: '🖐️',
    options: [
      { value: 'square', label: '方形掌', labelEn: 'Square' },
      { value: 'long', label: '长形掌', labelEn: 'Long' },
      { value: 'wide', label: '宽阔掌', labelEn: 'Wide' },
      { value: 'narrow', label: '狭窄掌', labelEn: 'Narrow' },
      { value: 'thick', label: '厚实掌', labelEn: 'Thick' },
      { value: 'thin', label: '薄削掌', labelEn: 'Thin' },
    ],
  },
];

const FORTUNE_MAP: Record<string, FeatureDetail> = {
  // 生命线
  long: { label: '长生命线', labelEn: 'Long Life Line', description: '生命线长主精力充沛，身体健康，寿命长', descriptionEn: 'Long life line indicates strong vitality and longevity', fortuneLevel: '吉' },
  short: { label: '短生命线', labelEn: 'Short Life Line', description: '生命线短主体质稍弱，但非短命，需注意健康', descriptionEn: 'Short life line indicates weaker constitution, but not short life', fortuneLevel: '平' },
  deep: { label: '深生命线', labelEn: 'Deep Life Line', description: '生命线深主生命力强，意志坚定，抗压能力好', descriptionEn: 'Deep life line indicates strong vitality and willpower', fortuneLevel: '吉' },
  shallow: { label: '浅生命线', labelEn: 'Shallow Life Line', description: '生命线浅主精力一般，容易疲劳，需注意养生', descriptionEn: 'Shallow life line indicates average vitality, prone to fatigue', fortuneLevel: '平' },
  curved: { label: '弯曲生命线', labelEn: 'Curved Life Line', description: '生命线弯曲主热情开朗，热爱生活，人缘好', descriptionEn: 'Curved life line indicates passionate and social nature', fortuneLevel: '吉' },
  straight: { label: '平直生命线', labelEn: 'Straight Life Line', description: '生命线平直主性格谨慎，做事有条理，但缺乏热情', descriptionEn: 'Straight life line indicates cautious and methodical nature', fortuneLevel: '中吉' },
  chained: { label: '链状生命线', labelEn: 'Chained Life Line', description: '生命线链状主体质波动，情绪不稳，需调节身心', descriptionEn: 'Chained life line indicates fluctuating health and emotions', fortuneLevel: '平' },
  broken: { label: '断裂生命线', labelEn: 'Broken Life Line', description: '生命线断裂主健康有隐患，需注意体检和养生', descriptionEn: 'Broken life line indicates health concerns, needs attention', fortuneLevel: '小凶' },

  // 智慧线
  'head-long': { label: '长智慧线', labelEn: 'Long Head Line', description: '智慧线长主思维深远，善于谋划，有远见', descriptionEn: 'Long head line indicates deep thinking and foresight', fortuneLevel: '吉' },
  'head-short': { label: '短智慧线', labelEn: 'Short Head Line', description: '智慧线短主思维敏捷，决策快，但欠深思熟虑', descriptionEn: 'Short head line indicates quick thinking but less deliberation', fortuneLevel: '中吉' },
  'head-deep': { label: '深智慧线', labelEn: 'Deep Head Line', description: '智慧线深主智力超群，专注力强，学术有成', descriptionEn: 'Deep head line indicates exceptional intelligence and focus', fortuneLevel: '吉' },
  'head-shallow': { label: '浅智慧线', labelEn: 'Shallow Head Line', description: '智慧线浅主思维灵活但不深入，需培养专注', descriptionEn: 'Shallow head line indicates flexible but shallow thinking', fortuneLevel: '平' },
  'head-straight': { label: '平直智慧线', labelEn: 'Straight Head Line', description: '智慧线平直主逻辑思维强，务实理性，适合理工', descriptionEn: 'Straight head line indicates strong logical thinking', fortuneLevel: '中吉' },
  'head-curved': { label: '弯曲智慧线', labelEn: 'Curved Head Line', description: '智慧线弯曲主创意思维强，想象力丰富，适合艺术', descriptionEn: 'Curved head line indicates creative and imaginative thinking', fortuneLevel: '吉' },
  'head-forked': { label: '分叉智慧线', labelEn: 'Forked Head Line', description: '智慧线分叉主多才多艺，思维多元，但需聚焦', descriptionEn: 'Forked head line indicates versatile talents, needs focus', fortuneLevel: '中吉' },
  'head-chained': { label: '链状智慧线', labelEn: 'Chained Head Line', description: '智慧线链状主思绪不宁，注意力分散，需培养专注', descriptionEn: 'Chained head line indicates scattered attention', fortuneLevel: '平' },

  // 感情线
  'heart-long': { label: '长感情线', labelEn: 'Long Heart Line', description: '感情线长主感情丰富，深情专一，感情运好', descriptionEn: 'Long heart line indicates deep and devoted emotions', fortuneLevel: '吉' },
  'heart-short': { label: '短感情线', labelEn: 'Short Heart Line', description: '感情线短主感情内敛，不易表达，但忠诚可靠', descriptionEn: 'Short heart line indicates reserved but loyal emotions', fortuneLevel: '中吉' },
  'heart-deep': { label: '深感情线', labelEn: 'Deep Heart Line', description: '感情线深主感情强烈，爱憎分明，但容易执着', descriptionEn: 'Deep heart line indicates intense emotions, can be possessive', fortuneLevel: '中吉' },
  'heart-shallow': { label: '浅感情线', labelEn: 'Shallow Heart Line', description: '感情线浅主感情淡然，不易动情，理性多于感性', descriptionEn: 'Shallow heart line indicates cool and rational emotions', fortuneLevel: '平' },
  'heart-curved': { label: '弯曲感情线', labelEn: 'Curved Heart Line', description: '感情线弯曲主感情顺遂，浪漫多情，人缘好', descriptionEn: 'Curved heart line indicates smooth romance and good social luck', fortuneLevel: '吉' },
  'heart-straight': { label: '平直感情线', labelEn: 'Straight Heart Line', description: '感情线平直主感情理性，不轻易动情，但一旦投入很深', descriptionEn: 'Straight heart line indicates rational approach to love', fortuneLevel: '中吉' },
  'heart-forked': { label: '分叉感情线', labelEn: 'Forked Heart Line', description: '感情线分叉主感情多元，有魅力，但需防感情纠纷', descriptionEn: 'Forked heart line indicates charm but potential relationship issues', fortuneLevel: '平' },
  'heart-chained': { label: '链状感情线', labelEn: 'Chained Heart Line', description: '感情线链状主感情波折，情绪不稳，需学会释怀', descriptionEn: 'Chained heart line indicates emotional turbulence', fortuneLevel: '小凶' },

  // 命运线
  present: { label: '有命运线', labelEn: 'Fate Line Present', description: '有命运线主命运轨迹清晰，事业有方向，中年有成', descriptionEn: 'Fate line present indicates clear life direction', fortuneLevel: '吉' },
  absent: { label: '无命运线', labelEn: 'Fate Line Absent', description: '无命运线主命运多变，自由度高，需自己创造命运', descriptionEn: 'No fate line indicates variable fate, self-created destiny', fortuneLevel: '平' },
  'fate-deep': { label: '深命运线', labelEn: 'Deep Fate Line', description: '命运线深主事业心强，目标明确，事业有成', descriptionEn: 'Deep fate line indicates strong career ambition', fortuneLevel: '吉' },
  'fate-shallow': { label: '浅命运线', labelEn: 'Shallow Fate Line', description: '命运线浅主事业方向不太明确，需探索找到方向', descriptionEn: 'Shallow fate line indicates unclear career direction', fortuneLevel: '平' },
  'fate-long': { label: '长命运线', labelEn: 'Long Fate Line', description: '命运线长主事业持久，一生有明确方向', descriptionEn: 'Long fate line indicates lifelong career direction', fortuneLevel: '吉' },
  'fate-short': { label: '短命运线', labelEn: 'Short Fate Line', description: '命运线短主事业起步晚或中途转换方向', descriptionEn: 'Short fate line indicates late start or career change', fortuneLevel: '中吉' },
  'fate-broken': { label: '断裂命运线', labelEn: 'Broken Fate Line', description: '命运线断裂主事业有转折，可能中途换行业', descriptionEn: 'Broken fate line indicates career transitions', fortuneLevel: '平' },
  'fate-double': { label: '双命运线', labelEn: 'Double Fate Line', description: '双命运线主才能多元，可同时发展多个事业', descriptionEn: 'Double fate line indicates multiple career paths', fortuneLevel: '吉' },

  // 手指
  'finger-long': { label: '长手指', labelEn: 'Long Fingers', description: '手指长主思维缜密，注重细节，适合精细工作', descriptionEn: 'Long fingers indicate meticulous thinking', fortuneLevel: '中吉' },
  'finger-short': { label: '短手指', labelEn: 'Short Fingers', description: '手指短主行动力强，决策果断，但欠细致', descriptionEn: 'Short fingers indicate quick action and decisiveness', fortuneLevel: '中吉' },
  'finger-thick': { label: '粗手指', labelEn: 'Thick Fingers', description: '手指粗主踏实稳重，体力好，但不够灵活', descriptionEn: 'Thick fingers indicate stability and physical strength', fortuneLevel: '中吉' },
  'finger-thin': { label: '细手指', labelEn: 'Thin Fingers', description: '手指细主灵巧聪慧，审美能力强，但体质稍弱', descriptionEn: 'Thin fingers indicate dexterity and aesthetic sense', fortuneLevel: '中吉' },
  'finger-straight': { label: '直手指', labelEn: 'Straight Fingers', description: '手指直主性格正直，做事坦荡，人缘好', descriptionEn: 'Straight fingers indicate upright nature', fortuneLevel: '吉' },
  'finger-curved': { label: '弯手指', labelEn: 'Curved Fingers', description: '手指弯主思维灵活，善于变通，但需注意原则', descriptionEn: 'Curved fingers indicate flexible thinking', fortuneLevel: '平' },

  // 拇指
  'thumb-big': { label: '大拇指', labelEn: 'Big Thumb', description: '拇指大主意志力强，领导力好，有决断力', descriptionEn: 'Big thumb indicates strong willpower and leadership', fortuneLevel: '吉' },
  'thumb-small': { label: '小拇指', labelEn: 'Small Thumb', description: '拇指小主性格温和，随和，但意志力稍弱', descriptionEn: 'Small thumb indicates gentle but weaker willpower', fortuneLevel: '平' },
  'thumb-long': { label: '长拇指', labelEn: 'Long Thumb', description: '拇指长主智慧与意志兼备，有远大志向', descriptionEn: 'Long thumb indicates wisdom combined with ambition', fortuneLevel: '吉' },
  'thumb-short': { label: '短拇指', labelEn: 'Short Thumb', description: '拇指短主做事干脆，但欠远见，需培养耐心', descriptionEn: 'Short thumb indicates quick decisions but less foresight', fortuneLevel: '平' },
  'thumb-thick': { label: '厚拇指', labelEn: 'Thick Thumb', description: '拇指厚主精力旺盛，执行力强，财运好', descriptionEn: 'Thick thumb indicates strong vitality and execution', fortuneLevel: '吉' },
  'thumb-thin': { label: '薄拇指', labelEn: 'Thin Thumb', description: '拇指薄主体质稍弱，但心思细腻，有审美', descriptionEn: 'Thin thumb indicates refined nature but weaker vitality', fortuneLevel: '平' },
  'thumb-flexible': { label: '柔软拇指', labelEn: 'Flexible Thumb', description: '拇指柔软主性格圆融，适应力强，善于交际', descriptionEn: 'Flexible thumb indicates adaptability and social skills', fortuneLevel: '中吉' },
  'thumb-stiff': { label: '僵硬拇指', labelEn: 'Stiff Thumb', description: '拇指僵硬主性格固执，原则性强，但不够灵活', descriptionEn: 'Stiff thumb indicates stubborn but principled nature', fortuneLevel: '平' },

  // 掌型
  'palm-square': { label: '方形掌', labelEn: 'Square Palm', description: '方形掌主务实稳重，脚踏实地，适合实业', descriptionEn: 'Square palm indicates practical and grounded nature', fortuneLevel: '中吉' },
  'palm-long': { label: '长形掌', labelEn: 'Long Palm', description: '长形掌主思虑深远，有内涵，适合学术研究', descriptionEn: 'Long palm indicates deep thinking, suited for academia', fortuneLevel: '中吉' },
  'palm-wide': { label: '宽阔掌', labelEn: 'Wide Palm', description: '宽阔掌主心胸宽广，气度大，有领导力', descriptionEn: 'Wide palm indicates broad-mindedness and leadership', fortuneLevel: '吉' },
  'palm-narrow': { label: '狭窄掌', labelEn: 'Narrow Palm', description: '狭窄掌主心思细腻，但气量稍小，需放宽心胸', descriptionEn: 'Narrow palm indicates refined but narrower mindset', fortuneLevel: '平' },
  'palm-thick': { label: '厚实掌', labelEn: 'Thick Palm', description: '厚实掌主精力充沛，财运好，有福气', descriptionEn: 'Thick palm indicates strong vitality and wealth fortune', fortuneLevel: '吉' },
  'palm-thin': { label: '薄削掌', labelEn: 'Thin Palm', description: '薄削掌主体质偏弱，但灵巧聪慧，需注意健康', descriptionEn: 'Thin palm indicates weaker health but clever nature', fortuneLevel: '平' },
};

const FORTUNE_LEVEL_VALUE: Record<FortuneLevel, number> = {
  '大吉': 5, '吉': 4, '中吉': 3, '平': 2, '小凶': 1, '凶': 0,
};

function getFeatureDetailWithCategory(category: keyof HandFeatures, value: string): FeatureDetail {
  const prefixedKey = category === 'lifeLine' || category === 'palm' ? value : `${category.split('Line')[0]}-${value}`;
  const altKey = category === 'fateLine' ? `fate-${value}` : value;
  return FORTUNE_MAP[prefixedKey] || FORTUNE_MAP[altKey] || FORTUNE_MAP[value] || {
    label: value, labelEn: value,
    description: '特征未收录', descriptionEn: 'Feature not recorded',
    fortuneLevel: '平',
  };
}

export function interpretHand(features: HandFeatures): {
  details: Record<keyof HandFeatures, FeatureDetail>;
  overallFortune: FortuneLevel;
  interpretation: string;
  advice: string[];
} {
  const detailKeys: (keyof HandFeatures)[] = ['lifeLine', 'headLine', 'heartLine', 'fateLine', 'finger', 'thumb', 'palm'];
  const details = {} as Record<keyof HandFeatures, FeatureDetail>;
  let totalScore = 0;

  for (const key of detailKeys) {
    const value = features[key];
    const detail = getFeatureDetailWithCategory(key, value);
    details[key] = detail;
    totalScore += FORTUNE_LEVEL_VALUE[detail.fortuneLevel];
  }

  const avgScore = totalScore / detailKeys.length;
  let overallFortune: FortuneLevel;
  if (avgScore >= 4.5) overallFortune = '大吉';
  else if (avgScore >= 3.5) overallFortune = '吉';
  else if (avgScore >= 2.5) overallFortune = '中吉';
  else if (avgScore >= 1.5) overallFortune = '平';
  else if (avgScore >= 0.5) overallFortune = '小凶';
  else overallFortune = '凶';

  const parts: string[] = [];
  for (const key of detailKeys) {
    const d = details[key];
    parts.push(`${d.label}: ${d.description}`);
  }
  const interpretation = `综合手相分析：${parts.join('；')}。整体运势${overallFortune}。`;

  const advice: string[] = [];
  if (overallFortune === '大吉' || overallFortune === '吉') {
    advice.push('手相佳，运势顺遂，宜把握机遇，积极进取');
    advice.push('保持谦逊低调，勿因运势好而懈怠');
  } else if (overallFortune === '中吉') {
    advice.push('运势中等偏上，稳中求进，不宜冒进');
    advice.push('发挥自身优势，补足短板，可更上一层');
  } else {
    advice.push('运势平稳，需靠后天努力改善，勤奋可补手相之不足');
    advice.push('修身养性，积德行善，可改善运势');
  }

  if (details.lifeLine.fortuneLevel === '小凶') {
    advice.push('生命线有断裂，需特别注意健康，定期体检');
  }
  if (details.heartLine.fortuneLevel === '小凶') {
    advice.push('感情线链状，感情上需学会释怀，勿过于执着');
  }
  if (details.fateLine.fortuneLevel === '平') {
    advice.push('命运线不明显，事业方向需自己探索，多尝试不同领域');
  }

  return { details, overallFortune, interpretation, advice };
}