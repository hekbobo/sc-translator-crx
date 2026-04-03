import * as types from '../../constants/chromeSendMessageTypes';
import { translate, audio, detect } from '../../public/request';
import { createSeparateWindow } from './separate-window';
import scIndexedDB, { DB_STORE_COLLECTION } from '../../public/sc-indexed-db';
import {
    AudioResponse,
    ChromeRuntimeMessage,
    DetectResponse,
    GetAllCollectedTextResponse,
    GetCollectedByTextResponse,
    GetSelectorsResponse,
    I18nDetectLanguageResponse,
    IsCollectResponse,
    TranslateResponse
} from '../../public/send';
import { getSpecifySelectors } from './page-translation-rule';
import scOptions from '../../public/sc-options';

type TypedSendResponse = (
    response: TranslateResponse | AudioResponse | DetectResponse | IsCollectResponse | GetSelectorsResponse | GetAllCollectedTextResponse | GetCollectedByTextResponse | I18nDetectLanguageResponse
) => void;

chrome.runtime.onMessage.addListener((message: ChromeRuntimeMessage, sender, sendResponse: TypedSendResponse) => {
    switch (message.type) {
        case types.SCTS_TRANSLATE: {
            scOptions.get(['useDotCn', 'preferredLanguage', 'secondPreferredLanguage'])
                .then(({ useDotCn, ...preferred }) => (translate({ ...message.payload, com: !useDotCn, ...preferred })))
                .then(sendResponse);

            return true;
        }
        case types.SCTS_AUDIO: {
            scOptions.get(['useDotCn'])
                .then(({ useDotCn }) => (audio({ ...message.payload, com: !useDotCn })))
                .then(sendResponse);

            return true;
        }
        case types.SCTS_DETECT: {
            scOptions.get(['useDotCn'])
                .then(({ useDotCn }) => (detect({ ...message.payload, com: !useDotCn })))
                .then(sendResponse);

            return true;
        }
        case types.SCTS_I18N_DETECT_LANGUAGE: {
            const { text } = message.payload;
            chrome.i18n.detectLanguage(text, (result) => {
                if (chrome.runtime.lastError) {
                    sendResponse({ code: chrome.runtime.lastError.message ?? 'I18N_DETECT_FAILED' });
                    return;
                }
                sendResponse({ languages: result.languages, isReliable: result.isReliable });
            });

            return true;
        }
        case types.SCTS_SEND_TEXT_TO_SEPARATE_WINDOW: {
            const { text } = message.payload;

            text && createSeparateWindow(text);

            return false;
        }
        case types.SCTS_IS_COLLECTED: {
            let { text } = message.payload;

            text = text.trimStart().trimEnd();

            if (text) {
                scIndexedDB.get(DB_STORE_COLLECTION, text)
                    .then(value => sendResponse({ text: message.payload.text, isCollected: !!value }))
                    .catch(() => sendResponse({ code: '' }));
            }
            else {
                sendResponse({ code: 'EMPTY_TEXT' });
            }

            return true;
        }
        case types.SCTS_ADD_TO_COLLECTION: {
            let { text, translations } = message.payload;

            text = text.trimStart().trimEnd();

            text && scIndexedDB.get(DB_STORE_COLLECTION, text).then((value) => {
                if (value) {
                    const translationMap = new Map([...value.translations, ...translations].map((v) => ([v.source, v.translateRequest])));

                    const nextTranslations: typeof value.translations = [...translationMap.entries()].map(([k, v]) => ({ source: k, translateRequest: v }));

                    scIndexedDB.add(DB_STORE_COLLECTION, { ...value, date: Number(new Date()), translations: nextTranslations });
                }
                else {
                    scIndexedDB.add(DB_STORE_COLLECTION, { text, date: Number(new Date()), translations });
                }
            });

            return false;
        }
        case types.SCTS_REMOVE_FROM_COLLECTION: {
            let { text } = message.payload;

            text = text.trimStart().trimEnd();

            text && scIndexedDB.delete(DB_STORE_COLLECTION, text);

            return false;
        }
        case types.SCTS_GET_SPECIFY_SELECTORS: {
            const { hostAndPathname } = message.payload;

            getSpecifySelectors(hostAndPathname).then(data => sendResponse(data));

            return true;
        }
        case types.SCTS_GET_ALL_COLLECTED_TEXT: {
            scIndexedDB.getAllKeys('collection').then(data => sendResponse(data as string[]));

            return true;
        }
        case types.SCTS_GET_COLLECTED_BY_TEXT: {
            const { text } = message.payload;

            scIndexedDB.get('collection', text).then((data) => {
                if (data) {
                    sendResponse({ translations: data.translations });
                }
                else {
                    sendResponse({ code: 'NOT_COLLECTED' });
                }
            }).catch(() => sendResponse({ code: '' }));

            return true;
        }
        default: return;
    }
});