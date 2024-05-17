// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BaseComponentProps } from '../internal/base-component';
import React from 'react';

export interface KeyValuePairsProps extends BaseComponentProps {
  /**
   * An array of column definitions. A maximum of 4 columns are supported per row.
   * Each column definition has the following properties:
   * * `title` (string) - (Optional) An optional title for this column
   * * `items` (ReadonlyArray<KeyValuePairProps.KeyValuePair>) - An array of
   *     key-value pair items. Each item can have the following properties:
   *   * `key` (string) - The key title.
   *   * `info` (React.ReactNode) - (Optional) Area next to the key to display an info link.
   *   * `value` (React.ReactNode) - The corresponding value for the key.
   */
  columns: ReadonlyArray<KeyValuePairsProps.Column>;
}

export namespace KeyValuePairsProps {
  export interface Column {
    title?: string;
    items: ReadonlyArray<KeyValuePairs>;
  }

  export interface KeyValuePairs {
    key: string;
    value: React.ReactNode;
    info?: React.ReactNode;
  }
}
