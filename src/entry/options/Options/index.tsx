import React from 'react';
import { getMessage } from '../../../public/i18n';
import OptionsMenu from '../components/OptionsMenu';
import OverScroll from '../components/OverScroll';
import ContextMenus from './sections/ContextMenus';
import DefaultTranslateOptions from './sections/DefaultTranslateOptions';
import Translate from './sections/Translate';
import './style.css';
import WebPageTranslating from './sections/WebPageTranslating';

const Options: React.FC = () => {
    return (
        <div className='options'>
            <OptionsMenu />
            <div className='sub-title' id='default-translate-options'>{getMessage('optionsDefaultTranslateOptions')}</div>
            <DefaultTranslateOptions />
            <div className='sub-title' id='web-page-translating'>{getMessage('optionsWebPageTranslating')}</div>
            <div className='opt-section'>
                <WebPageTranslating noCard />
                <Translate noCard />
            </div>
            <div className='sub-title' id='context-menus'>{getMessage('optionsContextMenus')}</div>
            <ContextMenus />
            <OverScroll />
        </div>
    );
};

export default Options;
