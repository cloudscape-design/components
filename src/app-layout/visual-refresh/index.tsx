// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { AppLayoutInternalsProvider } from './context';
import { AppLayoutProps } from '../interfaces';
import Background from './background';
import Drawers from './drawers';
import Header from './header';
import Layout from './layout';
import Main from './main';
import MobileToolbar from './mobile-toolbar';
import Navigation from './navigation';
import Notifications from './notifications';
import SplitPanel from './split-panel';
import Tools from './tools';

const AppLayoutWithRef = React.forwardRef(function AppLayout(
  props: AppLayoutProps,
  ref: React.Ref<AppLayoutProps.Ref>
) {
  return (
    <AppLayoutInternalsProvider {...props} ref={ref}>
      <SplitPanel>
        <Layout>
          <Background />

          <Navigation />

          <MobileToolbar />

          <Notifications />

          <Header />

          <Main />

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
