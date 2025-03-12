// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { fireEvent, render } from '@testing-library/react';

import DragHandleWrapper from '../../../../../lib/components/internal/components/drag-handle-wrapper';
import {
  Direction,
  DragHandleWrapperProps,
} from '../../../../../lib/components/internal/components/drag-handle-wrapper/interfaces';
import { PointerEventMock } from '../../../../../lib/components/internal/utils/pointer-events';

import styles from '../../../../../lib/components/internal/components/drag-handle-wrapper/styles.css.js';
import tooltipStyles from '../../../../../lib/components/internal/components/tooltip/styles.css.js';

beforeAll(() => {
  (window as any).PointerEvent ??= PointerEventMock;
});

afterEach(() => {
  jest.restoreAllMocks();
});

function renderDragHandle(props: Omit<DragHandleWrapperProps, 'children'>) {
  const { container } = render(
    <DragHandleWrapper {...props}>
      <button type="button" id="drag-button">
        Drag
      </button>
    </DragHandleWrapper>
  );

  return {
    dragHandle: container.querySelector<HTMLButtonElement>('#drag-button')!,
    getTooltip: () => document.querySelector(`.${tooltipStyles.root}`),
    getDirectionButton: (direction: Direction) => {
      return document.querySelector<HTMLButtonElement>(
        `.${styles[`direction-button-wrapper-${direction}`]} .${styles['direction-button']}`
      );
    },
  };
}

test('renders children', () => {
  const { dragHandle } = renderDragHandle({ directions: {} });
  expect(dragHandle).toBeInTheDocument();
});

test('shows tooltip on pointerin', () => {
  const { dragHandle, getTooltip } = renderDragHandle({
    directions: { 'block-start': 'active' },
    tooltipText: 'Click me!',
  });

  fireEvent.pointerEnter(dragHandle);
  expect(getTooltip()).toHaveTextContent('Click me!');
});

test('hides tooltip on pointerout', () => {
  const { dragHandle, getTooltip } = renderDragHandle({
    directions: { 'block-start': 'active' },
    tooltipText: 'Click me!',
  });

  fireEvent.pointerEnter(dragHandle);
  fireEvent.pointerLeave(dragHandle);
  expect(getTooltip()).not.toBeInTheDocument();
});

test('hides tooltip on pointerdown', () => {
  const { dragHandle, getTooltip } = renderDragHandle({
    directions: { 'block-start': 'active' },
    tooltipText: 'Click me!',
  });

  fireEvent.pointerEnter(dragHandle);
  fireEvent.pointerDown(dragHandle);
  expect(getTooltip()).not.toBeInTheDocument();
});

test("doesn't show tooltip when no directions are provided", () => {
  const { dragHandle, getTooltip } = renderDragHandle({ directions: {}, tooltipText: 'Click me!' });

  fireEvent.pointerEnter(dragHandle);
  fireEvent.pointerDown(dragHandle);
  expect(getTooltip()).not.toBeInTheDocument();
});

test("doesn't show tooltip when all directions are disabled", () => {
  const { dragHandle, getTooltip } = renderDragHandle({
    directions: { 'block-start': 'disabled', 'inline-start': 'disabled' },
    tooltipText: 'Click me!',
  });

  fireEvent.pointerEnter(dragHandle);
  fireEvent.pointerDown(dragHandle);
  expect(getTooltip()).not.toBeInTheDocument();
});

test("doesn't show tooltip when drag ends, even if the pointer is on the button", () => {
  const { dragHandle, getTooltip } = renderDragHandle({
    directions: { 'block-start': 'active' },
    tooltipText: 'Click me!',
  });

  fireEvent.pointerEnter(dragHandle);
  fireEvent.pointerDown(dragHandle);
  fireEvent.pointerUp(dragHandle);
  expect(getTooltip()).not.toBeInTheDocument();
});

test('hides tooltip on Escape', () => {
  const { dragHandle, getTooltip } = renderDragHandle({
    directions: { 'block-start': 'active' },
    tooltipText: 'Click me!',
  });

  fireEvent.pointerEnter(dragHandle);
  fireEvent.keyDown(document, { key: 'Escape' });
  expect(getTooltip()).not.toBeInTheDocument();
});

test("doesn't show direction buttons by default", () => {
  const { getDirectionButton } = renderDragHandle({
    directions: { 'block-start': 'active' },
    tooltipText: 'Click me!',
  });

  expect(getDirectionButton('block-start')).not.toBeInTheDocument();
  expect(getDirectionButton('block-end')).not.toBeInTheDocument();
});

test('shows direction buttons when focus enters the button', () => {
  const { dragHandle, getDirectionButton } = renderDragHandle({
    directions: { 'block-start': 'active', 'block-end': 'active' },
    tooltipText: 'Click me!',
  });

  dragHandle.focus();
  expect(getDirectionButton('block-start')).toBeVisible();
  expect(getDirectionButton('block-end')).toBeVisible();
  expect(getDirectionButton('inline-start')).not.toBeInTheDocument();
});

test('hides direction buttons when focus leaves the button', () => {
  const { dragHandle, getDirectionButton } = renderDragHandle({
    directions: { 'block-start': 'active', 'block-end': 'active' },
    tooltipText: 'Click me!',
  });

  fireEvent.focusIn(dragHandle, { relatedElement: document.body });
  fireEvent.focusOut(dragHandle, { relatedElement: document.body });
  expect(getDirectionButton('block-start')).not.toBeInTheDocument();
  expect(getDirectionButton('block-end')).not.toBeInTheDocument();
});

