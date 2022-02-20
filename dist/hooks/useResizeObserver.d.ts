import { RefObject } from "react";
export interface ResizeObserverEntry {
    target: HTMLElement;
    contentRect: DOMRectReadOnly;
}
export default function useResizeObserver(ref: RefObject<HTMLElement>, callback: (entry: DOMRectReadOnly) => void): void;
//# sourceMappingURL=useResizeObserver.d.ts.map