// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render } from '@testing-library/react';
import Table, { TableProps } from '../../../lib/components/table';
import createWrapper, { TableWrapper } from '../../../lib/components/test-utils/dom';
import { supportsStickyPosition } from '../../../lib/components/internal/utils/dom';
import { useContainerQuery } from '@cloudscape-design/component-toolkit';
import styles from '../../../lib/components/table/styles.css.js';
import { useStickyColumns, useStickyCellStyles } from '../../../lib/components/table/sticky-columns';

jest.mock('@cloudscape-design/component-toolkit', () => ({
  ...jest.requireActual('@cloudscape-design/component-toolkit'),
  useContainerQuery: jest.fn(() => [600, () => {}]),
}));

jest.mock('../../../lib/components/internal/utils/dom', () => ({
  supportsStickyPosition: jest.fn(),
  getContainingBlock: jest.fn(() => null),
  findUpUntil: jest.fn(),
}));

jest.mock('../../../lib/components/table/sticky-columns', () => ({
  useStickyColumns: jest.fn(),
  useStickyCellStyles: jest.fn(),
  selectionColumnId: 'id',
}));

const mockStickyStateModel = {
  isEnabled: false,
  store: jest.fn(),
  style: {
    wrapper: '',
  },
  refs: {
    table: jest.fn(),
    wrapper: jest.fn(),
    cell: jest.fn(),
  },
};

const mockStickyStyles = { ref: jest.fn(), className: '', style: { left: 0 } };

beforeEach(() => {
  (supportsStickyPosition as jest.Mock).mockReturnValue(true);
  (useStickyColumns as jest.Mock).mockReturnValue(mockStickyStateModel);
  (useStickyCellStyles as jest.Mock).mockReturnValue(mockStickyStyles);
});
const defaultColumns: TableProps.ColumnDefinition<any>[] = [{ header: 'name', cell: item => item }];

function renderTable(jsx: React.ReactElement) {
  const { container, rerender, getByTestId, queryByTestId } = render(jsx);
  const wrapper = createWrapper(container).findTable()!;
  return { wrapper, rerender, getByTestId, queryByTestId };
}

function findStickyParent(wrapper: TableWrapper) {
  return wrapper.findEmptySlot()!.getElement().parentElement!;
}

function findMergedCell(wrapper: TableWrapper) {
  return wrapper.findByClassName(styles['cell-merged']);
}

test('should apply width to the empty state container', () => {
  const { wrapper } = renderTable(<Table columnDefinitions={defaultColumns} items={[]} />);
  expect(findStickyParent(wrapper).style.width).toEqual('600px');
});

test('should floor the value to prevent unwanted horizontal scrolling', () => {
  (useContainerQuery as jest.Mock).mockReturnValue([123.4, () => {}]);
  const { wrapper } = renderTable(<Table columnDefinitions={defaultColumns} items={[]} />);
  expect(findStickyParent(wrapper).style.width).toEqual('123px');
});

test('should not apply width when browser does not support position sticky', () => {
  (supportsStickyPosition as jest.Mock).mockReturnValue(false);
  const { wrapper } = renderTable(<Table columnDefinitions={defaultColumns} items={[]} />);
  expect(findStickyParent(wrapper).style.width).toEqual('');
});

test('should set colspan attribute matching to the total number of columns', () => {
  const { wrapper } = renderTable(<Table columnDefinitions={defaultColumns} items={[]} />);
  expect(findMergedCell(wrapper)!.getElement()).toHaveAttribute('colspan', `${defaultColumns.length}`);
});

test('should add selection column to the colspan attribute', () => {
  const { wrapper } = renderTable(<Table columnDefinitions={defaultColumns} selectionType="multi" items={[]} />);
  expect(findMergedCell(wrapper)!.getElement()).toHaveAttribute('colspan', `${defaultColumns.length + 1}`);
});

test('should use wrapper header non-sticky', () => {
  const { wrapper } = renderTable(<Table columnDefinitions={defaultColumns} items={[]} />);

  expect(wrapper.findByClassName(styles.wrapper)!.findByClassName(styles['thead-active'])).not.toBeNull();
  expect(wrapper.findByClassName(styles['header-secondary'])).toBeNull();
});

test('should use secondary header when sticky', () => {
  const { wrapper } = renderTable(<Table columnDefinitions={defaultColumns} items={[]} stickyHeader={true} />);

  expect(wrapper.findByClassName(styles.wrapper)!.findByClassName(styles['thead-active'])).toBeNull();
  expect(wrapper.findByClassName(styles['header-secondary'])!.findByClassName(styles['thead-active'])).not.toBeNull();
});
