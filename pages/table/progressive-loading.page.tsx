// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef, useState } from 'react';

import Box from '~components/box';
import Button from '~components/button';
import Container from '~components/container';
import FormField from '~components/form-field';
import Grid from '~components/grid';
import Header from '~components/header';
import Input from '~components/input';
import Pagination from '~components/pagination';
import Skeleton from '~components/skeleton';
import SpaceBetween from '~components/space-between';
import Spinner from '~components/spinner';
import StatusIndicator from '~components/status-indicator';
import Table from '~components/table';
import TextFilter from '~components/text-filter';
import Toggle from '~components/toggle';

import { useAppContext } from '../app/app-context';
import ScreenshotArea from '../utils/screenshot-area';

interface DataItem {
  id: string;
  name: string;
  description: string;
  status: string;
  date: string;
}

const sampleData: DataItem[] = [
  {
    id: 'item-1',
    name: 'Production Database',
    description: 'Primary production database instance',
    status: 'Active',
    date: '2026-04-15',
  },
  {
    id: 'item-2',
    name: 'Development Environment',
    description: 'Testing and development environment',
    status: 'Active',
    date: '2026-04-14',
  },
  {
    id: 'item-3',
    name: 'Analytics Pipeline',
    description: 'Data processing pipeline for analytics',
    status: 'Pending',
    date: '2026-04-13',
  },
  {
    id: 'item-4',
    name: 'Backup Server',
    description: 'Secondary backup server for disaster recovery',
    status: 'Active',
    date: '2026-04-12',
  },
];

const statuses = ['Active', 'Pending', 'Stopped', 'Terminated'];

function generateLargeDataset(count: number): DataItem[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `item-${i + 1}`,
    name: `Resource ${i + 1}`,
    description: `Description for resource ${i + 1}`,
    status: statuses[i % statuses.length],
    date: `2026-04-${String((i % 28) + 1).padStart(2, '0')}`,
  }));
}

const largeData = generateLargeDataset(25);
const PAGE_SIZE = 10;

