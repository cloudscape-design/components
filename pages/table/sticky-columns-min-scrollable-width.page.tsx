// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useState } from 'react';

import { useCollection } from '@cloudscape-design/collection-hooks';

import { FormField, Select } from '~components';
import Header from '~components/header';
import Input from '~components/input';
import SpaceBetween from '~components/space-between';
import Table, { TableProps } from '~components/table';

import AppContext, { AppContextType } from '../app/app-context';
import ScreenshotArea from '../utils/screenshot-area';
import { generateItems, Instance } from './generate-data';

type DemoContext = React.Context<
  AppContextType<{
    stickyColumnsFirst: string;
    minScrollableWidth: string;
  }>
>;

const tableItems: Instance[] = generateItems(10);

const COLUMN_DEFINITIONS: TableProps.ColumnDefinition<Instance>[] = [
  { id: 'id', header: 'ID', minWidth: 180, cell: item => item.id },
  { id: 'state', header: 'State', minWidth: 180, cell: item => item.state },
  { id: 'type', header: 'Type', minWidth: 180, cell: item => item.type },
  { id: 'imageId', header: 'Image ID', minWidth: 180, cell: item => item.imageId },
  { id: 'dnsName', header: 'DNS name', minWidth: 220, cell: item => item.dnsName || '-' },
];

const ariaLabels: TableProps<Instance>['ariaLabels'] = {
  tableLabel: 'Min scrollable width demo table',
};

// A narrow wrapper where the default 148px minimum scrollable space would deactivate
// sticky columns. Lowering `minScrollableWidth` keeps the first column pinned.
const stickyColumnsOptions = [{ value: '0' }, { value: '1' }, { value: '2' }];
const minScrollableWidthOptions = [
  { value: 'default', label: 'default (148)' },
  { value: '0', label: '0' },
  { value: '40', label: '40' },
  { value: '148', label: '148' },
  { value: '300', label: '300' },
];

export default () => {
  const { urlParams, setUrlParams } = useContext(AppContext as DemoContext);
  const [inputValue, setInputValue] = useState('');
  const { items, collectionProps } = useCollection(tableItems, { pagination: {}, sorting: {} });

  const stickyColumnsFirst = parseInt(urlParams.stickyColumnsFirst || '1');
  const minScrollableWidth =
    urlParams.minScrollableWidth && urlParams.minScrollableWidth !== 'default'
      ? parseInt(urlParams.minScrollableWidth)
      : undefined;

  return (
    <ScreenshotArea>
      <h1>Sticky columns – minScrollableWidth</h1>
      <SpaceBetween size="l">
        <SpaceBetween direction="horizontal" size="m">
          <FormField label="Sticky columns first">
            <Select
              selectedOption={
                stickyColumnsOptions.find(o => o.value === urlParams.stickyColumnsFirst) ?? stickyColumnsOptions[1]
              }
              options={stickyColumnsOptions}
              onChange={event => setUrlParams({ stickyColumnsFirst: event.detail.selectedOption.value })}
            />
          </FormField>

          <FormField label="minScrollableWidth">
            <Select
              selectedOption={
                minScrollableWidthOptions.find(o => o.value === urlParams.minScrollableWidth) ??
                minScrollableWidthOptions[0]
              }
              options={minScrollableWidthOptions}
              onChange={event => setUrlParams({ minScrollableWidth: event.detail.selectedOption.value })}
            />
          </FormField>

          <FormField label="Filter (keeps focus behind sticky column)">
            <Input value={inputValue} onChange={event => setInputValue(event.detail.value)} />
          </FormField>
        </SpaceBetween>

        {/* Constrain the table so it becomes horizontally scrollable within a narrow viewport. */}
        <div style={{ maxWidth: 600 }}>
          <Table
            {...collectionProps}
            data-test-id="min-scrollable-width-table"
            stickyColumns={{ first: stickyColumnsFirst, minScrollableWidth }}
            columnDefinitions={COLUMN_DEFINITIONS}
            items={items}
            ariaLabels={ariaLabels}
            header={<Header>Narrow table with configurable minScrollableWidth</Header>}
          />
        </div>
      </SpaceBetween>
    </ScreenshotArea>
  );
};
