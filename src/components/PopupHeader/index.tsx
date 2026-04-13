import React from 'react';
import './style.css';
import CollectButton from '../PanelIconButtons/CollectButton';
import OpenOptionsPageButton from '../PanelIconButtons/OpenOptionsPageButton';
import OpenHistoryPageButton from '../PanelIconButtons/OpenHistoryPageButton';
import { getMessage } from '../../public/i18n';

const PopupHeader: React.FC = () => {
    return (
        <div className="popup-header flex-align-items-center">
            <div className='popup-header__icons flex-align-items-center'>
                <CollectButton text={getMessage('collectionTitle')} />
                <OpenHistoryPageButton text={getMessage('historyTitle')} />
                <OpenOptionsPageButton text={getMessage('optionsTitle')} />
            </div>
        </div>
    );
};

export default PopupHeader;
