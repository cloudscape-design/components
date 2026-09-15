// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../types/base-component';

/** Renders the table head. Its child is a single `TableHeaderRow` of `TableHeaderCell`s. */
export interface TableHeadProps extends BaseComponentProps {
  /** The header row: a `TableHeaderRow` whose cells are `TableHeaderCell` components. */
  children?: React.ReactNode;
}
