import React, { useEffect, useMemo, useState } from 'react';
import Switch from '../../../../components/Switch';
import { mtLangCode } from '../../../../constants/langCode';
import { BROWSER_AI, translateSource } from '../../../../constants/translateSource';
import { getMessage } from '../../../../public/i18n';
import { useOptions } from '../../../../public/react-use';
import { GetStorageKeys } from '../../../../types';
import MultipleSourcesDisplay from '../../components/MultipleSourcesDisplay';
import scOptions from '../../../../public/sc-options';
import LanguageSelect from '../../../../components/LanguageSelect';
import TextField from '../../../../components/TextField';
import scBrowserAI from '../../../../public/sc-browser-ai';

const useOptionsDependency: GetStorageKeys<
    'userLanguage' |
    'multipleTranslateSourceList' |
    'multipleTranslateTo' |
    'translateEnglishOnly' |
    'browserAIApiKey' |
    'browserAIBaseUrl' |
    'browserAIModel'
> = [
    'userLanguage',
    'multipleTranslateSourceList',
    'multipleTranslateTo',
    'translateEnglishOnly',
    'browserAIApiKey',
    'browserAIBaseUrl',
    'browserAIModel'
];

const DefaultTranslateOptions: React.FC = () => {
    const {
        userLanguage,
        multipleTranslateSourceList,
        multipleTranslateTo,
        translateEnglishOnly,
        browserAIApiKey,
        browserAIBaseUrl,
        browserAIModel
    } = useOptions(useOptionsDependency);
    const [aiTestState, setAiTestState] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
    const [aiTestMessage, setAiTestMessage] = useState('');

    const availableSources = useMemo(
        () => translateSource.map(v => v.source),
        []
    );

    const sanitizedMultipleTranslateSourceList = useMemo(
        () => (Array.isArray(multipleTranslateSourceList) ? multipleTranslateSourceList : []).filter(source => availableSources.includes(source)),
        [multipleTranslateSourceList, availableSources]
    );
    const showBrowserAISettings = sanitizedMultipleTranslateSourceList.includes(BROWSER_AI);
    const normalizedMultipleTranslateSourceList = Array.isArray(multipleTranslateSourceList) ? multipleTranslateSourceList : [];

    useEffect(() => {
        if (sanitizedMultipleTranslateSourceList.length !== normalizedMultipleTranslateSourceList.length) {
            scOptions.set({ multipleTranslateSourceList: sanitizedMultipleTranslateSourceList });
        }
    }, [normalizedMultipleTranslateSourceList.length, sanitizedMultipleTranslateSourceList]);

    const onTestAIConnection = async () => {
        setAiTestState('testing');
        setAiTestMessage('');

        try {
            await scBrowserAI.test?.();
            setAiTestState('success');
            setAiTestMessage(getMessage('optionsBrowserAITestSuccess'));
        }
        catch (err) {
            setAiTestState('error');
            setAiTestMessage((err as Error).message || getMessage('optionsBrowserAITestFailed'));
        }
    };

    return (
        <div className='opt-section default-translate-options'>
            <div className='opt-section-row default-translate-options__switch-row'>
                <Switch
                    label={getMessage('optionsTranslateEnglishOnly')}
                    checked={translateEnglishOnly}
                    onChange={v => scOptions.set({ translateEnglishOnly: v })}
                />
            </div>
            <div className='opt-section-row default-translate-options__section'>
                <div className='default-translate-options__label'>{getMessage('optionsSourceList')}</div>
                <div className='default-translate-options__source-wrap'>
                    <MultipleSourcesDisplay
                        enabledSources={sanitizedMultipleTranslateSourceList}
                        sources={availableSources}
                        onChange={value => scOptions.set({ multipleTranslateSourceList: value })}
                    />
                </div>
            </div>
            <div className='opt-section-row default-translate-options__section default-translate-options__target-row'>
                <div className='default-translate-options__label'>{getMessage('optionsTo')}</div>
                <div className='default-translate-options__target-control'>
                    <LanguageSelect
                        value={multipleTranslateTo}
                        onChange={value => scOptions.set({ multipleTranslateTo: value })}
                        langCodes={mtLangCode[userLanguage]}
                    />
                </div>
            </div>
            {showBrowserAISettings && <div className='opt-section-row default-translate-options__section'>
                <div className='default-translate-options__label'>{getMessage('optionsAI')}</div>
                <div className='default-translate-options__ai-card'>
                    <div className='default-translate-options__ai-actions'>
                        <button
                            className='default-translate-options__test-button'
                            type='button'
                            onClick={onTestAIConnection}
                            disabled={aiTestState === 'testing'}
                        >
                            {aiTestState === 'testing' ? getMessage('optionsBrowserAITesting') : getMessage('optionsBrowserAITest')}
                        </button>
                        {aiTestMessage && <div className={`default-translate-options__test-status default-translate-options__test-status--${aiTestState}`}>
                            {aiTestMessage}
                        </div>}
                    </div>
                    <TextField
                        label={getMessage('optionsBrowserAIBaseUrl')}
                        value={browserAIBaseUrl}
                        onChange={value => scOptions.set({ browserAIBaseUrl: value.trim() })}
                        placeholder='https://api.openai.com/v1'
                    />
                    <TextField
                        label={getMessage('optionsBrowserAIApiKey')}
                        value={browserAIApiKey}
                        onChange={value => scOptions.set({ browserAIApiKey: value.trim() })}
                        placeholder='sk-...'
                    />
                    <TextField
                        label={getMessage('optionsBrowserAIModel')}
                        value={browserAIModel}
                        onChange={value => scOptions.set({ browserAIModel: value.trim() })}
                        placeholder=''
                    />
                </div>
            </div>}
        </div>
    );
};

export default DefaultTranslateOptions;
