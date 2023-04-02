// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';
import createWrapper, { TableWrapper } from '../../../../lib/components/test-utils/dom';
import { BucketsTable } from '../../../../lib/components/s3-resource-selector/s3-modal/buckets-table';
import { buckets, i18nStrings, waitForFetch } from '../../__tests__/fixtures';
import { getColumnAriaLabels, getTableBodyContent, getHeaderVisibleText } from './utils';

async function renderTable(jsx: React.ReactElement) {
  const { container } = render(jsx);
  await waitForFetch();
  return createWrapper(container.parentElement!).findTable()!;
}

const defaultProps = {
  forwardFocusRef: null,
  fetchData: () => Promise.resolve(buckets),
  selectableItemsTypes: ['buckets'],
  visibleColumns: ['Name', 'CreationDate'],
  isItemDisabled: undefined,
  i18nStrings,
  onDrilldown: () => {},
  onSelect: () => {},
} as const;

function findRefreshButton(wrapper: TableWrapper) {
  return wrapper.findHeaderSlot()!.findHeader()!.findActions()!.findButton()!;
}

test('Renders correct aria-labels', async () => {
  const wrapper = await renderTable(<BucketsTable {...defaultProps} />);
  expect(wrapper.findRowSelectionArea(1)!.getElement()).toHaveAttribute('aria-label', 'Buckets select bucket-laborum');
  expect(wrapper.findTextFilter()!.findInput().findNativeInput().getElement()).toHaveAttribute(
    'aria-label',
    'Find Buckets'
  );
  expect(wrapper.findPagination()!.findPreviousPageButton().getElement()).toHaveAttribute(
    'aria-label',
    'Previous page'
  );
  expect(wrapper.findPagination()!.findNextPageButton().getElement()).toHaveAttribute('aria-label', 'Next page');
  expect(findRefreshButton(wrapper).getElement()).toHaveAttribute('aria-label', 'Refresh the data');
});

test('renders correct sorting state', async () => {
  const wrapper = await renderTable(<BucketsTable {...defaultProps} />);
  expect(wrapper.findAscSortedColumn()).toBeNull();
  expect(wrapper.findDescSortedColumn()).toBeNull();
  expect(getColumnAriaLabels(wrapper)).toEqual(['Name, not sorted', 'Creation date, not sorted']);
  wrapper.findColumnSortingArea(2)!.click();
  expect(wrapper.findAscSortedColumn()!.getElement()).toHaveTextContent('Name');
  expect(wrapper.findDescSortedColumn()).toBeNull();
  expect(getColumnAriaLabels(wrapper)).toEqual(['Name, sorted ascending', 'Creation date, not sorted']);
  wrapper.findColumnSortingArea(2)!.click();
  expect(wrapper.findAscSortedColumn()).toBeNull();
  expect(wrapper.findDescSortedColumn()!.getElement()).toHaveTextContent('Name');
  expect(getColumnAriaLabels(wrapper)).toEqual(['Name, sorted descending', 'Creation date, not sorted']);
});

test('Renders correct buckets table content', async () => {
  const wrapper = await renderTable(<BucketsTable {...defaultProps} />);
  expect(getHeaderVisibleText(wrapper)).toEqual(['', 'Name', 'Creation date']);
  expect(getTableBodyContent(wrapper)).toEqual([
    ['', buckets[0].Name, buckets[0].CreationDate],
    ['', buckets[1].Name, buckets[1].CreationDate],
  ]);
});

test('Renders empty state', async () => {
  const wrapper = await renderTable(<BucketsTable {...defaultProps} fetchData={() => Promise.resolve([])} />);
  expect(wrapper.findEmptySlot()!.getElement()).toHaveTextContent('No buckets');
});

test('Renders empty state when data fetch failed', async () => {
  const wrapper = await renderTable(
    <BucketsTable {...defaultProps} fetchData={() => Promise.reject(new Error('Fetch error'))} />
  );
  // we do not assert error state, because it is rendered outside of the component, using `alert` slot
  expect(wrapper.findEmptySlot()!.getElement()).toHaveTextContent('No buckets');
});

test('Renders region column when it is requested', async () => {
  const wrapper = await renderTable(
    <BucketsTable
      {...defaultProps}
      i18nStrings={{ ...i18nStrings, columnBucketRegion: 'Region' }}
      visibleColumns={['Name', 'Region']}
    />
  );
  expect(getHeaderVisibleText(wrapper)).toEqual(['', 'Name', 'Region']);
  expect(getTableBodyContent(wrapper)).toEqual([
    ['', buckets[0].Name, buckets[0].Region],
    ['', buckets[1].Name, buckets[1].Region],
  ]);
});

