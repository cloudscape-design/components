// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BaseComponentProps } from '../internal/base-component';
import React from 'react';

export interface KeyValuePairProps extends BaseComponentProps {
  /**
   * A list of key-value pair items, grouped by column. A maximum of 4 columns
   * are supported.
   */
  columns: ReadonlyArray<KeyValuePairProps.Column>;
}

export namespace KeyValuePairProps {
  export interface Column {
    title?: string;
    items: ReadonlyArray<KeyValuePair>;
  }

  export interface KeyValuePair {
    key: string;
    value: React.ReactNode;
    info?: React.ReactNode;
  }
}
