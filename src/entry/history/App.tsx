import React, { useCallback, useEffect, useState } from 'react';
import { useEffectOnce } from '../../public/react-use';
import { getMessage } from '../../public/i18n';
import Logo from '../../components/Logo';
import IconFont from '../../components/IconFont';
import { TRANSLATION_HISTORY_STORAGE_KEY } from '../../constants/translationHistoryStorage';
import type { TranslateHistoryItem } from '../../redux/slice/translateHistorySlice';
import TranslateResult from '../../components/TranslateResult';
import ListenButton from '../../components/ListenButton';
import SourceFavicon from '../../components/SourceFavicon';

const loadList = (): Promise<TranslateHistoryItem[]> => new Promise((resolve) => {
    chrome.storage.local.get(TRANSLATION_HISTORY_STORAGE_KEY, (data) => {
        const list = data[TRANSLATION_HISTORY_STORAGE_KEY];
        resolve(Array.isArray(list) ? list : []);
    });
});

const HistoryApp: React.FC = () => {
    const [items, setItems] = useState<TranslateHistoryItem[]>([]);
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    const refresh = useCallback(() => {
        loadList().then(setItems);
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);

    useEffect(() => {
        const onStorage: Parameters<typeof chrome.storage.onChanged.addListener>[0] = (changes, area) => {
            if (area === 'local' && TRANSLATION_HISTORY_STORAGE_KEY in changes) {
                const nv = changes[TRANSLATION_HISTORY_STORAGE_KEY].newValue;
                setItems(Array.isArray(nv) ? nv : []);
            }
        };
        chrome.storage.onChanged.addListener(onStorage);
        return () => chrome.storage.onChanged.removeListener(onStorage);
    }, []);

    useEffectOnce(() => {
        chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
            if (request === 'Are you history page?') {
                chrome.tabs.getCurrent().then((tab) => {
                    if (tab) {
                        sendResponse({ tabId: tab.id, windowId: tab.windowId });
                        refresh();
                    }
                    else {
                        sendResponse(null);
                    }
                });

                return true;
            }
        });
    });

    const removeItem = (translateId: number) => {
        chrome.storage.local.get(TRANSLATION_HISTORY_STORAGE_KEY, (data) => {
            const list: TranslateHistoryItem[] = Array.isArray(data[TRANSLATION_HISTORY_STORAGE_KEY])
                ? data[TRANSLATION_HISTORY_STORAGE_KEY]
                : [];
            const idx = list.findIndex((i) => i.translateId === translateId);
            if (idx < 0) { return; }

            const next = [...list.slice(0, idx), ...list.slice(idx + 1)];
            chrome.storage.local.set({ [TRANSLATION_HISTORY_STORAGE_KEY]: next });
        });
    };

    return (
        <div className='history-page'>
            <div className='history-page__navbar'>
                <div className='main-title flex-align-items-center'>
                    <Logo style={{ fontSize: '30px', marginRight: '10px' }} />
                    {getMessage('historyTitle')}
                </div>
            </div>
            <div className='history-page__body scrollbar'>
                {items.length === 0 ? (
                    <div className='history-page__empty'>{getMessage('contentNoRecord')}</div>
                ) : (
                    items.map((item, index) => (
                        <div key={`${item.translateId}-${index}`} className='history-page__item'>
                            <div
                                className='history-page__item-head'
                                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                            >
                                <div className='history-page__item-text'>{item.text}</div>
                                <div className='history-page__item-result'>{item.result}</div>
                                <IconFont
                                    className='iconbutton button history-page__item-remove'
                                    iconName='#icon-GoX'
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeItem(item.translateId);
                                        if (expandedIndex === index) { setExpandedIndex(null); }
                                    }}
                                />
                            </div>
                            {expandedIndex === index && (
                                <div className='history-page__item-detail scrollbar'>
                                    {item.translations.map(({ source, translateRequest }) => (
                                        <div className='mt-result' key={source}>
                                            <div className='mt-result__head flex-justify-content-space-between'>
                                                <span className='mt-result__head__left'>
                                                    <SourceFavicon source={source} className='mt-result__head__badge' />
                                                    {translateRequest.status === 'finished' && <>
                                                        <IconFont
                                                            className='iconbutton button'
                                                            iconName='#icon-copy'
                                                            style={{ marginLeft: '5px' }}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                navigator.clipboard.writeText(translateRequest.result.text);
                                                            }}
                                                        />
                                                        <ListenButton
                                                            text={translateRequest.result.text}
                                                            source={source}
                                                            from={translateRequest.result.from}
                                                        />
                                                    </>}
                                                </span>
                                            </div>
                                            <div className='dividing-line'></div>
                                            <TranslateResult
                                                translateRequest={translateRequest}
                                                source={source}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default HistoryApp;
