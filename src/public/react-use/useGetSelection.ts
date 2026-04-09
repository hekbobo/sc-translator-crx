import { useEffect, useRef } from 'react';
import { Position } from '../../types';
import { selectedTextPreprocessing } from '../text-preprocessing';
import { getSelectedText } from '../utils/get-selection';

export type GetSelectionCallbackParams = { pos: Position; text: string; mouseEvent: MouseEvent };

const useGetSelection = (selectCallback: (params: GetSelectionCallbackParams) => void, unselectCallback: () => void) => {
    const selectRef = useRef<typeof selectCallback>(undefined);
    const unselectRef = useRef<() => void>(undefined);
    const lastSelectionTextRef = useRef('');

    useEffect(() => {
        selectRef.current = selectCallback;
    }, [selectCallback]);

    useEffect(() => {
        unselectRef.current = unselectCallback;
    }, [unselectCallback]);

    useEffect(() => {
        const onMouseUp = (e: MouseEvent) => {
            setTimeout(() => {
                const text = getSelectedText();

                if (lastSelectionTextRef.current === text || !selectedTextPreprocessing(text)) { return; }

                lastSelectionTextRef.current = text;

                selectRef.current?.({
                    pos: { x: e.clientX, y: e.clientY },
                    text,
                    mouseEvent: e
                });
            }, 0);
        };
        
        const onMouseDown = () => {
            lastSelectionTextRef.current = '';
            unselectRef.current?.();
        };
    
        window.addEventListener('mouseup', onMouseUp);
        window.addEventListener('mousedown', onMouseDown);
    
        return () => {
            window.removeEventListener('mouseup', onMouseUp);
            window.removeEventListener('mousedown', onMouseDown);
        };
    }, []);
};

export default useGetSelection;