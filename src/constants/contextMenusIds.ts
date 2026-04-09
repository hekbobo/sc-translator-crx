import { OptionsContextMenu } from "../types";

export const TRANSLATE_SELECTION_TEXT = 'TRANSLATE_SELECTION_TEXT';
export const LISTEN_SELECTION_TEXT = 'LISTEN_SELECTION_TEXT';
export const TRANSLATE_CURRENT_PAGE = 'TRANSLATE_CURRENT_PAGE';

export const defaultContextMenus: OptionsContextMenu[] = [
    { id: LISTEN_SELECTION_TEXT, enabled: false },
    { id: TRANSLATE_CURRENT_PAGE, enabled: true }
];

export const contextMenusContexts: { [key: string]: [`${chrome.contextMenus.ContextType}`, ...`${chrome.contextMenus.ContextType}`[]] } = {
    TRANSLATE_SELECTION_TEXT: ['selection'],
    LISTEN_SELECTION_TEXT: ['selection'],
    TRANSLATE_CURRENT_PAGE: ['page']
};
