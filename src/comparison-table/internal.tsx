// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { getBaseProps } from '../internal/base-component';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { TableProps } from '../table/interfaces';
import InternalTable from '../table/internal';
import { ComparisonTableProps } from './interfaces';

import styles from './styles.css.js';

type InternalComparisonTableProps = ComparisonTableProps & InternalBaseComponentProps;

const ATTRIBUTE_COLUMN_ID = 'awsui-comparison-table-attribute';

// Computes the set of attribute ids whose values differ across the compared entities.
// Comparison uses `Object.is` against the raw per-entity value, so it is reliable for
// primitive values. Deep object comparison is intentionally out of scope for v0.
function getDifferingAttributeIds(
  attributes: ReadonlyArray<ComparisonTableProps.Attribute>,
  entities: ReadonlyArray<ComparisonTableProps.Entity>
): Set<string> {
  const differing = new Set<string>();
  if (entities.length < 2) {
    return differing;
  }
  for (const attribute of attributes) {
    const [firstEntity, ...restEntities] = entities;
    const firstValue = firstEntity.data?.[attribute.id];
    const allEqual = restEntities.every(entity => Object.is(entity.data?.[attribute.id], firstValue));
    if (!allEqual) {
      differing.add(attribute.id);
    }
  }
  return differing;
}

export default function InternalComparisonTable({
  attributes,
  entities,
  attributeColumnHeader = '',
  stickyAttributeColumn = true,
  highlightDifferences = false,
  ariaLabel,
  variant = 'container',
  __internalRootRef,
  ...rest
}: InternalComparisonTableProps) {
  const baseProps = getBaseProps(rest);

  const differingAttributeIds = highlightDifferences
    ? getDifferingAttributeIds(attributes, entities)
    : new Set<string>();

  const columnDefinitions: ReadonlyArray<TableProps.ColumnDefinition<ComparisonTableProps.Attribute>> = [
    {
      id: ATTRIBUTE_COLUMN_ID,
      header: attributeColumnHeader,
      isRowHeader: true,
      cell: attribute => <span className={styles['attribute-label']}>{attribute.label}</span>,
    },
    ...entities.map(
      (entity): TableProps.ColumnDefinition<ComparisonTableProps.Attribute> => ({
        id: entity.id,
        header: entity.title,
        cell: attribute => {
          const rawValue = entity.data?.[attribute.id];
          const value = attribute.render ? attribute.render(rawValue, entity) : rawValue;
          const isDifferent = differingAttributeIds.has(attribute.id);
          return (
            <span className={clsx(styles.cell, isDifferent && styles['cell-highlighted'])}>
              {value === undefined || value === null ? '-' : value}
            </span>
          );
        },
      })
    ),
  ];

  // `__internalRootRef` is spread (not written inline) so it bypasses the excess-property check
  // against the public TableProps, while still landing on the underlying table root. This carries
  // the ComparisonTable base-component metadata onto the rendered root element.
  const internalBaseProps: InternalBaseComponentProps = { __internalRootRef };

  const tableProps: Parameters<typeof InternalTable<ComparisonTableProps.Attribute>>[0] = {
    ...baseProps,
    ...internalBaseProps,
    className: clsx(baseProps.className, styles.root),
    variant,
    items: [...attributes],
    selectedItems: [],
    firstIndex: 1,
    cellVerticalAlign: 'top',
    columnDefinitions,
    trackBy: 'id',
    stickyColumns: stickyAttributeColumn ? { first: 1 } : undefined,
    ariaLabels: ariaLabel ? { tableLabel: ariaLabel } : undefined,
  };

  return <InternalTable {...tableProps} />;
}
