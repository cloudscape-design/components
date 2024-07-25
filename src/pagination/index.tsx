// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { getAnalyticsMetadataAttribute } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { GeneratedAnalyticsMetadataPaginationComponent } from './analytics-metadata/interfaces';
import { PaginationProps } from './interfaces';
import InternalPagination from './internal';

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
          label: '',
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
