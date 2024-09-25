// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { createWidgetizedComponent } from '../../../internal/widgets';

/* istanbul ignore next: noop stub */
export function AppLayoutGlobalDrawersImplementation() {
  return <></>;
}

export const createWidgetizedAppLayoutGlobalDrawers = createWidgetizedComponent(AppLayoutGlobalDrawersImplementation);
