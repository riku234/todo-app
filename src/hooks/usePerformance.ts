import { useEffect, useRef, useCallback } from 'react';

interface PerformanceMetrics {
  renderTime: number;
  memoryUsage?: number;
  timestamp: number;
}

interface UsePerformanceOptions {
  enabled?: boolean;
  logToConsole?: boolean;
  onMetrics?: (metrics: PerformanceMetrics) => void;
}

export const usePerformance = (
  componentName: string,
  options: UsePerformanceOptions = {}
) => {
  const { enabled = true, logToConsole = false, onMetrics } = options;
  const renderStartTime = useRef<number>(0);
  const renderCount = useRef<number>(0);

  const measureRender = useCallback(() => {
    if (!enabled) return;

    const renderEndTime = performance.now();
    const renderTime = renderEndTime - renderStartTime.current;
    renderCount.current += 1;

    const metrics: PerformanceMetrics = {
      renderTime,
      timestamp: Date.now(),
    };

    // メモリ使用量の取得（利用可能な場合）
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      metrics.memoryUsage = memory.usedJSHeapSize / 1024 / 1024; // MB
    }

    if (logToConsole) {
      console.log(`[${componentName}] Render #${renderCount.current}:`, {
        renderTime: `${renderTime.toFixed(2)}ms`,
        memoryUsage: metrics.memoryUsage ? `${metrics.memoryUsage.toFixed(2)}MB` : 'N/A',
      });
    }

    onMetrics?.(metrics);
  }, [componentName, enabled, logToConsole, onMetrics]);

  useEffect(() => {
    renderStartTime.current = performance.now();
  });

  useEffect(() => {
    measureRender();
  }, [measureRender]);

  return {
    renderCount: renderCount.current,
    measureRender,
  };
};

// パフォーマンス監視用のユーティリティ
export const performanceUtils = {
  // 関数の実行時間を測定
  measureFunction: <T extends (...args: any[]) => any>(
    fn: T,
    name: string
  ): T => {
    return ((...args: Parameters<T>): ReturnType<T> => {
      const startTime = performance.now();
      const result = fn(...args);
      const endTime = performance.now();
      
      console.log(`[${name}] Execution time: ${(endTime - startTime).toFixed(2)}ms`);
      
      return result;
    }) as T;
  },

  // メモリ使用量の取得
  getMemoryUsage: (): number | null => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return memory.usedJSHeapSize / 1024 / 1024; // MB
    }
    return null;
  },

  // パフォーマンスマークの設定
  mark: (name: string) => {
    if ('mark' in performance) {
      performance.mark(name);
    }
  },

  // パフォーマンスメジャーの設定
  measure: (name: string, startMark: string, endMark: string) => {
    if ('measure' in performance) {
      try {
        performance.measure(name, startMark, endMark);
        const measure = performance.getEntriesByName(name)[0];
        if (measure) {
          console.log(`[${name}] Duration: ${measure.duration.toFixed(2)}ms`);
        }
      } catch (error) {
        console.warn(`Failed to measure ${name}:`, error);
      }
    }
  },

  // パフォーマンスエントリのクリア
  clearMarks: () => {
    if ('clearMarks' in performance) {
      performance.clearMarks();
    }
  },

  clearMeasures: () => {
    if ('clearMeasures' in performance) {
      performance.clearMeasures();
    }
  },
}; 