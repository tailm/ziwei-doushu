import type {
  FaceShape, ForeheadType, EyebrowType, EyeType, NoseType,
  MouthType, ChinType, EarType, FortuneLevel,
  FeatureCategory, FeatureDetail, FaceFeatures,
} from './types';

export const FEATURE_CATEGORIES: FeatureCategory[] = [
  {
    key: 'faceShape', label: '脸型', labelEn: 'Face Shape', icon: '🟡',
    options: [
      { value: 'oval', label: '鹅蛋脸', labelEn: 'Oval' },
      { value: 'round', label: '圆脸', labelEn: 'Round' },
      { value: 'square', label: '方脸', labelEn: 'Square' },
      { value: 'long', label: '长脸', labelEn: 'Long' },
      { value: 'diamond', label: '菱形脸', labelEn: 'Diamond' },
      { value: 'heart', label: '瓜子脸', labelEn: 'Heart' },
    ],
  },
  {
    key: 'forehead', label: '额头', labelEn: 'Forehead', icon: '🔆',
    options: [
      { value: 'wide', label: '宽阔', labelEn: 'Wide' },
      { value: 'narrow', label: '狭窄', labelEn: 'Narrow' },
      { value: 'high', label: '高耸', labelEn: 'High' },
      { value: 'low', label: '低平', labelEn: 'Low' },
      { value: 'protruding', label: '凸出', labelEn: 'Protruding' },
      { value: 'flat', label: '平坦', labelEn: 'Flat' },
    ],
  },
  {
    key: 'eyebrow', label: '眉毛', labelEn: 'Eyebrow', icon: '〰️',
    options: [
      { value: 'thick', label: '浓密', labelEn: 'Thick' },
      { value: 'thin', label: '稀疏', labelEn: 'Thin' },
      { value: 'long', label: '修长', labelEn: 'Long' },
      { value: 'short', label: '短促', labelEn: 'Short' },
      { value: 'arched', label: '弯月', labelEn: 'Arched' },
      { value: 'straight', label: '平直', labelEn: 'Straight' },
      { value: 'joined', label: '连眉', labelEn: 'Joined' },
    ],
  },
  {
    key: 'eye', label: '眼睛', labelEn: 'Eye', icon: '👁️',
    options: [
      { value: 'big', label: '大眼', labelEn: 'Big' },
      { value: 'small', label: '小眼', labelEn: 'Small' },
      { value: 'phoenix', label: '凤眼', labelEn: 'Phoenix' },
      { value: 'almond', label: '杏眼', labelEn: 'Almond' },
      { value: 'round', label: '圆眼', labelEn: 'Round' },
      { value: 'narrow', label: '细长', labelEn: 'Narrow' },
      { value: 'deepset', label: '深陷', labelEn: 'Deep-set' },
    ],
  },
  {
    key: 'nose', label: '鼻子', labelEn: 'Nose', icon: '👃',
    options: [
      { value: 'straight', label: '挺直', labelEn: 'Straight' },
      { value: 'high', label: '高挺', labelEn: 'High' },
      { value: 'flat', label: '扁平', labelEn: 'Flat' },
      { value: 'pointed', label: '尖细', labelEn: 'Pointed' },
      { value: 'wide', label: '宽厚', labelEn: 'Wide' },
      { value: 'long', label: '修长', labelEn: 'Long' },
      { value: 'bulbous', label: '圆鼻头', labelEn: 'Bulbous' },
    ],
  },
  {
    key: 'mouth', label: '嘴巴', labelEn: 'Mouth', icon: '👄',
    options: [
      { value: 'big', label: '大嘴', labelEn: 'Big' },
      { value: 'small', label: '小嘴', labelEn: 'Small' },
      { value: 'thick-lips', label: '厚唇', labelEn: 'Thick Lips' },
      { value: 'thin-lips', label: '薄唇', labelEn: 'Thin Lips' },
      { value: 'upturned', label: '嘴角上扬', labelEn: 'Upturned' },
      { value: 'downturned', label: '嘴角下垂', labelEn: 'Downturned' },
      { value: 'wide', label: '阔嘴', labelEn: 'Wide' },
    ],
  },
  {
    key: 'chin', label: '下巴', labelEn: 'Chin', icon: '🔻',
    options: [
      { value: 'round', label: '圆润', labelEn: 'Round' },
      { value: 'pointed', label: '尖削', labelEn: 'Pointed' },
      { value: 'square', label: '方正', labelEn: 'Square' },
      { value: 'long', label: '修长', labelEn: 'Long' },
      { value: 'short', label: '短促', labelEn: 'Short' },
      { value: 'protruding', label: '前突', labelEn: 'Protruding' },
      { value: 'receding', label: '后缩', labelEn: 'Receding' },
    ],
  },
  {
    key: 'ear', label: '耳朵', labelEn: 'Ear', icon: '👂',
    options: [
      { value: 'big', label: '大耳', labelEn: 'Big' },
      { value: 'small', label: '小耳', labelEn: 'Small' },
      { value: 'thick', label: '厚实', labelEn: 'Thick' },
      { value: 'thin', label: '薄削', labelEn: 'Thin' },
      { value: 'protruding', label: '招风耳', labelEn: 'Protruding' },
      { value: 'close', label: '贴脑耳', labelEn: 'Close to Head' },
      { value: 'long-lobule', label: '长耳垂', labelEn: 'Long Lobule' },
      { value: 'short-lobule', label: '短耳垂', labelEn: 'Short Lobule' },
    ],
  },
];

