import { useLayoutEffect, useCallback, RefObject } from "react";
import ResizeObserver from "resize-observer-polyfill";

export interface ResizeObserverEntry {
  target: HTMLElement;
  contentRect: DOMRectReadOnly;
}

export default function useResizeObserver(
  ref: RefObject<HTMLElement>,
  callback: (entry: DOMRectReadOnly) => void
): void {
  const handleResize = useCallback(
    (entries: ResizeObserverEntry[]) => {
      if (!Array.isArray(entries)) {
        return;
      }

      const entry = entries[0];
      callback(entry.contentRect);
    },
    [callback]
  );

  useLayoutEffect(() => {
    if (!ref.current) {
      return;
    }

    const RO = new ResizeObserver((entries: ResizeObserverEntry[]) => {
      return handleResize(entries);
    });

    RO.observe(ref.current);

    return () => {
      RO.disconnect();
    };
  }, []);
}
