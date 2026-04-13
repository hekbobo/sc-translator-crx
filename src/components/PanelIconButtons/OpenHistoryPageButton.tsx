import React from 'react';
import { getMessage } from '../../public/i18n';
import IconFont from '../IconFont';
import PanelIconButtonWrapper from './PanelIconButtonWrapper';
import { openHistoryPage } from '../../public/utils';

const OpenHistoryPageButton: React.FC<{ text?: string }> = ({ text }) => {
    return (
        <PanelIconButtonWrapper
            text={text}
            onClick={openHistoryPage}
            title={getMessage('popupOpenHistoryPage')}
        >
            <IconFont iconName='#icon-MdHistory' />
        </PanelIconButtonWrapper>
    );
};

export default OpenHistoryPageButton;
