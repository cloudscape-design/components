// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { BreadcrumbGroupProps } from '../../breadcrumb-group/interfaces';
import { SplitPanelSideToggleProps } from '../../internal/context/split-panel-context';
import { SomeOptional } from '../../internal/types';
import { AppLayoutProps, AppLayoutPropsWithDefaults } from '../interfaces';
import { SplitPanelProviderProps } from '../split-panel';
import { OnChangeParams } from '../utils/use-drawers';
import { FocusControlMultipleStates, FocusControlState } from '../utils/use-focus-control';
import { SplitPanelFocusControlState } from '../utils/use-split-panel-focus-control';
import { VerticalLayoutOutput } from './compute-layout';

export interface AppLayoutInternalProps extends AppLayoutPropsWithDefaults {
  navigationTriggerHide?: boolean;
}

export type InternalDrawer = AppLayoutProps.Drawer & {
  defaultActive?: boolean;
  isExpandable?: boolean;
  ariaLabels: AppLayoutProps.Drawer['ariaLabels'] & { expandedModeButton?: string };
};

// Widgetization notice: structures in this file are shared multiple app layout instances, possibly different minor versions.
// Treat these structures as an API and do not make incompatible changes.
// Legacy widget interface
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
  activeDrawer: InternalDrawer | undefined;
  activeDrawerSize: number;
  minDrawerSize: number;
  maxDrawerSize: number;
  minGlobalDrawersSizes: Record<string, number>;
  maxGlobalDrawersSizes: Record<string, number>;
  drawers: ReadonlyArray<InternalDrawer>;
  drawersFocusControl: FocusControlState;
  globalDrawersFocusControl: FocusControlMultipleStates;
  activeGlobalDrawersIds: ReadonlyArray<string>;
  activeGlobalDrawers: ReadonlyArray<InternalDrawer>;
  globalDrawers: ReadonlyArray<InternalDrawer>;
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
  onActiveDrawerChange: (newDrawerId: string | null, params: OnChangeParams) => void;
  onActiveDrawerResize: (detail: { id: string; size: number }) => void;
  onActiveGlobalDrawersChange: (newDrawerId: string, params: OnChangeParams) => void;
  splitPanelAnimationDisabled?: boolean;
  expandedDrawerId: string | null;
  setExpandedDrawerId: (value: string | null) => void;
}

interface AppLayoutWidgetizedState extends AppLayoutInternals {
  isNested: boolean;
  verticalOffsets: VerticalLayoutOutput;
  navigationAnimationDisabled: boolean;
  splitPanelOffsets: {
    stickyVerticalBottomOffset: number;
    mainContentPaddingBlockEnd: number | undefined;
  };
}

// New widget interface
export interface AppLayoutState {
  rootRef: React.Ref<HTMLElement>;
  isIntersecting: boolean;
  // new state management
  widgetizedState: AppLayoutWidgetizedState;
  // the old object shape for backward compatibility
  appLayoutInternals: AppLayoutInternals;
  splitPanelInternals: SplitPanelProviderProps;
}

export type AppLayoutPendingState = SomeOptional<
  AppLayoutState,
  'appLayoutInternals' | 'splitPanelInternals' | 'widgetizedState' | 'rootRef'
>;
