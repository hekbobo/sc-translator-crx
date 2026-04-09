import React from 'react';
import Switch from '../../../../components/Switch';
import { getMessage } from '../../../../public/i18n';
import { useOptions } from '../../../../public/react-use';
import { GetStorageKeys } from '../../../../types';
import scOptions from '../../../../public/sc-options';

const useOptionsDependency: GetStorageKeys<'autoTranslateAfterInput'> = ['autoTranslateAfterInput'];

const TranslatePanel: React.FC = () => {
    const { autoTranslateAfterInput } = useOptions(useOptionsDependency);

    return (
        <div className='opt-section'>
            <div className='opt-section-row'>
                <Switch
                    label={getMessage('optionsAutoTranslateAfterInput')}
                    checked={autoTranslateAfterInput}
                    onChange={v => scOptions.set({ autoTranslateAfterInput: v })}
                />
                <div className='item-description'>{getMessage('optionsAutoTranslateAfterInputDescription')}</div>
            </div>
        </div>
    );
};

export default TranslatePanel;
