// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { ForwardedRef, useLayoutEffect, useState } from 'react';

import { AppLayoutBuiltInErrorBoundary } from '../../../error-boundary/internal';
import { createWidgetizedComponent } from '../../../internal/widgets';
import { AppLayoutProps } from '../../interfaces';
import { AppLayoutInternalProps, AppLayoutState } from '../interfaces';
import { SkeletonSlotsAttributes } from '../skeleton/interfaces';
import { MergeProps, SharedProps } from './interfaces';
import { getPropsToMerge, mergeProps } from './props-merger';
import { useAppLayout } from './use-app-layout';
import { useSkeletonSlotsAttributes } from './use-skeleton-slots-attributes';

export interface StateManager {
  setState:
    | ((
        appLayoutState: AppLayoutState,
        skeletonAttributes: SkeletonSlotsAttributes,
        deduplicationProps: SharedProps,
        mergeProps: MergeProps
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

export const AppLayoutStateProviderInternal = ({ appLayoutProps, stateManager, forwardRef }: AppLayoutStateProps) => {
  const [hasToolbar, setHasToolbar] = useState(stateManager.current.hasToolbar ?? false);
  const appLayoutState = useAppLayout(hasToolbar, appLayoutProps, forwardRef);
  const skeletonSlotsAttributes = useSkeletonSlotsAttributes(hasToolbar, appLayoutProps, appLayoutState);

  useLayoutEffect(() => {
    if (!stateManager.current?.setState) {
      console.warn('AppLayout state manager is not found');
      return;
    }
    stateManager.current.setState(
      appLayoutState,
      skeletonSlotsAttributes,
      getPropsToMerge(appLayoutProps, appLayoutState),
      mergeProps
    );
  });

  useLayoutEffect(() => {
    stateManager.current.setToolbar = setHasToolbar;
  }, [stateManager]);

  return <></>;
};

export const AppLayoutStateProvider = (props: AppLayoutStateProps) => {
  return (
    <AppLayoutBuiltInErrorBoundary>
      <AppLayoutStateProviderInternal {...props} />
    </AppLayoutBuiltInErrorBoundary>
  );
};

export const createWidgetizedAppLayoutState = createWidgetizedComponent(AppLayoutStateProvider);
