'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '@/lib/i18n/LanguageContext';
import { useTheme } from '@/components/ThemeProvider';
import NavigationBar from '@/components/NavigationBar';
import SiteFooter from '@/components/SiteFooter';
import { AuspiciousCloud, SeedSyllable } from '@/components/SacredDecorations';

interface Recipe {
  name_zh: string;
  name_en: string;
  category: string;
  difficulty_zh: string;
  difficulty_en: string;
  time_zh: string;
  time_en: string;
  ingredients_zh: string[];
  ingredients_en: string[];
  steps_zh: string[];
  steps_en: string[];
  tips_zh: string;
  tips_en: string;
  icon: string;
  region_zh: string;
  region_en: string;
}

const CATEGORIES = [
  { key: 'all', label_zh: '全部', label_en: 'All' },
  { key: 'stirfry', label_zh: '炒菜', label_en: 'Stir-fry' },
  { key: 'soup', label_zh: '汤品', label_en: 'Soup' },
  { key: 'cold', label_zh: '凉菜', label_en: 'Cold Dish' },
  { key: 'staple', label_zh: '主食', label_en: 'Staple' },
  { key: 'braise', label_zh: '炖煮', label_en: 'Braise' },
];

const RECIPES: Recipe[] = [
  {
    name_zh: '番茄炒蛋', name_en: 'Tomato Scrambled Eggs', category: 'stirfry',
    difficulty_zh: '简单', difficulty_en: 'Easy', time_zh: '10分钟', time_en: '10 min',
    region_zh: '家常', region_en: 'Home-style',
    ingredients_zh: ['番茄 2个', '鸡蛋 3个', '葱花 适量', '盐 1勺', '糖 1勺', '食用油 2勺'],
    ingredients_en: ['2 tomatoes', '3 eggs', 'Scallions', '1 tsp salt', '1 tsp sugar', '2 tbsp oil'],
    steps_zh: [
      '番茄切块，鸡蛋打散加少许盐搅匀',
      '锅中热油，倒入蛋液炒至凝固盛出',
      '锅中再加少许油，放入番茄翻炒出汁',
      '加糖和盐调味，倒回鸡蛋翻炒均匀',
      '撒葱花出锅',
    ],
    steps_en: [
      'Cut tomatoes into chunks, beat eggs with a pinch of salt',
      'Heat oil, scramble eggs until set, then remove',
      'Add more oil, stir-fry tomatoes until juicy',
      'Season with sugar and salt, return eggs and mix',
      'Garnish with scallions and serve',
    ],
    tips_zh: '番茄先用开水烫一下更容易去皮；蛋液加少许水炒出来更嫩',
    tips_en: 'Blanch tomatoes for easier peeling; add a splash of water to eggs for fluffier texture',
    icon: '🍅',
  },
  {
    name_zh: '宫保鸡丁', name_en: 'Kung Pao Chicken', category: 'stirfry',
    difficulty_zh: '中等', difficulty_en: 'Medium', time_zh: '20分钟', time_en: '20 min',
    region_zh: '川菜', region_en: 'Sichuan',
    ingredients_zh: ['鸡胸肉 300g', '花生米 50g', '干辣椒 10个', '花椒 1勺', '葱段 适量', '姜蒜末 适量', '料酒 1勺', '酱油 2勺', '醋 1勺', '糖 1勺', '盐 适量', '淀粉 1勺'],
    ingredients_en: ['300g chicken breast', '50g peanuts', '10 dried chilies', '1 tbsp Sichuan peppercorns', 'Scallions', 'Ginger & garlic', '1 tbsp cooking wine', '2 tbsp soy sauce', '1 tbsp vinegar', '1 tbsp sugar', 'Salt', '1 tbsp starch'],
    steps_zh: [
      '鸡肉切丁，加料酒、酱油、淀粉腌制15分钟',
      '花生米小火炒至酥脆备用',
      '调碗汁：酱油、醋、糖、盐、淀粉加水搅匀',
      '锅中热油，先炒鸡丁至变色盛出',
      '锅中留油，小火炒香干辣椒和花椒',
      '加入姜蒜末和葱段爆香',
      '倒回鸡丁，淋入碗汁翻炒均匀',
      '最后加入花生米翻炒出锅',
    ],
    steps_en: [
      'Dice chicken, marinate with wine, soy sauce, starch for 15 min',
      'Toast peanuts until crispy, set aside',
      'Mix sauce: soy sauce, vinegar, sugar, salt, starch with water',
      'Stir-fry chicken until color changes, remove',
      'Sauté dried chilies and peppercorns on low heat',
      'Add ginger, garlic, and scallions',
      'Return chicken, pour in sauce and mix well',
      'Add peanuts last and serve',
    ],
    tips_zh: '花生米最后放才能保持酥脆；碗汁要提前调好，下锅后快速翻炒',
    tips_en: 'Add peanuts last to keep them crispy; prepare sauce beforehand for quick stir-frying',
    icon: '🥜',
  },
  {
    name_zh: '酸辣土豆丝', name_en: 'Hot & Sour Potato Strips', category: 'stirfry',
    difficulty_zh: '简单', difficulty_en: 'Easy', time_zh: '15分钟', time_en: '15 min',
    region_zh: '家常', region_en: 'Home-style',
    ingredients_zh: ['土豆 2个', '干辣椒 5个', '花椒 少许', '蒜末 适量', '葱段 适量', '醋 2勺', '盐 1勺', '食用油 2勺'],
    ingredients_en: ['2 potatoes', '5 dried chilies', 'Sichuan peppercorns', 'Garlic', 'Scallions', '2 tbsp vinegar', '1 tsp salt', '2 tbsp oil'],
    steps_zh: [
      '土豆切细丝，用清水浸泡去除淀粉，沥干',
      '锅中热油，小火炒香干辣椒和花椒',
      '加入蒜末爆香',
      '大火放入土豆丝快速翻炒2分钟',
      '沿锅边淋入醋，加盐调味',
      '撒葱段翻炒出锅',
    ],
    steps_en: [
      'Cut potatoes into thin strips, soak in water to remove starch, drain',
      'Heat oil, sauté dried chilies and peppercorns on low heat',
      'Add garlic and stir',
      'Stir-fry potato strips on high heat for 2 minutes',
      'Splash vinegar along the wok edge, add salt',
      'Garnish with scallions and serve',
    ],
    tips_zh: '土豆丝要切细且均匀；浸泡去淀粉是关键，否则会粘连；全程大火快炒',
    tips_en: 'Cut potatoes thin and even; soaking removes starch to prevent sticking; cook on high heat throughout',
    icon: '🥔',
  },
  {
    name_zh: '紫菜蛋花汤', name_en: 'Seaweed Egg Drop Soup', category: 'soup',
    difficulty_zh: '简单', difficulty_en: 'Easy', time_zh: '10分钟', time_en: '10 min',
    region_zh: '家常', region_en: 'Home-style',
    ingredients_zh: ['紫菜 1片', '鸡蛋 2个', '葱花 适量', '盐 1勺', '香油 几滴', '清水 3碗'],
    ingredients_en: ['1 sheet seaweed', '2 eggs', 'Scallions', '1 tsp salt', 'A few drops sesame oil', '3 bowls water'],
    steps_zh: [
      '紫菜撕碎，鸡蛋打散',
      '清水烧开，放入紫菜煮1分钟',
      '缓缓倒入蛋液，用筷子轻轻搅动形成蛋花',
      '加盐调味，淋几滴香油',
      '撒葱花出锅',
    ],
    steps_en: [
      'Tear seaweed into pieces, beat eggs',
      'Bring water to boil, add seaweed and cook 1 minute',
      'Slowly pour in beaten eggs while gently stirring',
      'Season with salt, add sesame oil',
      'Garnish with scallions and serve',
    ],
    tips_zh: '蛋液要沿着锅边缓缓倒入，不要搅太快，蛋花才漂亮',
    tips_en: 'Pour eggs slowly along the wok edge without stirring too fast for beautiful egg ribbons',
    icon: '🥣',
  },
  {
    name_zh: '冬瓜排骨汤', name_en: 'Winter Melon & Rib Soup', category: 'soup',
    difficulty_zh: '中等', difficulty_en: 'Medium', time_zh: '60分钟', time_en: '60 min',
    region_zh: '粤菜', region_en: 'Cantonese',
    ingredients_zh: ['排骨 500g', '冬瓜 300g', '姜片 3片', '葱段 适量', '料酒 1勺', '盐 适量', '清水 适量'],
    ingredients_en: ['500g pork ribs', '300g winter melon', '3 ginger slices', 'Scallions', '1 tbsp cooking wine', 'Salt', 'Water'],
    steps_zh: [
      '排骨冷水下锅，加料酒和姜片，煮沸焯水去血沫',
      '捞出排骨用温水冲洗干净',
      '排骨放入砂锅，加清水和姜片，大火烧开转小火炖40分钟',
      '冬瓜去皮切块，放入汤中继续炖15分钟',
      '加盐调味，撒葱花出锅',
    ],
    steps_en: [
      'Blanch ribs in cold water with wine and ginger, skim foam',
      'Remove ribs and rinse with warm water',
      'Place ribs in clay pot with water and ginger, simmer 40 min on low',
      'Add peeled winter melon chunks, simmer 15 more minutes',
      'Season with salt, garnish with scallions',
    ],
    tips_zh: '焯水是去腥的关键步骤；小火慢炖汤才清澈鲜美',
    tips_en: 'Blanching is key to removing odor; slow simmering produces clear, flavorful broth',
    icon: '🦴',
  },
  {
    name_zh: '凉拌黄瓜', name_en: 'Cold Cucumber Salad', category: 'cold',
    difficulty_zh: '简单', difficulty_en: 'Easy', time_zh: '5分钟', time_en: '5 min',
    region_zh: '家常', region_en: 'Home-style',
    ingredients_zh: ['黄瓜 2根', '蒜末 适量', '干辣椒 2个', '醋 2勺', '酱油 1勺', '糖 1勺', '盐 适量', '香油 1勺', '花椒油 少许'],
    ingredients_en: ['2 cucumbers', 'Garlic', '2 dried chilies', '2 tbsp vinegar', '1 tbsp soy sauce', '1 tbsp sugar', 'Salt', '1 tbsp sesame oil', 'Sichuan pepper oil'],
    steps_zh: [
      '黄瓜拍碎切段，加盐腌制5分钟，倒掉多余水分',
      '蒜末、干辣椒碎放入碗中',
      '加醋、酱油、糖、香油、花椒油调成汁',
      '将调味汁倒入黄瓜中拌匀',
      '冷藏10分钟口感更佳',
    ],
    steps_en: [
      'Smash cucumbers and cut into sections, salt for 5 min, drain',
      'Put garlic and chili in a bowl',
      'Mix vinegar, soy sauce, sugar, sesame oil, pepper oil',
      'Pour dressing over cucumbers and toss',
      'Refrigerate 10 minutes for better flavor',
    ],
    tips_zh: '黄瓜要拍不要切，拍碎的截面更容易入味',
    tips_en: 'Smash cucumbers instead of cutting — broken surfaces absorb flavor better',
    icon: '🥒',
  },
  {
    name_zh: '皮蛋豆腐', name_en: 'Century Egg & Tofu', category: 'cold',
    difficulty_zh: '简单', difficulty_en: 'Easy', time_zh: '5分钟', time_en: '5 min',
    region_zh: '家常', region_en: 'Home-style',
    ingredients_zh: ['嫩豆腐 1块', '皮蛋 2个', '葱花 适量', '蒜末 适量', '酱油 2勺', '醋 1勺', '香油 1勺', '辣椒油 少许'],
    ingredients_en: ['1 block soft tofu', '2 century eggs', 'Scallions', 'Garlic', '2 tbsp soy sauce', '1 tbsp vinegar', '1 tbsp sesame oil', 'Chili oil'],
    steps_zh: [
      '嫩豆腐切小块，摆入盘中',
      '皮蛋去壳切块，放在豆腐上',
      '撒蒜末和葱花',
      '淋酱油、醋、香油和辣椒油',
      '轻轻拌匀即可',
    ],
    steps_en: [
      'Cut soft tofu into small pieces, arrange on plate',
      'Peel and cut century eggs, place on tofu',
      'Sprinkle garlic and scallions',
      'Drizzle soy sauce, vinegar, sesame oil, and chili oil',
      'Gently mix and serve',
    ],
    tips_zh: '皮蛋先蒸5分钟再切，蛋黄凝固不易碎；豆腐用嫩豆腐口感最好',
    tips_en: 'Steam century eggs 5 min before cutting for firmer yolks; use soft tofu for best texture',
    icon: '🥚',
  },
  {
    name_zh: '蛋炒饭', name_en: 'Egg Fried Rice', category: 'staple',
    difficulty_zh: '简单', difficulty_en: 'Easy', time_zh: '10分钟', time_en: '10 min',
    region_zh: '家常', region_en: 'Home-style',
    ingredients_zh: ['隔夜米饭 1碗', '鸡蛋 2个', '葱花 适量', '盐 适量', '酱油 少许', '食用油 2勺'],
    ingredients_en: ['1 bowl leftover rice', '2 eggs', 'Scallions', 'Salt', 'A little soy sauce', '2 tbsp oil'],
    steps_zh: [
      '隔夜米饭用手拨散（冷藏过的米饭最好）',
      '鸡蛋打散加少许盐',
      '锅中热油，倒入蛋液炒至半凝固',
      '立即加入米饭，大火快速翻炒',
      '炒至米饭粒粒分明，加盐和少许酱油调味',
      '撒葱花翻炒出锅',
    ],
    steps_en: [
      'Break up leftover rice with your fingers (cold rice works best)',
      'Beat eggs with a pinch of salt',
      'Heat oil, pour in eggs and cook until half-set',
      'Immediately add rice, stir-fry on high heat',
      'Fry until rice grains are separate, season with salt and soy sauce',
      'Add scallions and serve',
    ],
    tips_zh: '一定要用隔夜冷饭，新煮的米饭水分太多会粘成一团；全程大火',
    tips_en: 'Must use leftover cold rice — fresh rice has too much moisture; cook on high heat throughout',
    icon: '🍚',
  },
  {
    name_zh: '葱油拌面', name_en: 'Scallion Oil Noodles', category: 'staple',
    difficulty_zh: '简单', difficulty_en: 'Easy', time_zh: '15分钟', time_en: '15 min',
    region_zh: '沪菜', region_en: 'Shanghai',
    ingredients_zh: ['面条 200g', '小葱 100g', '酱油 3勺', '糖 1勺', '食用油 4勺', '盐 少许'],
    ingredients_en: ['200g noodles', '100g scallions', '3 tbsp soy sauce', '1 tbsp sugar', '4 tbsp oil', 'A pinch of salt'],
    steps_zh: [
      '小葱洗净切段，葱白和葱叶分开',
      '锅中倒入油，先放葱白小火慢炸',
      '葱白微黄后加入葱叶，炸至焦脆捞出',
      '葱油中加酱油和糖，小火煮至糖融化',
      '面条煮熟捞出，淋上葱油酱汁',
      '撒上炸好的葱段拌匀',
    ],
    steps_en: [
      'Wash scallions and cut into sections, separate white and green parts',
      'Heat oil, fry scallion whites on low heat first',
      'When whites turn golden, add greens and fry until crispy, remove',
      'Add soy sauce and sugar to the scallion oil, simmer until sugar dissolves',
      'Cook noodles, drain, and drizzle with scallion sauce',
      'Top with fried scallions and mix',
    ],
    tips_zh: '炸葱一定要小火慢炸，焦脆的葱段是灵魂；酱油和糖的比例决定口味',
    tips_en: 'Fry scallions on low heat — crispy scallions are the soul; sauce ratio determines the flavor',
    icon: '🍜',
  },
  {
    name_zh: '饺子', name_en: 'Dumplings', category: 'staple',
    difficulty_zh: '中等', difficulty_en: 'Medium', time_zh: '60分钟', time_en: '60 min',
    region_zh: '北方', region_en: 'Northern China',
    ingredients_zh: ['面粉 300g', '清水 150ml', '猪肉馅 300g', '白菜 200g', '葱花 适量', '姜末 适量', '酱油 2勺', '料酒 1勺', '香油 1勺', '盐 适量'],
    ingredients_en: ['300g flour', '150ml water', '300g ground pork', '200g napa cabbage', 'Scallions', 'Ginger', '2 tbsp soy sauce', '1 tbsp cooking wine', '1 tbsp sesame oil', 'Salt'],
    steps_zh: [
      '面粉加清水揉成光滑面团，盖湿布醒30分钟',
      '白菜切碎撒盐腌制10分钟，挤干水分',
      '猪肉馅加酱油、料酒、姜末、葱花、香油和盐搅匀',
      '加入白菜碎拌匀成饺子馅',
      '面团搓长条切小剂子，擀成圆皮',
      '取适量馅放皮中央，对折捏紧封口',
      '锅中水烧开，下饺子煮至浮起，加凉水再煮开，重复三次即可',
    ],
    steps_en: [
      'Mix flour and water into smooth dough, rest 30 min under damp cloth',
      'Chop cabbage, salt for 10 min, squeeze out water',
      'Mix pork with soy sauce, wine, ginger, scallions, sesame oil, and salt',
      'Add cabbage and mix well to make filling',
      'Roll dough into long strip, cut into small pieces, roll each into round wrapper',
      'Place filling in center, fold in half and pinch to seal',
      'Boil water, cook dumplings until they float, add cold water and re-boil, repeat 3 times',
    ],
    tips_zh: '面团要醒够时间才好擀皮；煮饺子时"三开三点水"是关键，饺子才不会破皮',
    tips_en: 'Rest dough long enough for easy rolling; "three boils, three cold water additions" prevents dumplings from breaking',
    icon: '🥟',
  },
  {
    name_zh: '馄饨', name_en: 'Wontons', category: 'staple',
    difficulty_zh: '简单', difficulty_en: 'Easy', time_zh: '30分钟', time_en: '30 min',
    region_zh: '江南', region_en: 'Jiangnan',
    ingredients_zh: ['馄饨皮 30张', '猪肉馅 200g', '虾仁 50g', '葱花 适量', '姜末 适量', '酱油 1勺', '料酒 1勺', '盐 适量', '紫菜 少许', '虾皮 少许', '香油 几滴'],
    ingredients_en: ['30 wonton wrappers', '200g ground pork', '50g shrimp', 'Scallions', 'Ginger', '1 tbsp soy sauce', '1 tbsp cooking wine', 'Salt', 'Seaweed', 'Dried shrimp', 'Sesame oil'],
    steps_zh: [
      '猪肉馅加虾仁碎、酱油、料酒、姜末、葱花和盐搅匀',
      '取馄饨皮放适量馅，对折成三角形再捏合成元宝形',
      '碗中放紫菜、虾皮、葱花、酱油和香油',
      '锅中水烧开，下馄饨煮至浮起即熟',
      '将煮馄饨的热汤倒入碗中冲开调料',
      '捞入馄饨即可食用',
    ],
    steps_en: [
      'Mix pork with chopped shrimp, soy sauce, wine, ginger, scallions, and salt',
      'Place filling on wrapper, fold into triangle, then shape into ingot form',
      'Put seaweed, dried shrimp, scallions, soy sauce, and sesame oil in a bowl',
      'Boil water, cook wontons until they float',
      'Pour hot wonton broth into the bowl to dissolve seasonings',
      'Add wontons and serve',
    ],
    tips_zh: '馄饨皮比饺子皮薄，馅不要太多否则容易破；汤底是灵魂，紫菜虾皮缺一不可',
    tips_en: 'Wonton wrappers are thinner than dumpling wrappers — do not overfill; the broth with seaweed and dried shrimp is essential',
    icon: '🥣',
  },
  {
    name_zh: '包子', name_en: 'Steamed Buns', category: 'staple',
    difficulty_zh: '中等', difficulty_en: 'Medium', time_zh: '90分钟', time_en: '90 min',
    region_zh: '全国', region_en: 'Nationwide',
    ingredients_zh: ['面粉 500g', '酵母 5g', '温水 250ml', '白糖 10g', '猪肉馅 300g', '葱花 适量', '姜末 适量', '酱油 2勺', '料酒 1勺', '香油 1勺', '盐 适量'],
    ingredients_en: ['500g flour', '5g yeast', '250ml warm water', '10g sugar', '300g ground pork', 'Scallions', 'Ginger', '2 tbsp soy sauce', '1 tbsp cooking wine', '1 tbsp sesame oil', 'Salt'],
    steps_zh: [
      '酵母和糖溶于温水，倒入面粉中揉成光滑面团',
      '盖湿布放温暖处发酵至两倍大（约1小时）',
      '猪肉馅加酱油、料酒、姜末、葱花、香油和盐搅匀',
      '发酵好的面团揉搓排气，分成小剂子',
      '擀成中间厚边缘薄的圆皮，放馅捏褶收口',
      '包好的包子放入蒸笼，醒15分钟',
      '大火蒸15分钟，关火后焖3分钟再开盖',
    ],
    steps_en: [
      'Dissolve yeast and sugar in warm water, mix into flour to form smooth dough',
      'Cover and ferment in warm place until doubled (about 1 hour)',
      'Mix pork with soy sauce, wine, ginger, scallions, sesame oil, and salt',
      'Knead fermented dough to remove air, divide into small pieces',
      'Roll into wrappers thick in center and thin at edges, add filling and pleat to seal',
      'Place buns in steamer, rest 15 minutes',
      'Steam on high heat for 15 min, wait 3 min before opening lid',
    ],
    tips_zh: '发酵是关键，面团要发至两倍大；蒸好后不要立即开盖，焖3分钟防止包子回缩',
    tips_en: 'Fermentation is key — dough must double in size; wait 3 min after steaming before opening to prevent buns from collapsing',
    icon: '🧁',
  },
  {
    name_zh: '红烧肉', name_en: 'Red Braised Pork', category: 'braise',
    difficulty_zh: '中等', difficulty_en: 'Medium', time_zh: '90分钟', time_en: '90 min',
    region_zh: '沪菜', region_en: 'Shanghai',
    ingredients_zh: ['五花肉 500g', '冰糖 30g', '酱油 3勺', '料酒 2勺', '姜片 3片', '葱段 适量', '八角 2个', '盐 适量', '清水 适量'],
    ingredients_en: ['500g pork belly', '30g rock sugar', '3 tbsp soy sauce', '2 tbsp cooking wine', '3 ginger slices', 'Scallions', '2 star anise', 'Salt', 'Water'],
    steps_zh: [
      '五花肉切3cm方块，冷水下锅焯水去血沫',
      '捞出冲洗干净备用',
      '锅中少许油，放冰糖小火炒至焦糖色',
      '放入肉块翻炒上色',
      '加料酒、酱油、姜片、八角和葱段',
      '倒入开水没过肉面，大火烧开转小火炖60分钟',
      '开盖大火收汁，至汤汁浓稠即可',
    ],
    steps_en: [
      'Cut pork belly into 3cm cubes, blanch in cold water',
      'Remove and rinse clean',
      'Heat a little oil, caramelize rock sugar on low heat',
      'Add pork and stir to coat with color',
      'Add wine, soy sauce, ginger, star anise, and scallions',
      'Pour in hot water to cover, simmer on low for 60 minutes',
      'Uncover and reduce sauce on high heat until thick',
    ],
    tips_zh: '炒糖色是关键，冰糖比白糖色泽更好；炖煮一定要用小火，肉才软烂入味',
    tips_en: 'Caramelizing sugar is key — rock sugar gives better color; simmer on low heat for tender, flavorful meat',
    icon: '🥩',
  },
  {
    name_zh: '可乐鸡翅', name_en: 'Cola Chicken Wings', category: 'braise',
    difficulty_zh: '简单', difficulty_en: 'Easy', time_zh: '30分钟', time_en: '30 min',
    region_zh: '创意菜', region_en: 'Creative',
    ingredients_zh: ['鸡翅 10个', '可乐 1罐', '酱油 2勺', '料酒 1勺', '姜片 3片', '盐 少许', '食用油 1勺'],
    ingredients_en: ['10 chicken wings', '1 can cola', '2 tbsp soy sauce', '1 tbsp cooking wine', '3 ginger slices', 'A pinch of salt', '1 tbsp oil'],
    steps_zh: [
      '鸡翅洗净，两面划两刀方便入味',
      '冷水下锅加料酒和姜片焯水，捞出冲洗',
      '锅中热油，放入鸡翅煎至两面金黄',
      '加入酱油翻炒上色',
      '倒入可乐没过鸡翅，加姜片',
      '大火烧开转小火炖15分钟',
      '开盖大火收汁至浓稠即可',
    ],
    steps_en: [
      'Wash wings, make two cuts on each side for flavor absorption',
      'Blanch with wine and ginger, rinse clean',
      'Heat oil, pan-fry wings until golden on both sides',
      'Add soy sauce and stir to color',
      'Pour cola to cover wings, add ginger',
      'Bring to boil, simmer on low for 15 minutes',
      'Uncover and reduce sauce on high heat until thick',
    ],
    tips_zh: '可乐本身含糖，不需要额外加糖；收汁时要不断翻动防止粘锅',
    tips_en: 'Cola contains sugar, no need to add more; stir constantly when reducing to prevent sticking',
    icon: '🥤',
  },
  {
    name_zh: '清蒸鲈鱼', name_en: 'Steamed Sea Bass', category: 'braise',
    difficulty_zh: '中等', difficulty_en: 'Medium', time_zh: '20分钟', time_en: '20 min',
    region_zh: '粤菜', region_en: 'Cantonese',
    ingredients_zh: ['鲈鱼 1条', '葱丝 适量', '姜丝 适量', '蒸鱼豉油 3勺', '料酒 1勺', '盐 少许', '食用油 2勺'],
    ingredients_en: ['1 sea bass', 'Shredded scallion', 'Shredded ginger', '3 tbsp steamed fish soy sauce', '1 tbsp cooking wine', 'A pinch of salt', '2 tbsp oil'],
    steps_zh: [
      '鲈鱼去鳞去内脏洗净，鱼身两侧划几刀',
      '鱼身抹少许盐和料酒，腌制10分钟',
      '盘底铺姜丝和葱丝，放上鲈鱼',
      '水开后大火蒸8-10分钟（视鱼大小）',
      '取出倒掉蒸出的汤汁，重新铺上新鲜葱丝姜丝',
      '淋蒸鱼豉油，浇上热油激香',
    ],
    steps_en: [
      'Clean sea bass, make cuts on both sides',
      'Rub with salt and wine, marinate 10 minutes',
      'Line plate with ginger and scallion, place fish on top',
      'Steam on high heat for 8-10 min after water boils',
      'Discard steaming liquid, add fresh scallion and ginger',
      'Drizzle steamed fish soy sauce, pour hot oil to release aroma',
    ],
    tips_zh: '蒸鱼时间不要过长，否则肉变老；最后浇热油是点睛之笔',
    tips_en: 'Do not over-steam or the fish will be tough; the final hot oil pour is the finishing touch',
    icon: '🐟',
  },
];

