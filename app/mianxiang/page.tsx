'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '@/lib/i18n/LanguageContext';
import { useTheme } from '@/components/ThemeProvider';
import NavigationBar from '@/components/NavigationBar';
import SiteFooter from '@/components/SiteFooter';
import { useAuth } from '@/lib/auth/AuthContext';
import { FEATURE_CATEGORIES as FACE_CATEGORIES, interpretFace } from '@/lib/mianxiang/data';
import type { FaceFeatures, FeatureDetail, FortuneLevel } from '@/lib/mianxiang/types';
import dynamic from 'next/dynamic';

const FaceDiagram = dynamic(() => import('@/components/DivinationDecorations').then(m => m.FaceDiagram), { ssr: false });
import { QuestionSelector, buildPersonalContext, type QuestionTopic } from '@/components/PersonalParams';
import InsufficientCredits from '@/components/InsufficientCredits';

const MAX_IMAGE_SIZE = 4 * 1024 * 1024;

const FORTUNE_LEVEL_COLOR: Record<FortuneLevel, string> = {
  '大吉': '#22c55e',
  '吉': '#4ade80',
  '中吉': '#d4a843',
  '平': '#9ca3af',
  '小凶': '#f87171',
  '凶': '#ef4444',
};

export default function MianxiangPage() {
  const { lang } = useLang();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { user } = useAuth();
  const [mode, setMode] = useState<'image' | 'text'>('text');
  const [questionTopic, setQuestionTopic] = useState<QuestionTopic>('');
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [features, setFeatures] = useState<Partial<FaceFeatures>>({});
  const [textResult, setTextResult] = useState<{
    details: Record<keyof FaceFeatures, FeatureDetail>;
    overallFortune: FortuneLevel;
    interpretation: string;
    advice: string[];
  } | null>(null);

  const c = {
    bgBase: isDark ? '#020810' : '#f5efe0',
    goldSolid: isDark ? '#d4a843' : '#8b6410',
    goldLine: isDark ? 'rgba(212,168,67,0.4)' : 'rgba(140,100,20,0.4)',
    textPrimary: isDark ? '#e8eef6' : '#1a1d24',
    textSecond: isDark ? '#b8c6df' : '#3a3f4a',
    textMuted: isDark ? '#9db0d0' : '#5a6275',
    textFaint: isDark ? 'rgba(240,246,255,0.56)' : '#9da4b3',
    cardBg: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.88)',
    cardBorder: isDark ? 'rgba(255,255,255,0.10)' : 'rgba(200,160,60,0.25)',
    dropBg: isDark ? 'rgba(212,168,67,0.08)' : 'rgba(140,100,20,0.06)',
    featureBg: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.75)',
    featureBord: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(200,160,60,0.2)',
    tabActive: isDark ? 'rgba(212,168,67,0.15)' : 'rgba(140,100,20,0.12)',
  };

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      setError(lang === 'zh' ? '请上传图片文件' : 'Please upload an image file');
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setError(lang === 'zh' ? '图片大小不能超过4MB' : 'Image size must not exceed 4MB');
      return;
    }
    setError('');
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      compressImage(result, 1024).then(setImage);
    };
    reader.readAsDataURL(file);
  }, [lang]);

  const compressImage = (dataUrl: string, maxSize: number): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        if (width > maxSize || height > maxSize) {
          if (width > height) {
            height = Math.round(height * maxSize / width);
            width = maxSize;
          } else {
            width = Math.round(width * maxSize / height);
            height = maxSize;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.85));
        } else {
          resolve(dataUrl);
        }
      };
      img.onerror = () => resolve(dataUrl);
      img.src = dataUrl;
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setAnalyzing(true);
    setError('');
    setResult('');

    abortRef.current = new AbortController();

    try {
      const res = await fetch('/api/mianxiang-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image, lang, personalContext: buildPersonalContext(user, questionTopic, lang) }),
        signal: abortRef.current.signal,
      });

      if (res.status === 401) {
        setError(lang === 'zh' ? '请先登录后使用面相分析' : 'Please login to use face analysis');
        setAnalyzing(false);
        return;
      }
      if (res.status === 402) {
        const data = await res.json();
        setError(data.message);
        setAnalyzing(false);
        return;
      }
      if (!res.ok) {
        setError(lang === 'zh' ? '面相分析服务暂时不可用' : 'Face analysis service temporarily unavailable');
        setAnalyzing(false);
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) {
        setError('Stream error');
        setAnalyzing(false);
        return;
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6).trim();
          if (data === '[DONE]') continue;
          try {
            const parsed = JSON.parse(data);
            const delta = parsed.delta?.text ?? '';
            if (delta) {
              setResult(prev => prev + delta);
            }
          } catch {
          }
        }
      }

      setAnalyzing(false);
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') {
        setAnalyzing(false);
        return;
      }
      setError(e instanceof Error ? e.message : 'Unknown error');
      setAnalyzing(false);
    }
  };

  const handleStop = () => {
    abortRef.current?.abort();
    setAnalyzing(false);
  };

  const handleReset = () => {
    setImage(null);
    setResult('');
    setError('');
  };

  const handleTextSubmit = () => {
    const requiredKeys: (keyof FaceFeatures)[] = ['faceShape', 'forehead', 'eyebrow', 'eye', 'nose', 'mouth', 'chin', 'ear'];
    const missing = requiredKeys.filter(k => !features[k]);
    if (missing.length > 0) {
      setError(lang === 'zh' ? `请完成所有特征选择（还剩${missing.length}项）` : `Please complete all features (${missing.length} remaining)`);
      return;
    }
    setError('');
    const fullFeatures = features as FaceFeatures;
    const res = interpretFace(fullFeatures);
    setTextResult(res);
  };

  const handleTextReset = () => {
    setFeatures({});
    setTextResult(null);
    setError('');
  };

  return (
    <div style={{ background: c.bgBase, minHeight: '100vh' }}>
      <NavigationBar />
      <div className="max-w-3xl mx-auto px-6 pt-20 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* 标题 */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="text-xs px-3 py-1 rounded-full" style={{ border: `1px solid ${c.goldLine}`, color: c.goldSolid }}>
                {lang === 'zh' ? '面相分析' : 'Face Reading'}
              </span>
    </div>
            <h1 className="text-2xl font-bold mb-3" style={{ color: c.goldSolid }}>
              {lang === 'zh' ? 'AI面相解读' : 'AI Face Reading'}
            </h1>
            <p className="text-sm" style={{ color: c.textMuted }}>
              {lang === 'zh'
                ? '上传面部照片或选择面部特征，AI将根据传统面相学进行专业分析'
                : 'Upload a facial photo or select facial features for professional AI face reading analysis'}
            </p>
    </div>

          {/* 个性化参数：求什么 */}
          <QuestionSelector
            value={questionTopic}
            onChange={setQuestionTopic}
            goldSolid={c.goldSolid}
            goldLine={c.goldLine}
            cardBg={c.cardBg}
            cardBorder={c.cardBorder}
            textMuted={c.textMuted}
            textFaint={c.textFaint}
          />

          {/* 未填写个人信息时提示 */}
          {user && !user.gender && !user.birth_date && !user.current_city && (
            <div className="text-[11px] mb-4 text-center" style={{ color: c.textFaint }}>
              <a href="/profile" style={{ color: c.goldSolid, textDecoration: 'underline' }}>
                {lang === 'zh' ? '点击填写个人信息，获取更精准的解读' : 'Click to fill in personal info for better insights'}
              </a>
    </div>
          )}

          {/* 模式切换 */}
          <div className="flex justify-center gap-3 mb-8">
            <button
              onClick={() => { setMode('text'); setError(''); }}
              className="text-xs px-5 py-2 rounded-full transition-all duration-300 font-medium"
              style={{
                border: `1px solid ${mode === 'text' ? c.goldSolid : c.cardBorder}`,
                background: mode === 'text' ? c.tabActive : 'transparent',
                color: mode === 'text' ? c.goldSolid : c.textMuted,
              }}
            >
              {lang === 'zh' ? '文字测验' : 'Text Quiz'}
            </button>
            <button
              onClick={() => { setMode('image'); setError(''); }}
              className="text-xs px-5 py-2 rounded-full transition-all duration-300 font-medium"
              style={{
                border: `1px solid ${mode === 'image' ? c.goldSolid : c.cardBorder}`,
                background: mode === 'image' ? c.tabActive : 'transparent',
                color: mode === 'image' ? c.goldSolid : c.textMuted,
              }}
            >
              {lang === 'zh' ? '图片分析' : 'Image Analysis'}
            </button>
    </div>

          {/* ═══════ 文字测验模式 ═══════ */}
          {mode === 'text' && (
            <AnimatePresence mode="wait">
              <motion.div
                key="text-mode"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                {!textResult && (
                  <>
                    {/* 面部SVG示意图 + 特征选择表单 */}
                    <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-4 mb-6">
                      {/* 面部示意图 */}
                      <div className="rounded-xl p-4 flex flex-col items-center justify-start"
                        style={{ background: c.featureBg, border: `1px solid ${c.featureBord}` }}>
                        <div className="text-[10px] mb-2" style={{ color: c.goldSolid }}>
                          {lang === 'zh' ? '面部示意图' : 'Face Diagram'}
    </div>
                        <FaceDiagram
                          color={c.goldSolid}
                          size={140}
                          highlightParts={Object.keys(features).filter(k => features[k as keyof FaceFeatures]) as string[]}
                        />
    </div>

                      {/* 特征选择表单 */}
                      <div className="space-y-3">
                        {FACE_CATEGORIES.map(cat => (
                          <div key={cat.key} className="rounded-xl p-3" style={{ background: c.featureBg, border: `1px solid ${c.featureBord}` }}>
                            <label className="text-xs tracking-wider mb-2 block" style={{ color: c.goldSolid }}>
                              {lang === 'zh' ? cat.label : cat.labelEn}
                            </label>
                            <div className="flex flex-wrap gap-2">
                              {cat.options.map(opt => {
                                const isSelected = features[cat.key] === opt.value;
                                return (
                                  <button
                                    key={opt.value}
                                    onClick={() => setFeatures(prev => ({ ...prev, [cat.key]: opt.value }))}
                                    className="text-xs px-3 py-1.5 rounded-lg transition-all duration-200"
                                    style={{
                                      border: isSelected ? `1px solid ${c.goldSolid}` : `1px solid ${c.cardBorder}`,
                                      background: isSelected ? c.tabActive : 'transparent',
                                      color: isSelected ? c.goldSolid : c.textMuted,
                                    }}
                                  >
                                    {lang === 'zh' ? opt.label : opt.labelEn}
                                  </button>
                                );
                              })}
    </div>
    </div>
                        ))}
    </div>
    </div>


                    {/* 错误提示 */}
                    {error && (
                      <div className="mb-6">
                        <InsufficientCredits message={error} goldSolid={c.goldSolid} />
    </div>
                    )}

                    {/* 提交按钮 */}
                    <div className="text-center mb-8">
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={handleTextSubmit}
                        className="px-12 py-3 font-medium text-sm tracking-widest rounded-full"
                        style={{ border: `1px solid ${c.goldLine}`, color: c.goldSolid, background: 'transparent' }}
                      >
                        {lang === 'zh' ? '开始面相测验' : 'Start Face Quiz'}
                      </motion.button>
    </div>
                  </>
                )}

                {/* 文字测验结果 */}
                {textResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    {/* 总体评级 */}
                    <div className="rounded-2xl p-6 text-center" style={{ background: c.cardBg, border: `1px solid ${FORTUNE_LEVEL_COLOR[textResult.overallFortune]}40` }}>
                      <div className="text-xs tracking-wider mb-2" style={{ color: c.textMuted }}>
                        {lang === 'zh' ? '总体面相运势' : 'Overall Face Fortune'}
    </div>
                      <div className="text-3xl font-bold mb-2" style={{ color: FORTUNE_LEVEL_COLOR[textResult.overallFortune], fontFamily: 'serif' }}>
                        {textResult.overallFortune}
    </div>
                      <p className="text-sm leading-relaxed" style={{ color: c.textSecond }}>
                        {textResult.interpretation}
                      </p>
    </div>

                    {/* 各维度详情 */}
                    <div className="space-y-2">
                      {(['faceShape', 'forehead', 'eyebrow', 'eye', 'nose', 'mouth', 'chin', 'ear'] as (keyof FaceFeatures)[]).map(key => {
                        const d = textResult.details[key];
                        const cat = FACE_CATEGORIES.find(c => c.key === key);
                        return (
                          <div key={key} className="rounded-xl p-4" style={{ background: c.featureBg, border: `1px solid ${FORTUNE_LEVEL_COLOR[d.fortuneLevel]}30` }}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-medium" style={{ color: c.goldSolid }}>
                                {lang === 'zh' ? cat?.label : cat?.labelEn}
                              </span>
                              <span className="text-xs px-2 py-0.5 rounded" style={{ background: `${FORTUNE_LEVEL_COLOR[d.fortuneLevel]}20`, color: FORTUNE_LEVEL_COLOR[d.fortuneLevel] }}>
                                {d.fortuneLevel}
                              </span>
    </div>
                            <div className="text-xs mb-1" style={{ color: c.textMuted }}>
                              {lang === 'zh' ? d.label : d.labelEn}
    </div>
                            <p className="text-sm leading-relaxed" style={{ color: c.textSecond }}>
                              {lang === 'zh' ? d.description : d.descriptionEn}
                            </p>
    </div>
                        );
                      })}
    </div>

                    {/* 行事建议 */}
                    <div className="rounded-2xl p-5" style={{ background: c.cardBg, border: `1px solid ${c.goldLine}` }}>
                      <div className="text-xs tracking-wider mb-3" style={{ color: c.goldSolid }}>
                        {lang === 'zh' ? '行事建议' : 'Advice'}
    </div>
                      <ul className="space-y-2">
                        {textResult.advice.map((a, i) => (
                          <li key={i} className="text-sm flex items-start gap-2" style={{ color: c.textSecond }}>
                            <span style={{ color: c.goldSolid }}>·</span>
                            <span>{a}</span>
                          </li>
                        ))}
                      </ul>
    </div>

                    {/* 重新测验按钮 */}
                    <div className="text-center">
                      <button
                        onClick={handleTextReset}
                        className="text-xs px-5 py-2 rounded-full"
                        style={{ border: `1px solid ${c.cardBorder}`, color: c.textMuted }}
                      >
                        {lang === 'zh' ? '重新测验' : 'Re-quiz'}
                      </button>
    </div>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          )}

          {/* ═══════ 图片分析模式 ═══════ */}
          {mode === 'image' && (
            <AnimatePresence mode="wait">
              <motion.div
                key="image-mode"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* 隐私提示 */}
                <div className="rounded-xl p-3 mb-6 text-center" style={{ background: c.dropBg, border: `1px solid ${c.goldLine}` }}>
                  <p className="text-xs" style={{ color: c.textMuted }}>
                    {lang === 'zh'
                      ? '图片仅用于AI分析，不会保存或存储，分析完成后即丢弃'
                      : 'Images are used only for AI analysis, never stored. Discarded after analysis.'}
                  </p>
    </div>

                {/* 图片上传区域 */}
                {!image && (
                  <div
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className="rounded-2xl p-12 text-center cursor-pointer transition-all duration-300"
                    style={{
                      background: dragOver ? c.dropBg : c.cardBg,
                      border: `2px dashed ${dragOver ? c.goldSolid : c.cardBorder}`,
                    }}
                  >
                    <div className="mb-4 flex justify-center">
                      <svg width="48" height="48" viewBox="0 0 48 48" style={{ opacity: 0.7 }}>
                        <rect x="6" y="10" width="36" height="32" rx="4" fill="none" stroke={c.goldSolid} strokeWidth="1.5" />
                        <circle cx="18" cy="22" r="3" fill={c.goldSolid} opacity="0.4" />
                        <path d="M6 34 L16 24 L24 32 L34 22 L42 30" fill="none" stroke={c.goldSolid} strokeWidth="1" opacity="0.4" />
                      </svg>
    </div>
                    <p className="text-sm font-medium mb-2" style={{ color: c.goldSolid }}>
                      {lang === 'zh' ? '点击或拖拽上传面部照片' : 'Click or drag to upload a facial photo'}
                    </p>
                    <p className="text-xs" style={{ color: c.textFaint }}>
                      {lang === 'zh' ? '支持 JPG、PNG，最大 4MB' : 'Supports JPG, PNG, max 4MB'}
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFile(file);
                      }}
                    />
    </div>
                )}

                {/* 图片预览 */}
                {image && (
                  <div className="space-y-4 mb-6">
                    <div className="relative rounded-2xl overflow-hidden" style={{ border: `1px solid ${c.cardBorder}` }}>
                      <img src={image} alt="Face preview" className="w-full max-h-96 object-contain" style={{ background: c.cardBg }} />
                      {!analyzing && !result && (
                        <button
                          onClick={handleReset}
                          className="absolute top-3 right-3 px-3 py-1.5 rounded-full text-xs font-medium"
                          style={{ background: 'rgba(0,0,0,0.6)', color: '#fff' }}
                        >
                          {lang === 'zh' ? '重新上传' : 'Re-upload'}
                        </button>
                      )}
    </div>
    </div>
                )}

                {/* 错误提示 */}
                {error && (
                  <div className="mb-6">
                    <InsufficientCredits message={error} goldSolid={c.goldSolid} />
    </div>
                )}

                {/* 分析按钮 */}
                {image && !result && (
                  <div className="text-center mb-8">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={analyzing ? handleStop : handleAnalyze}
                      disabled={analyzing}
                      className="px-12 py-3 font-medium text-sm tracking-widest rounded-full"
                      style={{
                        border: `1px solid ${c.goldLine}`,
                        color: c.goldSolid,
                        background: analyzing ? c.dropBg : 'transparent',
                        opacity: analyzing ? 0.6 : 1,
                      }}
                    >
                      {analyzing
                        ? (lang === 'zh' ? '分析中…' : 'Analyzing…')
                        : (lang === 'zh' ? '开始面相分析' : 'Start Face Analysis')}
                    </motion.button>
                    {analyzing && (
                      <button
                        onClick={handleStop}
                        className="ml-4 px-4 py-2 text-xs rounded-full"
                        style={{ border: `1px solid ${c.cardBorder}`, color: c.textMuted }}
                      >
                        {lang === 'zh' ? '停止' : 'Stop'}
                      </button>
                    )}
    </div>
                )}

                {/* 分析结果 */}
                <AnimatePresence>
                  {result && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.4 }}
                      className="space-y-4"
                    >
                      <div className="rounded-2xl p-6" style={{ background: c.cardBg, border: `1px solid ${c.goldLine}` }}>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-sm font-semibold flex items-center gap-2" style={{ color: c.goldSolid }}>

                            {lang === 'zh' ? 'AI面相分析结果' : 'AI Face Analysis Result'}
                          </h3>
                          {!analyzing && (
                            <button
                              onClick={handleReset}
                              className="text-xs px-3 py-1 rounded-full"
                              style={{ border: `1px solid ${c.cardBorder}`, color: c.textMuted }}
                            >
                              {lang === 'zh' ? '重新分析' : 'Re-analyze'}
                            </button>
                          )}
    </div>

                        {analyzing && !result && (
                          <div className="flex items-center gap-2 py-4">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
                              className="text-lg" style={{ color: c.goldSolid }}
                            >
                              ◯
                            </motion.div>
                            <span className="text-sm" style={{ color: c.textMuted }}>
                              {lang === 'zh' ? 'AI正在分析面相中…' : 'AI is analyzing your face…'}
                            </span>
    </div>
                        )}

                        <div className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: c.textSecond }}>
                          {result}
                          {analyzing && (
                            <span className="inline-block w-2 h-4 ml-0.5 animate-pulse" style={{ background: c.goldSolid }} />
                          )}
    </div>
    </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </AnimatePresence>
          )}
        </motion.div>
    </div>
      <SiteFooter />
    </div>
  );
}