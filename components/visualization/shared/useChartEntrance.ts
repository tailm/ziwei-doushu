'use client';

import { useEffect, useRef, useState } from 'react';

export function useChartEntrance(delay = 0) {
  const ref = useRef<HTMLDivElement>(null);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delay > 0) {
            const timer = setTimeout(() => setEntered(true), delay);
            observer.disconnect();
            return () => clearTimeout(timer);
          }
          setEntered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return { ref, entered };
}

export const CHART_ENTRANCE_BASE = 'opacity-0 translate-y-3 transition-all duration-500 ease-out';
export const CHART_ENTRANCE_ACTIVE = 'opacity-100 translate-y-0';