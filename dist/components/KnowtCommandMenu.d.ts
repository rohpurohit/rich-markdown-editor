import * as React from "react";
import { EditorView } from "prosemirror-view";
import { EmbedDescriptor, MenuItem, MenuPosition, GroupMenuItem } from "../types";
import baseDictionary from "../dictionary";
export declare type Props<T extends MenuItem = MenuItem> = {
    rtl: boolean;
    isActive: boolean;
    commands: Record<string, any>;
    dictionary: typeof baseDictionary;
    view: EditorView;
    search: string;
    uploadImage?: (file: File) => Promise<string>;
    onImageUploadStart?: () => void;
    onImageUploadStop?: () => void;
    onShowToast?: (message: string, id: string) => void;
    onLinkToolbarOpen?: () => void;
    onClose: () => void;
    onClearSearch: () => void;
    embeds?: EmbedDescriptor[];
    renderMenuItem: (item: T, index: number, options: {
        selected: boolean;
        onClick: () => void;
    }) => React.ReactNode;
    renderGroupMenuItem: (item: GroupMenuItem<T>, index: number, callback: (ref: HTMLDivElement) => void, options: {
        selected: boolean;
        onClick: () => void;
    }) => React.ReactNode;
    filterable?: boolean;
    items: T[];
    groupedItems: GroupMenuItem<T>[];
    id?: string;
};
declare type State = {
    insertItem?: EmbedDescriptor;
    selectedIndex: number;
    nestedSelectedIndex: number | null;
    menu1Position: MenuPosition;
    menu2Position: MenuPosition;
    nestedMenuOpen: boolean;
    activeGroup: GroupMenuItem;
};
declare class KnowtCommandMenu<T = MenuItem> extends React.Component<Props<T>, State> {
    menuRef: React.RefObject<HTMLDivElement>;
    nestedMenuRef: React.RefObject<HTMLDivElement>;
    inputRef: React.RefObject<HTMLInputElement>;
    groupItemsRef: HTMLDivElement[];
    state: State;
    constructor(props: Props<T>);
    componentDidMount(): void;
    shouldComponentUpdate(nextProps: Props<T>, nextState: State): boolean;
    componentDidUpdate(prevProps: Props<T>): void;
    componentWillUnmount(): void;
    handleKeyDown: (e: KeyboardEvent) => void;
    insertItem: (item: EmbedDescriptor) => void;
    close: () => void;
    closeNestedMenu(): void;
    handleLinkInputKeydown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    handleLinkInputPaste: (event: React.ClipboardEvent<HTMLInputElement>) => void;
    triggerImagePick: () => void;
    triggerLinkInput: (item: EmbedDescriptor) => void;
    handleImagePicked: (event: any) => void;
    clearSearch: () => void;
    insertBlock(item: any): void;
    getCaretPosition(): {
        top: number;
        left: number;
    };
    onGroupSelect(index: number): void;
    calculatePosition(props: Props<T>): MenuPosition;
    get filtered(): GroupMenuItem[];
    render(): JSX.Element;
}
export declare const Wrapper: import("styled-components").StyledComponent<"div", any, {
    active: boolean;
    top?: number | undefined;
    bottom?: number | undefined;
    left?: number | undefined;
    isAbove: boolean;
}, never>;
export default KnowtCommandMenu;
//# sourceMappingURL=KnowtCommandMenu.d.ts.map