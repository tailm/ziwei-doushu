import type { LineType, FortuneLevel } from './types';

export interface HexagramData {
  number: number;
  name: string;
  chineseName: string;
  lines: LineType[];
  judgment: string;
  fortuneLevel: FortuneLevel;
  advice: string[];
}

export const HEXAGRAMS: HexagramData[] = [
  { number: 1, name: 'Qian', chineseName: '乾', lines: ['yang', 'yang', 'yang', 'yang', 'yang', 'yang'], judgment: '元亨利贞。天行健，君子以自强不息。', fortuneLevel: '大吉', advice: ['刚健进取，大有可为', '自强不息，持之以恒', '领导力强，宜主导大事'] },
  { number: 2, name: 'Kun', chineseName: '坤', lines: ['yin', 'yin', 'yin', 'yin', 'yin', 'yin'], judgment: '元亨，利牝马之贞。地势坤，君子以厚德载物。', fortuneLevel: '吉', advice: ['柔顺包容，厚德载物', '顺势而为，不争不抢', '以柔克刚，耐心等待'] },
  { number: 3, name: 'Zhun', chineseName: '屯', lines: ['yin', 'yang', 'yin', 'yin', 'yin', 'yang'], judgment: '元亨利贞，勿用有攸往。初难后易。', fortuneLevel: '小凶', advice: ['初创艰难，需耐心坚持', '不宜冒进，稳扎稳打', '困难是暂时的，终有转机'] },
  { number: 4, name: 'Meng', chineseName: '蒙', lines: ['yin', 'yang', 'yin', 'yin', 'yang', 'yin'], judgment: '亨。匪我求童蒙，童蒙求我。启蒙解惑。', fortuneLevel: '中吉', advice: ['虚心学习，求教于人', '启蒙解惑，宜受教育', '不可自满，需知不足'] },
  { number: 5, name: 'Xu', chineseName: '需', lines: ['yang', 'yin', 'yin', 'yin', 'yang', 'yang'], judgment: '有孚，光亨，贞吉。需者，须也，等待之意。', fortuneLevel: '吉', advice: ['耐心等待时机成熟', '不可急躁，蓄势待发', '等待中有诚信则吉'] },
  { number: 6, name: 'Song', chineseName: '讼', lines: ['yin', 'yang', 'yin', 'yang', 'yin', 'yang'], judgment: '有孚，窒惕，中吉终凶。讼不可长。', fortuneLevel: '小凶', advice: ['争讼不可长久，宜和解', '警惕口舌是非', '退一步海阔天空'] },
  { number: 7, name: 'Shi', chineseName: '师', lines: ['yin', 'yin', 'yang', 'yin', 'yin', 'yin'], judgment: '贞，丈人吉无咎。师者，众也，用兵之道。', fortuneLevel: '中吉', advice: ['纪律严明，统帅有道', '团队协作，纪律为先', '用兵需谨慎，正义之师吉'] },
  { number: 8, name: 'Bi', chineseName: '比', lines: ['yin', 'yin', 'yin', 'yang', 'yin', 'yin'], judgment: '吉。原筮元永贞，无咎。比者，亲比也。', fortuneLevel: '吉', advice: ['亲近团结，互助合作', '选择良友，亲比贤人', '团结则吉，孤立则凶'] },
  { number: 9, name: 'Xiao Chu', chineseName: '小畜', lines: ['yang', 'yang', 'yang', 'yin', 'yang', 'yang'], judgment: '亨。密云不雨，自我西郊。小有蓄积。', fortuneLevel: '中吉', advice: ['小有积蓄，不宜大动', '蓄势待发，密云将雨', '以柔蓄刚，渐积渐成'] },
  { number: 10, name: 'Lu', chineseName: '履', lines: ['yang', 'yang', 'yin', 'yang', 'yang', 'yang'], judgment: '履虎尾，不咥人，亨。履者，行也。', fortuneLevel: '中吉', advice: ['谨慎行事，如履薄冰', '虽有危险但可平安', '守礼而行，步步谨慎'] },
  { number: 11, name: 'Tai', chineseName: '泰', lines: ['yin', 'yin', 'yang', 'yang', 'yang', 'yin'], judgment: '小往大来，吉亨。天地交泰，万物通。', fortuneLevel: '大吉', advice: ['天地交泰，万事亨通', '上下沟通，和谐顺畅', '宜进取，大有可为'] },
  { number: 12, name: 'Pi', chineseName: '否', lines: ['yang', 'yang', 'yin', 'yin', 'yin', 'yang'], judgment: '否之匪人，不利君子贞。天地不交。', fortuneLevel: '凶', advice: ['天地不交，宜守不宜进', '闭塞不通，需忍耐', '俭德避难，等待转机'] },
  { number: 13, name: 'Tong Ren', chineseName: '同人', lines: ['yang', 'yin', 'yang', 'yang', 'yang', 'yang'], judgment: '同人于野，亨。同心协力，志同道合。', fortuneLevel: '吉', advice: ['同心协力，团结众人', '志同道合，共创大业', '光明磊落，以诚待人'] },
  { number: 14, name: 'Da You', chineseName: '大有', lines: ['yang', 'yang', 'yang', 'yang', 'yin', 'yang'], judgment: '元亨。大有所获，富有天下。', fortuneLevel: '大吉', advice: ['大有所获，事业鼎盛', '富有天下，宜谦逊', '盛极宜守，不可骄纵'] },
  { number: 15, name: 'Qian', chineseName: '谦', lines: ['yin', 'yin', 'yang', 'yin', 'yin', 'yin'], judgment: '亨，君子有终。谦逊之道，终得善果。', fortuneLevel: '吉', advice: ['谦虚谨慎，终得善果', '谦逊待人，受人尊敬', '不骄不躁，平稳前行'] },
  { number: 16, name: 'Yu', chineseName: '豫', lines: ['yin', 'yin', 'yin', 'yang', 'yin', 'yin'], judgment: '利建侯行师。欢乐愉悦，顺势而为。', fortuneLevel: '吉', advice: ['欢乐愉悦，顺势而为', '趁势而起，把握时机', '愉悦中需防乐极生悲'] },
  { number: 17, name: 'Sui', chineseName: '随', lines: ['yin', 'yang', 'yin', 'yin', 'yang', 'yang'], judgment: '元亨利贞，无咎。随顺时势，随机应变。', fortuneLevel: '吉', advice: ['随顺时势，随机应变', '择善而从，顺应变化', '灵活机动，不可固执'] },
  { number: 18, name: 'Gu', chineseName: '蛊', lines: ['yang', 'yin', 'yang', 'yin', 'yin', 'yin'], judgment: '元亨，利涉大川。整治败坏，革故鼎新。', fortuneLevel: '中吉', advice: ['整治败坏，革故鼎新', '破旧立新，勇气可嘉', '先甲三日，后甲三日，慎始慎终'] },
  { number: 19, name: 'Lin', chineseName: '临', lines: ['yin', 'yang', 'yin', 'yin', 'yin', 'yin'], judgment: '元亨利贞，至于八月有凶。临近而治。', fortuneLevel: '吉', advice: ['临近而治，把握当下', '盛极将衰，需防转势', '宜趁势进取，但勿忘危机'] },
  { number: 20, name: 'Guan', chineseName: '观', lines: ['yin', 'yin', 'yin', 'yin', 'yang', 'yin'], judgment: '盥而不荐，有孚颙若。观察体悟。', fortuneLevel: '中吉', advice: ['观察体悟，深思熟虑', '以身作则，为人表率', '审时度势，不可轻动'] },
  { number: 21, name: 'Shi He', chineseName: '噬嗑', lines: ['yang', 'yin', 'yin', 'yang', 'yin', 'yang'], judgment: '亨，利用狱。咬合决断，刑狱之事。', fortuneLevel: '中吉', advice: ['果断决断，排除障碍', '咬合之间，需明是非', '刑狱之事，公正严明'] },
  { number: 22, name: 'Bi', chineseName: '贲', lines: ['yang', 'yin', 'yin', 'yin', 'yang', 'yang'], judgment: '亨，小利有攸往。文饰之美，装饰修饰。', fortuneLevel: '中吉', advice: ['文饰修饰，注重外表', '内外兼修，不可只重外表', '适度装饰，过则失真'] },
  { number: 23, name: 'Bo', chineseName: '剥', lines: ['yin', 'yin', 'yin', 'yin', 'yin', 'yang'], judgment: '不利有攸往。剥落衰败，需守不宜进。', fortuneLevel: '凶', advice: ['剥落衰败，宜守不宜进', '厚下安宅，稳固根基', '等待剥极而复的转机'] },
  { number: 24, name: 'Fu', chineseName: '复', lines: ['yang', 'yin', 'yin', 'yin', 'yin', 'yin'], judgment: '亨。出入无疾，朋来无咎。复归正道。', fortuneLevel: '吉', advice: ['复归正道，转机将至', '迷途知返，善莫大焉', '一阳来复，生机重现'] },
  { number: 25, name: 'Wu Wang', chineseName: '无妄', lines: ['yang', 'yin', 'yin', 'yang', 'yang', 'yang'], judgment: '元亨利贞，其匪正有眚。无妄之灾。', fortuneLevel: '中吉', advice: ['无妄而行，顺其自然', '不可妄为，守正则吉', '意外之灾，需防不测'] },
  { number: 26, name: 'Da Chu', chineseName: '大畜', lines: ['yang', 'yang', 'yin', 'yang', 'yang', 'yin'], judgment: '利贞，不家食吉，利涉大川。大有所蓄。', fortuneLevel: '大吉', advice: ['大有所蓄，厚积薄发', '蓄德蓄才，终有大用', '日新其德，不断精进'] },
  { number: 27, name: 'Yi', chineseName: '颐', lines: ['yang', 'yin', 'yin', 'yin', 'yin', 'yang'], judgment: '贞吉，观颐，自求口实。养身养德。', fortuneLevel: '吉', advice: ['养身养德，慎言慎食', '自食其力，自求口实', '养正则吉，养邪则凶'] },
  { number: 28, name: 'Da Guo', chineseName: '大过', lines: ['yin', 'yang', 'yang', 'yang', 'yang', 'yin'], judgment: '栋桡，利有攸往，亨。大过之象。', fortuneLevel: '小凶', advice: ['大过之象，非常之事', '栋梁弯曲，需防折断', '非常之时需非常之举'] },
  { number: 29, name: 'Kan', chineseName: '坎', lines: ['yin', 'yang', 'yin', 'yin', 'yang', 'yin'], judgment: '习坎，有孚，维心亨，行有尚。重险陷。', fortuneLevel: '凶', advice: ['重险陷落，需谨慎应对', '诚信可渡难关', '不可冒进，宜守不宜行'] },
  { number: 30, name: 'Li', chineseName: '离', lines: ['yang', 'yin', 'yang', 'yang', 'yin', 'yang'], judgment: '利贞，亨，畜牝牛吉。光明附丽。', fortuneLevel: '吉', advice: ['光明附丽，前途光明', '依附正道，光明磊落', '畜牝牛吉，柔顺守正'] },
  { number: 31, name: 'Xian', chineseName: '咸', lines: ['yin', 'yang', 'yin', 'yang', 'yang', 'yin'], judgment: '亨，利贞，取女吉。感应交感。', fortuneLevel: '吉', advice: ['感应交感，心心相印', '取女吉，感情和谐', '以诚相感，自然呼应'] },
  { number: 32, name: 'Heng', chineseName: '恒', lines: ['yin', 'yang', 'yang', 'yang', 'yin', 'yin'], judgment: '亨，无咎，利贞，利有攸往。恒久之道。', fortuneLevel: '吉', advice: ['恒久坚持，持之以恒', '守正不变，长久之道', '夫妻恒久，白头偕老'] },
  { number: 33, name: 'Dun', chineseName: '遁', lines: ['yin', 'yin', 'yang', 'yang', 'yang', 'yin'], judgment: '亨，小利贞。退避隐遁，适时而退。', fortuneLevel: '中吉', advice: ['适时退避，知进知退', '隐遁避祸，保全自身', '退一步海阔天空'] },
  { number: 34, name: 'Da Zhuang', chineseName: '大壮', lines: ['yang', 'yang', 'yang', 'yang', 'yin', 'yin'], judgment: '利贞。大壮强盛，壮盛有力。', fortuneLevel: '吉', advice: ['壮盛有力，宜守正道', '强盛不可骄纵', '非礼弗履，壮而有德'] },
  { number: 35, name: 'Jin', chineseName: '晋', lines: ['yin', 'yang', 'yang', 'yang', 'yin', 'yin'], judgment: '康侯用锡马蕃庶，昼日三接。晋升前进。', fortuneLevel: '大吉', advice: ['晋升前进，光明在前', '步步高升，受人赏识', '顺时而进，前途光明'] },
  { number: 36, name: 'Ming Yi', chineseName: '明夷', lines: ['yin', 'yin', 'yang', 'yin', 'yin', 'yang'], judgment: '利艰贞。光明受伤，韬光养晦。', fortuneLevel: '凶', advice: ['光明受伤，韬光养晦', '外愚内智，隐忍待时', '艰难守正，终见光明'] },
  { number: 37, name: 'Jia Ren', chineseName: '家人', lines: ['yang', 'yin', 'yang', 'yin', 'yin', 'yang'], judgment: '利女贞。家人之道，家内和睦。', fortuneLevel: '吉', advice: ['家内和睦，各司其职', '严正治家，威信有度', '夫妻同心，家道兴旺'] },
  { number: 38, name: 'Kui', chineseName: '睽', lines: ['yang', 'yin', 'yin', 'yang', 'yin', 'yang'], judgment: '小事吉。乖违背离，求同存异。', fortuneLevel: '小凶', advice: ['乖违背离，求同存异', '小事可吉，大事不宜', '以柔化乖，终能合睽'] },
  { number: 39, name: 'Jian', chineseName: '蹇', lines: ['yin', 'yin', 'yang', 'yin', 'yin', 'yang'], judgment: '利西南，不利东北，利见大人。蹇难险阻。', fortuneLevel: '凶', advice: ['蹇难险阻，需贵人相助', '宜往西南，不宜东北', '见险而止，待时而行'] },
  { number: 40, name: 'Jie', chineseName: '解', lines: ['yang', 'yin', 'yin', 'yang', 'yin', 'yin'], judgment: '利西南，无所往，其来复吉。解难释险。', fortuneLevel: '吉', advice: ['解难释险，困境解除', '赦过宥罪，宽以待人', '险难已解，宜速行动'] },
  { number: 41, name: 'Sun', chineseName: '损', lines: ['yang', 'yang', 'yin', 'yin', 'yin', 'yin'], judgment: '有孚，元吉，无咎，可贞。减损之道。', fortuneLevel: '中吉', advice: ['减损之道，损己利人', '损下益上，适度而行', '损中有孚，终得善果'] },
  { number: 42, name: 'Yi', chineseName: '益', lines: ['yin', 'yin', 'yin', 'yin', 'yang', 'yang'], judgment: '利有攸往，利涉大川。增益之道。', fortuneLevel: '大吉', advice: ['增益之道，损上益下', '利涉大川，大有可为', '见善则迁，有过则改'] },
  { number: 43, name: 'Guai', chineseName: '夬', lines: ['yang', 'yang', 'yang', 'yang', 'yang', 'yin'], judgment: '扬于王庭，孚号有厉。决断果决。', fortuneLevel: '中吉', advice: ['决断果决，排除小人', '不可迟疑，当断则断', '刚决柔，需防后患'] },
  { number: 44, name: 'Gou', chineseName: '姤', lines: ['yin', 'yang', 'yang', 'yang', 'yang', 'yang'], judgment: '女壮，勿用取女。邂逅相遇。', fortuneLevel: '小凶', advice: ['邂逅相遇，不宜深交', '一阴遇五阳，需防小人', '不可取女，防壮女之害'] },
  { number: 45, name: 'Cui', chineseName: '萃', lines: ['yin', 'yin', 'yang', 'yang', 'yin', 'yin'], judgment: '亨，王假有庙，利见大人。聚集汇合。', fortuneLevel: '吉', advice: ['聚集汇合，团结众力', '利见大人，贵人相助', '聚以正道，不可妄聚'] },
  { number: 46, name: 'Sheng', chineseName: '升', lines: ['yin', 'yin', 'yin', 'yang', 'yin', 'yin'], judgment: '元亨，用见大人，勿恤，南征吉。上升晋升。', fortuneLevel: '大吉', advice: ['上升晋升，步步高升', '顺时而升，前途光明', '积小成大，渐进上升'] },
  { number: 47, name: 'Kun', chineseName: '困', lines: ['yang', 'yin', 'yin', 'yang', 'yin', 'yin'], judgment: '亨，贞，大人吉无咎。困窘艰难。', fortuneLevel: '凶', advice: ['困窘艰难，需守正道', '大人吉无咎，小人困', '身困心不困，守志待时'] },
  { number: 48, name: 'Jing', chineseName: '井', lines: ['yin', 'yang', 'yin', 'yin', 'yang', 'yin'], judgment: '改邑不改井，无丧无得。井养不穷。', fortuneLevel: '中吉', advice: ['井养不穷，持续供给', '守恒不变，持之以恒', '修井养人，利泽众人'] },
  { number: 49, name: 'Ge', chineseName: '革', lines: ['yang', 'yin', 'yin', 'yang', 'yang', 'yang'], judgment: '巳日乃孚，元亨利贞，悔亡。变革革新。', fortuneLevel: '吉', advice: ['变革革新，顺天应人', '巳日乃孚，取信于人', '革故鼎新，需待时机'] },
  { number: 50, name: 'Ding', chineseName: '鼎', lines: ['yang', 'yang', 'yang', 'yin', 'yin', 'yang'], judgment: '元吉，亨。鼎新养人，稳固安泰。', fortuneLevel: '大吉', advice: ['鼎新养人，稳固安泰', '革故鼎新，大吉大利', '正位凝命，安邦定国'] },
  { number: 51, name: 'Zhen', chineseName: '震', lines: ['yang', 'yin', 'yin', 'yang', 'yin', 'yin'], judgment: '亨，震来虩虩，笑言哑哑。震动惊惧。', fortuneLevel: '中吉', advice: ['震动惊惧，临危不乱', '惊而后安，笑言哑哑', '恐惧修省，谨慎行事'] },
  { number: 52, name: 'Gen', chineseName: '艮', lines: ['yin', 'yin', 'yang', 'yin', 'yin', 'yang'], judgment: '艮其背，不获其身，行其庭不见其人。静止不动。', fortuneLevel: '平', advice: ['静止不动，适时而止', '止于至善，知止不殆', '动静适时，不可妄动'] },
  { number: 53, name: 'Jian', chineseName: '渐', lines: ['yin', 'yang', 'yin', 'yin', 'yang', 'yang'], judgment: '女归吉，利贞。循序渐进。', fortuneLevel: '吉', advice: ['循序渐进，稳步前行', '女归吉，婚姻顺遂', '渐进而行，不可急躁'] },
  { number: 54, name: 'Gui Mei', chineseName: '归妹', lines: ['yang', 'yang', 'yin', 'yin', 'yang', 'yin'], judgment: '征凶，无攸利。归妹不当，需守正。', fortuneLevel: '小凶', advice: ['归妹不当，需守正道', '征凶无利，不宜冒进', '位置不当，需调整关系'] },
  { number: 55, name: 'Feng', chineseName: '丰', lines: ['yang', 'yang', 'yin', 'yang', 'yin', 'yin'], judgment: '亨，王假之，勿忧，宜日中。丰盛盛大。', fortuneLevel: '大吉', advice: ['丰盛盛大，宜日中时', '盛极将衰，需防日昃', '丰中有忧，守盛不骄'] },
  { number: 56, name: 'Lu', chineseName: '旅', lines: ['yin', 'yin', 'yang', 'yang', 'yang', 'yin'], judgment: '小亨，旅贞吉。旅行在外，谨慎为上。', fortuneLevel: '小凶', advice: ['旅行在外，谨慎为上', '小亨贞吉，柔顺待人', '失其所居，需寻安处'] },
  { number: 57, name: 'Xun', chineseName: '巽', lines: ['yang', 'yang', 'yang', 'yin', 'yang', 'yang'], judgment: '小亨，利有攸往，利见大人。顺从渗透。', fortuneLevel: '中吉', advice: ['顺从渗透，柔顺行事', '利见大人，贵人相助', '申命行事，反复叮咛'] },
  { number: 58, name: 'Dui', chineseName: '兑', lines: ['yang', 'yang', 'yin', 'yang', 'yang', 'yin'], judgment: '亨，利贞。喜悦和乐，以悦待人。', fortuneLevel: '吉', advice: ['喜悦和乐，以悦待人', '朋友讲习，切磋琢磨', '悦以利贞，不可邪悦'] },
  { number: 59, name: 'Huan', chineseName: '涣', lines: ['yin', 'yang', 'yin', 'yang', 'yang', 'yin'], judgment: '亨，王假有庙，利涉大川。涣散化解。', fortuneLevel: '中吉', advice: ['涣散化解，化险为夷', '利涉大川，乘木有功', '聚散有度，散而后聚'] },
  { number: 60, name: 'Jie', chineseName: '节', lines: ['yang', 'yang', 'yin', 'yin', 'yang', 'yin'], judgment: '亨，苦节不可贞。节制有度。', fortuneLevel: '中吉', advice: ['节制有度，不可苦节', '制度有数，适度而行', '节以制度，不伤财不害民'] },
  { number: 61, name: 'Zhong Fu', chineseName: '中孚', lines: ['yang', 'yang', 'yin', 'yin', 'yang', 'yang'], judgment: '豚鱼吉，利涉大川，利贞。诚信中正。', fortuneLevel: '大吉', advice: ['诚信中正，豚鱼吉', '信及豚鱼，诚信感物', '利涉大川，信可渡险'] },
  { number: 62, name: 'Xiao Guo', chineseName: '小过', lines: ['yin', 'yang', 'yang', 'yang', 'yang', 'yin'], judgment: '亨，利贞，可小事不可大事。小有过越。', fortuneLevel: '小凶', advice: ['小有过越，宜小不宜大', '可小事不可大事', '过以利贞，适度而行'] },
  { number: 63, name: 'Ji Ji', chineseName: '既济', lines: ['yang', 'yin', 'yang', 'yin', 'yang', 'yin'], judgment: '亨小，利贞，初吉终乱。已经成功。', fortuneLevel: '中吉', advice: ['已经成功，需防终乱', '初吉终乱，居安思危', '事已成则需守成'] },
  { number: 64, name: 'Wei Ji', chineseName: '未济', lines: ['yin', 'yang', 'yin', 'yang', 'yin', 'yang'], judgment: '亨，小狐汔济，濡其尾，无攸利。尚未成功。', fortuneLevel: '小凶', advice: ['尚未成功，需继续努力', '小狐汔济，功亏一篑', '未济之中有生机，终将成功'] },
];

export function getHexagramByLines(lines: LineType[]): HexagramData | null {
  const binary = lines.map(l => (l === 'yang' || l === 'old_yang') ? '1' : '0').join('');
  return HEXAGRAMS.find(h => {
    const hBinary = h.lines.map(l => l === 'yang' ? '1' : '0').join('');
    return hBinary === binary;
  }) ?? null;
}

export function getHexagramByNumber(num: number): HexagramData | null {
  return HEXAGRAMS.find(h => h.number === num) ?? null;
}