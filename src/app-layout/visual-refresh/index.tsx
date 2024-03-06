// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { AppLayoutInternalsProvider } from './context';
import { AppLayoutProps, AppLayoutPropsWithDefaults } from '../interfaces';
import Background from './background';
import Drawers from './drawers';
import Header from './header';
import Layout from './layout';
import Main from './main';
import Navigation from './navigation';
import Notifications from './notifications';
import SplitPanel from './split-panel';
import Tools from './tools';
import UniversalToolbar from './universal-toolbar';

const AppLayoutWithRef = React.forwardRef(function AppLayout(
  props: AppLayoutPropsWithDefaults,
  ref: React.Ref<AppLayoutProps.Ref>
) {
  return (
    <AppLayoutInternalsProvider {...props} ref={ref}>
      <SplitPanel>
        <Layout>
          <Background />

          <Navigation />

          <UniversalToolbar />

          <Header />

          <Main />

          <Notifications />

          <SplitPanel.Bottom />

          <Tools>
            <SplitPanel.Side />
          </Tools>

          <Drawers />
        </Layout>
      </SplitPanel>
    </AppLayoutInternalsProvider>
  );
});

export default AppLayoutWithRef;
