// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { act, render } from '@testing-library/react';

import Table, { TableProps } from '../../../lib/components/table';
import createWrapper from '../../../lib/components/test-utils/dom';
import { fakeBoundingClientRect, firePointerdown, firePointermove, firePointerup } from './utils/resize-actions';

let overflowParent: HTMLElement | null = null;
jest.mock('../../../lib/components/internal/utils/scrollable-containers', () => ({
  browserScrollbarSize: () => ({ width: 20, height: 20 }),
  getOverflowParents: jest.fn(() => {
    return [overflowParent];
  }),
}));

const defaultProps: TableProps<{ id: number; description: string }> = {
  resizableColumns: true,
  columnDefinitions: [
    { id: 'id', header: 'Id', cell: item => item.id, width: 150 },
    { id: 'description', header: 'Description', cell: item => item.description, width: 300 },
  ],
  items: [{ id: 1, description: 'Description' }],
};

function renderTable(jsx: React.ReactElement) {
  const { container, rerender } = render(jsx);
  const wrapper = createWrapper(container).findTable()!;
  // stub all timers from this moment
  jest.useFakeTimers();
  // override getBoundingClientRect method we use for position calculation
  wrapper.findColumnHeaders().forEach(header => {
    header.getElement().getBoundingClientRect = fakeBoundingClientRect;
  });
  return { wrapper, rerender };
}

function tick() {
  act(() => {
    jest.runOnlyPendingTimers();
  });
}

beforeEach(() => {
  overflowParent = document.createElement('div');
  overflowParent.style.width = '400px';
  overflowParent.getBoundingClientRect = fakeBoundingClientRect;
});

afterEach(() => {
  jest.useRealTimers();
});

test('should not auto-grow when the cursor stops inside table container', () => {
  const { wrapper } = renderTable(<Table {...defaultProps} />);

  firePointerdown(wrapper.findColumnResizer(1)!);
  firePointermove(50);
  const widthBefore = wrapper.findColumnHeaders()[0].getElement().style.width;
  tick();
  expect(wrapper.findColumnHeaders()[0].getElement()).toHaveStyle({ width: widthBefore });
});

test('should auto-grow the column width when the cursor moves out of table bounds and stops', () => {
  const onChange = jest.fn();
  const { wrapper } = renderTable(<Table {...defaultProps} onColumnWidthsChange={event => onChange(event.detail)} />);

  firePointerdown(wrapper.findColumnResizer(1)!);
  firePointermove(450);
  expect(wrapper.findColumnHeaders()[0].getElement()).toHaveStyle({ width: '150px' });
  expect(overflowParent!.scrollLeft).toEqual(0);
  tick();
  expect(wrapper.findColumnHeaders()[0].getElement()).toHaveStyle({ width: '155px' });
  expect(overflowParent!.scrollLeft).toEqual(5);
  tick();
  expect(wrapper.findColumnHeaders()[0].getElement()).toHaveStyle({ width: '160px' });
  expect(overflowParent!.scrollLeft).toEqual(10);
  firePointerup(160);
  tick();
  expect(wrapper.findColumnHeaders()[0].getElement()).toHaveStyle({ width: '160px' });
  expect(onChange).toHaveBeenCalledTimes(1);
  expect(onChange).toHaveBeenCalledWith({ widths: [160, 300] });
});

test('should cancel auto-grow when the cursor returns back into the container', () => {
  const { wrapper } = renderTable(<Table {...defaultProps} />);

  firePointerdown(wrapper.findColumnResizer(1)!);
  firePointermove(450);
  tick();
  expect(wrapper.findColumnHeaders()[0].getElement()).toHaveStyle({ width: '155px' });
  tick();
  firePointermove(390);
  expect(wrapper.findColumnHeaders()[0].getElement()).toHaveStyle({ width: '390px' });
  tick();
  expect(wrapper.findColumnHeaders()[0].getElement()).toHaveStyle({ width: '390px' });
});

test('should continue auto-growing when cursor moves and then stops outside of the container again', () => {
  const { wrapper } = renderTable(<Table {...defaultProps} />);

  firePointerdown(wrapper.findColumnResizer(1)!);
  firePointermove(450);
  tick();
  expect(wrapper.findColumnHeaders()[0].getElement()).toHaveStyle({ width: '155px' });
  firePointermove(410);
  expect(wrapper.findColumnHeaders()[0].getElement()).toHaveStyle({ width: '155px' });
  tick();
  expect(wrapper.findColumnHeaders()[0].getElement()).toHaveStyle({ width: '160px' });
});
