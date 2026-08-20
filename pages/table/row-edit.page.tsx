// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { Box, Button, Header, Input, SpaceBetween } from '~components';
import Table, { TableProps } from '~components/table';

import ScreenshotArea from '../utils/screenshot-area';

interface Item {
  id: string;
  name: string;
  status: string;
  region: string;
}

const initialItems: Item[] = [
  { id: 'i-001', name: 'Web server', status: 'running', region: 'us-east-1' },
  { id: 'i-002', name: 'Database', status: 'stopped', region: 'eu-west-1' },
  { id: 'i-003', name: 'Cache layer', status: 'running', region: 'ap-southeast-1' },
  { id: 'i-004', name: 'Worker (locked)', status: 'pending', region: 'us-west-2' },
];

export default function TableRowEditPage() {
  const [items, setItems] = useState<Item[]>(initialItems);
  const [submitLog, setSubmitLog] = useState<string[]>([]);

  const columnDefinitions: TableProps.ColumnDefinition<Item>[] = [
    {
      id: 'id',
      header: 'Instance ID',
      cell: item => item.id,
    },
    {
      id: 'name',
      header: 'Name',
      cell: item => item.name,
      editConfig: {
        ariaLabel: 'Name',
        editIconAriaLabel: 'editable',
        errorIconAriaLabel: 'Name Error',
        editingCell(item, { currentValue, setValue }: TableProps.CellContext<string>) {
          return (
            <Input autoFocus={true} value={currentValue ?? item.name} onChange={e => setValue(e.detail.value)} />
          );
        },
      },
    },
    {
      id: 'status',
      header: 'Status',
      cell: item => item.status,
      editConfig: {
        ariaLabel: 'Status',
        editIconAriaLabel: 'editable',
        errorIconAriaLabel: 'Status Error',
        editingCell(item, { currentValue, setValue }: TableProps.CellContext<string>) {
          return (
            <Input value={currentValue ?? item.status} onChange={e => setValue(e.detail.value)} />
          );
        },
      },
    },
    {
      id: 'region',
      header: 'Region',
      cell: item => item.region,
      editConfig: {
        ariaLabel: 'Region',
        editIconAriaLabel: 'editable',
        errorIconAriaLabel: 'Region Error',
        editingCell(item, { currentValue, setValue }: TableProps.CellContext<string>) {
          return (
            <Input value={currentValue ?? item.region} onChange={e => setValue(e.detail.value)} />
          );
        },
      },
    },
  ];

  const ariaLabels: TableProps.AriaLabels<Item> = {
    tableLabel: 'Instances (row edit)',
    activateRowEditLabel: item => `Edit row ${item.id}`,
    cancelRowEditLabel: item => `Cancel editing row ${item.id}`,
    submitRowEditLabel: item => `Save row ${item.id}`,
    submittingRowEditText: item => `Saving row ${item.id}`,
  };

  async function handleSubmitRowEdit(item: Item, newValues: Map<string, unknown>) {
    // Simulate async save
    await new Promise(resolve => setTimeout(resolve, 600));
    setItems(prev =>
      prev.map(i => {
        if (i.id !== item.id) {
          return i;
        }
        return {
          ...i,
          name: (newValues.get('name') as string | undefined) ?? i.name,
          status: (newValues.get('status') as string | undefined) ?? i.status,
          region: (newValues.get('region') as string | undefined) ?? i.region,
        };
      })
    );
    const changes = Array.from(newValues.entries())
      .map(([k, v]) => `${k}="${v}"`)
      .join(', ');
    setSubmitLog(prev => [`Saved ${item.id}: ${changes || '(no changes)'}`, ...prev].slice(0, 5));
  }

  return (
    <ScreenshotArea disableAnimations={true}>
      <SpaceBetween size="l">
        <Table
          header={<Header>Instances — row-level inline editing</Header>}
          items={items}
          columnDefinitions={columnDefinitions}
          trackBy="id"
          ariaLabels={ariaLabels}
          rowEditingConfig={{
            disabledReason: item => (item.id === 'i-004' ? 'This instance is locked and cannot be edited.' : undefined),
          }}
          submitRowEdit={handleSubmitRowEdit}
        />

        {submitLog.length > 0 && (
          <Box>
            <Box variant="h3">Submit log (last 5)</Box>
            {submitLog.map((entry, i) => (
              <Box key={i} variant="p">
                {entry}
              </Box>
            ))}
          </Box>
        )}

        <Button onClick={() => setSubmitLog([])}>Clear log</Button>
      </SpaceBetween>
    </ScreenshotArea>
  );
}
