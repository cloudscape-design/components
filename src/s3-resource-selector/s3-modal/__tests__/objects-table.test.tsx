// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, render } from '@testing-library/react';

import { ObjectsTable } from '../../../../lib/components/s3-resource-selector/s3-modal/objects-table';
import createWrapper from '../../../../lib/components/test-utils/dom';
import { getIconHTML } from '../../../icon/__tests__/utils';
import { i18nStrings, objects } from '../../__tests__/fixtures';
import {
  getColumnAriaLabels,
  getElementsText,
  getHeaderVisibleText,
  getTableBodyContent,
  getTableColumnContent,
} from './utils';

async function renderTable(jsx: React.ReactElement) {
  const { container } = render(jsx);
  // wait out a tick to make the fetch promise resolved
  await act(() => Promise.resolve());
  return createWrapper(container.parentElement!).findTable()!;
}

const defaultProps = {
  forwardFocusRef: null,
  fetchData: () => Promise.resolve(objects),
  selectableItemsTypes: undefined,
  visibleColumns: ['Key', 'LastModified', 'Size'],
  isItemDisabled: undefined,
  pathSegments: [],
  i18nStrings,
  onDrilldown: () => {},
  onSelect: () => {},
} as const;

test('renders correct sorting state', async () => {
  const wrapper = await renderTable(<ObjectsTable {...defaultProps} />);
  expect(wrapper.findAscSortedColumn()).toBeNull();
  expect(wrapper.findDescSortedColumn()).toBeNull();
  expect(getColumnAriaLabels(wrapper)).toEqual(['Key, not sorted', 'Last modified, not sorted', 'Size, not sorted']);
  wrapper.findColumnSortingArea(2)!.click();
  expect(wrapper.findAscSortedColumn()!.getElement()).toHaveTextContent('Key');
  expect(wrapper.findDescSortedColumn()).toBeNull();
  expect(getColumnAriaLabels(wrapper)).toEqual([
    'Key, sorted ascending',
    'Last modified, not sorted',
    'Size, not sorted',
  ]);
  wrapper.findColumnSortingArea(2)!.click();
  expect(wrapper.findAscSortedColumn()).toBeNull();
  expect(wrapper.findDescSortedColumn()!.getElement()).toHaveTextContent('Key');
  expect(getColumnAriaLabels(wrapper)).toEqual([
    'Key, sorted descending',
    'Last modified, not sorted',
    'Size, not sorted',
  ]);
});

test('sorts objects by last modified date', async () => {
  const wrapper = await renderTable(<ObjectsTable {...defaultProps} />);
  expect(getTableColumnContent(wrapper, 3)).toEqual([
    '-',
    'December 15, 2020, 15:45:42 (UTC+01:00)',
    'April 18, 2020, 12:12:59 (UTC+02:00)',
  ]);
  wrapper.findColumnSortingArea(3)!.click();
  expect(getTableColumnContent(wrapper, 3)).toEqual([
    '-',
    'April 18, 2020, 12:12:59 (UTC+02:00)',
    'December 15, 2020, 15:45:42 (UTC+01:00)',
  ]);
  wrapper.findColumnSortingArea(3)!.click();
  expect(getTableColumnContent(wrapper, 3)).toEqual([
    'December 15, 2020, 15:45:42 (UTC+01:00)',
    'April 18, 2020, 12:12:59 (UTC+02:00)',
    '-',
  ]);
});

test('sorts objects by size', async () => {
  const wrapper = await renderTable(<ObjectsTable {...defaultProps} />);
  expect(getTableColumnContent(wrapper, 4)).toEqual(['-', '13.34 TB', '456.37 GB']);
  wrapper.findColumnSortingArea(4)!.click();
  expect(getTableColumnContent(wrapper, 4)).toEqual(['-', '456.37 GB', '13.34 TB']);
  wrapper.findColumnSortingArea(4)!.click();
  expect(getTableColumnContent(wrapper, 4)).toEqual(['13.34 TB', '456.37 GB', '-']);
});

