import React from 'react';
import './style.css';
import { getMessage } from '../../public/i18n';
import Logo from '../Logo';
import CollectButton from '../PanelIconButtons/CollectButton';
import OpenOptionsPageButton from '../PanelIconButtons/OpenOptionsPageButton';
import OpenHistoryPageButton from '../PanelIconButtons/OpenHistoryPageButton';

const PopupHeader: React.FC = () => {
    return (
        <div className="popup-header flex-align-items-center">
            <div className='popup-header__brand'>
                <Logo style={{ fontSize: '18px' }} />
            </div>
            <div className='popup-header__icons flex-align-items-center'>
                <CollectButton text={getMessage('popupCollection')} />
                <OpenHistoryPageButton text={getMessage('popupHistory')} />
                <OpenOptionsPageButton text={getMessage('popupSettings')} />
            </div>
        </div>
    );
};

export default PopupHeader;
