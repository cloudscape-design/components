// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { FC, MutableRefObject, useLayoutEffect, useRef, useState } from 'react';

import { AppLayoutProps } from '../interfaces';
import { AppLayoutVisibilityContext } from './contexts';
import { AppLayoutInternalProps } from './interfaces';
import { AppLayoutWidgetizedState } from './internal';
import { SkeletonLayout } from './skeleton';
import { useSkeletonSlotsAttributes } from './skeleton/widget-slots/use-skeleton-slots-attributes';
import { useAppLayout } from './use-app-layout';

type AppLayoutState = ReturnType<typeof useAppLayout> | null;
type SkeletonSlotsAttributes = ReturnType<typeof useSkeletonSlotsAttributes> | null;
interface StateManager {
  set: (appLayoutState: AppLayoutState, skeletonAttributes: SkeletonSlotsAttributes) => void;
}

const AppLayoutStateProvider: FC<{
  children: (appLayoutState: AppLayoutState, skeletonSlotsAttributes: SkeletonSlotsAttributes) => React.ReactNode;
  stateManager: MutableRefObject<StateManager>;
}> = ({ stateManager, children }) => {
  const [appLayoutState, setAppLayoutState] = useState<AppLayoutState>(null);
  const [skeletonAttributes, setSkeletonAttributes] = useState<SkeletonSlotsAttributes>(null);

  useLayoutEffect(() => {
    stateManager.current.set = (appLayoutState, skeletonAttributes) => {
      setAppLayoutState(appLayoutState);
      setSkeletonAttributes(skeletonAttributes);
    };
  }, [stateManager]);
  return <>{children(appLayoutState, skeletonAttributes)}</>;
};

const AppLayoutVisualRefreshToolbar = React.forwardRef<AppLayoutProps.Ref, AppLayoutInternalProps>(
  (props, forwardRef) => {
    const stateManager = useRef<StateManager>({ set: () => {} });

    return (
      <>
        <AppLayoutWidgetizedState props={props} forwardRef={forwardRef} stateManager={stateManager} />
        <AppLayoutStateProvider stateManager={stateManager}>
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
