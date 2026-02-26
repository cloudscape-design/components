// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { unstable_batchedUpdates } from 'react-dom';

import RemoteI18nProvider from '../../i18n/providers/remote-provider';
import ScreenreaderOnly from '../../internal/components/screenreader-only';
import { AppLayoutProps } from '../interfaces';
import { useAriaLabels } from '../utils/use-aria-labels';
import { AppLayoutVisibilityContext } from './contexts';
import { AppLayoutInternalProps, AppLayoutPendingState } from './interfaces';
import { AppLayoutWidgetizedState, loadFormatter } from './internal';
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
    const stateManagerRef = useRef<StateManager>({ setState: undefined, hasToolbar: false, setToolbar: undefined });

    return (
      <RemoteI18nProvider loadFormatter={loadFormatter}>
        <AppLayoutVisualRefreshToolbarWithI18n
          appLayoutRef={forwardRef}
          stateManagerRef={stateManagerRef}
          appLayoutProps={props}
        />
      </RemoteI18nProvider>
    );
  }
);

function AppLayoutVisualRefreshToolbarWithI18n({
  appLayoutRef,
  stateManagerRef,
  appLayoutProps,
}: {
  appLayoutRef: React.ForwardedRef<AppLayoutProps.Ref>;
  stateManagerRef: React.MutableRefObject<StateManager>;
  appLayoutProps: AppLayoutInternalProps;
}) {
  const { __forceDeduplicationType: forceDeduplicationType, __embeddedViewMode: embeddedViewMode } =
    appLayoutProps as any;

  const ariaLabels = useAriaLabels(appLayoutProps.ariaLabels);
  const appLayoutPropsWithI18n = { ...appLayoutProps, ariaLabels };

  return (
    <>
      <AppLayoutStateProvider
        forceDeduplicationType={forceDeduplicationType}
        appLayoutProps={appLayoutPropsWithI18n}
        stateManager={stateManagerRef}
      >
        {(registered, appLayoutState, toolbarProps, skeletonAttributes) => (
          <AppLayoutVisibilityContext.Provider value={appLayoutState.isIntersecting}>
            {/* Rendering a hidden copy of breadcrumbs to trigger their deduplication */}
            {(embeddedViewMode || !toolbarProps) && appLayoutPropsWithI18n.breadcrumbs ? (
              <ScreenreaderOnly>{appLayoutPropsWithI18n.breadcrumbs}</ScreenreaderOnly>
            ) : null}
            <SkeletonLayout
              registered={registered}
              toolbarProps={toolbarProps}
              appLayoutProps={appLayoutPropsWithI18n}
              appLayoutState={appLayoutState}
              skeletonSlotsAttributes={skeletonAttributes}
            />
          </AppLayoutVisibilityContext.Provider>
        )}
      </AppLayoutStateProvider>
      <AppLayoutWidgetizedState
        forwardRef={appLayoutRef}
        appLayoutProps={appLayoutPropsWithI18n}
        stateManager={stateManagerRef}
      />
    </>
  );
}

export default AppLayoutVisualRefreshToolbar;
