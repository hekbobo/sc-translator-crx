import { useMemo } from 'react';

/** History is always recorded on normal pages; per-site disable was removed. */
const useIsHistoryEnabled = (host: string) => {
    return useMemo(() => !!host, [host]);
};

export default useIsHistoryEnabled;
