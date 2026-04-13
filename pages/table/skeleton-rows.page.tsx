// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Checkbox from '~components/checkbox';
import ColumnLayout from '~components/column-layout';
import Container from '~components/container';
import FormField from '~components/form-field';
import Header from '~components/header';
import Input from '~components/input';
import RadioGroup from '~components/radio-group';
import SpaceBetween from '~components/space-between';
import Table from '~components/table';

import { useAppContext } from '../app/app-context';

interface Item {
  id: string;
  name: string;
  description: string;
  type: string;
}

function generateItems(count: number): Item[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `item-${i + 1}`,
    name: `Item ${i + 1}`,
    description: `Description for item ${i + 1}`,
    type: i % 2 === 0 ? 'Type A' : 'Type B',
  }));
}

type LoadingState = 'skeleton' | 'loading' | 'data';
type SelectionMode = 'none' | 'single' | 'multi';

export default function TableSkeletonRowsPage() {
  const { urlParams, setUrlParams } = useAppContext<'loadingState' | 'skeletonRows' | 'dataRows' | 'stripedRows' | 'selectionMode'>();
  
  const loadingState = (urlParams.loadingState || 'skeleton') as LoadingState;
  const skeletonRowsCount = String(urlParams.skeletonRows || '5');
  const dataRowsCount = String(urlParams.dataRows || '10');
  const stripedRows = urlParams.stripedRows !== 'false' && urlParams.stripedRows !== false;
  const selectionMode = (urlParams.selectionMode || 'multi') as SelectionMode;
  
  const [selectedItems, setSelectedItems] = useState<Item[]>([]);

  const skeletonRows = parseInt(skeletonRowsCount, 10) || 0;
  const dataRows = parseInt(dataRowsCount, 10) || 0;
  const items = loadingState === 'data' ? generateItems(dataRows) : [];

  const columnDefinitions = [
    {
      id: 'id',
      header: 'ID',
      cell: (item: Item) => item.id,
    },
    {
      id: 'name',
      header: 'Name',
      cell: (item: Item) => item.name,
    },
    {
      id: 'description',
      header: 'Description',
      cell: (item: Item) => item.description,
    },
    {
      id: 'type',
      header: 'Type',
      cell: (item: Item) => item.type,
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <SpaceBetween size="l">
        <Header variant="h1">Table with Skeleton Rows - Interactive Demo</Header>

        <Container header={<Header variant="h3">Controls</Header>}>
          <SpaceBetween size="l">
            <ColumnLayout columns={2}>
              <FormField label="Loading State">
                <RadioGroup
                  value={loadingState}
                  onChange={({ detail }) => setUrlParams({ loadingState: detail.value })}
                  items={[
                    { value: 'skeleton', label: 'Skeleton Rows', description: 'Show skeleton placeholders' },
                    { value: 'loading', label: 'Standard Loading', description: 'Show spinner with loading text' },
                    { value: 'data', label: 'Actual Data', description: 'Display real table data' },
                  ]}
                />
              </FormField>

              <FormField label="Selection Mode">
                <RadioGroup
                  value={selectionMode}
                  onChange={({ detail }) => setUrlParams({ selectionMode: detail.value })}
                  items={[
                    { value: 'none', label: 'None', description: 'No selection' },
                    { value: 'single', label: 'Single', description: 'Single row selection' },
                    { value: 'multi', label: 'Multi', description: 'Multiple row selection' },
                  ]}
                />
              </FormField>
            </ColumnLayout>

            <ColumnLayout columns={3}>
              <FormField label="Number of Skeleton Rows" stretch={false}>
                <Input
                  value={skeletonRowsCount}
                  onChange={({ detail }) => setUrlParams({ skeletonRows: detail.value })}
                  type="number"
                  inputMode="numeric"
                  step={1}
                />
              </FormField>

              <FormField label="Number of Data Rows" stretch={false}>
                <Input
                  value={dataRowsCount}
                  onChange={({ detail }) => setUrlParams({ dataRows: detail.value })}
                  type="number"
                  inputMode="numeric"
                  step={1}
                />
              </FormField>

              <FormField label="Table Options" stretch={false}>
                <Checkbox 
                  checked={stripedRows} 
                  onChange={({ detail }) => setUrlParams({ stripedRows: detail.checked })}
                >
                  Striped rows
                </Checkbox>
              </FormField>
            </ColumnLayout>
          </SpaceBetween>
        </Container>

        <Table
          columnDefinitions={columnDefinitions}
          items={items}
          skeletonRows={loadingState === 'skeleton' ? skeletonRows : undefined}
          loading={loadingState === 'loading'}
          loadingText="Loading items..."
          empty="No items to display"
          selectionType={selectionMode === 'none' ? undefined : selectionMode}
          selectedItems={selectionMode !== 'none' ? selectedItems : undefined}
          onSelectionChange={selectionMode !== 'none' ? ({ detail }) => setSelectedItems(detail.selectedItems) : undefined}
          stripedRows={stripedRows}
          header={
            <Header
              counter={loadingState === 'data' ? `(${items.length})` : undefined}
              description="Interactive demo showing skeleton rows, standard loading, and actual data"
            >
              Table Demo
            </Header>
          }
        />
      </SpaceBetween>
    </div>
  );
}
