import { useState } from 'react';
import { DIASPORA } from '@/data/diaspora';
import styles from './Diaspora.module.css';

/** 流散十二记：左列记目，右列正文、三证、释疑与所据。 */
export function Diaspora() {
  const [active, setActive] = useState(0);
  const story = DIASPORA[active];

  return (
    <div className={styles.diaspora}>
      <header className={styles.head}>
        <p className={styles.kicker}>流散 · 十二记</p>
        <h3 className={styles.title}>
          书不是一次丢的，
          <br />
          是一页一页丢的。
        </h3>
        <p className={styles.lead}>
          火、钉、渍、痕、拍目、运单——每一记都由一件物证起头。先看痕，再看人，最后看账。
        </p>
      </header>

      <div className={styles.grid}>
        <nav className={styles.index} aria-label="流散记目">
          {DIASPORA.map((item, index) => (
            <button
              key={item.no}
              type="button"
              className={index === active ? styles.indexActive : styles.indexItem}
              aria-current={index === active ? 'true' : undefined}
              onClick={() => setActive(index)}
            >
              <span className={styles.indexNo}>{item.no}</span>
              <span className={styles.indexTitle}>{item.title}</span>
              <span className={styles.indexYear}>{item.year}</span>
            </button>
          ))}
        </nav>

        <article className={styles.story} aria-live="polite">
          <div className={styles.storyMeta}>
            <span>{story.no}</span>
            <span>{story.year}</span>
            <span>{story.place}</span>
          </div>
          <h4 className={styles.storyTitle}>{story.title}</h4>
          <p className={styles.storyLead}>{story.lead}</p>

          <p className={styles.route}>
            <span className={styles.routeLabel}>路线</span>
            {story.route}
          </p>

          <div className={styles.body}>
            {story.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <div className={styles.counter}>
            <p className={styles.counterLabel}>释疑</p>
            <p>{story.counter}</p>
          </div>

          <div className={styles.clues}>
            <p className={styles.cluesLabel}>三证</p>
            <ol>
              {story.clues.map((clue) => (
                <li key={clue}>{clue}</li>
              ))}
            </ol>
          </div>

          <p className={styles.sources}>
            <span className={styles.sourcesLabel}>所据</span>
            {story.sources.join(' · ')}
          </p>
        </article>
      </div>
    </div>
  );
}
