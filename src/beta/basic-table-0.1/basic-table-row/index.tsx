// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { Row } from '../basic-table/internal';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { BasicTableProps } from '../basic-table/interfaces';

export type BasicTableRowProps = BasicTableProps.RowProps;

const BasicTableRow = React.forwardRef<HTMLTableRowElement, BasicTableRowProps>((props, ref) => <Row ref={ref} {...props} />);
applyDisplayName(BasicTableRow, 'BasicTableRow');
export default BasicTableRow;
