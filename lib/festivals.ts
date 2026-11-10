import { Lunar, Solar } from 'lunar-javascript';

export interface Festival {
  id: string;
  name: string;
  subtitle: string;
  category: 'traditional' | 'deity';
  intro: string;
  customs: string[];
  blessing: string;
  emoji: string;
}

type LunarDateResolver = (year: number) => { month: number; day: number } | 'jieqi' | 'new-year-eve';

interface FestivalDefinition {
  id: string;
  name: string;
  subtitle: string;
  category: 'traditional' | 'deity';
  intro: string;
  customs: string[];
  blessing: string;
  emoji: string;
  lunarDate: LunarDateResolver;
}

const FESTIVAL_DEFS: FestivalDefinition[] = [
  {
    id: 'spring-festival',
    name: '春节',
    subtitle: '农历正月初一 · 万象更新',
    category: 'traditional',
    intro: '春节是中华民族最隆重的传统节日，标志着农历新年的开始。古称"元旦"，意为"岁之首、月之首、日之首"。春节承载着辞旧迎新、团圆祈福的深厚文化内涵，是海内外中华儿女共同的精神纽带。',
    customs: [
      '贴春联、挂年画，以红纸金字寄托新年美好祝愿',
      '除夕守岁，全家团聚吃年夜饭，共度辞旧迎新之夜',
      '拜年送祝福，长辈给晚辈发压岁钱，寓意驱邪纳福',
      '燃放鞭炮烟花，以声光驱赶年兽，迎接新春吉瑞',
    ],
    blessing: '新春大吉，万事如意，阖家欢乐，福寿安康',
    emoji: '🧧',
    lunarDate: () => ({ month: 1, day: 1 }),
  },
  {
    id: 'yu-huang-dan',
    name: '玉皇诞',
    subtitle: '农历正月初九 · 玉皇圣诞',
    category: 'deity',
    intro: '玉皇诞即玉皇大帝圣诞日，道教称"玉皇赦罪天尊"为万天之主、众神之王。正月初九为玉皇大帝诞辰，道教宫观举行隆重斋醮仪式，信众焚香礼拜祈求玉皇大帝赐福消灾、保佑平安。',
    customs: [
      '焚香礼拜玉皇大帝，祈求赐福消灾保佑平安',
      '道教宫观举行斋醮仪式，诵经祈福普天同庆',
      '安太岁，犯太岁者于此日祈求玉皇化解太岁',
      '祭天酬神，感恩上天庇佑祈求新年顺遂',
    ],
    blessing: '玉皇赐福，消灾解厄，天恩浩荡，平安吉祥',
    emoji: '👑',
    lunarDate: () => ({ month: 1, day: 9 }),
  },
  {
    id: 'welcome-wealth',
    name: '迎财神',
    subtitle: '农历正月初五 · 财神圣诞',
    category: 'deity',
    intro: '正月初五是财神爷圣诞日，民间俗称"破五"。传说此日财神爷下凡巡世，家家户户燃放鞭炮、焚香供奉迎接财神进门，祈求新年财源广进、生意兴隆。迎财神是春节习俗中最具世俗信仰色彩的活动之一。',
    customs: [
      '燃放鞭炮迎接财神，以声光引导财神入户',
      '焚香供奉财神像，献上果品糕点祈求财运亨通',
      '商铺开市营业，选择此日开门迎客寓意生意兴隆',
      '吃饺子"捏小人嘴"，破五送穷迎富驱邪纳吉',
    ],
    blessing: '财神赐福，财源广进，生意兴隆，富贵吉祥',
    emoji: '💰',
    lunarDate: () => ({ month: 1, day: 5 }),
  },
  {
    id: 'lantern-festival',
    name: '元宵节',
    subtitle: '农历正月十五 · 花灯璀璨',
    category: 'traditional',
    intro: '元宵节又称上元节、灯节，是春节庆祝活动的压轴之作。正月十五是一年中第一个月圆之夜，古人称夜为"宵"，故称元宵节。这一天赏灯猜谜、吃汤圆，象征着团圆美满与春回大地。',
    customs: [
      '赏花灯、猜灯谜，街头巷尾灯火辉煌，趣味盎然',
      '吃元宵或汤圆，以圆食寓意全家团圆美满',
      '舞龙舞狮、踩高跷，民间百戏竞相献艺庆佳节',
      '放天灯祈福，将心愿寄托于灯火升腾夜空之中',
    ],
    blessing: '月圆人圆，花好月好，事事圆满，岁岁平安',
    emoji: '🏮',
    lunarDate: () => ({ month: 1, day: 15 }),
  },
  {
    id: 'dragon-head',
    name: '龙抬头',
    subtitle: '农历二月初二 · 春龙腾飞',
    category: 'traditional',
    intro: '龙抬头又称"春龙节""青龙节"，是祈求风调雨顺、五谷丰登的传统节日。古人认为二月二日苍龙星宿从东方地平线升起，龙乃百虫之长，龙抬头意味着万物复苏、春耕开始，是一年农事活动的起点。',
    customs: [
      '理发剃头，俗称"剃龙头"，寓意从头开始焕然一新',
      '吃龙食：面条称"龙须"、饺子称"龙耳"、春饼称"龙鳞"',
      '引钱龙、撒灰引龙，祈求龙王赐雨保佑丰收',
      '忌动针线，恐伤龙目，以示对龙的敬畏',
    ],
    blessing: '龙腾瑞气，鸿运当头，事业腾飞，步步高升',
    emoji: '🐉',
    lunarDate: () => ({ month: 2, day: 2 }),
  },
  {
    id: 'laojun-dan',
    name: '太上老君诞',
    subtitle: '农历二月十五 · 道祖圣诞',
    category: 'deity',
    intro: '农历二月十五为太上老君圣诞日，即道教创始人老子（李耳）的诞辰。太上老君是道教最高神灵三清之一，著《道德经》五千言，为万世道法之宗。此日道教宫观举行隆重法会，信众诵《道德经》感悟大道智慧。',
    customs: [
      '诵《道德经》，感悟"道法自然""无为而治"之智慧',
      '道教宫观举行法会，焚香供奉庆贺道祖圣诞',
      '修身养性，以老子智慧反省自身处世之道',
      '祈福消灾，祈求太上老君护佑平安健康',
    ],
    blessing: '道法自然，清静无为，福寿绵长，身心安泰',
    emoji: '☯️',
    lunarDate: () => ({ month: 2, day: 15 }),
  },
  {
    id: 'guanyin-dan',
    name: '观音诞',
    subtitle: '农历二月十九 · 观音圣诞',
    category: 'deity',
    intro: '农历二月十九是观世音菩萨圣诞日。观音菩萨是大慈大悲的化身，佛教中救苦救难的菩萨，在中国民间信仰中地位极高。观音菩萨"千处祈求千处应，苦海常作度人舟"，信众于此日焚香礼拜祈求慈悲护佑。',
    customs: [
      '焚香礼拜观音菩萨，诵《心经》《大悲咒》祈福',
      '放生积德，以慈悲之心救护生灵效仿观音大悲',
      '素食斋戒，此日不食荤腥以示对观音的虔诚',
      '祈求子嗣，观音送子之说深入人心求子者多拜观音',
    ],
    blessing: '观音护佑，大慈大悲，消灾解难，平安吉祥',
    emoji: '🙏',
    lunarDate: () => ({ month: 2, day: 19 }),
  },
  {
    id: 'shangsi-huangdi',
    name: '上巳节 · 黄帝诞',
    subtitle: '农历三月初三 · 华夏始祖',
    category: 'deity',
    intro: '农历三月初三是上巳节，也是黄帝诞辰日。黄帝乃华夏民族始祖，与炎帝并称"炎黄子孙"之源。古时上巳节有临水祓禊之俗，文人雅士曲水流觞、吟诗作赋。今人于此日祭拜黄帝，缅怀华夏始祖功德。',
    customs: [
      '祭拜黄帝，缅怀华夏始祖开创文明之功德',
      '临水祓禊，古俗于水边沐浴洗去不祥祈求洁净',
      '曲水流觞，文人雅士临水设宴饮酒赋诗',
      '吃荠菜煮鸡蛋，民间以为可祛病驱邪保一年安康',
    ],
    blessing: '炎黄庇佑，华夏昌盛，子孙繁衍，文明永传',
    emoji: '🏛️',
    lunarDate: () => ({ month: 3, day: 3 }),
  },
  {
    id: 'qingming',
    name: '清明节',
    subtitle: '节气清明 · 慎终追远',
    category: 'traditional',
    intro: '清明节是中华民族最重要的祭祀节日，兼具自然与人文两大内涵。既是二十四节气之一，标志着春耕春种的大好时节；又是传统祭祖节日，承载着慎终追远、缅怀先人的深厚情感。清明融汇了寒食节与上巳节的习俗，形成了丰富的文化传统。',
    customs: [
      '扫墓祭祖，清理坟茔杂草，献花焚香缅怀先人',
      '踏青郊游，感受春回大地万物复苏之生机',
      '插柳戴柳，以柳枝辟邪驱灾，祈求平安健康',
      '吃青团、寒食，保留寒食节遗风，以冷食追忆先贤',
    ],
    blessing: '慎终追远，缅怀先德，珍惜当下，福泽绵长',
    emoji: '🌿',
    lunarDate: () => 'jieqi',
  },
  {
    id: 'mazu-dan',
    name: '妈祖诞',
    subtitle: '农历三月廿三 · 天妃圣母',
    category: 'deity',
    intro: '农历三月廿三是妈祖诞辰日。妈祖原名林默娘，宋代福建莆田人，生前常在海上救助遇难渔民，殁后被尊为海神。妈祖信仰从福建沿海传播至台湾、东南亚乃至全球，是海上丝绸之路的文化象征，联合国教科文组织已将妈祖信俗列入人类非物质文化遗产。',
    customs: [
      '祭拜妈祖，沿海渔民焚香祈求出海平安风调雨顺',
      '妈祖巡游，各地妈祖宫庙举行巡安绕境活动',
      '献供祈福，以鲜花果品供奉妈祖祈求阖家平安',
      '诵经法会，宫庙僧道诵经为信众祈福消灾',
    ],
    blessing: '妈祖庇佑，出海平安，风调雨顺，阖家安康',
    emoji: '🌊',
    lunarDate: () => ({ month: 3, day: 23 }),
  },
  {
    id: 'fo-dan',
    name: '佛诞节',
    subtitle: '农历四月初八 · 释迦圣诞',
    category: 'deity',
    intro: '农历四月初八是释迦牟尼佛圣诞日，又称浴佛节。相传释迦牟尼诞生时九龙吐水沐浴其身，故佛教徒于此日以香汤灌洗佛像，纪念佛陀降世。佛诞节是佛教最重要的节日之一，各地寺院举行浴佛大典，信众前往礼佛祈福。',
    customs: [
      '浴佛仪式，以香汤灌洗佛像纪念佛陀降世',
      '寺院开放法会，信众前往礼佛诵经祈福',
      '放生积德，救护生灵以慈悲心效仿佛陀大爱',
      '吃斋念佛，此日持斋清净身心以示虔诚',
    ],
    blessing: '佛光普照，慈悲济世，消灾延寿，福慧双增',
    emoji: '🪷',
    lunarDate: () => ({ month: 4, day: 8 }),
  },
  {
    id: 'bixia-dan',
    name: '碧霞元君诞',
    subtitle: '农历四月十八 · 泰山圣母',
    category: 'deity',
    intro: '农历四月十八是碧霞元君圣诞日。碧霞元君又称泰山圣母、碧霞仙君，道教尊为"天仙玉女碧霞护世弘济真人"，主宰生育、保护妇女儿童。碧霞元君信仰以泰山为中心，辐射华北广大地区，民间有"北元君、南妈祖"之说。',
    customs: [
      '登泰山朝拜碧霞祠，焚香祈求圣母赐福护佑',
      '祈求子嗣，妇女拜碧霞元君求子求女灵验相传',
      '许愿还愿，信众到碧霞祠许愿祈福后还愿酬神',
      '诵经祈福，道教宫观诵碧霞元君宝诰为信众祈福',
    ],
    blessing: '碧霞护佑，母子平安，家庭和睦，子孙昌盛',
    emoji: '⛰️',
    lunarDate: () => ({ month: 4, day: 18 }),
  },
  {
    id: 'dragon-boat',
    name: '端午节',
    subtitle: '农历五月初五 · 端午安康',
    category: 'traditional',
    intro: '端午节又称端阳节、龙舟节，是纪念爱国诗人屈原的传统节日。屈原忠贞不屈、投江殉国，百姓划舟救援、投粽喂鱼以护其身，由此衍生出赛龙舟、吃粽子等千年习俗。端午节也是驱邪避疫的"卫生节"，承载着祈求健康平安的朴素愿望。',
    customs: [
      '吃粽子，以粽叶裹糯米纪念屈原，南北风味各异',
      '赛龙舟，百舸争流竞渡江河，再现当年抢救屈原之景',
      '挂艾草菖蒲，悬于门首驱邪避疫，净化居室空气',
      '佩香囊、系五彩丝，以芳香药物与五彩丝线辟邪保安',
    ],
    blessing: '端午安康，驱邪避疫，身体康健，诸事顺遂',
    emoji: '🐲',
    lunarDate: () => ({ month: 5, day: 5 }),
  },
  {
    id: 'guanyin-chengdao',
    name: '观音成道',
    subtitle: '农历六月十九 · 观音成道日',
    category: 'deity',
    intro: '农历六月十九是观世音菩萨成道日。相传观音菩萨于此日修成正果、成就大道。佛教认为观音菩萨已成佛道，但为救度众生倒驾慈航示现菩萨身。此日佛教寺院举行法会，信众礼拜观音祈求智慧开悟、消灾解难。',
    customs: [
      '礼拜观音菩萨，祈求智慧开悟消灾解难',
      '诵《普门品》，感悟观音菩萨千处祈求千处应之大悲',
      '放生积德，以救护生灵效仿观音慈悲度世',
      '持斋念佛，此日清净身心以示对观音的虔诚',
    ],
    blessing: '观音慈悲，有求必应，消灾解厄，智慧开悟',
    emoji: '🪔',
    lunarDate: () => ({ month: 6, day: 19 }),
  },
  {
    id: 'guandi-dan',
    name: '关帝诞',
    subtitle: '农历六月廿四 · 武圣圣诞',
    category: 'deity',
    intro: '农历六月廿四是关圣帝君圣诞日。关羽字云长，三国蜀汉名将，以忠义勇武著称，殁后被历代帝王加封，尊为"关圣帝君""武财神"。关羽集忠、义、信、勇于一身，儒释道三教共尊，民间奉为武财神保护商贾、镇宅辟邪。',
    customs: [
      '祭拜关帝，焚香供奉祈求忠义护佑镇宅辟邪',
      '商贾拜关帝为武财神，祈求诚信经营财运亨通',
      '关帝庙会，各地关帝庙举行庙会戏曲表演庆贺圣诞',
      '诵读关帝训，以忠义信勇之德自勉修身',
    ],
    blessing: '关帝护佑，忠义传家，镇宅辟邪，财运亨通',
    emoji: '⚔️',
    lunarDate: () => ({ month: 6, day: 24 }),
  },
  {
    id: 'qixi',
    name: '七夕节',
    subtitle: '农历七月初七 · 鹊桥相会',
    category: 'traditional',
    intro: '七夕节又称乞巧节、女儿节，源于牛郎织女鹊桥相会的美丽传说。织女是天帝之女，精于织造，凡间女子于七夕之夜向织女星乞求智巧，故称"乞巧"。七夕是中国传统中最具浪漫色彩的节日，被誉为"中国情人节"。',
    customs: [
      '乞巧拜织女，女子对月穿针祈求心灵手巧',
      '观星望银河，寻找牛郎织女星，回味千古爱情传说',
      '吃巧果、巧面，以节令食物应景添趣',
      '晒书晒衣，趁七夕秋高气爽晾晒衣物书籍防霉蛀',
    ],
    blessing: '鹊桥相会，良缘天定，情比金坚，幸福美满',
    emoji: '💕',
    lunarDate: () => ({ month: 7, day: 7 }),
  },
  {
    id: 'ghost-festival',
    name: '中元节',
    subtitle: '农历七月十五 · 慎终追远',
    category: 'traditional',
    intro: '中元节又称盂兰盆节，道教称中元节，佛教称盂兰盆节，民间俗称"七月半"。这一天是祭祖悼亡的重要日子，佛道两教皆有超度亡灵的仪轨，民间则焚纸烧香祭奠先人。中元节体现了中华文化"孝"的核心价值，是对逝去亲人的深情缅怀。',
    customs: [
      '祭祖烧纸，焚化纸钱冥衣供奉先人，寄托哀思',
      '放河灯，以灯火指引亡魂归途，照亮冥河之路',
      '诵经超度，佛教盂兰盆会诵经救拔饿鬼道众生',
      '施食孤魂，在路口或河边设食施济无主孤魂',
    ],
    blessing: '慎终追远，孝思不匮，先祖庇佑，家宅安宁',
    emoji: '🕯️',
    lunarDate: () => ({ month: 7, day: 15 }),
  },
  {
    id: 'mid-autumn',
    name: '中秋节',
    subtitle: '农历八月十五 · 月圆人圆',
    category: 'traditional',
    intro: '中秋节又称团圆节、月夕，是仅次于春节的第二大传统节日。八月十五秋高气爽、明月当空，古人以圆月象征团圆，寄托思乡怀人之情。嫦娥奔月、吴刚伐桂、玉兔捣药的神话传说，更赋予中秋月夜无尽的诗意与想象。',
    customs: [
      '赏月拜月，全家团聚共赏明月，设香案拜月祈福',
      '吃月饼，以圆饼象征团圆，馈赠亲友表达祝福',
      '饮桂花酒，品桂花糕，以应季花事佐月夜雅兴',
      '燃灯猜谜，中秋花灯与灯谜活动增添节日情趣',
    ],
    blessing: '月圆人圆，阖家团圆，幸福美满，岁岁安康',
    emoji: '🌕',
    lunarDate: () => ({ month: 8, day: 15 }),
  },
  {
    id: 'double-ninth',
    name: '重阳节',
    subtitle: '农历九月初九 · 敬老登高',
    category: 'traditional',
    intro: '重阳节又称登高节、敬老节，"九"为阳数之极，九月九日两阳相重故名"重阳"。重阳节有登高望远、赏菊饮酒、佩插茱萸的传统，也是中华民族敬老尊贤的重要节日，1989年被定为"老人节"，2012年定为"中国老年节"。',
    customs: [
      '登高望远，秋日登临高处饱览山川，舒展身心',
      '赏菊饮菊花酒，以菊花傲霜之节操自勉自励',
      '佩插茱萸，携带茱萸囊辟邪驱灾祈求平安',
      '敬老尊贤，探望慰问长辈，传承孝亲敬老美德',
    ],
    blessing: '登高望远，福寿绵长，敬老尊贤，家道昌隆',
    emoji: '🏔️',
    lunarDate: () => ({ month: 9, day: 9 }),
  },
  {
    id: 'guanyin-chujia',
    name: '观音出家',
    subtitle: '农历九月十九 · 观音出家日',
    category: 'deity',
    intro: '农历九月十九是观世音菩萨出家日。相传观音菩萨于此日发心出家修行，舍弃世俗荣华追求觉悟之道。此日与二月十九观音圣诞、六月十九观音成道并称"观音三诞日"，是佛教重要纪念日。信众于此日礼拜观音，发心向善效仿菩萨出家之志。',
    customs: [
      '礼拜观音菩萨，发心向善效仿菩萨出家修行之志',
      '寺院举行法会，信众前往礼佛诵经祈福消灾',
      '持斋放生，此日持斋清净救护生灵积德行善',
      '诵《普门品》或《心经》，感悟观音慈悲智慧',
    ],
    blessing: '观音慈悲，善念常存，消灾延寿，福慧增长',
    emoji: '🌸',
    lunarDate: () => ({ month: 9, day: 19 }),
  },
  {
    id: 'winter-solstice',
    name: '冬至',
    subtitle: '节气冬至 · 一阳初生',
    category: 'traditional',
    intro: '冬至是二十四节气中最重要的节气之一，古称"亚岁""冬节"，曾有"冬至大如年"之说。冬至日太阳直射南回归线，北半球白昼最短、黑夜最长，此后阳气始生、白昼渐长，故称"一阳初生"。冬至是阴阳转换的关键节点，也是祭祖团聚的重要日子。',
    customs: [
      '吃饺子，北方冬至吃饺子，传说可防冻耳之疾',
      '吃汤圆，南方冬至食汤圆，寓意团圆圆满',
      '祭祖扫墓，缅怀先人感恩祖德，传承家族记忆',
      '数九画图，从冬至起数九九八十一天，记录寒消暖长',
    ],
    blessing: '冬至阳生，万物复苏，团圆美满，福寿安康',
    emoji: '🥟',
    lunarDate: () => 'jieqi',
  },
  {
    id: 'laba',
    name: '腊八节',
    subtitle: '农历腊月初八 · 佛道同庆',
    category: 'traditional',
    intro: '腊八节是农历腊月最重要的节日，佛教纪念释迦牟尼佛成道之日，道教则祭祀祖先神灵。腊八粥的习俗源于佛教寺庙施粥济众的传统，后演变为民间节日食俗。腊八标志着"忙年"的开始，从此进入春节筹备阶段。',
    customs: [
      '熬腊八粥，以八种以上谷物豆果同煮，寓意丰收圆满',
      '泡腊八蒜，以醋浸蒜瓣密封至春节启封，蒜色翠绿味酸',
      '祭祀祖先，腊月祭祖报本追远，感恩一年庇佑',
      '吃腊八面、腊八豆腐，各地食俗各异皆应节令',
    ],
    blessing: '腊八吉祥，佛光普照，五谷丰登，福慧双增',
    emoji: '🫘',
    lunarDate: () => ({ month: 12, day: 8 }),
  },
  {
    id: 'new-year-eve',
    name: '除夕',
    subtitle: '农历腊月最后一天 · 辞旧迎新',
    category: 'traditional',
    intro: '除夕是农历一年的最后一天，"除"为去除之意，"夕"指夜晚，除夕即辞旧迎新之夜。除夕是春节庆祝的核心时刻，全家团聚守岁、共进年夜饭，在爆竹声声中告别旧岁、迎接新年。除夕承载着中华民族对团圆的渴望与对未来的期盼。',
    customs: [
      '吃年夜饭，全家团聚共享丰盛晚宴，是一年最重要的一餐',
      '守岁迎新，彻夜不眠等待新年到来，寓意珍惜光阴',
      '贴春联门神，以红纸金字与威武门神守护家宅纳福',
      '燃放爆竹，以声光辞旧迎新驱赶邪祟迎接吉瑞',
    ],
    blessing: '辞旧迎新，万象更新，阖家团圆，福满人间',
    emoji: '🎆',
    lunarDate: () => 'new-year-eve',
  },
];