const FORTUNE_MAP: Record<string, FeatureDetail> = {
  'face-oval': { label: '鹅蛋脸', labelEn: 'Oval', description: '鹅蛋脸为面相中之佳相，性格温和，运势平顺，人际关系良好', descriptionEn: 'Oval face is considered ideal - gentle personality, smooth fortune, good relationships', fortuneLevel: '吉' },
  'face-round': { label: '圆脸', labelEn: 'Round', description: '圆脸之人性格开朗乐观，人缘好，但需注意理财，不宜过于安逸', descriptionEn: 'Round face indicates cheerful personality, good social connections, but needs financial discipline', fortuneLevel: '中吉' },
  'face-square': { label: '方脸', labelEn: 'Square', description: '方脸之人意志坚定，行动力强，适合领导岗位，但性格较固执', descriptionEn: 'Square face shows strong willpower and action, suited for leadership, but can be stubborn', fortuneLevel: '中吉' },
  'face-long': { label: '长脸', labelEn: 'Long', description: '长脸之人思虑深远，有智慧，但容易多虑，需注意身心健康', descriptionEn: 'Long face indicates deep thinking and wisdom, but prone to overthinking', fortuneLevel: '平' },
  'face-diamond': { label: '菱形脸', labelEn: 'Diamond', description: '菱形脸之人个性鲜明，有独特才华，但性格多变，需稳定情绪', descriptionEn: 'Diamond face shows distinctive personality and unique talent, but mood can be variable', fortuneLevel: '平' },
  'face-heart': { label: '瓜子脸', labelEn: 'Heart', description: '瓜子脸之人聪慧灵秀，审美能力强，但体质偏弱，需注意健康', descriptionEn: 'Heart face indicates intelligence and aesthetic sense, but physical health needs attention', fortuneLevel: '中吉' },

  'forehead-wide': { label: '宽阔额头', labelEn: 'Wide Forehead', description: '额头宽阔主聪明智慧，少年运好，学习能力强，前途光明', descriptionEn: 'Wide forehead indicates intelligence, good early fortune, strong learning ability', fortuneLevel: '吉' },
  'forehead-narrow': { label: '狭窄额头', labelEn: 'Narrow Forehead', description: '额头狭窄主少年运稍弱，需靠后天努力弥补，勤奋可补不足', descriptionEn: 'Narrow forehead suggests weaker early fortune, but diligence can compensate', fortuneLevel: '平' },
  'forehead-high': { label: '高耸额头', labelEn: 'High Forehead', description: '额头高耸主智慧超群，有远见卓识，适合学术和管理领域', descriptionEn: 'High forehead indicates exceptional wisdom and foresight, suited for academia and management', fortuneLevel: '吉' },
  'forehead-low': { label: '低平额头', labelEn: 'Low Forehead', description: '额头低平主踏实务实，行动力强，但思考深度稍欠', descriptionEn: 'Low forehead indicates practical and action-oriented nature, but less deep thinking', fortuneLevel: '平' },
  'forehead-protruding': { label: '凸出额头', labelEn: 'Protruding Forehead', description: '额头凸出主思维活跃，创造力强，但性格较急躁', descriptionEn: 'Protruding forehead indicates active thinking and creativity, but can be impulsive', fortuneLevel: '中吉' },
  'forehead-flat': { label: '平坦额头', labelEn: 'Flat Forehead', description: '额头平坦主性格沉稳，做事有条理，但缺乏冒险精神', descriptionEn: 'Flat forehead indicates steady personality and methodical approach, but lacks risk-taking', fortuneLevel: '平' },

  'eyebrow-thick': { label: '浓密眉毛', labelEn: 'Thick Eyebrow', description: '浓眉主精力旺盛，重情重义，但脾气较大，需修身养性', descriptionEn: 'Thick eyebrows indicate strong vitality and loyalty, but can be hot-tempered', fortuneLevel: '中吉' },
  'eyebrow-thin': { label: '稀疏眉毛', labelEn: 'Thin Eyebrow', description: '稀疏眉毛主性格温和细腻，但意志力稍弱，需增强决断力', descriptionEn: 'Thin eyebrows indicate gentle and refined personality, but weaker willpower', fortuneLevel: '平' },
  'eyebrow-long': { label: '修长眉毛', labelEn: 'Long Eyebrow', description: '眉长过目主兄弟和睦，人缘好，事业有贵人相助', descriptionEn: 'Long eyebrows indicate good relationships and helpful mentors in career', fortuneLevel: '吉' },
  'eyebrow-short': { label: '短促眉毛', labelEn: 'Short Eyebrow', description: '短眉主性格急躁，做事快但欠考虑，需培养耐心', descriptionEn: 'Short eyebrows indicate impulsive nature, quick but hasty actions', fortuneLevel: '平' },
  'eyebrow-arched': { label: '弯月眉毛', labelEn: 'Arched Eyebrow', description: '弯月眉主性格温柔，审美能力强，感情运好，人缘佳', descriptionEn: 'Arched eyebrows indicate gentle personality, good aesthetics, and romance luck', fortuneLevel: '吉' },
  'eyebrow-straight': { label: '平直眉毛', labelEn: 'Straight Eyebrow', description: '平直眉主性格刚毅正直，做事有原则，但不够圆融', descriptionEn: 'Straight eyebrows indicate upright and principled nature, but can be inflexible', fortuneLevel: '中吉' },
  'eyebrow-joined': { label: '连眉', labelEn: 'Joined Eyebrow', description: '连眉主心思缜密，但容易纠结烦恼，需放宽心胸', descriptionEn: 'Joined eyebrows indicate meticulous thinking, but prone to worry and anxiety', fortuneLevel: '平' },

  'eye-big': { label: '大眼', labelEn: 'Big Eyes', description: '大眼主热情开朗，感情丰富，人缘好，但容易感情用事', descriptionEn: 'Big eyes indicate passionate and expressive nature, good social connections', fortuneLevel: '中吉' },
  'eye-small': { label: '小眼', labelEn: 'Small Eyes', description: '小眼主心思细腻，观察力强，做事谨慎，但不够开朗', descriptionEn: 'Small eyes indicate careful and observant nature, but less outgoing', fortuneLevel: '平' },
  'eye-phoenix': { label: '凤眼', labelEn: 'Phoenix Eyes', description: '凤眼主贵气，智慧超群，有领导才能，事业有成', descriptionEn: 'Phoenix eyes indicate nobility, exceptional wisdom, and leadership talent', fortuneLevel: '大吉' },
  'eye-almond': { label: '杏眼', labelEn: 'Almond Eyes', description: '杏眼主善良纯真，感情真挚，中年运好，家庭和睦', descriptionEn: 'Almond eyes indicate kindness and sincerity, good mid-life fortune', fortuneLevel: '吉' },
  'eye-round': { label: '圆眼', labelEn: 'Round Eyes', description: '圆眼主性格率真，好奇心强，但容易冲动，需沉稳', descriptionEn: 'Round eyes indicate frank and curious nature, but can be impulsive', fortuneLevel: '中吉' },
  'eye-narrow': { label: '细长眼', labelEn: 'Narrow Eyes', description: '细长眼主心思深沉，有谋略，适合商业，但需防过于算计', descriptionEn: 'Narrow eyes indicate strategic thinking, suited for business', fortuneLevel: '中吉' },
  'eye-deepset': { label: '深陷眼', labelEn: 'Deep-set Eyes', description: '深陷眼主思虑过多，有洞察力，但容易悲观，需积极心态', descriptionEn: 'Deep-set eyes indicate deep insight, but prone to pessimism', fortuneLevel: '平' },

  'nose-straight': { label: '挺直鼻', labelEn: 'Straight Nose', description: '鼻梁挺直主正直诚信，财运稳定，中年运好', descriptionEn: 'Straight nose indicates integrity and stable wealth fortune', fortuneLevel: '吉' },
  'nose-high': { label: '高挺鼻', labelEn: 'High Nose', description: '高挺鼻主自尊心强，有领导力，财运旺，但需谦虚', descriptionEn: 'High nose indicates strong self-esteem, leadership, and wealth', fortuneLevel: '吉' },
  'nose-flat': { label: '扁平鼻', labelEn: 'Flat Nose', description: '扁平鼻主性格随和，但财运稍弱，需勤奋积累', descriptionEn: 'Flat nose indicates easygoing nature, but weaker wealth fortune', fortuneLevel: '平' },
  'nose-pointed': { label: '尖细鼻', labelEn: 'Pointed Nose', description: '尖细鼻主精明能干，但过于计较，需培养宽容心', descriptionEn: 'Pointed nose indicates shrewdness, but can be too calculating', fortuneLevel: '平' },
  'nose-wide': { label: '宽厚鼻', labelEn: 'Wide Nose', description: '宽厚鼻主大方慷慨，财运好，人缘佳，有贵人相助', descriptionEn: 'Wide nose indicates generosity, good wealth and social fortune', fortuneLevel: '吉' },
  'nose-long': { label: '修长鼻', labelEn: 'Long Nose', description: '修长鼻主有耐心，做事有始有终，健康运好', descriptionEn: 'Long nose indicates patience and persistence, good health fortune', fortuneLevel: '中吉' },
  'nose-bulbous': { label: '圆鼻头', labelEn: 'Bulbous Nose', description: '圆鼻头主财运亨通，善于理财，中年致富', descriptionEn: 'Bulbous nose tip indicates excellent wealth fortune', fortuneLevel: '吉' },

  'mouth-big': { label: '大嘴', labelEn: 'Big Mouth', description: '大嘴主胆识过人，有魄力，但需注意言行', descriptionEn: 'Big mouth indicates boldness and courage, but needs careful speech', fortuneLevel: '中吉' },
  'mouth-small': { label: '小嘴', labelEn: 'Small Mouth', description: '小嘴主性格内敛，守口如瓶，但表达力稍弱', descriptionEn: 'Small mouth indicates reserved nature, but weaker expression', fortuneLevel: '平' },
  'mouth-thick-lips': { label: '厚唇', labelEn: 'Thick Lips', description: '厚唇主重情重义，感情丰富，但容易感情用事', descriptionEn: 'Thick lips indicate passionate and loyal nature', fortuneLevel: '中吉' },
  'mouth-thin-lips': { label: '薄唇', labelEn: 'Thin Lips', description: '薄唇主口才好，精明干练，但感情较冷淡', descriptionEn: 'Thin lips indicate eloquence and shrewdness, but cooler emotions', fortuneLevel: '平' },
  'mouth-upturned': { label: '嘴角上扬', labelEn: 'Upturned Mouth', description: '嘴角上扬主乐观积极，人缘好，运势上扬', descriptionEn: 'Upturned mouth indicates optimism and rising fortune', fortuneLevel: '吉' },
  'mouth-downturned': { label: '嘴角下垂', labelEn: 'Downturned Mouth', description: '嘴角下垂主性格消极，容易悲观，需调整心态', descriptionEn: 'Downturned mouth indicates pessimistic tendency', fortuneLevel: '小凶' },
  'mouth-wide': { label: '阔嘴', labelEn: 'Wide Mouth', description: '阔嘴主气度大，有包容力，适合公共事务', descriptionEn: 'Wide mouth indicates broad-mindedness, suited for public affairs', fortuneLevel: '中吉' },

  'chin-round': { label: '圆润下巴', labelEn: 'Round Chin', description: '圆润下巴主晚年运好，家庭和睦，生活安稳', descriptionEn: 'Round chin indicates good late-life fortune and family harmony', fortuneLevel: '吉' },
  'chin-pointed': { label: '尖削下巴', labelEn: 'Pointed Chin', description: '尖削下巴主聪慧敏感，但晚年运稍弱，需提前规划', descriptionEn: 'Pointed chin indicates intelligence, but weaker late-life fortune', fortuneLevel: '平' },
  'chin-square': { label: '方正下巴', labelEn: 'Square Chin', description: '方正下巴主意志坚定，行动力强，晚年安稳', descriptionEn: 'Square chin indicates strong willpower and stable late life', fortuneLevel: '吉' },
  'chin-long': { label: '修长下巴', labelEn: 'Long Chin', description: '修长下巴主有耐力，做事持久，但性格较固执', descriptionEn: 'Long chin indicates endurance and persistence, but can be stubborn', fortuneLevel: '中吉' },
  'chin-short': { label: '短促下巴', labelEn: 'Short Chin', description: '短促下巴主性格急躁，做事快但欠持久力', descriptionEn: 'Short chin indicates impatience and lack of persistence', fortuneLevel: '平' },
  'chin-protruding': { label: '前突下巴', labelEn: 'Protruding Chin', description: '前突下巴主个性强，有攻击性，需学会柔和', descriptionEn: 'Protruding chin indicates strong personality, needs softness', fortuneLevel: '平' },
  'chin-receding': { label: '后缩下巴', labelEn: 'Receding Chin', description: '后缩下巴主性格退缩，缺乏自信，需增强勇气', descriptionEn: 'Receding chin indicates retreating nature, needs more courage', fortuneLevel: '小凶' },

  'ear-big': { label: '大耳', labelEn: 'Big Ears', description: '大耳主福气深厚，心胸宽广，寿命长', descriptionEn: 'Big ears indicate deep fortune, broad-mindedness, and longevity', fortuneLevel: '吉' },
  'ear-small': { label: '小耳', labelEn: 'Small Ears', description: '小耳主心思细腻，但气量稍小，需培养宽容', descriptionEn: 'Small ears indicate refined thinking, but narrower mindset', fortuneLevel: '平' },
  'ear-thick': { label: '厚实耳', labelEn: 'Thick Ears', description: '厚耳主身体健康，财运好，有福气', descriptionEn: 'Thick ears indicate good health, wealth, and fortune', fortuneLevel: '吉' },
  'ear-thin': { label: '薄削耳', labelEn: 'Thin Ears', description: '薄耳主体质偏弱，财运稍欠，需注意健康', descriptionEn: 'Thin ears indicate weaker health and wealth fortune', fortuneLevel: '平' },
  'ear-protruding': { label: '招风耳', labelEn: 'Protruding Ears', description: '招风耳主性格叛逆，有创新精神，但不宜守财', descriptionEn: 'Protruding ears indicate rebellious and innovative nature', fortuneLevel: '中吉' },
  'ear-close': { label: '贴脑耳', labelEn: 'Close Ears', description: '贴脑耳主听话顺从，有贵人相助，但缺乏主见', descriptionEn: 'Close ears indicate obedience and helpful mentors', fortuneLevel: '中吉' },
  'ear-long-lobule': { label: '长耳垂', labelEn: 'Long Lobule', description: '长耳垂主福气深厚，财运旺，晚年安康', descriptionEn: 'Long ear lobule indicates deep fortune and comfortable late life', fortuneLevel: '大吉' },
  'ear-short-lobule': { label: '短耳垂', labelEn: 'Short Lobule', description: '短耳垂主财运一般，需勤奋积累，不宜投机', descriptionEn: 'Short ear lobule indicates average wealth fortune', fortuneLevel: '平' },
};

