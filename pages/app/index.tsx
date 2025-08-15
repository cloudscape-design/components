// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { Suspense, useContext, useEffect } from 'react';
import { render } from 'react-dom';
import { HashRouter, Redirect } from 'react-router-dom';
import { createHashHistory } from 'history';

import { applyDensity, applyMode, disableMotion } from '@cloudscape-design/global-styles';

import AppContext, { AppContextProvider, parseQuery } from './app-context';
import Header from './components/header';
import IndexPage from './components/index-page';
import PageView from './components/page-view';
import StrictModeWrapper from './components/strict-mode-wrapper';

// import font-size reset and Ember font
import '@cloudscape-design/global-styles/index.css';
// screenshot test overrides
import styles from './styles.scss';

interface GlobalFlags {
  appLayoutWidget?: boolean;
  appLayoutToolbar?: boolean;
}
// used for local dev / testing
interface CustomFlags {
  appLayoutDelayedWidget?: boolean;
}
const awsuiVisualRefreshFlag = Symbol.for('awsui-visual-refresh-flag');
const awsuiGlobalFlagsSymbol = Symbol.for('awsui-global-flags');
const awsuiCustomFlagsSymbol = Symbol.for('awsui-custom-flags');

interface ExtendedWindow extends Window {
  [awsuiVisualRefreshFlag]?: () => boolean;
  [awsuiGlobalFlagsSymbol]?: GlobalFlags;
  [awsuiCustomFlagsSymbol]?: CustomFlags;
}
declare const window: ExtendedWindow;

function isAppLayoutPage(pageId?: string) {
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
  ];
  return pageId !== undefined && appLayoutPages.some(match => pageId.includes(match));
}

function App() {
  const {
    mode,
    pageId,
    urlParams: { density, motionDisabled },
  } = useContext(AppContext);

  // AppLayout already contains <main>
  // Also, AppLayout pages should resemble the ConsoleNav 2.0 styles
  const isAppLayout = isAppLayoutPage(pageId);
  const ContentTag = isAppLayout ? 'div' : 'main';

  useEffect(() => {
    applyMode(mode ?? null);
  }, [mode]);

  useEffect(() => {
    applyDensity(density ?? null);
  }, [density]);

  useEffect(() => {
    disableMotion(motionDisabled);
  }, [motionDisabled]);

  if (!mode) {
    return <Redirect to="/light/" />;
  }
  return (
    <StrictModeWrapper pageId={pageId}>
      <Suspense fallback={<span>Loading...</span>}>
        <ContentTag>
          <Header sticky={isAppLayout && pageId !== undefined && pageId.indexOf('legacy') === -1} />
          {pageId ? <PageView pageId={pageId} /> : <IndexPage />}
        </ContentTag>
      </Suspense>
    </StrictModeWrapper>
  );
}

const history = createHashHistory();
const { direction, visualRefresh, appLayoutWidget, appLayoutToolbar, appLayoutDelayedWidget } = parseQuery(
  history.location.search
);

// The VR class needs to be set before any React rendering occurs.
window[awsuiVisualRefreshFlag] = () => visualRefresh;
if (!window[awsuiGlobalFlagsSymbol]) {
  window[awsuiGlobalFlagsSymbol] = {};
}
if (!window[awsuiCustomFlagsSymbol]) {
  window[awsuiCustomFlagsSymbol] = {};
}
window[awsuiGlobalFlagsSymbol].appLayoutWidget = appLayoutWidget;
window[awsuiGlobalFlagsSymbol].appLayoutToolbar = appLayoutToolbar;
window[awsuiCustomFlagsSymbol].appLayoutDelayedWidget = appLayoutDelayedWidget;

// Apply the direction value to the HTML element dir attribute
document.documentElement.setAttribute('dir', direction);

// Apply Safari-specific class to hide flaky scrollbars in tests
const lowerCaseUserAgent = navigator.userAgent.toLowerCase();
const isSafari = lowerCaseUserAgent.indexOf('safari') > -1 && lowerCaseUserAgent.indexOf('chrome') === -1;
if (isSafari) {
  document.body.classList.add(styles.safari);
} else {
  document.body.classList.remove(styles.safari);
}

render(
  <HashRouter>
    <AppContextProvider>
      <App />
    </AppContextProvider>
  </HashRouter>,
  document.getElementById('app')
);
