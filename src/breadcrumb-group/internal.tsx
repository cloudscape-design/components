// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { createLoadableComponent } from '../internal/widgets/loader-mock';
import { BreadcrumbGroupImplementation, createWidgetizedBreadcrumbGroup } from './implementation';

export const InternalBreadcrumbGroup = createWidgetizedBreadcrumbGroup(
  createLoadableComponent(BreadcrumbGroupImplementation)
);
