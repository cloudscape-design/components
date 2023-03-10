// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import useBaseComponent from '../internal/hooks/use-base-component';
import { PaginationProps } from './interfaces';
import InternalPagination from './internal';
import { useI18nStrings } from '../internal/i18n/use-i18n-strings';

export { PaginationProps };

export default function Pagination(props: PaginationProps) {
  const baseComponentProps = useBaseComponent('Pagination');
  const i18nProps = useI18nStrings('pagination', props);
  return <InternalPagination {...i18nProps} {...baseComponentProps} />;
}

applyDisplayName(Pagination, 'Pagination');
