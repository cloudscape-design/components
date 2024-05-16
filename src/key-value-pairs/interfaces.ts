// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BaseComponentProps } from '../internal/base-component';
import React from 'react';

export interface KeyValuePairsProps extends BaseComponentProps {
  /**
   * A list of key-value pair items, grouped by column. A maximum of 4 columns
   * are supported.
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
