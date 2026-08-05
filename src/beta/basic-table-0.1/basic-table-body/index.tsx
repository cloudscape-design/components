// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { Body } from '../basic-table/internal';
import { applyDisplayName } from '../../../internal/utils/apply-display-name';
import { BasicTableProps } from '../basic-table/interfaces';

export type BasicTableBodyProps = BasicTableProps.BodyProps;

const BasicTableBody = React.forwardRef<HTMLTableSectionElement, BasicTableBodyProps>((props, ref) => <Body ref={ref} {...props} />);
applyDisplayName(BasicTableBody, 'BasicTableBody');
export default BasicTableBody;
