import React, { useState } from 'react';
import './style.css';
import IconFont from '../IconFont';
import { TranslateRequest } from '../../types';
import TranslateResult from '../TranslateResult';
import MtSourceSelect from '../MtSourceSelect';
import { BROWSER_AI } from '../../constants/translateSource';
import BrowserAIResult from '../BrowserAIResult';

type MtResultProps = {
    source: string;
    translateRequest: TranslateRequest;
    remove: () => void;
    retry: () => void;
    setText: (text: string) => void;
};

const MtResult: React.FC<MtResultProps> = ({ source, translateRequest, remove, retry, setText }) => {
    const [fold, setFold] = useState(false);

    return (
        <div className='mt-result'>
            <div
                className='mt-result__head flex-justify-content-space-between flex-align-items-center'
                onClick={() => setFold(!fold)}
            >
                <span className='mt-result__head__left'>
                    <MtSourceSelect source={source} />
                    {translateRequest.status === 'loading' && <IconsLoadingSkeleton />}
                </span>
                <span className='mt-result__head__actions'>
                    <IconFont
                        iconName='#icon-GoChevronDown'
                        style={!fold ? {transform: 'rotate(180deg)', transition: 'transform 0.2s'} : {transition: 'transform 0.2s'}}
                    />
                </span>
            </div>
            {!fold && (
                <div className='mt-result__body'>
                    {source === BROWSER_AI ? <BrowserAIResult
                        translateRequest={translateRequest}
                        source={source}
                        retry={retry}
                    /> : <TranslateResult
                        translateRequest={translateRequest}
                        source={source}
                        retry={retry}
                        setText={setText}
                    />}
                </div>
            )}
        </div>
    );
};

const IconsLoadingSkeleton: React.FC = () => (<div className='skeleton' style={{width: '2.6em', height: '1.3em', marginLeft: '5px'}}></div>);

export default MtResult;