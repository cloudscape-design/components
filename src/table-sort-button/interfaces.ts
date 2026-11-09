// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../types/base-component';
import { NonCancelableEventHandler } from '../types/events';

/**
 * A sort control for a column header. Place it inside a `TableHeaderCell`, which then exposes the
 * column's sort direction to assistive technologies.
 */
export interface TableSortButtonProps extends BaseComponentProps {
  /**
   * The column's current sort state:
   * * `sortable` - The column can be sorted but isn't currently.
   * * `ascending` - The column is sorted in ascending order.
   * * `descending` - The column is sorted in descending order.
   *
   * @defaultValue 'sortable'
   */
  sortingState?: TableSortButtonProps.SortingState;

  /**
   * Prevents the column from being sorted. When the column is currently sorted, the sort indicator stays
   * visible in a disabled style.
   */
  disabled?: boolean;

  /**
   * Provides an accessible name for the button. Use it when the visible label isn't enough, for example to
   * include the sort direction for assistive technologies that don't announce `aria-sort`.
   */
  ariaLabel?: string;

  /**
   * Called when the user activates the button. The event `detail` contains the requested `sortingState`:
   * `ascending` for an unsorted or descending column, `descending` for an ascending column.
   */
  onSortingChange?: NonCancelableEventHandler<TableSortButtonProps.SortingChangeDetail>;

  /**
   * The column label.
   * @displayname label
   */
  children?: React.ReactNode;
}

export namespace TableSortButtonProps {
  export type SortingState = 'sortable' | 'ascending' | 'descending';

  export interface SortingChangeDetail {
    sortingState: 'ascending' | 'descending';
  }
}
