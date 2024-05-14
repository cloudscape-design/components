// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState, useRef, useImperativeHandle } from 'react';
import { useCollection } from '@cloudscape-design/collection-hooks';
import Button from '~components/button';
import Header from '~components/header';
import Pagination from '~components/pagination';
import Table, { TableProps } from '~components/table';
import TextFilter from '~components/text-filter';
import { Instance, generateItems } from '../table/generate-data';
import {
  columnsConfig,
  EmptyState,
  getMatchesCountText,
  selectionLabels,
  paginationLabels,
} from '../table/shared-configs';

export default function () {
  const tableRef = useRef<TableProps.Ref>(null);
  const [stickyHeaderVerticalOffset, setStickyOffset] = useState<number>();
  const [stickyHeader, setStickyHeader] = useState<boolean>(true);
  const [pagination, setPagination] = useState<boolean>(true);
  return (
    <>
      <h1>Table with a sticky header in app layout</h1>
      <div style={{ blockSize: '400px', width: '500px', overflow: 'auto', padding: '0px 1px' }} id="scroll-container">
        <div style={{ blockSize: '100px' }} />
        <HooksTable
          pagination={pagination}
          tableRef={tableRef}
          stickyHeaderVerticalOffset={stickyHeaderVerticalOffset}
          stickyHeader={stickyHeader}
        />
      </div>
      <button onClick={() => tableRef.current && tableRef.current.scrollToTop()} id="scroll-to-top">
        scroll to top
      </button>
      <button onClick={() => setStickyHeader(!stickyHeader)} id="toggle-sticky">
        toggle sticky header
      </button>
      <button onClick={() => setStickyOffset(50)} id="set-sticky-offset">
        set sticky offset
      </button>
      <button onClick={() => setPagination(!pagination)} id="toggle-pagination">
        toggle pagination
      </button>
    </>
  );
}

const allItems = generateItems();
const PAGE_SIZE = 20;

function HooksTable({
  tableRef,
  stickyHeaderVerticalOffset,
  stickyHeader,
  pagination,
}: {
  tableRef: React.RefObject<TableProps.Ref>;
  stickyHeaderVerticalOffset?: number;
  stickyHeader?: boolean;
  pagination?: boolean;
}) {
  const { items, actions, filteredItemsCount, collectionProps, filterProps, paginationProps } = useCollection(
    allItems,
    {
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
      pagination: { pageSize: PAGE_SIZE },
      sorting: {},
    }
  );
  useImperativeHandle(tableRef, () => ({
    scrollToTop: () => {
      collectionProps.ref.current && collectionProps.ref.current.scrollToTop();
    },
  }));
  const [selectedItems, setSelectedItems] = useState<Instance[]>();

  return (
    <Table<Instance>
      ariaLabels={selectionLabels}
      selectionType="multi"
      selectedItems={selectedItems}
      onSelectionChange={e => setSelectedItems(e.detail.selectedItems)}
      {...collectionProps}
      header={
        <Header headingTagOverride="h1" counter={`(${allItems.length})`}>
          Instances
        </Header>
      }
      columnDefinitions={columnsConfig}
      items={items}
      filter={
        <TextFilter
          {...filterProps!}
          countText={getMatchesCountText(filteredItemsCount!)}
          filteringAriaLabel="Filter instances"
        />
      }
      {...(pagination ? { pagination: <Pagination {...paginationProps} ariaLabels={paginationLabels} /> } : {})}
      preferences={<Button variant="icon" iconName="settings" ariaLabel="Open preferences" />}
      stickyHeader={stickyHeader}
      stickyHeaderVerticalOffset={stickyHeaderVerticalOffset}
    />
  );
}
