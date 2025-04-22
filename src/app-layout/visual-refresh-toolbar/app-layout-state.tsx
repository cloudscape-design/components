// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { ForwardedRef, useEffect } from 'react';

import { createWidgetizedComponent } from '../../internal/widgets';
import { AppLayoutProps } from '../interfaces';
import { AppLayoutInternalProps } from './interfaces';
import { useAppLayout } from './use-app-layout';

export const AppLayoutState = (props: {
  props: AppLayoutInternalProps;
  forwardRef: ForwardedRef<AppLayoutProps.Ref>;
  children: (state: ReturnType<typeof useAppLayout>) => React.ReactNode;
  onMount: () => void;
}) => {
  const state = useAppLayout(props.props, props.forwardRef);

  useEffect(() => {
    props.onMount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{props.children(state)}</>;
};

export const createWidgetizedAppLayoutState = createWidgetizedComponent(AppLayoutState);
