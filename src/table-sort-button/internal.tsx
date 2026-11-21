// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useLayoutEffect } from 'react';
import clsx from 'clsx';

import { getBaseProps } from '../internal/base-component';
import { fireNonCancelableEvent } from '../internal/events';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { SortingIcon } from '../table/header-cell/sorting-icon';
import { TableHeaderCellSortContext } from '../table-header-cell/sort-context';
import { TableSortButtonProps } from './interfaces';

import styles from './styles.css.js';

type InternalTableSortButtonProps = TableSortButtonProps & InternalBaseComponentProps;

const ariaSortByState = { sortable: 'none', ascending: 'ascending', descending: 'descending' } as const;

export default function InternalTableSortButton({
  sortingState = 'sortable',
  disabled = false,
  ariaLabel,
  onSortingChange,
  children,
  __internalRootRef,
  ...rest
}: InternalTableSortButtonProps) {
  const baseProps = getBaseProps(rest);

  const setCellAriaSort = useContext(TableHeaderCellSortContext);
  useLayoutEffect(() => {
    setCellAriaSort?.(ariaSortByState[sortingState]);
    return () => setCellAriaSort?.(undefined);
  }, [setCellAriaSort, sortingState]);

  // A disabled column that isn't sorted has nothing to indicate, as in the existing Table.
  const showIcon = !(disabled && sortingState === 'sortable');

  return (
    <button
      {...baseProps}
      ref={__internalRootRef}
      type="button"
      className={clsx(baseProps.className, styles.root, styles[`sorting-state-${sortingState}`])}
      disabled={disabled}
      aria-label={ariaLabel}
      data-awsui-motion-trigger="hover"
      onClick={() =>
        fireNonCancelableEvent(onSortingChange, {
          sortingState: sortingState === 'ascending' ? 'descending' : 'ascending',
        })
      }
    >
      <span className={styles.label}>{children}</span>
      {showIcon && (
        <span className={styles['sorting-icon']}>
          <SortingIcon sortingStatus={sortingState} />
        </span>
      )}
    </button>
  );
}
