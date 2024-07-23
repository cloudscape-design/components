// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, render } from '@testing-library/react';

import { VersionsTable } from '../../../../lib/components/s3-resource-selector/s3-modal/versions-table';
import createWrapper from '../../../../lib/components/test-utils/dom';
import { i18nStrings, versions } from '../../__tests__/fixtures';
import { getColumnAriaLabels, getHeaderVisibleText, getTableBodyContent } from './utils';

async function renderTable(jsx: React.ReactElement) {
  const { container } = render(jsx);
  // wait out a tick to make the fetch promise resolved
  await act(() => Promise.resolve());
  return createWrapper(container.parentElement!).findTable()!;
}

const defaultProps = {
  forwardFocusRef: null,
  fetchData: () => Promise.resolve(versions),
  visibleColumns: ['ID', 'LastModified', 'Size'],
  isItemDisabled: undefined,
  pathSegments: [],
  i18nStrings,
  onSelect: () => {},
};

test('renders correct sorting state', async () => {
  const wrapper = await renderTable(<VersionsTable {...defaultProps} />);
  expect(wrapper.findAscSortedColumn()).toBeNull();
  expect(wrapper.findDescSortedColumn()).toBeNull();
  expect(getColumnAriaLabels(wrapper)).toEqual([
    'Version ID, not sorted',
    'Last modified, not sorted',
    'Size, not sorted',
  ]);
  wrapper.findColumnSortingArea(2)!.click();
  expect(wrapper.findAscSortedColumn()!.getElement()).toHaveTextContent('Version ID');
  expect(wrapper.findDescSortedColumn()).toBeNull();
  expect(getColumnAriaLabels(wrapper)).toEqual([
    'Version ID, sorted ascending',
    'Last modified, not sorted',
    'Size, not sorted',
  ]);
  wrapper.findColumnSortingArea(2)!.click();
  expect(wrapper.findAscSortedColumn()).toBeNull();
  expect(wrapper.findDescSortedColumn()!.getElement()).toHaveTextContent('Version ID');
  expect(getColumnAriaLabels(wrapper)).toEqual([
    'Version ID, sorted descending',
    'Last modified, not sorted',
    'Size, not sorted',
  ]);
});

test('Renders correct table content', async () => {
  const wrapper = await renderTable(<VersionsTable {...defaultProps} />);
  expect(getHeaderVisibleText(wrapper)).toEqual(['', 'Version ID', 'Last modified', 'Size']);
  expect(getTableBodyContent(wrapper)).toEqual([
    ['', versions[0].VersionId, versions[0].LastModified, '22.75 TB'],
    ['', versions[1].VersionId, versions[1].LastModified, '56.01 TB'],
  ]);
});

test('Renders selection labels', async () => {
  const wrapper = await renderTable(<VersionsTable {...defaultProps} />);
  expect(wrapper.findRowSelectionArea(1)!.getElement()).toHaveAttribute(
    'aria-label',
    'Versions select 6036589969ec3d9b2db8faa7'
  );
});

test('fetches object versions when path contains consecutive slashes', async () => {
  const fetchDataSpy = jest.fn(() => Promise.resolve(versions));
  await renderTable(
    <VersionsTable
      {...defaultProps}
      fetchData={fetchDataSpy}
      pathSegments={['bucket', 'root', 'folder/', '/', 'nested-folder/', 'end']}
    />
  );
  expect(fetchDataSpy).toHaveBeenCalledWith('bucket', 'root/folder//nested-folder/end');
});
