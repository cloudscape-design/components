// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useContext } from 'react';

import { getGlobalFlag } from '@cloudscape-design/component-toolkit/internal';

import { useVisualRefresh } from '../../internal/hooks/use-visual-mode';
import { AppLayoutToolbarPublicContext } from '../visual-refresh-toolbar/contexts';

//   useAppLayoutFlagEnabled is set to true only in consoles. It controls if AppLayout theme is toolbar
export const useAppLayoutFlagEnabled = () => {
  const isRefresh = useVisualRefresh();
  return isRefresh && (getGlobalFlag('appLayoutWidget') || getGlobalFlag('appLayoutToolbar'));
};

// AppLayoutToolbar component will have 2 modes:
//   - for those who use AppLayout component with toolbar. they expect to have all existing features, including deduplication
//   - for non-console usage. in this case we don't need "hidden" features to be enabled, now it's only deduplication
// the hooks I want to name will exist only internally to control this behavior
export const useAppLayoutToolbarDesignEnabled = () => {
  const isToolbarPrivate = useAppLayoutFlagEnabled();
  const isToolbarPublic = useContext(AppLayoutToolbarPublicContext) ?? false;

  return isToolbarPublic || isToolbarPrivate;
};

export const isAppLayoutHideToolbarBreadcrumbsEnabled = () => !!getGlobalFlag('appLayoutHideToolbarBreadcrumbs');

// Flags not yet declared in component-toolkit's GlobalFlags.
// Remove once component-toolkit declares them, and call getGlobalFlag directly.
export interface PendingGlobalFlags {
  appLayoutHideToolbar?: boolean;
  appLayoutSimplifiedView?: boolean;
}

type ToolkitFlagName = Parameters<typeof getGlobalFlag>[0];

const getPendingGlobalFlag = <FlagName extends keyof PendingGlobalFlags>(
  flagName: FlagName
): PendingGlobalFlags[FlagName] | undefined =>
  getGlobalFlag(flagName as unknown as ToolkitFlagName) as PendingGlobalFlags[FlagName] | undefined;

export const isAppLayoutHideToolbar = () => !!getPendingGlobalFlag('appLayoutHideToolbar');
export const isAppLayoutSimplifiedView = () => !!getPendingGlobalFlag('appLayoutSimplifiedView');
