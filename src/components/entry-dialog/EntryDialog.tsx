import { useEffect, useRef, type KeyboardEvent, type TouchEvent } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { ENTRIES } from '@/data/entries';
import type { Entry, ReaderMode } from '@/domain/types';
import { BASE_LABEL, cnNumber } from '@/domain/entry';
import styles from './EntryDialog.module.css';

interface EntryDialogProps {
  open: boolean;
  entry: Entry | null;
  index: number;
  total: number;
  turn: 'next' | 'prev' | null;
  mode: ReaderMode;
  onModeChange: (mode: ReaderMode) => void;
  onClose: () => void;
  onNavigate: (delta: number) => void;
}

/** 影印页：版框、竖排右起正文、双行小注、今按与递藏。 */
export function EntryDialog({
  open,
  entry,
  index,
  total,
  turn,
  mode,
  onModeChange,
  onClose,
  onNavigate,
}: EntryDialogProps) {
  const textRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const progress = total > 0 ? ((index + 1) / total) * 100 : 0;

  useEffect(() => {
    const node = textRef.current;
    if (!node) return;
    node.scrollTop = 0;
    node.scrollLeft = 0;
  }, [entry?.id, mode]);

  useEffect(() => {
    if (!entry) return;
    const frame = requestAnimationFrame(() => {
      contentRef.current?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [entry]);

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    const touch = event.changedTouches[0];
    if (touch) touchStart.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const start = touchStart.current;
    touchStart.current = null;
    const touch = event.changedTouches[0];
    if (!start || !touch) return;

    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    if (Math.abs(dx) < 56 || Math.abs(dx) < Math.abs(dy) * 1.2) return;
    onNavigate(dx < 0 ? 1 : -1);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === 'ArrowRight' || event.key === 'PageDown') {
      event.preventDefault();
      onNavigate(1);
    }
    if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
      event.preventDefault();
      onNavigate(-1);
    }
  };

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content
          ref={contentRef}
          className={styles.content}
          aria-describedby="leaf-meta"
          onKeyDown={handleKeyDown}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {entry ? (
            <div className={styles.sheet}>
              <header className={styles.topbar}>
                <div className={styles.heading}>
                  <Dialog.Title className={styles.title}>{entry.title}</Dialog.Title>
                  <Dialog.Description className={styles.crumb} id="leaf-meta">
                    永乐大典 · {entry.juan} · {entry.category}
                  </Dialog.Description>
                </div>
                <div className={styles.actions}>
                  <button
                    type="button"
                    className={styles.mode}
                    aria-pressed={mode === 'horizontal'}
                    onClick={() => onModeChange(mode === 'vertical' ? 'horizontal' : 'vertical')}
                  >
                    {mode === 'vertical' ? '改横排' : '改竖排'}
                  </button>
                  <Dialog.Close className={styles.close} aria-label="合卷">
                    ×
                  </Dialog.Close>
                </div>
              </header>

              <div className={styles.progress} aria-hidden="true">
                <span style={{ width: `${progress}%` }} />
              </div>

              <div
                key={entry.id}
                className={styles.leafArea}
                data-turn={turn ?? undefined}
              >
                <aside className={styles.aside}>
                  <dl className={styles.meta}>
                    <div>
                      <dt>卷次</dt>
                      <dd>{entry.juan}</dd>
                    </div>
                    <div>
                      <dt>类目</dt>
                      <dd>{entry.category}</dd>
                    </div>
                    <div>
                      <dt>纪年</dt>
                      <dd>{BASE_LABEL} · 原抄</dd>
                    </div>
                    <div>
                      <dt>西历</dt>
                      <dd>{entry.year}</dd>
                    </div>
                    <div>
                      <dt>距永乐</dt>
                      <dd>晚 {entry.gap} 年</dd>
                    </div>
                    <div>
                      <dt>存佚</dt>
                      <dd>{entry.state}</dd>
                    </div>
                    <div className={styles.provenance}>
                      <dt>递藏</dt>
                      <dd>{entry.provenance}</dd>
                    </div>
                  </dl>
                </aside>

                <div className={styles.main}>
                  {/* 竖排右起：版框内的文字区自行滚动，不带动整页 */}
                  <div ref={textRef} className={styles.text} data-mode={mode}>
                    {entry.text.split('|').map((paragraph, position) => (
                      <p key={position}>{paragraph}</p>
                    ))}
                    {entry.note ? (
                      <p className={styles.note}>
                        <span className={styles.noteTag}>小注</span>
                        {entry.note}
                      </p>
                    ) : null}
                  </div>

                  <div className={styles.commentary}>
                    <div className={styles.commentHead}>
                      <span className={styles.tag}>今按</span>
                      <span>
                        西史所称 · {entry.who}
                        {entry.work ? `，${entry.work}` : ''}
                      </span>
                      <span className={styles.gap}>晚 {entry.gap} 年</span>
                    </div>
                    <p className={styles.press}>{entry.press}</p>
                  </div>
                </div>
              </div>

              <footer className={styles.pager}>
                <button
                  type="button"
                  className={styles.nav}
                  onClick={() => onNavigate(-1)}
                  disabled={index <= 0}
                >
                  上一叶
                </button>
                <span className={styles.pageInfo}>
                  <span className={styles.index}>
                    第 {cnNumber(index + 1)} 叶
                    <em>
                      {total < ENTRIES.length ? '检得' : '共'} {cnNumber(total)} 叶
                    </em>
                  </span>
                  <span className={styles.keyHint} aria-hidden="true">
                    ← → 翻叶
                  </span>
                </span>
                <button
                  type="button"
                  className={styles.nav}
                  onClick={() => onNavigate(1)}
                  disabled={index >= total - 1}
                >
                  下一叶
                </button>
              </footer>
            </div>
          ) : null}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
