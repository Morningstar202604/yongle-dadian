import { useEffect, useRef } from 'react';
import type { Category } from '@/domain/types';
import { CATEGORY_FILTERS, type CategoryFilter } from '@/data/taxonomy';
import styles from './CatalogToolbar.module.css';

interface CatalogToolbarProps {
  category: CategoryFilter;
  keyword: string;
  counts: Record<Category, number>;
  total: number;
  onCategoryChange: (category: CategoryFilter) => void;
  onKeywordChange: (keyword: string) => void;
}

/** 检索框 + 九类筛选。按「/」可随时聚焦检索。 */
export function CatalogToolbar({
  category,
  keyword,
  counts,
  total,
  onCategoryChange,
  onKeywordChange,
}: CatalogToolbarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key !== '/' || event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target?.closest('input, textarea, [contenteditable="true"]')) return;
      event.preventDefault();
      inputRef.current?.focus();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <div className={styles.toolbar}>
      <div className={styles.searchRow}>
        <label className={styles.search}>
          <span className="srOnly">检索总目</span>
          <span className={styles.prefix} aria-hidden="true">
            检
          </span>
          <input
            ref={inputRef}
            type="search"
            value={keyword}
            placeholder="篇名、卷次、正文、西历之年"
            autoComplete="off"
            onChange={(event) => onKeywordChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Escape') onKeywordChange('');
            }}
          />
          {keyword ? (
            <button type="button" className={styles.clear} onClick={() => onKeywordChange('')} aria-label="清空检索">
              清
            </button>
          ) : null}
        </label>
        <p className={styles.hint}>
          <kbd>/</kbd>
          聚焦检索
        </p>
      </div>

      <div className={styles.chips} role="group" aria-label="按类目筛选">
        {CATEGORY_FILTERS.map((filter) => {
          const active = category === filter.value;
          const count = filter.value === 'all' ? total : counts[filter.value];
          return (
            <button
              key={filter.value}
              type="button"
              className={active ? styles.chipOn : styles.chip}
              aria-pressed={active}
              onClick={() => onCategoryChange(filter.value)}
            >
              {filter.label}
              <span className={styles.count}>{count}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
