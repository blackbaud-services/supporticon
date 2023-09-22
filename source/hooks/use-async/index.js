import { useCallback, useEffect, useRef, useState } from 'react';

const useAsync = (asyncFunction, options = {}) => {
  const { withCleanup, refreshInterval } = options;
  const intervalRef = useRef(null);
  const asyncRef = useRef(asyncFunction);

  const [response, setResponse] = useState({
    data: null,
    error: null,
    status: null,
  });

  const fetch = useCallback(() => {
    setResponse({
      ...response,
      status: 'fetching',
    });

    return asyncFunction()
      .then((response) => {
        setResponse({
          data: response,
          status: 'fetched',
          error: null,
        });
      })
      .catch((error) => {
        setResponse({
          data: null,
          status: 'failed',
          error: !error ? 'Unknown error occurred' : error,
        });
      });
  }, []);

  useEffect(() => {
    fetch();
    if (refreshInterval && typeof refreshInterval === 'number') {
      asyncRef.current = fetch;
      const interval = () => asyncRef.current();
      intervalRef.current = setInterval(interval, refreshInterval);
      return () => clearInterval(interval);
    }

    if (withCleanup) {
      const abortController = new window.AbortController();
      return () => abortController.abort();
    }
  }, [fetch, refreshInterval, withCleanup]);

  return { ...response };
};

export default useAsync;
