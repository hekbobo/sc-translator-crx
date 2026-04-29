import React, { useEffect, useMemo } from 'react';
import { defaultContextMenus } from '../../../../constants/contextMenusIds';
import { getMessage } from '../../../../public/i18n';
import { useOptions } from '../../../../public/react-use';
import { GetStorageKeys, OptionsContextMenu } from '../../../../types';
import ContextMenusDraggable from '../../components/ContextMenusDraggable';
import scOptions from '../../../../public/sc-options';

const useOptionsDependency: GetStorageKeys<
    'contextMenus'
> = [
    'contextMenus'
];

const sanitizeContextMenus = (menus: OptionsContextMenu[] | unknown) => {
    if (!Array.isArray(menus)) {
        return [...defaultContextMenus];
    }

    const validIds = new Set(defaultContextMenus.map(v => v.id));
    const seenIds = new Set<string>();
    const nextMenus: OptionsContextMenu[] = [];

    menus.forEach((menu) => {
        if (!validIds.has(menu.id) || seenIds.has(menu.id)) { return; }
        seenIds.add(menu.id);
        nextMenus.push(menu);
    });

    defaultContextMenus.forEach((menu) => {
        if (!seenIds.has(menu.id)) {
            nextMenus.push(menu);
        }
    });

    return nextMenus;
};

const ContextMenus: React.FC = () => {
    const {
        contextMenus
    } = useOptions(useOptionsDependency);

    const sanitizedContextMenus = useMemo(
        () => sanitizeContextMenus(contextMenus),
        [contextMenus]
    );

    useEffect(() => {
        if (JSON.stringify(sanitizedContextMenus) !== JSON.stringify(contextMenus)) {
            scOptions.set({ contextMenus: sanitizedContextMenus });
        }
    }, [contextMenus, sanitizedContextMenus]);

    return (
        <div className='opt-section'>
            <div className='opt-section-row'>
                <div className='item-description'>{getMessage('optionsContextMenusDescription')}</div>
            </div>
            <div className='opt-section-row'>
                <ContextMenusDraggable
                    contextMenus={sanitizedContextMenus}
                    update={newContextMenus => scOptions.set({ contextMenus: sanitizeContextMenus(newContextMenus) })}
                />
            </div>
        </div>
    );
};

export default ContextMenus;
