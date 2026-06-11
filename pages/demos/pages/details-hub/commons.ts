// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import { TableProps } from '@cloudscape-design/components/table';

import { baseTableAriaLabels } from '../../i18n-strings';

export const logsTableAriaLabels: TableProps.AriaLabels<{ name: string }> = {
  ...baseTableAriaLabels,
  itemSelectionLabel: (data, row) => `select ${row.name}`,
  selectionGroupLabel: 'Logs selection',
};
