// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { render } from '@testing-library/react';
import React from 'react';
import Avatar, { AvatarProps } from '../../../lib/components/avatar';
import createWrapper from '../../../lib/components/test-utils/dom';
import loadingDotsStyles from '../../../lib/components/avatar/loading-dots/styles.selectors.js';

// screenshot test scenarios
// renders a user avatar
// renders a default gen-ai avatar
// renders gen-ai avatar with a different existing icon
// renders gen-ai avatar with custom icon SVG
// renders gen-ai avatar with custom icon URL
// renders gen-ai avatar in loading state

function renderAvatar(props: AvatarProps) {
  const { container } = render(<Avatar {...props} />);

  return createWrapper(container).findAvatar()!;
}

describe('Avatar component', () => {
  describe('Default', () => {
    (['gen-ai', 'user'] as AvatarProps.Type[]).forEach(type => {
      test(`renders ${type} avatar`, () => {
        const wrapper = renderAvatar({ type });
        const avatarBody = wrapper.findAvatarBody()?.getElement();
        expect(avatarBody).toBeInTheDocument();

        avatarBody?.focus();
        expect(wrapper.findTooltip()?.getElement()).toBeUndefined();
      });

      test(`renders a ${type} avatar with fullName`, () => {
        const fullName = 'Jane Doe';
        const wrapper = renderAvatar({ type, fullName });
        const avatarBody = wrapper.findAvatarBody()?.getElement();

        avatarBody?.focus();
        expect(wrapper.findTooltip()?.getElement()).toHaveTextContent(fullName);

        avatarBody?.blur();
        expect(wrapper.findTooltip()?.getElement()).toBeUndefined();
      });
    });

    test('renders user avatar with initials', () => {
      const initials = 'JD';
      const wrapper = renderAvatar({ type: 'user', initials });
      const avatarBody = wrapper.findAvatarBody()?.getElement();

      expect(avatarBody).toHaveTextContent(initials);
    });
  });

  describe('Loading state', () => {
    test('renders gen-ai avatar in loading state', () => {
      const wrapper = renderAvatar({ type: 'gen-ai', loading: true });

      const loading = wrapper.findByClassName(loadingDotsStyles.root)?.getElement();
      expect(loading).toBeInTheDocument();
    });

    test('does not render user avatar in loading state', () => {
      const wrapper = renderAvatar({ type: 'user', loading: true, loadingText: 'Loading' });

      const loading = wrapper.findByClassName(loadingDotsStyles.root)?.getElement();
      expect(loading).toBeUndefined();

      const avatarBody = wrapper.findAvatarBody()?.getElement();
      avatarBody?.focus();
      expect(wrapper.findTooltip()?.getElement()).toBeUndefined();
    });

    test('shows loadingText in tooltip when loading', () => {
      const loadingText = 'Generating response';
      const wrapper = renderAvatar({ type: 'gen-ai', loading: true, loadingText });

      const avatarBody = wrapper.findAvatarBody()?.getElement();
      avatarBody?.focus();
      expect(wrapper.findTooltip()?.getElement()).toHaveTextContent(loadingText);
      avatarBody?.blur();
      expect(wrapper.findTooltip()?.getElement()).toBeUndefined();
    });

    test('loadingText takes precedence over fullName when loading', () => {
      const loadingText = 'Generating response';
      const fullName = 'Gen AI assistant';
      const wrapper = renderAvatar({ type: 'gen-ai', loading: true, loadingText, fullName });

      const avatarBody = wrapper.findAvatarBody()?.getElement();
      avatarBody?.focus();
      expect(wrapper.findTooltip()?.getElement()).toHaveTextContent(loadingText);
    });

    test('fullName takes precedence over loadingText when not loading', () => {
      const loadingText = 'Generating response';
      const fullName = 'Gen AI assistant';
      const wrapper = renderAvatar({ type: 'gen-ai', loading: false, loadingText, fullName });

      const avatarBody = wrapper.findAvatarBody()?.getElement();
      avatarBody?.focus();
      expect(wrapper.findTooltip()?.getElement()).toHaveTextContent(fullName);
    });
  });

  describe('a11y', () => {
    test('validates', () => {
      const wrapper = renderAvatar({ type: 'user' });
      expect(wrapper.getElement()).toValidateA11y;
    });

    test.each([
      { props: { type: 'user', ariaLabel: 'User avatar' }, expectedAriaLabel: 'User avatar' },
      { props: { type: 'user', fullName: 'Jane Doe' }, expectedAriaLabel: 'Jane Doe' },
      {
        props: { type: 'user', fullName: 'Jane Doe', ariaLabel: 'User avatar' },
        expectedAriaLabel: 'User avatar Jane Doe',
      },
      { props: { type: 'gen-ai', ariaLabel: 'Gen AI avatar' }, expectedAriaLabel: 'Gen AI avatar' },
      {
        props: { type: 'gen-ai', ariaLabel: 'Gen AI avatar', fullName: 'Gen AI assistant' },
        expectedAriaLabel: 'Gen AI avatar Gen AI assistant',
      },
      {
        props: { type: 'gen-ai', ariaLabel: 'Gen AI avatar', loadingText: 'Generating response' },
        expectedAriaLabel: 'Gen AI avatar',
      },
      {
        props: {
          type: 'gen-ai',
          ariaLabel: 'Gen AI avatar',
          fullName: 'Gen AI assistant',
          loadingText: 'Generating response',
        },
        expectedAriaLabel: 'Gen AI avatar Gen AI assistant',
      },
      {
        props: {
          type: 'gen-ai',
          ariaLabel: 'Gen AI avatar',
          fullName: 'Gen AI assistant',
          loadingText: 'Generating response',
          loading: true,
        },
        expectedAriaLabel: 'Gen AI avatar Generating response',
      },
    ] as { props: AvatarProps; expectedAriaLabel: string }[])(
      'renders correct aria labels for props="$props"',
      ({ props, expectedAriaLabel }) => {
        const wrapper = renderAvatar(props);
        const avatarBody = wrapper.findAvatarBody()?.getElement();
        expect(avatarBody).toHaveAttribute('aria-label', expectedAriaLabel);
      }
    );
  });
});
