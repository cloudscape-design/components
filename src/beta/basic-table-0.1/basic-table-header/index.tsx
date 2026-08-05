// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { Header } from '../basic-table/internal';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { BasicTableProps } from '../basic-table/interfaces';

export type BasicTableHeaderProps = BasicTableProps.HeaderProps;

function BasicTableHeader(props: BasicTableHeaderProps) {
  return <Header {...props} />;
}
applyDisplayName(BasicTableHeader, 'BasicTableHeader');
export default BasicTableHeader;
