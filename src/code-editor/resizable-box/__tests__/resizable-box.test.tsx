// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { fireEvent, render } from '@testing-library/react';

import { ResizableBox, ResizeBoxProps } from '../../../../lib/components/code-editor/resizable-box';
import { PointerEventMock } from '../../../../lib/components/internal/utils/pointer-events-mock';

import dragHandleStyles from '../../../../lib/components/internal/components/drag-handle/styles.css.js';
import dragHandleWrapperStyles from '../../../../lib/components/internal/components/drag-handle-wrapper/styles.css.js';
import styles from '../../../../lib/components/code-editor/resizable-box/styles.selectors.js';

const defaultProps: ResizeBoxProps = {
  height: 100,
  minHeight: 0,
  onResize: () => {},
  children: 'test',
};

function findBox() {
  return document.querySelector(`.${styles['resizable-box']}`)!;
}

function findHandle() {
  return document.querySelector(`.${dragHandleStyles.handle}`)!;
}

function findDirectionButton(direction: 'block-start' | 'block-end') {
  return document.querySelector(
    `.${dragHandleWrapperStyles[`direction-button-wrapper-${direction}`]} .${dragHandleWrapperStyles['direction-button']}`
  )!;
}

beforeAll(() => {
  (window as any).PointerEvent ??= PointerEventMock;
});

test('Provides ariaLabel to the handle', () => {
  render(<ResizableBox {...defaultProps} handleAriaLabel="Resize handle" />);
  expect(findHandle()).toHaveAccessibleName('Resize handle');
});

test('Height is controlled', () => {
  const { rerender } = render(<ResizableBox {...defaultProps} />);
  expect(findBox()).toHaveStyle({ height: '100px' });
  rerender(<ResizableBox {...defaultProps} height={200} />);
  expect(findBox()).toHaveStyle({ height: '200px' });
});

test('Emits resize events on mouse resizing', () => {
  const onResize = jest.fn();
  render(<ResizableBox {...defaultProps} onResize={onResize} />);
  fireEvent.pointerDown(findHandle());
  fireEvent.pointerMove(document.body, { clientY: 80 });
  expect(onResize).toHaveBeenCalledWith(80);
  onResize.mockClear();
  fireEvent.pointerMove(document.body, { clientY: 150 });
  expect(onResize).toHaveBeenCalledWith(150);
});

test.each([
  ['ArrowDown', 20],
  ['ArrowRight', 20],
  ['ArrowUp', -20],
  ['ArrowLeft', -20],
])('Emits resize events on keydown press: %s', (key, expectedChange) => {
  const initialHeight = 100;
  const onResize = jest.fn();

  render(<ResizableBox {...defaultProps} height={initialHeight} onResize={onResize} />);

  const keydownEvent = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true });
  fireEvent(findHandle(), keydownEvent);
  expect(keydownEvent.defaultPrevented).toBe(true);
  expect(onResize).toHaveBeenCalledWith(initialHeight + expectedChange);
});

test('Emits resize events when direction buttons are pressed', () => {
  const onResize = jest.fn();
  render(<ResizableBox {...defaultProps} height={100} onResize={onResize} />);
  // Open direction buttons
  fireEvent.pointerDown(findHandle());
  fireEvent.pointerUp(findHandle());

  fireEvent.click(findDirectionButton('block-start'));
  expect(onResize).toHaveBeenCalledWith(80);

  onResize.mockClear();
  fireEvent.click(findDirectionButton('block-end'));
  expect(onResize).toHaveBeenCalledWith(120);
});

test('Includes offsets into size calculation', () => {
  const onResize = jest.fn();
  render(<ResizableBox {...defaultProps} onResize={onResize} />);
  findBox().getBoundingClientRect = () => ({ top: 50, bottom: 100 }) as DOMRect;
  fireEvent.pointerDown(findHandle(), { clientY: 95 });
  fireEvent.pointerMove(document.body, { clientY: 130 });
  // +5 offset for mouseDown position (100 - 95)
  // -50 for container top offset
  expect(onResize).toHaveBeenCalledWith(85); // 85 = 130 + 5 - 50
});

test('Disables selection while drag is active', () => {
  render(<ResizableBox {...defaultProps} />);
  fireEvent.pointerDown(findHandle());
  expect(document.body).toHaveClass(styles['resize-active']);
  fireEvent.pointerUp(document.body);
  expect(document.body).not.toHaveClass(styles['resize-active']);
});

test('Does not respond to events after cursor release', () => {
  const onResize = jest.fn();
  render(<ResizableBox {...defaultProps} onResize={onResize} />);
  fireEvent.pointerDown(findHandle());
  fireEvent.pointerUp(document.body);
  fireEvent.pointerMove(document.body, { clientY: 80 });
  expect(onResize).not.toHaveBeenCalled();
});

test('Has no effect on other non-left mouse button clicks', () => {
  const onResize = jest.fn();
  render(<ResizableBox {...defaultProps} minHeight={50} onResize={onResize} />);
  fireEvent.pointerDown(findHandle(), { pointerType: 'mouse', button: 1 });
  fireEvent.pointerMove(document.body, { clientY: 30 });
  expect(onResize).not.toHaveBeenCalled();
});

test('Does not allow to go beyond min size', () => {
  const onResize = jest.fn();
  render(<ResizableBox {...defaultProps} minHeight={50} onResize={onResize} />);
  fireEvent.pointerDown(findHandle());
  fireEvent.pointerMove(document.body, { clientY: 30 });
  expect(onResize).toHaveBeenCalledWith(50);
});

test('Does not cause state warnings after unmounting', () => {
  const consoleMock = jest.spyOn(console, 'error');
  function Stateful() {
    const [height, setHeight] = useState(100);
    return <ResizableBox {...defaultProps} height={height} onResize={height => setHeight(height)} />;
  }
  const { rerender } = render(<Stateful />);
  fireEvent.pointerDown(findHandle());
  rerender(<></>);
  fireEvent.pointerMove(document.body, { clientY: 30 });
  expect(consoleMock).not.toHaveBeenCalled();
});
