import styles from './SiteHeader.module.css';

const SECTIONS = [
  { id: 'intro', label: '卷首' },
  { id: 'catalog', label: '总目' },
  { id: 'chron', label: '年表' },
  { id: 'voyage', label: '流布' },
] as const;

interface SiteHeaderProps {
  activeSection: string;
  progress: number;
}

/** 页头：书名牌、按卷导航、通读进度朱线。 */
export function SiteHeader({ activeSection, progress }: SiteHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <a className={styles.brand} href="#top" aria-label="回到卷首">
          <span className={styles.mark} aria-hidden="true">
            典
          </span>
          <span className={styles.name}>永乐大典</span>
          <span className={styles.sub}>数字重刊</span>
        </a>

        <nav className={styles.nav} aria-label="按卷导航">
          {SECTIONS.map((section) => {
            const active = activeSection === section.id;
            return (
              <a
                key={section.id}
                href={`#${section.id}`}
                className={active ? styles.active : undefined}
                aria-current={active ? 'true' : undefined}
              >
                {section.label}
              </a>
            );
          })}
        </nav>

        <span className={styles.edition}>永乐六年 · 一四〇八</span>
      </div>
      <span
        className={styles.progress}
        style={{ transform: `scaleX(${progress})` }}
        aria-hidden="true"
      />
    </header>
  );
}
