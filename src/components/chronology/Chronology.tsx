import { useRef } from 'react';
import { CHRONOLOGY } from '@/data/chronology';
import { ENTRIES } from '@/data/entries';
import { BASE_YEAR, cnDigits, cnNumber } from '@/domain/entry';
import { useReading } from '@/features/reading/context';
import { useRevealChildren } from '@/hooks/useReveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import styles from './Chronology.module.css';

const LAST_YEAR = Math.max(...CHRONOLOGY.map((item) => item.year));
const SPAN = LAST_YEAR - BASE_YEAR;

/** 年表：三列网格，年份 / 轴线 / 事略，朱点与轴线中心同轴。 */
export function Chronology() {
  const { openEntry } = useReading();
  const listRef = useRef<HTMLOListElement>(null);
  useRevealChildren(listRef);

  return (
    <section className="section" id="chron" aria-labelledby="chron-title">
      <div className="wrap">
        <SectionHeading
          kicker={`年表 · ${cnNumber(SPAN)}年`}
          title={
            <span id="chron-title">
              {cnNumber(CHRONOLOGY.length)}事，
              <br />
              一线相贯。
            </span>
          }
          lead={`自永乐六年至${cnDigits(LAST_YEAR)}，凡${cnNumber(SPAN)}年。其大事之见于本书者，逐年系之；点年份可入影印页。`}
        />

        <ol className={styles.timeline} ref={listRef}>
          {CHRONOLOGY.map((item) => (
            <li
              key={`${item.year}-${item.title}`}
              className={item.isAnchor ? styles.anchorItem : styles.item}
              data-reveal
            >
              <div className={styles.year}>
                <span className={styles.yearValue}>{item.year}</span>
                {item.isAnchor ? (
                  <em className={styles.yearNote}>永乐六年 · 成书</em>
                ) : (
                  <em className={styles.yearNote}>晚 {item.year - BASE_YEAR} 年</em>
                )}
              </div>

              <div className={styles.axis} aria-hidden="true">
                <span className={item.isAnchor ? styles.anchorDot : styles.dot} />
              </div>

              <div className={styles.content}>
                <h3 className={styles.itemTitle}>{item.title}</h3>
                <p className={styles.itemBody}>{item.body}</p>
                {item.entryId !== undefined ? (
                  <button
                    type="button"
                    className={styles.jump}
                    onClick={() => openEntry(item.entryId as number, ENTRIES)}
                  >
                    阅卷次 · 影印页
                    <span aria-hidden="true">→</span>
                  </button>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
