import React, { useEffect, useState } from 'react';
import { useSignal } from 'react-signal-slot';
import IconFont from '../../../../components/IconFont';
import Logo from '../../../../components/Logo';
import { getMessage } from '../../../../public/i18n';
import { useWindowSize } from '../../../../public/react-use';
import { cn } from '../../../../public/utils';
import './style.css';

const menusItems = [
    { title: getMessage('optionsDefaultTranslateOptions'), id: 'default-translate-options' },
    { title: getMessage('optionsWebPageTranslating'), id: 'web-page-translating' },
    { title: getMessage('optionsContextMenus'), id: 'context-menus' },
    { title: getMessage('optionsAbout'), id: 'about' }
];

const OptionsMenu: React.FC = () => {
    const [showNavBarMenu, setShowNavBarMenu] = useState(false);
    const [smallScreen, setSmallScreen] = useState(false);

    const signal = useSignal();

    const windowSize = useWindowSize();

    useEffect(() => {
        if (windowSize.width >= 1234) {
            setShowNavBarMenu(false);
            setSmallScreen(false);
        }
        else {
            setSmallScreen(true);
        }
    }, [windowSize.width]);

    return (
        <div className='opt-nav-bar'>
            <div className='main-title'>
                <IconFont className='nav-bar-menu__icon button' onClick={() => setShowNavBarMenu(true)} iconName='#icon-menu' />
                <Logo style={{fontSize: '30px'}} />
                {getMessage('optionsTitle')}
            </div>
            <div className='side-bar-menu'>
                <div className='side-bar-menu__items'>
                    {menusItems.map((item) => (<div
                        className='options-menu__item button'
                        key={item.id}
                        onClick={() => signal('menu-item-click', item.id)}
                    >
                        {item.title}
                    </div>))}
                </div>
            </div>
            <div className={cn('nav-bar-menu__backdrop', showNavBarMenu && 'nav-bar-menu--show')} onClick={() => setShowNavBarMenu(false)} />
            {smallScreen && <div className={cn('nav-bar-menu', showNavBarMenu && 'nav-bar-menu--show')}>
                <div className='nav-bar-menu__sidebar'>
                    <div className='nav-bar-menu__sidebar-brand main-title'>
                        <Logo style={{fontSize: '30px'}} />
                        {getMessage('optionsTitle')}
                    </div>
                    <div className='nav-bar-menu__sidebar-items'>
                        {menusItems.map((item) => (<div
                            className='options-menu__item button'
                            key={item.id}
                            onClick={() => {
                                setShowNavBarMenu(false);
                                signal('menu-item-click', item.id);
                            }}
                        >
                            {item.title}
                        </div>))}
                    </div>
                </div>
            </div>}
        </div>
    );
};

export default OptionsMenu;
