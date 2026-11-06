import { ENTRIES } from '@/data/entries';
import { cnNumber } from '@/domain/entry';
import styles from './Footer.module.css';

/** 页脚：只留板式、字体、卷次三项刊记与一条底栏。 */
export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="wrap">
        <p className={styles.end} aria-hidden="true">
          卷终
        </p>

        <dl className={styles.colophon}>
          <div>
            <dt>板式</dt>
            <dd>乌丝栏，双行小注，朱文方印；影印页右起竖读。</dd>
          </div>
          <div>
            <dt>字体</dt>
            <dd>正文宋体，批注楷体；西文名词以今语释之。</dd>
          </div>
          <div>
            <dt>卷次</dt>
            <dd>九类{cnNumber(ENTRIES.length)}条，依原卷次第重排，不别立新目。</dd>
          </div>
        </dl>

        <div className={styles.bottom}>
          <span>永乐大典 · 数字重刊</span>
          <span>永乐六年 · 一四〇八</span>
        </div>
      </div>
    </footer>
  );
}
