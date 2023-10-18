import { useState, useEffect } from 'react';

import { useResize } from './useResize';
import { useScroll } from './useScroll';
import { useTimeout } from './useTimeout';

interface UseVirtualize {
  element: HTMLElement | null;
  widthItem: number;
  heightItem: number;
  offsetX: number;
  offsetY: number;
}

export function useVirtualize({
  element,
  widthItem,
  heightItem,
  offsetY,
  offsetX,
}: UseVirtualize) {
  const [extraRows] = useState(6);
  const [extraCols] = useState(4);

  const [topIndex, setTopIndex] = useState(0);
  const [bottomIndex, setBottomIndex] = useState(0);
  const [leftIndex, setLeftIndex] = useState(0);
  const [rightIndex, setRightIndex] = useState(0);

  const [isScrolling, setIsScrolling] = useState(false);

  const [reset] = useTimeout(() => setIsScrolling(false), 300);
  const { scrollLeft, scrollTop } = useScroll();
  const { width, height } = useResize();

  useEffect(() => {
    setIsScrolling(true);
    reset();
  }, [scrollTop, scrollLeft]);

  useEffect(() => {
    const startRowIndex = Math.floor(scrollTop / heightItem) - extraRows;
    const visibleRowsQuantity = Math.floor((height - offsetY) / heightItem);

    setTopIndex(startRowIndex < 0 ? 0 : startRowIndex);
    setBottomIndex(startRowIndex + visibleRowsQuantity + extraRows * 2);

    const startColsIndex = Math.floor(scrollLeft / widthItem) - extraCols;
    const visibleColsQuantity = Math.floor((width - offsetX) / widthItem);

    setLeftIndex(startColsIndex < 0 ? 0 : startColsIndex);
    setRightIndex(startColsIndex + visibleColsQuantity + extraCols * 2);
  }, [width, height, scrollTop, scrollLeft]);

  return {
    topIndex,
    bottomIndex,
    leftIndex,
    rightIndex,
    isScrolling,
  };
}
