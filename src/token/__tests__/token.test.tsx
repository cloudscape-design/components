// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render, screen } from '@testing-library/react';

import createWrapper from '../../../lib/components/test-utils/dom';
import Token, { TokenProps } from '../../../lib/components/token';

import styles from '../../../lib/components/token/styles.css.js';

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

  describe('Token min width classes', () => {
    const longLabel = 'This is a very long label that exceeds the character limit';
    test('applies token-inline-min-width class with long label, icon, and dismiss button', () => {
      const wrapper = renderToken({
        variant: 'inline',
        label: longLabel,
        icon: <span>Icon</span>,
        onDismiss: () => {},
      });
      expect(wrapper.getElement()).toHaveClass(styles['token-inline-min-width']);
    });

    test('applies token-inline-min-width-icon-only class with long label and icon', () => {
      const wrapper = renderToken({
        variant: 'inline',
        label: longLabel,
        icon: <span>Icon</span>,
      });
      expect(wrapper.getElement()).toHaveClass(styles['token-inline-min-width-icon-only']);
    });

    test('applies token-inline-min-width-dismiss-only class with long label and dismiss button', () => {
      const wrapper = renderToken({
        variant: 'inline',
        label: longLabel,
        onDismiss: () => {},
      });
      expect(wrapper.getElement()).toHaveClass(styles['token-inline-min-width-dismiss-only']);
    });

    test('applies token-inline-min-width-label-only class with only long label', () => {
      const wrapper = renderToken({
        variant: 'inline',
        label: longLabel,
      });
      expect(wrapper.getElement()).toHaveClass(styles['token-inline-min-width-label-only']);
    });

    test('applies token-inline-min-width class with non-string label', () => {
      const wrapper = renderToken({
        variant: 'inline',
        label: <span>Custom label component</span>,
      });
      expect(wrapper.getElement()).toHaveClass(styles['token-inline-min-width']);
    });
  });
});
