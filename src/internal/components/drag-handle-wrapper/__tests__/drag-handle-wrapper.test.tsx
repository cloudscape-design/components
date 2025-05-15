// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { fireEvent, render } from '@testing-library/react';

import DragHandleWrapper from '../../../../../lib/components/internal/components/drag-handle-wrapper';
import {
  Direction,
  DragHandleWrapperProps,
} from '../../../../../lib/components/internal/components/drag-handle-wrapper/interfaces';
import { PointerEventMock } from '../../../../../lib/components/internal/utils/pointer-events-mock';

import styles from '../../../../../lib/components/internal/components/drag-handle-wrapper/styles.css.js';
import tooltipStyles from '../../../../../lib/components/internal/components/tooltip/styles.css.js';

beforeAll(() => {
  (window as any).PointerEvent ??= PointerEventMock;
});

afterEach(() => {
  delete document.body.dataset.awsuiFocusVisible;
  jest.restoreAllMocks();
});

function getDirectionButton(direction: Direction) {
  return document.querySelector<HTMLButtonElement>(
    `.${styles[`direction-button-wrapper-${direction}`]} .${styles['direction-button']}`
  );
}

// Direction buttons get hidden via transition which doesn't end in JSDOM, so we use
// the "exiting", "exited" or "hidden" classname instead to verify it's hidden.
const DIRECTION_BUTTON_HIDDEN_CLASSES = [
  styles['direction-button-wrapper-motion-exiting'],
  styles['direction-button-wrapper-motion-exited'],
  styles['direction-button-wrapper-hidden'],
];

function expectDirectionButtonToBeHidden(direction: Direction) {
  expect(
    DIRECTION_BUTTON_HIDDEN_CLASSES.some(className =>
      getDirectionButton(direction)!.parentElement!.classList.contains(className)
    )
  ).toBe(true);
}

function expectDirectionButtonToBeVisible(direction: Direction) {
  expect(
    !DIRECTION_BUTTON_HIDDEN_CLASSES.some(className =>
      getDirectionButton(direction)!.parentElement!.classList.contains(className)
    )
  ).toBe(true);
}

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
    showButtons: () => {
      document.body.dataset.awsuiFocusVisible = 'true';
      container.querySelector<HTMLButtonElement>('#drag-button')!.focus();
    },
    getTooltip: () => document.querySelector(`.${tooltipStyles.root}`),
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
  renderDragHandle({
    directions: { 'block-start': 'active' },
  });

  expectDirectionButtonToBeHidden('block-start');
  expect(getDirectionButton('block-end')).not.toBeInTheDocument();
});

describe('triggerMode = focus (default)', () => {
  test('shows direction buttons when focus enters the button', () => {
    const { dragHandle } = renderDragHandle({
      directions: { 'block-start': 'active', 'block-end': 'active' },
    });

    document.body.dataset.awsuiFocusVisible = 'true';
    dragHandle.focus();
    expect(getDirectionButton('block-start')).toBeVisible();
    expect(getDirectionButton('block-end')).toBeVisible();
    expect(getDirectionButton('inline-start')).not.toBeInTheDocument();
  });

  test('hides direction buttons when focus leaves the button', () => {
    const { dragHandle } = renderDragHandle({
      directions: { 'block-start': 'active', 'block-end': 'active' },
      tooltipText: 'Click me!',
    });

    document.body.dataset.awsuiFocusVisible = 'true';
    dragHandle.focus();

    expect(getDirectionButton('block-start')).toBeInTheDocument();
    expect(getDirectionButton('block-end')).toBeInTheDocument();

    fireEvent.blur(dragHandle);
    expectDirectionButtonToBeHidden('block-start');
    expectDirectionButtonToBeHidden('block-end');
  });
});

