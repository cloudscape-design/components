// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { render } from '@testing-library/react';
import React from 'react';
import Avatar, { AvatarProps } from '../../../lib/components/avatar';
import createWrapper from '../../../lib/components/test-utils/dom';
import loadingDotsStyles from '../../../lib/components/avatar/loading-dots/styles.selectors.js';

const defaultAvatarProps: AvatarProps = { ariaLabel: 'Avatar' };

function renderAvatar(props: AvatarProps) {
  const { container } = render(<Avatar {...props} />);

  return createWrapper(container).findAvatar()!;
}

describe('Avatar component', () => {
  describe('Basic', () => {
    (['gen-ai', 'default'] as AvatarProps.Color[]).forEach(color => {
      test(`renders ${color} color avatar`, () => {
        const wrapper = renderAvatar({ ...defaultAvatarProps, color });
        const avatarBody = wrapper.findAvatarBody()?.getElement();
        expect(avatarBody).toBeInTheDocument();

        avatarBody?.focus();
        expect(wrapper.findTooltip()?.getElement()).toBeUndefined();
      });

      test(`renders ${color} color avatar with tooltipText`, () => {
        const tooltipText = 'Jane Doe';
        const wrapper = renderAvatar({ ...defaultAvatarProps, color, tooltipText });
        const avatarBody = wrapper.findAvatarBody()?.getElement();

        avatarBody?.focus();
        expect(wrapper.findTooltip()?.getElement()).toHaveTextContent(tooltipText);

        avatarBody?.blur();
        expect(wrapper.findTooltip()?.getElement()).toBeUndefined();
      });

      test(`renders ${color} color avatar in loading state`, () => {
        const wrapper = renderAvatar({ ...defaultAvatarProps, color, loading: true });

        const loading = wrapper.findByClassName(loadingDotsStyles.root)?.getElement();
        expect(loading).toBeInTheDocument();
      });

      test(`renders ${color} color avatar with initials`, () => {
        const initials = 'JD';
        const wrapper = renderAvatar({ ...defaultAvatarProps, color, initials });

        expect(wrapper.getElement()).toHaveTextContent(initials);
      });
    });
  });

  describe('a11y', () => {
    test('validates', () => {
      const wrapper = renderAvatar({
        color: 'default',
        initials: 'JD',
        tooltipText: 'Jane Doe',
        ariaLabel: 'User avatar',
      });
      expect(wrapper.getElement()).toValidateA11y;
    });

    test('ariaLabel is directly used', () => {
      const ariaLabel = 'User avatar JD Jane Doe';
      const wrapper = renderAvatar({ ariaLabel, initials: 'JD', tooltipText: 'Jane Doe' });
      const avatarBody = wrapper.findAvatarBody()?.getElement();
      expect(avatarBody).toHaveAttribute('aria-label', ariaLabel);
    });
  });
});
