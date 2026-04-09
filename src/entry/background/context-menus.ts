import { getIsContentScriptEnabled, openCollectionPage, openHistoryPage } from '../../public/utils';
import {
    contextMenusContexts,
    defaultContextMenus,
    LISTEN_SELECTION_TEXT,
    TRANSLATE_CURRENT_PAGE,
    TRANSLATE_SELECTION_TEXT
} from '../../constants/contextMenusIds';
import { OptionsContextMenu } from '../../types';
import { sendTabsAudioCommandKeyPressed, sendTabsContextMenusClicked, sendTabsTranslateCurrentPage } from '../../public/send';
import scOptions from '../../public/sc-options';
import { getMessage } from '../../public/i18n';

const openPopupTabWithText = (text: string) => {
    chrome.tabs.create({
        url: `${chrome.runtime.getURL('popup.html')}?text=${encodeURIComponent(text)}`
    });
};

type OnContextMenuClick = (info: chrome.contextMenus.OnClickData, tab?: chrome.tabs.Tab | undefined) => void;

const translateSelectionText: OnContextMenuClick = async ({ selectionText }, tab) => {
    if (!selectionText) { return; }

    if (tab?.id !== undefined && tab.id >= 0) {
        const enabled = await getIsContentScriptEnabled(tab.id);

        if (enabled) {
            sendTabsContextMenusClicked(tab.id, selectionText);
        }
        else {
            openPopupTabWithText(selectionText);
        }
    }
    else {
        openPopupTabWithText(selectionText);
    }
};

const listenSelectionText: OnContextMenuClick = async ({ selectionText }, tab) => {
    if (!selectionText) { return; }

    if (tab?.id !== undefined && tab.id >= 0) {
        const enabled = await getIsContentScriptEnabled(tab.id);
        enabled && sendTabsAudioCommandKeyPressed(tab.id);
    }
};

const translateCurrentPage: OnContextMenuClick = (info, tab) => {
    tab?.id !== undefined && tab.id >= 0 && sendTabsTranslateCurrentPage(tab.id);
};

const updateContextMenus = (contextMenus: OptionsContextMenu[]) => {
    const validIds = new Set(defaultContextMenus.map(v => v.id));
    contextMenus = contextMenus.filter(v => validIds.has(v.id));

    // To fix the issue of context menus disappear after opening incognito page.
    // Replace chrome.contextMenus.removeAll() with the below codes.
    // Also, there is a better way, using contextMenus' visible.
    // But I don't want the wrapper even there is only a single context menu.
    // Will be switch to "contextMenus' visible" if the below way cause bugs.
    contextMenus.forEach((contextMenu) => {
        chrome.contextMenus.remove(contextMenu.id, () => {
            // Catch the "Cannot find menu item with id" error, and ignore it.
            if (chrome.runtime.lastError) {}

            if (contextMenu.enabled) {
                chrome.contextMenus.create({
                    id: contextMenu.id,
                    title: getMessage(`contextMenus_${contextMenu.id}`),
                    contexts: contextMenusContexts[contextMenu.id]
                }, () => {
                    // Catch the "Cannot create item with duplicate id" error, and ignore it.
                    if (chrome.runtime.lastError) {}
                });
            }
        });
    });
};

export const initContextMenus = () => {
    chrome.contextMenus.removeAll(() => {
        chrome.contextMenus.create({
            id: 'action_translate_current_page',
            title: getMessage('contextMenus_TRANSLATE_CURRENT_PAGE'),
            contexts: ['action']
        }, () => { if (chrome.runtime.lastError) {} });

        chrome.contextMenus.create({
            id: 'action_open_collection_page',
            title: getMessage('popupOpenCollectionPage'),
            contexts: ['action']
        }, () => { if (chrome.runtime.lastError) {} });

        chrome.contextMenus.create({
            id: 'action_open_history_page',
            title: getMessage('popupOpenHistoryPage'),
            contexts: ['action']
        }, () => { if (chrome.runtime.lastError) {} });

        scOptions.get(['contextMenus']).then(options => updateContextMenus(options.contextMenus));
    });
};

chrome.contextMenus.onClicked.addListener((info, tab) => {
    switch (info.menuItemId) {
        case TRANSLATE_SELECTION_TEXT:
            translateSelectionText(info, tab);
            return;
        case LISTEN_SELECTION_TEXT:
            listenSelectionText(info, tab);
            return;
        case TRANSLATE_CURRENT_PAGE:
            translateCurrentPage(info, tab);
            return;
        case 'action_translate_current_page':
            translateCurrentPage(info, tab);
            return;
        case 'action_open_collection_page':
            openCollectionPage();
            return;
        case 'action_open_history_page':
            openHistoryPage();
            return;
        default: return;
    }
});

chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== 'local') { return; }

    if ('contextMenus' in changes) {
        updateContextMenus(changes['contextMenus'].newValue);
    }
});
