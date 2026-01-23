// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { LabelIdentifier } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

export interface GeneratedAnalyticsMetadataTableSelect {
  action: 'select';
  detail: {
    label?: string;
    position: string;
    item: string;
  };
}

export interface GeneratedAnalyticsMetadataTableDeselect {
  action: 'deselect';
  detail: {
    label?: string;
    position: string;
    item: string;
  };
}

export interface GeneratedAnalyticsMetadataTableSelectAll {
  action: 'selectAll';
  detail: {
    label: string;
  };
}

export interface GeneratedAnalyticsMetadataTableDeselectAll {
  action: 'deselectAll';
  detail: {
    label: string;
  };
}

export interface GeneratedAnalyticsMetadataTableSort {
  action: 'sort';
  detail: {
    label: string;
    position: string;
    columnId: string;
    sortingDescending: string;
  };
}

export interface GeneratedAnalyticsMetadataTableComponent {
  name: 'awsui.Table';
  label: string | LabelIdentifier;
  properties: {
    selectionType: string;
    itemsCount: string;
    selectedItemsCount: string;
    sortingColumnId?: string;
    sortingDescending?: string;
    variant: string;
    columnsLabel?: string[] | LabelIdentifier[];
    selectedItemsLabel?: string | Array<Array<string | LabelIdentifier>>;
    selectedItems?: string[];
  };
  innerContext?: {
    position: string;
    columnId: string;
    columnLabel: string | LabelIdentifier;
    item: string;
  };
}
