// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, fireEvent, render } from '@testing-library/react';

import createWrapper from '../../../lib/components/test-utils/dom';
import Token from '../../../lib/components/token';

// Mock ResizeObserver
let mockResizeObserverCallback: any;
const mockResizeObserver = jest.fn().mockImplementation(callback => {
  mockResizeObserverCallback = callback;
  return {
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  };
});

global.ResizeObserver = mockResizeObserver;

describe('Token Tooltip behavior', () => {
  beforeEach(() => {
    mockResizeObserver.mockClear();
    mockResizeObserverCallback = null;
  });

  const mockEllipsisActive = (labelElement: HTMLElement, isActive: boolean) => {
    const innerSpan = labelElement.querySelector('span');
    if (innerSpan) {
      Object.defineProperty(innerSpan, 'offsetWidth', {
        configurable: true,
        value: isActive ? 300 : 100,
      });
      Object.defineProperty(labelElement, 'offsetWidth', {
        configurable: true,
        value: 200,
      });
    }
  };

  const triggerResizeObserver = (labelElement: HTMLElement) => {
    act(() => {
      if (mockResizeObserverCallback) {
        mockResizeObserverCallback([
          {
            target: labelElement.parentElement,
            contentRect: { width: 200, height: 20 },
            borderBoxSize: [{ inlineSize: 200, blockSize: 20 }],
            contentBoxSize: [{ inlineSize: 200, blockSize: 20 }],
            devicePixelContentBoxSize: [{ inlineSize: 200, blockSize: 20 }],
          },
        ]);
      }
    });
  };

  test('shows tooltip on mouse enter when text overflows', () => {
    const { container } = render(
      <Token
        variant="inline"
        label="Very long text that should be truncated"
        tooltipContent="Very long text that should be truncated"
      />
    );

    const wrapper = createWrapper(container).findToken()!;
    const tokenElement = wrapper.getElement();
    const labelElement = wrapper.findLabel().getElement();

    mockEllipsisActive(labelElement, true);
    triggerResizeObserver(labelElement);

    fireEvent.mouseEnter(tokenElement);

    const tooltip = createWrapper().findTooltip();
    expect(tooltip).not.toBeNull();
    expect(tooltip!.getElement()).toHaveTextContent('Very long text that should be truncated');
  });

  test('hides tooltip on mouse leave', () => {
    const { container } = render(
      <Token
        variant="inline"
        label="Very long text that should be truncated"
        tooltipContent="Very long text that should be truncated"
      />
    );

    const wrapper = createWrapper(container).findToken()!;
    const tokenElement = wrapper.getElement();
    const labelElement = wrapper.findLabel().getElement();

    mockEllipsisActive(labelElement, true);
    triggerResizeObserver(labelElement);

    fireEvent.mouseEnter(tokenElement);
    expect(createWrapper().findTooltip()).not.toBeNull();

    fireEvent.mouseLeave(tokenElement);
    expect(createWrapper().findTooltip()).toBeNull();
  });

  test('shows tooltip on focus when text overflows', () => {
    const { container } = render(
      <Token
        variant="inline"
        label="Very long text that should be truncated"
        tooltipContent="Very long text that should be truncated"
      />
    );

    const wrapper = createWrapper(container).findToken()!;
    const tokenElement = wrapper.getElement();
    const labelElement = wrapper.findLabel().getElement();

    mockEllipsisActive(labelElement, true);
    triggerResizeObserver(labelElement);

    fireEvent.focus(tokenElement);

    expect(createWrapper().findTooltip()).not.toBeNull();
  });

  test('hides tooltip on blur', () => {
    const { container } = render(
      <Token
        variant="inline"
        label="Very long text that should be truncated"
        tooltipContent="Very long text that should be truncated"
      />
    );

    const wrapper = createWrapper(container).findToken()!;
    const tokenElement = wrapper.getElement();
    const labelElement = wrapper.findLabel().getElement();

    mockEllipsisActive(labelElement, true);
    triggerResizeObserver(labelElement);

    fireEvent.focus(tokenElement);
    expect(createWrapper().findTooltip()).not.toBeNull();

    fireEvent.blur(tokenElement);
    expect(createWrapper().findTooltip()).toBeNull();
  });

  test('does not show tooltip when text does not overflow', () => {
    const { container } = render(<Token variant="inline" label="Short text" tooltipContent="Short text" />);

    const wrapper = createWrapper(container).findToken()!;
    const tokenElement = wrapper.getElement();
    const labelElement = wrapper.findLabel().getElement();

    mockEllipsisActive(labelElement, false);
    act(() => {
      fireEvent(window, new Event('resize'));
    });

    fireEvent.mouseEnter(tokenElement);

    expect(createWrapper().findTooltip()).toBeNull();
  });

  test('sets tabIndex for focusable tokens with tooltips', () => {
    const { container } = render(
      <Token
        variant="inline"
        label="Very long text that should be truncated"
        tooltipContent="Very long text that should be truncated"
      />
    );

    const wrapper = createWrapper(container).findToken()!;
    const tokenElement = wrapper.getElement();
    const labelElement = wrapper.findLabel().getElement();

    mockEllipsisActive(labelElement, true);
    triggerResizeObserver(labelElement);

    expect(tokenElement).toHaveAttribute('tabindex', '0');
  });

  test('tooltip is accessible via live region', () => {
    const { container } = render(
      <Token
        variant="inline"
        label="Very long text that should be truncated"
        tooltipContent="Accessible tooltip content"
      />
    );

    const wrapper = createWrapper(container).findToken()!;
    const tokenElement = wrapper.getElement();
    const labelElement = wrapper.findLabel().getElement();

    mockEllipsisActive(labelElement, true);
    triggerResizeObserver(labelElement);

    fireEvent.mouseEnter(tokenElement);

    const tooltip = createWrapper().findTooltip();
    expect(tooltip).not.toBeNull();
    expect(tooltip!.getElement()).toHaveTextContent('Accessible tooltip content');
  });

  test('hides tooltip when Escape key is pressed', () => {
    const { container } = render(
      <Token
        variant="inline"
        label="Very long text that should be truncated"
        tooltipContent="Very long text that should be truncated"
      />
    );

    const wrapper = createWrapper(container).findToken()!;
    const tokenElement = wrapper.getElement();
    const labelElement = wrapper.findLabel().getElement();

    mockEllipsisActive(labelElement, true);
    triggerResizeObserver(labelElement);

    // Show tooltip
    fireEvent.mouseEnter(tokenElement);
    expect(createWrapper().findTooltip()).not.toBeNull();

    // Press Escape key
    act(() => {
      const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
      document.body.dispatchEvent(escapeEvent);
    });

    // Tooltip should be hidden
    expect(createWrapper().findTooltip()).toBeNull();
  });

  const mockLabelTagOverflow = (labelTagElement: HTMLElement) => {
    Object.defineProperty(labelTagElement, 'scrollWidth', { configurable: true, value: 300 });
    Object.defineProperty(labelTagElement, 'clientWidth', { configurable: true, value: 100 });
  };

  test('shows tooltip when only the label tag overflows', () => {
    const { container } = render(
      <Token variant="inline" label="Short" labelTag="Very long label tag" tooltipContent="Short Very long label tag" />
    );

    const wrapper = createWrapper(container).findToken()!;
    const labelElement = wrapper.findLabel().getElement();
    mockEllipsisActive(labelElement, false);
    mockLabelTagOverflow(wrapper.findLabelTag()!.getElement());
    triggerResizeObserver(labelElement);

    expect(wrapper.getElement()).toHaveAttribute('tabIndex', '0');
    fireEvent.mouseEnter(wrapper.getElement());
    expect(createWrapper().findTooltip()!.getElement()).toHaveTextContent('Short Very long label tag');
  });

  test('makes the root focusable and shows tooltip when the label tag overflows and the label is a node', () => {
    const { container } = render(
      <Token
        variant="inline"
        label={<button>Trigger</button>}
        labelTag="Very long label tag"
        tooltipContent="Trigger Very long label tag"
      />
    );

    const wrapper = createWrapper(container).findToken()!;
    mockLabelTagOverflow(wrapper.findLabelTag()!.getElement());
    triggerResizeObserver(wrapper.findLabel().getElement());

    expect(wrapper.getElement()).toHaveAttribute('tabIndex', '0');
    fireEvent.mouseEnter(wrapper.getElement());
    expect(createWrapper().findTooltip()!.getElement()).toHaveTextContent('Trigger Very long label tag');
    fireEvent.mouseLeave(wrapper.getElement());
    fireEvent.focus(wrapper.getElement());
    expect(createWrapper().findTooltip()).not.toBeNull();
    fireEvent.focus(wrapper.findLabel().getElement().querySelector('button')!);
    expect(createWrapper().findTooltip()).toBeNull();
  });
});
