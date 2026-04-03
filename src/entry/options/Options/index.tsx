import React from 'react';
import { getMessage } from '../../../public/i18n';
import OptionsMenu from '../components/OptionsMenu';
import OverScroll from '../components/OverScroll';
import ContextMenus from './sections/ContextMenus';
import DefaultTranslateOptions from './sections/DefaultTranslateOptions';
import History from './sections/History';
import More from './sections/More';
import SeparateWindow from './sections/SeparateWindow';
import Translate from './sections/Translate';
import TranslatePanel from './sections/TranslatePanel';
import Clipboard from './sections/Clipboard';
import './style.css';
import WebPageTranslating from './sections/WebPageTranslating';

const Options: React.FC = () => {
    return (
        <div className='options'>
            <OptionsMenu />
            <div className='sub-title' id='clipboard'>{getMessage('optionsClipboard')}</div>
            <Clipboard />
            <div className='sub-title' id='web-page-translating'>{getMessage('optionsWebPageTranslating')}</div>
            <WebPageTranslating />
            <div className='sub-title' id='separate-window'>{getMessage('titleSeparateWindow')}</div>
            <SeparateWindow />
            <div className='sub-title' id='translate-panel'>{getMessage('optionsTranslatePanel')}</div>
            <TranslatePanel />
            <div className='sub-title' id='default-translate-options'>{getMessage('optionsDefaultTranslateOptions')}</div>
            <DefaultTranslateOptions />
            <div className='sub-title' id='in-web-page'>{getMessage('optionsInWebPage')}</div>
            <Translate />
            <div className='sub-title' id='history'>{getMessage('optionsHistory')}</div>
            <History />
            <div className='sub-title' id='context-menus'>{getMessage('optionsContextMenus')}</div>
            <ContextMenus />
            <div className='sub-title' id='more'>{getMessage('optionsMore')}</div>
            <More />
            <OverScroll />
        </div>
    );
};

export default Options;