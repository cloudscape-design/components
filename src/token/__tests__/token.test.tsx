// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render, screen } from '@testing-library/react';

import Icon from '../../../lib/components/icon/internal';
import createWrapper from '../../../lib/components/test-utils/dom';
import Token, { TokenProps } from '../../../lib/components/token';
import InternalToken from '../../../lib/components/token/internal';

import styles from '../../../lib/components/token/styles.selectors.js';

function renderToken(props: TokenProps) {
  const renderResult = render(<Token {...props} />);
  return createWrapper(renderResult.container).findToken()!;
}

describe('Token', () => {
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
        icon: <Icon name="settings" data-testid="custom-icon" />,
        dismissLabel: 'Dismiss',
        onDismiss,
      });

      expect(wrapper.findLabel()!.getElement()).toHaveTextContent('Test token');
      expect(wrapper.findLabelTag()!.getElement()).toHaveTextContent('Tag');
      expect(wrapper.findDescription()!.getElement()).toHaveTextContent('Description');
      expect(wrapper.findTags()).toHaveLength(2);
      expect(wrapper.findTags()![0].getElement()).toHaveTextContent('Tag1');
      expect(wrapper.findTags()![1].getElement()).toHaveTextContent('Tag2');
      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
      expect(wrapper.findDismiss()!.getElement()).toHaveAttribute('aria-label', 'Dismiss');
    });

    test('renders with ReactNode label', () => {
      renderToken({
        label: <div data-testid="custom-label">Custom label</div>,
      });
      expect(screen.getByTestId('custom-label')).toBeInTheDocument();
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

    test('applies correct CSS classes for inline variant', () => {
      const inlineWrapper = renderToken({ label: 'Test token', variant: 'inline' });
      expect(inlineWrapper.getElement()).toHaveClass(styles['token-inline']);

      const normalWrapper = renderToken({ label: 'Test token' });
      expect(normalWrapper.getElement()).toHaveClass(styles['token-normal']);
    });
  });

  describe('States', () => {
    test('applies disabled state', () => {
      const wrapper = renderToken({ label: 'Test token', disabled: true });
      expect(wrapper.getElement().querySelector(`.${styles['token-box']}`)).toHaveClass(styles['token-box-disabled']);
      expect(wrapper.getElement()).toHaveAttribute('aria-disabled', 'true');
    });

    test('applies readonly state', () => {
      const wrapper = renderToken({ label: 'Test token', readOnly: true });
      expect(wrapper.getElement().querySelector(`.${styles['token-box']}`)).toHaveClass(styles['token-box-readonly']);
    });
  });

  describe('Dismiss button', () => {
    test('renders when onDismiss is provided', () => {
      const onDismiss = jest.fn();
      const wrapper = renderToken({ label: 'Test token', onDismiss });
      expect(wrapper.findDismiss()).toBeTruthy();
    });

    test('does not render when onDismiss is not provided', () => {
      const wrapper = renderToken({ label: 'Test token' });
      expect(wrapper.findDismiss()).toBeNull();
    });

    test('calls onDismiss when clicked', () => {
      const onDismiss = jest.fn();
      const wrapper = renderToken({ label: 'Test token', onDismiss });
      wrapper.findDismiss()!.click();
      expect(onDismiss).toHaveBeenCalledTimes(1);
    });

    test('shows for inline readonly tokens', () => {
      const onDismiss = jest.fn();
      const wrapper = renderToken({
        label: 'Test token',
        variant: 'inline',
        onDismiss,
        readOnly: true,
      });
      expect(wrapper.findDismiss()).toBeTruthy();
    });

    test('sets accessibility attributes', () => {
      const onDismiss = jest.fn();
      const wrapper = renderToken({
        label: 'Test token',
        onDismiss,
        dismissLabel: 'Remove token',
      });

      const dismissButton = wrapper.findDismiss()!.getElement();
      expect(dismissButton).toHaveAttribute('aria-label', 'Remove token');
    });
  });

  describe('Icons', () => {
    test('renders icon with correct styling for normal variant', () => {
      renderToken({
        label: 'Test token',
        icon: <Icon name="settings" data-testid="normal-icon" />,
      });
      const normalIcon = screen.getByTestId('normal-icon').parentElement;
      expect(normalIcon).toHaveClass(styles.icon);
      expect(normalIcon).not.toHaveClass(styles['icon-inline']);
    });

    test('renders icon with correct styling for inline variant', () => {
      renderToken({
        label: 'Test token',
        variant: 'inline',
        icon: <Icon name="edit" size="small" data-testid="inline-icon" />,
      });
      const inlineIcon = screen.getByTestId('inline-icon').parentElement;
      expect(inlineIcon).toHaveClass(styles.icon);
      expect(inlineIcon).toHaveClass(styles['icon-inline']);
    });
  });

  describe('Error handling for inline variants', () => {
    test('React elements trigger a dev warning', () => {
      // Mock console.warn to capture the warning
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

      // Positive case: React element with inline variant should trigger warning
      renderToken({
        variant: 'inline',
        label: <span data-testid="react-element">React element</span>,
      });

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          '[AwsUi] [Label] Only plain text (strings or numbers) are supported when variant="inline"'
        )
      );

      consoleSpy.mockRestore();
    });

    test('strings do not throw a dev warning', () => {
      // Mock console.warn to capture any warnings
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

      // Negative case: string with inline variant should not trigger warning
      renderToken({
        variant: 'inline',
        label: 'String label',
      });

      expect(consoleSpy).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe('Accessibility', () => {
    test('applies default group role and aria attributes', () => {
      const wrapper = renderToken({ label: 'Test token' });
      expect(wrapper.getElement()).toHaveAttribute('role', 'group');
      expect(wrapper.getElement()).toHaveAttribute('aria-disabled', 'false');
      expect(wrapper.getElement()).toHaveAttribute('aria-labelledby');
    });

    test('allows custom role override', () => {
      const { container } = render(<InternalToken label="Test token" role="menuitem" />);
      const wrapper = createWrapper(container).findToken()!;
      expect(wrapper.getElement()).toHaveAttribute('role', 'menuitem');
    });

    test('aria-labelledby matches label element ID', () => {
      const wrapper = renderToken({ label: 'Test token' });
      const tokenElement = wrapper.getElement();
      const labelElement = wrapper.findLabel().getElement();

      const ariaLabelledby = tokenElement.getAttribute('aria-labelledby');
      const labelId = labelElement.getAttribute('id');

      expect(ariaLabelledby).toBe(labelId);
      expect(ariaLabelledby).toBeTruthy();
    });

    test('uses ariaLabel when provided instead of aria-labelledby', () => {
      const wrapper = renderToken({
        label: 'Test token',
        ariaLabel: 'Custom aria label',
      });
      const tokenElement = wrapper.getElement();

      expect(tokenElement).toHaveAttribute('aria-label', 'Custom aria label');
      expect(tokenElement).not.toHaveAttribute('aria-labelledby');
    });
  });
});
