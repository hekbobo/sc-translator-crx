import { LANG_EN } from '../../constants/langCode';
import { sendI18nDetectLanguage } from '../send';

const isEnCode = (code: string) => code === LANG_EN || code.startsWith(`${LANG_EN}-`);

/**
 * Short / Latin-only fallback when chrome.i18n.detectLanguage fails or returns unclear results.
 */
const isLikelyEnglishHeuristic = (text: string): boolean => {
    const t = text.trim();
    if (!t || t.length > 500) { return false; }
    if (!/[A-Za-z]/.test(t)) { return false; }
    const asciiChars = [...t].filter(c => c.charCodeAt(0) < 128).length;
    if (asciiChars / t.length < 0.85) { return false; }
    return true;
};

/**
 * Whether the selected text should be treated as English for "translate English only".
 *
 * - If panel source language is explicitly **English**, treat as English (API expects English).
 * - Otherwise **detect the actual snippet** (default source may be zh-CN etc.; that must not block real English selections).
 */
export const isSourceLanguageEnglish = async (text: string, from: string): Promise<boolean> => {
    if (from && isEnCode(from)) {
        return true;
    }

    const detection = await sendI18nDetectLanguage(text);
    if (!('code' in detection)) {
        const langs = detection.languages ?? [];
        for (const l of langs) {
            if (isEnCode(l.language) && (l.percentage ?? 0) >= 25) {
                return true;
            }
        }
    }

    return isLikelyEnglishHeuristic(text);
};
