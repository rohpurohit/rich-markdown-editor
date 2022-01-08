/// <reference types="react" />
declare const _default: {
    title: string;
    keywords: string;
    searchKeyword: string;
    icon: () => JSX.Element;
    matcher: (url: any) => any;
    component: ({ attrs, isSelected, }: {
        attrs: any;
        isSelected: any;
    }) => import("react").ReactElement<{
        attrs: any;
        isSelected: boolean;
    }, string | ((props: any) => import("react").ReactElement<any, any> | null) | (new (props: any) => import("react").Component<any, any, any>)>;
}[];
export default _default;
//# sourceMappingURL=index.d.ts.map