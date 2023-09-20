// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import times from 'lodash/times';
import { render, screen } from '@testing-library/react';
import createWrapper, { TableWrapper } from '../../../lib/components/test-utils/dom';
import Table, { TableProps } from '../../../lib/components/table';
import resizerStyles from '../../../lib/components/table/resizer/styles.css.js';
import { fireMousedown, fireMouseup, fireMouseMove, fakeBoundingClientRect } from './utils/resize-actions';
import { KeyCode } from '@cloudscape-design/test-utils-core/dist/utils';

jest.mock('../../../lib/components/internal/utils/scrollable-containers', () => ({
  browserScrollbarSize: () => ({ width: 20, height: 20 }),
  getOverflowParents: jest.fn(() => {
    const overflowParent = document.createElement('div');
    overflowParent.style.width = '400px';
    overflowParent.getBoundingClientRect = fakeBoundingClientRect;
    return [overflowParent];
  }),
}));

interface Item {
  id: number;
  description: string;
}

const defaultProps: TableProps<Item> = {
  resizableColumns: true,
  columnDefinitions: [
    { id: 'id', header: 'Id', cell: item => item.id, width: 150, minWidth: 80 },
    { id: 'description', header: 'Description', cell: item => item.description, width: 300 },
  ],
  items: times(20, index => ({ id: index + 1, description: 'Description' })),
};

function renderTable(jsx: React.ReactElement) {
  const { container, rerender } = render(jsx);
  const wrapper = createWrapper(container).findTable()!;
  return { wrapper, rerender };
}

function hasGlobalResizeClass() {
  return document.body.classList.contains(resizerStyles['resize-active']);
}

function findActiveResizer(wrapper: TableWrapper) {
  return wrapper.findByClassName(resizerStyles['resizer-active']);
}

afterEach(() => {
  jest.restoreAllMocks();
});

test('should be disabled by default', () => {
  const props = { ...defaultProps };
  delete props.resizableColumns;
  const { wrapper } = renderTable(<Table {...props} />);
  expect(wrapper.findColumnResizer(1)).toBeNull();
  expect(wrapper.findColumnResizer(2)).toBeNull();
});

test('should render resizers when enabled', () => {
  const { wrapper } = renderTable(<Table {...defaultProps} />);
  expect(wrapper.findColumnResizer(1)).not.toBeNull();
  expect(wrapper.findColumnResizer(2)).not.toBeNull();
});

test('should allow dragging a column only with the left mouse button', () => {
  const { wrapper } = renderTable(<Table {...defaultProps} />);
  const leftButton = 0;
  const rightButton = 1;
  expect(hasGlobalResizeClass()).toEqual(false);

  fireMousedown(wrapper.findColumnResizer(1)!, rightButton);
  expect(hasGlobalResizeClass()).toEqual(false);

  fireMousedown(wrapper.findColumnResizer(1)!, leftButton);
  expect(hasGlobalResizeClass()).toEqual(true);
});

test('should not allow the table selection to be resized', () => {
  const { wrapper } = renderTable(<Table {...defaultProps} selectionType="single" />);
  expect(wrapper.findColumnResizer(1)).toBeNull();
  expect(wrapper.findColumnResizer(2)).not.toBeNull();
});

test('should use the default width if it is not provided to a column and the column was not initially visible', () => {
  const props: TableProps<Item> = {
    ...defaultProps,
    columnDefinitions: [...defaultProps.columnDefinitions, { id: 'extra', header: 'Extra', cell: () => '-' }],
  };
  const { wrapper, rerender } = renderTable(<Table {...props} visibleColumns={['id', 'description']} />);

  expect(wrapper.findColumnHeaders()).toHaveLength(2);

  rerender(<Table {...props} visibleColumns={['id', 'description', 'extra']} />);

  expect(wrapper.findColumnHeaders()).toHaveLength(3);
  expect(wrapper.findColumnHeaders()[2].getElement()).toHaveStyle({ width: '120px' });
});

test('should show the tracking line and activate resizer onMouseDown', () => {
  const { wrapper } = renderTable(<Table {...defaultProps} />);
  expect(findActiveResizer(wrapper)).toBeNull();
  expect(hasGlobalResizeClass()).toEqual(false);

  fireMousedown(wrapper.findColumnResizer(1)!);
  expect(findActiveResizer(wrapper)).not.toBeNull();
  expect(hasGlobalResizeClass()).toEqual(true);

  fireMouseup(150);
  expect(findActiveResizer(wrapper)).toBeNull();
  expect(hasGlobalResizeClass()).toEqual(false);
});

