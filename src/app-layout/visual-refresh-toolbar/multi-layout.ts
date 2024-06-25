// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useLayoutEffect, useRef, useState } from 'react';
import { warnOnce } from '@cloudscape-design/component-toolkit/internal';
import { AppLayoutProps, AppLayoutPropsWithDefaults } from '../interfaces';
import { awsuiPluginsInternal } from '../../internal/plugins/api';
import { ToolbarProps, SplitPanelToggleProps } from './toolbar';
import { Focusable } from '../utils/use-focus-control';
import { AppLayoutWidgetApiInternal } from '../../internal/plugins/controllers/app-layout-widget';

interface SharedProps {
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

function checkAlreadyExists(value: boolean, propName: keyof AppLayoutPropsWithDefaults) {
  if (value) {
    warnOnce(
      'AppLayout',
      `Another app layout instance on this page already defines the ${propName} property. This instance will be ignored.`
    );
    return true;
  }
  return false;
}

function mergeProps(ownProps: SharedProps, additionalProps: ReadonlyArray<Partial<SharedProps>>): ToolbarProps | null {
  const toolbar: ToolbarProps = {};
  for (const props of [ownProps, ...additionalProps]) {
    toolbar.ariaLabels = Object.assign(toolbar.ariaLabels ?? {}, props.ariaLabels);
    if (props.drawers && !checkAlreadyExists(!!toolbar.drawers, 'drawers')) {
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
    // TODO should be consolidated in drawers already
    // if (props.tools && checkAlreadyExists(toolbar, props, 'tools')) {
    //   // result.tools = props.tools;
    //   // result.toolsWidth = props.toolsWidth;
    //   toolbar.toolsOpen = props.toolsOpen;
    //   toolbar.onToolsChange = props.onToolsChange;
    //   toolbar.hasTools = true;
    // }
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
  const [discoveredProps, setDiscoveredProps] = useState<ReadonlyArray<Partial<SharedProps>>>([]);
  const registrationRef = useRef<ReturnType<AppLayoutWidgetApiInternal['register']>>();

  useLayoutEffect(() => {
    registrationRef.current = awsuiPluginsInternal.appLayoutWidget.register(props =>
      setDiscoveredProps(props as ReadonlyArray<Partial<SharedProps>>)
    );
    return () => {
      registrationRef.current?.cleanup();
    };
  }, []);

  useLayoutEffect(() => {
    if (registrationRef.current?.type === 'secondary') {
      registrationRef.current?.update(props);
    }
  });

  return {
    registered: registrationRef.current?.type,
    toolbarProps: registrationRef.current?.type === 'primary' ? mergeProps(props, discoveredProps) : null,
  };
}
