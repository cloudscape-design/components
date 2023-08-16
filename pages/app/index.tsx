// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { Suspense, useContext, useEffect } from 'react';
import { render } from 'react-dom';
import { HashRouter, Redirect } from 'react-router-dom';
import { createHashHistory } from 'history';
import { applyMode, applyDensity, disableMotion } from '@cloudscape-design/global-styles';

// import font-size reset and Ember font
import '@cloudscape-design/global-styles/index.css';
// screenshot test overrides
import styles from './styles.scss';

import PageView from './components/page-view';
import IndexPage from './components/index-page';
import Header from './components/header';
import StrictModeWrapper from './components/strict-mode-wrapper';
import AppContext, { AppContextProvider, parseQuery } from './app-context';

function App() {
  const {
    mode,
    pageId,
    urlParams: { density, motionDisabled },
  } = useContext(AppContext);

  const isAppLayout = pageId !== undefined && (pageId.includes('app-layout') || pageId.includes('content-layout'));
  // AppLayout already contains <main>
  // Also, AppLayout pages should resemble the ConsoleNav 2.0 styles
  const ContentTag = isAppLayout ? 'div' : 'main';
  const isMacOS = navigator.userAgent.toLowerCase().indexOf('macintosh') > -1;

  useEffect(() => {
    applyMode(mode ?? null);
  }, [mode]);

  useEffect(() => {
    applyDensity(density ?? null);
  }, [density]);

  useEffect(() => {
    disableMotion(motionDisabled);
  }, [motionDisabled]);

  useEffect(() => {
    if (isMacOS) {
      document.body.classList.add(styles.macos);
    } else {
      document.body.classList.remove(styles.macos);
    }
  }, [isMacOS]);

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
const { visualRefresh } = parseQuery(history.location.search);

// The VR class needs to be set before any React rendering occurs.
document.body.classList.toggle('awsui-visual-refresh', visualRefresh);

render(
  <HashRouter>
    <AppContextProvider>
      <App />
    </AppContextProvider>
  </HashRouter>,
  document.getElementById('app')
);
