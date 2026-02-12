// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { act, fireEvent, render } from '@testing-library/react';

import { getLogicalBoundingClientRect } from '@cloudscape-design/component-toolkit/internal';

import DragHandleWrapper from '../../../../../lib/components/internal/components/drag-handle-wrapper';
import {
  Direction,
  DragHandleWrapperProps,
} from '../../../../../lib/components/internal/components/drag-handle-wrapper/interfaces';
import { PointerEventMock } from '../../../../../lib/components/internal/utils/pointer-events-mock';

import styles from '../../../../../lib/components/internal/components/drag-handle-wrapper/styles.css.js';
import testUtilStyles from '../../../../../lib/components/internal/components/drag-handle-wrapper/test-classes/styles.css.js';
import tooltipStyles from '../../../../../lib/components/internal/components/tooltip/styles.css.js';

jest.mock('@cloudscape-design/component-toolkit/internal', () => ({
  ...jest.requireActual('@cloudscape-design/component-toolkit/internal'),
  getLogicalBoundingClientRect: jest.fn(),
}));

const viewport = { width: 800, height: 600 };
const size = { inlineSize: 50, blockSize: 50 };
const position = (inlineStart: number, blockStart: number) => ({
  ...size,
  insetInlineStart: inlineStart,
  insetInlineEnd: inlineStart + size.inlineSize,
  insetBlockStart: blockStart,
  insetBlockEnd: blockStart + size.blockSize,
});

// Store RAF callbacks globally so flush() can be used in tests
let rafCallbacks: Set<FrameRequestCallback>;
let flushAnimationFrames: () => void;

beforeAll(() => {
  (window as any).PointerEvent ??= PointerEventMock;
});

// We mock window and rect dimensions as if the handle was rendered far from the screen edges to
// prevent forced position rendering.
beforeEach(() => {
  jest.mocked(getLogicalBoundingClientRect).mockReturnValue(position(viewport.width / 2, viewport.height / 2));
  Object.defineProperty(window, 'innerWidth', { value: viewport.width, writable: true });
  Object.defineProperty(window, 'innerHeight', { value: viewport.height, writable: true });

  // Mock requestAnimationFrame to collect callbacks for explicit flushing
  // This gives tests control over when position calculations run
  rafCallbacks = new Set<FrameRequestCallback>();
  flushAnimationFrames = () => {
    act(() => {
      const callbacks = [...rafCallbacks]; // Snapshot before clearing
      rafCallbacks.clear();
      callbacks.forEach(cb => cb(performance.now()));
    });
  };

  jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: FrameRequestCallback) => {
    rafCallbacks.add(cb);
    return rafCallbacks.size;
  });
});

afterEach(() => {
  delete document.body.dataset.awsuiFocusVisible;
  jest.restoreAllMocks();
});

function getDirectionButton(direction: Direction) {
  return document.querySelector<HTMLButtonElement>(
    `.${styles[`direction-button-wrapper-${direction}`]} .${testUtilStyles[`direction-button-${direction}`]}`
  );
}

function getRandomDirectionButton() {
  const dir = (['block-start', 'block-end', 'inline-start', 'inline-end'] as const)[Math.floor(Math.random() * 4)];
  return document.querySelector<HTMLButtonElement>(
    `.${styles[`direction-button-wrapper-${dir}`]} .${testUtilStyles[`direction-button-${dir}`]}`
  );
}

function getAnyForcedDirectionButton() {
  return document.querySelector<HTMLButtonElement>(
    `.${styles['direction-button-wrapper-forced']} .${testUtilStyles['direction-button']}`
  );
}

function getForcedDirectionButton(direction: Direction, forcedPosition: 'top' | 'bottom', forcedIndex: 0 | 1 | 2 | 3) {
  return document.querySelector<HTMLButtonElement>(
    `.${styles['direction-button-wrapper-forced']}.${styles[`direction-button-wrapper-forced-${forcedPosition}-${forcedIndex}`]} .${testUtilStyles[`direction-button-${direction}`]}`
  );
}

