// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import ClassicAppLayout from './classic';
import { AppLayoutProps, AppLayoutPropsWithDefaults } from './interfaces';
import { useAppLayoutToolbarEnabled } from './utils/feature-flags';
import RefreshedAppLayout from './visual-refresh';
import ToolbarAppLayout from './visual-refresh-toolbar';

export const AppLayoutInternal = React.forwardRef<AppLayoutProps.Ref, AppLayoutPropsWithDefaults>((props, ref) => {
  const isRefresh = useVisualRefresh();
  const isToolbar = useAppLayoutToolbarEnabled();
  if (isRefresh) {
    if (isToolbar) {
      return <ToolbarAppLayout ref={ref} {...props} />;
    } else {
      return <RefreshedAppLayout ref={ref} {...props} />;
    }
  }
  return <ClassicAppLayout ref={ref} {...props} />;
});
