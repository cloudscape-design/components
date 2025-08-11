// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { useVisualRefresh } from '../internal/hooks/use-visual-mode/index.js';
import ClassicAppLayout from './classic.js';
import { AppLayoutProps, AppLayoutPropsWithDefaults } from './interfaces.js';
import { useAppLayoutFlagEnabled } from './utils/feature-flags.js';
import RefreshedAppLayout from './visual-refresh/index.js';
import ToolbarAppLayout from './visual-refresh-toolbar/index.js';

export const AppLayoutInternal = React.forwardRef<AppLayoutProps.Ref, AppLayoutPropsWithDefaults>((props, ref) => {
  const isRefresh = useVisualRefresh();
  const isToolbar = useAppLayoutFlagEnabled();
  if (isRefresh) {
    if (isToolbar) {
      return <ToolbarAppLayout ref={ref} {...props} />;
    } else {
      return <RefreshedAppLayout ref={ref} {...props} />;
    }
  }
  return <ClassicAppLayout ref={ref} {...props} />;
});
