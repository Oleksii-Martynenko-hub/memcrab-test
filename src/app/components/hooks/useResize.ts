import { useState, useEffect } from 'react';

export function useResize(w = 0, h = 0) {
  const [width, setWidth] = useState(w);
  const [height, setHeight] = useState(h);

  const listener = () => {
    const { width: newW, height: newH } = document.body.getBoundingClientRect();
    if (!width || newW !== width) setWidth(newW);
    if (!height || newH !== height) setHeight(newH);
  };

  useEffect(() => {
    listener();
  }, []);

  useEffect(() => {
    window.addEventListener('resize', listener);
    return () => {
      window.removeEventListener('resize', listener);
    };
  });

  return {
    width,
    height,
  };
}
