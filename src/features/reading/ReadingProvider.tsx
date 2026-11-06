import { useMemo, type ReactNode } from 'react';
import { ReadingContext } from './context';
import { EntryDialog } from '@/components/entry-dialog/EntryDialog';
import { useEntryDialog } from './useEntryDialog';
import { useReadingMode } from './useReadingMode';

/** 阅读层：影印页状态、地址栏深链、竖排偏好，集中在一处。 */
export function ReadingProvider({ children }: { children: ReactNode }) {
  const dialog = useEntryDialog();
  const { mode, setMode } = useReadingMode();

  const api = useMemo(() => ({ openEntry: dialog.open }), [dialog.open]);

  return (
    <ReadingContext.Provider value={api}>
      {children}
      <EntryDialog
        open={dialog.entry !== null}
        entry={dialog.entry}
        index={dialog.index}
        total={dialog.list.length}
        turn={dialog.turn}
        mode={mode}
        onModeChange={setMode}
        onClose={dialog.close}
        onNavigate={dialog.navigate}
      />
    </ReadingContext.Provider>
  );
}
