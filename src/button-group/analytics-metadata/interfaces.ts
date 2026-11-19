// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { LabelIdentifier } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import {
  GeneratedAnalyticsMetadataButtonDropdownClick,
  GeneratedAnalyticsMetadataButtonDropdownCollapse,
  GeneratedAnalyticsMetadataButtonDropdownExpand,
} from '../../button-dropdown/analytics-metadata/interfaces';

export type GeneratedAnalyticsMetadataButtonGroupClick = GeneratedAnalyticsMetadataButtonDropdownClick;
export type GeneratedAnalyticsMetadataButtonGroupExpand = GeneratedAnalyticsMetadataButtonDropdownExpand;
export type GeneratedAnalyticsMetadataButtonGroupCollapse = GeneratedAnalyticsMetadataButtonDropdownCollapse;

export interface GeneratedAnalyticsMetadataButtonGroupComponent {
  name: 'awsui.ButtonGroup';
  label: string | LabelIdentifier;
}
