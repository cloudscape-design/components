// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { AppLayoutProps } from '../interfaces';
import { getGlobalFlag } from '../../internal/utils/global-flags';
import { AppLayoutWidget } from './widget';
import { AppLayoutRefreshInternal } from './internal';

const AppLayoutWithRef = React.forwardRef(function AppLayoutVRRoot(
  props: AppLayoutProps,
  ref: React.Ref<AppLayoutProps.Ref>
) {
  if (getGlobalFlag('enableAppLayoutWidget')) {
    return <AppLayoutWidget ref={ref} {...props} />;
  }
  return <AppLayoutRefreshInternal ref={ref} {...props} />;
});

export default AppLayoutWithRef;
