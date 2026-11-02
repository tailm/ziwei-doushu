'use client';

import { useState, useMemo } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceDot,
    Legend,
} from 'recharts';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useLang } from '@/lib/i18n/LanguageContext';

export type FortuneDimension = 'overall' | 'career' | 'love' | 'wealth' | 'health' | 'social';

export interface FortuneTrendDataPoint {
    date: string;
    fullDate: string;
    dayOfMonth: number;
    scores: {
        overall: number;
        career: number;
        love: number;
        wealth: number;
        health: number;
        social: number;
    };
    isKeyDate?: boolean;
    keyDateType?: 'lucky' | 'warning' | 'turning' | 'peak' | 'valley';
    keyDateDesc?: string;
}

interface FortuneTrendChartProps {
    data: FortuneTrendDataPoint[];
    selectedDate?: string;
    onDateClick?: (date: string) => void;
    height?: number;
    showLegend?: boolean;
    multiDimension?: boolean;
    simplifiedMode?: boolean;
    defaultOverallOnly?: boolean;
    hideKeyDateLegend?: boolean;
    title?: React.ReactNode;
}

const DIMENSION_CONFIG_CN: Record<FortuneDimension, { label: string; color: string }> = {
    overall: { label: '综合', color: '#f59e0b' },
    career: { label: '事业', color: '#3b82f6' },
    love: { label: '感情', color: '#ec4899' },
    wealth: { label: '财运', color: '#22c55e' },
    health: { label: '健康', color: '#ef4444' },
    social: { label: '人际', color: '#8b5cf6' },
};

const DIMENSION_CONFIG_EN: Record<FortuneDimension, { label: string; color: string }> = {
    overall: { label: 'Overall', color: '#f59e0b' },
    career: { label: 'Career', color: '#3b82f6' },
    love: { label: 'Love', color: '#ec4899' },
    wealth: { label: 'Wealth', color: '#22c55e' },
    health: { label: 'Health', color: '#ef4444' },
    social: { label: 'Social', color: '#8b5cf6' },
};

const KEY_DATE_COLORS: Record<string, string> = {
    lucky: '#22c55e',
    warning: '#ef4444',
    turning: '#f59e0b',
    peak: '#3b82f6',
    valley: '#9ca3af',
};

type TrendChartPoint = {
    date: string;
    fullDate: string;
    dayOfMonth: number;
    overall: number;
    career: number;
    love: number;
    wealth: number;
    health: number;
    social: number;
    isKeyDate?: boolean;
    keyDateType?: FortuneTrendDataPoint['keyDateType'];
    keyDateDesc?: string;
};

type TooltipPayload = { dataKey: FortuneDimension; value: number };

function FortuneTrendTooltip({
    active,
    payload,
    label,
    chartData,
    isEn,
}: {
    active?: boolean;
    payload?: TooltipPayload[];
    label?: string;
    chartData: TrendChartPoint[];
    isEn: boolean;
}) {
    const dimConfig = isEn ? DIMENSION_CONFIG_EN : DIMENSION_CONFIG_CN;
    if (!active || !payload || payload.length === 0) return null;

    const dataPoint = chartData.find((d) => d.date === label);

    return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
            <div className="text-sm font-medium mb-2">{dataPoint?.fullDate}</div>
            {payload.map((entry) => (
                <div
                    key={entry.dataKey}
                    className="flex items-center gap-2 text-sm"
                >
                    <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: dimConfig[entry.dataKey].color }}
                    />
                    <span className="text-foreground-secondary">
                        {dimConfig[entry.dataKey].label}:
                    </span>
                    <span className="font-medium">{entry.value}</span>
                </div>
            ))}
            {dataPoint?.isKeyDate && (
                <div className="mt-2 pt-2 border-t border-border text-xs">
                    <span
                        className="px-2 py-0.5 rounded-full text-white"
                        style={{ backgroundColor: KEY_DATE_COLORS[dataPoint.keyDateType || 'lucky'] }}
                    >
                        {dataPoint.keyDateDesc}
                    </span>
                </div>
            )}
        </div>
    );
}

