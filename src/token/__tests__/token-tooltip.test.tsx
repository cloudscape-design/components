// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';

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

    expect(screen.queryByTestId('tooltip-live-region-content')).toBeInTheDocument();
    expect(screen.getByTestId('tooltip-live-region-content')).toHaveTextContent(
      'Very long text that should be truncated'
    );
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
    expect(screen.queryByTestId('tooltip-live-region-content')).toBeInTheDocument();

    fireEvent.mouseLeave(tokenElement);
    expect(screen.queryByTestId('tooltip-live-region-content')).not.toBeInTheDocument();
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

    expect(screen.queryByTestId('tooltip-live-region-content')).toBeInTheDocument();
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
    expect(screen.queryByTestId('tooltip-live-region-content')).toBeInTheDocument();

    fireEvent.blur(tokenElement);
    expect(screen.queryByTestId('tooltip-live-region-content')).not.toBeInTheDocument();
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

    expect(screen.queryByTestId('tooltip-live-region-content')).not.toBeInTheDocument();
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

    const liveRegionContent = screen.queryByTestId('tooltip-live-region-content');
    expect(liveRegionContent).toBeInTheDocument();
    expect(liveRegionContent).toHaveTextContent('Accessible tooltip content');
  });
});
