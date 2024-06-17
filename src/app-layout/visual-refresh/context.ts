// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { createContext, useContext } from 'react';
import { AppLayoutProps, AppLayoutPropsWithDefaults } from '../interfaces';
import { FocusControlState } from '../utils/use-focus-control';
import { SplitPanelFocusControlState } from '../utils/use-split-panel-focus-control';
import { SplitPanelSideToggleProps } from '../../internal/context/split-panel-context';
import { VerticalLayoutOutput } from './compute-layout';

interface AppLayoutInternals {
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
  drawers: ReadonlyArray<AppLayoutProps.Drawer>;
  drawersFocusControl: FocusControlState;
  stickyNotifications: AppLayoutPropsWithDefaults['stickyNotifications'];
  breadcrumbs: React.ReactNode;
  toolbarState: 'show' | 'hide';
  setToolbarState: (state: 'show' | 'hide') => void;
  verticalOffsets: VerticalLayoutOutput;
  notificationsRef: React.Ref<HTMLElement>;
  toolbarRef: React.Ref<HTMLElement>;
  onSplitPanelToggle: () => void;
  onNavigationToggle: (open: boolean) => void;
  onActiveDrawerChange: (newDrawerId: string | null) => void;
  onActiveDrawerResize: (detail: { id: string; size: number }) => void;
}

export const AppLayoutInternalsContext = createContext<AppLayoutInternals | null>(null);

export function useAppLayoutInternals() {
  const ctx = useContext(AppLayoutInternalsContext);
  if (!ctx) {
    throw new Error('Invariant violation: this context is only available inside app layout');
  }
  return ctx;
}
