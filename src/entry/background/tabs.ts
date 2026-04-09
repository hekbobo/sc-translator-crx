import { getCurrentTabHost } from '../../public/utils';

const onTabsUpdated: (tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab) => void = async (tabId, changeInfo, tab) => {
    if (!tab.active) { return; }

    updateBadge(tabId);
};

const onTabsActivated: (activeInfo: chrome.tabs.TabActiveInfo) => void = async ({ tabId }) => {
    updateBadge(tabId);
};

const updateBadge = async (tabId?: number) => {
    const tabHost = await getCurrentTabHost(tabId);

    const enabled = !!tabHost;

    chrome.action.setIcon({ path: { 128: `/image/icon${enabled ? '' : '-gray'}-128.png` } });
};

chrome.tabs.onUpdated.addListener(onTabsUpdated);
chrome.tabs.onActivated.addListener(onTabsActivated);
