// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { Box, Button, Header, Input, SpaceBetween, StatusIndicator } from '~components';
import Table, { TableProps } from '~components/table';
// WIP (AWSUI-56121): the bulk-editing controller is not yet public API. This dev page
// imports it directly to demonstrate the intended UX until it is wired into the Table
// render path (see follow-ups in the PR description).
import { useBulkEditing } from '~components/table/use-bulk-editing';

import { DistributionInfo, initialItems } from './editable-data';

const ariaLabels: TableProps.AriaLabels<DistributionInfo> = {
  tableLabel: 'Distributions',
  activateEditLabel: (column, item) => `Edit ${item.Id} ${column.header}`,
  cancelEditLabel: column => `Cancel editing ${column.header}`,
  submitEditLabel: column => `Submit edit ${column.header}`,
  submittingEditText: () => 'Loading edit response',
  successfulEditLabel: () => 'Edit successful',
};

export default function BulkEditablePage() {
  const [items, setItems] = useState(initialItems);
  const [lastCommit, setLastCommit] = useState<string>('');

  const bulkEditConfig: TableProps.BulkEditConfig<DistributionInfo> = {
    activateBulkEditLabel: 'Edit all rows',
    submitBulkEditLabel: 'Save all changes',
    cancelBulkEditLabel: 'Discard all changes',
    onSubmit: async ({ changes }) => {
      // Simulate a server round-trip.
      await new Promise(resolve => setTimeout(resolve, 600));
      setItems(prev =>
        prev.map(item => {
          const itemChanges = changes.filter(change => change.item.Id === item.Id);
          if (itemChanges.length === 0) {
            return item;
          }
          const updated = { ...item };
          for (const change of itemChanges) {
            (updated as Record<string, unknown>)[change.column.id!] = change.newValue;
          }
          return updated;
        })
      );
      setLastCommit(`Committed ${changes.length} cell change(s) at ${new Date().toLocaleTimeString()}`);
    },
  };

  // WIP: standalone controller wired to a plain <Table> with editable columns.
  const bulkEditing = useBulkEditing<DistributionInfo>({
    items,
    trackBy: 'Id',
    columnDefinitions: [],
    bulkEdit: bulkEditConfig,
  });

  const editableColumn = (
    id: keyof DistributionInfo & string,
    header: string
  ): TableProps.ColumnDefinition<DistributionInfo> => ({
    id,
    header,
    minWidth: 200,
    cell: item => {
      const rowId = item.Id;
      if (!bulkEditing.isActive) {
        return String(item[id] ?? '');
      }
      const { isDirty, value } = bulkEditing.getCellValue(rowId, id);
      const current = isDirty ? String(value ?? '') : String(item[id] ?? '');
      return (
        <Input
          value={current}
          ariaLabel={`${header} for ${rowId}`}
          onChange={event => bulkEditing.setCellValue(rowId, id, event.detail.value)}
        />
      );
    },
  });

  const columnDefinitions: TableProps.ColumnDefinition<DistributionInfo>[] = [
    { id: 'Id', header: 'Distribution ID', width: 180, cell: item => item.Id },
    editableColumn('DomainName', 'Domain name'),
    editableColumn('Origin', 'Origin'),
    editableColumn('Status', 'Status'),
  ];

  return (
    <Box margin="s">
      <SpaceBetween size="m">
        <Header
          variant="h1"
          actions={
            !bulkEditing.isActive ? (
              <Button data-testid="start-bulk-edit" onClick={() => bulkEditing.startBulkEdit()}>
                {bulkEditConfig.activateBulkEditLabel}
              </Button>
            ) : (
              <SpaceBetween size="xs" direction="horizontal">
                <Button
                  data-testid="cancel-bulk-edit"
                  disabled={bulkEditing.isSubmitting}
                  onClick={() => bulkEditing.discardBulkEdit()}
                >
                  {bulkEditConfig.cancelBulkEditLabel}
                </Button>
                <Button
                  data-testid="submit-bulk-edit"
                  variant="primary"
                  loading={bulkEditing.isSubmitting}
                  disabled={!bulkEditing.hasChanges}
                  onClick={() => bulkEditing.submitBulkEdit()}
                >
                  {bulkEditConfig.submitBulkEditLabel} ({bulkEditing.dirtyCellCount})
                </Button>
              </SpaceBetween>
            )
          }
        >
          Bulk inline edit (WIP)
        </Header>

        {lastCommit && (
          <StatusIndicator type="success" data-testid="last-commit">
            {lastCommit}
          </StatusIndicator>
        )}

        <Table
          trackBy="Id"
          items={items}
          columnDefinitions={columnDefinitions}
          ariaLabels={ariaLabels}
          bulkEdit={bulkEditConfig}
        />
      </SpaceBetween>
    </Box>
  );
}
