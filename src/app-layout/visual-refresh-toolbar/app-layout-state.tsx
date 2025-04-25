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
  children: (
    state: ReturnType<typeof useAppLayout>,
    skeletonSlotsAttributes: ReturnType<typeof useSkeletonSlotsAttributes>
  ) => React.ReactNode;
}

export const AppLayoutState = (props: AppLayoutStateProps) => {
  const state = useAppLayout(props.props, props.forwardRef);
  const skeletonSlotsAttributes = useSkeletonSlotsAttributes({ appLayoutProps: props.props, appLayoutState: state });

  return <>{props.children(state, skeletonSlotsAttributes)}</>;
};

export const AppLayoutStateSkeleton = React.forwardRef<HTMLElement, AppLayoutStateProps>((props, ref) => {
  return <div ref={ref as React.Ref<any>}>{props.children({} as any, {} as any)}</div>;
});

export const createWidgetizedAppLayoutState = createWidgetizedComponent(AppLayoutState, AppLayoutStateSkeleton);
