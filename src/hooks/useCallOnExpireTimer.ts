import { useEffect } from 'react';
import { SECOND_MS } from '../constants';

const useCallOnExpireTimer = (expires_at: string, onExpireTimer: () => void) => {
  useEffect(() => {
    if (!expires_at) {
      return;
    }

    const currentTimeMs = Date.now();

    const expiresMs = Date.parse(expires_at);
    const spareTimeBeforeNextReq = 5 * SECOND_MS;
    const diffTime = expiresMs - currentTimeMs - spareTimeBeforeNextReq;

    const timerMark = setTimeout(async () => {
      await onExpireTimer();
    }, diffTime);

    return () => {
      clearTimeout(timerMark);
    };
  }, [expires_at, onExpireTimer]);
};

export default useCallOnExpireTimer;
