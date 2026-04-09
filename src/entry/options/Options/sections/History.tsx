import React from 'react';
import Switch from '../../../../components/Switch';
import { getMessage } from '../../../../public/i18n';
import { useOptions } from '../../../../public/react-use';
import { GetStorageKeys } from '../../../../types';
import scOptions from '../../../../public/sc-options';

const useOptionsDependency: GetStorageKeys<'rememberHistoryPanelStatus'> = ['rememberHistoryPanelStatus'];

const History: React.FC = () => {
    const { rememberHistoryPanelStatus } = useOptions(useOptionsDependency);

    return (
        <div className='opt-section'>
            <div className='opt-section-row'>
                <Switch
                    label={getMessage('optionsRememberHistoryPanelStatus')}
                    checked={rememberHistoryPanelStatus}
                    onChange={v => scOptions.set({ rememberHistoryPanelStatus: v })}
                />
            </div>
        </div>
    );
};

export default History;
