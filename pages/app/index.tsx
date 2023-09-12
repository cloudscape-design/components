// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { Suspense, useContext, useEffect } from 'react';
import { render } from 'react-dom';
import { HashRouter } from 'react-router-dom';
import { applyDensity, disableMotion } from '@cloudscape-design/global-styles';

// import font-size reset and Ember font
import '@cloudscape-design/global-styles/index.css';
// screenshot test overrides
import styles from './styles.scss';

import PageView from './components/page-view';
import IndexPage from './components/index-page';
import StrictModeWrapper from './components/strict-mode-wrapper';
import AppContext, { AppContextProvider } from './app-context';

function isAppLayoutPage(pageId?: string) {
  const appLayoutPages = ['app-layout', 'content-layout', 'grid-navigation-custom'];
  return pageId !== undefined && appLayoutPages.some(match => pageId.includes(match));
}

function App() {
  const {
    pageId,
    urlParams: { density, motionDisabled },
  } = useContext(AppContext);

  // AppLayout already contains <main>
  // Also, AppLayout pages should resemble the ConsoleNav 2.0 styles
  const isAppLayout = isAppLayoutPage(pageId);
  const ContentTag = isAppLayout ? 'div' : 'main';
  const isMacOS = navigator.userAgent.toLowerCase().indexOf('macintosh') > -1;

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

  return (
    <StrictModeWrapper pageId={pageId}>
      <Suspense fallback={<span>Loading...</span>}>
        <ContentTag>{pageId ? <PageView pageId={pageId} /> : <IndexPage />}</ContentTag>
      </Suspense>
    </StrictModeWrapper>
  );
}

render(
  <HashRouter>
    <AppContextProvider>
      <App />
    </AppContextProvider>
  </HashRouter>,
  document.getElementById('app')
);