describe('triggerMode = keyboard-activate', () => {
  test('does not show direction buttons when focus enters the button', () => {
    const { dragHandle } = renderDragHandle({
      directions: { 'block-start': 'active', 'block-end': 'active' },
      triggerMode: 'keyboard-activate',
    });

    document.body.dataset.awsuiFocusVisible = 'true';
    dragHandle.focus();
    expectDirectionButtonToBeHidden('block-start');
    expectDirectionButtonToBeHidden('block-end');
    expect(getDirectionButton('inline-start')).toBeNull();
    expect(getDirectionButton('inline-end')).toBeNull();
  });

  test.each(['Enter', ' '])('show direction buttons when "%s" key is pressed on the focused button', key => {
    const { dragHandle } = renderDragHandle({
      directions: { 'block-start': 'active', 'block-end': 'active' },
      triggerMode: 'keyboard-activate',
    });

    document.body.dataset.awsuiFocusVisible = 'true';
    dragHandle.focus();
    expectDirectionButtonToBeHidden('block-start');
    expectDirectionButtonToBeHidden('block-end');
    expect(getDirectionButton('inline-start')).not.toBeInTheDocument();
    expect(getDirectionButton('inline-end')).not.toBeInTheDocument();

    fireEvent.keyDown(dragHandle, { key });

    expect(getDirectionButton('block-start')).toBeInTheDocument();
    expect(getDirectionButton('block-end')).toBeInTheDocument();
    expect(getDirectionButton('inline-start')).not.toBeInTheDocument();
    expect(getDirectionButton('inline-end')).not.toBeInTheDocument();
  });

  test('hides direction buttons when focus leaves the button', () => {
    const { dragHandle } = renderDragHandle({
      directions: { 'block-start': 'active', 'block-end': 'active' },
      triggerMode: 'keyboard-activate',
    });

    document.body.dataset.awsuiFocusVisible = 'true';

    dragHandle.focus();
    fireEvent.keyDown(dragHandle, { key: 'Enter' });
    expect(getDirectionButton('block-start')).toBeInTheDocument();
    expect(getDirectionButton('block-end')).toBeInTheDocument();
    expect(getDirectionButton('inline-start')).not.toBeInTheDocument();
    expect(getDirectionButton('inline-end')).not.toBeInTheDocument();

    fireEvent.blur(dragHandle);
    expectDirectionButtonToBeHidden('block-start');
    expectDirectionButtonToBeHidden('block-end');
  });

  test.each(['Enter', ' '])('hides direction buttons when toggling "%s" key', key => {
    const { dragHandle } = renderDragHandle({
      directions: { 'block-start': 'active', 'block-end': 'active' },
      triggerMode: 'keyboard-activate',
    });

    document.body.dataset.awsuiFocusVisible = 'true';

    fireEvent.keyDown(dragHandle, { key });

    expect(getDirectionButton('block-start')).toBeInTheDocument();
    expect(getDirectionButton('block-end')).toBeInTheDocument();
    expect(getDirectionButton('inline-start')).not.toBeInTheDocument();
    expect(getDirectionButton('inline-end')).not.toBeInTheDocument();

    fireEvent.keyDown(dragHandle, { key });

    expectDirectionButtonToBeHidden('block-start');
    expectDirectionButtonToBeHidden('block-end');
  });
});

test('shows direction buttons when clicked', () => {
  const { dragHandle } = renderDragHandle({
    directions: { 'block-start': 'active' },
    tooltipText: 'Click me!',
  });

  fireEvent.pointerDown(dragHandle);
  fireEvent.pointerUp(dragHandle);
  expect(getDirectionButton('block-start')).toBeVisible();
});

test(`doesn't show direction buttons when drag is "cancelled"`, () => {
  const { dragHandle } = renderDragHandle({
    directions: { 'block-start': 'active' },
    tooltipText: 'Click me!',
  });

  fireEvent.pointerDown(dragHandle);
  fireEvent.pointerCancel(dragHandle);
  expectDirectionButtonToBeHidden('block-start');
});

