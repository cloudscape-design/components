// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import useBaseComponent from '../internal/hooks/use-base-component';
import { PaginationProps } from './interfaces';
import InternalPagination from './internal';

export { PaginationProps };

export default function Pagination(props: PaginationProps) {
  const baseComponentProps = useBaseComponent('Pagination', {
    currentPageIndex: props.currentPageIndex,
    pagesCount: props.pagesCount,
    openEnd: props.openEnd,
    disabled: props.disabled,
  });
  return <InternalPagination {...props} {...baseComponentProps} />;
}

applyDisplayName(Pagination, 'Pagination');
