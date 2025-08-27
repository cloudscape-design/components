// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

import { AppLayoutInternalProps, AppLayoutPendingState } from '../interfaces';
import { ToolbarProps } from '../toolbar';
import { MergeProps, SharedProps } from './interfaces';

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

export const mergeProps: MergeProps = (ownProps, additionalProps) => {
  const toolbar: ToolbarProps = {};
  for (const props of [ownProps, ...additionalProps]) {
    toolbar.ariaLabels = { ...toolbar.ariaLabels, ...props.ariaLabels };
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
};

export const getPropsToMerge = (props: AppLayoutInternalProps, appLayoutState: AppLayoutPendingState): SharedProps => {
  const state = appLayoutState.widgetizedState;
  return {
    breadcrumbs: props.breadcrumbs,
    ariaLabels: state ? state.ariaLabels : props.ariaLabels,
    navigation: !props.navigationTriggerHide && !props.navigationHide,
    navigationOpen: state ? state.navigationOpen : props.navigationOpen,
    onNavigationToggle: state?.onNavigationToggle,
    navigationFocusRef: state?.navigationFocusControl.refs.toggle,
    activeDrawerId: state?.activeDrawer?.id ?? null,
    // only pass it down if there are non-empty drawers or tools
    drawers: state?.drawers?.length || !props.toolsHide ? state?.drawers : undefined,
    globalDrawersFocusControl: state?.globalDrawersFocusControl,
    globalDrawers: state?.globalDrawers?.length ? state.globalDrawers : undefined,
    activeGlobalDrawersIds: state?.activeGlobalDrawersIds,
    onActiveGlobalDrawersChange: state?.onActiveGlobalDrawersChange,
    onActiveDrawerChange: state?.onActiveDrawerChange,
    drawersFocusRef: state?.drawersFocusControl.refs.toggle,
    splitPanel: props.splitPanel,
    splitPanelToggleProps: state?.splitPanelToggleConfig && {
      ...state.splitPanelToggleConfig,
      active: state?.splitPanelOpen,
      controlId: state?.splitPanelControlId,
      position: state?.splitPanelPosition,
    },
    splitPanelFocusRef: state?.splitPanelFocusControl.refs.toggle,
    onSplitPanelToggle: state?.onSplitPanelToggle,
    expandedDrawerId: state?.expandedDrawerId,
    setExpandedDrawerId: state?.setExpandedDrawerId,
  };
};
