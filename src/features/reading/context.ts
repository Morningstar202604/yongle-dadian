import { createContext, useContext } from 'react';
import type { Entry } from '@/domain/types';

export interface ReadingApi {
  /** 打开影印页；传入当前筛选结果，翻叶顺序随之改变。 */
  openEntry: (id: number, list?: Entry[]) => void;
}

export const ReadingContext = createContext<ReadingApi | null>(null);

export function useReading(): ReadingApi {
  const api = useContext(ReadingContext);
  if (!api) {
    throw new Error('useReading 必须在 <ReadingProvider> 内使用');
  }
  return api;
}
