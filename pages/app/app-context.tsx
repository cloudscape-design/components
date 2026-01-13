// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { createContext, useContext, useState } from 'react';
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
  mode?: Mode;
}

export interface AppContextType<T = unknown> {
  mode: Mode;
  pageId?: string;
  urlParams: AppUrlParams & T;
  setUrlParams: (newParams: Partial<AppUrlParams & T>) => void;
  setMode: (newMode: Mode) => void;
  header: null | React.ReactNode;
  setHeader: (header: React.ReactNode) => void;
}

const appContextDefaults: AppContextType = {
  mode: Mode.Light,
  pageId: undefined,
  urlParams: {
    density: Density.Comfortable,
    direction: 'ltr',
    visualRefresh: THEME === 'default',
    motionDisabled: false,
    appLayoutWidget: false,
  },
  setMode: () => {},
  setUrlParams: () => {},
  header: null,
  setHeader: () => {},
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
  const matchWithVisualMode = useRouteMatch<{ mode: Mode; pageId: string }>('/:mode(light|dark)/:pageId*');
  const matchWithoutVisualMode = useRouteMatch<{ pageId: string }>('/:pageId*');
  const pageId = (matchWithVisualMode ?? matchWithoutVisualMode)?.params.pageId ?? undefined;
  const urlParams = parseQuery(location.search) as AppUrlParams;
  const mode = matchWithVisualMode?.params.mode ?? urlParams.mode ?? Mode.Light;

  function setUrlParams(newParams: Partial<AppUrlParams>) {
    const formattedQuery = formatQuery({ ...urlParams, ...newParams });
    if (matchWithVisualMode) {
      const pathname = [matchWithVisualMode.params.mode, pageId].filter(segment => !!segment).join('/') + '/';
      history.replace(`/${pathname}${formatQuery({ ...urlParams, ...newParams })}`);
    } else {
      const newUrl = pageId ? `/${pageId}${formattedQuery}` : formattedQuery;
      history.replace(newUrl);
    }
  }

  function updateMode(newMode: Mode) {
    if (matchWithVisualMode) {
      const pathname = [newMode, pageId].filter(segment => !!segment).join('/') + '/';
      history.replace('/' + pathname + location.search + location.hash);
    } else {
      setUrlParams({ mode: newMode });
    }
  }

  const [header, setHeader] = useState<React.ReactNode>(null);

  return (
    <AppContext.Provider
      value={{ mode, pageId, urlParams, setUrlParams: setUrlParams, setMode: updateMode, header, setHeader }}
    >
      {children}
    </AppContext.Provider>
  );
}
