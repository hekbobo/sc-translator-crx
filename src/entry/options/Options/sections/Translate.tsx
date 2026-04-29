import React from 'react';

import Switch from '../../../../components/Switch';

import { getMessage } from '../../../../public/i18n';

import { useOptions } from '../../../../public/react-use';

import { GetStorageKeys } from '../../../../types';

import scOptions from '../../../../public/sc-options';

const useOptionsDependency: GetStorageKeys<
    'translateWithKeyPress' |
    'translateDirectly' |
    'doNotRespondInTextBox'
> = [
    'translateWithKeyPress',
    'translateDirectly',
    'doNotRespondInTextBox'
];

type TranslateProps = {
    noCard?: boolean;
};

const Translate: React.FC<TranslateProps> = ({ noCard = false }) => {
    const {
        translateWithKeyPress,
        translateDirectly,
        doNotRespondInTextBox
    } = useOptions(useOptionsDependency);

    const rows = (
        <div className='web-page-translating__switch-list'>
            <div className='web-page-translating__switch-item'>
                <div className='web-page-translating__switch-copy'>
                    <div className='web-page-translating__switch-title'>{getMessage('optionsTranslateWithKeyPress')}</div>
                </div>
                <Switch
                    checked={translateWithKeyPress}
                    onChange={v => scOptions.set({ translateWithKeyPress: v })}
                />
            </div>
            <div className='web-page-translating__switch-item'>
                <div className='web-page-translating__switch-copy'>
                    <div className='web-page-translating__switch-title'>{getMessage('optionsTranslateDirectly')}</div>
                </div>
                <Switch
                    checked={translateDirectly}
                    onChange={v => scOptions.set({ translateDirectly: v })}
                />
            </div>
            <div className='web-page-translating__switch-item'>
                <div className='web-page-translating__switch-copy'>
                    <div className='web-page-translating__switch-title'>{getMessage('optionsDoNotRespondInTextBox')}</div>
                    <div className='web-page-translating__switch-desc'>{getMessage('optionsDoNotRespondInTextBoxDescription')}</div>
                </div>
                <Switch
                    checked={doNotRespondInTextBox}
                    onChange={v => scOptions.set({ doNotRespondInTextBox: v })}
                />
            </div>
        </div>
    );

    return noCard ? rows : <div className='opt-section'>{rows}</div>;
};

export default Translate;
