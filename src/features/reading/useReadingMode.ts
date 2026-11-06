import { useEffect, useState } from 'react';
import type { ReaderMode } from '@/domain/types';

const STORAGE_KEY = 'yongle.reader-mode';

function readStoredMode(): ReaderMode {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'horizontal' ? 'horizontal' : 'vertical';
  } catch {
    return 'vertical';
  }
}

/** 影印页的竖排/横排偏好，跨会话记住。 */
export function useReadingMode() {
  const [mode, setMode] = useState<ReaderMode>(readStoredMode);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      /* 隐私模式下忽略 */
    }
  }, [mode]);

  return { mode, setMode };
}
