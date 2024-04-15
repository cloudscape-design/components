// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render, act } from '@testing-library/react';
import createWrapper from '../../../lib/components/test-utils/dom';
import Table, { TableProps } from '../../../lib/components/table';
import { fireMousedown, fireMouseMove, fireMouseup, fakeBoundingClientRect } from './utils/resize-actions';

let overflowParent: HTMLElement | null = null;
jest.mock('../../../lib/components/internal/utils/scrollable-containers', () => ({
  browserScrollbarSize: () => ({ width: 20, height: 20 }),
  getOverflowParents: jest.fn(() => {
    overflowParent = document.createElement('div');
    overflowParent.style.inlineSize = '400px';
    overflowParent.getBoundingClientRect = fakeBoundingClientRect;
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
  jest.useFakeTimers('modern');
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

afterEach(() => {
  jest.useRealTimers();
});

test('should not auto-grow when the cursor stops inside table container', () => {
  const { wrapper } = renderTable(<Table {...defaultProps} />);

  fireMousedown(wrapper.findColumnResizer(1)!);
  fireMouseMove(50);
  const widthBefore = wrapper.findColumnHeaders()[0].getElement().style.inlineSize;
  tick();
  expect(wrapper.findColumnHeaders()[0].getElement()).toHaveStyle({ width: widthBefore });
});

test('should auto-grow the column width when the cursor moves out of table bounds and stops', () => {
  const onChange = jest.fn();
  const { wrapper } = renderTable(<Table {...defaultProps} onColumnWidthsChange={event => onChange(event.detail)} />);

  fireMousedown(wrapper.findColumnResizer(1)!);
  fireMouseMove(450);
  expect(wrapper.findColumnHeaders()[0].getElement()).toHaveStyle({ width: '150px' });
  expect(overflowParent!.scrollLeft).toEqual(0);
  tick();
  expect(wrapper.findColumnHeaders()[0].getElement()).toHaveStyle({ width: '155px' });
  expect(overflowParent!.scrollLeft).toEqual(5);
  tick();
  expect(wrapper.findColumnHeaders()[0].getElement()).toHaveStyle({ width: '160px' });
  expect(overflowParent!.scrollLeft).toEqual(10);
  fireMouseup(160);
  tick();
  expect(wrapper.findColumnHeaders()[0].getElement()).toHaveStyle({ width: '160px' });
  expect(onChange).toHaveBeenCalledTimes(1);
  expect(onChange).toHaveBeenCalledWith({ widths: [160, 300] });
});

test('should cancel auto-grow when the cursor returns back into the container', () => {
  const { wrapper } = renderTable(<Table {...defaultProps} />);

  fireMousedown(wrapper.findColumnResizer(1)!);
  fireMouseMove(450);
  tick();
  expect(wrapper.findColumnHeaders()[0].getElement()).toHaveStyle({ width: '155px' });
  tick();
  fireMouseMove(390);
  expect(wrapper.findColumnHeaders()[0].getElement()).toHaveStyle({ width: '390px' });
  tick();
  expect(wrapper.findColumnHeaders()[0].getElement()).toHaveStyle({ width: '390px' });
});

test('should continue auto-growing when cursor moves and then stops outside of the container again', () => {
  const { wrapper } = renderTable(<Table {...defaultProps} />);

  fireMousedown(wrapper.findColumnResizer(1)!);
  fireMouseMove(450);
  tick();
  expect(wrapper.findColumnHeaders()[0].getElement()).toHaveStyle({ width: '155px' });
  fireMouseMove(410);
  expect(wrapper.findColumnHeaders()[0].getElement()).toHaveStyle({ width: '155px' });
  tick();
  expect(wrapper.findColumnHeaders()[0].getElement()).toHaveStyle({ width: '160px' });
});
