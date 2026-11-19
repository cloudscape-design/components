// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, fireEvent, render } from '@testing-library/react';

import '../../__a11y__/to-validate-a11y';
import createWrapper from '../../../lib/components/test-utils/dom';
import TruncatedText from '../../../lib/components/truncated-text';

import styles from '../../../lib/components/truncated-text/test-classes/styles.css.js';

// Mock ResizeObserver. Multiple components in a single render (e.g. TruncatedText + the
// Tooltip it renders) can each create their own observer, so we associate the callback
// with the observed element rather than overwriting a single global slot.
const observerCallbacks = new Map<Element, ResizeObserverCallback>();
const mockResizeObserver = jest.fn().mockImplementation((callback: ResizeObserverCallback) => {
  let observed: Element | null = null;
  return {
    observe: jest.fn((target: Element) => {
      observed = target;
      observerCallbacks.set(target, callback);
    }),
    unobserve: jest.fn((target: Element) => {
      if (observerCallbacks.get(target) === callback) {
        observerCallbacks.delete(target);
      }
    }),
    disconnect: jest.fn(() => {
      if (observed && observerCallbacks.get(observed) === callback) {
        observerCallbacks.delete(observed);
      }
    }),
  };
});

(global as any).ResizeObserver = mockResizeObserver;

beforeEach(() => {
  mockResizeObserver.mockClear();
  observerCallbacks.clear();
});

function setOverflow(element: HTMLElement, isOverflowing: boolean) {
  Object.defineProperty(element, 'scrollWidth', {
    configurable: true,
    value: isOverflowing ? 300 : 100,
  });
  Object.defineProperty(element, 'clientWidth', {
    configurable: true,
    value: 200,
  });
}

function triggerResize(element: HTMLElement) {
  const callback = observerCallbacks.get(element);
  if (!callback) {
    throw new Error('No ResizeObserver callback registered for the given element.');
  }
  act(() => {
    callback(
      [
        {
          target: element,
          contentRect: { width: 200, height: 20 } as DOMRectReadOnly,
          borderBoxSize: [{ inlineSize: 200, blockSize: 20 }],
          contentBoxSize: [{ inlineSize: 200, blockSize: 20 }],
          devicePixelContentBoxSize: [{ inlineSize: 200, blockSize: 20 }],
        } as unknown as ResizeObserverEntry,
      ],
      {} as ResizeObserver
    );
  });
}

function renderTruncatedText(jsx: React.ReactElement) {
  const { container } = render(jsx);
  const wrapper = createWrapper(container).findTruncatedText()!;
  return { container, wrapper, element: wrapper.getElement() };
}

