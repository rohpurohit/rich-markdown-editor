import Mark from "../Mark";
export default class GreenHighlight extends Mark {
    get name(): string;
    get schema(): {
        attrs: {
            color: {
                default: string;
            };
        };
        excludes: string;
        group: string;
        parseDOM: ({
            tag: string;
            getAttrs: (node: any) => boolean;
            style?: undefined;
        } | {
            style: string;
            getAttrs: (value: any) => boolean;
            tag?: undefined;
        })[];
        toDOM: () => (string | {
            class: string;
        })[];
    };
    inputRules({ type }: {
        type: any;
    }): import("prosemirror-inputrules").InputRule<any>[];
    keys({ type }: {
        type: any;
    }): {};
    commands({ type }: {
        type: any;
    }): () => (state: import("prosemirror-state").EditorState<any>, dispatch?: ((tr: import("prosemirror-state").Transaction<any>) => void) | undefined) => boolean;
    get rulePlugins(): ((md: any) => void)[];
    get toMarkdown(): {
        open: string;
        close: string;
        mixable: boolean;
        expelEnclosingWhitespace: boolean;
    };
    parseMarkdown(): {
        mark: string;
    };
}
//# sourceMappingURL=GreenHighlight.d.ts.map