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
        <>
            <div className='opt-section-row'>
                <Switch
                    label={getMessage('optionsTranslateWithKeyPress')}
                    checked={translateWithKeyPress}
                    onChange={v => scOptions.set({ translateWithKeyPress: v })}
                />
            </div>
            <div className='opt-section-row'>
                <Switch
                    label={getMessage('optionsTranslateDirectly')}
                    checked={translateDirectly}
                    onChange={v => scOptions.set({ translateDirectly: v })}
                />
            </div>
            <div className='opt-section-row'>
                <Switch
                    label={getMessage('optionsDoNotRespondInTextBox')}
                    checked={doNotRespondInTextBox}
                    onChange={v => scOptions.set({ doNotRespondInTextBox: v })}
                />
                <div className='item-description'>{getMessage('optionsDoNotRespondInTextBoxDescription')}</div>
            </div>
        </>
    );

    return noCard ? rows : <div className='opt-section'>{rows}</div>;
};

export default Translate;