describe('TruncatedText', () => {
  test('renders the children content', () => {
    const { element } = renderTruncatedText(<TruncatedText>Some text</TruncatedText>);
    expect(element).toHaveTextContent('Some text');
  });

  test('applies the test-utils root class', () => {
    const { element } = renderTruncatedText(<TruncatedText>Some text</TruncatedText>);
    expect(element).toHaveClass(styles.root);
  });

  test('forwards baseComponentProps (className, id, data-*)', () => {
    const { element } = renderTruncatedText(
      <TruncatedText className="custom-class" id="my-id" data-testid="my-test-id">
        Hello
      </TruncatedText>
    );
    expect(element).toHaveClass('custom-class');
    expect(element).toHaveAttribute('id', 'my-id');
    expect(element).toHaveAttribute('data-testid', 'my-test-id');
  });

  test('does not show a tooltip when text is not truncated', () => {
    const { element, wrapper } = renderTruncatedText(<TruncatedText>Short</TruncatedText>);
    setOverflow(element, false);
    triggerResize(element);
    fireEvent.pointerEnter(element);
    expect(wrapper.findTooltip()).toBeNull();
  });

  test('does not make the element focusable when not truncated', () => {
    const { element } = renderTruncatedText(<TruncatedText>Short</TruncatedText>);
    setOverflow(element, false);
    triggerResize(element);
    expect(element).not.toHaveAttribute('tabIndex');
  });

  test('shows a tooltip on pointer enter when text is truncated', () => {
    const { element, wrapper } = renderTruncatedText(<TruncatedText>Very long text content</TruncatedText>);
    setOverflow(element, true);
    triggerResize(element);

    fireEvent.pointerEnter(element);

    const tooltip = wrapper.findTooltip();
    expect(tooltip).not.toBeNull();
    expect(tooltip!.getElement()).toHaveTextContent('Very long text content');
  });

  test('hides the tooltip on pointer leave', () => {
    const { element, wrapper } = renderTruncatedText(<TruncatedText>Very long text content</TruncatedText>);
    setOverflow(element, true);
    triggerResize(element);

    fireEvent.pointerEnter(element);
    expect(wrapper.findTooltip()).not.toBeNull();

    fireEvent.pointerLeave(element);
    expect(wrapper.findTooltip()).toBeNull();
  });

  test('shows the tooltip on focus when text is truncated', () => {
    const { element, wrapper } = renderTruncatedText(<TruncatedText>Very long text content</TruncatedText>);
    setOverflow(element, true);
    triggerResize(element);

    fireEvent.focus(element);
    expect(wrapper.findTooltip()).not.toBeNull();
  });

  test('hides the tooltip on blur', () => {
    const { element, wrapper } = renderTruncatedText(<TruncatedText>Very long text content</TruncatedText>);
    setOverflow(element, true);
    triggerResize(element);

    fireEvent.focus(element);
    expect(wrapper.findTooltip()).not.toBeNull();

    fireEvent.blur(element);
    expect(wrapper.findTooltip()).toBeNull();
  });

  test('hides the tooltip on Escape key press', () => {
    const { element, wrapper } = renderTruncatedText(<TruncatedText>Very long text content</TruncatedText>);
    setOverflow(element, true);
    triggerResize(element);

    fireEvent.pointerEnter(element);
    expect(wrapper.findTooltip()).not.toBeNull();

    act(() => {
      document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    });

    expect(wrapper.findTooltip()).toBeNull();
  });

  test('makes the element focusable (tabIndex=0) only when text is truncated', () => {
    const { element } = renderTruncatedText(<TruncatedText>Very long text content</TruncatedText>);
    setOverflow(element, true);
    triggerResize(element);
    expect(element).toHaveAttribute('tabIndex', '0');
  });

  test('uses tooltipText for the tooltip content when provided', () => {
    const { element, wrapper } = renderTruncatedText(
      <TruncatedText tooltipText="Custom tooltip text">
        <a href="#">Link content</a>
      </TruncatedText>
    );
    setOverflow(element, true);
    triggerResize(element);

    fireEvent.pointerEnter(element);

    const tooltip = wrapper.findTooltip();
    expect(tooltip).not.toBeNull();
    expect(tooltip!.getElement()).toHaveTextContent('Custom tooltip text');
    expect(tooltip!.getElement()).not.toHaveTextContent('Link content');
  });

  test('falls back to children when tooltipText is not provided', () => {
    const { element, wrapper } = renderTruncatedText(<TruncatedText>Default text</TruncatedText>);
    setOverflow(element, true);
    triggerResize(element);

    fireEvent.pointerEnter(element);
    expect(wrapper.findTooltip()!.getElement()).toHaveTextContent('Default text');
  });

  test('renders non-string React children', () => {
    const { element } = renderTruncatedText(
      <TruncatedText tooltipText="ResourceName-12345">
        <a href="#">ResourceName-12345</a>
      </TruncatedText>
    );
    expect(element.querySelector('a')).not.toBeNull();
    expect(element.querySelector('a')).toHaveTextContent('ResourceName-12345');
  });

  test('updates truncation status when the resize callback indicates content fits', () => {
    const { element, wrapper } = renderTruncatedText(<TruncatedText>Some text</TruncatedText>);

    // Start truncated
    setOverflow(element, true);
    triggerResize(element);
    fireEvent.pointerEnter(element);
    expect(wrapper.findTooltip()).not.toBeNull();
    fireEvent.pointerLeave(element);
    expect(wrapper.findTooltip()).toBeNull();

    // Then no longer truncated
    setOverflow(element, false);
    triggerResize(element);
    expect(element).not.toHaveAttribute('tabIndex');
    fireEvent.pointerEnter(element);
    expect(wrapper.findTooltip()).toBeNull();
  });

  test('passes accessibility validation (non-truncated)', async () => {
    const { container, element } = renderTruncatedText(<TruncatedText>Short text</TruncatedText>);
    setOverflow(element, false);
    triggerResize(element);
    await expect(container).toValidateA11y();
  });

  test('passes accessibility validation (truncated)', async () => {
    const { container, element } = renderTruncatedText(<TruncatedText>Very long text content</TruncatedText>);
    setOverflow(element, true);
    triggerResize(element);
    await expect(container).toValidateA11y();
  });
});
