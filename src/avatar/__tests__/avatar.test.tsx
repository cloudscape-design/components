// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { render } from '@testing-library/react';
import React from 'react';
import Avatar, { AvatarProps } from '../../../lib/components/avatar';
import createWrapper from '../../../lib/components/test-utils/dom';
import loadingDotsStyles from '../../../lib/components/avatar/loading-dots/styles.selectors.js';

function renderAvatar(props: AvatarProps) {
  const { container } = render(<Avatar {...props} />);

  return createWrapper(container).findAvatar()!;
}

describe('Avatar component', () => {
  describe('Type', () => {
    test.each(['gen-ai', 'user'] as AvatarProps.Type[])('renders %s avatar with fullName', type => {
      const fullName = 'Jane Doe';
      const wrapper = renderAvatar({ type, fullName });
      const avatarBody = wrapper.findAvatarBody()?.getElement();

      avatarBody?.focus();
      expect(wrapper.findTooltip()?.getElement()).toHaveTextContent(fullName);

      avatarBody?.blur();
      expect(wrapper.findTooltip()?.getElement()).toBeUndefined();
    });

    test('renders user avatar with initials', () => {
      const initials = 'JD';
      const wrapper = renderAvatar({ type: 'user', initials });
      const avatarBody = wrapper.findAvatarBody()?.getElement();

      expect(avatarBody).toHaveTextContent(initials);
    });

    test('renders gen-ai avatar in loading state', () => {
      const wrapper = renderAvatar({ type: 'gen-ai', loading: true });

      const loading = wrapper.findByClassName(loadingDotsStyles.root)?.getElement();
      expect(loading).toBeInTheDocument();
    });

    test('does not render user avatar in loading state', () => {
      const wrapper = renderAvatar({ type: 'user', loading: true });

      const loading = wrapper.findByClassName(loadingDotsStyles.root)?.getElement();
      expect(loading).toBeUndefined();
    });
  });

  describe('a11y', () => {
    test('validates', () => {
      const wrapper = renderAvatar({ type: 'user' });
      expect(wrapper.getElement()).toValidateA11y;
    });

    test.each([
      { props: { type: 'user', altText: 'User avatar' }, expectedAriaLabel: 'User avatar' },
      { props: { type: 'user', initials: 'TF' }, expectedAriaLabel: 'TF' },
      { props: { type: 'user', initials: 'TF', altText: 'User avatar' }, expectedAriaLabel: 'TF' },
      {
        props: { type: 'user', initials: 'TF', fullName: 'Timothee Fontaka' },
        expectedAriaLabel: 'TF Timothee Fontaka',
      },
      { props: { type: 'gen-ai', altText: 'Gen AI avatar' }, expectedAriaLabel: 'Gen AI avatar' },

      {
        props: { type: 'gen-ai', altText: 'Gen AI avatar', fullName: 'Gen AI assistant' },
        expectedAriaLabel: 'Gen AI avatar Gen AI assistant',
      },
      {
        props: { type: 'gen-ai', altText: 'Gen AI avatar', loadingText: 'Generating response' },
        expectedAriaLabel: 'Gen AI avatar',
      },
      {
        props: {
          type: 'gen-ai',
          altText: 'Gen AI avatar',
          fullName: 'Gen AI assistant',
          loadingText: 'Generating response',
        },
        expectedAriaLabel: 'Gen AI avatar Gen AI assistant',
      },
      {
        props: {
          type: 'gen-ai',
          altText: 'Gen AI avatar',
          fullName: 'Gen AI assistant',
          loading: true,
          loadingText: 'Generating response',
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
