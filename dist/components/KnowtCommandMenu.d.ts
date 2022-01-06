import * as React from "react";
import { EditorView } from "prosemirror-view";
import { EmbedDescriptor, MenuItem, MenuPosition, GroupMenuItem } from "../types";
import baseDictionary from "../dictionary";
export declare type Props = {
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
    renderMenuItem: (item: MenuItem, index: number, callback: (ref: HTMLDivElement) => void, options: {
        selected: boolean;
        isSearch: boolean;
        onClick: () => void;
    }) => React.ReactNode;
    renderGroupMenuItem: (item: GroupMenuItem, index: number, callback: (ref: HTMLDivElement) => void, options: {
        selected: boolean;
        onClick: () => void;
    }) => React.ReactNode;
    filterable?: boolean;
    allGroups: GroupMenuItem[];
    visibleGroups: GroupMenuItem[];
    id?: string;
};
declare type State = {
    menu1Position: MenuPosition;
    menu2Position: MenuPosition;
    menu1MaxHeight: number;
    insertItem?: EmbedDescriptor;
    selectedIndex: number;
    nestedSelectedIndex: number | null;
    searchItemsSelectedIndex: number;
    nestedMenuOpen: boolean;
};
declare class KnowtCommandMenu extends React.Component<Props, State> {
    menuRef: React.RefObject<HTMLDivElement>;
    listRef: React.RefObject<HTMLOListElement>;
    inputRef: React.RefObject<HTMLInputElement>;
    menuTitleRef: React.RefObject<HTMLDivElement>;
    primaryItemsRef: HTMLDivElement[];
    state: State;
    constructor(props: Props);
    componentDidMount(): void;
    shouldComponentUpdate(nextProps: Props, nextState: State): boolean;
    componentDidUpdate(prevProps: Props): void;
    componentWillUnmount(): void;
    handleKeyDown: (e: KeyboardEvent) => void;
    insertItem: (item: MenuItem | EmbedDescriptor) => void;
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
    onGroupSelect(groupIndex: number): void;
    updateMenu2Position(groupIndex: number): void;
    updateMenu1Position(): void;
    updateSearchMenuMaxHeight(): void;
    getMenu1InitialPosition(): MenuPosition;
    getMenu2Height(groupIndex: number): number;
    getSearchMenuHeight(): number;
    getGroupHeight(group: GroupMenuItem): number;
    get filtered(): GroupMenuItem[];
    renderGroups(): React.ReactNode;
    renderSearchResults(): React.ReactNode;
    render(): JSX.Element;
}
export declare const Wrapper: import("styled-components").StyledComponent<"div", any, {
    active: boolean;
    top?: number | undefined;
    bottom?: number | undefined;
    left?: number | undefined;
    isAbove?: boolean | undefined;
}, never>;
export default KnowtCommandMenu;
//# sourceMappingURL=KnowtCommandMenu.d.ts.map