test('updates counter when item is selected', async () => {
  const wrapper = await renderTable(<BucketsTable {...defaultProps} />);
  expect(wrapper.findHeaderSlot()!.findHeader()!.findCounter()!.getElement()).toHaveTextContent('(2)');
  wrapper.findRowSelectionArea(1)!.click();
  expect(wrapper.findHeaderSlot()!.findHeader()!.findCounter()!.getElement()).toHaveTextContent('(1/2)');
});

test('does not allow selecting a bucket when they are not selectable', async () => {
  const wrapper = await renderTable(<BucketsTable {...defaultProps} selectableItemsTypes={['objects']} />);
  expect(wrapper.findRowSelectionArea(1)!.find('input')!.getElement()).toBeDisabled();
});

test('preserves the selection when items were reloaded with new object instances', async () => {
  const fetchFreshData = () => Promise.resolve(JSON.parse(JSON.stringify(buckets)));
  const wrapper = await renderTable(<BucketsTable {...defaultProps} fetchData={fetchFreshData} />);
  wrapper.findRowSelectionArea(1)!.click();
  expect(wrapper.findSelectedRows()[0].find('td:nth-child(2)')!.getElement()).toHaveTextContent('bucket-laborum');
  findRefreshButton(wrapper).click();
  await waitForFetch();
  expect(wrapper.findSelectedRows()[0].find('td:nth-child(2)')!.getElement()).toHaveTextContent('bucket-laborum');
});

test('clears the selection when reloaed items do not contain the selection', async () => {
  const responses = [buckets, buckets.slice(1)];
  const fetchFreshData = () => Promise.resolve(responses.shift()!);
  const wrapper = await renderTable(<BucketsTable {...defaultProps} fetchData={fetchFreshData} />);
  wrapper.findRowSelectionArea(1)!.click();
  expect(wrapper.findSelectedRows()[0].find('td:nth-child(2)')!.getElement()).toHaveTextContent('bucket-laborum');
  findRefreshButton(wrapper).click();
  await waitForFetch();
  expect(wrapper.findSelectedRows()).toHaveLength(0);
});

test('filtering buckets', async () => {
  const wrapper = await renderTable(<BucketsTable {...defaultProps} />);
  expect(wrapper.findRows()).toHaveLength(2);
  wrapper.findTextFilter()!.findInput().setInputValue('laborum');
  expect(wrapper.findRows()).toHaveLength(1);
  expect(wrapper.findTextFilter()!.findResultsCount().getElement()).toHaveTextContent('1 match');
  wrapper.findTextFilter()!.findInput().setInputValue('non-existing-value');
  expect(wrapper.findRows()).toHaveLength(0);
  expect(wrapper.findTextFilter()!.findResultsCount().getElement()).toHaveTextContent('0 matches');
  wrapper.findEmptySlot()!.findButton()!.click();
  expect(wrapper.findRows()).toHaveLength(2);
  expect(wrapper.findTextFilter()!.findResultsCount()).toBe(null);
});

test('paginating buckets', async () => {
  const wrapper = await renderTable(
    <BucketsTable
      {...defaultProps}
      fetchData={() =>
        Promise.resolve(Array.from({ length: 12 }, (_, index) => ({ Name: `Bucket-${index + 1}`, CreationDate: '-' })))
      }
    />
  );
  expect(wrapper.findRows()).toHaveLength(10);
  expect(wrapper.findBodyCell(10, 2)!.getElement()).toHaveTextContent('Bucket-10');
  wrapper.findPagination()!.findNextPageButton().click();
  expect(wrapper.findRows()).toHaveLength(2);
  expect(wrapper.findBodyCell(2, 2)!.getElement()).toHaveTextContent('Bucket-12');
});

test('should not allow navigation to objects when they are not selectable', async () => {
  const wrapper = await renderTable(<BucketsTable {...defaultProps} selectableItemsTypes={['buckets']} />);
  expect(wrapper.findBodyCell(1, 1)!.findLink()).toBeNull();
});

test('should allow navigation to objects when versions are selectable', async () => {
  const onDrilldown = jest.fn();
  const wrapper = await renderTable(
    <BucketsTable {...defaultProps} selectableItemsTypes={['versions']} onDrilldown={onDrilldown} />
  );
  wrapper.findBodyCell(1, 2)!.findLink()!.click();
  expect(onDrilldown).toHaveBeenCalled();
});
