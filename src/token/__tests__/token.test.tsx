// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';

import createWrapper from '../../../lib/components/test-utils/dom';
import Token, { TokenProps } from '../../../lib/components/token';
import InternalToken from '../../../lib/components/token/internal';

import styles from '../../../lib/components/token/styles.css.js';

// Mock ResizeObserver for tooltip and overflow tests
const mockObserve = jest.fn();
const mockUnobserve = jest.fn();
const mockDisconnect = jest.fn();
let mockResizeCallback: (entries: any) => void = () => {};

function renderToken(props: TokenProps) {
  const renderResult = render(<Token {...props} />);
  return createWrapper(renderResult.container).findToken()!;
}

describe('Token', () => {
  let originalOffsetWidth: any;

  beforeEach(() => {
    // Mock ResizeObserver
    window.ResizeObserver = jest.fn().mockImplementation(callback => {
      mockResizeCallback = callback;
      return {
        observe: mockObserve,
        unobserve: mockUnobserve,
        disconnect: mockDisconnect,
      };
    });

    // Store original offsetWidth
    originalOffsetWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetWidth');

    // Reset mocks
    mockObserve.mockClear();
    mockUnobserve.mockClear();
    mockDisconnect.mockClear();
  });

  afterEach(() => {
    // Restore original offsetWidth
    if (originalOffsetWidth) {
      Object.defineProperty(HTMLElement.prototype, 'offsetWidth', originalOffsetWidth);
    }
  });

  describe('Basic rendering', () => {
    test('renders with minimal props', () => {
      const wrapper = renderToken({ label: 'Test token' });
      expect(wrapper.getElement()).toHaveClass(styles['token-normal']);
      expect(wrapper.findLabel()!.getElement()).toHaveTextContent('Test token');
    });

    test('renders with all props', () => {
      const onDismiss = jest.fn();
      const wrapper = renderToken({
        label: 'Test token',
        labelTag: 'Tag',
        description: 'Description',
        tags: ['Tag1', 'Tag2'],
        icon: <span data-testid="custom-icon">Icon</span>,
        dismissLabel: 'Dismiss',
        onDismiss,
      });

      expect(wrapper.findLabel()!.getElement()).toHaveTextContent('Test token');
      expect(wrapper.findLabelTag()!.getElement()).toHaveTextContent('Tag');
      expect(wrapper.findDescription()!.getElement()).toHaveTextContent('Description');
      expect(wrapper.findTags()!.length).toBe(2);
      expect(wrapper.findTags()![0].getElement()).toHaveTextContent('Tag1');
      expect(wrapper.findTags()![1].getElement()).toHaveTextContent('Tag2');
      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
      expect(wrapper.findDismiss()!.getElement()).toHaveAttribute('aria-label', 'Dismiss');
    });

    test('renders with ReactNode label', () => {
      renderToken({
        label: <span data-testid="custom-label">Custom label</span>,
      });
      expect(screen.getByTestId('custom-label')).toBeInTheDocument();

      // Test styling with ReactNode label for inline variant
      const wrapper = renderToken({
        variant: 'inline',
        label: <span data-testid="custom-label-inline">Custom Label</span>,
      });
      expect(wrapper.getElement()).toHaveClass(styles['token-inline-min-width']);
    });
  });

  describe('Variants', () => {
    test('renders normal variant by default', () => {
      const wrapper = renderToken({ label: 'Test token' });
      expect(wrapper.getElement()).toHaveClass(styles['token-normal']);
      expect(wrapper.getElement()).not.toHaveClass(styles['token-inline']);
    });

    test('renders inline variant', () => {
      const wrapper = renderToken({ label: 'Test token', variant: 'inline' });
      expect(wrapper.getElement()).toHaveClass(styles['token-inline']);
      expect(wrapper.getElement()).not.toHaveClass(styles['token-normal']);
    });

    test('applies correct styling for inline variant with icon', () => {
      renderToken({
        label: 'Test token',
        variant: 'inline',
        icon: <span data-testid="custom-icon">Icon</span>,
      });

      const icon = screen.getByTestId('custom-icon').parentElement;
      expect(icon).toHaveClass(styles.icon);
      expect(icon).toHaveClass(styles['icon-inline']);
    });

    test('applies correct styling for normal variant with icon', () => {
      renderToken({
        label: 'Test token',
        icon: <span data-testid="custom-icon">Icon</span>,
      });

      const icon = screen.getByTestId('custom-icon').parentElement;
      expect(icon).toHaveClass(styles.icon);
      expect(icon).not.toHaveClass(styles['icon-inline']);
    });

    test('applies correct styling for normal variant with icon and description', () => {
      renderToken({
        label: 'Test token',
        description: 'Description',
        icon: <span data-testid="custom-icon">Icon</span>,
      });

      const icon = screen.getByTestId('custom-icon').parentElement;
      expect(icon).toHaveClass(styles.icon);
      expect(icon).toHaveClass(styles['icon-size-big']);
    });
  });

  describe('States', () => {
    test('applies disabled state', () => {
      const wrapper = renderToken({ label: 'Test token', disabled: true });
      expect(wrapper.getElement()).toHaveAttribute('aria-disabled', 'true');
    });

    test('applies readonly state', () => {
      const wrapper = renderToken({ label: 'Test token', readOnly: true });
      expect(wrapper.getElement().querySelector(`.${styles['token-box']}`)).toHaveClass(styles['token-box-readonly']);
    });
  });

  describe('Dismiss button', () => {
    test('renders dismiss button when onDismiss is provided', () => {
      const onDismiss = jest.fn();
      const wrapper = renderToken({ label: 'Test token', onDismiss });
      expect(wrapper.findDismiss()).not.toBeNull();
    });

    test('does not render dismiss button when onDismiss is not provided', () => {
      const wrapper = renderToken({ label: 'Test token' });
      expect(wrapper.findDismiss()).toBeNull();
    });

    test('calls onDismiss when dismiss button is clicked', () => {
      const onDismiss = jest.fn();
      const wrapper = renderToken({ label: 'Test token', onDismiss });
      wrapper.findDismiss()!.click();
      expect(onDismiss).toHaveBeenCalledTimes(1);
    });

    test('does not call onDismiss when disabled', () => {
      const onDismiss = jest.fn();
      const wrapper = renderToken({ label: 'Test token', onDismiss, disabled: true });
      wrapper.findDismiss()!.click();
      expect(onDismiss).not.toHaveBeenCalled();
    });

    test('does not call onDismiss when readOnly', () => {
      const onDismiss = jest.fn();
      const wrapper = renderToken({ label: 'Test token', onDismiss, readOnly: true });
      wrapper.findDismiss()!.click();
      expect(onDismiss).not.toHaveBeenCalled();
    });

    test('sets aria-label on dismiss button when dismissLabel is provided', () => {
      const onDismiss = jest.fn();
      const wrapper = renderToken({ label: 'Test token', onDismiss, dismissLabel: 'Remove token' });
      expect(wrapper.findDismiss()!.getElement()).toHaveAttribute('aria-label', 'Remove token');
    });

    test('sets aria-disabled on dismiss button when token is disabled', () => {
      const onDismiss = jest.fn();
      const wrapper = renderToken({ label: 'Test token', onDismiss, disabled: true });
      expect(wrapper.findDismiss()!.getElement()).toHaveAttribute('aria-disabled', 'true');
    });
  });

  describe('Data attribute for nested popovers', () => {
    test('sets data-token-inline attribute for inline variant', () => {
      const wrapper = renderToken({ label: 'Test token', variant: 'inline' });
      expect(wrapper.getElement()).toHaveAttribute('data-token-inline', 'true');
    });

    test('does not set data-token-inline attribute for normal variant', () => {
      const wrapper = renderToken({ label: 'Test token' });
      expect(wrapper.getElement()).not.toHaveAttribute('data-token-inline');
    });
  });

  describe('Tooltip and overflow behavior', () => {
    test('does not show tooltip for inline token when ellipsis is not active', () => {
      const { container } = render(<Token variant="inline" label="Short label" />);
      const wrapper = createWrapper(container).findToken()!;

      // Mock the condition for ellipsis not being active
      Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
        configurable: true,
        get: function () {
          return 100; // Same width for both content and container
        },
      });

      // Trigger resize observer callback
      act(() => {
        mockResizeCallback([{ target: wrapper.getElement() }]);
      });

      // Hover over the token
      fireEvent.mouseEnter(wrapper.getElement());

      // Check that tooltip is not rendered
      expect(container.querySelector('.token-tooltip')).toBeNull();
    });

    test('tabIndex behavior for different token variants', () => {
      // Test inline token without ellipsis
      const wrapper1 = createWrapper(render(<Token variant="inline" label="Short label" />).container).findToken()!;

      // Mock the condition for ellipsis not being active
      Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
        configurable: true,
        get: function () {
          return 100;
        },
      });

      // Trigger resize observer callback
      act(() => {
        mockResizeCallback([{ target: wrapper1.getElement() }]);
      });

      expect(wrapper1.getElement()).not.toHaveAttribute('tabIndex');

      // Test normal token
      const wrapper2 = createWrapper(render(<Token label="This is a very long label" />).container).findToken()!;
      expect(wrapper2.getElement()).not.toHaveAttribute('tabIndex');
    });
  });

  describe('Token min width classes', () => {
    test('applies correct min width classes for different token configurations', () => {
      // Test with long label, icon, and dismiss button
      const wrapper1 = createWrapper(
        render(
          <Token
            variant="inline"
            label="This is a very long label that exceeds the character limit"
            icon={<span>Icon</span>}
            onDismiss={() => {}}
          />
        ).container
      ).findToken()!;
      expect(wrapper1.getElement()).toHaveClass(styles['token-inline-min-width']);

      // Test with long label and icon only
      const wrapper2 = createWrapper(
        render(
          <Token
            variant="inline"
            label="This is a very long label that exceeds the character limit"
            icon={<span>Icon</span>}
          />
        ).container
      ).findToken()!;
      expect(wrapper2.getElement()).toHaveClass(styles['token-inline-min-width-icon-only']);

      // Test with long label and dismiss only
      const wrapper3 = createWrapper(
        render(
          <Token
            variant="inline"
            label="This is a very long label that exceeds the character limit"
            onDismiss={() => {}}
          />
        ).container
      ).findToken()!;
      expect(wrapper3.getElement()).toHaveClass(styles['token-inline-min-width-dismiss-only']);

      // Test with non-string label
      const wrapper4 = createWrapper(
        render(<Token variant="inline" label={<span>Custom label component</span>} />).container
      ).findToken()!;
      expect(wrapper4.getElement()).toHaveClass(styles['token-inline-min-width']);
    });
  });

  describe('Internal component props', () => {
    test('handles internal props correctly', () => {
      // Test disableInnerPadding prop
      const { container: container1 } = render(<InternalToken label="Test token" disableInnerPadding={true} />);
      expect(container1.querySelector(`.${styles['disable-padding']}`)).not.toBeNull();

      // Test disableTooltip prop
      const { container: container2 } = render(
        <InternalToken
          variant="inline"
          label="This is a very long label that should trigger ellipsis in an inline token"
          disableTooltip={true}
        />
      );
      const wrapper = createWrapper(container2).findToken()!;

      // Mock the condition for ellipsis being active
      Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
        configurable: true,
        get: function () {
          if (this.classList.contains('option-label')) {
            return 200;
          }
          return 100;
        },
      });

      // Trigger resize observer callback
      act(() => {
        mockResizeCallback([{ target: wrapper.getElement() }]);
      });

      // Hover over the token
      fireEvent.mouseEnter(wrapper.getElement());
      expect(container2.querySelector('.token-tooltip')).toBeNull();

      // Test custom role prop
      const { container: container3 } = render(<InternalToken label="Test token" role="option" />);
      const wrapper3 = createWrapper(container3).findToken()!;
      expect(wrapper3.getElement()).toHaveAttribute('role', 'option');
    });
  });
});
