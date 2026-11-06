import styles from './Seal.module.css';

interface SealProps {
  /** 四字，按右上、右下、左上、左下（印章读序）排入 2×2。 */
  text: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

function sealOrder(text: string) {
  const chars = Array.from(text).slice(0, 4);
  if (chars.length !== 4) return chars;
  return [chars[2], chars[0], chars[3], chars[1]];
}

/** 朱文方印。四字按传统印序排布，不做圆角。 */
export function Seal({ text, size = 'md', className }: SealProps) {
  const chars = sealOrder(text);
  return (
    <span
      className={[styles.seal, styles[size], className].filter(Boolean).join(' ')}
      aria-hidden="true"
    >
      {chars.map((char, index) => (
        <span key={`${char}-${index}`}>{char}</span>
      ))}
    </span>
  );
}
