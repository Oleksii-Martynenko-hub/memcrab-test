
import { useState, useEffect } from "react";

export function useScroll(element: HTMLElement | null) {
  const [scrollTop, setScrollTop] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  const listener = () => {
    if (element === null) return;
    const {top, left } = element.getBoundingClientRect()
    setScrollTop(Math.abs(top));
    setScrollLeft(Math.abs(left));
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
  };
}