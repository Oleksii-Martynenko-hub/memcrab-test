
import { useState, useEffect } from "react";

import { useTimeout } from "./useTimeout";

export function useScroll(element: HTMLElement | null) {
  const [scrollTop, setScrollTop] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)

  const [reset] = useTimeout(() => setIsScrolling(false), 500)

  const listener = () => {
    if (element === null) return;
    const {top, left } = element.getBoundingClientRect()
    setScrollTop(Math.abs(top));
    setScrollLeft(Math.abs(left));
    if (scrollTop !== top || scrollLeft !== left) {
      setIsScrolling(true)
      reset()
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", listener);
    return () => {
      window.removeEventListener("scroll", listener);
    };
  });

  return {
    scrollTop,
    scrollLeft,
    isScrolling
  };
}