test('shows direction buttons when dragged 2 pixels', () => {
  const { dragHandle } = renderDragHandle({
    directions: { 'block-start': 'active' },
    tooltipText: 'Click me!',
  });

  fireEvent.pointerDown(dragHandle, { clientX: 50, clientY: 50 });
  fireEvent.pointerMove(dragHandle, { clientX: 51, clientY: 52 });
  fireEvent.pointerUp(dragHandle);
  expect(getDirectionButton('block-start')).toBeVisible();
});

test("doesn't show direction buttons when dragged more than 3 pixels", () => {
  const { dragHandle } = renderDragHandle({
    directions: { 'block-start': 'active' },
    tooltipText: 'Click me!',
  });

  fireEvent.pointerDown(dragHandle, { clientX: 50, clientY: 50 });
  fireEvent.pointerMove(dragHandle, { clientX: 55, clientY: 55 });
  fireEvent.pointerUp(dragHandle);
  expectDirectionButtonToBeHidden('block-start');
});

test('hides direction buttons on Escape keypress', () => {
  const { dragHandle, showButtons } = renderDragHandle({
    directions: { 'block-start': 'active' },
    tooltipText: 'Click me!',
  });

  showButtons();
  fireEvent.keyDown(dragHandle, { key: 'Escape' });
  expectDirectionButtonToBeHidden('block-start');
});

test('renders disabled direction buttons', () => {
  const { showButtons } = renderDragHandle({
    directions: { 'block-start': 'active' },
    tooltipText: 'Click me!',
  });

  showButtons();
  expect(getDirectionButton('block-start')).toBeVisible();
});

test("doesn't render direction buttons if value for direction is undefined", () => {
  const { showButtons } = renderDragHandle({
    directions: { 'block-start': 'active', 'inline-start': undefined },
    tooltipText: 'Click me!',
  });

  showButtons();
  expect(getDirectionButton('block-start')).toBeVisible();
  expect(getDirectionButton('inline-start')).not.toBeInTheDocument();
});

test('focus returns to drag button after direction button is clicked', () => {
  const { dragHandle, showButtons } = renderDragHandle({
    directions: { 'block-start': 'active', 'inline-start': undefined },
    tooltipText: 'Click me!',
  });

  showButtons();
  getDirectionButton('block-start')!.click();
  expect(dragHandle).toHaveFocus();
  expect(getDirectionButton('inline-start')).not.toBeInTheDocument();
});

test('calls onDirectionClick when direction button is pressed', () => {
  const onDirectionClick = jest.fn();
  const { showButtons } = renderDragHandle({
    directions: { 'block-start': 'active', 'block-end': 'active', 'inline-start': 'active', 'inline-end': 'active' },
    tooltipText: 'Click me!',
    onDirectionClick,
  });

  showButtons();
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
  const { showButtons } = renderDragHandle({
    directions: { 'block-start': 'disabled' },
    tooltipText: 'Click me!',
    onDirectionClick,
  });

  showButtons();
  fireEvent.click(getDirectionButton('block-start')!);
  expect(onDirectionClick).not.toHaveBeenCalled();
});