test('Renders correct table content', async () => {
  const wrapper = await renderTable(<ObjectsTable {...defaultProps} />);
  expect(getHeaderVisibleText(wrapper)).toEqual(['', 'Key', 'Last modified', 'Size']);
  expect(getTableBodyContent(wrapper)).toEqual([
    ['', objects[0].Key, '-', '-'],
    ['', objects[1].Key, objects[1].LastModified, '13.34 TB'],
    ['', objects[2].Key, objects[2].LastModified, '456.37 GB'],
  ]);
});

test('renders separate icons for folder and file', async () => {
  const wrapper = await renderTable(<ObjectsTable {...defaultProps} />);
  expect(wrapper.findBodyCell(1, 2)!.findIcon()!.getElement()).toContainHTML(getIconHTML('folder'));
  expect(wrapper.findBodyCell(2, 2)!.findIcon()!.getElement()).toContainHTML(getIconHTML('file'));
});

test('Renders selection labels', async () => {
  const wrapper = await renderTable(<ObjectsTable {...defaultProps} />);
  expect(wrapper.findRowSelectionArea(1)!.getElement()).toHaveAttribute(
    'aria-label',
    'Objects select simulation-nano-2019'
  );
});

test('allows selecting an object', async () => {
  const onSelect = jest.fn();
  const wrapper = await renderTable(
    <ObjectsTable {...defaultProps} selectableItemsTypes={['objects']} onSelect={onSelect} />
  );
  wrapper.findRowSelectionArea(1)!.click();
  expect(onSelect).toHaveBeenCalledWith(objects[0].Key);
});

test('preserves the pagination state when selecting an object', async () => {
  const onSelect = jest.fn();
  const fetchManyObjects = () =>
    Promise.resolve(Array.from({ length: 40 }, (_, index) => ({ Key: `Object-${index}` })));
  const wrapper = await renderTable(
    <ObjectsTable
      {...defaultProps}
      selectableItemsTypes={['objects']}
      fetchData={fetchManyObjects}
      onSelect={onSelect}
    />
  );
  expect(getElementsText(wrapper.findPagination()!.findPageNumbers())).toEqual(['1', '2', '3', '4']);
  wrapper.findPagination()!.findNextPageButton().click();
  expect(wrapper.findPagination()!.findCurrentPage().getElement()).toHaveTextContent('2');
  wrapper.findRowSelectionArea(1)!.click();
  expect(wrapper.findPagination()!.findCurrentPage().getElement()).toHaveTextContent('2');
  expect(onSelect).toHaveBeenCalledWith('Object-10');
  expect(wrapper.findSelectedRows()).toHaveLength(1);
});

test('fetches objects from paths with consecutive slashes', async () => {
  const fetchDataSpy = jest.fn(() => Promise.resolve(objects));
  await renderTable(
    <ObjectsTable
      {...defaultProps}
      fetchData={fetchDataSpy}
      pathSegments={['bucket', 'root', 'folder/', '/', 'nested-folder/', 'end']}
    />
  );
  expect(fetchDataSpy).toHaveBeenCalledWith('bucket', 'root/folder//nested-folder/end');
});

test('does not allow selecting an object when they are not selectable', async () => {
  const wrapper = await renderTable(<ObjectsTable {...defaultProps} selectableItemsTypes={['versions']} />);
  expect(wrapper.findRowSelectionArea(1)!.find('input')!.getElement()).toBeDisabled();
  expect(wrapper.findRowSelectionArea(2)!.find('input')!.getElement()).toBeDisabled();
});

test('supports custom isItemDisabled function', async () => {
  const wrapper = await renderTable(<ObjectsTable {...defaultProps} isItemDisabled={item => !item.IsFolder} />);
  expect(wrapper.findRowSelectionArea(1)!.find('input')!.getElement()).toBeEnabled();
  expect(wrapper.findRowSelectionArea(2)!.find('input')!.getElement()).toBeDisabled();
});

test('should not allow navigating to versions when they are not selectable', async () => {
  const wrapper = await renderTable(<ObjectsTable {...defaultProps} selectableItemsTypes={['objects']} />);
  expect(wrapper.findBodyCell(1, 2)!.findLink()).toBeTruthy(); // folders are navigable
  expect(wrapper.findBodyCell(2, 2)!.findLink()).toBeFalsy(); // objects are not
});
