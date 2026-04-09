import { configureStore } from '@reduxjs/toolkit';
import panelStatus from '../slice/panelStatusSlice';
import translateHistory from '../slice/translateHistorySlice';
import translation from '../slice/translationSlice';
import { translateHistoryPersistMiddleware } from '../middleware/translateHistoryPersistMiddleware';

const store = configureStore({
    reducer: {
        panelStatus,
        translateHistory,
        translation
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(translateHistoryPersistMiddleware)
});

export const getDispatch = () => store.dispatch;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;