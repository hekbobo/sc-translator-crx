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
        <div className='options options-page'>
            <OptionsMenu />
            <main className='options-main'>
                <div className='options-stack'>
                    <section className='options-card' id='default-translate-options'>
                        <div className='options-card__header'>
                            <div className='options-card__icon'>◎</div>
                            <div>
                                <div className='options-card__title'>{getMessage('optionsDefaultTranslateOptions')}</div>
                                <div className='options-card__subtitle'>{getMessage('optionsDefaultTranslateAndAIConfig')}</div>
                            </div>
                        </div>
                        <DefaultTranslateOptions />
                    </section>

                    <section className='options-card' id='web-page-translating'>
                        <div className='options-card__header'>
                            <div className='options-card__icon'>↗</div>
                            <div>
                                <div className='options-card__title'>{getMessage('optionsWebPageTranslating')}</div>
                                <div className='options-card__subtitle'>{getMessage('optionsWebpageTranslationAndSelectionBehavior')}</div>
                            </div>
                        </div>
                        <div className='options-card__body'>
                            <WebPageTranslating noCard />
                            <Translate noCard />
                        </div>
                    </section>

                    <section className='options-card' id='context-menus'>
                        <div className='options-card__header'>
                            <div className='options-card__icon'>☰</div>
                            <div>
                                <div className='options-card__title'>{getMessage('optionsContextMenus')}</div>
                                <div className='options-card__subtitle'>{getMessage('optionsContextMenusAndSorting')}</div>
                            </div>
                        </div>
                        <ContextMenus />
                    </section>

                    <section className='options-card' id='about'>
                        <div className='options-card__header'>
                            <div className='options-card__icon'>i</div>
                            <div>
                                <div className='options-card__title'>{getMessage('optionsAbout')}</div>
                                <div className='options-card__subtitle'>{getMessage('optionsContactAndProjectDescription')}</div>
                            </div>
                        </div>
                        <div className='options-card__body'>
                            <div className='opt-section-row options-about__row'>
                                <div className='options-about__label'>{getMessage('optionsContactMe')}</div>
                                <a className='options-about__link' href='mailto:hekbobo@gmail.com'>hekbobo@gmail.com</a>
                            </div>
                        </div>
                    </section>
                </div>
                <OverScroll />
            </main>
        </div>
    );
};

export default Options;
