import { Solar } from 'lunar-javascript';
import type { CalendarAlmanacData } from './types';

export function getCalendarAlmanac(date: Date): CalendarAlmanacData {
  const solar = Solar.fromYmd(date.getFullYear(), date.getMonth() + 1, date.getDate());
  const lunar = solar.getLunar();
  const eightChar = lunar.getEightChar();

  const solarDateChinese = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  const weekday = weekdays[date.getDay()];

  const lunarYearChinese = lunar.getYearInChinese();
  const lunarMonthChinese = lunar.getMonthInChinese();
  const lunarDayChinese = lunar.getDayInChinese();

  let currentJieQi: CalendarAlmanacData['jieQi']['current'] = null;
  let nextJieQi: CalendarAlmanacData['jieQi']['next'] = null;

  try {
    const prevJq = lunar.getPrevJieQi();
    const nextJq = lunar.getNextJieQi();

    if (nextJq) {
      const jqSolar = nextJq.getSolar();
      const jqDate = `${jqSolar.getYear()}-${String(jqSolar.getMonth()).padStart(2, '0')}-${String(jqSolar.getDay()).padStart(2, '0')}`;
      const todayStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

      if (jqDate === todayStr) {
        const isToday = todayStr === `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`;
        const jqHour = jqSolar.getHour();
        const jqMinute = jqSolar.getMinute();
        const jqMinutes = jqHour * 60 + jqMinute;

        const currentMinutes = isToday ? (new Date().getHours() * 60 + new Date().getMinutes()) : 24 * 60;

        if (currentMinutes >= jqMinutes) {
          currentJieQi = {
            name: nextJq.getName(),
            date: jqDate,
            time: `${String(jqHour).padStart(2, '0')}:${String(jqMinute).padStart(2, '0')}:00`,
          };
          try {
            const futureDate = new Date(jqSolar.getYear(), jqSolar.getMonth() - 1, jqSolar.getDay() + 1);
            const futureSolar = Solar.fromYmd(futureDate.getFullYear(), futureDate.getMonth() + 1, futureDate.getDate());
            const futureLunar = futureSolar.getLunar();
            const nextNextJq = futureLunar.getNextJieQi();
            if (nextNextJq) {
              const nnSolar = nextNextJq.getSolar();
              nextJieQi = {
                name: nextNextJq.getName(),
                date: `${nnSolar.getYear()}-${String(nnSolar.getMonth()).padStart(2, '0')}-${String(nnSolar.getDay()).padStart(2, '0')}`,
                time: `${String(nnSolar.getHour()).padStart(2, '0')}:${String(nnSolar.getMinute()).padStart(2, '0')}:00`,
              };
            }
          } catch { /* ignore */ }
        } else {
          if (prevJq) {
            const prevSolar = prevJq.getSolar();
            currentJieQi = {
              name: prevJq.getName(),
              date: `${prevSolar.getYear()}-${String(prevSolar.getMonth()).padStart(2, '0')}-${String(prevSolar.getDay()).padStart(2, '0')}`,
              time: `${String(prevSolar.getHour()).padStart(2, '0')}:${String(prevSolar.getMinute()).padStart(2, '0')}:00`,
            };
          }
          nextJieQi = {
            name: nextJq.getName(),
            date: jqDate,
            time: `${String(jqHour).padStart(2, '0')}:${String(jqMinute).padStart(2, '0')}:00`,
          };
        }
      } else {
        if (prevJq) {
          const prevSolar = prevJq.getSolar();
          currentJieQi = {
            name: prevJq.getName(),
            date: `${prevSolar.getYear()}-${String(prevSolar.getMonth()).padStart(2, '0')}-${String(prevSolar.getDay()).padStart(2, '0')}`,
            time: `${String(prevSolar.getHour()).padStart(2, '0')}:${String(prevSolar.getMinute()).padStart(2, '0')}:00`,
          };
        }
        const jqSolar2 = nextJq.getSolar();
        nextJieQi = {
          name: nextJq.getName(),
          date: `${jqSolar2.getYear()}-${String(jqSolar2.getMonth()).padStart(2, '0')}-${String(jqSolar2.getDay()).padStart(2, '0')}`,
          time: `${String(jqSolar2.getHour()).padStart(2, '0')}:${String(jqSolar2.getMinute()).padStart(2, '0')}:00`,
        };
      }
    } else if (prevJq) {
      const prevSolar = prevJq.getSolar();
      currentJieQi = {
        name: prevJq.getName(),
        date: `${prevSolar.getYear()}-${String(prevSolar.getMonth()).padStart(2, '0')}-${String(prevSolar.getDay()).padStart(2, '0')}`,
        time: `${String(prevSolar.getHour()).padStart(2, '0')}:${String(prevSolar.getMinute()).padStart(2, '0')}:00`,
      };
    }
  } catch { /* ignore */ }

  const safeGet = <T>(fn: () => T, defaultValue: T): T => {
    try { return fn() ?? defaultValue; } catch { return defaultValue; }
  };

  const safeGetArray = (fn: () => string[]): string[] => {
    try { return fn() || []; } catch { return []; }
  };

  return {
    solarDate: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`,
    solarDateChinese,
    weekday,
    lunarDate: `${lunarYearChinese}年${lunarMonthChinese}月${lunarDayChinese}`,
    lunarMonthDay: `${lunarMonthChinese}月${lunarDayChinese}`,

    shengXiao: {
      year: safeGet(() => lunar.getYearShengXiao(), ''),
      month: safeGet(() => lunar.getMonthShengXiao(), ''),
      day: safeGet(() => lunar.getDayShengXiao(), ''),
    },

    ganZhi: {
      year: `${eightChar.getYearGan()}${eightChar.getYearZhi()}`,
      month: `${eightChar.getMonthGan()}${eightChar.getMonthZhi()}`,
      day: `${eightChar.getDayGan()}${eightChar.getDayZhi()}`,
      time: '',
    },

    naYin: {
      year: safeGet(() => eightChar.getYearNaYin(), ''),
      month: safeGet(() => eightChar.getMonthNaYin(), ''),
      day: safeGet(() => eightChar.getDayNaYin(), ''),
    },

    jieQi: {
      current: currentJieQi,
      next: nextJieQi,
    },

    yi: safeGetArray(() => lunar.getDayYi()),
    ji: safeGetArray(() => lunar.getDayJi()),

    jiShen: safeGetArray(() => lunar.getDayJiShen()),
    xiongSha: safeGetArray(() => lunar.getDayXiongSha()),

    chongSha: {
      chong: safeGet(() => lunar.getChongDesc(), ''),
      sha: safeGet(() => lunar.getSha(), ''),
    },

    kongWang: safeGet(() => lunar.getDayXunKong(), ''),

    taiShen: safeGet(() => lunar.getDayPositionTai(), ''),

    zhiShen: safeGet(() => lunar.getDayTianShen(), ''),

    shenWei: {
      caiShen: safeGet(() => lunar.getDayPositionCaiDesc(), ''),
      xiShen: safeGet(() => lunar.getDayPositionXiDesc(), ''),
      fuShen: safeGet(() => lunar.getDayPositionFuDesc(), ''),
      yangGuiShen: safeGet(() => lunar.getDayPositionYangGuiDesc(), ''),
    },

    xiu: {
      name: safeGet(() => lunar.getXiu(), ''),
      gong: safeGet(() => `${lunar.getGong()} ${lunar.getShou()}`, ''),
      luck: safeGet(() => lunar.getXiuLuck(), ''),
    },

    yueXiang: safeGet(() => lunar.getYueXiang(), ''),

    liuYao: safeGet(() => lunar.getLiuYao(), ''),

    jiuXing: safeGet(() => lunar.getDayNineStar().toString(), ''),

    wuHou: safeGet(() => `${lunar.getWuHou()} ${lunar.getHou()}`, ''),
  };
}

export function isBlackDay(zhiShen: string): boolean {
  const blackDays = ['天刑', '朱雀', '白虎', '天牢', '玄武', '勾陈'];
  return blackDays.some(b => zhiShen.includes(b));
}

export function getZhiShenDesc(zhiShen: string): string {
  if (isBlackDay(zhiShen)) {
    return `${zhiShen}(黑道日)`;
  }
  return `${zhiShen}(黄道日)`;
}