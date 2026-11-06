import { useState } from 'react';
import { ENTRIES } from '@/data/entries';
import { cnNumber } from '@/domain/entry';
import { useEntryFilter } from '@/hooks/useEntryFilter';
import { useReading } from '@/features/reading/context';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { EntryAtlas } from '@/components/atlas/EntryAtlas';
import { CatalogToolbar } from './CatalogToolbar';
import { EntryRow } from './EntryRow';
import styles from './Catalog.module.css';

/** 总目：检索 + 类目 + 条目行。点行开影印页。 */
export function Catalog() {
  const filter = useEntryFilter(ENTRIES);
  const { openEntry } = useReading();
  const [view, setView] = useState<'list' | 'atlas'>('list');
  const pageKey = `${filter.seq}:${filter.category}:${filter.deferredKeyword}`;
  const [pager, setPager] = useState({ key: pageKey, page: 0 });
  const page = pager.key === pageKey ? pager.page : 0;

  const PAGE_SIZE = 60;
  const pageCount = Math.max(1, Math.ceil(filter.results.length / PAGE_SIZE));
  const current = Math.min(page, pageCount - 1);
  const visible = filter.results.slice(current * PAGE_SIZE, (current + 1) * PAGE_SIZE);

  const resultNote = filter.isFiltering
    ? `检得 ${filter.results.length} 条`
    : `全部 ${ENTRIES.length} 条`;

  const pickRandom = () => {
    const pool = filter.results.length > 0 ? filter.results : ENTRIES;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    openEntry(pick.id, pool);
  };

  return (
    <section className="section" id="catalog" aria-labelledby="catalog-title">
      <div className="wrap">
        <SectionHeading
          kicker="总目 · 九类"
          title={
            <span id="catalog-title">
              {cnNumber(ENTRIES.length)}条，
              <br />
              皆有下落。
            </span>
          }
          lead="依卷次第，循类相从。点开任一条，可读影印页：原文、双行小注、今按、递藏，一一具在。"
        />

        <CatalogToolbar
          category={filter.category}
          keyword={filter.keyword}
          counts={filter.counts}
          total={ENTRIES.length}
          onCategoryChange={filter.setCategory}
          onKeywordChange={filter.setKeyword}
        />

        <div className={styles.result} aria-live="polite" aria-busy={filter.isPending}>
          <div className={styles.resultText}>
            <p>{resultNote}</p>
            <p className={styles.query}>
              {filter.deferredKeyword ? `「${filter.deferredKeyword}」` : ''}
              {filter.category !== 'all' ? ` · ${filter.category}` : ''}
            </p>
          </div>
          <div className={styles.actions}>
            <div className={styles.views} role="group" aria-label="总目视图">
              <button
                type="button"
                className={view === 'list' ? styles.viewActive : styles.view}
                aria-pressed={view === 'list'}
                onClick={() => setView('list')}
              >
                逐条
              </button>
              <button
                type="button"
                className={view === 'atlas' ? styles.viewActive : styles.view}
                aria-pressed={view === 'atlas'}
                onClick={() => setView('atlas')}
              >
                星图
              </button>
            </div>
            <button type="button" className={styles.random} onClick={pickRandom}>
              任取一叶
            </button>
          </div>
        </div>

        {view === 'atlas' && filter.results.length > 0 ? (
          <EntryAtlas entries={filter.results} onOpen={openEntry} />
        ) : filter.results.length > 0 ? (
          <>
            <div className={styles.list}>
              {visible.map((entry) => (
                <EntryRow
                  key={entry.id}
                  entry={entry}
                  keyword={filter.deferredKeyword}
                  onOpen={() => openEntry(entry.id, filter.results)}
                />
              ))}
            </div>
            {pageCount > 1 ? (
              <nav className={styles.pager} aria-label="总目分叶">
                <button
                  type="button"
                  className={styles.pageButton}
                  disabled={current === 0}
                  onClick={() => setPager({ key: pageKey, page: Math.max(0, current - 1) })}
                >
                  ← 上一叶
                </button>
                <span className={styles.pageInfo}>
                  第 {cnNumber(current + 1)} 叶 / 共 {cnNumber(pageCount)} 叶
                </span>
                <button
                  type="button"
                  className={styles.pageButton}
                  disabled={current >= pageCount - 1}
                  onClick={() => setPager({ key: pageKey, page: Math.min(pageCount - 1, current + 1) })}
                >
                  下一叶 →
                </button>
              </nav>
            ) : null}
          </>
        ) : (
          <div className={styles.empty}>
            <p className={styles.emptyTitle}>此卷无字</p>
            <p className={styles.emptyBody}>
              检索无着，或此条已佚，或字有异写。可换一类，或去其检索之字。
            </p>
            <button type="button" className={styles.reset} onClick={filter.clear}>
              重置筛选
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
