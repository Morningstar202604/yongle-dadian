import { VOYAGE_STOPS } from '@/data/voyage';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Diaspora } from '@/components/diaspora/Diaspora';
import styles from './Voyage.module.css';

/** 流散：靛底七站，窄屏竖轴、宽屏横轴；下接十二记。 */
export function Voyage() {
  return (
    <section className={`section ${styles.voyage}`} id="voyage" aria-labelledby="voyage-title">
      <div className="wrap">
        <SectionHeading
          kicker="流散 · 七站十二记"
          title={
            <span id="voyage-title">
              书散于火，
              <br />
              亦散于海。
            </span>
          }
          lead="自南京文渊阁至里斯本某馆，凡七站；自庚子劫火至数字归影，凡十二记。海舶所至，皆有抽抄；抽抄所至，皆有批注。今按所据，即此批注与残痕。"
          tone="inverse"
        />

        <div className={styles.track}>
          {VOYAGE_STOPS.map((stop) => (
            <article key={stop.port} className={styles.stop}>
              <p className={styles.year}>{stop.year}</p>
              <span className={styles.node} aria-hidden="true" />
              <h3 className={styles.port}>{stop.port}</h3>
              <p className={styles.desc}>{stop.description}</p>
            </article>
          ))}
        </div>

        <p className={styles.note}>
          永乐六年成书 · 一五四三年抵里斯本 · 其间三十五年，七站皆有批注可考
        </p>

        <Diaspora />
      </div>
    </section>
  );
}