// Direction buttons get hidden via transition which doesn't end in JSDOM, so we use
// the "exiting", "exit" or "hidden" classname instead to verify it's hidden.
const DIRECTION_BUTTON_HIDDEN_CLASSES = [
  styles['direction-button-wrapper-motion-exiting'],
  styles['direction-button-wrapper-motion-exit'],
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

function renderDragHandle(props: Partial<Omit<DragHandleWrapperProps, 'children'>>) {
  const mergedProps: Omit<DragHandleWrapperProps, 'children'> = {
    directions: {},
    hideButtonsOnDrag: false,
    clickDragThreshold: 3,
    ...props,
  };
  const { container } = render(
    <DragHandleWrapper {...mergedProps}>
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
    expectDirectionButtonToBeVisible('block-start');
    expectDirectionButtonToBeVisible('block-end');
    expect(getDirectionButton('inline-start')).not.toBeInTheDocument();
  });

  test('after focused and Esc key pressed, any other button press should show the direction buttons', () => {
    const { dragHandle } = renderDragHandle({
      directions: { 'block-start': 'active', 'block-end': 'active' },
    });

    document.body.dataset.awsuiFocusVisible = 'true';
    dragHandle.focus();
    expectDirectionButtonToBeVisible('block-start');
    expectDirectionButtonToBeVisible('block-end');
    expect(getDirectionButton('inline-start')).not.toBeInTheDocument();

    fireEvent.keyDown(dragHandle, { key: 'Escape' });
    expectDirectionButtonToBeHidden('block-start');
    expectDirectionButtonToBeHidden('block-end');
    expect(getDirectionButton('inline-start')).not.toBeInTheDocument();

    fireEvent.keyDown(dragHandle, { key: 'A' });
    expectDirectionButtonToBeVisible('block-start');
    expectDirectionButtonToBeVisible('block-end');
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

  test('when focused and other key is pressed, it should not show the direction buttons', () => {
    const { dragHandle } = renderDragHandle({
      directions: { 'block-start': 'active', 'block-end': 'active' },
      triggerMode: 'keyboard-activate',
    });

    document.body.dataset.awsuiFocusVisible = 'true';
    dragHandle.focus();
    expectDirectionButtonToBeHidden('block-start');
    expectDirectionButtonToBeHidden('block-end');
    expect(getDirectionButton('inline-start')).not.toBeInTheDocument();

    fireEvent.keyDown(dragHandle, { key: 'A' });
    expectDirectionButtonToBeHidden('block-start');
    expectDirectionButtonToBeHidden('block-end');
    expect(getDirectionButton('inline-start')).not.toBeInTheDocument();
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

describe('triggerMode = controlled', () => {
  test('shows direction buttons when specified', () => {
    const { dragHandle } = renderDragHandle({
      directions: { 'block-start': 'active', 'block-end': 'active' },
      triggerMode: 'controlled',
      controlledShowButtons: true,
    });

    document.body.dataset.awsuiFocusVisible = 'true';
    dragHandle.focus();
    expect(getDirectionButton('block-start')).toBeInTheDocument();
    expect(getDirectionButton('block-end')).toBeInTheDocument();
    expect(getDirectionButton('inline-start')).toBeNull();
    expect(getDirectionButton('inline-end')).toBeNull();
  });

  test('does not show direction buttons when focus enters the button', () => {
    const { dragHandle } = renderDragHandle({
      directions: { 'block-start': 'active', 'block-end': 'active' },
      triggerMode: 'controlled',
    });

    document.body.dataset.awsuiFocusVisible = 'true';
    dragHandle.focus();
    expectDirectionButtonToBeHidden('block-start');
    expectDirectionButtonToBeHidden('block-end');
    expect(getDirectionButton('inline-start')).toBeNull();
    expect(getDirectionButton('inline-end')).toBeNull();
  });

  test.each(['Enter', ' '])('does not show direction buttons when "%s" key is pressed on the focused button', key => {
    const { dragHandle } = renderDragHandle({
      directions: { 'block-start': 'active', 'block-end': 'active' },
      triggerMode: 'controlled',
    });

    document.body.dataset.awsuiFocusVisible = 'true';
    dragHandle.focus();
    expectDirectionButtonToBeHidden('block-start');
    expectDirectionButtonToBeHidden('block-end');
    expect(getDirectionButton('inline-start')).not.toBeInTheDocument();
    expect(getDirectionButton('inline-end')).not.toBeInTheDocument();

    fireEvent.keyDown(dragHandle, { key });

    expectDirectionButtonToBeHidden('block-start');
    expectDirectionButtonToBeHidden('block-end');
    expect(getDirectionButton('inline-start')).not.toBeInTheDocument();
    expect(getDirectionButton('inline-end')).not.toBeInTheDocument();
  });

  test('when focused and other key is pressed, it should not show the direction buttons', () => {
    const { dragHandle } = renderDragHandle({
      directions: { 'block-start': 'active', 'block-end': 'active' },
      triggerMode: 'controlled',
    });

    document.body.dataset.awsuiFocusVisible = 'true';
    dragHandle.focus();
    expectDirectionButtonToBeHidden('block-start');
    expectDirectionButtonToBeHidden('block-end');
    expect(getDirectionButton('inline-start')).not.toBeInTheDocument();

    fireEvent.keyDown(dragHandle, { key: 'A' });
    expectDirectionButtonToBeHidden('block-start');
    expectDirectionButtonToBeHidden('block-end');
    expect(getDirectionButton('inline-start')).not.toBeInTheDocument();
  });

  test('does not hide direction buttons when focus leaves the button', () => {
    const { dragHandle } = renderDragHandle({
      directions: { 'block-start': 'active', 'block-end': 'active' },
      triggerMode: 'controlled',
      controlledShowButtons: true,
    });

    document.body.dataset.awsuiFocusVisible = 'true';

    dragHandle.focus();
    expect(getDirectionButton('block-start')).toBeInTheDocument();
    expect(getDirectionButton('block-end')).toBeInTheDocument();
    expect(getDirectionButton('inline-start')).not.toBeInTheDocument();
    expect(getDirectionButton('inline-end')).not.toBeInTheDocument();

    fireEvent.blur(dragHandle);
    expect(getDirectionButton('block-start')).toBeInTheDocument();
    expect(getDirectionButton('block-end')).toBeInTheDocument();
  });

  test.each(['Enter', ' '])('does not hide direction buttons when toggling "%s" key', key => {
    const { dragHandle } = renderDragHandle({
      directions: { 'block-start': 'active', 'block-end': 'active' },
      triggerMode: 'controlled',
      controlledShowButtons: true,
    });

    document.body.dataset.awsuiFocusVisible = 'true';

    fireEvent.keyDown(dragHandle, { key });

    expect(getDirectionButton('block-start')).toBeInTheDocument();
    expect(getDirectionButton('block-end')).toBeInTheDocument();
    expect(getDirectionButton('inline-start')).not.toBeInTheDocument();
    expect(getDirectionButton('inline-end')).not.toBeInTheDocument();

    fireEvent.keyDown(dragHandle, { key });

    expect(getDirectionButton('block-start')).toBeInTheDocument();
    expect(getDirectionButton('block-end')).toBeInTheDocument();
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

test("doesn't show direction buttons when dragged more than 3 pixels (default threshold)", () => {
  const { dragHandle } = renderDragHandle({
    directions: { 'block-start': 'active' },
    tooltipText: 'Click me!',
  });

  fireEvent.pointerDown(dragHandle, { clientX: 50, clientY: 50 });
  fireEvent.pointerMove(dragHandle, { clientX: 55, clientY: 55 });
  fireEvent.pointerUp(dragHandle);
  expectDirectionButtonToBeHidden('block-start');
});

test('shows direction buttons when dragged less than custom clickDragThreshold', () => {
  const { dragHandle } = renderDragHandle({
    directions: { 'block-start': 'active' },
    tooltipText: 'Click me!',
    clickDragThreshold: 10,
  });

  fireEvent.pointerDown(dragHandle, { clientX: 50, clientY: 50 });
  fireEvent.pointerMove(dragHandle, { clientX: 55, clientY: 55 });
  fireEvent.pointerUp(dragHandle);
  expectDirectionButtonToBeVisible('block-start');
});

describe('hideButtonsOnDrag property', () => {
  test('hides direction buttons when dragging with hideButtonsOnDrag=true', () => {
    const { dragHandle, showButtons } = renderDragHandle({
      directions: { 'block-start': 'active' },
      tooltipText: 'Click me!',
      hideButtonsOnDrag: true,
    });

    showButtons();
    expectDirectionButtonToBeVisible('block-start');
    fireEvent.pointerDown(dragHandle, { clientX: 50, clientY: 50 });
    fireEvent.pointerMove(dragHandle, { clientX: 55, clientY: 55 });
    expectDirectionButtonToBeHidden('block-start');
  });

  test('keeps direction buttons visible when dragging with hideButtonsOnDrag=false (default)', () => {
    const { dragHandle, showButtons } = renderDragHandle({
      directions: { 'block-start': 'active' },
      tooltipText: 'Click me!',
      hideButtonsOnDrag: false,
    });

    showButtons();
    expectDirectionButtonToBeVisible('block-start');
    fireEvent.pointerDown(dragHandle, { clientX: 50, clientY: 50 });
    fireEvent.pointerMove(dragHandle, { clientX: 55, clientY: 55 }); // Move more than default threshold
    expectDirectionButtonToBeVisible('block-start');
  });
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

describe('initialShowButtons property', () => {
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

describe('forced position behavior', () => {
  const allDirections: Partial<DragHandleWrapperProps> = {
    directions: { 'block-start': 'active', 'block-end': 'active', 'inline-start': 'active', 'inline-end': 'active' },
    initialShowButtons: true,
  };

  test('shows UAP buttons normally when rendered with enough distance from the viewport edges', () => {
    jest.mocked(getLogicalBoundingClientRect).mockReturnValue(position(viewport.width / 2, viewport.height / 2));

    renderDragHandle(allDirections);
    flushAnimationFrames();

    expect(getDirectionButton('block-start')).not.toBe(null);
    expect(getDirectionButton('block-end')).not.toBe(null);
    expect(getDirectionButton('inline-start')).not.toBe(null);
    expect(getDirectionButton('inline-end')).not.toBe(null);
    expect(getAnyForcedDirectionButton()).toBe(null);
  });

  test('displays UAP buttons in one column under the handle when rendered in the top', () => {
    jest.mocked(getLogicalBoundingClientRect).mockReturnValue(position(viewport.width / 2, 25));

    renderDragHandle(allDirections);
    flushAnimationFrames();

    expect(getForcedDirectionButton('block-end', 'bottom', 3)).not.toBe(null);
    expect(getForcedDirectionButton('block-start', 'bottom', 2)).not.toBe(null);
    expect(getForcedDirectionButton('inline-end', 'bottom', 1)).not.toBe(null);
    expect(getForcedDirectionButton('inline-start', 'bottom', 0)).not.toBe(null);
    expect(getRandomDirectionButton()).toBe(null);
  });

  test('displays UAP buttons in one column under the handle when rendered in the top-left', () => {
    jest.mocked(getLogicalBoundingClientRect).mockReturnValue(position(25, 25));

    renderDragHandle(allDirections);
    flushAnimationFrames();

    expect(getForcedDirectionButton('block-end', 'bottom', 3)).not.toBe(null);
    expect(getForcedDirectionButton('block-start', 'bottom', 2)).not.toBe(null);
    expect(getForcedDirectionButton('inline-end', 'bottom', 1)).not.toBe(null);
    expect(getForcedDirectionButton('inline-start', 'bottom', 0)).not.toBe(null);
    expect(getRandomDirectionButton()).toBe(null);
  });

  test('displays UAP buttons in one column under the handle when rendered in the top-right', () => {
    jest.mocked(getLogicalBoundingClientRect).mockReturnValue(position(viewport.width - 75, 25));

    renderDragHandle(allDirections);
    flushAnimationFrames();

    expect(getForcedDirectionButton('block-end', 'bottom', 3)).not.toBe(null);
    expect(getForcedDirectionButton('block-start', 'bottom', 2)).not.toBe(null);
    expect(getForcedDirectionButton('inline-end', 'bottom', 1)).not.toBe(null);
    expect(getForcedDirectionButton('inline-start', 'bottom', 0)).not.toBe(null);
    expect(getRandomDirectionButton()).toBe(null);
  });

  test('displays UAP buttons in one column above the handle when rendered on the left', () => {
    jest.mocked(getLogicalBoundingClientRect).mockReturnValue(position(25, viewport.height / 2));

    renderDragHandle(allDirections);
    flushAnimationFrames();

    expect(getForcedDirectionButton('block-end', 'top', 0)).not.toBe(null);
    expect(getForcedDirectionButton('block-start', 'top', 1)).not.toBe(null);
    expect(getForcedDirectionButton('inline-end', 'top', 2)).not.toBe(null);
    expect(getForcedDirectionButton('inline-start', 'top', 3)).not.toBe(null);
    expect(getRandomDirectionButton()).toBe(null);
  });

  test('displays UAP buttons in one column above the handle when rendered on the right', () => {
    jest.mocked(getLogicalBoundingClientRect).mockReturnValue(position(viewport.width - 75, viewport.height / 2));

    renderDragHandle(allDirections);
    flushAnimationFrames();

    expect(getForcedDirectionButton('block-end', 'top', 0)).not.toBe(null);
    expect(getForcedDirectionButton('block-start', 'top', 1)).not.toBe(null);
    expect(getForcedDirectionButton('inline-end', 'top', 2)).not.toBe(null);
    expect(getForcedDirectionButton('inline-start', 'top', 3)).not.toBe(null);
    expect(getRandomDirectionButton()).toBe(null);
  });

  test('displays UAP buttons in one column above the handle when rendered in the bottom', () => {
    jest.mocked(getLogicalBoundingClientRect).mockReturnValue(position(viewport.width / 2, viewport.height - 75));

    renderDragHandle(allDirections);
    flushAnimationFrames();

    expect(getForcedDirectionButton('block-end', 'top', 0)).not.toBe(null);
    expect(getForcedDirectionButton('block-start', 'top', 1)).not.toBe(null);
    expect(getForcedDirectionButton('inline-end', 'top', 2)).not.toBe(null);
    expect(getForcedDirectionButton('inline-start', 'top', 3)).not.toBe(null);
    expect(getRandomDirectionButton()).toBe(null);
  });

  test('displays partial UAP buttons in one column under the handle when rendered in the top', () => {
    jest.mocked(getLogicalBoundingClientRect).mockReturnValue(position(viewport.width / 2, 25));

    renderDragHandle({ directions: { 'inline-start': 'active', 'block-start': 'active' }, initialShowButtons: true });
    flushAnimationFrames();

    expect(getForcedDirectionButton('block-start', 'bottom', 1)).not.toBe(null);
    expect(getForcedDirectionButton('inline-start', 'bottom', 0)).not.toBe(null);
    expect(getRandomDirectionButton()).toBe(null);
  });

  test('displays partial UAP buttons in one column above the handle when rendered in the bottom', () => {
    jest.mocked(getLogicalBoundingClientRect).mockReturnValue(position(viewport.width / 2, viewport.height - 75));

    renderDragHandle({ directions: { 'inline-end': 'active', 'block-end': 'active' }, initialShowButtons: true });
    flushAnimationFrames();

    expect(getForcedDirectionButton('block-end', 'top', 0)).not.toBe(null);
    expect(getForcedDirectionButton('inline-end', 'top', 1)).not.toBe(null);
    expect(getRandomDirectionButton()).toBe(null);
  });

  test('displays UAP buttons in one column above the handle when there is enough space', () => {
    jest.mocked(getLogicalBoundingClientRect).mockReturnValue(position(25, 100));

    renderDragHandle({ directions: { 'inline-start': 'active', 'block-end': 'active' }, initialShowButtons: true });
    flushAnimationFrames();

    expect(getForcedDirectionButton('block-end', 'top', 0)).not.toBe(null);
    expect(getForcedDirectionButton('inline-start', 'top', 1)).not.toBe(null);
    expect(getRandomDirectionButton()).toBe(null);
  });

  test('displays UAP buttons in one column under the handle when there is not enough space above', () => {
    jest.mocked(getLogicalBoundingClientRect).mockReturnValue(position(25, 100));

    renderDragHandle(allDirections);
    flushAnimationFrames();

    expect(getForcedDirectionButton('block-end', 'bottom', 3)).not.toBe(null);
    expect(getForcedDirectionButton('block-start', 'bottom', 2)).not.toBe(null);
    expect(getForcedDirectionButton('inline-end', 'bottom', 1)).not.toBe(null);
    expect(getForcedDirectionButton('inline-start', 'bottom', 0)).not.toBe(null);
    expect(getRandomDirectionButton()).toBe(null);
  });

  test('does not force column position when there is no conflict on the left', () => {
    jest.mocked(getLogicalBoundingClientRect).mockReturnValue(position(25, viewport.height / 2));

    renderDragHandle({
      directions: { 'block-start': 'active', 'block-end': 'active', 'inline-end': 'active' },
      initialShowButtons: true,
    });
    flushAnimationFrames();

    expect(getAnyForcedDirectionButton()).toBe(null);
    expect(getDirectionButton('block-start')).not.toBe(null);
    expect(getDirectionButton('block-end')).not.toBe(null);
    expect(getDirectionButton('inline-end')).not.toBe(null);
  });

  test('does not force column position when there is no conflict on the right', () => {
    jest.mocked(getLogicalBoundingClientRect).mockReturnValue(position(viewport.width - 75, viewport.height / 2));

    renderDragHandle({
      directions: { 'block-start': 'active', 'block-end': 'active', 'inline-start': 'active' },
      initialShowButtons: true,
    });
    flushAnimationFrames();

    expect(getAnyForcedDirectionButton()).toBe(null);
    expect(getDirectionButton('block-start')).not.toBe(null);
    expect(getDirectionButton('block-end')).not.toBe(null);
    expect(getDirectionButton('inline-start')).not.toBe(null);
  });

  test('does not force column position when there is no conflict on the top', () => {
    jest.mocked(getLogicalBoundingClientRect).mockReturnValue(position(viewport.width / 2, 25));

    renderDragHandle({
      directions: { 'block-end': 'active', 'inline-start': 'active', 'inline-end': 'active' },
      initialShowButtons: true,
    });
    flushAnimationFrames();

    expect(getAnyForcedDirectionButton()).toBe(null);
    expect(getDirectionButton('block-end')).not.toBe(null);
    expect(getDirectionButton('inline-start')).not.toBe(null);
    expect(getDirectionButton('inline-end')).not.toBe(null);
  });

  test('does not force column position when there is no conflict on the bottom', () => {
    jest.mocked(getLogicalBoundingClientRect).mockReturnValue(position(viewport.width / 2, viewport.height - 75));

    renderDragHandle({
      directions: { 'block-start': 'active', 'inline-start': 'active', 'inline-end': 'active' },
      initialShowButtons: true,
    });
    flushAnimationFrames();

    expect(getAnyForcedDirectionButton()).toBe(null);
    expect(getDirectionButton('block-start')).not.toBe(null);
    expect(getDirectionButton('inline-start')).not.toBe(null);
    expect(getDirectionButton('inline-end')).not.toBe(null);
  });
});
