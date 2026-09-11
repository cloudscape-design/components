// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '~components/box';
import CollectionPreferences, { CollectionPreferencesProps } from '~components/collection-preferences';
import Header from '~components/header';
import Link from '~components/link';
import SpaceBetween from '~components/space-between';
import Table, { TableProps } from '~components/table';
import { colorBackgroundContainerContent, colorTextBodyDefault } from '~design-tokens';

/**
 * Dev page: Column width persistence via CollectionPreferences / contentDisplay.
 *
 * Demonstrates how resized column widths survive a simulated page reload by
 * storing them in `preferences.contentDisplay[i].width` and feeding them back
 * through `columnDisplay`.  The workflow is:
 *
 *   1. User resizes a column → `onColumnWidthsChange` fires with
 *      `detail.columnDisplay` already containing the updated widths.
 *   2. App stores `detail.columnDisplay` in its preferences state.
 *   3. On next render the widths flow back via `columnDisplay`, so the table
 *      restores them without any manual bookkeeping.
 */

interface Item {
  id: string;
  name: string;
  type: string;
  state: string;
  region: string;
}

const columnDefinitions: TableProps.ColumnDefinition<Item>[] = [
  { id: 'name', header: 'Name', cell: item => <Link href="#">{item.name}</Link>, width: 200, minWidth: 120 },
  { id: 'type', header: 'Type', cell: item => item.type, width: 150, minWidth: 100 },
  { id: 'state', header: 'State', cell: item => item.state, width: 120, minWidth: 80 },
  { id: 'region', header: 'Region', cell: item => item.region, width: 160, minWidth: 100 },
];

const items: Item[] = [
  { id: '1', name: 'my-instance-1', type: 't3.micro', state: 'Running', region: 'us-east-1' },
  { id: '2', name: 'my-instance-2', type: 'm5.large', state: 'Stopped', region: 'us-west-2' },
  { id: '3', name: 'my-instance-3', type: 'c5.xlarge', state: 'Running', region: 'eu-west-1' },
];

const contentDisplayOptions: CollectionPreferencesProps.ContentDisplayOption[] = columnDefinitions.map(col => ({
  id: col.id!,
  label: col.header as string,
}));

const defaultPreferences: CollectionPreferencesProps.Preferences = {
  contentDisplay: columnDefinitions.map(col => ({ id: col.id!, visible: true })),
  pageSize: 10,
};

export default function App() {
  const [preferences, setPreferences] = useState<CollectionPreferencesProps.Preferences>(defaultPreferences);

  function handleColumnWidthsChange(event: { detail: TableProps.ColumnWidthsChangeDetail }) {
    // When columnDisplay is present in the event detail, persist the updated widths
    // back into preferences so they survive a page reload.
    if (event.detail.columnDisplay) {
      setPreferences(prev => ({ ...prev, contentDisplay: event.detail.columnDisplay }));
    }
  }

  return (
    <SpaceBetween size="l">
      <Header variant="h1">Column width persistence</Header>
      <Box>
        <strong>How it works:</strong> Resize a column, then observe the <em>preferences.contentDisplay</em> state
        update below. The widths are stored in <code>contentDisplay[i].width</code> and fed back via{' '}
        <code>columnDisplay</code>, so they survive a simulated reload.
      </Box>
      <Table
        header={
          <Header
            actions={
              <CollectionPreferences
                title="Preferences"
                confirmLabel="Confirm"
                cancelLabel="Cancel"
                preferences={preferences}
                onConfirm={({ detail }) => setPreferences(detail)}
                contentDisplayPreference={{
                  title: 'Column display',
                  description: 'Customize column order and visibility.',
                  options: contentDisplayOptions,
                }}
                pageSizePreference={{
                  title: 'Page size',
                  options: [
                    { value: 10, label: '10 resources' },
                    { value: 25, label: '25 resources' },
                  ],
                }}
              />
            }
          >
            Instances
          </Header>
        }
        columnDefinitions={columnDefinitions}
        columnDisplay={preferences.contentDisplay as TableProps.ColumnDisplay[]}
        resizableColumns={true}
        items={items}
        ariaLabels={{
          resizerRoleDescription: 'resize button',
          resizerTooltipText: 'Drag or press Enter to resize',
          tableLabel: 'Instances table',
        }}
        onColumnWidthsChange={handleColumnWidthsChange}
      />
      <Box>
        <strong>Current preferences.contentDisplay:</strong>
        <pre
          id="preferences-state"
          style={{
            fontSize: '12px',
            // Use theme-aware design tokens so the code block keeps sufficient
            // color contrast in both light and dark modes.
            background: colorBackgroundContainerContent,
            color: colorTextBodyDefault,
            padding: '8px',
          }}
        >
          {JSON.stringify(preferences.contentDisplay, null, 2)}
        </pre>
      </Box>
    </SpaceBetween>
  );
}
