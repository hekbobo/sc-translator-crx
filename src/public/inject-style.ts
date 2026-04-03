import { defaultStyleVars, StyleVars, StyleVarsList } from '../constants/defaultStyleVars';
import { GetStorageKeys } from '../types';
import scOptions from './sc-options';

// color vars
let styleVarsList: StyleVarsList = [];
let styleVarsIndex = 0;

let colorVarsStyle: HTMLStyleElement;

// font size
let translatePanelFontSize: number;

let fontSizeStyle: HTMLStyleElement;

const styleVarsToStyleText = (styleVars: StyleVars) => {
    styleVars = { ...defaultStyleVars, ...styleVars };
    return (Object.keys(styleVars) as (keyof StyleVars)[]).reduce((t: string, c: keyof StyleVars) => (t + `${c}:${styleVars[c]};`), '#sc-translator-root{') + '}';
};

const fontSizeToStyleText = (fontSize: number) => {
    return `#sc-translator-root{font-size:${fontSize}px}`;
};

const updateColorVarsStyleInnerText = () => {
    if (styleVarsIndex < styleVarsList.length && styleVarsList[styleVarsIndex] && styleVarsList[styleVarsIndex].styleVars) {
        colorVarsStyle.innerText = styleVarsToStyleText(styleVarsList[styleVarsIndex].styleVars);
    }
    else {
        colorVarsStyle.innerText = styleVarsToStyleText(defaultStyleVars);
    }
};

const updateFontSizeStyleInnerText = () => {
    fontSizeStyle.innerText = fontSizeToStyleText(translatePanelFontSize);
};

export const appendColorVarsStyle = (targetParent: HTMLElement | ShadowRoot) => {
    colorVarsStyle = document.createElement('style');
    targetParent.appendChild(colorVarsStyle);

    const keys: GetStorageKeys<'styleVarsIndex' | 'styleVarsList'> = ['styleVarsList', 'styleVarsIndex'];
    scOptions.get(keys).then((storage) => {
        styleVarsList = storage.styleVarsList;
        styleVarsIndex = storage.styleVarsIndex;
        updateColorVarsStyleInnerText();
    });
    scOptions.listen(keys, (changes) => {
        changes.styleVarsList !== undefined && (styleVarsList = changes.styleVarsList);
        changes.styleVarsIndex !== undefined && (styleVarsIndex = changes.styleVarsIndex);
        updateColorVarsStyleInnerText();
    });
};

export const appendFontSizeStyle = (targetParent: HTMLElement | ShadowRoot) => {
    fontSizeStyle = document.createElement('style');
    targetParent.appendChild(fontSizeStyle);

    const keys: GetStorageKeys<'translatePanelFontSize'> = ['translatePanelFontSize'];
    scOptions.get(keys).then((storage) => {
        translatePanelFontSize = storage.translatePanelFontSize;
        updateFontSizeStyleInnerText();
    });
    scOptions.listen(keys, (changes) => {
        changes.translatePanelFontSize !== undefined && (translatePanelFontSize = changes.translatePanelFontSize);
        updateFontSizeStyleInnerText();
    });
};