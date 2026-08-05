// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { ExpandedContent } from '../basic-table/internal';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { BasicTableProps } from '../basic-table/interfaces';

export type BasicTableExpandedContentProps = BasicTableProps.ExpandedContentProps;

function BasicTableExpandedContent(props: BasicTableExpandedContentProps) {
  return <ExpandedContent {...props} />;
}
applyDisplayName(BasicTableExpandedContent, 'BasicTableExpandedContent');
export default BasicTableExpandedContent;
