// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { ForwardedRef } from 'react';

import { createWidgetizedComponent } from '../../internal/widgets';
import { AppLayoutProps } from '../interfaces';
import { AppLayoutInternalProps } from './interfaces';
import { useSkeletonSlotsAttributes } from './skeleton/widget-slots/use-skeleton-slots-attributes';
import { useAppLayout } from './use-app-layout';

export interface AppLayoutStateProps {
  props: AppLayoutInternalProps;
  forwardRef: ForwardedRef<AppLayoutProps.Ref>;
  // onChange: (
  //   appLayoutState: ReturnType<typeof useAppLayout>,
  //   skeletonAttributes: ReturnType<typeof useSkeletonSlotsAttributes> | null
  // ) => void;
  stateManager: any;
}

export const AppLayoutState = (props: AppLayoutStateProps) => {
  const appLayoutState = useAppLayout(props.props, props.forwardRef);
  const skeletonSlotsAttributes = useSkeletonSlotsAttributes({
    appLayoutProps: props.props,
    appLayoutState: appLayoutState,
  });

  props.stateManager.current?.set?.(appLayoutState, skeletonSlotsAttributes);

  return <></>;
};

export const createWidgetizedAppLayoutState = createWidgetizedComponent(AppLayoutState);
