// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { createContext, useContext } from 'react';
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import mapValues from 'lodash/mapValues';

import { Density, Mode } from '@cloudscape-design/global-styles';

import { ALWAYS_VISUAL_REFRESH, INCLUDED_THEMES, PRIMARY_THEME } from '~components/internal/environment';

// The themes selectable in dev pages: the resolved primary plus every secondary theme actually
// compiled into this build (see docs/SETUP.md — AWSUI_PRIMARY_THEME/AWSUI_SECONDARY_THEMES).
// Never offer a theme that wasn't built.
export const SELECTABLE_THEMES: string[] = [PRIMARY_THEME, ...INCLUDED_THEMES];

// Selecting the primary applies no class (it's already the default); selecting a secondary
// toggles that theme's class on and every other secondary's class off — secondaries are mutually
// exclusive (this generalizes the old "one-theme cancels visual-refresh" rule to any secondary set).
export function applyThemeClass(activeThemeId: string) {
  for (const id of INCLUDED_THEMES) {
    document.body.classList.toggle(`awsui-${id}`, id === activeThemeId);
  }
}

// Visual refresh is active either unconditionally (the primary theme forces it) or because it's
// the currently selected secondary theme.
export function isVisualRefreshActive(activeThemeId: string) {
  return ALWAYS_VISUAL_REFRESH || activeThemeId === 'visual-refresh';
}

interface AppUrlParams {
  density: Density;
  direction: 'ltr' | 'rtl';
  // Derived from `theme` — kept as its own field since some pages read it directly. Not settable
  // on its own via setUrlParams; set `theme` instead.
  visualRefresh: boolean;
  // One of SELECTABLE_THEMES. The legacy `visualRefresh=true` URL param is still accepted as an
  // alias for `theme=visual-refresh` (only when `visual-refresh` was actually built); `theme=`
  // wins when both are present.
  theme: string;
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
}

const appContextDefaults: AppContextType = {
  mode: Mode.Light,
  pageId: undefined,
  urlParams: {
    density: Density.Comfortable,
    direction: 'ltr',
    visualRefresh: isVisualRefreshActive(PRIMARY_THEME),
    theme: PRIMARY_THEME,
    motionDisabled: false,
    appLayoutWidget: false,
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
  const searchParams = new URLSearchParams(query);
  searchParams.forEach((value, key) => (queryParams[key] = value));

  const requestedTheme = searchParams.get('theme');
  const legacyVisualRefresh = searchParams.get('visualRefresh');
  let themeId = PRIMARY_THEME;
  if (requestedTheme && SELECTABLE_THEMES.includes(requestedTheme)) {
    themeId = requestedTheme;
  } else if (legacyVisualRefresh === 'true' && SELECTABLE_THEMES.includes('visual-refresh')) {
    themeId = 'visual-refresh';
  }

  return mapValues(queryParams, (value, key) => {
    if (key === 'theme') {
      return themeId;
    }
    if (key === 'visualRefresh') {
      return isVisualRefreshActive(themeId);
    }
    if (value === 'true' || value === 'false') {
      return value === 'true';
    }
    return value;
  });
}

function formatQuery(params: AppUrlParams) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (key === 'visualRefresh') {
      // Derived from `theme`, never round-tripped as its own param.
      continue;
    }
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

  return (
    <AppContext.Provider value={{ mode, pageId, urlParams, setUrlParams: setUrlParams, setMode: updateMode }}>
      {children}
    </AppContext.Provider>
  );
}
