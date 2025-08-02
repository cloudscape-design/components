// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

import ScreenreaderOnly from '../../internal/components/screenreader-only';
import { AppLayoutProps } from '../interfaces';
import { AppLayoutVisibilityContext } from './contexts';
import { AppLayoutInternalProps, AppLayoutState } from './interfaces';
import { AppLayoutWidgetizedState } from './internal';
import { SkeletonLayout } from './skeleton';
import { SkeletonSlotsAttributes } from './skeleton/interfaces';
import { DeduplicationType, SharedProps, useMultiAppLayout } from './skeleton/multi-layout';
import { StateManager } from './state';
import { ToolbarProps } from './toolbar';

const AppLayoutStateProvider: React.FC<{
  forceDeduplicationType: DeduplicationType;
  appLayoutProps: AppLayoutInternalProps;
  stateManager: React.MutableRefObject<StateManager>;
  children: (
    registered: boolean,
    appLayoutState: AppLayoutState,
    toolbarProps: ToolbarProps | null,
    skeletonAttributes: SkeletonSlotsAttributes
  ) => React.ReactNode;
}> = ({ forceDeduplicationType, appLayoutProps, stateManager, children }) => {
  const [appLayoutState, setAppLayoutState] = useState<AppLayoutState>(() => ({}) as any);
  const [skeletonAttributes, setSkeletonAttributes] = useState<SkeletonSlotsAttributes>(() => ({}));
  const [deduplicationProps, setDeduplicationProps] = useState<SharedProps | null>(() => ({
    navigation: resolvedNavigation && !appLayoutProps.navigationTriggerHide,
    navigationOpen: resolvedNavigationOpen,
    breadcrumbs: appLayoutProps.breadcrumbs,
  }));

  const resolvedNavigation = appLayoutProps.navigationHide ? null : appLayoutProps.navigation || <></>;
  const resolvedNavigationOpen = !!resolvedNavigation && appLayoutProps.navigationOpen;

  const { registered, toolbarProps } = useMultiAppLayout(forceDeduplicationType, deduplicationProps);
  const hasToolbar = !!toolbarProps;

  useLayoutEffect(() => {
    stateManager.current.setState = (appLayoutState, skeletonAttributes, deduplicationProps) => {
      // TODO: add equality check before setting?
      setAppLayoutState(appLayoutState);
      setSkeletonAttributes(skeletonAttributes);
      setDeduplicationProps(deduplicationProps);
    };
  }, [stateManager]);

  useEffect(() => {
    stateManager.current.hasToolbar = hasToolbar;
    stateManager.current.setToolbar?.(hasToolbar);
  }, [stateManager, hasToolbar]);

  return <>{children(registered, appLayoutState, toolbarProps, skeletonAttributes)}</>;
};

const AppLayoutVisualRefreshToolbar = React.forwardRef<AppLayoutProps.Ref, AppLayoutInternalProps>(
  (props, forwardRef) => {
    const stateManager = useRef<StateManager>({ setState: undefined, hasToolbar: true, setToolbar: undefined });
    const { __forceDeduplicationType: forceDeduplicationType, __embeddedViewMode: embeddedViewMode } = props as any;

    return (
      <>
        <AppLayoutStateProvider
          forceDeduplicationType={forceDeduplicationType}
          appLayoutProps={props}
          stateManager={stateManager}
        >
          {(registered, appLayoutState, toolbarProps, skeletonAttributes) => (
            <AppLayoutVisibilityContext.Provider value={appLayoutState.isIntersecting}>
              {/* Rendering a hidden copy of breadcrumbs to trigger their deduplication */}
              {(embeddedViewMode || !toolbarProps) && props.breadcrumbs ? (
                <ScreenreaderOnly>{props.breadcrumbs}</ScreenreaderOnly>
              ) : null}
              <SkeletonLayout
                registered={registered}
                toolbarProps={toolbarProps}
                appLayoutProps={props}
                appLayoutState={appLayoutState}
                skeletonSlotsAttributes={skeletonAttributes}
              />
            </AppLayoutVisibilityContext.Provider>
          )}
        </AppLayoutStateProvider>
        <AppLayoutWidgetizedState forwardRef={forwardRef} appLayoutProps={props} stateManager={stateManager} />
      </>
    );
  }
);

export default AppLayoutVisualRefreshToolbar;