test('should attach event listeners to the body on mousedown and remove on mouseup ', () => {
  const { wrapper } = renderTable(<Table {...defaultProps} />);
  jest.spyOn(document, 'addEventListener');
  jest.spyOn(document, 'removeEventListener');
  expect(document.addEventListener).toHaveBeenCalledTimes(0);

  fireMousedown(wrapper.findColumnResizer(1)!);
  expect(document.addEventListener).toHaveBeenCalledTimes(2);
  expect(document.addEventListener).toHaveBeenCalledWith('mousemove', expect.any(Function));
  expect(document.addEventListener).toHaveBeenCalledWith('mouseup', expect.any(Function));
  expect(document.removeEventListener).toHaveBeenCalledTimes(0);

  (document.addEventListener as jest.Mock).mockReset();
  fireMouseup(200);
  expect(document.addEventListener).toHaveBeenCalledTimes(0);
  expect(document.removeEventListener).toHaveBeenCalledWith('mousemove', expect.any(Function));
  expect(document.removeEventListener).toHaveBeenCalledWith('mouseup', expect.any(Function));
});

test('should correctly handle a column with special character', () => {
  const props: TableProps<Item> = {
    ...defaultProps,
    columnDefinitions: [
      { id: 'special:column', header: 'Special', cell: item => item.id },
      ...defaultProps.columnDefinitions,
    ],
  };
  const { wrapper } = renderTable(<Table {...props} />);
  fireMousedown(wrapper.findColumnResizer(1)!);
  fireMouseup(150);
});

test('should resize column to grow', () => {
  const { wrapper } = renderTable(<Table {...defaultProps} />);
  expect(wrapper.findColumnHeaders()[0].getElement()).toHaveStyle({ width: '150px' });

  fireMousedown(wrapper.findColumnResizer(1)!);
  fireMouseMove(200);
  fireMouseup(200);
  expect(wrapper.findColumnHeaders()[0].getElement()).toHaveStyle({ width: '200px' });
});

test('should resize column to shrink', () => {
  const { wrapper } = renderTable(<Table {...defaultProps} />);
  expect(wrapper.findColumnHeaders()[0].getElement()).toHaveStyle({ width: '150px' });

  fireMousedown(wrapper.findColumnResizer(1)!);
  fireMouseMove(130);
  fireMouseup(130);
  expect(wrapper.findColumnHeaders()[0].getElement()).toHaveStyle({ width: '130px' });
});

test('should not allow to resize column below the min width', () => {
  const { wrapper } = renderTable(<Table {...defaultProps} />);
  expect(wrapper.findColumnHeaders()[0].getElement()).toHaveStyle({ width: '150px' });

  fireMousedown(wrapper.findColumnResizer(1)!);
  fireMouseMove(10);
  fireMouseup(10);
  expect(wrapper.findColumnHeaders()[0].getElement()).toHaveStyle({ width: '80px' });
});

test('should to resize column beyond the screen bounds', () => {
  const { wrapper } = renderTable(<Table {...defaultProps} />);
  expect(wrapper.findColumnHeaders()[0].getElement()).toHaveStyle({ width: '150px' });

  fireMousedown(wrapper.findColumnResizer(1)!);
  fireMouseMove(-10);
  expect(wrapper.findColumnHeaders()[0].getElement()).toHaveStyle({ width: '150px' });
});

test('should not allow to resize column below 120px if min width is not defined', () => {
  const props: TableProps<Item> = {
    ...defaultProps,
    columnDefinitions: [{ header: 'id', cell: item => item.id, width: 150 }, defaultProps.columnDefinitions[1]],
  };
  const { wrapper } = renderTable(<Table {...props} />);
  expect(wrapper.findColumnHeaders()[0].getElement()).toHaveStyle({ width: '150px' });

  fireMousedown(wrapper.findColumnResizer(1)!);
  fireMouseMove(100);
  fireMouseup(100);
  expect(wrapper.findColumnHeaders()[0].getElement()).toHaveStyle({ width: '120px' });
});

test('should follow along each mouse move event', () => {
  const { wrapper } = renderTable(<Table {...defaultProps} />);
  expect(wrapper.findColumnHeaders()[0].getElement()).toHaveStyle({ width: '150px' });

  fireMousedown(wrapper.findColumnResizer(1)!);
  fireMouseMove(200);
  expect(wrapper.findColumnHeaders()[0].getElement()).toHaveStyle({ width: '200px' });
  fireMouseMove(250);
  expect(wrapper.findColumnHeaders()[0].getElement()).toHaveStyle({ width: '250px' });
  fireMouseMove(200);
  expect(wrapper.findColumnHeaders()[0].getElement()).toHaveStyle({ width: '200px' });
  fireMouseup(200);
  expect(wrapper.findColumnHeaders()[0].getElement()).toHaveStyle({ width: '200px' });
});

