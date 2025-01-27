// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useContext } from 'react';

import { getGlobalFlag } from '@cloudscape-design/component-toolkit/internal';

import { AppLayoutToolbarEnabledContext } from '../../app-layout/visual-refresh-toolbar/contexts';
import { useVisualRefresh } from '../../internal/hooks/use-visual-mode';

export const useAppLayoutToolbarEnabled = () => {
  // this is useful for the public app layout component, because it does not rely on the feature flags,
  // but uses the toolbar version of the app layout
  const isToolbarEnabled = useContext(AppLayoutToolbarEnabledContext) ?? false;

  const isRefresh = useVisualRefresh();
  return isToolbarEnabled || (isRefresh && (getGlobalFlag('appLayoutWidget') || getGlobalFlag('appLayoutToolbar')));
};
