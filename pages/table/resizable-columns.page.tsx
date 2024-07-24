// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useState } from 'react';
import range from 'lodash/range';
import zipObject from 'lodash/zipObject';

import Button from '~components/button';
import Checkbox from '~components/checkbox';
import ColumnLayout from '~components/column-layout';
import Container from '~components/container';
import Header from '~components/header';
import { NonCancelableCustomEvent } from '~components/interfaces';
import Link from '~components/link';
import SpaceBetween from '~components/space-between';
import Table, { TableProps } from '~components/table';

import AppContext, { AppContextType } from '../app/app-context';
import ScreenshotArea from '../utils/screenshot-area';

declare global {
  interface Window {
    __columnWidths: readonly number[];
  }
}

interface Item {
  id: number;
  text: string;
  description: string;
  region: string;
  state: string;
}

const columnsConfig: TableProps.ColumnDefinition<Item>[] = [
  {
    id: 'name',
    header: 'Name',
    cell: item => <Link href={`#${item.id}`}>{item.text}</Link>,
    width: 200,
  },
  {
    id: 'region',
    header: 'Region',
    cell: item => item.region,
    minWidth: 130,
    width: 130,
    sortingField: 'region',
  },
  {
    id: 'description',
    header: 'Description',
    minWidth: 100,
    cell: item => item.description,
  },
  {
    id: 'state',
    header: 'State',
    maxWidth: 150,
    cell: item => item.state,
  },
  {
    id: 'extra',
    header: 'Extra column',
    cell: () => '-',
  },
];

const items: Item[] = [
  {
    id: 0,
    text: 'Predefined width',
    description: 'Min width 100px',
    region: 'Min and max width',
    state: 'Max width 150px',
  },
  { id: 1, text: 'Instance 1', description: 'Small description', region: 'us-east-1', state: 'RUNNING' },
  { id: 2, text: 'Instance 2', description: 'Some a little longer description', region: 'us-west-2', state: 'RUNNING' },
  {
    id: 3,
    text: 'Instance 3',
    description: 'Very very very very very long description',
    region: 'us-west-2',
    state: 'RUNNING',
  },
  { id: 4, text: 'Instance 4', description: '-', region: 'us-east-2', state: 'STOPPED' },
  { id: 5, text: 'Instance 5', description: 'Normal length description', region: 'us-east-1', state: 'RUNNING' },
  ...range(6, 45).map(number => ({
    id: number,
    text: `Instance ${number}`,
    description: '-',
    region: 'undisclosed location',
    state: 'REDACTED',
  })),
];

type PageContext = React.Context<
  AppContextType<{
    wrapLines: boolean;
    stickyHeader: boolean;
    resizableColumns: boolean;
    fullPage: boolean;
    withColumnIds?: boolean;
    withSelection?: boolean;
    enableKeyboardNavigation?: boolean;
  }>
>;

export default function App() {
  const { urlParams, setUrlParams } = useContext(AppContext as PageContext);
  const {
    wrapLines = false,
    stickyHeader = false,
    resizableColumns = true,
    fullPage = false,
    withColumnIds = true,
    withSelection = false,
    enableKeyboardNavigation = false,
  } = urlParams;

  const [renderKey, setRenderKey] = useState(0);
  const [columns, setColumns] = useState(columnsConfig);
  const [columnDisplay, setColumnDisplay] = useState([
    { id: 'name', visible: true },
    { id: 'region', visible: true },
    { id: 'description', visible: true },
    { id: 'state', visible: true },
    { id: 'extra', visible: false },
  ]);

  const [sorting, setSorting] = useState<TableProps.SortingState<any>>();

  function handleWidthChange(event: NonCancelableCustomEvent<TableProps.ColumnWidthsChangeDetail>) {
    window.__columnWidths = event.detail.widths;
    const widths = zipObject(
      columnDisplay.map(column => column.id!),
      event.detail.widths
    );
    setColumns(oldColumns =>
      oldColumns.map(column => {
        if (!widths[column.id!]) {
          return column;
        }
        return { ...column, width: widths[column.id!] };
      })
    );
  }

  return (
    <SpaceBetween size="l">
      <Header variant="h1">Resizable columns</Header>
      <Container header={<Header>Preferences</Header>}>
        <ColumnLayout columns={3} borders="vertical">
          <div>
            <Checkbox checked={wrapLines} onChange={event => setUrlParams({ wrapLines: event.detail.checked })}>
              Wrap lines
            </Checkbox>
            <Checkbox
              id="sticky-header-toggle"
              checked={stickyHeader}
              onChange={event => setUrlParams({ stickyHeader: event.detail.checked })}
            >
              Sticky header
            </Checkbox>
            <Checkbox
              id="resizable-columns-toggle"
              checked={resizableColumns}
              onChange={event => setUrlParams({ resizableColumns: event.detail.checked })}
            >
              Resizable columns
            </Checkbox>
            <Checkbox checked={fullPage} onChange={event => setUrlParams({ fullPage: event.detail.checked })}>
              Full page table
            </Checkbox>
            <Checkbox checked={withColumnIds} onChange={event => setUrlParams({ withColumnIds: event.detail.checked })}>
              Columns have IDs
            </Checkbox>
            <Checkbox checked={withSelection} onChange={event => setUrlParams({ withSelection: event.detail.checked })}>
              With row selection
            </Checkbox>
            <Checkbox
              checked={enableKeyboardNavigation}
              onChange={event => {
                setUrlParams({ enableKeyboardNavigation: event.detail.checked });
                window.location.reload();
              }}
            >
              Keyboard navigation
            </Checkbox>
          </div>
          <div>
            {columnsConfig.map(column => (
              <Checkbox
                key={column.id}
                id={`toggle-${column.id}`}
                checked={!!columnDisplay.find(({ id }) => id === column.id)?.visible}
                onChange={event =>
                  setColumnDisplay(visible =>
                    visible.map(item => (item.id === column.id ? { ...item, visible: event.detail.checked } : item))
                  )
                }
              >
                {column.header}
              </Checkbox>
            ))}
          </div>
          <div>
            <Button id="reset-state" onClick={() => setRenderKey(key => key + 1)}>
              Reset inner table state
            </Button>
          </div>
        </ColumnLayout>
      </Container>
      <ScreenshotArea>
        <Table<Item>
          key={renderKey}
          header={<Header>Simple table</Header>}
          stickyHeader={stickyHeader}
          columnDefinitions={columns.map(col => (withColumnIds ? col : { ...col, id: undefined }))}
          resizableColumns={resizableColumns}
          columnDisplay={withColumnIds ? columnDisplay : undefined}
          selectionType={withSelection ? 'single' : undefined}
          items={items}
          wrapLines={wrapLines}
          sortingColumn={sorting?.sortingColumn}
          sortingDescending={sorting?.isDescending}
          onSortingChange={event => setSorting(event.detail)}
          onColumnWidthsChange={handleWidthChange}
          variant={fullPage ? 'full-page' : undefined}
          enableKeyboardNavigation={enableKeyboardNavigation}
        />
      </ScreenshotArea>
    </SpaceBetween>
  );
}
