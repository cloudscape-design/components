// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import AppBar from './app-bar';
import { AppLayoutInternalsProvider } from './context';
import { AppLayoutProps } from '../interfaces';
import Background from './background';
import Drawers from './drawers';
import Header from './header';
import Layout from './layout';
import Main from './main';
import Navigation from './navigation';
import Notifications from './notifications';
import SplitPanel from './split-panel';
import Tools from './tools';
import { useMobile } from '../../internal/hooks/use-mobile';

/**
 * In mobile viewports the AppBar position changes to sticky and is placed
 * above the notifications. This is handled by adjusting the row positions
 * in CSS for the AppBar and Notifications components relative to the grid
 * definition in the Layout component. In order to keep alignment between
 * the visual ordering and logical ordering of the document the logical order
 * of these components is also modified in the markup below.
 */
const AppLayoutWithRef = React.forwardRef(function AppLayout(
  props: AppLayoutProps,
  ref: React.Ref<AppLayoutProps.Ref>
) {
  const isMobile = useMobile();

  return (
    <AppLayoutInternalsProvider {...props} ref={ref}>
      <SplitPanel>
        <Layout>
          <Background />

          <Navigation />

          {isMobile && <AppBar />}

          <Notifications />

          {!isMobile && <AppBar />}

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
