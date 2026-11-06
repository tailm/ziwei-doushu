'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type TargetItem = {
  key: string;
  zh: string;
  en: string;
  img?: string;
  desc?: { zh: string; en: string };
};

type CustomTargetGridProps = {
  storageKey: string;
  defaultItems: TargetItem[];
  selectedKey?: string;
  onSelect?: (key: string) => void;
  selectedKeys?: string[];
  onMultiSelect?: (keys: string[]) => void;
  label: string;
  c: Record<string, string>;
  lang: 'zh' | 'en';
  columns?: 2 | 3;
  showImage?: boolean;
  showDesc?: boolean;
  layout?: 'grid' | 'wrap';
  multiSelect?: boolean;

};

function loadItems(storageKey: string, defaultItems: TargetItem[]): TargetItem[] {
  if (typeof window === 'undefined') return defaultItems;
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved) return JSON.parse(saved) as TargetItem[];
  } catch { /* ignore */ }
  return defaultItems;
}

function saveItems(storageKey: string, items: TargetItem[]) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(items));
  } catch { /* ignore */ }
}

function EditItemModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  item,
  c,
  lang,
  showImage,
  showDesc,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: TargetItem) => void;
  onDelete?: (key: string) => void;
  item: TargetItem | null;
  c: Record<string, string>;
  lang: 'zh' | 'en';
  showImage?: boolean;
  showDesc?: boolean;
}) {
  const [name, setName] = useState('');
  const [img, setImg] = useState('');
  const [descZh, setDescZh] = useState('');
  const [descEn, setDescEn] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (item) {
      setName(lang === 'zh' ? item.zh : item.en);
      setImg(item.img ?? '');
      setDescZh(item.desc?.zh ?? '');
      setDescEn(item.desc?.en ?? '');
    } else {
      setName('');
      setImg('');
      setDescZh('');
      setDescEn('');
    }
  }, [item?.key, lang]);

  const handleFile = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      alert(lang === 'zh' ? '图片大小不能超过5MB' : 'Image size must be under 5MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = e => setImg(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!name.trim()) {
      alert(lang === 'zh' ? '请输入名称' : 'Please enter a name');
      return;
    }
    if (showImage && !img) {
      alert(lang === 'zh' ? '请上传图片' : 'Please upload an image');
      return;
    }
    const key = item?.key ?? `custom_${Date.now()}`;
    onSave({
      key,
      zh: name.trim(),
      en: name.trim(),
      img: showImage ? img : undefined,
      desc: showDesc ? { zh: descZh.trim(), en: descEn.trim() || descZh.trim() } : undefined,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.6)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        style={{
          background: c.bg,
          border: `1px solid ${c.border}`,
          borderRadius: 16,
          padding: 24,
          maxWidth: 360,
          width: '100%',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        }}
      >
        <h3 className="text-lg font-medium mb-4" style={{ color: c.goldSolid }}>
          {item
            ? (lang === 'zh' ? '编辑' : 'Edit')
            : (lang === 'zh' ? '添加' : 'Add')}
        </h3>

        <div className="space-y-4">
          <div>
            <label className="text-sm mb-1 block" style={{ color: c.textMuted }}>
              {lang === 'zh' ? '名称' : 'Name'}
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder={lang === 'zh' ? '输入名称' : 'Enter name'}
              className="w-full px-3 py-2 rounded-lg text-sm"
              style={{ background: c.cardBg, border: `1px solid ${c.border}`, color: c.text, outline: 'none' }}
            />
          </div>

          {showDesc && (
            <div>
              <label className="text-sm mb-1 block" style={{ color: c.textMuted }}>
                {lang === 'zh' ? '描述' : 'Description'}
              </label>
              <input
                type="text"
                value={descZh}
                onChange={e => setDescZh(e.target.value)}
                placeholder={lang === 'zh' ? '输入描述' : 'Enter description'}
                className="w-full px-3 py-2 rounded-lg text-sm"
                style={{ background: c.cardBg, border: `1px solid ${c.border}`, color: c.text, outline: 'none' }}
              />
            </div>
          )}

          {showImage && (
            <div>
              <label className="text-sm mb-1 block" style={{ color: c.textMuted }}>
                {lang === 'zh' ? '图片' : 'Image'}
              </label>
              <div
                onClick={() => fileRef.current?.click()}
                onDragOver={e => { e.preventDefault(); }}
                onDrop={e => {
                  e.preventDefault();
                  const file = e.dataTransfer.files[0];
                  if (file && file.type.startsWith('image/')) handleFile(file);
                }}
                className="rounded-lg cursor-pointer flex items-center justify-center"
                style={{
                  background: c.cardBg,
                  border: `1px dashed ${c.border}`,
                  aspectRatio: '9 / 16',
                  overflow: 'hidden',
                }}
              >
                {img ? (
                  <img src={img} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div className="text-center py-8">
                    <div style={{ color: c.textFaint, fontSize: 24 }}>+</div>
                    <p className="text-xs mt-1" style={{ color: c.textFaint }}>
                      {lang === 'zh' ? '点击或拖拽上传图片' : 'Click or drag to upload'}
                    </p>
                  </div>
                )}
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) handleFile(file);
                }}
              />
            </div>
          )}

          <div className="flex gap-2 justify-end">
            {item && onDelete && (
              <button
                onClick={() => { onDelete(item.key); onClose(); }}
                className="px-4 py-2 rounded-lg text-sm"
                style={{ background: 'rgba(220,53,53,0.1)', border: '1px solid rgba(220,53,53,0.3)', color: '#dc3535' }}
              >
                {lang === 'zh' ? '删除' : 'Delete'}
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm"
              style={{ background: c.cardBg, border: `1px solid ${c.border}`, color: c.textMuted }}
            >
              {lang === 'zh' ? '取消' : 'Cancel'}
            </button>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleSave}
              className="px-4 py-2 rounded-lg text-sm font-medium"
              style={{ background: c.goldSolid, color: '#1a1a2e' }}
            >
              {lang === 'zh' ? '保存' : 'Save'}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function CustomTargetGrid({
  storageKey,
  defaultItems,
  selectedKey = '',
  onSelect,
  selectedKeys = [],
  onMultiSelect,
  label,
  c,
  lang,
  columns = 3,
  showImage = false,
  showDesc = false,
  layout = 'grid',
  multiSelect = false,

}: CustomTargetGridProps) {
  const [items, setItems] = useState<TargetItem[]>(defaultItems);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TargetItem | null>(null);

  useEffect(() => {
    setItems(loadItems(storageKey, defaultItems));
  }, [storageKey, defaultItems]);

  const persist = (newItems: TargetItem[]) => {
    setItems(newItems);
    saveItems(storageKey, newItems);
  };

  const handleSave = (item: TargetItem) => {
    const idx = items.findIndex(t => t.key === item.key);
    if (idx >= 0) {
      const newItems = [...items];
      newItems[idx] = item;
      persist(newItems);
    } else {
      persist([...items, item]);
    }
    setEditingItem(null);
  };

  const handleDelete = (key: string) => {
    persist(items.filter(t => t.key !== key));
    setEditingItem(null);
    if (multiSelect && onMultiSelect) {
      onMultiSelect(selectedKeys.filter(k => k !== key));
    } else if (selectedKey === key && onSelect) {
      onSelect('');
    }
  };

  const handleMove = (idx: number, dir: -1 | 1) => {
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= items.length) return;
    const newItems = [...items];
    [newItems[idx], newItems[newIdx]] = [newItems[newIdx], newItems[idx]];
    persist(newItems);
  };

  const gridClass = columns === 2 ? 'grid-cols-2' : layout === 'wrap' ? '' : 'grid-cols-3';

  return (
    <div>
      <label className="text-sm mb-2 block" style={{ color: c.textMuted }}>
        {label}
      </label>
      <div className={layout === 'grid' ? `grid ${gridClass} gap-2` : 'flex flex-wrap gap-2'}>
        {items.map((t, idx) => (
          <div key={t.key} className="relative group" style={layout === 'wrap' ? {} : {}}>
            <button
              onClick={() => {
                if (multiSelect && onMultiSelect) {
                  onMultiSelect(selectedKeys.includes(t.key)
                    ? selectedKeys.filter(k => k !== t.key)
                    : [...selectedKeys, t.key]);
                } else if (onSelect) {
                  onSelect(t.key);
                }
              }}
              className="w-full p-3 rounded-lg text-sm transition-all text-center"
              style={{
                background: multiSelect
                  ? (selectedKeys.includes(t.key) ? c.goldSolid : c.cardBg)
                  : (selectedKey === t.key ? c.goldSolid : c.cardBg),
                color: multiSelect
                  ? (selectedKeys.includes(t.key) ? '#1a1a2e' : c.text)
                  : (selectedKey === t.key ? '#1a1a2e' : c.text),
                border: `1px solid ${
                  multiSelect
                    ? (selectedKeys.includes(t.key) ? c.goldSolid : c.border)
                    : (selectedKey === t.key ? c.goldSolid : c.border)
                }`,
              }}
            >
              {showImage && t.img && (
                <div
                  className="mx-auto mb-2"
                  style={{
                    width: 54,
                    height: 96,
                    borderRadius: 6,
                    overflow: 'hidden',
                    border: `1px solid ${selectedKey === t.key ? '#1a1a2e' : c.border}`,
                  }}
                >
                  <img src={t.img} alt={t.zh} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
              <div className="font-medium">{lang === 'zh' ? t.zh : t.en}</div>
              {showDesc && t.desc && (
                <div className="text-xs mt-1 opacity-70">{lang === 'zh' ? t.desc.zh : t.desc.en}</div>
              )}
            </button>

            <div
              className="absolute top-1 right-1 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ zIndex: 10 }}
            >
              <button
                onClick={() => handleMove(idx, -1)}
                disabled={idx === 0}
                className="w-5 h-5 rounded-full flex items-center justify-center"
                style={{
                  background: c.cardBg,
                  border: `1px solid ${c.border}`,
                  opacity: idx === 0 ? 0.3 : 1,
                }}
                title={lang === 'zh' ? '前移' : 'Move up'}
              >
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                  <path d="M4 1L1 5H7L4 1Z" fill={c.goldSolid} />
                </svg>
              </button>
              <button
                onClick={() => handleMove(idx, 1)}
                disabled={idx === items.length - 1}
                className="w-5 h-5 rounded-full flex items-center justify-center"
                style={{
                  background: c.cardBg,
                  border: `1px solid ${c.border}`,
                  opacity: idx === items.length - 1 ? 0.3 : 1,
                }}
                title={lang === 'zh' ? '后移' : 'Move down'}
              >
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                  <path d="M4 7L1 3H7L4 7Z" fill={c.goldSolid} />
                </svg>
              </button>
              <button
                onClick={() => { setEditingItem(t); setModalOpen(true); }}
                className="w-5 h-5 rounded-full flex items-center justify-center"
                style={{ background: c.cardBg, border: `1px solid ${c.border}` }}
                title={lang === 'zh' ? '编辑' : 'Edit'}
              >
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                  <path d="M2 8.5L8.5 2L10 3.5L3.5 10L2 10V8.5Z" stroke={c.goldSolid} strokeWidth="1.2" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                onClick={() => handleDelete(t.key)}
                className="w-5 h-5 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(220,53,53,0.1)', border: '1px solid rgba(220,53,53,0.3)' }}
                title={lang === 'zh' ? '删除' : 'Delete'}
              >
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                  <path d="M1 1L7 7M7 1L1 7" stroke="#dc3535" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>
        ))}
        <button
          onClick={() => { setEditingItem(null); setModalOpen(true); }}
          className="p-3 rounded-lg text-sm transition-all text-center"
          style={{
            background: 'transparent',
            color: c.goldSolid,
            border: `1px dashed ${c.goldSolid}`,
          }}
        >
          + {lang === 'zh' ? '自定义' : 'Custom'}
        </button>
      </div>

      <AnimatePresence>
        {modalOpen && (
          <EditItemModal
            key={editingItem?.key ?? 'new'}
            isOpen={modalOpen}
            onClose={() => { setModalOpen(false); setEditingItem(null); }}
            onSave={handleSave}
            onDelete={handleDelete}
            item={editingItem}
            c={c}
            lang={lang}
            showImage={showImage}
            showDesc={showDesc}
          />
        )}
      </AnimatePresence>
    </div>
  );
}