test('shows direction buttons when clicked', () => {
  const { dragHandle, getDirectionButton } = renderDragHandle({
    directions: { 'block-start': 'active' },
    tooltipText: 'Click me!',
  });

  fireEvent.pointerDown(dragHandle);
  fireEvent.pointerUp(dragHandle);
  expect(getDirectionButton('block-start')).toBeVisible();
});

test(`doesn't show direction buttons when drag is "cancelled"`, () => {
  const { dragHandle, getDirectionButton } = renderDragHandle({
    directions: { 'block-start': 'active' },
    tooltipText: 'Click me!',
  });

  fireEvent.pointerDown(dragHandle);
  fireEvent.pointerCancel(dragHandle);
  expect(getDirectionButton('block-start')).not.toBeInTheDocument();
});

test('shows direction buttons when dragged 2 pixels', () => {
  const { dragHandle, getDirectionButton } = renderDragHandle({
    directions: { 'block-start': 'active' },
    tooltipText: 'Click me!',
  });

  fireEvent.pointerDown(dragHandle, { clientX: 50, clientY: 50 });
  fireEvent.pointerMove(dragHandle, { clientX: 51, clientY: 52 });
  fireEvent.pointerUp(dragHandle);
  expect(getDirectionButton('block-start')).toBeVisible();
});

test("doesn't show direction buttons when dragged more than 3 pixels", () => {
  const { dragHandle, getDirectionButton } = renderDragHandle({
    directions: { 'block-start': 'active' },
    tooltipText: 'Click me!',
  });

  fireEvent.pointerDown(dragHandle, { clientX: 50, clientY: 50 });
  fireEvent.pointerMove(dragHandle, { clientX: 55, clientY: 55 });
  fireEvent.pointerUp(dragHandle);
  expect(getDirectionButton('block-start')).not.toBeInTheDocument();
});

test('hides direction buttons on Escape keypress', () => {
  const { dragHandle, getDirectionButton } = renderDragHandle({
    directions: { 'block-start': 'active' },
    tooltipText: 'Click me!',
  });

  dragHandle.focus();
  fireEvent.keyDown(dragHandle, { key: 'Escape' });
  // This kicks off an exit transition which doesn't end in JSDOM, so we just listen
  // for the exiting classname instead.
  const transitionWrapper = getDirectionButton('block-start')?.parentElement;
  expect(transitionWrapper).toHaveClass(styles['direction-button-wrapper-motion-exiting']);
});

test('renders disabled direction buttons', () => {
  const { dragHandle, getDirectionButton } = renderDragHandle({
    directions: { 'block-start': 'active' },
    tooltipText: 'Click me!',
  });

  dragHandle.focus();
  expect(getDirectionButton('block-start')).toBeVisible();
});

test("doesn't render direction buttons if value for direction is undefined", () => {
  const { dragHandle, getDirectionButton } = renderDragHandle({
    directions: { 'block-start': 'active', 'inline-start': undefined },
    tooltipText: 'Click me!',
  });

  dragHandle.focus();
  expect(getDirectionButton('block-start')).toBeVisible();
  expect(getDirectionButton('inline-start')).not.toBeInTheDocument();
});

test('focus returns to drag button after direction button is clicked', () => {
  const { dragHandle, getDirectionButton } = renderDragHandle({
    directions: { 'block-start': 'active', 'inline-start': undefined },
    tooltipText: 'Click me!',
  });

  dragHandle.focus();
  getDirectionButton('block-start')!.click();
  expect(dragHandle).toHaveFocus();
  expect(getDirectionButton('inline-start')).not.toBeInTheDocument();
});

test('calls onDirectionClick when direction button is pressed', () => {
  const onDirectionClick = jest.fn();
  const { dragHandle, getDirectionButton } = renderDragHandle({
    directions: { 'block-start': 'active', 'block-end': 'active', 'inline-start': 'active', 'inline-end': 'active' },
    tooltipText: 'Click me!',
    onDirectionClick,
  });

  dragHandle.focus();
  fireEvent.click(getDirectionButton('block-start')!);
  expect(onDirectionClick).toHaveBeenCalledWith('block-start');

  onDirectionClick.mockClear();
  fireEvent.click(getDirectionButton('block-end')!);
  expect(onDirectionClick).toHaveBeenCalledWith('block-end');

  onDirectionClick.mockClear();
  fireEvent.click(getDirectionButton('inline-start')!);
  expect(onDirectionClick).toHaveBeenCalledWith('inline-start');

  onDirectionClick.mockClear();
  fireEvent.click(getDirectionButton('inline-end')!);
  expect(onDirectionClick).toHaveBeenCalledWith('inline-end');
});

test("doesn't call onDirectionClick when disabled direction button is pressed", () => {
  const onDirectionClick = jest.fn();
  const { dragHandle, getDirectionButton } = renderDragHandle({
    directions: { 'block-start': 'disabled' },
    tooltipText: 'Click me!',
    onDirectionClick,
  });

  dragHandle.focus();
  fireEvent.click(getDirectionButton('block-start')!);
  expect(onDirectionClick).not.toHaveBeenCalled();
});
