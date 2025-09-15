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
    test('applies aria-disabled attribute correctly', () => {
      // String label without dismiss button - NO aria-disabled (missing onDismiss)
      const stringWrapper = renderToken({ label: 'Test token', disabled: true });
      expect(stringWrapper.getElement()).not.toHaveAttribute('aria-disabled');

      // String label with dismiss button - NO aria-disabled (not a JSX element)
      const stringDismissWrapper = renderToken({
        label: 'Test token',
        disabled: true,
        onDismiss: () => {},
      });
      expect(stringDismissWrapper.getElement()).not.toHaveAttribute('aria-disabled');

      // Empty string label with dismiss button - NO aria-disabled (not a JSX element)
      const emptyStringWrapper = renderToken({
        label: '',
        disabled: true,
        onDismiss: () => {},
      });
      expect(emptyStringWrapper.getElement()).not.toHaveAttribute('aria-disabled');

      // Number label with dismiss button - NO aria-disabled (not a JSX element)
      const numberWrapper = renderToken({
        label: 42,
        disabled: true,
        onDismiss: () => {},
      });
      expect(numberWrapper.getElement()).not.toHaveAttribute('aria-disabled');

      // ReactNode label without dismiss button - NO aria-disabled (missing onDismiss)
      const reactWrapper = renderToken({
        label: <div>Custom label</div>,
        disabled: true,
      });
      expect(reactWrapper.getElement()).not.toHaveAttribute('aria-disabled');

      // ReactNode label with dismiss button - gets aria-disabled (JSX element)
      const reactDismissWrapper = renderToken({
        label: <div>Custom label</div>,
        disabled: false,
        onDismiss: () => {},
      });
      expect(reactDismissWrapper.getElement()).toHaveAttribute('aria-disabled', 'false');

      // Normal variant with readOnly and dismiss button - gets aria-disabled (readOnly doesn't affect normal variant)
      const normalReadOnlyWrapper = renderToken({
        label: <div>Custom label</div>,
        disabled: true,
        readOnly: true,
        onDismiss: () => {},
      });
      expect(normalReadOnlyWrapper.getElement()).toHaveAttribute('aria-disabled', 'true');

      // Inline variant with readOnly and dismiss button - NO aria-disabled (readOnly hides dismiss in inline)
      const inlineReadOnlyWrapper = renderToken({
        variant: 'inline',
        label: <div>Custom label</div>,
        disabled: true,
        readOnly: true,
        onDismiss: () => {},
      });
      expect(inlineReadOnlyWrapper.getElement()).not.toHaveAttribute('aria-disabled');

      // ReactNode with no text content but dismiss button - gets aria-disabled (JSX element)
      const emptyReactWrapper = renderToken({
        label: <div></div>,
        disabled: true,
        onDismiss: () => {},
      });
      expect(emptyReactWrapper.getElement()).toHaveAttribute('aria-disabled', 'true');

      // Icon label with dismiss button - gets aria-disabled (JSX element)
      const iconWrapper = renderToken({
        label: <Icon name="bug" />,
        disabled: true,
        onDismiss: () => {},
      });
      expect(iconWrapper.getElement()).toHaveAttribute('aria-disabled', 'true');
    });

    test('applies role attribute correctly', () => {
      // String label without dismiss button - NO role (missing onDismiss)
      const { container: publicContainer } = render(<Token label="Test token" />);
      const publicWrapper = createWrapper(publicContainer).findToken()!;
      expect(publicWrapper.getElement()).not.toHaveAttribute('role');

      // String label with dismiss button - NO role (not a JSX element)
      const { container: dismissContainer } = render(<Token label="Test token" onDismiss={() => {}} />);
      const dismissWrapper = createWrapper(dismissContainer).findToken()!;
      expect(dismissWrapper.getElement()).not.toHaveAttribute('role');

      // ReactNode label with dismiss button - gets default "group" role (JSX element)
      const { container: reactContainer } = render(<Token label={<div>Custom label</div>} onDismiss={() => {}} />);
      const reactWrapper = createWrapper(reactContainer).findToken()!;
      expect(reactWrapper.getElement()).toHaveAttribute('role', 'group');

      // Normal variant with readOnly and dismiss button - gets role (readOnly doesn't affect normal variant)
      const { container: normalReadOnlyContainer } = render(
        <Token label={<div>Custom label</div>} onDismiss={() => {}} readOnly={true} />
      );
      const normalReadOnlyWrapper = createWrapper(normalReadOnlyContainer).findToken()!;
      expect(normalReadOnlyWrapper.getElement()).toHaveAttribute('role', 'group');

      // Inline variant with readOnly and dismiss button - NO role (readOnly hides dismiss in inline)
      const { container: inlineReadOnlyContainer } = render(
        <Token variant="inline" label={<div>Custom label</div>} onDismiss={() => {}} readOnly={true} />
      );
      const inlineReadOnlyWrapper = createWrapper(inlineReadOnlyContainer).findToken()!;
      expect(inlineReadOnlyWrapper.getElement()).not.toHaveAttribute('role');

      // Empty string with dismiss button - NO role (not a JSX element)
      const { container: noTextContainer } = render(<Token label="" onDismiss={() => {}} />);
      const noTextWrapper = createWrapper(noTextContainer).findToken()!;
      expect(noTextWrapper.getElement()).not.toHaveAttribute('role');

      // InternalToken with custom role - should override default logic
      const { container: customRoleContainer } = render(<InternalToken label="Test token" role="menuitem" />);
      const customRoleWrapper = createWrapper(customRoleContainer).findToken()!;
      expect(customRoleWrapper.getElement()).toHaveAttribute('role', 'menuitem');

      // InternalToken with custom role and dismiss button - custom role takes precedence
      const { container: customRoleWithDismissContainer } = render(
        <InternalToken label="Test token" role="menuitem" onDismiss={() => {}} />
      );
      const customRoleWithDismissWrapper = createWrapper(customRoleWithDismissContainer).findToken()!;
      expect(customRoleWithDismissWrapper.getElement()).toHaveAttribute('role', 'menuitem');
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

      // Without dismiss label
      const unlabeledWrapper = renderToken({
        label: 'Test token',
        onDismiss,
      });
      const unlabeledButton = unlabeledWrapper.findDismiss()!.getElement();
      expect(unlabeledButton).toHaveAttribute('type', 'button');
      expect(unlabeledButton).not.toHaveAttribute('aria-label');

      // Disabled state
      const disabledWrapper = renderToken({
        label: 'Test token',
        onDismiss,
        dismissLabel: 'Remove token',
        disabled: true,
      });
      const disabledButton = disabledWrapper.findDismiss()!.getElement();
      expect(disabledButton).toHaveAttribute('aria-disabled', 'true');

      // ReadOnly state
      const readOnlyWrapper = renderToken({
        label: 'Test token',
        onDismiss,
        dismissLabel: 'Remove token',
        readOnly: true,
      });
      const readOnlyButton = readOnlyWrapper.findDismiss()!.getElement();
      expect(readOnlyButton).toHaveAttribute('aria-disabled', 'true');
    });

    test('aria-disabled works correctly across different variants with new logic', () => {
      // Inline variant with string label and dismiss - NO aria-disabled (not a JSX element)
      const inlineStringWrapper = renderToken({
        variant: 'inline',
        label: 'Test token',
        disabled: true,
        onDismiss: () => {},
      });
      expect(inlineStringWrapper.getElement()).not.toHaveAttribute('aria-disabled');

      // Normal variant with string label and dismiss - NO aria-disabled (not a JSX element)
      const normalStringWrapper = renderToken({
        variant: 'normal',
        label: 'Test token',
        disabled: true,
        onDismiss: () => {},
      });
      expect(normalStringWrapper.getElement()).not.toHaveAttribute('aria-disabled');

      // ReactNode label without dismiss - NO aria-disabled (missing onDismiss)
      const nodeWrapper = renderToken({
        label: <div>Custom label</div>,
        disabled: true,
      });
      expect(nodeWrapper.getElement()).not.toHaveAttribute('aria-disabled');

      // ReactNode label with dismiss - gets aria-disabled (JSX element with onDismiss)
      const nodeWithDismissWrapper = renderToken({
        label: <Icon name="bug" />,
        disabled: true,
        onDismiss: () => {},
      });
      expect(nodeWithDismissWrapper.getElement()).toHaveAttribute('aria-disabled', 'true');

      // Inline variant with ReactNode and dismiss but readOnly - NO aria-disabled (readOnly hides dismiss in inline)
      const inlineReadOnlyWrapper = renderToken({
        variant: 'inline',
        label: <div>Custom label</div>,
        disabled: true,
        readOnly: true,
        onDismiss: () => {},
      });
      expect(inlineReadOnlyWrapper.getElement()).not.toHaveAttribute('aria-disabled');

      // Normal variant with ReactNode and dismiss and readOnly - gets aria-disabled (readOnly doesn't affect normal variant)
      const normalReadOnlyWrapper = renderToken({
        variant: 'normal',
        label: <div>Custom label</div>,
        disabled: false,
        readOnly: true,
        onDismiss: () => {},
      });
      expect(normalReadOnlyWrapper.getElement()).toHaveAttribute('aria-disabled', 'false');
    });

    test('label type affects aria-disabled and role attributes with new logic', () => {
      // String with meaningful text - NO aria-disabled (not a JSX element)
      const stringWrapper = renderToken({
        label: 'Meaningful text',
        disabled: true,
        onDismiss: () => {},
      });
      expect(stringWrapper.getElement()).not.toHaveAttribute('aria-disabled');
      expect(stringWrapper.getElement()).not.toHaveAttribute('role');

      // Number label - NO aria-disabled (not a JSX element)
      const numberWrapper = renderToken({
        label: 42,
        disabled: true,
        onDismiss: () => {},
      });
      expect(numberWrapper.getElement()).not.toHaveAttribute('aria-disabled');
      expect(numberWrapper.getElement()).not.toHaveAttribute('role');

      // ReactNode with nested text content - gets aria-disabled (JSX element)
      const nestedTextWrapper = renderToken({
        label: (
          <div>
            <span>Nested</span> text content
          </div>
        ),
        disabled: true,
        onDismiss: () => {},
      });
      expect(nestedTextWrapper.getElement()).toHaveAttribute('aria-disabled', 'true');
      expect(nestedTextWrapper.getElement()).toHaveAttribute('role', 'group');

      // Array of mixed content - NO aria-disabled (not a JSX element)
      const arrayWrapper = renderToken({
        label: ['Text', <span key="1">More text</span>, 123],
        disabled: true,
        onDismiss: () => {},
      });
      expect(arrayWrapper.getElement()).not.toHaveAttribute('aria-disabled');
      expect(arrayWrapper.getElement()).not.toHaveAttribute('role');

      // ReactNode with only whitespace - gets aria-disabled (JSX element)
      const whitespaceNodeWrapper = renderToken({
        label: <div> </div>,
        disabled: true,
        onDismiss: () => {},
      });
      expect(whitespaceNodeWrapper.getElement()).toHaveAttribute('aria-disabled', 'true');
      expect(whitespaceNodeWrapper.getElement()).toHaveAttribute('role', 'group');

      // ReactNode with only non-text elements (Icon) - gets aria-disabled (JSX element)
      const iconOnlyWrapper = renderToken({
        label: <Icon name="settings" />,
        disabled: true,
        onDismiss: () => {},
      });
      expect(iconOnlyWrapper.getElement()).toHaveAttribute('aria-disabled', 'true');
      expect(iconOnlyWrapper.getElement()).toHaveAttribute('role', 'group');

      // Empty array - NO aria-disabled (not a JSX element)
      const emptyArrayWrapper = renderToken({
        label: [],
        disabled: true,
        onDismiss: () => {},
      });
      expect(emptyArrayWrapper.getElement()).not.toHaveAttribute('aria-disabled');
      expect(emptyArrayWrapper.getElement()).not.toHaveAttribute('role');

      // Null/undefined label - NO aria-disabled (not a JSX element)
      const nullWrapper = renderToken({
        label: null as any,
        disabled: true,
        onDismiss: () => {},
      });
      expect(nullWrapper.getElement()).not.toHaveAttribute('aria-disabled');
      expect(nullWrapper.getElement()).not.toHaveAttribute('role');
    });
  });
});
