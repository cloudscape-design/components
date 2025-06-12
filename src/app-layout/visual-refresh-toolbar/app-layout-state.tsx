// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { ForwardedRef, useLayoutEffect } from 'react';

import { createWidgetizedComponent } from '../../internal/widgets';
import { AppLayoutProps } from '../interfaces';
import { AppLayoutInternalProps } from './interfaces';
import { useSkeletonSlotsAttributes } from './skeleton/widget-slots/use-skeleton-slots-attributes';
import { useAppLayout } from './use-app-layout';

export interface AppLayoutStateProps {
  props: AppLayoutInternalProps;
  forwardRef: ForwardedRef<AppLayoutProps.Ref>;
  stateManager: any;
}

export const AppLayoutState = (props: AppLayoutStateProps) => {
  const appLayoutState = useAppLayout(props.props, props.forwardRef);
  const skeletonSlotsAttributes = useSkeletonSlotsAttributes({
    appLayoutProps: props.props,
    appLayoutState: appLayoutState,
  });

  useLayoutEffect(() => {
    props.stateManager.current?.set?.(appLayoutState, skeletonSlotsAttributes);
  }, [appLayoutState, props.stateManager, skeletonSlotsAttributes]);

  return <></>;
};

export const createWidgetizedAppLayoutState = createWidgetizedComponent(AppLayoutState);
