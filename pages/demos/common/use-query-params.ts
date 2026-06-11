// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import { useEffect, useState } from 'react';

export const useQueryParams = () => {
  const [queryParams, setParams] = useState(Object.fromEntries(new URLSearchParams(window.location.search)));

  const getQueryParam = (param: string) => {
    return queryParams[param];
  };

  const setQueryParam = (param: string, value: string | null) => {
    setParams(currentParams => {
      const queryParams = { ...currentParams };
      if (value === null || value === '') {
        delete queryParams[param];
      } else {
        queryParams[param] = value;
      }

      const searchParams = new URLSearchParams(queryParams);
      const newURL = searchParams.toString() ? `${window.location.pathname}?${searchParams}` : window.location.pathname;

      window.history.pushState('', '', newURL);

      return queryParams;
    });
  };

  useEffect(() => {
    const handlePopState = () => {
      setParams(Object.fromEntries(new URLSearchParams(window.location.search)));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return {
    getQueryParam,
    setQueryParam,
    queryParams,
  };
};
