import type { Entry } from '@/domain/types';
import { matchSnippet } from '@/domain/entry';
import { Highlight } from '@/components/ui/Highlight';
import styles from './EntryRow.module.css';

interface EntryRowProps {
  entry: Entry;
  keyword: string;
  onOpen: () => void;
}

/** 总目的一行：卷次、篇名、类目、西历、年差。整行可点。 */
export function EntryRow({ entry, keyword, onOpen }: EntryRowProps) {
  const titleHit = keyword
    ? entry.title.toLowerCase().includes(keyword.trim().toLowerCase())
    : false;
  const snippet = keyword && !titleHit ? matchSnippet(entry, keyword) : null;

  return (
    <button
      type="button"
      className={styles.row}
      onClick={onOpen}
      aria-haspopup="dialog"
      aria-label={`${entry.juan} ${entry.title}，${entry.year} 年，晚 ${entry.gap} 年`}
    >
      <span className={styles.juan}>{entry.juan}</span>
      <span className={styles.title}>
        <Highlight text={entry.title} keyword={keyword} />
        {snippet ? (
          <span className={styles.snippet}>
            <Highlight text={snippet} keyword={keyword} />
          </span>
        ) : null}
      </span>
      <span className={styles.category}>{entry.category}</span>
      <span className={styles.year}>
        {entry.year}
        <em>晚 {entry.gap} 年</em>
      </span>
      <span className={styles.go} aria-hidden="true">
        阅
      </span>
    </button>
  );
}
