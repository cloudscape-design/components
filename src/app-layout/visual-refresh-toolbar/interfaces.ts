// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { BreadcrumbGroupProps } from '../../breadcrumb-group/interfaces';
import { SplitPanelSideToggleProps } from '../../internal/context/split-panel-context';
import { AppLayoutProps, AppLayoutPropsWithDefaults } from '../interfaces';
import { FocusControlMultipleStates, FocusControlState } from '../utils/use-focus-control';
import { SplitPanelFocusControlState } from '../utils/use-split-panel-focus-control';
import { VerticalLayoutOutput } from './compute-layout';

// Widgetization notice: structures in this file are shared multiple app layout instances, possibly different minor versions.
// Treat thsese structures as an API and do not make incompatible changes.
export interface AppLayoutInternals {
  ariaLabels: AppLayoutPropsWithDefaults['ariaLabels'];
  headerVariant: AppLayoutPropsWithDefaults['headerVariant'];
  placement: AppLayoutPropsWithDefaults['placement'];
  navigationOpen: AppLayoutPropsWithDefaults['navigationOpen'];
  navigationFocusControl: FocusControlState;
  navigation: React.ReactNode;
  splitPanelPosition: AppLayoutProps.SplitPanelPreferences['position'];
  splitPanelOpen: boolean;
  splitPanelControlId: string;
  splitPanelFocusControl: SplitPanelFocusControlState;
  splitPanelToggleConfig: SplitPanelSideToggleProps;
  isMobile: boolean;
  activeDrawer: AppLayoutProps.Drawer | undefined;
  activeDrawerSize: number;
  minDrawerSize: number;
  maxDrawerSize: number;
  minGlobalDrawersSizes: Record<string, number>;
  maxGlobalDrawersSizes: Record<string, number>;
  drawers: ReadonlyArray<AppLayoutProps.Drawer>;
  drawersFocusControl: FocusControlState;
  globalDrawersFocusControl: FocusControlMultipleStates;
  activeGlobalDrawersIds: ReadonlyArray<string>;
  activeGlobalDrawers: ReadonlyArray<AppLayoutProps.Drawer>;
  globalDrawers: ReadonlyArray<AppLayoutProps.Drawer>;
  activeGlobalDrawersSizes: Record<string, number>;
  stickyNotifications: AppLayoutPropsWithDefaults['stickyNotifications'];
  breadcrumbs: React.ReactNode;
  discoveredBreadcrumbs: BreadcrumbGroupProps | null;
  toolbarState: 'show' | 'hide';
  setToolbarState: (state: 'show' | 'hide') => void;
  verticalOffsets: VerticalLayoutOutput;
  drawersOpenQueue: ReadonlyArray<string>;
  setNotificationsHeight: (height: number) => void;
  setToolbarHeight: (height: number) => void;
  onSplitPanelToggle: () => void;
  onNavigationToggle: (open: boolean) => void;
  onActiveDrawerChange: (newDrawerId: string | null) => void;
  onActiveDrawerResize: (detail: { id: string; size: number }) => void;
  onActiveGlobalDrawersChange: (newDrawerId: string) => void;
  disableBodyScroll?: AppLayoutPropsWithDefaults['disableBodyScroll'];
}
