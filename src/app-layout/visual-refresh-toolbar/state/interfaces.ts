// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { AppLayoutProps } from '../../interfaces';
import { OnChangeParams } from '../../utils/use-drawers';
import { Focusable, FocusControlMultipleStates } from '../../utils/use-focus-control';
import { SplitPanelToggleProps, ToolbarProps } from '../toolbar';

export interface SharedProps {
  navigationOpen: boolean;
  ariaLabels: AppLayoutProps.Labels | undefined;
  navigation: React.ReactNode;
  onNavigationToggle?: (open: boolean) => void;
  navigationFocusRef: React.Ref<Focusable> | undefined;
  breadcrumbs: React.ReactNode;
  activeDrawerId: string | null;
  drawers: ReadonlyArray<AppLayoutProps.Drawer> | undefined;
  onActiveDrawerChange: ((drawerId: string | null, params: OnChangeParams) => void) | undefined;
  drawersFocusRef: React.Ref<Focusable> | undefined;
  bottomDrawersFocusRef?: React.Ref<Focusable> | undefined;
  globalDrawersFocusControl?: FocusControlMultipleStates | undefined;
  globalDrawers?: ReadonlyArray<AppLayoutProps.Drawer> | undefined;
  activeGlobalDrawersIds?: ReadonlyArray<string> | undefined;
  onActiveGlobalDrawersChange?: ((newDrawerId: string, params: OnChangeParams) => void) | undefined;
  splitPanel: React.ReactNode;
  splitPanelToggleProps: SplitPanelToggleProps | undefined;
  splitPanelFocusRef?: React.Ref<Focusable> | undefined;
  onSplitPanelToggle?: () => void;
  expandedDrawerId?: string | null;
  setExpandedDrawerId?: (value: string | null) => void;
  aiDrawer?: AppLayoutProps.Drawer | undefined;
  aiDrawerFocusRef: React.Ref<Focusable> | undefined;
  activeGlobalBottomDrawerId?: string | null;
  onActiveGlobalBottomDrawerChange?: (value: string | null, params: OnChangeParams) => void;
}

export type MergeProps = (
  ownProps: SharedProps,
  additionalProps: ReadonlyArray<Partial<SharedProps>>
) => ToolbarProps | null;
