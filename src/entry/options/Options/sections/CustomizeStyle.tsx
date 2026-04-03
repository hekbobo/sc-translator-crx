import React from 'react';
import { getMessage } from '../../../../public/i18n';
import { useOptions } from '../../../../public/react-use';
import { GetStorageKeys } from '../../../../types';
import CustomizeStyleTextarea from '../../components/CustomizeStyleTextarea';
import scOptions from '../../../../public/sc-options';

const useOptionsDependency: GetStorageKeys<'customizeStyleText'> = ['customizeStyleText'];

const CustomizeStyle: React.FC = () => {
    const { customizeStyleText } = useOptions(useOptionsDependency);

    return (
        <div className='opt-section'>
            <div className='opt-section-row'>
                <div className='mt10-ml30'>
                    <CustomizeStyleTextarea
                        customizeStyleText={customizeStyleText}
                        onSave={text => scOptions.set({ customizeStyleText: text })}
                    />
                    <div className='item-description'>{getMessage('optionsCustomizeStyleDescription')}</div>
                    <div className='item-description'>{getMessage('optionsCustomizeStyleNotice')}</div>
                </div>
            </div>
        </div>
    );
};

export default CustomizeStyle;
