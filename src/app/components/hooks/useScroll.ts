import { useState, useEffect } from 'react';

export function useScroll(element?: HTMLElement | null, callback?: () => void) {
  const [scrollTop, setScrollTop] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const listener = () => {
    if (element === null) return;

    const el = element || document.body;

    const { top, left } = el.getBoundingClientRect();

    setScrollTop(Math.abs(top));
    setScrollLeft(Math.abs(left));

    if (typeof callback === 'function') {
      callback();
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', listener);
    return () => {
      window.removeEventListener('scroll', listener);
    };
  });

  return {
    scrollTop,
    scrollLeft,
  };
}
