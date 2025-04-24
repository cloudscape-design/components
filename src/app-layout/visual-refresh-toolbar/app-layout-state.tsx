// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { ForwardedRef, useEffect } from 'react';

import { createWidgetizedComponent } from '../../internal/widgets';
import { AppLayoutProps } from '../interfaces';
import { AppLayoutInternalProps } from './interfaces';
import { useSkeletonSlotsAttributes } from './skeleton/widget-slots/use-skeleton-slots-attributes';
import { useAppLayout } from './use-app-layout';

export const AppLayoutState = (props: {
  props: AppLayoutInternalProps;
  forwardRef: ForwardedRef<AppLayoutProps.Ref>;
  children: (
    state: ReturnType<typeof useAppLayout>,
    skeletonSlotsAttributes: ReturnType<typeof useSkeletonSlotsAttributes>
  ) => React.ReactNode;
  onMount: () => void;
}) => {
  const state = useAppLayout(props.props, props.forwardRef);
  const skeletonSlotsAttributes = useSkeletonSlotsAttributes({ appLayoutProps: props.props, appLayoutState: state });

  useEffect(() => {
    props.onMount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{props.children(state, skeletonSlotsAttributes)}</>;
};

export const createWidgetizedAppLayoutState = createWidgetizedComponent(AppLayoutState);