test('should allow column resize with missing mousemove event', () => {
  const { wrapper } = renderTable(<Table {...defaultProps} />);
  expect(wrapper.findColumnHeaders()[0].getElement()).toHaveStyle({ width: '150px' });

  fireMousedown(wrapper.findColumnResizer(1)!);
  fireMouseup(200);
  expect(wrapper.findColumnHeaders()[0].getElement()).toHaveStyle({ width: '200px' });
});

test('should trigger the columnWidthsChange event after a column is resized', () => {
  const onChange = jest.fn();
  const { wrapper } = renderTable(<Table {...defaultProps} onColumnWidthsChange={event => onChange(event.detail)} />);

  fireMousedown(wrapper.findColumnResizer(1)!);
  fireMouseMove(100);
  fireMouseup(100);

  expect(onChange).toHaveBeenCalledTimes(1);
  expect(onChange).toHaveBeenCalledWith({ widths: [100, 300] });
});

test('should provide the value for the last column when it was not defined', () => {
  const props: TableProps<Item> = {
    ...defaultProps,
    columnDefinitions: [...defaultProps.columnDefinitions, { id: 'extra', header: 'Extra', cell: () => '-' }],
  };
  const onChange = jest.fn();
  const { wrapper } = renderTable(<Table {...props} onColumnWidthsChange={event => onChange(event.detail)} />);

  fireMousedown(wrapper.findColumnResizer(1)!);
  fireMouseMove(100);
  fireMouseup(100);

  expect(onChange).toHaveBeenCalledTimes(1);
  expect(onChange).toHaveBeenCalledWith({ widths: [100, 300, 120] });
});

test('should include hidden columns into the event detail', () => {
  const onChange = jest.fn();
  const props: TableProps<Item> = {
    ...defaultProps,
    visibleColumns: ['id', 'last'],
    columnDefinitions: [
      ...defaultProps.columnDefinitions,
      { id: 'no-width', header: 'No width', cell: () => '-' },
      { id: 'last', header: 'Last', cell: () => '-' },
    ],
  };
  const { wrapper } = renderTable(<Table {...props} onColumnWidthsChange={event => onChange(event.detail)} />);

  fireMousedown(wrapper.findColumnResizer(2)!);
  fireMouseMove(140);
  fireMouseup(140);

  expect(onChange).toHaveBeenCalledTimes(1);
  expect(onChange).toHaveBeenCalledWith({ widths: [150, 300, 120, 140] });
});

test('should update the value for the last column when it is resized', () => {
  const onChange = jest.fn();
  const { wrapper } = renderTable(<Table {...defaultProps} onColumnWidthsChange={event => onChange(event.detail)} />);

  fireMousedown(wrapper.findColumnResizer(2)!);
  fireMouseMove(400);
  fireMouseup(400);

  expect(onChange).toHaveBeenCalledTimes(1);
  expect(onChange).toHaveBeenCalledWith({ widths: [150, 400] });
});

test('should not trigger if the previous and the current widths are the same', () => {
  const onChange = jest.fn();
  const { wrapper } = renderTable(<Table {...defaultProps} onColumnWidthsChange={event => onChange(event.detail)} />);

  fireMousedown(wrapper.findColumnResizer(1)!);
  fireMouseMove(150);
  fireMouseup(150);

  expect(onChange).toHaveBeenCalledTimes(0);
});

