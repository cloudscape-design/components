// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { createContext } from 'react';
import mapValues from 'lodash/mapValues';
import { THEME } from '~components/internal/environment';
import { Density, Mode } from '@cloudscape-design/global-styles';
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom';

interface AppUrlParams {
  density: Density;
  direction: 'ltr' | 'rtl';
  visualRefresh: boolean;
  motionDisabled: boolean;
}
export interface AppContextType<T = unknown> {
  mode: Mode;
  pageId?: string;
  urlParams: AppUrlParams & T;
  setUrlParams: (newParams: Partial<AppUrlParams & T>) => void;
  setMode: (newMode: Mode) => void;
}

const appContextDefaults: AppContextType = {
  mode: Mode.Light,
  pageId: undefined,
  urlParams: {
    density: Density.Comfortable,
    direction: 'ltr',
    visualRefresh: THEME === 'default',
    motionDisabled: false,
  },
  setMode: () => {},
  setUrlParams: () => {},
};

const AppContext = createContext<AppContextType>(appContextDefaults);

export default AppContext;

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
  const match = useRouteMatch<{ theme: string; mode: Mode; pageId: string }>('/:mode(light|dark)/:pageId*');
  const { mode, pageId } = match ? match.params : { mode: undefined, pageId: undefined };
  const urlParams = parseQuery(location.search) as AppUrlParams;

  document.querySelector('html')?.setAttribute('dir', urlParams.direction);

  function setUrlParams(newParams: Partial<AppUrlParams>) {
    const pathname = [mode, pageId].filter(segment => !!segment).join('/') + '/';
    history.replace(`/${pathname}${formatQuery({ ...urlParams, ...newParams })}`);
  }

  function updateMode(newMode: Mode) {
    const pathname = [newMode, pageId].filter(segment => !!segment).join('/') + '/';
    history.replace('/' + pathname + location.search + location.hash);
  }

  return (
    <AppContext.Provider value={{ mode: mode!, pageId, urlParams, setUrlParams: setUrlParams, setMode: updateMode }}>
      {children}
    </AppContext.Provider>
  );
}
