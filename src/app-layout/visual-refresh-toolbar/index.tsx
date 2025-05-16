// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { FC, useEffect, useState } from 'react';

import ScreenreaderOnly from '../../internal/components/screenreader-only';
import { useUniqueId } from '../../internal/hooks/use-unique-id';
import { AppLayoutProps } from '../interfaces';
import { AppLayoutVisibilityContext } from './contexts';
import { AppLayoutInternalProps } from './interfaces';
import { AppLayoutWidgetizedState } from './internal';
import { SkeletonLayout } from './skeleton';
import { useSkeletonSlotsAttributes } from './skeleton/widget-slots/use-skeleton-slots-attributes';
import { useAppLayout } from './use-app-layout';

const AppLayoutStateProvider: FC<{
  children: (skeletonSlotsAttributes: ReturnType<typeof useSkeletonSlotsAttributes> | null) => React.ReactNode;
  appLayoutStateChangeId: string;
}> = ({ children, appLayoutStateChangeId }) => {
  const [skeletonAttributes, setSkeletonAttributes] = useState(null);

  useEffect(() => {
    addEventListener(appLayoutStateChangeId, event => {
      setSkeletonAttributes((event as any).detail.skeletonAttributes);
    });
  }, [appLayoutStateChangeId]);
  return <>{children(skeletonAttributes)}</>;
};

const AppLayoutVisualRefreshToolbar = React.forwardRef<AppLayoutProps.Ref, AppLayoutInternalProps>(
  (props, forwardRef) => {
    const { breadcrumbs } = props;
    const appLayoutState = useAppLayout(props, forwardRef);
    const { hasToolbar } = appLayoutState;
    const appLayoutStateChangeId = useUniqueId('app-layout-state-change-');

    return (
      <>
        <AppLayoutWidgetizedState
          props={props}
          state={appLayoutState}
          onChange={skeletonAttributes => {
            dispatchEvent(new CustomEvent(appLayoutStateChangeId, { detail: { skeletonAttributes } }));
          }}
        />
        <AppLayoutStateProvider appLayoutStateChangeId={appLayoutStateChangeId}>
          {skeletonSlotsAttributes => (
            <AppLayoutVisibilityContext.Provider value={appLayoutState.isIntersecting}>
              {/* Rendering a hidden copy of breadcrumbs to trigger their deduplication */}
              {!hasToolbar && breadcrumbs ? <ScreenreaderOnly>{breadcrumbs}</ScreenreaderOnly> : null}
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
