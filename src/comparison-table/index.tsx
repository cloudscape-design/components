// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { ComparisonTableProps } from './interfaces';
import InternalComparisonTable from './internal';

export { ComparisonTableProps };

/**
 * ComparisonTable renders a side-by-side comparison of two or more entities: attributes are
 * rendered as rows, entities as columns, with a sticky attribute column and optional
 * highlighting of rows whose values differ across entities.
 *
 * This is a work-in-progress (v0) component built as a thin, opt-in composition over the
 * existing Table component.
 */
export default function ComparisonTable({
  attributes,
  entities,
  attributeColumnHeader = '',
  stickyAttributeColumn = true,
  highlightDifferences = false,
  variant = 'container',
  ariaLabel,
  ...rest
}: ComparisonTableProps) {
  const baseComponentProps = useBaseComponent('ComparisonTable', {
    props: { stickyAttributeColumn, highlightDifferences, variant },
    metadata: { attributesCount: attributes.length, entitiesCount: entities.length },
  });
  const baseProps = getBaseProps(rest);

  return (
    <InternalComparisonTable
      {...baseProps}
      {...baseComponentProps}
      attributes={attributes}
      entities={entities}
      attributeColumnHeader={attributeColumnHeader}
      stickyAttributeColumn={stickyAttributeColumn}
      highlightDifferences={highlightDifferences}
      variant={variant}
      ariaLabel={ariaLabel}
    />
  );
}

applyDisplayName(ComparisonTable, 'ComparisonTable');
