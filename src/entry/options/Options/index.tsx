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
            <div className='sub-title' id='about'>{getMessage('optionsAbout')}</div>
            <div className='opt-section'>
                <div className='opt-section-row'>
                    <div className='options-about__label'>{getMessage('optionsContactMe')}</div>
                    <a className='options-about__link' href='mailto:hekbobo@gmail.com'>hekbobo@gmail.com</a>
                </div>
            </div>
            <OverScroll />
        </div>
    );
};

export default Options;
