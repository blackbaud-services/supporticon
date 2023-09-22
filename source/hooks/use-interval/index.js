import { useEffect, useRef } from 'react';

const useInterval = (callback, delay) => {
  const intervalRef = useRef(null);
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const interval = () => callbackRef.current();
    if (typeof delay === 'number') {
      intervalRef.current = setInterval(interval, delay);
      return () => clearInterval(intervalRef.current);
    }
  }, [delay]);

  return { intervalRef };
};

export default useInterval;
