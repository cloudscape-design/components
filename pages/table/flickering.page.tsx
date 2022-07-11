// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { useCollection } from '@cloudscape-design/collection-hooks';
import Box from '~components/box';
import Button from '~components/button';
import Header from '~components/header';
import Pagination from '~components/pagination';
import Table from '~components/table';
import TextFilter from '~components/text-filter';
import { Instance, generateItems } from './generate-data';
import { columnsConfig, EmptyState, getMatchesCountText, paginationLabels } from './shared-configs';

const allItems = generateItems();

export default function App() {
  const { actions, filteredItemsCount, collectionProps, filterProps, paginationProps } = useCollection(allItems, {
    filtering: {
      empty: (
        <EmptyState
          title="No resources"
          subtitle="No resources to display."
          action={<Button>Create resource</Button>}
        />
      ),
      noMatch: (
        <EmptyState
          title="No matches"
          subtitle="We can’t find a match."
          action={<Button onClick={() => actions.setFiltering('')}>Clear filter</Button>}
        />
      ),
    },
    pagination: { pageSize: 20 },
    sorting: {},
  });
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'stretch',
        flexWrap: 'nowrap',
        width: 'calc(100% - 32px)',
        margin: '16px',
      }}
    >
      <Box>Resize window to trigger oscillation</Box>
      <div style={{ display: 'flex', flexGrow: 1 }}>
        <Table<Instance>
          {...collectionProps}
          resizableColumns={true}
          header={
            <Header headingTagOverride="h1" counter={`(${allItems.length})`}>
              Instances
            </Header>
          }
          columnDefinitions={columnsConfig}
          items={[]}
          pagination={<Pagination {...paginationProps} ariaLabels={paginationLabels} />}
          filter={
            <TextFilter
              {...filterProps!}
              countText={getMatchesCountText(filteredItemsCount!)}
              filteringAriaLabel="Filter instances"
            />
          }
        />
      </div>
    </div>
  );
}
