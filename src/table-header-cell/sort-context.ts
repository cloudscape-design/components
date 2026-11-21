// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { createContext } from 'react';

type AriaSort = React.AriaAttributes['aria-sort'];

// Lets a sort control inside a header cell set the cell's aria-sort.
export const TableHeaderCellSortContext = createContext<((ariaSort: AriaSort) => void) | null>(null);
