import { splitHighlight } from '@/domain/entry';
import styles from './Highlight.module.css';

interface HighlightProps {
  text: string;
  keyword: string;
}

/** 检索命中的字加一层淡朱底，不使用 innerHTML。 */
export function Highlight({ text, keyword }: HighlightProps) {
  return (
    <>
      {splitHighlight(text, keyword).map((token, index) =>
        token.matched ? (
          <mark key={index} className={styles.mark}>
            {token.text}
          </mark>
        ) : (
          <span key={index}>{token.text}</span>
        ),
      )}
    </>
  );
}