export default function CuisinePage() {
  const { lang } = useLang();
  const { theme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const isZh = lang === 'zh';
  const isDark = theme === 'dark';

  const c = {
    bg: isDark ? '#0a0805' : '#f5efe0',
    bgTint: isDark ? '#15110a' : '#faf5e8',
    cardBg: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.85)',
    border: isDark ? 'rgba(212,168,67,0.15)' : 'rgba(140,100,20,0.12)',
    borderActive: isDark ? 'rgba(212,168,67,0.4)' : 'rgba(140,100,20,0.4)',
    gold: isDark ? '#d4a843' : '#8b6410',
    text: isDark ? '#e8dcc8' : '#3a2e1a',
    textMuted: isDark ? '#9db0d0' : '#5a6275',
    textFaint: isDark ? 'rgba(212,168,67,0.4)' : 'rgba(140,100,20,0.35)',
    accent: '#B8922A',
  };

  const filteredRecipes = selectedCategory === 'all'
    ? RECIPES
    : RECIPES.filter(r => r.category === selectedCategory);

  return (
    <div className="min-h-screen relative" style={{ background: c.bg }}>
      {/* 背景装饰 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '8%', left: '5%', opacity: 0.04 }}>
          <AuspiciousCloud size={120} color={c.gold} opacity={0.5} />
        </div>
        <div style={{ position: 'absolute', bottom: '12%', right: '6%', opacity: 0.04 }}>
          <AuspiciousCloud size={100} color={c.gold} opacity={0.5} />
        </div>
        <div style={{ position: 'absolute', top: '45%', right: '4%', opacity: 0.03 }}>
          <SeedSyllable size={70} color={c.gold} opacity={0.5} />
        </div>
      </div>

      <NavigationBar />

      <div className="relative z-10 pt-20 pb-12 px-4 sm:px-8 max-w-6xl mx-auto">
        {/* 标题区 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className="inline-block mb-3" style={{
            padding: '4px 16px',
            borderRadius: '20px',
            border: `1px solid ${c.borderActive}`,
            background: `${c.gold}10`,
            fontSize: '12px',
            color: c.gold,
            letterSpacing: '2px',
          }}>
            {isZh ? '中华美食 · 家常菜谱' : 'Chinese Cuisine · Home Recipes'}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3" style={{ color: c.text }}>
            {isZh ? '中餐菜谱' : 'Chinese Recipes'}
          </h1>
          <p className="text-sm sm:text-base max-w-2xl mx-auto" style={{ color: c.textMuted }}>
            {isZh
              ? '从家常小炒到经典名菜，简单易学的制作方法，让每个人都能做出地道中餐。'
              : 'From home-style stir-fries to classic dishes, simple recipes for everyone to cook authentic Chinese food.'}
          </p>
        </motion.div>

        {/* 分类筛选 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-2 mb-8"
        >
          {CATEGORIES.map(cat => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className="px-4 py-2 rounded-full text-xs sm:text-sm transition-all duration-300"
              style={{
                border: `1px solid ${selectedCategory === cat.key ? c.borderActive : c.border}`,
                background: selectedCategory === cat.key ? `${c.gold}15` : 'transparent',
                color: selectedCategory === cat.key ? c.gold : c.textMuted,
                cursor: 'pointer',
              }}
            >
              {isZh ? cat.label_zh : cat.label_en}
            </button>
          ))}
        </motion.div>

        {/* 菜谱卡片网格 */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12"
        >
          <AnimatePresence mode="popLayout">
            {filteredRecipes.map((recipe, idx) => (
              <motion.div
                key={recipe.name_zh}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: idx * 0.03 }}
                whileHover={{ y: -4 }}
                onClick={() => setSelectedRecipe(recipe)}
                className="rounded-xl p-5 cursor-pointer transition-all duration-300"
                style={{
                  background: c.cardBg,
                  border: `1px solid ${c.border}`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = c.borderActive;
                  e.currentTarget.style.boxShadow = `0 8px 24px ${c.gold}20`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = c.border;
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="text-3xl">{recipe.icon}</div>
                  <div className="flex gap-1">
                    <span className="text-[10px] px-2 py-0.5 rounded-full" style={{
                      background: `${c.gold}15`,
                      color: c.gold,
                      border: `1px solid ${c.borderActive}`,
                    }}>
                      {isZh ? recipe.difficulty_zh : recipe.difficulty_en}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full" style={{
                      background: 'transparent',
                      color: c.textMuted,
                      border: `1px solid ${c.border}`,
                    }}>
                      {isZh ? recipe.time_zh : recipe.time_en}
                    </span>
                  </div>
                </div>
                <h3 className="text-base font-semibold mb-1" style={{ color: c.text }}>
                  {isZh ? recipe.name_zh : recipe.name_en}
                </h3>
                <div className="text-[11px] mb-2" style={{ color: c.gold }}>
                  {isZh ? recipe.region_zh : recipe.region_en}
                </div>
                <p className="text-xs leading-relaxed line-clamp-2" style={{ color: c.textMuted }}>
                  {isZh ? recipe.tips_zh : recipe.tips_en}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* 详情弹窗 */}
      <AnimatePresence>
        {selectedRecipe && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setSelectedRecipe(null)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              background: 'rgba(20,12,2,0.75)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
            }}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              onClick={(e) => e.stopPropagation()}
              style={{
                maxWidth: '520px',
                width: '100%',
                maxHeight: '85vh',
                borderRadius: '16px',
                background: c.bgTint,
                border: `1px solid ${c.borderActive}`,
                boxShadow: `0 24px 80px rgba(0,0,0,0.4)`,
                padding: '24px',
                overflowY: 'auto',
              }}
            >
              {/* 标题 */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{selectedRecipe.icon}</div>
                  <div>
                    <h3 className="text-xl font-bold" style={{ color: c.text }}>
                      {isZh ? selectedRecipe.name_zh : selectedRecipe.name_en}
                    </h3>
                    <div className="text-xs flex gap-2" style={{ color: c.gold }}>
                      <span>{isZh ? selectedRecipe.region_zh : selectedRecipe.region_en}</span>
                      <span>·</span>
                      <span>{isZh ? selectedRecipe.difficulty_zh : selectedRecipe.difficulty_en}</span>
                      <span>·</span>
                      <span>{isZh ? selectedRecipe.time_zh : selectedRecipe.time_en}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedRecipe(null)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: c.textMuted,
                    fontSize: '20px',
                  }}
                >
                  ✕
                </button>
              </div>

              {/* 食材 */}
              <div className="mb-5">
                <h4 className="text-sm font-semibold mb-2" style={{ color: c.gold }}>
                  {isZh ? '食材' : 'Ingredients'}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {(isZh ? selectedRecipe.ingredients_zh : selectedRecipe.ingredients_en).map((ing, i) => (
                    <span
                      key={i}
                      className="text-xs px-3 py-1 rounded-full"
                      style={{
                        background: `${c.gold}10`,
                        border: `1px solid ${c.border}`,
                        color: c.text,
                      }}
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>

              {/* 步骤 */}
              <div className="mb-5">
                <h4 className="text-sm font-semibold mb-2" style={{ color: c.gold }}>
                  {isZh ? '制作步骤' : 'Steps'}
                </h4>
                <div className="flex flex-col gap-3">
                  {(isZh ? selectedRecipe.steps_zh : selectedRecipe.steps_en).map((step, i) => (
                    <div key={i} className="flex gap-3">
                      <div
                        className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{
                          background: `${c.gold}20`,
                          color: c.gold,
                          border: `1px solid ${c.borderActive}`,
                        }}
                      >
                        {i + 1}
                      </div>
                      <p className="text-sm leading-relaxed flex-1" style={{ color: c.text }}>
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 小贴士 */}
              <div
                className="rounded-lg p-3"
                style={{
                  background: `${c.gold}08`,
                  border: `1px solid ${c.border}`,
                }}
              >
                <h4 className="text-xs font-semibold mb-1" style={{ color: c.gold }}>
                  {isZh ? '小贴士' : 'Tips'}
                </h4>
                <p className="text-xs leading-relaxed" style={{ color: c.textMuted }}>
                  {isZh ? selectedRecipe.tips_zh : selectedRecipe.tips_en}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <SiteFooter />
    </div>
  );
}