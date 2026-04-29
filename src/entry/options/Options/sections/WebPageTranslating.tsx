import React from 'react';
import { preferredLangCode } from '../../../../constants/langCode';
import { getMessage } from '../../../../public/i18n';
import { useOptions } from '../../../../public/react-use';
import { GetStorageKeys } from '../../../../types';
import WebPageTranslateDisplayMode from '../../components/WebPageTranslateDisplayMode';
import scOptions from '../../../../public/sc-options';
import LanguageSelect from '../../../../components/LanguageSelect';
import SourceSelect from '../../../../components/SourceSelect';
import { webPageTranslateSource as webPageTranslateSourceList } from '../../../../constants/translateSource';

const useOptionsDependency: GetStorageKeys<
    'webPageTranslateTo' |
    'webPageTranslateDisplayMode' |
    'userLanguage' |
    'webPageTranslateSource'
> = [
    'webPageTranslateTo',
    'webPageTranslateDisplayMode',
    'userLanguage',
    'webPageTranslateSource'
];

type WebPageTranslatingProps = {
    noCard?: boolean;
};

const WebPageTranslating: React.FC<WebPageTranslatingProps> = ({ noCard = false }) => {
    const {
        webPageTranslateTo,
        userLanguage,
        webPageTranslateDisplayMode,
        webPageTranslateSource
    } = useOptions(useOptionsDependency);

    const rows = (
        <>
            <div className='opt-section-row'>
                {getMessage('optionsSource')}
                <SourceSelect
                    className='border-bottom-select opt-source-select'
                    sourceList={webPageTranslateSourceList}
                    source={webPageTranslateSource}
                    onChange={value => scOptions.set({ webPageTranslateSource: value })}
                />
            </div>
            <div className='opt-section-row'>
                {getMessage('optionsTo')}
                <LanguageSelect
                    value={webPageTranslateTo}
                    onChange={value => scOptions.set({ webPageTranslateTo: value })}
                    langCodes={preferredLangCode[userLanguage]}
                />
            </div>
            <div className='opt-section-row'>
                {getMessage('optionsDisplayMode')}
                <div className='mt10-ml30'>
                    <WebPageTranslateDisplayMode
                        update={displayMode => scOptions.set({ webPageTranslateDisplayMode: displayMode })}
                        displayMode={webPageTranslateDisplayMode}
                    />
                </div>
            </div>
            <div className='opt-section-row'>
                <div className='item-description'>{getMessage('optionsWebPageTranslatingDescription')}</div>
            </div>
        </>
    );

    return noCard ? rows : <div className='opt-section'>{rows}</div>;
};

export default WebPageTranslating;
