declare module 'lunar-javascript' {
  class Lunar {
    static fromYmd(year: number, month: number, day: number): Lunar;
    static fromYmdHms(year: number, month: number, day: number, hour: number, minute: number, second: number):BaziLunar;
    getYear(): number;
    getMonth(): number;
    getDay(): number;
    getYearGan(): string;
    getYearZhi(): string;
    getMonthGan(): string;
    getMonthZhi(): string;
    getDayGan(): string;
    getDayZhi(): string;
    getSolar(): Solar;
    getEightChar(): EightChar;
    getJieQiTable(): Record<string, Solar>;
    getDayInGanZhi(): string;
    getMonthInGanZhiExact(): string;
    getDayJiShen(): string[];
    getDayXiongSha(): string[];
    getDayYi(): string[];
    getDayJi(): string[];
    getYearInChinese(): string;
    getMonthInChinese(): string;
    getDayInChinese(): string;
    getYearShengXiao(): string;
    getMonthShengXiao(): string;
    getDayShengXiao(): string;
    getPrevJieQi(): JieQi | null;
    getNextJieQi(): JieQi | null;
    getChongDesc(): string;
    getSha(): string;
    getDayXunKong(): string;
    getDayPositionTai(): string;
    getDayTianShen(): string;
    getDayPositionCaiDesc(): string;
    getDayPositionXiDesc(): string;
    getDayPositionFuDesc(): string;
    getDayPositionYangGuiDesc(): string;
    getXiu(): string;
    getGong(): string;
    getShou(): string;
    getXiuLuck(): string;
    getYueXiang(): string;
    getLiuYao(): string;
    getDayNineStar(): { toString(): string };
    getWuHou(): string;
    getHou(): string;
  }

  class Solar {
    static fromYmd(year: number, month: number, day: number): Solar;
    static fromYmdHms(year: number, month: number, day: number, hour: number, minute: number, second: number): Solar;
    getLunar(): Lunar;
    getYear(): number;
    getMonth(): number;
    getDay(): number;
    getHour(): number;
    getMinute(): number;
    toYmdHms(): string;
  }

  class LunarMonth {
    static fromYm(year: number, month: number): LunarMonth | null;
    getDayCount(): number;
  }

  class LunarYear {
    static fromYear(year: number): LunarYear;
    getLeapMonth(): number;
  }

  class EightChar {
    getYearGan(): string;
    getYearZhi(): string;
    getMonthGan(): string;
    getMonthZhi(): string;
    getDayGan(): string;
    getDayZhi(): string;
    getTimeGan(): string;
    getTimeZhi(): string;
    getYearNaYin(): string;
    getMonthNaYin(): string;
    getDayNaYin(): string;
    setSect(sect: number): void;
    getYun(gender: number, sect: number): Yun;
  }

  class Yun {
    getStartYear(): number;
    getStartMonth(): number;
    getStartDay(): number;
    getStartHour(): number;
    isForward(): boolean;
    getStartSolar(): Solar;
    getDaYun(): DaYun[];
  }

  class JieQi {
    getName(): string;
    getSolar(): Solar;
  }

  class DaYun {
    getGanZhi(): string;
    getStartYear(): number;
    getStartAge(): number;
  }
}
