// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { AppLayoutInternalsProvider } from './context';
import { AppLayoutProps, AppLayoutPropsWithDefaults } from '../interfaces';
import { Layout } from './layout';
import { SplitPanelProviderVR } from './split-panel';

const AppLayoutWithRef = React.forwardRef(function AppLayout(
  props: AppLayoutPropsWithDefaults,
  ref: React.Ref<AppLayoutProps.Ref>
) {
  return (
    <AppLayoutInternalsProvider {...props} ref={ref}>
      <SplitPanelProviderVR>
        <Layout />
      </SplitPanelProviderVR>
    </AppLayoutInternalsProvider>
  );
});

export default AppLayoutWithRef;
