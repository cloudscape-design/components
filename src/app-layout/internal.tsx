// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { AppLayoutProps, AppLayoutPropsWithDefaults } from './interfaces';
import ToolbarAppLayout from './visual-refresh-toolbar';

export const AppLayoutInternal = React.forwardRef<AppLayoutProps.Ref, AppLayoutPropsWithDefaults>((props, ref) => {
  return <ToolbarAppLayout ref={ref} {...props} />;
});
