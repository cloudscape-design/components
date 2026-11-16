// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { StyleClassNames as ButtonDropdownStyleClassNames } from '../button-dropdown/internal-interfaces';
import { StyleClassNames as CheckboxStyleClassNames } from '../checkbox/internal';
import { StyleClassNames as RadioButtonStyleClassNames } from '../internal/components/radio-button';
import { Slot } from '../internal/utils/style-slot';
import { TableProps } from './interfaces';

// Style API v2
export interface StyleClassNames<T = any> {
  root?: string;
  headerCell?: Slot<
    | {
        type: 'column';
        column: TableProps.ColumnDefinition<T>;
        sortable: boolean;
        sorted: boolean;
        sortingDescending: boolean;
      }
    | { type: 'group'; group: TableProps.GroupDefinition<T> }
    | { type: 'selection' }
  >;
  sortingButton?: string;
  sortingIndicator?: string;
  sortingMenu?: ButtonDropdownStyleClassNames;
  clearSortButton?: string;
  // `index` counts rendered rows, including nested rows.
  row?: Slot<{ item: T; index: number; selected: boolean }>;
  cell?: Slot<{ type: 'data'; item: T; column: TableProps.ColumnDefinition<T> } | { type: 'selection'; item: T }>;
  selectionCheckbox?: CheckboxStyleClassNames;
  selectionRadio?: RadioButtonStyleClassNames;
}
