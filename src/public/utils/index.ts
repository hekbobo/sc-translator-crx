import { DefaultOptions, Position } from '../../types';

export const resultToString = (result: string[]) => (result.reduce((t, c) => (t + c), ''));

export const getCurrentTab = (cb: (tab?: chrome.tabs.Tab) => void) => {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => cb(tabs[0]));
};

export const getIsContentScriptEnabled = async (tabId?: number):Promise<boolean> => {
    return await new Promise((resolve) => {
        try {
            if (!tabId) {
                resolve(false);
                return;
            }
            chrome.tabs.sendMessage(tabId, 'Are you enabled?', () => {
                if (chrome.runtime.lastError) resolve(false);
                resolve(true);
            });
        }
        catch {
            resolve(false);
        }
    });
};

export const getIsEnabled = (host: string, hostList: string[], mode: boolean) => {
    const find = hostList.some(v => host.endsWith(v));
    return mode ? !find : find;
};

export const getCurrentTabHost = async (tabId?: number): Promise<string> => {
    return await new Promise((resolve) => {
        const callback = (tabId: number) => chrome.tabs.sendMessage(tabId, 'Are you enabled?', (tabData) => {
            chrome.runtime.lastError && resolve('');

            resolve(tabData?.host);
        });
        tabId ? callback(tabId) : getCurrentTab(tab => tab?.id ? callback(tab.id) : resolve(''));
    });
};

export const drag = (event: MouseEvent, currentPosition: Position, mouseMoveCallback: (pos: Position) => void, mouseUpCallback: (pos: Position) => void) => {
    const originX = event.clientX;
    const originY = event.clientY;
    const tempX = currentPosition.x;
    const tempY = currentPosition.y;
    let newX = tempX;
    let newY = tempY;

    const mouseMoveListener = (e: MouseEvent) => {
        const nowX = e.clientX;
        const nowY = e.clientY;
        const diffX = originX - nowX;
        const diffY = originY - nowY;
        newX = tempX - diffX;
        newY = tempY - diffY;
        mouseMoveCallback({ x: newX, y: newY });
    };

    const mouseUpListener = () => {
        document.removeEventListener('mousemove', mouseMoveListener, true);
        document.removeEventListener('mouseup', mouseUpListener, true);
        document.onselectstart = () => { return true; };
        mouseUpCallback({ x: newX, y: newY });
    };

    document.onselectstart = () => { return false; };
    document.addEventListener('mousemove', mouseMoveListener, true);
    document.addEventListener('mouseup', mouseUpListener, true);
};

export const calculatePosition = (element: HTMLElement, { x, y }: Position, margin = 5): Position => {
    const dH = document.documentElement.clientHeight;
    const dW = document.documentElement.clientWidth;
    const rbW = element.clientWidth;
    const rbH = element.clientHeight;
    const rbL = x;
    const rbT = y;
    const rbB = rbT + rbH;
    const rbR = rbL + rbW;
    // show top and right prior
    if (rbL < margin) x = margin;
    if (rbR > dW) x = dW - margin - rbW;
    if (rbB > dH) y = dH - margin - rbH;
    if (y < margin) y = margin;
    
    return { x, y };
};

export const debounce = (cb: () => void, time: number) => {
    let timeout: number | undefined;
    return () => {
        timeout && clearTimeout(timeout);
        timeout = setTimeout(cb, time);
    };
};

export const mouseDrag = (mouseMoveCallback: (pos: Position) => void, mouseUpCallback: (pos: Position) => void) => {
    const mouseMoveListener = (e: MouseEvent) => {
        mouseMoveCallback?.({ x: e.clientX, y: e.clientY });
    };

    const mouseUpListener = (e: MouseEvent) => {
        document.removeEventListener('mousemove', mouseMoveListener, true);
        document.removeEventListener('mouseup', mouseUpListener, true);
        document.onselectstart = () => { return true; };
        mouseUpCallback?.({ x: e.clientX, y: e.clientY });
    };

    document.onselectstart = () => { return false; };
    document.addEventListener('mousemove', mouseMoveListener, true);
    document.addEventListener('mouseup', mouseUpListener, true);
};

/** Input types where users typically select/type text (not button/checkbox/radio). */
const TEXTBOX_INPUT_TYPES = new Set([
    'text', 'search', 'email', 'url', 'tel', 'password', 'number',
    'date', 'datetime-local', 'month', 'time', 'week'
]);

export const isTextBox = (element: Element) => {
    if (element.tagName === 'INPUT') {
        return TEXTBOX_INPUT_TYPES.has((element as HTMLInputElement).type);
    }
    return element.tagName === 'TEXTAREA'
        || (element as HTMLElement).isContentEditable;
};

const walkNodeToTextBox = (node: Node | null): boolean => {
    let cur: Node | null = node;
    if (cur?.nodeType === Node.TEXT_NODE) {
        cur = (cur as Text).parentElement;
    }
    while (cur && cur !== document.documentElement) {
        if (cur.nodeType === Node.ELEMENT_NODE && isTextBox(cur as Element)) {
            return true;
        }
        cur = (cur as Element).parentElement ?? cur.parentNode;
    }
    return false;
};

