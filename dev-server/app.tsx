// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { createContext, Suspense, useContext, useEffect, useState } from 'react';

import ErrorBoundary from './error-boundary';
import { defaultURLParams, formatURLParams, URLParams } from './url-params';

/**
 * App context for sharing URL parameters and page state
 */
export interface AppContextType {
  pageId?: string;
  urlParams: URLParams;
  isServer: boolean;
  setUrlParams: (newParams: Partial<URLParams>) => void;
}

const AppContext = createContext<AppContextType>({
  pageId: undefined,
  urlParams: defaultURLParams,
  isServer: true,
  setUrlParams: () => {},
});

export const useAppContext = () => useContext(AppContext);

/**
 * Props for the App shell component
 */
export interface AppProps {
  pageId?: string;
  urlParams: URLParams;
  isServer: boolean;
  children: React.ReactNode;
}

/**
 * Check if a page is an AppLayout page (needs special handling)
 */
function isAppLayoutPage(pageId?: string): boolean {
  if (!pageId) {
    return false;
  }
  const appLayoutPages = [
    'app-layout',
    'content-layout',
    'grid-navigation-custom',
    'expandable-rows-test',
    'container/sticky-permutations',
    'copy-to-clipboard/scenario-split-panel',
    'prompt-input/simple',
    'funnel-analytics/static-single-page-flow',
    'funnel-analytics/static-multi-page-flow',
    'charts.test',
    'error-boundary/demo-async-load',
    'error-boundary/demo-components',
  ];
  return appLayoutPages.some(match => pageId.includes(match));
}

/**
 * Theme switcher component with toggles for dark mode, density, motion, etc.
 */
function ThemeSwitcher({
  urlParams,
  setUrlParams,
}: {
  urlParams: URLParams;
  setUrlParams: (p: Partial<URLParams>) => void;
}) {
  const switcherStyle: React.CSSProperties = {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    fontSize: '12px',
  };

  const labelStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    cursor: 'pointer',
  };

  return (
    <div style={switcherStyle}>
      <label style={labelStyle}>
        <input
          id="visual-refresh-toggle"
          type="checkbox"
          checked={urlParams.visualRefresh}
          onChange={e => {
            const newVisualRefresh = e.target.checked;
            const updatedParams = { ...urlParams, visualRefresh: newVisualRefresh };
            // Update URL first, then reload
            const currentPath = window.location.pathname;
            const newUrl = `${currentPath}${formatURLParams(updatedParams)}`;
            window.location.href = newUrl;
          }}
        />
        Visual refresh
      </label>
      <label style={labelStyle}>
        <input
          id="mode-toggle"
          type="checkbox"
          checked={urlParams.mode === 'dark'}
          onChange={e => setUrlParams({ mode: e.target.checked ? 'dark' : 'light' })}
        />
        Dark mode
      </label>
      <label style={labelStyle}>
        <input
          id="density-toggle"
          type="checkbox"
          checked={urlParams.density === 'compact'}
          onChange={e => setUrlParams({ density: e.target.checked ? 'compact' : 'comfortable' })}
        />
        Compact mode
      </label>
      <label style={labelStyle}>
        <input
          id="disabled-motion-toggle"
          type="checkbox"
          checked={urlParams.motionDisabled}
          onChange={e => setUrlParams({ motionDisabled: e.target.checked })}
        />
        Disable motion
      </label>
    </div>
  );
}

/**
 * Header component for the demo pages
 */
function Header({
  sticky,
  urlParams,
  setUrlParams,
}: {
  sticky?: boolean;
  urlParams: URLParams;
  setUrlParams: (p: Partial<URLParams>) => void;
}) {
  const headerStyle: React.CSSProperties = {
    boxSizing: 'border-box',
    background: '#232f3e',
    paddingBlockStart: '12px',
    paddingBlockEnd: '11px',
    paddingInline: '12px',
    fontSize: '15px',
    fontWeight: 700,
    lineHeight: '17px',
    display: 'flex',
    color: '#eee',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...(sticky && {
      inlineSize: '100%',
      zIndex: 1000,
      insetBlockStart: 0,
      position: 'sticky' as const,
    }),
  };

  const linkStyle: React.CSSProperties = {
    textDecoration: 'none',
    color: '#eee',
  };

  return (
    <header id="h" style={headerStyle}>
      <a href="/" style={linkStyle}>
        Demo Assets
      </a>
      <ThemeSwitcher urlParams={urlParams} setUrlParams={setUrlParams} />
    </header>
  );
}

/**
 * Client-side effects for applying global styles and modes
 * These only run on the client after hydration
 */
function ClientEffects({ urlParams }: { urlParams: URLParams }) {
  useEffect(() => {
    // Apply mode (light/dark)
    import('@cloudscape-design/global-styles').then(({ applyMode, Mode }) => {
      applyMode(urlParams.mode === 'dark' ? Mode.Dark : Mode.Light);
    });
  }, [urlParams.mode]);

  useEffect(() => {
    // Apply density
    import('@cloudscape-design/global-styles').then(({ applyDensity, Density }) => {
      applyDensity(urlParams.density === 'compact' ? Density.Compact : Density.Comfortable);
    });
  }, [urlParams.density]);

  useEffect(() => {
    // Apply motion disabled
    import('@cloudscape-design/global-styles').then(({ disableMotion }) => {
      disableMotion(urlParams.motionDisabled);
    });
  }, [urlParams.motionDisabled]);

  useEffect(() => {
    // Apply direction
    document.documentElement.setAttribute('dir', urlParams.direction);
  }, [urlParams.direction]);

  return null;
}

/**
 * App shell component that wraps demo pages
 * Similar to pages/app/index.tsx but for SSR
 */
export default function App({ pageId, urlParams: initialUrlParams, isServer, children }: AppProps) {
  const [urlParams, setUrlParamsState] = useState(initialUrlParams);
  const isAppLayout = isAppLayoutPage(pageId);
  const ContentTag = isAppLayout ? 'div' : 'main';

  // Update URL params and sync to URL
  const setUrlParams = (newParams: Partial<URLParams>) => {
    const updatedParams = { ...urlParams, ...newParams };
    setUrlParamsState(updatedParams);

    // Update URL without reload (except for visualRefresh which needs reload)
    if (!isServer && !('visualRefresh' in newParams)) {
      const newUrl = pageId ? `/${pageId}${formatURLParams(updatedParams)}` : `/${formatURLParams(updatedParams)}`;
      window.history.replaceState({}, '', newUrl);
    }
  };

  // Header is always rendered outside the error boundary so users can still
  // toggle settings (like visual refresh) even when a page throws an error
  const header = (
    <Header
      sticky={isAppLayout && pageId !== undefined && !pageId.includes('legacy')}
      urlParams={urlParams}
      setUrlParams={setUrlParams}
    />
  );

  // Page content is wrapped in error boundary (client-side only)
  const pageContent = isServer ? children : <ErrorBoundary pageId={pageId}>{children}</ErrorBoundary>;

  // Wrap in Suspense on client side only (not supported in React 16 SSR)
  const suspenseWrapped = isServer ? (
    pageContent
  ) : (
    <Suspense fallback={<span>Loading...</span>}>{pageContent}</Suspense>
  );

  return (
    <AppContext.Provider value={{ pageId, urlParams, isServer, setUrlParams }}>
      {/* Client-side effects for applying global styles */}
      {!isServer && <ClientEffects urlParams={urlParams} />}

      <ContentTag>
        {header}
        {suspenseWrapped}
      </ContentTag>
    </AppContext.Provider>
  );
}
