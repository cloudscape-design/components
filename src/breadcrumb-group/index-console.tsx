// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

// eslint-disable-next-line @cloudscape-design/ban-files
import BreadcrumbGroup, { BreadcrumbGroupProps as CoreBreadcrumbGroupProps } from './index';

export type BreadcrumbGroupProps = Omit<CoreBreadcrumbGroupProps, 'itemSeparator'>;

export default BreadcrumbGroup as React.ComponentType<BreadcrumbGroupProps>;