function getSolarDateFromLunar(year: number, month: number, day: number): { year: number; month: number; day: number } {
  const lunar = Lunar.fromYmd(year, month, day);
  const solar = lunar.getSolar();
  return { year: solar.getYear(), month: solar.getMonth(), day: solar.getDay() };
}

function getJieQiSolarDate(year: number, jieQiName: string): { year: number; month: number; day: number } {
  const lunar = Solar.fromYmd(year, 1, 1).getLunar();
  const jieQiTable = lunar.getJieQiTable();
  const jieQi = jieQiTable[jieQiName];
  return { year: jieQi.getYear(), month: jieQi.getMonth(), day: jieQi.getDay() };
}

function getNewYearEveSolarDate(year: number): { year: number; month: number; day: number } {
  const nextYearSpring = getSolarDateFromLunar(year + 1, 1, 1);
  const solar = (Solar.fromYmd(nextYearSpring.year, nextYearSpring.month, nextYearSpring.day) as unknown as { next: (n: number) => { getYear: () => number; getMonth: () => number; getDay: () => number } }).next(-1);
  return { year: solar.getYear(), month: solar.getMonth(), day: solar.getDay() };
}

function getFestivalSolarDate(def: FestivalDefinition, year: number): { year: number; month: number; day: number } {
  const lunarDate = def.lunarDate(year);
  if (lunarDate === 'jieqi') {
    if (def.id === 'qingming') return getJieQiSolarDate(year, '清明');
    if (def.id === 'winter-solstice') return getJieQiSolarDate(year, '冬至');
    return getJieQiSolarDate(year, '清明');
  }
  if (lunarDate === 'new-year-eve') {
    return getNewYearEveSolarDate(year);
  }
  return getSolarDateFromLunar(year, lunarDate.month, lunarDate.day);
}

