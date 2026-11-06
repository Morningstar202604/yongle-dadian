import type { ReactNode } from 'react';
import styles from './SectionHeading.module.css';

interface SectionHeadingProps {
  kicker: string;
  title: ReactNode;
  lead?: ReactNode;
  /** inverse 用于靛底章节。 */
  tone?: 'light' | 'inverse';
}

/** 章节题头：朱字眉标、墨字大标题、一句引文，全站统一。 */
export function SectionHeading({ kicker, title, lead, tone = 'light' }: SectionHeadingProps) {
  return (
    <header
      className={['sectionHead', tone === 'inverse' ? styles.inverse : '']
        .filter(Boolean)
        .join(' ')}
    >
      <p className="kicker">{kicker}</p>
      <h2 className="sectionTitle">{title}</h2>
      {lead ? <p className="sectionLead">{lead}</p> : null}
    </header>
  );
}
