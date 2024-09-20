// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import zipObject from 'lodash/zipObject';

import { NonCancelableCustomEvent } from '~components';
import AppLayout from '~components/app-layout';
import Button from '~components/button';
import Drawer from '~components/drawer';
import Header from '~components/header';
import Input from '~components/input';
import ScreenreaderOnly from '~components/internal/components/screenreader-only';
import Link from '~components/link';
import SpaceBetween from '~components/space-between';
import Table, { TableProps } from '~components/table';

import { IframeWrapper } from '../utils/iframe-wrapper';
import ScreenshotArea from '../utils/screenshot-area';
import { Breadcrumbs, Containers, Navigation } from './utils/content-blocks';
import labels from './utils/labels';

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
    cell: item => (
      <Link external={true} href="https://cloudscape.aws.dev/components/drawer/">
        {item.text}
      </Link>
    ),
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
];

function DrawerContent() {
  const [selectedItems, setSelectedItems] = useState<Array<Item>>([]);
  const [columns, setColumns] = useState(columnsConfig);
  const [columnDisplay] = useState([
    { id: 'name', visible: true },
    { id: 'region', visible: true },
    { id: 'description', visible: true },
    { id: 'state', visible: true },
    { id: 'extra', visible: false },
  ]);

  function handleWidthChange(event: NonCancelableCustomEvent<TableProps.ColumnWidthsChangeDetail>) {
    console.log('handleWidthChange');
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
    <Drawer header={<h2>Simple table</h2>}>
      <Input value={''} />
      <Table<Item>
        selectedItems={selectedItems}
        onSelectionChange={({ detail: { selectedItems } }) => setSelectedItems(selectedItems)}
        stickyHeader={true}
        resizableColumns={true}
        enableKeyboardNavigation={false}
        contentDensity="compact"
        selectionType="multi"
        variant="embedded"
        columnDefinitions={columns}
        columnDisplay={columnDisplay}
        items={items}
        wrapLines={false}
        empty={
          <>
            <p>No resources to display</p>
            <Button>Create some</Button>
          </>
        }
        onColumnWidthsChange={handleWidthChange}
      />
    </Drawer>
  );
}

function InnerApp() {
  return (
    <AppLayout
      data-testid="secondary-layout"
      ariaLabels={labels}
      breadcrumbs={<Breadcrumbs />}
      navigationHide={true}
      content={
        <SpaceBetween size="s">
          <Header variant="h1" description="This page contains nested app layout instances with an iframe">
            Multiple app layouts with iframe
          </Header>
          <DrawerContent />
          <Containers />
        </SpaceBetween>
      }
      drawers={[
        {
          ariaLabels: {
            closeButton: 'ProHelp close button',
            drawerName: 'ProHelp drawer content',
            triggerButton: 'ProHelp trigger button',
            resizeHandle: 'ProHelp resize handle',
          },
          content: <DrawerContent />,
          id: 'pro-help',
          trigger: {
            iconName: 'contact',
          },
          resizable: true,
          defaultSize: 600,
        },
      ]}
    />
  );
}

export default function () {
  return (
    <ScreenshotArea gutters={false}>
      <AppLayout
        data-testid="main-layout"
        ariaLabels={labels}
        navigation={<Navigation />}
        toolsHide={true}
        disableContentPaddings={true}
        content={
          <>
            <ScreenreaderOnly>
              <h1>Multiple app layouts with iframe</h1>
            </ScreenreaderOnly>
            <IframeWrapper id="inner-iframe" AppComponent={InnerApp} />
          </>
        }
      />
    </ScreenshotArea>
  );
}
