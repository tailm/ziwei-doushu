import type { BaziOutput, DayunOutput } from './types';
import { GAN_WUXING } from './data';

export function renderBaziText(chart: BaziOutput, options?: { name?: string; dayun?: DayunOutput; detailLevel?: 'default' | 'full' }): string {
  const detailLevel = options?.detailLevel ?? 'default';
  const dayun = options?.dayun;
  const lines: string[] = ['# 八字命盘', ''];

  if (detailLevel === 'full') {
    lines.push('## 基本信息');
  } else {
    lines.push('## 命局全盘');
  }

  if (options?.name) lines.push(`- 姓名: ${options.name}`);
  lines.push(`- 性别: ${chart.gender === 'male' ? '男' : '女'}`);
  lines.push(`- 日主: ${chart.dayMaster}`);

  if (detailLevel === 'full') {
    lines.push(`- 命主五行: ${chart.dayMaster}${GAN_WUXING[chart.dayMaster.charAt(0)] || ''}`);
  }

  if (chart.birthPlace) lines.push(`- 出生地: ${chart.birthPlace}`);
  if (chart.trueSolarTimeInfo) {
    lines.push(`- 钟表时间: ${chart.trueSolarTimeInfo.clockTime}`);
    lines.push(`- 真太阳时: ${chart.trueSolarTimeInfo.trueSolarTime}（经度 ${chart.trueSolarTimeInfo.longitude}°，校正 ${chart.trueSolarTimeInfo.correctionMinutes > 0 ? '+' : ''}${chart.trueSolarTimeInfo.correctionMinutes} 分钟）`);
  }
  if (detailLevel === 'full' && chart.kongWang?.kongZhi?.length) {
    lines.push(`- 空亡: ${chart.kongWang.kongZhi.join('')}`);
  }
  if (detailLevel === 'full' && chart.taiYuan) lines.push(`- 胎元: ${chart.taiYuan}`);
  if (detailLevel === 'full' && chart.mingGong) lines.push(`- 命宫: ${chart.mingGong}`);

  lines.push('');

  if (detailLevel === 'full') {
    lines.push('| 柱 | 干支 | 天干(十神) | 地支藏干(十神) | 地势 | 纳音 | 神煞 |');
    lines.push('|---|------|------------|----------------|------|------|------|');
  } else {
    lines.push('| 柱 | 干支 | 天干(十神) | 地支藏干(十神) | 地势 | 空亡 |');
    lines.push('|---|------|------------|----------------|------|------|');
  }

  for (const [label, pillar] of [
    ['年柱', chart.fourPillars.year],
    ['月柱', chart.fourPillars.month],
    ['日柱', chart.fourPillars.day],
    ['时柱', chart.fourPillars.hour],
  ] as const) {
    const hiddenStemsText = pillar.hiddenStems.length > 0
      ? pillar.hiddenStems.map((item) => `${item.stem}(${item.tenGod || '-'})`).join(' ')
      : '-';
    const stemText = label === '日柱'
      ? `${pillar.stem}(日主)`
      : `${pillar.stem}(${pillar.tenGod || '-'})`;

    if (detailLevel === 'full') {
      const shenShaText = pillar.shenSha?.length ? pillar.shenSha.join('、') : '-';
      lines.push(`| ${label} | ${pillar.stem}${pillar.branch} | ${stemText} | ${hiddenStemsText} | ${pillar.diShi || '-'} | ${pillar.naYin || '-'} | ${shenShaText} |`);
    } else {
      lines.push(`| ${label} | ${pillar.stem}${pillar.branch} | ${stemText} | ${hiddenStemsText} | ${pillar.diShi || '-'} | ${pillar.kongWang?.isKong ? '空' : '-'} |`);
    }
  }

  lines.push('');

  const stemRelationParts: string[] = [];
  for (const item of chart.tianGanWuHe) stemRelationParts.push(`${item.stemA}${item.stemB}合${item.resultElement}`);
  for (const item of chart.tianGanChongKe) stemRelationParts.push(`${item.stemA}${item.stemB}冲克`);

  const branchRelationParts: string[] = [];
  const posBranchMap: Record<string, string> = {
    '年支': chart.fourPillars.year.branch,
    '月支': chart.fourPillars.month.branch,
    '日支': chart.fourPillars.day.branch,
    '时支': chart.fourPillars.hour.branch,
  };
  for (const relation of chart.relations) {
    if (relation.type === '刑') {
      const branches = [...new Set(relation.pillars.map((pillar) => posBranchMap[pillar]))].join('');
      branchRelationParts.push(`${branches}刑（${relation.description}）`);
    } else {
      branchRelationParts.push(relation.description);
    }
  }
  for (const item of chart.diZhiBanHe) branchRelationParts.push(`${item.branches.join('')}半合${item.resultElement}`);
  for (const item of chart.diZhiSanHui) branchRelationParts.push(`${item.branches.join('')}三会${item.resultElement}`);

  if (stemRelationParts.length > 0 || branchRelationParts.length > 0) {
    lines.push('## 干支关系');
    if (stemRelationParts.length > 0) lines.push(`- 天干: ${stemRelationParts.join('；')}`);
    if (branchRelationParts.length > 0) lines.push(`- 地支: ${branchRelationParts.join('；')}`);
  }

  if (dayun) {
    lines.push('');
    lines.push('## 大运轨迹');
    lines.push(`- 起运: ${dayun.startAge}岁（${dayun.startAgeDetail}）`);
    lines.push('');
    if (detailLevel === 'full') {
      lines.push('| 起运年份 | 年龄 | 大运干支 | 天干(十神) | 地支藏干(十神) | 地势 | 纳音 | 神煞 |');
      lines.push('|----------|------|----------|------------|----------------|------|------|------|');
    } else {
      lines.push('| 起运年份 | 年龄 | 大运干支 | 天干(十神) | 地支藏干(十神) |');
      lines.push('|----------|------|----------|------------|----------------|');
    }
    for (const item of dayun.list) {
      const hiddenStemsText = item.hiddenStems?.length
        ? item.hiddenStems.map((hs: { stem: string; tenGod: string }) => `${hs.stem}(${hs.tenGod})`).join(' ')
        : '-';
      if (detailLevel === 'full') {
        const shenShaText = item.shenSha?.length ? item.shenSha.join('、') : '-';
        lines.push(`| ${item.startYear} | ${item.startAge}岁 | ${item.ganZhi} | ${item.stem}(${item.tenGod || '-'}) | ${hiddenStemsText} | ${item.diShi || '-'} | ${item.naYin || '-'} | ${shenShaText} |`);
      } else {
        lines.push(`| ${item.startYear} | ${item.startAge}岁 | ${item.ganZhi} | ${item.stem}(${item.tenGod || '-'}) | ${hiddenStemsText} |`);
      }
    }
  }

  return lines.join('\n');
}