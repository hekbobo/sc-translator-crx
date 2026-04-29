import scOptions from './sc-options';
import { fetchData } from './translate/utils';

type TranslateParams = {
    text: string;
    sourceLanguage: string;
    targetLanguage: string;
};

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

const scBrowserAI = (() => {
    const normalizeLang = (lang: string) => (lang.includes('zh') ? 'zh' : lang);

    const resolveApiUrl = (baseUrl: string) => {
        const url = baseUrl.trim().replace(/\/+$/, '');

        if (!url) {
            throw new Error('missing_base_url');
        }

        if (/\/chat\/completions$/i.test(url)) {
            return url;
        }

        if (/\/v1$/i.test(url)) {
            return `${url}/chat/completions`;
        }

        return `${url}/v1/chat/completions`;
    };

    const extractTranslation = (data: ChatCompletionsResponse) => {
        const content = data.choices?.[0]?.message?.content;

        if (typeof content !== 'string' || !content.trim()) {
            throw new Error('invalid_response_shape');
        }

        return content.trim();
    };

    const getConfig = () => {
        const { browserAIApiKey, browserAIBaseUrl, browserAIModel, preferredLanguage, secondPreferredLanguage } = scOptions.getInit();

        const apiKey = browserAIApiKey.trim();
        const model = browserAIModel.trim();
        const baseUrl = browserAIBaseUrl.trim();

        if (!apiKey || !baseUrl || !model) {
            throw new Error('missing_config');
        }

        return {
            apiKey,
            baseUrl,
            model,
            preferredLanguage: normalizeLang(preferredLanguage),
            secondPreferredLanguage: normalizeLang(secondPreferredLanguage)
        };
    };

    const sendChatCompletion = async (baseUrl: string, apiKey: string, payload: Record<string, unknown>) => {
        const url = resolveApiUrl(baseUrl);

        const response = await fetchData(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(payload)
        });

        return response.json() as Promise<ChatCompletionsResponse>;
    };

    const translate = async ({ text, sourceLanguage, targetLanguage }: TranslateParams) => {
        const { apiKey, baseUrl, model, preferredLanguage, secondPreferredLanguage } = getConfig();

        if (text.length > 4096) {
            throw new Error('text_too_long');
        }

        let from = normalizeLang(sourceLanguage || '');
        let to = normalizeLang(targetLanguage || '');
        const preferred = normalizeLang(preferredLanguage);
        const secondPreferred = normalizeLang(secondPreferredLanguage);

        if (!from) {
            const detection = await chrome.i18n.detectLanguage(text);
            from = normalizeLang(detection.languages[0]?.language ?? '');
        }

        if (!to) {
            to = from === preferred ? secondPreferred : preferred;
        }

        const systemPrompt = 'You are a precise translation engine. Translate the user text faithfully. Preserve the original meaning, formatting, markdown, code blocks, and line breaks. Output only the translated text.';
        const userPrompt = `Translate the following text from ${from || 'auto'} to ${to}:\n\n${text}`;

        const payload = {
            model,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ] as ChatCompletionMessage[],
            temperature: 0.2
        };

        const data = await sendChatCompletion(baseUrl, apiKey, payload);
        const translation = extractTranslation(data);

        return { translation, from, to };
    };

    return {
        detect: async (text: string) => {
            const detection = await chrome.i18n.detectLanguage(text);
            return detection.languages[0]?.language ?? '';
        },
        test: async () => {
            const { apiKey, baseUrl, model } = getConfig();

            const data = await sendChatCompletion(baseUrl, apiKey, {
                model,
                messages: [
                    { role: 'system', content: 'You are a service checker. Reply with OK.' },
                    { role: 'user', content: 'OK' }
                ] as ChatCompletionMessage[],
                temperature: 0
            });

            return extractTranslation(data);
        },
        translate,
        downloadDetector: async () => scBrowserAI,
        downloadTranslator: async () => scBrowserAI
    };
})();

export default scBrowserAI;