export default function ProgressiveLoadingExplorations() {
  const { urlParams, setUrlParams } = useAppContext<'manyItems' | 'skeletonRows'>();

  // Page-level settings from URL params
  const manyItems = urlParams.manyItems !== 'false' && urlParams.manyItems !== false && !!urlParams.manyItems;
  const skeletonRowsCount = String(urlParams.skeletonRows || '10');
  const skeletonRows = parseInt(skeletonRowsCount, 10) || 10;
  const items = manyItems ? largeData : sampleData;

  // Shared pagination helper
  function paginate(allItems: DataItem[], page: number) {
    const start = (page - 1) * PAGE_SIZE;
    return allItems.slice(start, start + PAGE_SIZE);
  }

  function totalPages(allItems: DataItem[]) {
    return Math.ceil(allItems.length / PAGE_SIZE);
  }

  // Progressive Row Loading state
  const [rowPage, setRowPage] = useState(1);
  const rowPageTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rowPageItems = paginate(items, rowPage);

  const [rowLoadedState, setRowLoadedState] = useState<boolean[]>(() => rowPageItems.map(() => false));
  const rowTimerRefs = useRef<ReturnType<typeof setTimeout>[]>([]);
  const [rowLoading, setRowLoading] = useState(false);
  const [rowPaused, setRowPaused] = useState(false);
  const rowNextIndexRef = useRef(0);

  // Reset row loading when items change (toggle switch)
  useEffect(() => {
    rowTimerRefs.current.forEach(clearTimeout);
    rowTimerRefs.current = [];
    setRowLoadedState(rowPageItems.map(() => false));
    setRowPage(1);
  }, [items]); // eslint-disable-line react-hooks/exhaustive-deps

  // Once all rows are loaded, show only real items.
  const allRowsLoaded = rowLoadedState.length > 0 && rowLoadedState.every(Boolean);

  function handleRowPageChange(page: number) {
    if (rowPageTimerRef.current) {
      clearTimeout(rowPageTimerRef.current);
    }
    rowTimerRefs.current.forEach(clearTimeout);
    rowTimerRefs.current = [];
    setRowPage(page);
    const pageItems = paginate(items, page);
    setRowLoadedState(pageItems.map(() => false));
    rowNextIndexRef.current = 0;
    setRowLoading(true);
    setRowPaused(false);
    scheduleRowLoading(0);
  }

  function scheduleRowLoading(startIndex: number) {
    rowTimerRefs.current.forEach(clearTimeout);
    rowTimerRefs.current = [];
    rowPageItems.slice(startIndex).forEach((_, i) => {
      const timer = setTimeout(
        () => {
          setRowLoadedState(prev => {
            const next = [...prev];
            next[startIndex + i] = true;
            return next;
          });
          rowNextIndexRef.current = startIndex + i + 1;
          if (startIndex + i === rowPageItems.length - 1) {
            setRowLoading(false);
          }
        },
        (i + 1) * 800
      );
      rowTimerRefs.current.push(timer);
    });
  }

  function startRowLoading() {
    const initial = rowPageItems.map(() => false);
    setRowLoadedState(initial);
    rowTimerRefs.current.forEach(clearTimeout);
    rowTimerRefs.current = [];
    rowNextIndexRef.current = 0;
    setRowLoading(true);
    setRowPaused(false);
    scheduleRowLoading(0);
  }

  function pauseRowLoading() {
    rowTimerRefs.current.forEach(clearTimeout);
    rowTimerRefs.current = [];
    setRowPaused(true);
  }

  function resumeRowLoading() {
    setRowPaused(false);
    scheduleRowLoading(rowNextIndexRef.current);
  }

  function resetRowLoading() {
    rowTimerRefs.current.forEach(clearTimeout);
    rowTimerRefs.current = [];
    setRowLoadedState(rowPageItems.map(() => false));
    setRowLoading(false);
    setRowPaused(false);
    rowNextIndexRef.current = 0;
  }

  // Progressive Column Loading state
  // Step 1: initial data load (all columns except Status)
  // Step 2: Status column loads later
  const [colPage, setColPage] = useState(1);
  const [colPageLoading, setColPageLoading] = useState(false);
  const colPageTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const colPageItems = paginate(items, colPage);

  function handleColPageChange(page: number) {
    setColPageLoading(true);
    setColDataLoaded(false);
    setColStatusLoaded(false);
    if (colPageTimerRef.current) {
      clearTimeout(colPageTimerRef.current);
    }
    colTimerRefs.current.forEach(clearTimeout);
    colTimerRefs.current = [];
    colPageTimerRef.current = setTimeout(() => {
      setColPage(page);
      setColPageLoading(false);
      // After page loads, simulate the 2-step column loading
      const timer1 = setTimeout(() => {
        setColDataLoaded(true);
      }, 1500);
      const timer2 = setTimeout(() => {
        setColStatusLoaded(true);
      }, 3500);
      colTimerRefs.current.push(timer1, timer2);
    }, 1000);
  }

  const [colDataLoaded, setColDataLoaded] = useState(false);
  const [colStatusLoaded, setColStatusLoaded] = useState(false);
  const colTimerRefs = useRef<ReturnType<typeof setTimeout>[]>([]);

  function startColLoading() {
    setColDataLoaded(true);
    setColStatusLoaded(false);
    colTimerRefs.current.forEach(clearTimeout);
    colTimerRefs.current = [];
    // Status column loads after 2s
    const timer = setTimeout(() => {
      setColStatusLoaded(true);
    }, 2000);
    colTimerRefs.current.push(timer);
  }

  function resetColLoading() {
    colTimerRefs.current.forEach(clearTimeout);
    colTimerRefs.current = [];
    setColDataLoaded(false);
    setColStatusLoaded(false);
  }

  // Async Filtering state
  const [filterPage, setFilterPage] = useState(1);
  const [filterText, setFilterText] = useState('');
  const [filterLoading, setFilterLoading] = useState(false);
  const [filteredItems, setFilteredItems] = useState<DataItem[]>(sampleData);
  const filterTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reset filtering when items change (toggle switch)
  useEffect(() => {
    setFilterText('');
    setFilterLoading(false);
    setFilteredItems(items);
    setFilterPage(1);
    if (filterTimerRef.current) {
      clearTimeout(filterTimerRef.current);
    }
  }, [items]);

  function handleFilterChange(text: string) {
    setFilterText(text);
    setFilterLoading(true);
    setFilterPage(1);
    if (filterTimerRef.current) {
      clearTimeout(filterTimerRef.current);
    }
    filterTimerRef.current = setTimeout(() => {
      const lower = text.toLowerCase();
      setFilteredItems(
        items.filter(
          item =>
            item.name.toLowerCase().includes(lower) ||
            item.description.toLowerCase().includes(lower) ||
            item.status.toLowerCase().includes(lower)
        )
      );
      setFilterLoading(false);
    }, 1500);
  }

  function resetFiltering() {
    if (filterTimerRef.current) {
      clearTimeout(filterTimerRef.current);
    }
    setFilterText('');
    setFilterLoading(false);
    setFilteredItems(items);
    setFilterPage(1);
  }

  const filterPageTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [filterPageLoading, setFilterPageLoading] = useState(false);
  const filterPageItems = paginate(filterLoading ? [] : filteredItems, filterPage);

  function handleFilterPageChange(page: number) {
    setFilterPageLoading(true);
    if (filterPageTimerRef.current) {
      clearTimeout(filterPageTimerRef.current);
    }
    filterPageTimerRef.current = setTimeout(() => {
      setFilterPage(page);
      setFilterPageLoading(false);
    }, 1000);
  }

  useEffect(() => {
    const rowTimers = rowTimerRefs.current;
    const colTimers = colTimerRefs.current;
    const filterTimer = filterTimerRef.current;
    const rowPageTimer = rowPageTimerRef.current;
    const colPageTimer = colPageTimerRef.current;
    const filterPageTimer = filterPageTimerRef.current;
    return () => {
      rowTimers.forEach(clearTimeout);
      colTimers.forEach(clearTimeout);
      if (filterTimer) {
        clearTimeout(filterTimer);
      }
      if (rowPageTimer) {
        clearTimeout(rowPageTimer);
      }
      if (colPageTimer) {
        clearTimeout(colPageTimer);
      }
      if (filterPageTimer) {
        clearTimeout(filterPageTimer);
      }
    };
  }, []);

  return (
    <ScreenshotArea>
      <Box padding="l">
        <SpaceBetween size="l">
          <Header
            variant="h1"
            description="Side-by-side Skeleton vs Spinner comparisons for progressive row and column loading patterns"
          >
            Progressive Loading Explorations
          </Header>
          <Toggle checked={manyItems} onChange={({ detail }) => setUrlParams({ manyItems: detail.checked })}>
            Many items (25)
          </Toggle>
          <FormField label="Skeleton rows">
            <Input
              value={skeletonRowsCount}
              onChange={({ detail }) => setUrlParams({ skeletonRows: detail.value })}
              type="number"
              inputMode="numeric"
              step={1}
            />
          </FormField>
          <Container header={<Header variant="h2">Progressive Row Loading</Header>}>
            <SpaceBetween size="m">
              <SpaceBetween direction="horizontal" size="xs">
                {!rowLoading ? (
                  <Button onClick={startRowLoading}>Start loading</Button>
                ) : rowPaused ? (
                  <Button onClick={resumeRowLoading}>Resume</Button>
                ) : (
                  <Button onClick={pauseRowLoading}>Pause</Button>
                )}
                <Button onClick={resetRowLoading}>Reset</Button>
              </SpaceBetween>
              <Grid gridDefinition={[{ colspan: 6 }, { colspan: 6 }]}>
                <Table
                  enableKeyboardNavigation={true}
                  header={<Header>Skeleton</Header>}
                  items={rowPageItems.filter((_, index) => rowLoadedState[index])}
                  trackBy="id"
                  loading={!allRowsLoaded}
                  loadingText="Loading items..."
                  skeleton={!allRowsLoaded ? { totalRows: skeletonRows } : undefined}
                  pagination={
                    <Pagination
                      ariaLabels={{
                        nextPageLabel: 'Next page',
                        previousPageLabel: 'Previous page',
                        pageLabel: n => `Page ${n}`,
                      }}
                      currentPageIndex={rowPage}
                      pagesCount={totalPages(items)}
                      onChange={({ detail }) => handleRowPageChange(detail.currentPageIndex)}
                    />
                  }
                  columnDefinitions={[
                    {
                      id: 'name',
                      header: 'Name',
                      cell: (item: DataItem) => item.name,
                    },
                    {
                      id: 'description',
                      header: 'Description',
                      cell: (item: DataItem) => item.description,
                    },
                    {
                      id: 'status',
                      header: 'Status',
                      cell: (item: DataItem) => item.status,
                    },
                    {
                      id: 'date',
                      header: 'Date',
                      cell: (item: DataItem) => item.date,
                    },
                  ]}
                />
                <Table
                  enableKeyboardNavigation={true}
                  header={<Header>Spinner</Header>}
                  items={rowPageItems.filter((_, index) => rowLoadedState[index])}
                  trackBy="id"
                  loading={!rowLoadedState.some(Boolean)}
                  loadingText="Loading items..."
                  pagination={
                    <Pagination
                      ariaLabels={{
                        nextPageLabel: 'Next page',
                        previousPageLabel: 'Previous page',
                        pageLabel: n => `Page ${n}`,
                      }}
                      currentPageIndex={rowPage}
                      pagesCount={totalPages(items)}
                      onChange={({ detail }) => handleRowPageChange(detail.currentPageIndex)}
                    />
                  }
                  columnDefinitions={[
                    {
                      id: 'name',
                      header: 'Name',
                      cell: (item: DataItem) => item.name,
                    },
                    {
                      id: 'description',
                      header: 'Description',
                      cell: (item: DataItem) => item.description,
                    },
                    {
                      id: 'status',
                      header: 'Status',
                      cell: (item: DataItem) => item.status,
                    },
                    {
                      id: 'date',
                      header: 'Date',
                      cell: (item: DataItem) => item.date,
                    },
                  ]}
                  getLoadingStatus={() => (rowLoadedState.every(Boolean) ? 'finished' : 'loading')}
                  renderLoaderLoading={() => <StatusIndicator type="loading">Loading items</StatusIndicator>}
                />
              </Grid>
            </SpaceBetween>
          </Container>
          <Container header={<Header variant="h2">Progressive Column Loading</Header>}>
            <SpaceBetween size="m">
              <SpaceBetween direction="horizontal" size="xs">
                <Button onClick={startColLoading}>Start loading</Button>
                <Button onClick={resetColLoading}>Reset</Button>
              </SpaceBetween>
              <Grid gridDefinition={[{ colspan: 6 }, { colspan: 6 }]}>
                <Table
                  enableKeyboardNavigation={true}
                  header={<Header>Skeleton</Header>}
                  items={colDataLoaded && !colPageLoading ? colPageItems : []}
                  loading={!colDataLoaded || colPageLoading}
                  loadingText="Loading items..."
                  skeleton={!colDataLoaded || colPageLoading ? { totalRows: skeletonRows } : undefined}
                  pagination={
                    <Pagination
                      ariaLabels={{
                        nextPageLabel: 'Next page',
                        previousPageLabel: 'Previous page',
                        pageLabel: n => `Page ${n}`,
                      }}
                      currentPageIndex={colPage}
                      pagesCount={totalPages(items)}
                      onChange={({ detail }) => handleColPageChange(detail.currentPageIndex)}
                    />
                  }
                  columnDefinitions={[
                    {
                      id: 'name',
                      header: 'Name',
                      cell: (item: DataItem) => item.name,
                    },
                    {
                      id: 'description',
                      header: 'Description',
                      cell: (item: DataItem) => item.description,
                    },
                    {
                      id: 'status',
                      header: 'Status',
                      cell: (item: DataItem) => (colStatusLoaded ? item.status : <Skeleton width="80px" />),
                    },
                    {
                      id: 'date',
                      header: 'Date',
                      cell: (item: DataItem) => item.date,
                    },
                  ]}
                />
                <Table
                  enableKeyboardNavigation={true}
                  header={<Header>Spinner</Header>}
                  items={colDataLoaded && !colPageLoading ? colPageItems : []}
                  loading={!colDataLoaded || colPageLoading}
                  loadingText="Loading items..."
                  pagination={
                    <Pagination
                      ariaLabels={{
                        nextPageLabel: 'Next page',
                        previousPageLabel: 'Previous page',
                        pageLabel: n => `Page ${n}`,
                      }}
                      currentPageIndex={colPage}
                      pagesCount={totalPages(items)}
                      onChange={({ detail }) => handleColPageChange(detail.currentPageIndex)}
                    />
                  }
                  columnDefinitions={[
                    {
                      id: 'name',
                      header: 'Name',
                      cell: (item: DataItem) => item.name,
                    },
                    {
                      id: 'description',
                      header: 'Description',
                      cell: (item: DataItem) => item.description,
                    },
                    {
                      id: 'status',
                      header:
                        colDataLoaded && !colStatusLoaded ? (
                          <SpaceBetween direction="horizontal" size="xs">
                            <span>Status</span>
                            <Spinner size="normal" />
                          </SpaceBetween>
                        ) : (
                          'Status'
                        ),
                      cell: (item: DataItem) => (colStatusLoaded ? item.status : ''),
                    },
                    {
                      id: 'date',
                      header: 'Date',
                      cell: (item: DataItem) => item.date,
                    },
                  ]}
                />
              </Grid>
            </SpaceBetween>
          </Container>
          <Container header={<Header variant="h2">Asynchronous Filtering</Header>}>
            <SpaceBetween size="m">
              <SpaceBetween direction="horizontal" size="xs">
                <Button onClick={resetFiltering}>Reset</Button>
              </SpaceBetween>
              <Grid gridDefinition={[{ colspan: 6 }, { colspan: 6 }]}>
                <Table
                  enableKeyboardNavigation={true}
                  header={<Header>Skeleton</Header>}
                  items={filterLoading || filterPageLoading ? [] : filterPageItems}
                  loading={filterLoading || filterPageLoading}
                  loadingText="Filtering items..."
                  skeleton={filterLoading || filterPageLoading ? { totalRows: skeletonRows } : undefined}
                  pagination={
                    <Pagination
                      ariaLabels={{
                        nextPageLabel: 'Next page',
                        previousPageLabel: 'Previous page',
                        pageLabel: n => `Page ${n}`,
                      }}
                      currentPageIndex={filterPage}
                      pagesCount={totalPages(filteredItems)}
                      onChange={({ detail }) => handleFilterPageChange(detail.currentPageIndex)}
                    />
                  }
                  filter={
                    <TextFilter
                      filteringText={filterText}
                      onChange={({ detail }) => handleFilterChange(detail.filteringText)}
                      filteringPlaceholder="Filter items"
                    />
                  }
                  columnDefinitions={[
                    {
                      id: 'name',
                      header: 'Name',
                      cell: (item: DataItem) => item.name,
                    },
                    {
                      id: 'description',
                      header: 'Description',
                      cell: (item: DataItem) => item.description,
                    },
                    {
                      id: 'status',
                      header: 'Status',
                      cell: (item: DataItem) => item.status,
                    },
                    {
                      id: 'date',
                      header: 'Date',
                      cell: (item: DataItem) => item.date,
                    },
                  ]}
                  empty={<Box textAlign="center">No matching items</Box>}
                />
                <Table
                  enableKeyboardNavigation={true}
                  header={<Header>Spinner</Header>}
                  items={filterLoading || filterPageLoading ? [] : filterPageItems}
                  loading={filterLoading || filterPageLoading}
                  loadingText="Filtering items..."
                  pagination={
                    <Pagination
                      ariaLabels={{
                        nextPageLabel: 'Next page',
                        previousPageLabel: 'Previous page',
                        pageLabel: n => `Page ${n}`,
                      }}
                      currentPageIndex={filterPage}
                      pagesCount={totalPages(filteredItems)}
                      onChange={({ detail }) => handleFilterPageChange(detail.currentPageIndex)}
                    />
                  }
                  filter={
                    <TextFilter
                      filteringText={filterText}
                      onChange={({ detail }) => handleFilterChange(detail.filteringText)}
                      filteringPlaceholder="Filter items"
                    />
                  }
                  columnDefinitions={[
                    {
                      id: 'name',
                      header: 'Name',
                      cell: (item: DataItem) => item.name,
                    },
                    {
                      id: 'description',
                      header: 'Description',
                      cell: (item: DataItem) => item.description,
                    },
                    {
                      id: 'status',
                      header: 'Status',
                      cell: (item: DataItem) => item.status,
                    },
                    {
                      id: 'date',
                      header: 'Date',
                      cell: (item: DataItem) => item.date,
                    },
                  ]}
                  empty={<Box textAlign="center">No matching items</Box>}
                />
              </Grid>
            </SpaceBetween>
          </Container>
        </SpaceBetween>
      </Box>
    </ScreenshotArea>
  );
}
