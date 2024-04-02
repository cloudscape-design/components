// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import ClassicAppLayout from './classic';
import RefreshedAppLayout from './visual-refresh';
import { AppLayoutProps } from './interfaces';

export const AppLayoutImplementation = React.forwardRef<AppLayoutProps.Ref, AppLayoutProps>((props, ref) => {
  const isRefresh = useVisualRefresh();
  return isRefresh ? <RefreshedAppLayout ref={ref} {...props} /> : <ClassicAppLayout ref={ref} {...props} />;
});
