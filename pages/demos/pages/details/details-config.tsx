// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Link from '@cloudscape-design/components/link';
import { TableProps } from '@cloudscape-design/components/table';

import { BehaviorResource, InvalidationResource, LogResource, OriginResource } from '../../resources/types';

export const ORIGINS_COLUMN_DEFINITIONS: TableProps.ColumnDefinition<OriginResource>[] = [
  {
    id: 'name',
    header: 'Name and path',
    cell: item => item.name,
    isRowHeader: true,
  },
  {
    id: 'id',
    header: 'Origin ID',
    cell: item => item.id,
  },
  {
    id: 'type',
    header: 'Origin type',
    cell: item => item.type,
  },
  {
    id: 'accessIdentity',
    header: 'Origin access ID',
    cell: item => item.accessIdentity,
  },
];

export const BEHAVIORS_COLUMN_DEFINITIONS: TableProps.ColumnDefinition<BehaviorResource>[] = [
  {
    id: 'precedence',
    header: 'Precedence',
    cell: item => item.precedence,
  },
  {
    id: 'pathPattern',
    header: 'Path pattern',
    cell: item => item.pathPattern,
    isRowHeader: true,
  },
  {
    id: 'origin',
    header: 'Origin',
    cell: item => item.origin,
  },
  {
    id: 'viewerProtocolPolicy',
    header: 'Viewer protocol policy',
    cell: item => item.viewerProtocolPolicy,
  },
  {
    id: 'forwardedQueryStrings',
    header: 'Forwarded query strings',
    cell: item => item.forwardedQueryStrings,
  },
];

export const LOGS_COLUMN_DEFINITIONS: TableProps.ColumnDefinition<LogResource>[] = [
  {
    id: 'name',
    header: 'Name',
    cell: item => <Link href="#">{item.name}</Link>,
    isRowHeader: true,
  },
  {
    id: 'lastWritten',
    header: 'Last written',
    cell: item => item.lastWritten,
  },
  {
    id: 'size',
    header: 'Size',
    cell: item => item.size,
  },
];

export const INSTANCE_DROPDOWN_ITEMS = [
  {
    text: 'Take snapshot',
    id: 'snapshot',
  },
  {
    text: 'Reboot',
    id: 'reboot',
  },
  {
    text: 'Stop',
    id: 'stop',
  },
];

export const INVALIDATIONS_COLUMN_DEFINITIONS: TableProps.ColumnDefinition<InvalidationResource>[] = [
  {
    id: 'id',
    header: 'Invalidation ID',
    isRowHeader: true,
    cell: item => item.id,
  },
  {
    id: 'status',
    header: 'Status',
    cell: item => item.status,
  },
  {
    id: 'date',
    header: 'Date',
    cell: item => item.date,
  },
];

export const TAGS_COLUMN_DEFINITIONS: TableProps.ColumnDefinition<{
  key: string;
  value: string;
}>[] = [
  {
    id: 'key',
    header: 'Key',
    cell: item => item.key,
    width: 300,
    isRowHeader: true,
    sortingField: 'key',
  },
  {
    id: 'value',
    header: 'Value',
    cell: item => item.value || '-',
    sortingField: 'value',
  },
];
