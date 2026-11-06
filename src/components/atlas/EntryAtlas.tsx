import { useMemo, useState } from 'react';
import type { Entry, EntryState } from '@/domain/types';
import { CATEGORIES } from '@/data/taxonomy';
import styles from './EntryAtlas.module.css';

interface EntryAtlasProps {
  entries: Entry[];
  onOpen: (id: number, list: Entry[]) => void;
}

const W = 1000;
const PAD_L = 62;
const PAD_R = 24;
const PAD_T = 26;
const PAD_B = 54;
const BAND = 38;

const STATE_LABEL: Record<EntryState, string> = { 存: '存', 残: '残', 佚: '佚' };

/** 总目星图：一条按年，一栏按类；点一点，入一卷。 */
export function EntryAtlas({ entries, onOpen }: EntryAtlasProps) {
  const [hovered, setHovered] = useState<Entry | null>(null);

  const years = useMemo(() => {
    if (entries.length === 0) return { min: 1400, max: 2020 };
    return {
      min: Math.min(...entries.map((entry) => entry.year)),
      max: Math.max(...entries.map((entry) => entry.year)),
    };
  }, [entries]);

  const span = Math.max(1, years.max - years.min);
  const x = (year: number) => PAD_L + ((year - years.min) / span) * (W - PAD_L - PAD_R);
  const y = (category: string, id: number) => {
    const band = CATEGORIES.indexOf(category as (typeof CATEGORIES)[number]);
    return PAD_T + band * BAND + BAND / 2 + ((id * 13) % 19) - 9;
  };

  const ticks = useMemo(() => {
    const start = Math.ceil(years.min / 50) * 50;
    const list: number[] = [];
    for (let year = start; year <= years.max; year += 50) list.push(year);
    return list;
  }, [years]);

  const plotHeight = PAD_T + CATEGORIES.length * BAND + PAD_B;

  return (
    <div className={styles.atlas}>
      <div className={styles.readout} aria-live="polite">
        {hovered ? (
          <>
            <span className={styles.readTitle}>{hovered.title}</span>
            <span className={styles.readMeta}>
              {hovered.year} · {hovered.juan} · {hovered.who}
            </span>
          </>
        ) : (
          <span className={styles.readHint}>移指一点，见其名、其年、其卷；点则入影印页。</span>
        )}
      </div>

      <div className={styles.legend} aria-hidden="true">
        {(['存', '残', '佚'] as EntryState[]).map((state) => (
          <span key={state} className={styles.legendItem}>
            <i className={styles[`dot${state}`]} />
            {STATE_LABEL[state]}
          </span>
        ))}
        <span className={styles.legendNote}>凡 {entries.length} 点</span>
      </div>

      <div className={styles.plotWrap}>
        <svg
          className={styles.plot}
          viewBox={`0 0 ${W} ${plotHeight}`}
          role="img"
          aria-label={`条目星图：${entries.length} 条，按年代与九类分布。可点圆点入卷。`}
        >
          <g aria-hidden="true">
            {CATEGORIES.map((category, index) => (
              <g key={category}>
                <line
                  x1={PAD_L}
                  x2={W - PAD_R}
                  y1={PAD_T + index * BAND + BAND / 2}
                  y2={PAD_T + index * BAND + BAND / 2}
                  className={styles.rule}
                />
                <text
                  x={PAD_L - 10}
                  y={PAD_T + index * BAND + BAND / 2 + 3.5}
                  textAnchor="end"
                  className={styles.bandLabel}
                >
                  {category}
                </text>
              </g>
            ))}
            {ticks.map((year) => (
              <g key={year}>
                <line
                  x1={x(year)}
                  x2={x(year)}
                  y1={PAD_T - 4}
                  y2={PAD_T + CATEGORIES.length * BAND}
                  className={styles.tick}
                />
                <text
                  x={x(year)}
                  y={PAD_T + CATEGORIES.length * BAND + 17}
                  textAnchor="middle"
                  className={styles.tickLabel}
                >
                  {year}
                </text>
              </g>
            ))}
            <text
              x={PAD_L}
              y={plotHeight - 8}
              className={styles.caption}
            >
              永乐六年 · 一四〇八
            </text>
          </g>

          {entries.map((entry) => (
            <g
              key={entry.id}
              className={styles.point}
              onPointerEnter={() => setHovered(entry)}
              onPointerLeave={() => setHovered(null)}
              onClick={() => onOpen(entry.id, entries)}
            >
              <circle
                cx={x(entry.year)}
                cy={y(entry.category, entry.id)}
                r={10}
                className={styles.hit}
              />
              <circle
                className={[styles.dot, styles[`state${entry.state}`], hovered?.id === entry.id ? styles.hot : '']
                  .filter(Boolean)
                  .join(' ')}
                cx={x(entry.year)}
                cy={y(entry.category, entry.id)}
                r={entry.state === '存' ? 3 : 2.5}
                aria-hidden="true"
              >
                <title>{`${entry.title} · ${entry.year}`}</title>
              </circle>
            </g>
          ))}
        </svg>
      </div>

      <p className={styles.footNote}>
        横为年，纵为类；朱点佚、金点残、墨点存。点之，即入其卷。
      </p>
    </div>
  );
}
