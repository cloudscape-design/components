// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import AppLayout from '~components/app-layout';
import SplitPanel from '~components/split-panel';
import Header from '~components/header';
import SpaceBetween from '~components/space-between';
import Toggle from '~components/toggle';
import Table from '~components/Table';
import Box from '~components/Box';
import Link from '~components/Link';
import Button from '~components/Button';

export default function () {
  const [splitPanelExists, setSplitPanelExists] = useState(true);

  return (
    <AppLayout
      toolsHide={true}
      navigationHide={true}
      splitPanel={
        splitPanelExists ? <SplitPanel header="Split panel header">Split panel content</SplitPanel> : undefined
      }
      content={
        <SpaceBetween size="l">
          <Toggle checked={splitPanelExists} onChange={e => setSplitPanelExists(e.detail.checked)}>
            Has split panel
          </Toggle>
          {table}
        </SpaceBetween>
      }
    />
  );
}

const items = [
  {
    name: 'Item 1',
    alt: 'First',
    description: 'This is the first item',
    type: '1A',
    size: 'Small',
  },
  {
    name: 'Item 2',
    alt: 'Second',
    description: 'This is the second item',
    type: '1B',
    size: 'Large',
  },
  {
    name: 'Item 3',
    alt: 'Third',
    description: '-',
    type: '1A',
    size: 'Large',
  },
  {
    name: 'Item 4',
    alt: 'Fourth',
    description: 'This is the fourth item',
    type: '2A',
    size: 'Small',
  },
  {
    name: 'Item 5',
    alt: '-',
    description: 'This is the fifth item with a longer description',
    type: '2A',
    size: 'Large',
  },
  {
    name: 'Item 6',
    alt: 'Sixth',
    description: 'This is the sixth item',
    type: '1A',
    size: 'Small',
  },
];

const table = (
  <Table
    columnDefinitions={[
      {
        id: 'variable',
        header: 'Variable name',
        cell: item => <Link href="#">{item.name || '-'}</Link>,
        sortingField: 'name',
        isRowHeader: true,
      },
      {
        id: 'alt',
        header: 'Text value',
        cell: item => item.alt || '-',
        sortingField: 'alt',
      },
      {
        id: 'description',
        header: 'Description',
        cell: item => item.description || '-',
      },
      {
        id: 'description2',
        header: 'Description',
        cell: item => item.description || '-',
      },
      {
        id: 'description3',
        header: 'Description',
        cell: item => item.description || '-',
      },
      {
        id: 'description4',
        header: 'Description',
        cell: item => item.description || '-',
      },
    ]}
    enableKeyboardNavigation={true}
    items={[...items, ...items, ...items, ...items]}
    loadingText="Loading resources"
    sortingDisabled={true}
    empty={
      <Box margin={{ vertical: 'xs' }} textAlign="center" color="inherit">
        <SpaceBetween size="m">
          <b>No resources</b>
          <Button>Create resource</Button>
        </SpaceBetween>
      </Box>
    }
    header={<Header> Simple table </Header>}
  />
);
