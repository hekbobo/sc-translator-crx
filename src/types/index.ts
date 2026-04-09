import { StyleVarsList } from "../constants/defaultStyleVars";
import { SourceParams } from "../constants/sourceParams";

declare global {
    interface Window {
        Translator: Translator;
        LanguageDetector: LanguageDetector;
    }
}

interface Translator {
    availability: (params: { sourceLanguage: string; targetLanguage: string; }) => Promise<'unavailable' | 'downloadable' | 'downloading' | 'available'>;
    create: (params: { sourceLanguage: string; targetLanguage: string; monitor?: (monitor: EventTarget) => void; }) => Promise<Translator>;
    translate: (input: string) => Promise<string>;
    destroy: () => void;
    ready: Promise<void>;
};

interface LanguageDetector {
    availability: (expectedInputLanguages?: string[]) => Promise<'unavailable' | 'downloadable' | 'downloading' | 'available'>;
    create: (params?: { monitor?: (monitor: EventTarget) => void; }) => Promise<LanguageDetector>;
    detect: (input: string) => Promise<{ detectedLanguage: string; confidence: number; }[]>;
    destroy: () => void;
    ready: Promise<void>;
}

export type GetStorageKeys<T extends keyof DefaultOptions> = T[];

export type TranslateResult = {
    text: string;
    from: string;
    to: string;
    result: string[];
    dict?: string[];
    phonetic?: string;
    related?: string[];
    example?: string[];
};

export type TranslateRequestInit = {
    status: 'init';
}

export type TranslateRequestLoading = {
    status: 'loading';
}

export type TranslateRequestFinished = {
    status: 'finished';
    result: TranslateResult;
}

export type TranslateRequestError = {
    status: 'error';
    errorCode: string;
}

export type TranslateRequest = TranslateRequestInit | TranslateRequestLoading | TranslateRequestFinished | TranslateRequestError;

export type Translation = {
    source: string;
    translateRequest: TranslateRequest;
};

export type Position = {
    x: number;
    y: number;
};

export type OptionsContextMenuId =
    | 'TRANSLATE_SELECTION_TEXT'
    | 'LISTEN_SELECTION_TEXT'
    | 'TRANSLATE_CURRENT_PAGE';
export type OptionsContextMenu = { id: OptionsContextMenuId; enabled: boolean };

export type TextPreprocessingRegExp = { pattern: string; flags: string; replacement: string };
export type TextPreprocessingPreset = { convertCamelCase: boolean };

export type TranslateButtonsTL = {
    first: string;
    second: string;
    third: string;
};

export type CustomTranslateSource = {
    name: string;
    url: string;
    source: string;
};

export type DisplayOfTranslation = {
    result: boolean;
    dict: boolean;
    phonetic: boolean;
    related: boolean;
    example: boolean;
    phonetic_nonEnglish: boolean;
    maintainParagraphStructure: boolean;
    sourceLanguage: boolean;
};

export type DisplayModeEnhancement = {
    o_Hovering: boolean;
    oAndT_Underline: boolean;
    oAndT_NonDiscrete: boolean;
    oAndT_paragraphWrap: boolean;
    oAndT_hideSameLanguage: boolean;
    t_Hovering: boolean;
    t_hoveringWithKeyPressing: boolean;
};

export type ComparisonCustomization = {
    color: string;
    underlineColor: string;
    underlineStyle: string;
};

export type DefaultOptions = {
    userLanguage: string;
    translateDirectly: boolean;
    translateBlackListMode: boolean;
    translateHostList: string[];
    historyBlackListMode: boolean;
    historyHostList: string[];
    defaultAudioSource: string;
    translateWithKeyPress: boolean;
    useDotCn: boolean;
    /** When true, only translate if source language is English (selection / popup). */
    translateEnglishOnly: boolean;
    multipleTranslateSourceList: string[];
    multipleTranslateFrom: string;
    multipleTranslateTo: string;
    preferredLanguage: string;
    secondPreferredLanguage: string;
    styleVarsList: StyleVarsList;
    styleVarsIndex: number;
    audioVolume: number;
    audioPlaybackRate: number;
    translatePanelMaxHeight: { percentage: boolean; px: number; percent: number };
    translatePanelWidth: { percentage: boolean; px: number; percent: number };
    translatePanelFontSize: number;
    recentTranslateFromList: string[];
    recentTranslateToList: string[];
    doNotRespondInTextBox: boolean;
    autoTranslateAfterInput: boolean;
    contextMenus: OptionsContextMenu[];
    textPreprocessingRegExpList: TextPreprocessingRegExp[];
    textPreprocessingPreset: TextPreprocessingPreset;
    translateButtons: string[];
    webPageTranslateSource: string;
    webPageTranslateTo: string;
    webPageTranslateDisplayMode: number;
    afterSelectingTextRegExpList: TextPreprocessingRegExp[];
    translateButtonsTL: TranslateButtonsTL;
    sourceParamsCache: SourceParams;
    displayOfTranslation: DisplayOfTranslation;
    customWebpageTranslateSourceList: CustomTranslateSource[];
    autoTranslateWebpageHostList: string[];
    enableAutoTranslateWebpage: boolean;
    keepUsingDefaultAudioSource: boolean;
    autoPlayAudio: boolean;
    autoPlayAudioLangs: string[];
};

// Only work in "src/entry/background/install.ts".
// Use for updating and deal with the deprecated options in `initStorageOnInstalled()`.
export type DeprecatedOptions = {
    showButtonAfterSelect: boolean;
    enableContextMenus: boolean;
    clipboardReadPermission: boolean;
    multipleTranslateMode: boolean;
    defaultTranslateSource: string;
    defaultTranslateFrom: string;
    defaultTranslateTo: string;
};