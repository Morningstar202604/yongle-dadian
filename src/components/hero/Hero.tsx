import { ENTRIES } from '@/data/entries';
import { EDITION } from '@/data/edition';
import { Seal } from '@/components/ui/Seal';
import styles from './Hero.module.css';

const STATS = [
  { value: EDITION.juan.toLocaleString('en-US'), label: '卷' },
  { value: EDITION.volumes.toLocaleString('en-US'), label: '册' },
  { value: EDITION.words, label: EDITION.wordsUnit },
  { value: String(ENTRIES.length), label: '条 · 本编收录' },
];

/** 首屏：靛蓝函套、竖排书名、乌丝栏与朱印，打开即见「书」。 */
export function Hero() {
  return (
    <header className={styles.hero} id="top">
      <div className={styles.rules} aria-hidden="true" />
      <div className={styles.inner}>
        <div className={styles.body}>
          <div className={styles.left}>
            <blockquote className={styles.quote}>
              <p>凡泰西之新器，</p>
              <p>其法必先见于中土；</p>
              <p>其名必后出于海外。</p>
            </blockquote>
            <p className={styles.source}>编纂凡例 · 卷一</p>
            <Seal text="永乐大典" size="lg" className={styles.stamp} />
          </div>

          <div className={styles.right}>
            <h1 className={styles.title}>永乐大典</h1>
            <p className={styles.sub}>内府刻本 · 永乐六年 · 数字重刊</p>
          </div>
        </div>

        <div className={styles.foot}>
          <dl className={styles.stats}>
            {STATS.map((stat) => (
              <div key={stat.label} className={styles.stat}>
                <dt>{stat.label}</dt>
                <dd>{stat.value}</dd>
              </div>
            ))}
          </dl>
          <a className={styles.cta} href="#catalog">
            翻检总目
            <span>{ENTRIES.length} 条</span>
          </a>
        </div>
      </div>
    </header>
  );
}
