// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
// @cloudscape-design/board-components not available — BoardProps replaced with local type
import React from 'react';

import * as icons from '../icons';

export interface WidgetDataType {
  icon: keyof typeof icons;
  title: string;
  description: string;
  disableContentPaddings?: boolean;
  provider?: React.JSXElementConstructor<{ children: React.ReactElement }>;
  header: React.JSXElementConstructor<Record<string, never>>;
  content: React.JSXElementConstructor<Record<string, never>>;
  footer?: React.JSXElementConstructor<Record<string, never>>;
  staticMinHeight?: number;
}

export interface DashboardWidgetItem {
  id: string;
  definition?: { defaultRowSpan?: number; defaultColumnSpan?: number; minRowSpan?: number; minColumnSpan?: number };
  data: WidgetDataType;
}

export type WidgetConfig = Pick<DashboardWidgetItem, 'definition' | 'data'>;
