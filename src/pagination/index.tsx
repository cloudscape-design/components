// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { getAnalyticsMetadataAttribute } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import useBaseComponent from '../internal/hooks/use-base-component/index.js';
import { applyDisplayName } from '../internal/utils/apply-display-name.js';
import { GeneratedAnalyticsMetadataPaginationComponent } from './analytics-metadata/interfaces.js';
import { PaginationProps } from './interfaces.js';
import InternalPagination from './internal.js';

export { PaginationProps };

export default function Pagination(props: PaginationProps) {
  const baseComponentProps = useBaseComponent('Pagination', { props: { openEnd: props.openEnd } });
  return (
    <InternalPagination
      {...props}
      {...baseComponentProps}
      {...getAnalyticsMetadataAttribute({
        component: {
          name: 'awsui.Pagination',
          label: { root: 'self' },
          properties: {
            openEnd: `${!!props.openEnd}`,
            pagesCount: `${props.pagesCount || ''}`,
            currentPageIndex: `${props.currentPageIndex}`,
          },
        } as GeneratedAnalyticsMetadataPaginationComponent,
      })}
    />
  );
}

applyDisplayName(Pagination, 'Pagination');
