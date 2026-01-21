// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { createContext, useContext } from 'react';
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import mapValues from 'lodash/mapValues';

import { Density, Mode } from '@cloudscape-design/global-styles';

import { THEME } from '~components/internal/environment';

interface AppUrlParams {
  density: Density;
  direction: 'ltr' | 'rtl';
  visualRefresh: boolean;
  motionDisabled: boolean;
  appLayoutWidget: boolean;
  mode: Mode;
}

export interface AppContextType<T = unknown> {
  pageId?: string;
  urlParams: AppUrlParams & T;
  setUrlParams: (newParams: Partial<AppUrlParams & T>) => void;
  setMode: (newMode: Mode) => void;
}

const appContextDefaults: AppContextType = {
  pageId: undefined,
  urlParams: {
    density: Density.Comfortable,
    direction: 'ltr',
    visualRefresh: THEME === 'default',
    motionDisabled: false,
    appLayoutWidget: false,
    mode: Mode.Light,
  },
  setMode: () => {},
  setUrlParams: () => {},
};

const AppContext = createContext<AppContextType>(appContextDefaults);

export default AppContext;

export function useAppContext<T extends keyof any>() {
  return useContext(AppContext as React.Context<AppContextType<Record<T, string | boolean>>>);
}

export function parseQuery(query: string) {
  const queryParams: Record<string, any> = { ...appContextDefaults.urlParams };
  const urlParams = new URLSearchParams(query);
  urlParams.forEach((value, key) => (queryParams[key] = value));

  return mapValues(queryParams, value => {
    if (value === 'true' || value === 'false') {
      return value === 'true';
    }
    return value;
  });
}

function formatQuery(params: AppUrlParams) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === appContextDefaults.urlParams[key as keyof AppUrlParams]) {
      continue;
    }
    query.set(key, value);
  }
  return query ? `?${query.toString()}` : '';
}

export function AppContextProvider({ children }: { children: React.ReactNode }) {
  const history = useHistory();
  const location = useLocation();
  const pageId = useRouteMatch<{ pageId: string }>('/:pageId*')?.params.pageId ?? undefined;
  const urlParams = parseQuery(location.search) as AppUrlParams;

  function setUrlParams(newParams: Partial<AppUrlParams>) {
    const formattedQuery = formatQuery({ ...urlParams, ...newParams });
    const newUrl = pageId ? `/${pageId}${formattedQuery}` : formattedQuery;
    history.replace(newUrl);
  }

  function updateMode(newMode: Mode) {
    setUrlParams({ mode: newMode });
  }

  return (
    <AppContext.Provider value={{ pageId, urlParams, setUrlParams: setUrlParams, setMode: updateMode }}>
      {children}
    </AppContext.Provider>
  );
}
