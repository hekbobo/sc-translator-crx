export const GOOGLE_COM = 'google.com';
export const BING_COM = 'bing.com';
export const MICROSOFT_COM = 'microsofttranslator.com';
export const BROWSER_AI = 'browser_ai';

export type TranslateSource = {
    source: string;
    url: string;
    name?: string;
};

export const translateSource: TranslateSource[] = [
    { source: GOOGLE_COM, url: 'translate.google.com' },
    { source: BING_COM, url: 'www.bing.com/translator/' },
    { source: BROWSER_AI, url: 'browser.ai' }
];

export const audioSource: TranslateSource[] = [
    { source: GOOGLE_COM, url: 'translate.google.com' },
    { source: BING_COM, url: 'www.bing.com/translator/' }
];

export const webPageTranslateSource: TranslateSource[] = [
    { source: GOOGLE_COM, url: 'translate.google.com' },
    { source: MICROSOFT_COM, url: 'microsofttranslator.com' },
    { source: BROWSER_AI, url: 'browser.ai' }
];
