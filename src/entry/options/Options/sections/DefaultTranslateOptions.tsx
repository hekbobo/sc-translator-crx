import React from 'react';
import Switch from '../../../../components/Switch';
import { mtLangCode } from '../../../../constants/langCode';
import { getMessage } from '../../../../public/i18n';
import { useOptions } from '../../../../public/react-use';
import { GetStorageKeys } from '../../../../types';
import scOptions from '../../../../public/sc-options';
import LanguageSelect from '../../../../components/LanguageSelect';

const useOptionsDependency: GetStorageKeys<
    'userLanguage' |
    'multipleTranslateFrom' |
    'multipleTranslateTo' |
    'translateEnglishOnly'
> = [
    'userLanguage',
    'multipleTranslateFrom',
    'multipleTranslateTo',
    'translateEnglishOnly'
];

const DefaultTranslateOptions: React.FC = () => {
    const {
        userLanguage,
        multipleTranslateFrom,
        multipleTranslateTo,
        translateEnglishOnly
    } = useOptions(useOptionsDependency);

    return (
        <div className='opt-section'>
            <div className='opt-section-row'>
                <Switch
                    label={getMessage('optionsTranslateEnglishOnly')}
                    checked={translateEnglishOnly}
                    onChange={v => scOptions.set({ translateEnglishOnly: v })}
                />
            </div>
            <div className='opt-section-row'>
                {getMessage('optionsFrom')}
                <LanguageSelect
                    value={multipleTranslateFrom}
                    onChange={value => scOptions.set({ multipleTranslateFrom: value })}
                    langCodes={mtLangCode[userLanguage]}
                />
            </div>
            <div className='opt-section-row'>
                {getMessage('optionsTo')}
                <LanguageSelect
                    value={multipleTranslateTo}
                    onChange={value => scOptions.set({ multipleTranslateTo: value })}
                    langCodes={mtLangCode[userLanguage]}
                />
            </div>
        </div>
    );
};

export default DefaultTranslateOptions;
