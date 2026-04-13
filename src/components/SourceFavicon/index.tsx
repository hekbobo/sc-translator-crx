import React from 'react';
import { GOOGLE_COM, BING_COM, MOJIDICT_COM, BAIDU_COM, MICROSOFT_COM, BROWSER_AI } from '../../constants/translateSource';
import google from './favicons/google.png';
import bing from './favicons/bing.png';
import mojidict from './favicons/mojidict.png';
import baidu from './favicons/baidu.png';
import microsoft from './favicons/microsofttranslator.png';
import browserAI from './favicons/browserAI.png';
import './style.css';
import { cn } from '../../public/utils';

type SourceFaviconProps = {
    source: string;
    faviconOnly?: boolean;
} & Pick<React.HtmlHTMLAttributes<HTMLSpanElement>, 'className'>;

const SourceFavicon: React.FC<SourceFaviconProps> = ({ source, className, faviconOnly }) => {
    return (
        <span className={cn('source-favicon', className)}>
            {getFavicon(source)}
            {!faviconOnly && <span>{getName(source)}</span>}
        </span>
    );
};

const getFavicon = (source: string) => {
    switch (source) {
        case GOOGLE_COM: return FaviconImg(google);
        case BING_COM: return FaviconImg(bing);
        case MOJIDICT_COM: return FaviconImg(mojidict);
        case BAIDU_COM: return FaviconImg(baidu);
        case MICROSOFT_COM: return FaviconImg(microsoft);
        case BROWSER_AI: return FaviconImg(browserAI);
        default: return (
            <div className='favicon favicon--mock'>
                <div className='favicon--mock-text'>
                    {(source || '?')[0]}
                </div>
            </div>
        );
    }
};

const FaviconImg = (src: string) => (<img className='favicon' src={src} alt='favicon' />);

const getName = (source: string) => {
    switch (source) {
        case GOOGLE_COM: return 'Google Translate';
        case BING_COM: return 'Bing Translate';
        case MOJIDICT_COM: return 'Mojidict';
        case BAIDU_COM: return 'Baidu Translate';
        case MICROSOFT_COM: return 'Microsoft Translator';
        case BROWSER_AI: return 'Browser AI (Beta)';
        default: return source;
    }
};

export default SourceFavicon;