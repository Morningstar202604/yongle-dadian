import { ENTRIES } from '@/data/entries';
import { cnNumber } from '@/domain/entry';
import { useEntryFilter } from '@/hooks/useEntryFilter';
import { useReading } from '@/features/reading/context';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { CatalogToolbar } from './CatalogToolbar';
import { EntryRow } from './EntryRow';
import styles from './Catalog.module.css';

/** 总目：检索 + 类目 + 条目行。点行开影印页。 */
export function Catalog() {
  const filter = useEntryFilter(ENTRIES);
  const { openEntry } = useReading();

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
          <button type="button" className={styles.random} onClick={pickRandom}>
            任取一叶
          </button>
        </div>

        {filter.results.length > 0 ? (
          <div className={styles.list}>
            {filter.results.map((entry) => (
              <EntryRow
                key={entry.id}
                entry={entry}
                keyword={filter.deferredKeyword}
                onOpen={() => openEntry(entry.id, filter.results)}
              />
            ))}
          </div>
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
