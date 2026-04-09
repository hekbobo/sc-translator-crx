import React from 'react';
import './style.css';
import CollectButton from '../PanelIconButtons/CollectButton';
import OpenOptionsPageButton from '../PanelIconButtons/OpenOptionsPageButton';
import OpenCollectionPageButton from '../PanelIconButtons/OpenCollectionPageButton';
import OpenHistoryPageButton from '../PanelIconButtons/OpenHistoryPageButton';

const PopupHeader: React.FC = () => {
    return (
        <div className="popup-header flex-align-items-center">
            <div className='popup-header__icons flex-align-items-center'>
                <CollectButton />
                <OpenHistoryPageButton />
                <OpenCollectionPageButton />
                <OpenOptionsPageButton />
            </div>
        </div>
    );
};

export default PopupHeader;
