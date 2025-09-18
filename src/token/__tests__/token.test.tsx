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

    test('sets data-token-inline attribute for inline variant only', () => {
      const inlineWrapper = renderToken({ label: 'Test token', variant: 'inline' });
      expect(inlineWrapper.getElement()).toHaveAttribute('data-token-inline', 'true');

      const normalWrapper = renderToken({ label: 'Test token' });
      expect(normalWrapper.getElement()).not.toHaveAttribute('data-token-inline');
    });
  });

  describe('State styles', () => {
    test('applies disabled state correctly', () => {
      const wrapper = renderToken({ label: 'Test token', disabled: true });

      expect(wrapper.getElement().querySelector(`.${styles['token-box']}`)).toHaveClass(styles['token-box-disabled']);
    });

    test('applies readonly state correctly', () => {
      const wrapper = renderToken({ label: 'Test token', readOnly: true });
      expect(wrapper.getElement().querySelector(`.${styles['token-box']}`)).toHaveClass(styles['token-box-readonly']);
    });

    test('applies both disabled and readonly states', () => {
      const wrapper = renderToken({ label: 'Test token', disabled: true, readOnly: true });
      const tokenBox = wrapper.getElement().querySelector(`.${styles['token-box']}`);
      expect(tokenBox).toHaveClass(styles['token-box-disabled']);
      expect(tokenBox).toHaveClass(styles['token-box-readonly']);
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

    test('does not call onDismiss when disabled or readOnly', () => {
      const onDismiss = jest.fn();

      const disabledWrapper = renderToken({ label: 'Test token', onDismiss, disabled: true });
      disabledWrapper.findDismiss()!.click();

      const readOnlyWrapper = renderToken({ label: 'Test token', onDismiss, readOnly: true });
      readOnlyWrapper.findDismiss()!.click();

      expect(onDismiss).not.toHaveBeenCalled();
    });

    test('sets correct accessibility attributes', () => {
      const onDismiss = jest.fn();
      const wrapper = renderToken({
        label: 'Test token',
        onDismiss,
        dismissLabel: 'Remove token',
        disabled: true,
      });

      const dismissButton = wrapper.findDismiss()!.getElement();
      expect(dismissButton).toHaveAttribute('aria-label', 'Remove token');
      expect(dismissButton).toHaveAttribute('aria-disabled', 'true');
    });
  });

  describe('Min width classes for inline variant', () => {
    const longLabel = 'This is a very long label that exceeds the character limit';

    test('applies min-width class with icon and dismiss button', () => {
      const wrapper = renderToken({
        variant: 'inline',
        label: longLabel,
        icon: <Icon name="edit" size="small" />,
        onDismiss: () => {},
      });
      expect(wrapper.getElement()).toHaveClass(styles['token-inline-min-width']);
    });

    test('applies min-width-icon-only class with icon only', () => {
      const wrapper = renderToken({
        variant: 'inline',
        label: longLabel,
        icon: <Icon name="settings" size="small" />,
      });
      expect(wrapper.getElement()).toHaveClass(styles['token-inline-min-width-icon-only']);
    });

    test('applies min-width-dismiss-only class with dismiss button only', () => {
      const wrapper = renderToken({
        variant: 'inline',
        label: longLabel,
        onDismiss: () => {},
      });
      expect(wrapper.getElement()).toHaveClass(styles['token-inline-min-width-dismiss-only']);
    });

    test('applies min-width-label-only class with label only', () => {
      const wrapper = renderToken({
        variant: 'inline',
        label: longLabel,
      });
      expect(wrapper.getElement()).toHaveClass(styles['token-inline-min-width-label-only']);
    });

    test('does not apply min-width class for short labels', () => {
      const wrapper = renderToken({
        variant: 'inline',
        label: 'Short',
      });
      expect(wrapper.getElement()).not.toHaveClass(styles['token-inline-min-width']);
      expect(wrapper.getElement()).not.toHaveClass(styles['token-inline-min-width-label-only']);
    });

    test('handles number labels correctly', () => {
      // Short number - should not get min-width class
      const shortNumberWrapper = renderToken({
        variant: 'inline',
        label: 42,
      });
      expect(shortNumberWrapper.getElement()).not.toHaveClass(styles['token-inline-min-width-label-only']);

      // Long number - should get min-width class
      const longNumber = 123456789012345; // 15 digits, meets character limit
      const longNumberWrapper = renderToken({
        variant: 'inline',
        label: longNumber,
      });
      expect(longNumberWrapper.getElement()).toHaveClass(styles['token-inline-min-width-label-only']);
    });

    test('handles array labels correctly', () => {
      // Short array content - should not get min-width class
      const shortArrayWrapper = renderToken({
        variant: 'inline',
        label: ['Short', ' text'],
      });
      expect(shortArrayWrapper.getElement()).not.toHaveClass(styles['token-inline-min-width-label-only']);

      // Long array content - should get min-width class
      const longArrayWrapper = renderToken({
        variant: 'inline',
        label: ['This is a very', ' long array', ' that exceeds limit'],
      });
      expect(longArrayWrapper.getElement()).toHaveClass(styles['token-inline-min-width-label-only']);

      // Mixed array with React elements and strings
      const mixedArrayWrapper = renderToken({
        variant: 'inline',
        label: ['Mixed content with', <span key="1">React elements</span>, ' and strings'],
      });
      expect(mixedArrayWrapper.getElement()).toHaveClass(styles['token-inline-min-width-label-only']);

      // Array with empty/null elements
      const sparseArrayWrapper = renderToken({
        variant: 'inline',
        label: ['Valid text', null, undefined, '', 'more valid text that makes it long enough'],
      });
      expect(sparseArrayWrapper.getElement()).toHaveClass(styles['token-inline-min-width-label-only']);
    });

    test('applies base min-width class for labels with no text content', () => {
      // Empty string
      const emptyWrapper = renderToken({
        variant: 'inline',
        label: '',
      });
      expect(emptyWrapper.getElement()).toHaveClass(styles['token-inline-min-width']);

      // Whitespace-only string
      const whitespaceWrapper = renderToken({
        variant: 'inline',
        label: '   ',
      });
      expect(whitespaceWrapper.getElement()).toHaveClass(styles['token-inline-min-width']);

      // ReactNode with no text content
      const emptyReactWrapper = renderToken({
        variant: 'inline',
        label: <div></div>,
      });
      expect(emptyReactWrapper.getElement()).toHaveClass(styles['token-inline-min-width']);

      // Icon (no text content)
      const iconWrapper = renderToken({
        variant: 'inline',
        label: <Icon name="bug" />,
      });
      expect(iconWrapper.getElement()).toHaveClass(styles['token-inline-min-width']);

      // Empty array
      const emptyArrayWrapper = renderToken({
        variant: 'inline',
        label: [],
      });
      expect(emptyArrayWrapper.getElement()).toHaveClass(styles['token-inline-min-width']);

      // Array with only empty/null elements
      const nullArrayWrapper = renderToken({
        variant: 'inline',
        label: [null, undefined, '', '   '],
      });
      expect(nullArrayWrapper.getElement()).toHaveClass(styles['token-inline-min-width']);
    });

    test('handles ReactNode text content correctly', () => {
      const wrapper = renderToken({
        variant: 'inline',
        label: <div>Custom label component</div>,
      });
      expect(wrapper.getElement()).toHaveClass(styles['token-inline-min-width-label-only']);
    });
  });

  describe('Icon rendering', () => {
    test('renders icons with correct styling for normal variant', () => {
      renderToken({
        label: 'Test token',
        icon: <Icon name="settings" data-testid="normal-icon" />,
      });
      const normalIcon = screen.getByTestId('normal-icon').parentElement;
      expect(normalIcon).toHaveClass(styles.icon);
      expect(normalIcon).not.toHaveClass(styles['icon-inline']);
    });

    test('renders icons with correct styling for inline variant', () => {
      renderToken({
        label: 'Test token',
        variant: 'inline',
        icon: <Icon name="edit" size="small" data-testid="inline-icon" />,
      });
      const inlineIcon = screen.getByTestId('inline-icon').parentElement;
      expect(inlineIcon).toHaveClass(styles.icon);
      expect(inlineIcon).toHaveClass(styles['icon-inline']);
    });

    test('applies icon-size-big class when token has description', () => {
      renderToken({
        label: 'Test token',
        description: 'Description',
        icon: <Icon name="bug" size="big" data-testid="big-icon" />,
      });
      const bigIcon = screen.getByTestId('big-icon').parentElement;
      expect(bigIcon).toHaveClass(styles.icon);
      expect(bigIcon).toHaveClass(styles['icon-size-big']);
    });

    test('applies icon-size-big class when token has tags', () => {
      renderToken({
        label: 'Test token',
        tags: ['tag1', 'tag2'],
        icon: <Icon name="status-positive" size="big" data-testid="tagged-icon" />,
      });
      const taggedIcon = screen.getByTestId('tagged-icon').parentElement;
      expect(taggedIcon).toHaveClass(styles.icon);
      expect(taggedIcon).toHaveClass(styles['icon-size-big']);
    });

    test('does not apply icon-size-big class for simple tokens', () => {
      renderToken({
        label: 'Test token',
        icon: <Icon name="close" data-testid="simple-icon" />,
      });
      const simpleIcon = screen.getByTestId('simple-icon').parentElement;
      expect(simpleIcon).toHaveClass(styles.icon);
      expect(simpleIcon).not.toHaveClass(styles['icon-size-big']);
    });
  });

  describe('Box styling', () => {
    test('applies correct box classes based on dismiss button presence', () => {
      // Without dismiss button
      const withoutDismiss = renderToken({ label: 'Test token' });
      expect(withoutDismiss.getElement().querySelector(`.${styles['token-box']}`)).toHaveClass(
        styles['token-box-without-dismiss']
      );

      // With dismiss button
      const withDismiss = renderToken({ label: 'Test token', onDismiss: () => {} });
      expect(withDismiss.getElement().querySelector(`.${styles['token-box']}`)).not.toHaveClass(
        styles['token-box-without-dismiss']
      );
    });
  });

  describe('Accessibility', () => {
    test('applies aria-disabled based on disabled prop', () => {
      const disabledWrapper = renderToken({ label: 'Test token', disabled: true });
      expect(disabledWrapper.getElement()).toHaveAttribute('aria-disabled', 'true');

      const enabledWrapper = renderToken({ label: 'Test token', disabled: false });
      expect(enabledWrapper.getElement()).toHaveAttribute('aria-disabled', 'false');
    });

    test('applies default group role', () => {
      const wrapper = renderToken({ label: 'Test token' });
      expect(wrapper.getElement()).toHaveAttribute('role', 'group');

      // Test with different states - should all have group role
      const disabledWrapper = renderToken({ label: 'Test token', disabled: true });
      expect(disabledWrapper.getElement()).toHaveAttribute('role', 'group');

      const inlineWrapper = renderToken({ label: 'Test token', variant: 'inline' });
      expect(inlineWrapper.getElement()).toHaveAttribute('role', 'group');
    });

    test('allows custom role override', () => {
      const { container } = render(<InternalToken label="Test token" role="menuitem" />);
      const wrapper = createWrapper(container).findToken()!;
      expect(wrapper.getElement()).toHaveAttribute('role', 'menuitem');
    });

    test('applies aria-labelledby with unique ID', () => {
      const wrapper1 = renderToken({ label: 'First token' });
      const wrapper2 = renderToken({ label: 'Second token' });

      const element1 = wrapper1.getElement();
      const element2 = wrapper2.getElement();

      // Both tokens should have aria-labelledby
      expect(element1).toHaveAttribute('aria-labelledby');
      expect(element2).toHaveAttribute('aria-labelledby');

      // IDs should be unique
      const labelledby1 = element1.getAttribute('aria-labelledby');
      const labelledby2 = element2.getAttribute('aria-labelledby');
      expect(labelledby1).not.toBe(labelledby2);
      expect(labelledby1).toBeTruthy();
      expect(labelledby2).toBeTruthy();
    });

    test('aria-labelledby ID matches label element ID', () => {
      const wrapper = renderToken({ label: 'Test token' });
      const tokenElement = wrapper.getElement();
      const labelElement = wrapper.findLabel().getElement();

      const ariaLabelledby = tokenElement.getAttribute('aria-labelledby');
      const labelId = labelElement.getAttribute('id');

      expect(ariaLabelledby).toBe(labelId);
      expect(ariaLabelledby).toBeTruthy();
    });

    test('dismiss button accessibility attributes', () => {
      const onDismiss = jest.fn();

      // With dismiss label
      const labeledWrapper = renderToken({
        label: 'Test token',
        onDismiss,
        dismissLabel: 'Remove this token',
      });
      const labeledButton = labeledWrapper.findDismiss()!.getElement();
      expect(labeledButton).toHaveAttribute('type', 'button');
      expect(labeledButton).toHaveAttribute('aria-label', 'Remove this token');
      expect(labeledButton).not.toHaveAttribute('aria-disabled');

      // Disabled state
      const disabledWrapper = renderToken({
        label: 'Test token',
        onDismiss,
        disabled: true,
      });
      const disabledButton = disabledWrapper.findDismiss()!.getElement();
      expect(disabledButton).toHaveAttribute('aria-disabled', 'true');

      // ReadOnly state
      const readOnlyWrapper = renderToken({
        label: 'Test token',
        onDismiss,
        readOnly: true,
      });
      const readOnlyButton = readOnlyWrapper.findDismiss()!.getElement();
      expect(readOnlyButton).toHaveAttribute('aria-disabled', 'true');
    });
  });
});
