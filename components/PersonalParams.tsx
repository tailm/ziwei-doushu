'use client';
import { motion } from 'framer-motion';
import { useLang } from '@/lib/i18n/LanguageContext';

export type QuestionTopic = 'fu' | 'lu' | 'shou' | 'xue' | 'zi' | 'yin' | 'other' | '';

export const QUESTION_TOPICS_ZH: Record<QuestionTopic, string> = {
  fu: '求福',
  lu: '求禄',
  shou: '求寿',
  xue: '求学',
  zi: '求子',
  yin: '求姻缘',
  other: '其他',
  '': '求什么',
};

export const QUESTION_TOPICS_EN: Record<QuestionTopic, string> = {
  fu: 'Blessing',
  lu: 'Prosperity',
  shou: 'Longevity',
  xue: 'Study',
  zi: 'Children',
  yin: 'Marriage',
  other: 'Other',
  '': 'Ask About',
};

const TOPIC_ICONS: Record<QuestionTopic, string> = {
  fu: '福',
  lu: '禄',
  shou: '寿',
  xue: '学',
  zi: '子',
  yin: '缘',
  other: '✦',
  '': '',
};

interface QuestionSelectorProps {
  value: QuestionTopic;
  onChange: (topic: QuestionTopic) => void;
  goldSolid: string;
  goldLine: string;
  cardBg: string;
  cardBorder: string;
  textMuted: string;
  textFaint: string;
}

export function QuestionSelector({ value, onChange, goldSolid, goldLine, cardBg, cardBorder, textMuted, textFaint }: QuestionSelectorProps) {
  const { lang } = useLang();
  const topics: QuestionTopic[] = ['fu', 'lu', 'shou', 'xue', 'zi', 'yin', 'other'];
  const labels = lang === 'zh' ? QUESTION_TOPICS_ZH : QUESTION_TOPICS_EN;

  return (
    <div className="mb-4">
      <div className="text-[11px] tracking-[0.2em] mb-2" style={{ color: textFaint }}>
        {lang === 'zh' ? '求什么' : 'Ask About'}
      </div>
      <div className="flex gap-2 flex-wrap">
        {topics.map(topic => (
          <motion.button key={topic}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => onChange(value === topic ? '' : topic)}
            className="text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all"
            style={{
              background: value === topic ? `${goldSolid}15` : cardBg,
              border: `1px solid ${value === topic ? goldSolid : cardBorder}`,
              color: value === topic ? goldSolid : textMuted,
            }}>
            <span style={{ fontSize: '11px', fontFamily: 'serif', fontWeight: 'bold' }}>{TOPIC_ICONS[topic]}</span>
            {labels[topic]}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

export function buildPersonalContext(
  user: { gender: string | null; birth_date: string | null; birth_city: string | null; current_city: string | null } | null,
  questionTopic: QuestionTopic,
  lang: 'zh' | 'en',
): string {
  const parts: string[] = [];
  const labels = lang === 'zh' ? QUESTION_TOPICS_ZH : QUESTION_TOPICS_EN;

  if (user?.gender) {
    parts.push(lang === 'zh' ? `性别: ${user.gender === 'male' ? '男' : '女'}` : `Gender: ${user.gender === 'male' ? 'Male' : 'Female'}`);
  }
  if (user?.birth_date) {
    const year = user.birth_date.split('-')[0];
    if (year) {
      const age = new Date().getFullYear() - parseInt(year);
      if (age > 0 && age < 150) {
        parts.push(lang === 'zh' ? `年龄: ${age}岁（${year}年生）` : `Age: ${age} (born ${year})`);
      } else {
        parts.push(lang === 'zh' ? `出生年份: ${year}` : `Birth Year: ${year}`);
      }
    }
  }
  if (user?.birth_city) {
    parts.push(lang === 'zh' ? `籍贯: ${user.birth_city}` : `Hometown: ${user.birth_city}`);
  }
  if (user?.current_city) {
    parts.push(lang === 'zh' ? `所在地: ${user.current_city}` : `Current City: ${user.current_city}`);
  }
  if (questionTopic) {
    parts.push(lang === 'zh' ? `所求事项: ${labels[questionTopic]}` : `Question: ${labels[questionTopic]}`);
  }

  return parts.join('\n');
}

export function getPersonalInfoSummary(
  user: { gender: string | null; birth_date: string | null; birth_city: string | null; current_city: string | null } | null,
  lang: 'zh' | 'en',
): string {
  if (!user) return '';
  const parts: string[] = [];
  if (user.gender) {
    parts.push(lang === 'zh' ? (user.gender === 'male' ? '男' : '女') : (user.gender === 'male' ? 'M' : 'F'));
  }
  if (user.birth_date) {
    const year = user.birth_date.split('-')[0];
    if (year) {
      const age = new Date().getFullYear() - parseInt(year);
      if (age > 0 && age < 150) {
        parts.push(lang === 'zh' ? `${age}岁` : `${age}y`);
      } else {
        parts.push(year);
      }
    }
  }
  if (user.birth_city) {
    parts.push(user.birth_city);
  }
  return parts.join(' · ');
}