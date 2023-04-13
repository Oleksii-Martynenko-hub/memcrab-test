
import { useState, useEffect } from "react";
import { useResize } from "./useResize";
import { useScroll } from "./useScroll";

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
  const { scrollLeft, scrollTop } = useScroll(element)
  const { width, height } = useResize()

  const [extraRows] = useState(5)
  const [extraCols] = useState(3)
  const [topIndex, setTopIndex] = useState(0)
  const [bottomIndex, setBottomIndex] = useState(0)
  const [leftIndex, setLeftIndex] = useState(0)
  const [rightIndex, setRightIndex] = useState(0)

  useEffect(() => {
    const startRowIndex = Math.floor(scrollTop/heightItem) - extraRows
    const visableRowsQuantity = Math.floor((height - offsetY) / heightItem)

    setTopIndex(startRowIndex)
    setBottomIndex(startRowIndex + visableRowsQuantity + extraRows * 2)

    const startColsIndex = Math.floor(scrollLeft/widthItem) - extraCols
    const visableColsQuantity = Math.floor((width - offsetX) / widthItem)

    setLeftIndex(startColsIndex)
    setRightIndex(startColsIndex + visableColsQuantity + extraCols * 2)

  }, [width, height, scrollTop, scrollLeft]);

  return {
    topIndex,
    bottomIndex,
    leftIndex,
    rightIndex
  };
}