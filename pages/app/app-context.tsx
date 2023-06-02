// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import qs from 'qs';
import React, { createContext, useContext, useEffect, useState } from 'react';
import mapValues from 'lodash/mapValues';
import { THEME } from '~components/internal/environment';
import { Density, Mode } from '@cloudscape-design/global-styles';
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom';

interface AppUrlParams {
  density: Density;
  visualRefresh: boolean;
  motionDisabled: boolean;
  showSettingsEditor: boolean;
  readonlySettings: boolean;
  settings?: string;
}

export interface AppContextType<T = unknown, S = Record<string, unknown>> {
  mode: Mode;
  pageId?: string;
  urlParams: AppUrlParams & T;
  setUrlParams: (newParams: Partial<AppUrlParams & T>) => void;
  setMode: (newMode: Mode) => void;
  settings?: S;
  setSettings(settings: Partial<S>): void;
  defaultSettings?: S;
  setDefaultSettings(settings: S): void;
}

const appContextDefaults: AppContextType = {
  mode: Mode.Light,
  pageId: undefined,
  urlParams: {
    density: Density.Comfortable,
    visualRefresh: THEME === 'default',
    motionDisabled: false,
    showSettingsEditor: false,
    readonlySettings: true,
    settings: undefined,
  },
  setMode: () => {},
  setUrlParams: () => {},
  settings: undefined,
  setSettings: () => {},
  defaultSettings: undefined,
  setDefaultSettings: () => {},
};

const AppContext = createContext<AppContextType>(appContextDefaults);

export default AppContext;

export function parseQuery(query: string) {
  const queryParams = { ...appContextDefaults.urlParams, ...qs.parse(query.substring(1)) } as Record<string, any>;

  return mapValues(queryParams, value => {
    if (value === 'true' || value === 'false') {
      return value === 'true';
    }
    return value;
  });
}

function formatQuery(params: AppUrlParams) {
  const query = qs.stringify(params, {
    filter: (key, value) => (appContextDefaults.urlParams[key as keyof AppUrlParams] !== value ? value : undefined),
  });
  return query ? `?${query}` : '';
}

export function AppContextProvider({ children }: { children: React.ReactNode }) {
  const history = useHistory();
  const location = useLocation();
  const match = useRouteMatch<{ theme: string; mode: Mode; pageId: string }>('/:mode(light|dark)/:pageId*');
  const { mode, pageId } = match ? match.params : { mode: undefined, pageId: undefined };
  const urlParams = parseQuery(location.search) as AppUrlParams;

  const [settings, _setSettings] = useState<any>(() => {
    if (!urlParams.settings) {
      return undefined;
    }
    try {
      return JSON.parse(urlParams.settings);
    } catch {
      return {};
    }
  });
  const [defaultSettings, setDefaultSettings] = useState<any>(undefined);

  console.log('APPCONTEXT', settings);

  function setUrlParams(newParams: Partial<AppUrlParams>) {
    const pathname = [mode, pageId].filter(segment => !!segment).join('/') + '/';
    history.replace(`/${pathname}${formatQuery({ ...urlParams, ...newParams })}`);
  }

  const setSettings = (partialSettings: Partial<any>) => {
    const newSettings = { ...defaultSettings, ...settings, ...partialSettings };
    _setSettings(newSettings);
    setUrlParams({ settings: JSON.stringify(newSettings) });
  };

  function updateMode(newMode: Mode) {
    const pathname = [newMode, pageId].filter(segment => !!segment).join('/') + '/';
    history.replace('/' + pathname + location.search + location.hash);
  }

  return (
    <AppContext.Provider
      value={{
        mode: mode!,
        pageId,
        urlParams,
        settings,
        setSettings,
        defaultSettings,
        setDefaultSettings,
        setUrlParams: setUrlParams,
        setMode: updateMode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppSettings<S extends Record<string, unknown>>(
  defaultSettings: S
): [S, (value: Partial<S>) => void] {
  const { settings, setSettings, setDefaultSettings } = useContext(
    AppContext as React.Context<AppContextType<unknown, S>>
  );

  useEffect(
    () => {
      setDefaultSettings(defaultSettings);
    },
    // Consider default settings stable
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return [settings ?? { ...defaultSettings }, setSettings];
}
