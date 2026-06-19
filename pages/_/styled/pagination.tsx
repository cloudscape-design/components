// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import BasePagination, { PaginationProps } from '~components/pagination';

import styles from './pagination.scss';

export function Pagination(props: PaginationProps) {
  return <BasePagination {...props} classNames={{ root: styles.root }} />;
}
