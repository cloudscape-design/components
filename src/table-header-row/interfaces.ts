// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../types/base-component';

/** Renders the header row, inside `TableHead`. Its children are `TableHeaderCell` components. */
export interface TableHeaderRowProps extends BaseComponentProps {
  /** The header cells, one per column, in order. */
  children?: React.ReactNode;
}