const FORTUNE_LEVEL_VALUE: Record<FortuneLevel, number> = {
  '大吉': 5, '吉': 4, '中吉': 3, '平': 2, '小凶': 1, '凶': 0,
};

const VALUE_TO_LEVEL: Record<number, FortuneLevel> = {
  5: '大吉', 4: '吉', 3: '中吉', 2: '平', 1: '小凶', 0: '凶',
};

const CATEGORY_PREFIX: Record<keyof FaceFeatures, string> = {
  faceShape: 'face',
  forehead: 'forehead',
  eyebrow: 'eyebrow',
  eye: 'eye',
  nose: 'nose',
  mouth: 'mouth',
  chin: 'chin',
  ear: 'ear',
};

export function getFeatureDetail(category: keyof FaceFeatures, value: string): FeatureDetail {
  const prefix = CATEGORY_PREFIX[category];
  const prefixedKey = `${prefix}-${value}`;
  return FORTUNE_MAP[prefixedKey] || {
    label: value, labelEn: value,
    description: '特征未收录', descriptionEn: 'Feature not recorded',
    fortuneLevel: '平',
  };
}

export function interpretFace(features: FaceFeatures): {
  details: Record<keyof FaceFeatures, FeatureDetail>;
  overallFortune: FortuneLevel;
  interpretation: string;
  advice: string[];
} {
  const detailKeys: (keyof FaceFeatures)[] = ['faceShape', 'forehead', 'eyebrow', 'eye', 'nose', 'mouth', 'chin', 'ear'];
  const details = {} as Record<keyof FaceFeatures, FeatureDetail>;
  let totalScore = 0;

  for (const key of detailKeys) {
    const value = features[key];
    const detail = getFeatureDetail(key, value);
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
  const interpretation = `综合面相分析：${parts.join('；')}。整体运势${overallFortune}。`;

  const advice: string[] = [];
  if (overallFortune === '大吉' || overallFortune === '吉') {
    advice.push('面相佳，运势顺遂，宜把握机遇，积极进取');
    advice.push('保持谦逊低调，勿因运势好而懈怠');
  } else if (overallFortune === '中吉') {
    advice.push('运势中等偏上，稳中求进，不宜冒进');
    advice.push('发挥自身优势，补足短板，可更上一层');
  } else {
    advice.push('运势平稳，需靠后天努力改善，勤奋可补面相之不足');
    advice.push('修身养性，积德行善，可改善运势');
  }

  if (details.eye.fortuneLevel === '平' || details.eye.fortuneLevel === '小凶') {
    advice.push('眼部气色稍弱，需注意休息，保持精力充沛');
  }
  if (details.nose.fortuneLevel === '平' || details.nose.fortuneLevel === '小凶') {
    advice.push('鼻相主财运，理财宜谨慎，不宜大额投资');
  }
  if (details.mouth.fortuneLevel === '小凶') {
    advice.push('嘴角下垂需注意言语，多说积极话，少抱怨');
  }
  if (details.chin.fortuneLevel === '小凶') {
    advice.push('下巴主晚年运，宜提前规划养老，积累福德');
  }

  return { details, overallFortune, interpretation, advice };
}