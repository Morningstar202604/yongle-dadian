import { PREFACE } from '@/data/preface';
import { SectionHeading } from '@/components/ui/SectionHeading';
import styles from './Preface.module.css';

/** 卷首凡例：左竖排批注，右六条编纂规则。 */
export function Preface() {
  return (
    <section className="section" id="intro" aria-labelledby="preface-title">
      <div className="wrap">
        <SectionHeading
          kicker="卷首 · 凡例"
          title={
            <span id="preface-title">
              此书不作新说，
              <br />
              只把旧账算清。
            </span>
          }
          lead="《永乐大典》成于永乐六年，凡二万二千八百七十七卷。本编取其中言天象、言器用、言格物者，依类重排；每条之下，系以西历之年，使读者一目了然：某器成于何岁，某说立于何年，其间相去几何。"
        />

        <div className={styles.grid}>
          <aside className={styles.aside}>
            <blockquote className={styles.quote} aria-label="嘉靖副本批注">
              {PREFACE.quote.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </blockquote>
            <p className={styles.quoteNote}>{PREFACE.quoteNote}</p>
          </aside>

          <ol className={styles.rules}>
            {PREFACE.rules.map((rule) => (
              <li key={rule.no}>
                <span className={styles.no}>{rule.no}</span>
                <div>
                  <h3 className={styles.ruleTitle}>{rule.title}</h3>
                  <p className={styles.ruleBody}>{rule.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <p className={styles.footnote}>{PREFACE.footnote}</p>
      </div>
    </section>
  );
}
