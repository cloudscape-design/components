// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { ForwardedRef, MutableRefObject, useLayoutEffect } from 'react';

import { createWidgetizedComponent } from '../../internal/widgets';
import { AppLayoutProps } from '../interfaces';
import { useGlobalScrollPadding } from '../utils/use-global-scroll-padding';
import { AppLayoutInternalProps } from './interfaces';
import { useSkeletonSlotsAttributes } from './skeleton/widget-slots/use-skeleton-slots-attributes';
import { useAppLayout } from './use-app-layout';

interface StateManager {
  set: (
    appLayoutState: ReturnType<typeof useAppLayout> | null,
    skeletonAttributes: ReturnType<typeof useSkeletonSlotsAttributes> | null
  ) => void;
}

export interface AppLayoutStateProps {
  props: AppLayoutInternalProps;
  forwardRef: ForwardedRef<AppLayoutProps.Ref>;
  stateManager: MutableRefObject<StateManager>;
}

export const AppLayoutState = (props: AppLayoutStateProps) => {
  const appLayoutState = useAppLayout(props.props, props.forwardRef);
  const skeletonSlotsAttributes = useSkeletonSlotsAttributes({
    appLayoutProps: props.props,
    appLayoutState: appLayoutState,
  });

  useGlobalScrollPadding(appLayoutState.appLayoutInternals.verticalOffsets.header);

  useLayoutEffect(() => {
    props.stateManager.current?.set?.(appLayoutState, skeletonSlotsAttributes);
  }, [appLayoutState, props.stateManager, skeletonSlotsAttributes]);

  return <></>;
};

export const createWidgetizedAppLayoutState = createWidgetizedComponent(AppLayoutState);
