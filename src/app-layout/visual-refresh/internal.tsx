// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { AppLayoutInternalsProvider } from './context';
import SplitPanel from './split-panel';
import Layout from './layout';
import Background from './background';
import Navigation from './navigation';
import MobileToolbar from './mobile-toolbar';
import Notifications from './notifications';
import Breadcrumbs from './breadcrumbs';
import Header from './header';
import Main from './main';
import Tools from './tools';
import Drawers from './drawers';
import React from 'react';
import { AppLayoutProps } from '../interfaces';

export const AppLayoutRefreshInternal = React.forwardRef<AppLayoutProps.Ref, AppLayoutProps>(
  function AppLayoutRefreshInternal(props, ref) {
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
  }
);
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