function dateKey(d: { year: number; month: number; day: number }): string {
  return `${d.year}-${String(d.month).padStart(2, '0')}-${String(d.day).padStart(2, '0')}`;
}

export function getTodayFestival(): Festival | null {
  const today = new Date();
  const todayKey = dateKey({
    year: today.getFullYear(),
    month: today.getMonth() + 1,
    day: today.getDate(),
  });

  const currentYear = today.getFullYear();
  const yearsToCheck = [currentYear - 1, currentYear, currentYear + 1];

  for (const def of FESTIVAL_DEFS) {
    for (const year of yearsToCheck) {
      try {
        const solarDate = getFestivalSolarDate(def, year);
        if (dateKey(solarDate) === todayKey) {
          return {
            id: def.id,
            name: def.name,
            subtitle: def.subtitle,
            category: def.category,
            intro: def.intro,
            customs: def.customs,
            blessing: def.blessing,
            emoji: def.emoji,
          };
        }
      } catch { /* skip invalid date */ }
    }
  }
  return null;
}

export function getAllFestivals(): Festival[] {
  return FESTIVAL_DEFS.map(def => ({
    id: def.id,
    name: def.name,
    subtitle: def.subtitle,
    category: def.category,
    intro: def.intro,
    customs: def.customs,
    blessing: def.blessing,
    emoji: def.emoji,
  }));
}