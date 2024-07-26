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
  forceDeduplicationType?: 'primary' | 'secondary';
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

function mergeProps(ownProps: SharedProps, additionalProps: ReadonlyArray<Partial<SharedProps>>): ToolbarProps | null {
  const toolbar: ToolbarProps = {};
  for (const props of [ownProps, ...additionalProps]) {
    toolbar.ariaLabels = Object.assign(toolbar.ariaLabels ?? {}, props.ariaLabels);
    if (props.drawers && !checkAlreadyExists(!!toolbar.drawers, 'tools or drawers')) {
      toolbar.drawers = props.drawers;
      toolbar.activeDrawerId = props.activeDrawerId;
      toolbar.drawersFocusRef = props.drawersFocusRef;
      toolbar.onActiveDrawerChange = props.onActiveDrawerChange;
    }
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
  }
  return Object.keys(toolbar).length > 0 ? toolbar : null;
}

export function useMultiAppLayout(props: SharedProps) {
  const [registration, setRegistration] = useState<RegistrationState<SharedProps> | null>(null);
  const { forceDeduplicationType } = props;

  useLayoutEffect(() => {
    return awsuiPluginsInternal.appLayoutWidget.register(forceDeduplicationType, props =>
      setRegistration(props as RegistrationState<SharedProps>)
    );
  }, [forceDeduplicationType]);

  useLayoutEffect(() => {
    if (registration?.type === 'secondary') {
      registration.update(props);
    }
  });

  return {
    registered: !!registration?.type,
    toolbarProps: registration?.type === 'primary' ? mergeProps(props, registration.discoveredProps) : null,
  };
}
