import scOptions from '../../sc-options';
import { fetchData, getError } from '../../translate/utils';
import { WebpageTranslateFn, WebpageTranslateResult } from '..';

type ChatCompletionMessage = {
    role: 'system' | 'user' | 'assistant';
    content: string;
};

type ChatCompletionsResponse = {
    choices?: {
        message?: {
            content?: string;
        };
    }[];
};

const normalizeBaseUrl = (baseUrl: string) => {
    const url = baseUrl.trim().replace(/\/+$/, '');

    if (!url) {
        throw getError('Error: missing AI base url.');
    }

    if (/\/chat\/completions$/i.test(url)) {
        return url;
    }

    if (/\/v1$/i.test(url)) {
        return `${url}/chat/completions`;
    }

    return `${url}/v1/chat/completions`;
};

const stripMarkdownFence = (content: string) => {
    const trimmed = content.trim();

    if (trimmed.startsWith('```')) {
        return trimmed
            .replace(/^```(?:json)?\s*/i, '')
            .replace(/\s*```$/, '')
            .trim();
    }

    return trimmed;
};

const parseTranslationArray = (content: string, expectedLength: number) => {
    const raw = stripMarkdownFence(content);
    const parsed = JSON.parse(raw) as unknown;

    const values = Array.isArray(parsed)
        ? parsed
        : (parsed && typeof parsed === 'object' && 'translations' in parsed ? (parsed as { translations: unknown }).translations : null);

    if (!Array.isArray(values) || values.length !== expectedLength || !values.every(value => typeof value === 'string')) {
        throw getError('Error: invalid AI response shape.');
    }

    return values as string[];
};

const translateGroup = async (paragraphs: string[], targetLanguage: string) => {
    const { browserAIApiKey, browserAIBaseUrl, browserAIModel } = scOptions.getInit();

    const apiKey = browserAIApiKey.trim();
    const baseUrl = browserAIBaseUrl.trim();
    const model = browserAIModel.trim();

    if (!apiKey || !baseUrl || !model) {
        throw getError('Error: missing AI config.');
    }

    const url = normalizeBaseUrl(baseUrl);
    const systemPrompt = 'You are a precise translation engine. Translate each item faithfully. Preserve meaning, formatting, markdown, code blocks, and line breaks. Output only valid JSON.';
    const userPrompt = [
        `Translate each string in the JSON array from auto language to ${targetLanguage}.`,
        'Return a JSON array of translated strings in the same order and with the same length.',
        'Do not add explanations or markdown.',
        `JSON array: ${JSON.stringify(paragraphs)}`
    ].join('\n');

    const payload = {
        model,
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
        ] as ChatCompletionMessage[],
        temperature: 0.2
    };

    const response = await fetchData(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(payload)
    });

    const data = await response.json() as ChatCompletionsResponse;
    const content = data.choices?.[0]?.message?.content;

    if (typeof content !== 'string') {
        throw getError('Error: invalid AI response.');
    }

    const translations = parseTranslationArray(content, paragraphs.length);

    return {
        translations,
        comparisons: translations
    };
};

export const translate: WebpageTranslateFn = async ({ paragraphs, targetLanguage }) => {
    const detectedLanguage = await chrome.i18n.detectLanguage(paragraphs.flat().join('\n'))
        .then(v => v.languages[0]?.language)
        .catch(() => '');

    const result: WebpageTranslateResult[] = [];

    for (const paragraph of paragraphs) {
        const translated = await translateGroup(paragraph, targetLanguage);

        result.push({
            ...translated,
            detectedLanguage
        });
    }

    return result;
};
