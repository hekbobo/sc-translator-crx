import { GOOGLE_COM, BING_COM } from './translateSource';
import { LANG_EN } from './langCode';
import { styleVarsList } from './defaultStyleVars';
import { defaultContextMenus } from './contextMenusIds';
import { DefaultOptions } from '../types';
import { defaultTranslateButtons } from './translateButtonTypes';
import { initSourceParams } from './sourceParams';

const defaultOptions: DefaultOptions = {
    userLanguage: LANG_EN,
    translateDirectly: false,
    translateBlackListMode: true,
    translateHostList: [],
    historyBlackListMode: false,
    historyHostList: [],
    defaultAudioSource: GOOGLE_COM,
    translateWithKeyPress: false,
    useDotCn: false,
    translateEnglishOnly: true,
    multipleTranslateSourceList: [GOOGLE_COM, BING_COM],
    multipleTranslateFrom: '',
    multipleTranslateTo: '',
    preferredLanguage: LANG_EN,
    secondPreferredLanguage: LANG_EN,
    styleVarsList: styleVarsList,
    styleVarsIndex: 0,
    audioVolume: 100,
    audioPlaybackRate: 1,
    translatePanelMaxHeight: { percentage: false, px: 500, percent: 50 },
    translatePanelWidth: { percentage: false, px: 250, percent: 10 },
    translatePanelFontSize: 14,
    recentTranslateFromList: [],
    recentTranslateToList: [],
    doNotRespondInTextBox: true,
    autoTranslateAfterInput: true,
    contextMenus: defaultContextMenus,
    textPreprocessingRegExpList: [],
    textPreprocessingPreset: { convertCamelCase: false },
    translateButtons: defaultTranslateButtons,
    webPageTranslateSource: GOOGLE_COM,
    webPageTranslateTo: LANG_EN,
    webPageTranslateDisplayMode: 1,
    afterSelectingTextRegExpList: [],
    translateButtonsTL: { first: '', second: LANG_EN, third: LANG_EN },
    sourceParamsCache: initSourceParams,
    displayOfTranslation: {
        result: true,
        dict: true,
        phonetic: true,
        related: true,
        example: true,
        phonetic_nonEnglish: false,
        maintainParagraphStructure: true,
        sourceLanguage: true
    },
    customWebpageTranslateSourceList: [],
    autoTranslateWebpageHostList: [],
    enableAutoTranslateWebpage: false,
    keepUsingDefaultAudioSource: false,
    autoPlayAudio: false,
    autoPlayAudioLangs: []
};

export default defaultOptions;