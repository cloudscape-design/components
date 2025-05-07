// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect } from 'react';

import { createWidgetizedComponent } from '../../internal/widgets';
import { AppLayoutInternalProps } from './interfaces';
import { useSkeletonSlotsAttributes } from './skeleton/widget-slots/use-skeleton-slots-attributes';
import { useAppLayout } from './use-app-layout';

export interface AppLayoutStateProps {
  props: AppLayoutInternalProps;
  state: ReturnType<typeof useAppLayout>;
  onChange: (skeletonAttributes: ReturnType<typeof useSkeletonSlotsAttributes> | null) => void;
}

export const AppLayoutState = (props: AppLayoutStateProps) => {
  const skeletonSlotsAttributes = useSkeletonSlotsAttributes({
    appLayoutProps: props.props,
    appLayoutState: props.state,
  });

  useEffect(() => {
    props.onChange(skeletonSlotsAttributes);
  }, [props, skeletonSlotsAttributes]);

  return <></>;
};

export const createWidgetizedAppLayoutState = createWidgetizedComponent(AppLayoutState);