describe('initialinitialShowButtons property', () => {
  test('shows direction buttons initially when initialShowButtons=true', () => {
    renderDragHandle({
      directions: { 'block-start': 'active', 'block-end': 'active' },
      initialShowButtons: true,
    });
    expectDirectionButtonToBeVisible('block-start');
    expectDirectionButtonToBeVisible('block-end');
    expect(getDirectionButton('inline-start')).not.toBeInTheDocument();
    expect(getDirectionButton('inline-end')).not.toBeInTheDocument();
  });

  test('hides direction buttons initially when initialShowButtons=false (default)', () => {
    renderDragHandle({
      directions: { 'block-start': 'active', 'block-end': 'active' },
    });
    expectDirectionButtonToBeHidden('block-start');
    expectDirectionButtonToBeHidden('block-end');
    expect(getDirectionButton('inline-start')).not.toBeInTheDocument();
    expect(getDirectionButton('inline-end')).not.toBeInTheDocument();
  });

  test('hides direction buttons on Escape keypress when initially visible', () => {
    const { dragHandle } = renderDragHandle({
      directions: { 'block-start': 'active', 'block-end': 'active' },
      initialShowButtons: true,
    });
    expectDirectionButtonToBeVisible('block-start');
    expectDirectionButtonToBeVisible('block-end');
    expect(getDirectionButton('inline-start')).not.toBeInTheDocument();
    expect(getDirectionButton('inline-end')).not.toBeInTheDocument();

    fireEvent.keyDown(dragHandle, { key: 'Escape' });
    expectDirectionButtonToBeHidden('block-start');
    expectDirectionButtonToBeHidden('block-end');
    expect(getDirectionButton('inline-start')).not.toBeInTheDocument();
    expect(getDirectionButton('inline-end')).not.toBeInTheDocument();
  });

  test('hides direction buttons when focus leaves the button when initially visible', () => {
    const { dragHandle } = renderDragHandle({
      directions: { 'block-start': 'active', 'block-end': 'active' },
      initialShowButtons: true,
    });
    expectDirectionButtonToBeVisible('block-start');
    expectDirectionButtonToBeVisible('block-end');
    expect(getDirectionButton('inline-start')).not.toBeInTheDocument();
    expect(getDirectionButton('inline-end')).not.toBeInTheDocument();
    dragHandle.focus();

    fireEvent.blur(dragHandle);
    expectDirectionButtonToBeHidden('block-start');
    expectDirectionButtonToBeHidden('block-end');
    expect(getDirectionButton('inline-start')).not.toBeInTheDocument();
    expect(getDirectionButton('inline-end')).not.toBeInTheDocument();
  });

  test('keeps direction buttons visible after click when initially visible', () => {
    const { dragHandle } = renderDragHandle({
      directions: { 'block-start': 'active' },
      initialShowButtons: true,
    });

    expect(getDirectionButton('block-start')).toBeInTheDocument();

    dragHandle.click();
    expectDirectionButtonToBeVisible('block-start');
    expect(getDirectionButton('block-end')).not.toBeInTheDocument();
    expect(getDirectionButton('inline-start')).not.toBeInTheDocument();
    expect(getDirectionButton('inline-end')).not.toBeInTheDocument();
  });

  describe('interaction with triggerMode', () => {
    test('shows direction buttons initially with initialShowButtons=true and triggerMode=keyboard-activate', () => {
      renderDragHandle({
        directions: { 'block-start': 'active', 'block-end': 'active' },
        triggerMode: 'keyboard-activate',
        initialShowButtons: true,
      });

      expectDirectionButtonToBeVisible('block-start');
      expectDirectionButtonToBeVisible('block-end');
      expect(getDirectionButton('inline-start')).not.toBeInTheDocument();
      expect(getDirectionButton('inline-end')).not.toBeInTheDocument();
    });

    test.each(['Enter', ' '])('toggles direction buttons with "%s" key when initially visible', key => {
      const { dragHandle } = renderDragHandle({
        directions: { 'block-start': 'active', 'block-end': 'active' },
        triggerMode: 'keyboard-activate',
        initialShowButtons: true,
      });
      expectDirectionButtonToBeVisible('block-start');
      expectDirectionButtonToBeVisible('block-end');
      expect(getDirectionButton('inline-start')).not.toBeInTheDocument();
      expect(getDirectionButton('inline-end')).not.toBeInTheDocument();

      fireEvent.keyDown(dragHandle, { key });
      expectDirectionButtonToBeHidden('block-start');
      expectDirectionButtonToBeHidden('block-end');
      expect(getDirectionButton('inline-start')).not.toBeInTheDocument();
      expect(getDirectionButton('inline-end')).not.toBeInTheDocument();
    });
  });
});
