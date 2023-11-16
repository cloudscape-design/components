// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { act, render } from '@testing-library/react';
import Table, { TableProps } from '../../../lib/components/table';
import createWrapper, { TableWrapper } from '../../../lib/components/test-utils/dom';
import { supportsStickyPosition } from '../../../lib/components/internal/utils/dom';
import { useResizeObserver } from '@cloudscape-design/component-toolkit/internal';
import { ContainerQueryEntry } from '@cloudscape-design/component-toolkit';
import styles from '../../../lib/components/table/styles.css.js';
import { useStickyColumns, useStickyCellStyles } from '../../../lib/components/table/sticky-columns';

jest.mock('@cloudscape-design/component-toolkit/internal', () => ({
  ...jest.requireActual('@cloudscape-design/component-toolkit/internal'),
  useResizeObserver: jest.fn().mockImplementation((_target, cb) => cb({ contentBoxWidth: 0 })),
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
  store: jest.fn(),
  style: {
    wrapper: undefined,
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

function mockResizeObserver(contentBoxWidth: number) {
  // Use "act" to imitate firing observer's callback after component is rendered.
  // In actual code the callback is fired twice - before and after rendering but the second part depends on ResizeObserver polyfill.
  jest
    .mocked(useResizeObserver)
    .mockImplementation((_target, cb) => act(() => cb({ contentBoxWidth } as unknown as ContainerQueryEntry)));
}

test('should apply width to the empty state container', () => {
  mockResizeObserver(600);
  const { wrapper } = renderTable(<Table columnDefinitions={defaultColumns} items={[]} />);
  expect(findStickyParent(wrapper).style.width).toEqual('600px');
});

test('should floor the value to prevent unwanted horizontal scrolling', () => {
  mockResizeObserver(123.4);
  const { wrapper } = renderTable(<Table columnDefinitions={defaultColumns} items={[]} />);
  expect(findStickyParent(wrapper).style.width).toEqual('123px');
});

test('should not apply width when browser does not support position sticky', () => {
  mockResizeObserver(600);
  jest.mocked(supportsStickyPosition).mockReturnValue(false);
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
