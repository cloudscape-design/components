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
  describe('Default', () => {
    (['gen-ai', 'default'] as AvatarProps.Color[]).forEach(color => {
      test(`renders ${color} color avatar`, () => {
        const wrapper = renderAvatar({ color });
        const avatarBody = wrapper.findAvatarBody()?.getElement();
        expect(avatarBody).toBeInTheDocument();

        avatarBody?.focus();
        expect(wrapper.findTooltip()?.getElement()).toBeUndefined();
      });

      test(`renders ${color} color avatar with tooltipText`, () => {
        const tooltipText = 'Jane Doe';
        const wrapper = renderAvatar({ color, tooltipText });
        const avatarBody = wrapper.findAvatarBody()?.getElement();

        avatarBody?.focus();
        expect(wrapper.findTooltip()?.getElement()).toHaveTextContent(tooltipText);

        avatarBody?.blur();
        expect(wrapper.findTooltip()?.getElement()).toBeUndefined();
      });

      test(`renders ${color} color avatar in loading state`, () => {
        const wrapper = renderAvatar({ color, loading: true });

        const loading = wrapper.findByClassName(loadingDotsStyles.root)?.getElement();
        expect(loading).toBeInTheDocument();
      });

      test(`renders ${color} color avatar with initials`, () => {
        const initials = 'JD';
        const wrapper = renderAvatar({ color, initials });

        const avatarBody = wrapper.findAvatarBody()?.getElement();
        expect(avatarBody).toHaveTextContent(initials);
      });
    });
  });

  describe('a11y', () => {
    // test('validates', () => {
    //   const wrapper = renderAvatar();
    //   expect(wrapper.getElement()).toValidateA11y;
    // });

    test.each([
      { props: { color: 'default', ariaLabel: 'User avatar' }, expectedAriaLabel: 'User avatar' },
      { props: { color: 'default', tooltipText: 'Jane Doe' }, expectedAriaLabel: 'Jane Doe' },
      {
        props: { color: 'default', tooltipText: 'Jane Doe', ariaLabel: 'User avatar' },
        expectedAriaLabel: 'User avatar Jane Doe',
      },
      {
        props: { color: 'gen-ai', iconName: 'gen-ai', ariaLabel: 'Gen AI avatar' },
        expectedAriaLabel: 'Gen AI avatar',
      },
      {
        props: { color: 'gen-ai', iconName: 'gen-ai', ariaLabel: 'Gen AI avatar', tooltipText: 'Gen AI assistant' },
        expectedAriaLabel: 'Gen AI avatar Gen AI assistant',
      },
      {
        props: { color: 'gen-ai', iconName: 'gen-ai', ariaLabel: 'Gen AI avatar', tooltipText: 'Generating response' },
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
