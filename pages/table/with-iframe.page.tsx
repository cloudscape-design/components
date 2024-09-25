// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useContext, useState } from 'react';
import zipObject from 'lodash/zipObject';

import { useCollection } from '@cloudscape-design/collection-hooks';

import { Box, NonCancelableCustomEvent, SpaceBetween, Table, TableProps, TextFilter } from '~components';

import AppContext, { AppContextType } from '../app/app-context';
import { IframeWrapper } from '../utils/iframe-wrapper';
import { generateItems } from './generate-data';
import { columnsConfig, selectionLabels } from './shared-configs';

type PageContext = React.Context<
  AppContextType<{
    iframe?: boolean;
  }>
>;

const allItems = generateItems(10);

export default function () {
  const {
    urlParams: { iframe = true },
  } = useContext(AppContext as PageContext);
  return (
    <Box margin="m">
      <h1>Table inside iframe</h1>
      {iframe ? <IframeWrapper id="inner-iframe" AppComponent={DemoTable} /> : <DemoTable />}
    </Box>
  );
}

function DemoTable() {
  const [columns, setColumns] = useState(columnsConfig);

  function handleWidthChange(event: NonCancelableCustomEvent<TableProps.ColumnWidthsChangeDetail>) {
    const widths = zipObject(
      columnsConfig.map(column => column.id!),
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

  const { items, collectionProps, filterProps } = useCollection(allItems, {
    sorting: {},
    filtering: {
      empty: 'No resources to display',
      noMatch: 'No resources matched',
    },
    selection: {},
  });

  return (
    <SpaceBetween size="m">
      <TextFilter {...filterProps} />

      <Table
        items={items}
        {...collectionProps}
        ariaLabels={selectionLabels}
        stickyHeader={true}
        resizableColumns={true}
        enableKeyboardNavigation={true}
        selectionType="multi"
        columnDefinitions={columns}
        onColumnWidthsChange={handleWidthChange}
      />
    </SpaceBetween>
  );
}
