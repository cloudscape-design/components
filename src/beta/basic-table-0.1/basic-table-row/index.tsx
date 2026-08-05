// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';

import { applyDisplayName } from '../internal/utils/apply-display-name';
import { Row } from '../basic-table/internal';
import { BasicTableProps } from '../basic-table/interfaces';

applyDisplayName(Row, 'BasicTableRow');

export default Row;
export type BasicTableRowProps = BasicTableProps.RowProps;
