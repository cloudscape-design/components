// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { AppLayoutProps, AppLayoutPropsWithDefaults } from '../interfaces.js';
import Background from './background.js';
import Breadcrumbs from './breadcrumbs.js';
import { AppLayoutInternalsProvider } from './context.js';
import Drawers from './drawers.js';
import Header from './header.js';
import Layout from './layout.js';
import Main from './main.js';
import MobileToolbar from './mobile-toolbar.js';
import Navigation from './navigation.js';
import Notifications from './notifications.js';
import SplitPanel from './split-panel.js';
import Tools from './tools.js';

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

          <MobileToolbar />

          <Notifications />

          <Breadcrumbs />

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
