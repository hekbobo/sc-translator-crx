import React from 'react';
import Switch from '../../../../components/Switch';
import { getMessage } from '../../../../public/i18n';
import { useOptions } from '../../../../public/react-use';
import { GetStorageKeys } from '../../../../types';
import scOptions from '../../../../public/sc-options';

const useOptionsDependency: GetStorageKeys<
    'pinThePanelWhileOpeningIt' |
    'rememberPositionOfPinnedPanel' |
    'autoTranslateAfterInput'
> = [
    'pinThePanelWhileOpeningIt',
    'rememberPositionOfPinnedPanel',
    'autoTranslateAfterInput'
];

const TranslatePanel: React.FC = () => {
    const {
        pinThePanelWhileOpeningIt,
        rememberPositionOfPinnedPanel,
        autoTranslateAfterInput
    } = useOptions(useOptionsDependency);

    return (
        <div className='opt-section'>
            <div className='opt-section-row'>
                <Switch
                    label={getMessage('optionsPinThePanelWhileOpeningIt')}
                    checked={pinThePanelWhileOpeningIt}
                    onChange={v => scOptions.set({ pinThePanelWhileOpeningIt: v })}
                />
                <div className='item-description'>{getMessage('optionsPinThePanelWhileOpeningItDescription')}</div>
            </div>
            <div className='opt-section-row'>
                <Switch
                    label={getMessage('optionsRememberPositionOfPinnedPanel')}
                    checked={rememberPositionOfPinnedPanel}
                    onChange={v => scOptions.set({ rememberPositionOfPinnedPanel: v })}
                />
                <div className='item-description'>{getMessage('optionsRememberPositionOfPinnedPanelDescription')}</div>
            </div>
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
