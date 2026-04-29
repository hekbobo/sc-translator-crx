import React, { useCallback, useMemo } from 'react';
import Checkbox from '../../../../components/Checkbox';
import SourceFavicon from '../../../../components/SourceFavicon';
import './style.css';

type MultipleSourcesDisplayProps = {
    enabledSources: string[];
    sources: string[];
    onChange: (sources: string[]) => void;
};

const MultipleSourcesDisplay: React.FC<MultipleSourcesDisplayProps> = ({ enabledSources, sources, onChange }) => {
    const enabledSourcesMap = useMemo(() => {
        return enabledSources.reduce((total, current) => ({ ...total, [current]: true }), {});
    }, [enabledSources]);

    const onSourceItemClick = useCallback((source: string) => {
        if (enabledSources.includes(source)) {
            onChange(enabledSources.filter(value => value !== source));
        }
        else {
            onChange(enabledSources.concat(source));
        }
    }, [enabledSources, onChange]);

    return (
        <div className='multiple-sources-display'>
            <div className='multiple-sources-display__list'>
                {sources.map((source) => (<div className='multiple-sources-display__item' key={'msd_' + source}>
                    <Checkbox
                        label={<SourceFavicon source={source} />}
                        checked={source in enabledSourcesMap}
                        onChange={() => onSourceItemClick(source)}
                    />
                </div>))}
            </div>
        </div>
    );
};

export default MultipleSourcesDisplay;
