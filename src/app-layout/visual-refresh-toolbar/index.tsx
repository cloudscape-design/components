// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { FC, useEffect, useState } from 'react';

import { useUniqueId } from '../../internal/hooks/use-unique-id';
import { AppLayoutProps } from '../interfaces';
import { AppLayoutVisibilityContext } from './contexts';
import { AppLayoutInternalProps } from './interfaces';
import { AppLayoutWidgetizedState } from './internal';
import { SkeletonLayout } from './skeleton';
import { useSkeletonSlotsAttributes } from './skeleton/widget-slots/use-skeleton-slots-attributes';
import { useAppLayout } from './use-app-layout';

const AppLayoutStateProvider: FC<{
  children: (
    appLayoutState: ReturnType<typeof useAppLayout> | null,
    skeletonSlotsAttributes: ReturnType<typeof useSkeletonSlotsAttributes> | null
  ) => React.ReactNode;
  appLayoutStateChangeId: string;
}> = ({ children, appLayoutStateChangeId }) => {
  const [appLayoutState, setAppLayoutState] = useState(null);
  const [skeletonAttributes, setSkeletonAttributes] = useState(null);

  useEffect(() => {
    addEventListener(appLayoutStateChangeId, event => {
      setAppLayoutState((event as any).detail.appLayoutState);
      setSkeletonAttributes((event as any).detail.skeletonAttributes);
    });
  }, [appLayoutStateChangeId]);
  return <>{children(appLayoutState, skeletonAttributes)}</>;
};

const AppLayoutVisualRefreshToolbar = React.forwardRef<AppLayoutProps.Ref, AppLayoutInternalProps>(
  (props, forwardRef) => {
    const appLayoutStateChangeId = useUniqueId('app-layout-state-change-');

    return (
      <>
        <AppLayoutWidgetizedState
          props={props}
          forwardRef={forwardRef}
          onChange={(appLayoutState, skeletonAttributes) => {
            dispatchEvent(new CustomEvent(appLayoutStateChangeId, { detail: { appLayoutState, skeletonAttributes } }));
          }}
        />
        <AppLayoutStateProvider appLayoutStateChangeId={appLayoutStateChangeId}>
          {(appLayoutState, skeletonSlotsAttributes) => (
            <AppLayoutVisibilityContext.Provider value={appLayoutState?.isIntersecting ?? true}>
              <SkeletonLayout
                appLayoutProps={props}
                appLayoutState={appLayoutState}
                skeletonSlotsAttributes={skeletonSlotsAttributes}
              />
            </AppLayoutVisibilityContext.Provider>
          )}
        </AppLayoutStateProvider>
      </>
    );
  }
);

export default AppLayoutVisualRefreshToolbar;