export function FortuneTrendChart({
    data,
    selectedDate,
    onDateClick,
    height = 250,
    showLegend = false,
    multiDimension = false,
    simplifiedMode = false,
    hideKeyDateLegend = false,
    defaultOverallOnly = false,
    title,
}: FortuneTrendChartProps) {
    const { lang } = useLang();
    const isEn = lang === 'en';
    const dimConfig = isEn ? DIMENSION_CONFIG_EN : DIMENSION_CONFIG_CN;
    const [activeDimensions, setActiveDimensions] = useState<FortuneDimension[]>(
        defaultOverallOnly ? ['overall'] : (multiDimension ? ['overall', 'career', 'wealth'] : ['overall'])
    );

    const chartData = useMemo<TrendChartPoint[]>(() => {
        return data.map((point) => ({
            date: point.date,
            fullDate: point.fullDate,
            dayOfMonth: point.dayOfMonth,
            overall: point.scores.overall,
            career: point.scores.career,
            love: point.scores.love,
            wealth: point.scores.wealth,
            health: point.scores.health,
            social: point.scores.social,
            isKeyDate: point.isKeyDate,
            keyDateType: point.keyDateType,
            keyDateDesc: point.keyDateDesc,
        }));
    }, [data]);

    const keyDatePoints = useMemo(() => {
        const points = chartData.filter((d) => d.isKeyDate);
        if (simplifiedMode) {
            return points.filter((d) => d.keyDateType === 'peak' || d.keyDateType === 'valley');
        }
        return points;
    }, [chartData, simplifiedMode]);

    const trend = useMemo(() => {
        if (chartData.length < 2) return 'neutral';
        const first = chartData[0].overall;
        const last = chartData[chartData.length - 1].overall;
        const diff = last - first;
        if (diff > 5) return 'up';
        if (diff < -5) return 'down';
        return 'neutral';
    }, [chartData]);

    const toggleDimension = (dim: FortuneDimension) => {
        setActiveDimensions((prev) => {
            if (prev.includes(dim)) {
                if (prev.length === 1) return prev;
                return prev.filter((d) => d !== dim);
            }
            return [...prev, dim];
        });
    };

    const selectedPoint = useMemo(() => {
        if (!selectedDate) return null;
        return chartData.find((point) => point.fullDate === selectedDate) || null;
    }, [chartData, selectedDate]);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-4">
                    {title && (
                        <div className="text-foreground font-bold">
                            {title}
                        </div>
                    )}

                    <div className="flex items-center gap-2">
                        <span className="text-sm text-foreground-secondary">
                            {isEn ? 'Trend:' : '趋势:'}
                        </span>
                        {trend === 'up' && (
                            <span className="flex items-center gap-1 text-green-500 text-sm">
                                <TrendingUp className="w-4 h-4" />
                                {isEn ? 'Rising' : '上升'}
                            </span>
                        )}
                        {trend === 'down' && (
                            <span className="flex items-center gap-1 text-red-500 text-sm">
                                <TrendingDown className="w-4 h-4" />
                                {isEn ? 'Declining' : '下降'}
                            </span>
                        )}
                        {trend === 'neutral' && (
                            <span className="flex items-center gap-1 text-foreground-secondary text-sm">
                                <Minus className="w-4 h-4" />
                                {isEn ? 'Stable' : '平稳'}
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                    {(Object.keys(dimConfig) as FortuneDimension[]).map((dim) => (
                        <button
                            key={dim}
                            onClick={() => toggleDimension(dim)}
                            className={`px-3 py-1 text-xs font-medium rounded-full transition-all duration-200 ${activeDimensions.includes(dim)
                                ? 'text-white shadow-md transform scale-105'
                                : 'bg-background-secondary/80 text-foreground-secondary hover:bg-background-tertiary hover:text-foreground'
                                }`}
                            style={{
                                backgroundColor: activeDimensions.includes(dim)
                                    ? dimConfig[dim].color
                                    : undefined,
                                boxShadow: activeDimensions.includes(dim)
                                    ? `0 2px 4px ${dimConfig[dim].color}40`
                                    : undefined
                            }}
                        >
                            {dimConfig[dim].label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-background-secondary/30 border border-border/50 rounded-2xl p-4">
                <ResponsiveContainer width="100%" height={height}>
                    <LineChart
                        data={chartData}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                        onClick={(e) => {
                            const payload = (e as { activePayload?: Array<{ payload?: { fullDate?: string } }> })?.activePayload?.[0]?.payload;
                            if (payload?.fullDate && onDateClick) {
                                onDateClick(payload.fullDate);
                            }
                        }}
                    >
                        <CartesianGrid
                            strokeDasharray="2 2"
                            stroke="var(--color-border)"
                            opacity={0.3}
                            vertical={false}
                        />
                        <XAxis
                            dataKey="date"
                            tick={{ fontSize: 10, fill: 'var(--color-foreground-secondary)' }}
                            tickLine={false}
                            axisLine={false}
                            dy={10}
                            minTickGap={15}
                        />
                        <YAxis
                            domain={[40, 100]}
                            tick={{ fontSize: 10, fill: 'var(--color-foreground-secondary)' }}
                            tickLine={false}
                            axisLine={false}
                            tickCount={4}
                        />
                        <Tooltip content={<FortuneTrendTooltip chartData={chartData} isEn={isEn} />} />
                        {showLegend && <Legend />}

                        {activeDimensions.map((dim) => (
                            <Line
                                key={dim}
                                type="monotone"
                                dataKey={dim}
                                stroke={dimConfig[dim].color}
                                strokeWidth={dim === 'overall' ? 3.5 : 2.5}
                                dot={chartData.length < 15 ? { r: 3, fill: dimConfig[dim].color, stroke: 'var(--color-background)', strokeWidth: 1.5 } : false}
                                activeDot={{
                                    r: 6,
                                    fill: dimConfig[dim].color,
                                    stroke: 'var(--color-background)',
                                    strokeWidth: 3,
                                }}
                            />
                        ))}

                        {keyDatePoints.map((point, idx) => {
                            const score = point.overall;
                            const dotColor = score >= 80 ? '#22c55e' : score >= 60 ? '#9ca3af' : '#ef4444';

                            return (
                                <ReferenceDot
                                    key={idx}
                                    x={point.date}
                                    y={point.overall}
                                    r={5}
                                    fill={dotColor}
                                    stroke="var(--color-background)"
                                    strokeWidth={2}
                                    style={{ filter: 'drop-shadow(0px 1px 2px rgba(0,0,0,0.1))' }}
                                />
                            );
                        })}
                        {selectedPoint && (
                            <ReferenceDot
                                x={selectedPoint.date}
                                y={selectedPoint.overall}
                                r={8}
                                fill={dimConfig.overall.color}
                                stroke="var(--color-background)"
                                strokeWidth={3}
                                style={{ filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.1))' }}
                            />
                        )}
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {!hideKeyDateLegend && keyDatePoints.length > 0 && (
                <div className="flex items-center gap-4 flex-wrap text-xs">
                    <span className="text-foreground-secondary">
                        {isEn ? 'Key dates:' : '关键日期:'}
                    </span>
                    {keyDatePoints.map((point, idx) => (
                        <div
                            key={idx}
                            className="flex items-center gap-1.5 text-xs text-foreground-secondary/90 bg-background-secondary/50 px-2 py-1 rounded-md"
                        >
                            <div
                                className="w-2.5 h-2.5 rounded-full ring-2 ring-white dark:ring-white/10"
                                style={{ backgroundColor: KEY_DATE_COLORS[point.keyDateType || 'lucky'] }}
                            />
                            <span>
                                {point.dayOfMonth}{isEn ? '' : '日'} - {point.keyDateDesc}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}