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
    getDirectionButtonWrapper: (direction: Direction) => {
      return document.querySelector<HTMLButtonElement>(`.${styles[`direction-button-wrapper-${direction}`]}`);
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
  const { getDirectionButtonWrapper } = renderDragHandle({
    directions: { 'block-start': 'active' },
    tooltipText: 'Click me!',
  });

  expect(getDirectionButtonWrapper('block-start')).not.toBeInTheDocument();
  expect(getDirectionButtonWrapper('block-end')).not.toBeInTheDocument();
});

test('shows direction buttons when focus enters the button', () => {
  const { dragHandle, getDirectionButtonWrapper } = renderDragHandle({
    directions: { 'block-start': 'active', 'block-end': 'active' },
    tooltipText: 'Click me!',
  });

  dragHandle.focus();
  expect(getDirectionButtonWrapper('block-start')).toBeVisible();
  expect(getDirectionButtonWrapper('block-end')).toBeVisible();
  expect(getDirectionButtonWrapper('inline-start')).not.toBeInTheDocument();
});

test('hides direction buttons when focus leaves the button', () => {
  const { dragHandle, getDirectionButtonWrapper } = renderDragHandle({
    directions: { 'block-start': 'active', 'block-end': 'active' },
    tooltipText: 'Click me!',
  });

  fireEvent.focusIn(dragHandle, { relatedElement: document.body });
  fireEvent.focusOut(dragHandle, { relatedElement: document.body });
  expect(getDirectionButtonWrapper('block-start')).not.toBeInTheDocument();
  expect(getDirectionButtonWrapper('block-end')).not.toBeInTheDocument();
});

test('shows direction buttons when clicked', () => {
  const { dragHandle, getDirectionButtonWrapper } = renderDragHandle({
    directions: { 'block-start': 'active' },
    tooltipText: 'Click me!',
  });

  fireEvent.pointerDown(dragHandle);
  fireEvent.pointerUp(dragHandle);
  expect(getDirectionButtonWrapper('block-start')).toBeVisible();
});

test('shows direction buttons when dragged 2 pixels', () => {
  const { dragHandle, getDirectionButtonWrapper } = renderDragHandle({
    directions: { 'block-start': 'active' },
    tooltipText: 'Click me!',
  });

  fireEvent.pointerDown(dragHandle, { clientX: 50, clientY: 50 });
  fireEvent.pointerMove(dragHandle, { clientX: 51, clientY: 52 });
  fireEvent.pointerUp(dragHandle);
  expect(getDirectionButtonWrapper('block-start')).toBeVisible();
});

test("doesn't show direction buttons when dragged more than 3 pixels", () => {
  const { dragHandle, getDirectionButtonWrapper } = renderDragHandle({
    directions: { 'block-start': 'active' },
    tooltipText: 'Click me!',
  });

  fireEvent.pointerDown(dragHandle, { clientX: 50, clientY: 50 });
  fireEvent.pointerMove(dragHandle, { clientX: 55, clientY: 55 });
  fireEvent.pointerUp(dragHandle);
  expect(getDirectionButtonWrapper('block-start')).not.toBeInTheDocument();
});

test('hides direction buttons on Escape keypress', () => {
  const { dragHandle, getDirectionButtonWrapper } = renderDragHandle({
    directions: { 'block-start': 'active' },
    tooltipText: 'Click me!',
  });

  dragHandle.focus();
  fireEvent.keyDown(dragHandle, { key: 'Escape' });
  expect(getDirectionButtonWrapper('block-start')).toHaveClass(styles['direction-button-wrapper-motion-exiting']);
});

test('renders disabled direction buttons', () => {
  const { dragHandle, getDirectionButtonWrapper } = renderDragHandle({
    directions: { 'block-start': 'active' },
    tooltipText: 'Click me!',
  });

  dragHandle.focus();
  expect(getDirectionButtonWrapper('block-start')).toBeVisible();
});

test("doesn't render direction buttons if value for direction is undefined", () => {
  const { dragHandle, getDirectionButtonWrapper } = renderDragHandle({
    directions: { 'block-start': 'active', 'inline-start': undefined },
    tooltipText: 'Click me!',
  });

  dragHandle.focus();
  expect(getDirectionButtonWrapper('block-start')).toBeVisible();
  expect(getDirectionButtonWrapper('inline-start')).not.toBeInTheDocument();
});

test('focus returns to drag button after direction button is clicked', () => {
  const { dragHandle, getDirectionButtonWrapper } = renderDragHandle({
    directions: { 'block-start': 'active', 'inline-start': undefined },
    tooltipText: 'Click me!',
  });

  dragHandle.focus();
  getDirectionButtonWrapper('block-start')!.click();
  expect(dragHandle).toHaveFocus();
  expect(getDirectionButtonWrapper('inline-start')).not.toBeInTheDocument();
});

test('calls onDirectionClick when direction button is pressed', () => {
  const onDirectionClick = jest.fn();
  const { dragHandle } = renderDragHandle({
    directions: { 'block-start': 'active' },
    tooltipText: 'Click me!',
    onDirectionClick,
  });

  dragHandle.focus();
  fireEvent.click(
    document.querySelector(`.${styles['direction-button-wrapper-block-start']} .${styles['direction-button']}`)!
  );
  expect(onDirectionClick).toHaveBeenCalledWith('block-start');
});

test("doesn't call onDirectionClick when disabled direction button is pressed", () => {
  const onDirectionClick = jest.fn();
  const { dragHandle } = renderDragHandle({
    directions: { 'block-start': 'disabled' },
    tooltipText: 'Click me!',
    onDirectionClick,
  });

  dragHandle.focus();
  fireEvent.click(
    document.querySelector(`.${styles['direction-button-wrapper-block-start']} .${styles['direction-button']}`)!
  );
  expect(onDirectionClick).not.toHaveBeenCalled();
});
