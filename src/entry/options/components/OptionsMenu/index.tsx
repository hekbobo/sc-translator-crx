import React, { useEffect, useState } from 'react';
import { useSignal } from 'react-signal-slot';
import Logo from '../../../../components/Logo';
import { getMessage } from '../../../../public/i18n';
import { useWindowSize } from '../../../../public/react-use';
import { cn } from '../../../../public/utils';
import './style.css';

const menusItems = [
    { title: getMessage('optionsDefaultTranslateOptions'), id: 'default-translate-options', subtitle: getMessage('optionsDefaultTranslateOptions') },
    { title: getMessage('optionsWebPageTranslating'), id: 'web-page-translating', subtitle: getMessage('optionsWebPageTranslating') },
    { title: getMessage('optionsContextMenus'), id: 'context-menus', subtitle: getMessage('optionsContextMenus') },
    { title: getMessage('optionsAbout'), id: 'about', subtitle: getMessage('optionsAbout') }
];

const OptionsMenu: React.FC = () => {
    const [showNavBarMenu, setShowNavBarMenu] = useState(false);
    const [smallScreen, setSmallScreen] = useState(false);
    const signal = useSignal();
    const windowSize = useWindowSize();

    const versionLabel = (() => {
        try {
            const version = globalThis?.chrome?.runtime?.getManifest?.()?.version;
            return version ? `v${version}` : 'v0.0.0';
        }
        catch {
            return 'v0.0.0';
        }
    })();

    useEffect(() => {
        if (windowSize.width >= 1200) {
            setShowNavBarMenu(false);
            setSmallScreen(false);
        }
        else {
            setSmallScreen(true);
        }
    }, [windowSize.width]);

    return (
        <>
            <header className='options-topbar'>
                <div className='options-topbar__brand'>
                    <button
                        className='options-topbar__menu button'
                        onClick={() => setShowNavBarMenu(true)}
                        type='button'
                    >
                        ☰
                    </button>
                    <Logo style={{ fontSize: '30px' }} />
                    <div className='options-topbar__brand-copy'>
                        <div className='options-topbar__title'>{getMessage('optionsTitle')}</div>
                        <div className='options-topbar__subtitle'>{getMessage('optionsSettingsSubtitle')}</div>
                    </div>
                </div>
                <div className='options-topbar__actions'>
                    <button className='options-topbar__action button' type='button' title='Refresh'>↻</button>
                    <button className='options-topbar__action button' type='button' title='Help'>?</button>
                </div>
            </header>

            <aside className='options-sidebar'>
                <div className='options-sidebar__hero'>
                    <div className='options-sidebar__hero-title'>{getMessage('optionsControlPanel')}</div>
                    <div className='options-sidebar__hero-subtitle'>{versionLabel}</div>
                </div>
                <nav className='options-sidebar__items'>
                    {menusItems.map((item) => (
                        <button
                            className='options-sidebar__item button'
                            key={item.id}
                            onClick={() => signal('menu-item-click', item.id)}
                            type='button'
                        >
                            <span className='options-sidebar__item-title'>{item.title}</span>
                            <span className='options-sidebar__item-subtitle'>{item.subtitle}</span>
                        </button>
                    ))}
                </nav>
            </aside>

            <div
                className={cn('nav-bar-menu__backdrop', showNavBarMenu && 'nav-bar-menu--show')}
                onClick={() => setShowNavBarMenu(false)}
            />
            {smallScreen && (
                <div className={cn('nav-bar-menu', showNavBarMenu && 'nav-bar-menu--show')}>
                    <div className='nav-bar-menu__sidebar'>
                        <div className='nav-bar-menu__sidebar-brand'>
                            <Logo style={{ fontSize: '30px' }} />
                            <div>
                                <div className='options-topbar__title'>{getMessage('optionsTitle')}</div>
                                <div className='options-topbar__subtitle'>{versionLabel}</div>
                            </div>
                        </div>
                        <div className='nav-bar-menu__sidebar-items'>
                            {menusItems.map((item) => (
                                <button
                                    className='options-sidebar__item button'
                                    key={item.id}
                                    onClick={() => {
                                        setShowNavBarMenu(false);
                                        signal('menu-item-click', item.id);
                                    }}
                                    type='button'
                                >
                                    <span className='options-sidebar__item-title'>{item.title}</span>
                                    <span className='options-sidebar__item-subtitle'>{item.subtitle}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default OptionsMenu;
