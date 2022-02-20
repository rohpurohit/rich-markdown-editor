"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const resize_observer_polyfill_1 = __importDefault(require("resize-observer-polyfill"));
function useResizeObserver(ref, callback) {
    const handleResize = react_1.useCallback((entries) => {
        if (!Array.isArray(entries)) {
            return;
        }
        const entry = entries[0];
        callback(entry.contentRect);
    }, [callback]);
    react_1.useLayoutEffect(() => {
        if (!ref.current) {
            return;
        }
        const RO = new resize_observer_polyfill_1.default((entries) => {
            return handleResize(entries);
        });
        RO.observe(ref.current);
        return () => {
            RO.disconnect();
        };
    }, []);
}
exports.default = useResizeObserver;
//# sourceMappingURL=useResizeObserver.js.map