import { useCallback, useEffect, useState } from 'react';
import type { Entry } from '@/domain/types';
import { ENTRIES } from '@/data/entries';

export type TurnDirection = 'next' | 'prev' | null;

export interface ReadingState {
  id: number;
  list: Entry[];
}

const HASH_PATTERN = /^#\/entry\/(\d+)$/;

function entryIdFromHash(): number | null {
  const hit = HASH_PATTERN.exec(window.location.hash);
  return hit ? Number(hit[1]) : null;
}

/**
 * 影印页的开关与地址栏同步：
 * - 打开：pushState，浏览器后退可关闭；
 * - 翻叶：replaceState，不堆积历史记录；
 * - hashchange：关闭或从深链进入。
 */
export function useEntryDialog() {
  const [turn, setTurn] = useState<TurnDirection>(null);
  const [state, setState] = useState<ReadingState | null>(() => {
    const id = entryIdFromHash();
    return id === null ? null : { id, list: ENTRIES };
  });

  useEffect(() => {
    const handleHash = () => {
      const id = entryIdFromHash();
      if (id === null) {
        setState(null);
        return;
      }
      if (!ENTRIES.some((entry) => entry.id === id)) return;
      setState({ id, list: ENTRIES });
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const open = useCallback((id: number, list: Entry[] = ENTRIES) => {
    const safeList = list.some((entry) => entry.id === id) ? list : ENTRIES;
    setTurn(null);
    setState({ id, list: safeList });
    const hash = `#/entry/${id}`;
    if (window.location.hash !== hash) {
      window.history.pushState(null, '', hash);
    }
  }, []);

  const close = useCallback(() => {
    setTurn(null);
    setState(null);
    if (window.location.hash.startsWith('#/entry/')) {
      window.history.pushState(null, '', window.location.pathname + window.location.search);
    }
  }, []);

  const index = state ? state.list.findIndex((entry) => entry.id === state.id) : -1;

  const navigate = useCallback(
    (delta: number) => {
      if (!state) return;
      const current = state.list.findIndex((entry) => entry.id === state.id);
      const next = state.list[current + delta];
      if (!next) return;
      setTurn(delta > 0 ? 'next' : 'prev');
      setState({ id: next.id, list: state.list });
      window.history.replaceState(null, '', `#/entry/${next.id}`);
    },
    [state],
  );

  return {
    entry: state ? (state.list[index] ?? null) : null,
    index,
    list: state?.list ?? ENTRIES,
    turn,
    open,
    close,
    navigate,
  };
}
