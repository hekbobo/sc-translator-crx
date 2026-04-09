import { useMemo } from 'react';

const useIsTranslateEnabled = (host: string) => {
    const translateEnabled = useMemo(() => {
        return !!host;
    }, [host]);

    return translateEnabled;
};

export default useIsTranslateEnabled;
