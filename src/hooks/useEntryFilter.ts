import { useDeferredValue, useMemo, useState } from 'react';
import type { Entry } from '@/domain/types';
import { countByCategory, filterEntries } from '@/domain/entry';
import type { CategoryFilter } from '@/data/taxonomy';

/**
 * 总目的检索状态。用 useDeferredValue 把输入与重排分开：
 * 输入即时响应，筛选结果稍后跟上，不手动写防抖定时器。
 */
export function useEntryFilter(entries: Entry[]) {
  const [category, setCategory] = useState<CategoryFilter>('all');
  const [keyword, setKeyword] = useState('');
  const deferredKeyword = useDeferredValue(keyword);

  const counts = useMemo(() => countByCategory(entries), [entries]);

  const results = useMemo(
    () => filterEntries(entries, { category, keyword: deferredKeyword }),
    [entries, category, deferredKeyword],
  );

  const isFiltering = category !== 'all' || keyword.trim().length > 0;

  return {
    category,
    keyword,
    deferredKeyword,
    counts,
    results,
    isFiltering,
    isPending: keyword !== deferredKeyword,
    setCategory,
    setKeyword,
    clear: () => {
      setCategory('all');
      setKeyword('');
    },
  };
}
