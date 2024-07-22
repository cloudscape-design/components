// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';

export interface KeyValuePairsProps extends BaseComponentProps {
  /**
   * Specifies the number of columns in each grid row.
   * Valid values are any integer between 1 and 4. It defaults to 1.
   */
  columns?: number;
  /**
   * An array of either key-value pairs individual items or groups.
   * They could be combined.
   * Each item has `type` prop, which might be either `group` or `pair`. Defaults to `pair` if not specified.
   *
   * Each key-value pair definition has the following properties:
   *   * `type` (string) - (Optional) Item type (pair).
   *   * `label` (string) - The key label.
   *   * `info` (React.ReactNode) - (Optional) Area next to the key to display an info link.
   *   * `value` (React.ReactNode) - The corresponding value for the key.
   *
   * Each group definition has the following properties:
   *   * `type` (string) - Item type (group).
   *   * `title` (string) - (Optional) An optional title for this column.
   *   * `items` (ReadonlyArray<KeyValuePairProps.KeyValuePair>) - An array of
   *     key-value pair items.
   */
  items: ReadonlyArray<KeyValuePairsProps.Item>;
  /**
   * Provides an `aria-label` to the Key-value pairs container.
   * Don't use `ariaLabel` and `ariaLabelledby` at the same time.
   */
  ariaLabel?: string;
  /**
   * Sets the `aria-labelledby` property on the Key-value pairs container.
   * If there's a visible label element that you can reference, use this instead of `ariaLabel`.
   * Don't use `ariaLabel` and `ariaLabelledby` at the same time.
   */
  ariaLabelledby?: string;
}

export namespace KeyValuePairsProps {
  export type Item = Group | Pair;

  export interface Group {
    type: 'group';
    title?: string;
    items: ReadonlyArray<Pair>;
  }

  export interface Pair extends BaseComponentProps {
    type?: 'pair';
    label: string;
    value: React.ReactNode;
    info?: React.ReactNode;
  }
}
