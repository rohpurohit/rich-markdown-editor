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
    renderMenuItem: (item: MenuItem, index: number, options: {
        selected: boolean;
        onClick: () => void;
    }) => React.ReactNode;
    renderGroupMenuItem: (item: GroupMenuItem, index: number, callback: (ref: HTMLDivElement) => void, options: {
        selected: boolean;
        onClick: () => void;
    }) => React.ReactNode;
    filterable?: boolean;
    items: MenuItem[];
    groupedItems: GroupMenuItem[];
    id?: string;
};
declare type State = {
    insertItem?: EmbedDescriptor;
    selectedIndex: number;
    nestedSelectedIndex: number | null;
    menu1Position: MenuPosition;
    menu2Position: MenuPosition;
    nestedMenuOpen: boolean;
    activeGroup: GroupMenuItem | null;
};
declare class KnowtCommandMenu extends React.Component<Props, State> {
    menuRef: React.RefObject<HTMLDivElement>;
    nestedMenuRef: React.RefObject<HTMLDivElement>;
    inputRef: React.RefObject<HTMLInputElement>;
    groupItemsRef: HTMLDivElement[];
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
    onGroupSelect(index: number): void;
    calculatePosition(props: Props): MenuPosition;
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