/**
 * Detect focus/selection inside input, textarea, or contenteditable.
 * Use this instead of only `document.activeElement` — after mouseup, focus may
 * already have moved (e.g. React), so we also use event.composedPath and Selection.
 */
export const isSelectionOrActiveInTextBox = (mouseupEvent?: MouseEvent): boolean => {
    const ae = document.activeElement;
    if (ae && isTextBox(ae)) {
        return true;
    }

    if (mouseupEvent) {
        if (mouseupEvent.composedPath().some(n => n instanceof Element && isTextBox(n))) {
            return true;
        }
    }

    const sel = window.getSelection();
    if (sel?.rangeCount) {
        const range = sel.getRangeAt(0);
        if (walkNodeToTextBox(range.commonAncestorContainer)) {
            return true;
        }
        if (sel.anchorNode && walkNodeToTextBox(sel.anchorNode)) {
            return true;
        }
    }

    if (ae instanceof HTMLInputElement && ae.selectionStart != null && ae.selectionEnd != null
        && ae.selectionStart !== ae.selectionEnd && TEXTBOX_INPUT_TYPES.has(ae.type)) {
        return true;
    }
    if (ae instanceof HTMLTextAreaElement && ae.selectionStart !== ae.selectionEnd) {
        return true;
    }

    return false;
};

export const cn = (...args: (undefined | null | boolean | string)[]) => {
    let className = '';

    args.forEach((value) => (value && typeof value === 'string' && (className += ' ' + value)));

    return className.trimStart();
};

export const openHistoryPage = () => {
    const isHistoryPageOpen = async (): Promise<null | { tabId: number, windowId: number }> => {
        return await new Promise((resolve) => {
            chrome.runtime.sendMessage('Are you history page?', (data: { tabId: number, windowId: number }) => {
                chrome.runtime.lastError && resolve(null);

                resolve(data);
            });
        });
    };

    isHistoryPageOpen().then((info) => {
        if (info) {
            const { tabId, windowId } = info;

            chrome.tabs.update(tabId, { active: true, highlighted: true });
            chrome.windows.update(windowId, { focused: true });
        }
        else {
            chrome.tabs.create({ url: chrome.runtime.getURL('/history.html') });
        }
    });
};

export const openCollectionPage = () => {
    const isCollectionPageCreated = async (): Promise<null | { tabId: number, windowId: number }> => {
        return await new Promise((resolve) => {
            chrome.runtime.sendMessage('Are you collection page?', (data: { tabId: number, windowId: number }) => {
                chrome.runtime.lastError && resolve(null);
    
                resolve(data);
            });
        });
    };

    isCollectionPageCreated().then((info) => {
        if (info) {
            const { tabId, windowId } = info;

            chrome.tabs.update(tabId, { active: true, highlighted: true });
            chrome.windows.update(windowId, { focused: true });
        }
        else {
            chrome.tabs.create({ url: chrome.runtime.getURL('/collection.html') })
        }
    });
};

type PointerDragParams = {
    element: HTMLElement,
    maxX?: number;
    maxY?: number;
    onMouseMove?: (position: Position) => void;
    onMouseUp?: (position: Position) => void;
};

export const pointerDrag = ({ element, maxX = 0, maxY = 0, onMouseMove, onMouseUp }: PointerDragParams) => {
    const { left, top } = element.getBoundingClientRect();

    const calculate = (x: number, y: number) => {
        return {
            x: Math.min(Math.max(0, x), maxX),
            y: Math.min(Math.max(0, y), maxY)
        };
    };

    const mouseMoveListener = (e: MouseEvent) => {
        onMouseMove?.(calculate(e.clientX - left, e.clientY - top));
    };

    const mouseUpListener = (e: MouseEvent) => {
        document.removeEventListener('mousemove', mouseMoveListener, true);
        document.removeEventListener('mouseup', mouseUpListener, true);
        document.onselectstart = () => { return true; };
        onMouseUp?.(calculate(e.clientX - left, e.clientY - top));
    };

    document.onselectstart = () => { return false; };
    document.addEventListener('mousemove', mouseMoveListener, true);
    document.addEventListener('mouseup', mouseUpListener, true);
};

export const matchPattern = (pattern: string, hostAndPathname: string) => {
    const match = new RegExp('^(?:(?:https|http|\\*)://)?(\\*|(?:\\*\\.)?(?:[^/*]+))?(/.*)?$').exec(pattern);

    if (!match) { return false; }

    let [, host, path] = match;

    if (!host) { return false; }

    let regex = '^';

    if (host === '*') {
        regex += '[^/]+?';
    }
    else {
        if (host.substring(0, 2) === '*.') {
            regex += '[^/]*?';
            host = host.substring(2);
        }

        regex += host.replaceAll('.', '\\.');
    }

    if (path) {
        regex += path.replaceAll('.', '\\.').replaceAll('*', '.*?');
    }

    return new RegExp(regex).test(hostAndPathname);
};