// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import BreadcrumbGroup from '@cloudscape-design/components/breadcrumb-group';

import { resourceEditBreadcrumbs } from '../../../common/breadcrumbs';

export const Breadcrumbs = () => (
  <BreadcrumbGroup items={resourceEditBreadcrumbs} expandAriaLabel="Show path" ariaLabel="Breadcrumbs" />
);
