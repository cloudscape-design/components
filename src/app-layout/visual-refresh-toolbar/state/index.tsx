// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { ForwardedRef, useLayoutEffect, useState } from 'react';

import { createWidgetizedComponent } from '../../../internal/widgets';
import { AppLayoutProps } from '../../interfaces';
import { useGlobalScrollPadding } from '../../utils/use-global-scroll-padding';
import { AppLayoutInternalProps, AppLayoutState } from '../interfaces';
import { SkeletonSlotsAttributes } from '../skeleton/interfaces';
import { SharedProps } from '../skeleton/multi-layout';
import { useAppLayout } from './use-app-layout';
import { useSkeletonSlotsAttributes } from './use-skeleton-slots-attributes';

export interface StateManager {
  setState:
    | ((
        appLayoutState: AppLayoutState,
        skeletonAttributes: SkeletonSlotsAttributes,
        deduplicationProps: SharedProps | null
      ) => void)
    | undefined;
  hasToolbar: boolean;
  setToolbar: ((hasToolbar: boolean) => void) | undefined;
}

export interface AppLayoutStateProps {
  appLayoutProps: AppLayoutInternalProps;
  stateManager: React.MutableRefObject<StateManager>;
  forwardRef: ForwardedRef<AppLayoutProps.Ref>;
}

const getDeduplicationProps = (props: AppLayoutInternalProps, appLayoutState: AppLayoutState): SharedProps => {
  if (!appLayoutState.widgetizedState) {
    return {};
  }
  const state = appLayoutState.widgetizedState;
  return {
    breadcrumbs: props.breadcrumbs,
    // ariaLabels: state.ariaLabelsWithDrawers,
    ariaLabels: state.ariaLabels,
    navigation: state.navigation && !props.navigationTriggerHide,
    navigationOpen: state.navigationOpen,
    onNavigationToggle: state.onNavigationToggle,
    navigationFocusRef: state.navigationFocusControl.refs.toggle,
    activeDrawerId: state.activeDrawer?.id ?? null,
    // only pass it down if there are non-empty drawers or tools
    drawers: state.drawers?.length || !props.toolsHide ? state.drawers : undefined,
    globalDrawersFocusControl: state.globalDrawersFocusControl,
    globalDrawers: state.globalDrawers?.length ? state.globalDrawers : undefined,
    activeGlobalDrawersIds: state.activeGlobalDrawersIds,
    onActiveGlobalDrawersChange: state.onActiveGlobalDrawersChange,
    onActiveDrawerChange: state.onActiveDrawerChange,
    drawersFocusRef: state.drawersFocusControl.refs.toggle,
    splitPanel: props.splitPanel,
    splitPanelToggleProps: {
      ...state.splitPanelToggleConfig,
      active: props.splitPanelOpen,
      controlId: state.splitPanelControlId,
      position: state.splitPanelPosition,
    },
    splitPanelFocusRef: state.splitPanelFocusControl.refs.toggle,
    onSplitPanelToggle: state.onSplitPanelToggle,
    expandedDrawerId: state.expandedDrawerId,
    setExpandedDrawerId: state.setExpandedDrawerId,
  };
};

export const AppLayoutStateProvider = ({ appLayoutProps, stateManager, forwardRef }: AppLayoutStateProps) => {
  const [hasToolbar, setHasToolbar] = useState(stateManager.current.hasToolbar ?? true);
  const appLayoutState = useAppLayout(hasToolbar, appLayoutProps, forwardRef);
  const skeletonSlotsAttributes = useSkeletonSlotsAttributes(hasToolbar, appLayoutProps, appLayoutState);

  useGlobalScrollPadding(appLayoutState.widgetizedState?.verticalOffsets.header ?? 0);

  useLayoutEffect(() => {
    if (!stateManager.current?.setState) {
      console.warn('AppLayout state manager is not found');
      return;
    }
    stateManager.current.setState(
      appLayoutState,
      skeletonSlotsAttributes,
      appLayoutState.isIntersecting ? getDeduplicationProps(appLayoutProps, appLayoutState) : null
    );
  });

  useLayoutEffect(() => {
    stateManager.current.setToolbar = setHasToolbar;
  }, [stateManager]);

  return <></>;
};

export const createWidgetizedAppLayoutState = createWidgetizedComponent(AppLayoutStateProvider);
