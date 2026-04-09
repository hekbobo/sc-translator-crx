import { Middleware } from '@reduxjs/toolkit';
import { TRANSLATION_HISTORY_STORAGE_KEY } from '../../constants/translationHistoryStorage';
import {
    addHistory,
    removeHistory,
    replaceHistory,
    updateHistoryError,
    updateHistoryFinish
} from '../slice/translateHistorySlice';

export const translateHistoryPersistMiddleware: Middleware = (store) => (next) => (action) => {
    if (replaceHistory.match(action)) {
        return next(action);
    }

    const result = next(action);

    if (
        addHistory.match(action) ||
        updateHistoryFinish.match(action) ||
        updateHistoryError.match(action) ||
        removeHistory.match(action)
    ) {
        const list = store.getState().translateHistory;
        chrome.storage.local.set({ [TRANSLATION_HISTORY_STORAGE_KEY]: list });
    }

    return result;
};
