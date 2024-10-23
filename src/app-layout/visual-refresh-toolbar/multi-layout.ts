// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useLayoutEffect, useState } from 'react';

import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

import { awsuiPluginsInternal } from '../../internal/plugins/api';
import { RegistrationState } from '../../internal/plugins/controllers/app-layout-widget';
import { AppLayoutProps } from '../interfaces';
import { Focusable } from '../utils/use-focus-control';
import { SplitPanelToggleProps, ToolbarProps } from './toolbar';

interface SharedProps {
  forceDeduplicationType?: 'primary' | 'secondary' | 'suspended' | 'off';
  ariaLabels: AppLayoutProps.Labels | undefined;
  navigation: React.ReactNode;
  navigationOpen: boolean;
  onNavigationToggle: (open: boolean) => void;
  navigationFocusRef: React.Ref<Focusable> | undefined;
  breadcrumbs: React.ReactNode;
  activeDrawerId: string | null;
  drawers: ReadonlyArray<AppLayoutProps.Drawer> | undefined;
  onActiveDrawerChange: ((drawerId: string | null) => void) | undefined;
  drawersFocusRef: React.Ref<Focusable> | undefined;
  splitPanel: React.ReactNode;
  splitPanelToggleProps: SplitPanelToggleProps;
  splitPanelFocusRef: React.Ref<Focusable> | undefined;
  onSplitPanelToggle: () => void;
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
    if (props.drawers && !checkAlreadyExists(!!toolbar.drawers, 'tools or drawers')) {
      toolbar.drawers = props.drawers;
      toolbar.activeDrawerId = props.activeDrawerId;
      toolbar.drawersFocusRef = props.drawersFocusRef;
      toolbar.onActiveDrawerChange = props.onActiveDrawerChange;
    }
    //there is never a case where navigation will exist and a toggle will not
    if (props.navigation && !checkAlreadyExists(!!toolbar.hasNavigation, 'navigation')) {
      toolbar.hasNavigation = true;
      toolbar.navigationOpen = props.navigationOpen;
      toolbar.navigationFocusRef = props.navigationFocusRef;
      toolbar.onNavigationToggle = props.onNavigationToggle;
    }
    if (props.splitPanel && !checkAlreadyExists(!!toolbar.hasSplitPanel, 'splitPanel')) {
      toolbar.hasSplitPanel = true;
      toolbar.splitPanelFocusRef = props.splitPanelFocusRef;
      toolbar.splitPanelToggleProps = props.splitPanelToggleProps;
      toolbar.onSplitPanelToggle = props.onSplitPanelToggle;
    }
    if (props.breadcrumbs && !checkAlreadyExists(!!toolbar.hasBreadcrumbsPortal, 'hasBreadcrumbsPortal')) {
      toolbar.hasBreadcrumbsPortal = true;
    }
  }
  // do not render toolbar if no fields are defined, except ariaLabels, which are always there
  return Object.keys(toolbar).filter(key => key !== 'ariaLabels').length > 0 ? toolbar : null;
}

export function useMultiAppLayout(props: SharedProps, isEnabled: boolean) {
  const [registration, setRegistration] = useState<RegistrationState<SharedProps> | null>(null);
  const { forceDeduplicationType } = props;

  useLayoutEffect(() => {
    if (!isEnabled || forceDeduplicationType === 'suspended') {
      return;
    }
    if (forceDeduplicationType === 'off') {
      setRegistration({ type: 'primary', discoveredProps: [] });
      return;
    }
    return awsuiPluginsInternal.appLayoutWidget.register(forceDeduplicationType, props =>
      setRegistration(props as RegistrationState<SharedProps>)
    );
  }, [forceDeduplicationType, isEnabled]);

  useLayoutEffect(() => {
    if (registration?.type === 'secondary') {
      registration.update(props);
    }
  });

  return {
    registered: !!registration?.type,
    toolbarProps:
      registration?.type === 'primary' ? mergeProps(props, registration.discoveredProps) : null,
  };
}