describe('resize with keyboard', () => {
  let mockWidth = 150;

  const originalBoundingClientRect = HTMLElement.prototype.getBoundingClientRect;
  beforeEach(() => {
    HTMLElement.prototype.getBoundingClientRect = function () {
      const rect = originalBoundingClientRect.apply(this);
      if (this.tagName === 'TH') {
        rect.width = mockWidth;
      }
      return rect;
    };
  });

  afterEach(() => {
    mockWidth = 150;
    HTMLElement.prototype.getBoundingClientRect = originalBoundingClientRect;
  });

  test('ignores arrow keys before entering the dragging mode', () => {
    const onChange = jest.fn();
    const { wrapper } = renderTable(<Table {...defaultProps} onColumnWidthsChange={event => onChange(event.detail)} />);
    const columnResizerWrapper = wrapper.findColumnResizer(1)!;

    columnResizerWrapper.focus();
    columnResizerWrapper.keydown(KeyCode.right);
    columnResizerWrapper.keydown(KeyCode.enter);

    expect(onChange).toHaveBeenCalledTimes(0);
  });

  test.each([KeyCode.space, KeyCode.enter])('activates and commits keyboard resize with keyCode="%s"', keyCode => {
    const onChange = jest.fn();
    const { wrapper } = renderTable(<Table {...defaultProps} onColumnWidthsChange={event => onChange(event.detail)} />);
    const columnResizerWrapper = wrapper.findColumnResizer(1)!;

    columnResizerWrapper.focus();
    columnResizerWrapper.keydown(keyCode);
    columnResizerWrapper.keydown(KeyCode.left);
    columnResizerWrapper.keydown(keyCode);

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith({ widths: [140, 300] });
  });

  test('activates keyboard resize with click', () => {
    const onChange = jest.fn();
    const { wrapper } = renderTable(<Table {...defaultProps} onColumnWidthsChange={event => onChange(event.detail)} />);
    const columnResizerWrapper = wrapper.findColumnResizer(1)!;

    columnResizerWrapper.focus();
    columnResizerWrapper.click();
    columnResizerWrapper.keydown(KeyCode.right);
    columnResizerWrapper.keydown(KeyCode.enter);

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith({ widths: [160, 300] });
  });

  test.each([KeyCode.escape])('discards resize with escape', keyCode => {
    const onChange = jest.fn();
    const { wrapper } = renderTable(<Table {...defaultProps} onColumnWidthsChange={event => onChange(event.detail)} />);
    const columnResizerWrapper = wrapper.findColumnResizer(1)!;

    columnResizerWrapper.focus();
    columnResizerWrapper.keydown(KeyCode.enter);
    columnResizerWrapper.keydown(KeyCode.right);
    columnResizerWrapper.keydown(keyCode);
    columnResizerWrapper.keydown(KeyCode.enter);

    expect(onChange).toHaveBeenCalledTimes(0);
  });

  test('discards resize on blur', () => {
    const onChange = jest.fn();
    const { wrapper } = renderTable(<Table {...defaultProps} onColumnWidthsChange={event => onChange(event.detail)} />);
    const columnResizerWrapper = wrapper.findColumnResizer(1)!;

    columnResizerWrapper.focus();
    columnResizerWrapper.keydown(KeyCode.enter);
    columnResizerWrapper.keydown(KeyCode.right);
    wrapper.findColumnResizer(2)!.focus();
    columnResizerWrapper.focus();
    columnResizerWrapper.keydown(KeyCode.enter);

    expect(onChange).toHaveBeenCalledTimes(0);
  });

  test('prevents resizing to below the min-width', () => {
    mockWidth = 80;
    const { wrapper } = renderTable(<Table {...defaultProps} />);
    const columnResizerWrapper = wrapper.findColumnResizer(1)!;
    const columnResizerSeparatorWrapper = wrapper.findColumnHeaders()[0].find('[role="separator"]')!;

    columnResizerWrapper.focus();
    columnResizerWrapper.keydown(KeyCode.enter);
    columnResizerWrapper.keydown(KeyCode.left);

    expect(columnResizerSeparatorWrapper.getElement()).toHaveAttribute('aria-valuenow', '80');
  });
});

describe('column header content', () => {
  test('resizable columns headers have expected text content', () => {
    const { wrapper } = renderTable(<Table {...defaultProps} />);

    expect(wrapper.findColumnHeaders()[0].getElement()!.textContent).toEqual('Id');
    expect(wrapper.findColumnHeaders()[1].getElement()!.textContent).toEqual('Description');
  });

  test('resizable columns can be queries with columnheader role', () => {
    renderTable(<Table {...defaultProps} />);

    expect(screen.getByRole('columnheader', { name: 'Id' }));
    expect(screen.getByRole('columnheader', { name: 'Description' }));
  });

  test('resize handles have expected accessible names', () => {
    const { wrapper } = renderTable(<Table {...defaultProps} />);
    const getResizeHandle = (columnIndex: number) =>
      wrapper.findColumnHeaders()[columnIndex].findByClassName(resizerStyles.resizer)!.getElement();

    expect(getResizeHandle(0)).toHaveAccessibleName('Id');
    expect(getResizeHandle(1)).toHaveAccessibleName('Description');
  });
});
