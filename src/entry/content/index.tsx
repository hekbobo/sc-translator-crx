import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import TsBtn from '../../components/TsBtn';
import ResultBox from './ResultBox';
import { Provider } from 'react-redux';
import store from '../../redux/store';
import { initTranslation } from '../../redux/init';
import '../../styles/global.css';
import { appendColorVarsStyle, appendFontSizeStyle } from '../../public/inject-style';
import WebPageTranslate from './WebPageTranslate';
import scOptions from '../../public/sc-options';
import { TRANSLATION_HISTORY_STORAGE_KEY } from '../../constants/translationHistoryStorage';
import { replaceHistory } from '../../redux/slice/translateHistorySlice';
import type { TranslateHistoryItem } from '../../redux/slice/translateHistorySlice';

chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== 'local' || !(TRANSLATION_HISTORY_STORAGE_KEY in changes)) { return; }

    const next = changes[TRANSLATION_HISTORY_STORAGE_KEY].newValue;
    if (Array.isArray(next)) {
        store.dispatch(replaceHistory(next as TranslateHistoryItem[]));
    }
});

Promise.all([
    scOptions.init(),
    new Promise<Record<string, unknown>>((resolve) => {
        chrome.storage.local.get(TRANSLATION_HISTORY_STORAGE_KEY, resolve);
    })
]).then(([options, stored]) => {
    initTranslation({
        sourceList: options.multipleTranslateSourceList,
        from: options.multipleTranslateFrom,
        to: options.multipleTranslateTo
    });

    const raw = stored[TRANSLATION_HISTORY_STORAGE_KEY];
    if (Array.isArray(raw)) {
        store.dispatch(replaceHistory(raw as TranslateHistoryItem[]));
    }

    const root = document.createElement('div');
    root.id = 'sc-translator-shadow';
    root.setAttribute('style', 'all: initial;');
    document.documentElement.appendChild(root);

    const shadowRoot = root.attachShadow({ mode: 'open' });

    const contentStyle = document.createElement('link');
    contentStyle.rel = 'stylesheet';
    contentStyle.href = chrome.runtime.getURL('/static/css/content.css');
    shadowRoot.appendChild(contentStyle);

    appendColorVarsStyle(shadowRoot);
    appendFontSizeStyle(shadowRoot);

    const rootWrapper = document.createElement('div');
    rootWrapper.setAttribute('style', 'all: initial;');
    shadowRoot.appendChild(rootWrapper);

    const rootElement = document.createElement('div');
    rootElement.id = 'sc-translator-root';
    rootWrapper.appendChild(rootElement);

    const enableWebpageTranslation = chrome.runtime.getURL('') !== `${window.origin}/`;

    contentStyle.onload = () => ReactDOMClient.createRoot(rootElement).render(
        <Provider store={store}>
            <TsBtn />
            <ResultBox />
            {enableWebpageTranslation && <WebPageTranslate />}
        </Provider>
    );
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request === 'Are you enabled?') sendResponse({ host: window.location.host });
});