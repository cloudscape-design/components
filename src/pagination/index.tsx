// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import useBaseComponent from '../internal/hooks/use-base-component';
import { PaginationProps } from './interfaces';
import InternalPagination from './internal';
import { getAnalyticsMetadataAttribute } from '../internal/analytics/autocapture/utils';

export { PaginationProps };

export default function Pagination(props: PaginationProps) {
  const baseComponentProps = useBaseComponent('Pagination', { props: { openEnd: props.openEnd } });
  return (
    <InternalPagination
      {...props}
      {...baseComponentProps}
      {...getAnalyticsMetadataAttribute({
        component: {
          name: 'Pagination',
          label: '&',
          properties: {
            openEnd: `${!!props.openEnd}`,
            pagesCount: `${props.pagesCount || ''}`,
            currentPageIndex: `${props.currentPageIndex}`,
          },
        },
      })}
    />
  );
}

applyDisplayName(Pagination, 'Pagination');
