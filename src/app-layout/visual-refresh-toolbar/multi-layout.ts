// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useLayoutEffect, useState } from 'react';

import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

import { awsuiPluginsInternal } from '../../internal/plugins/api';
import { RegistrationState } from '../../internal/plugins/controllers/app-layout-widget';
import { AppLayoutProps } from '../interfaces';
import { useAppLayoutFlagEnabled } from '../utils/feature-flags';
import { OnChangeParams } from '../utils/use-drawers';
import { Focusable, FocusControlMultipleStates } from '../utils/use-focus-control';
import { SplitPanelToggleProps, ToolbarProps } from './toolbar';

export interface SharedProps {
  forceDeduplicationType?: 'primary' | 'secondary' | 'suspended' | 'off';
  ariaLabels: AppLayoutProps.Labels | undefined;
  navigation: React.ReactNode;
  navigationOpen: boolean;
  onNavigationToggle: (open: boolean) => void;
  navigationFocusRef: React.Ref<Focusable> | undefined;
  breadcrumbs: React.ReactNode;
  activeDrawerId: string | null;
  drawers: ReadonlyArray<AppLayoutProps.Drawer> | undefined;
  onActiveDrawerChange: ((drawerId: string | null, params: OnChangeParams) => void) | undefined;
  drawersFocusRef: React.Ref<Focusable> | undefined;
  globalDrawersFocusControl?: FocusControlMultipleStates | undefined;
  globalDrawers?: ReadonlyArray<AppLayoutProps.Drawer> | undefined;
  activeGlobalDrawersIds?: Array<string> | undefined;
  onActiveGlobalDrawersChange?: ((newDrawerId: string, params: OnChangeParams) => void) | undefined;
  splitPanel: React.ReactNode;
  splitPanelToggleProps: SplitPanelToggleProps | undefined;
  splitPanelFocusRef: React.Ref<Focusable> | undefined;
  onSplitPanelToggle: () => void;
  expandedDrawerId?: string | null;
  setExpandedDrawerId: (value: string | null) => void;
}

function checkAlreadyExists(value: boolean, propName: string) {
  if (value) {
    warnOnce(
      'AppLayout',
      `Another app layout instance on this page already defines ${propName} property. This instance will be ignored.`
    );
    return true;
  }
  return false;
}

export function mergeProps(
  ownProps: SharedProps,
  additionalProps: ReadonlyArray<Partial<SharedProps>>
): ToolbarProps | null {
  const toolbar: ToolbarProps = {};
  for (const props of [ownProps, ...additionalProps]) {
    toolbar.ariaLabels = Object.assign(toolbar.ariaLabels ?? {}, props.ariaLabels);
    if (
      props.drawers &&
      props.drawers.some(drawer => drawer.trigger) &&
      !checkAlreadyExists(!!toolbar.drawers, 'tools or drawers')
    ) {
      toolbar.drawers = props.drawers;
      toolbar.activeDrawerId = props.activeDrawerId;
      toolbar.drawersFocusRef = props.drawersFocusRef;
      toolbar.onActiveDrawerChange = props.onActiveDrawerChange;
    }
    if (props.globalDrawers && !checkAlreadyExists(!!toolbar.globalDrawers, 'globalDrawers')) {
      toolbar.globalDrawersFocusControl = props.globalDrawersFocusControl;
      toolbar.globalDrawers = props.globalDrawers;
      toolbar.activeGlobalDrawersIds = props.activeGlobalDrawersIds;
      toolbar.onActiveGlobalDrawersChange = props.onActiveGlobalDrawersChange;
    }
    if (props.navigation && !checkAlreadyExists(!!toolbar.hasNavigation, 'navigation')) {
      toolbar.hasNavigation = true;
      toolbar.navigationOpen = props.navigationOpen;
      toolbar.navigationFocusRef = props.navigationFocusRef;
      toolbar.onNavigationToggle = props.onNavigationToggle;
    }
    if (
      props.splitPanel &&
      props.splitPanelToggleProps?.displayed &&
      !checkAlreadyExists(!!toolbar.hasSplitPanel, 'splitPanel')
    ) {
      toolbar.hasSplitPanel = true;
      toolbar.splitPanelFocusRef = props.splitPanelFocusRef;
      toolbar.splitPanelToggleProps = props.splitPanelToggleProps;
      toolbar.onSplitPanelToggle = props.onSplitPanelToggle;
    }
    if (props.breadcrumbs && !checkAlreadyExists(!!toolbar.hasBreadcrumbsPortal, 'hasBreadcrumbsPortal')) {
      toolbar.hasBreadcrumbsPortal = true;
    }
    if (props.expandedDrawerId && !checkAlreadyExists(!!toolbar.expandedDrawerId, 'expandedDrawerId')) {
      toolbar.expandedDrawerId = props.expandedDrawerId;
      toolbar.setExpandedDrawerId = props.setExpandedDrawerId;
    }
  }
  // do not render toolbar if no fields are defined, except ariaLabels, which are always there
  return Object.keys(toolbar).filter(key => key !== 'ariaLabels').length > 0 ? toolbar : null;
}

export function useMultiAppLayout(props: SharedProps, isEnabled: boolean) {
  const [registration, setRegistration] = useState<RegistrationState<SharedProps> | null>(null);
  const { forceDeduplicationType } = props;
  const isToolbar = useAppLayoutFlagEnabled();

  useLayoutEffect(() => {
    if (!isEnabled || forceDeduplicationType === 'suspended' || !isToolbar) {
      return;
    }
    if (forceDeduplicationType === 'off') {
      setRegistration({ type: 'primary', discoveredProps: [] });
      return;
    }
    return awsuiPluginsInternal.appLayoutWidget.register(forceDeduplicationType, props =>
      setRegistration(props as RegistrationState<SharedProps>)
    );
  }, [forceDeduplicationType, isEnabled, isToolbar]);

  useLayoutEffect(() => {
    if (registration?.type === 'secondary') {
      registration.update(props);
    }
  });

  if (!isToolbar) {
    return {
      registered: 'primary',
      // mergeProps is needed here because the toolbar's behavior depends on reconciliation logic
      // in this function. For example, navigation trigger visibility
      toolbarProps: mergeProps(props, []),
    };
  }

  return {
    registered: !!registration?.type,
    toolbarProps: registration?.type === 'primary' ? mergeProps(props, registration.discoveredProps) : null,
  };
}
