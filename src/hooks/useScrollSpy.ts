import { useEffect, useState } from 'react';

/** 滚动到某个章节时，给导航加当前态。offset 取导航高度加一点余量。 */
export function useScrollSpy(ids: readonly string[]) {
  const [active, setActive] = useState('');

  useEffect(() => {
    let frame = 0;

    const measure = () => {
      const offset = window.innerHeight * 0.3;
      let current = '';
      for (const id of ids) {
        const element = document.getElementById(id);
        if (element && element.getBoundingClientRect().top <= offset) {
          current = id;
        }
      }
      setActive((previous) => (previous === current ? previous : current));
    };

    const schedule = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        measure();
      });
    };

    measure();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [ids]);

  return active;
}
