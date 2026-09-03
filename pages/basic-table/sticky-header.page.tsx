// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useMemo, useState } from 'react';

import BasicTable, {
  BasicTableBody,
  BasicTableCell,
  BasicTableHeader,
  BasicTableHeaderCell,
  BasicTableRow,
} from '~components/beta/basic-table-0.1';
import Box from '~components/box';
import Button from '~components/button';
import Header from '~components/header';
import Pagination from '~components/pagination';
import SpaceBetween from '~components/space-between';

interface Item {
  id: string;
  name: string;
  type: string;
  status: string;
}

const makeItems = (n: number): Item[] =>
  Array.from({ length: n }, (_, index) => ({
    id: `row-${index}`,
    name: `Resource ${index}`,
    type: index % 3 === 0 ? 'Compute' : index % 3 === 1 ? 'Storage' : 'Network',
    status: index % 2 === 0 ? 'Available' : 'Pending',
  }));

// Name fixed 220, Type flexible (min 160), Status flexible.
const COLUMNS = [{ width: 220 }, { minWidth: 160 }, {}];

type SortDirection = 'ascending' | 'descending';

export default function BasicTableStickyHeaderPage() {
  const baseItems = useMemo(() => makeItems(40), []);
  const [currentPageIndex, setCurrentPageIndex] = useState(1);
  // BYO sort state — a composed sort control (the header owns no sort API; the consumer renders a
  // sort button in the header cell and reorders the data). Proves the composition works, including
  // while the header is stuck (the pinned overlay preserves the button's onClick).
  const [sortDirection, setSortDirection] = useState<SortDirection | null>(null);

  const items = useMemo(() => {
    if (!sortDirection) {
      return baseItems;
    }
    const sorted = [...baseItems].sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
    return sortDirection === 'descending' ? sorted.reverse() : sorted;
  }, [baseItems, sortDirection]);

  const toggleSort = () => setSortDirection(prev => (prev === 'ascending' ? 'descending' : 'ascending'));

  return (
    <Box padding="l">
      <SpaceBetween size="l">
        <Box variant="h1">BasicTable — stickyHeader slot</Box>
        <Box variant="p">
          Scroll the page. The <code>stickyHeader</code> slot (title + counter + action) pins to the top
          of the viewport, and the <code>BasicTableHeader</code> column row pins directly beneath it via
          the measured offset. The Name column carries a composed sort control (BYO sort state) and the
          columns are resizable; both continue to work while the header is stuck. This paragraph sits
          before the table and is NOT part of any sticky slot.
        </Box>

        {/* Unbounded (page-scroll) model → the sticky-header overlay pins on the page. */}
        <BasicTable
          columns={COLUMNS}
          totalRowCount={items.length}
          resizableColumns={true}
          i18nStrings={{ tableLabel: 'Resources' }}
          stickyHeader={
            <Header counter={`(${items.length})`} actions={<Button variant="primary">Create resource</Button>}>
              Resources
            </Header>
          }
        >
          <BasicTableHeader>
            <BasicTableHeaderCell aria-sort={sortDirection ?? 'none'}>
              <button type="button" onClick={toggleSort} data-testid="name-sort" className="bt-demo-sort-button">
                Name{sortDirection === 'ascending' ? ' \u25B2' : sortDirection === 'descending' ? ' \u25BC' : ''}
              </button>
            </BasicTableHeaderCell>
            <BasicTableHeaderCell>Type</BasicTableHeaderCell>
            <BasicTableHeaderCell>Status</BasicTableHeaderCell>
          </BasicTableHeader>
          <BasicTableBody>
            {items.map((item, index) => (
              <BasicTableRow key={item.id} index={index} id={item.id}>
                <BasicTableCell>{item.name}</BasicTableCell>
                <BasicTableCell>{item.type}</BasicTableCell>
                <BasicTableCell>{item.status}</BasicTableCell>
              </BasicTableRow>
            ))}
          </BasicTableBody>
        </BasicTable>

        <Pagination
          currentPageIndex={currentPageIndex}
          pagesCount={5}
          onChange={e => setCurrentPageIndex(e.detail.currentPageIndex)}
        />
        <Box variant="p">Content composed after the BasicTable (not sticky).</Box>
      </SpaceBetween>
    </Box>
  );
}
