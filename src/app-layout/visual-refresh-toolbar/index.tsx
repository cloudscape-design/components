// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { unstable_batchedUpdates } from 'react-dom';

import ScreenreaderOnly from '../../internal/components/screenreader-only';
import { AppLayoutProps } from '../interfaces';
import { AppLayoutVisibilityContext } from './contexts';
import { AppLayoutInternalProps, AppLayoutPendingState } from './interfaces';
import { AppLayoutWidgetizedState } from './internal';
import { SkeletonLayout } from './skeleton';
import { SkeletonSlotsAttributes } from './skeleton/interfaces';
import { DeduplicationType, useMultiAppLayout } from './skeleton/multi-layout';
import { StateManager } from './state';
import { SharedProps } from './state/interfaces';
import { getPropsToMerge, mergeProps } from './state/props-merger';
import { ToolbarProps } from './toolbar';

const AppLayoutStateProvider: React.FC<{
  forceDeduplicationType: DeduplicationType;
  appLayoutProps: AppLayoutInternalProps;
  stateManager: React.MutableRefObject<StateManager>;
  children: (
    registered: boolean,
    appLayoutState: AppLayoutPendingState,
    toolbarProps: ToolbarProps | null,
    skeletonAttributes: SkeletonSlotsAttributes
  ) => React.ReactNode;
}> = ({ forceDeduplicationType, appLayoutProps, stateManager, children }) => {
  const [appLayoutState, setAppLayoutState] = useState<AppLayoutPendingState>({ isIntersecting: true });
  const [skeletonAttributes, setSkeletonAttributes] = useState<SkeletonSlotsAttributes>({});
  // use { fn: } object wrapper to avoid confusion with callback form of setState
  const [deduplicator, setDeduplicator] = useState({ fn: mergeProps });
  const [deduplicationProps, setDeduplicationProps] = useState<SharedProps | undefined>(undefined);

  const { registered, toolbarProps } = useMultiAppLayout(
    forceDeduplicationType,
    appLayoutState.isIntersecting,
    deduplicationProps ?? getPropsToMerge(appLayoutProps, appLayoutState),
    deduplicator.fn
  );

  useLayoutEffect(() => {
    stateManager.current.setState = (appLayoutState, skeletonAttributes, deduplicationProps, mergeProps) => {
      unstable_batchedUpdates(() => {
        setAppLayoutState(appLayoutState);
        setSkeletonAttributes(skeletonAttributes);
        setDeduplicationProps(deduplicationProps);
        setDeduplicator({ fn: mergeProps });
      });
    };
  }, [stateManager]);

  const hasToolbar = !!toolbarProps;
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
