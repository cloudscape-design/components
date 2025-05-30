// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { FC, useEffect, useRef, useState } from 'react';
import { unstable_batchedUpdates } from 'react-dom';

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
  // appLayoutStateChangeId: string;
  stateManager: any;
}> = ({ stateManager, children }) => {
  const [appLayoutState, setAppLayoutState] = useState(null);
  const [skeletonAttributes, setSkeletonAttributes] = useState(null);

  useEffect(() => {
    stateManager.current.set = (appLayoutState: any, skeletonAttributes: any) => {
      unstable_batchedUpdates(() => {
        setAppLayoutState(appLayoutState);
        setSkeletonAttributes(skeletonAttributes);
      });
    };
    // addEventListener(appLayoutStateChangeId, event => {
    //   unstable_batchedUpdates(() => {
    //     setAppLayoutState((event as any).detail.appLayoutState);
    //     setSkeletonAttributes((event as any).detail.skeletonAttributes);
    //   });
    // });
  }, [stateManager]);
  return <>{children(appLayoutState, skeletonAttributes)}</>;
};

const AppLayoutVisualRefreshToolbar = React.forwardRef<AppLayoutProps.Ref, AppLayoutInternalProps>(
  (props, forwardRef) => {
    // const appLayoutStateChangeId = useUniqueId('app-layout-state-change-');
    const stateManager = useRef<any>({});

    return (
      <>
        <AppLayoutWidgetizedState
          props={props}
          forwardRef={forwardRef}
          onChange={(appLayoutState, skeletonAttributes) => {
            stateManager.current?.set?.(appLayoutState, skeletonAttributes);
            // window.dispatchEvent(
            //   new CustomEvent(appLayoutStateChangeId, { detail: { appLayoutState, skeletonAttributes } })
            // );
          }}
        />
        <AppLayoutStateProvider
          stateManager={stateManager}
          // appLayoutStateChangeId={appLayoutStateChangeId}
        >
          {(appLayoutState, skeletonSlotsAttributes) => {
            return (
              <AppLayoutVisibilityContext.Provider value={appLayoutState?.isIntersecting ?? true}>
                <SkeletonLayout
                  appLayoutProps={props}
                  appLayoutState={appLayoutState}
                  skeletonSlotsAttributes={skeletonSlotsAttributes}
                />
              </AppLayoutVisibilityContext.Provider>
            );
          }}
        </AppLayoutStateProvider>
      </>
    );
  }
);

export default AppLayoutVisualRefreshToolbar;
