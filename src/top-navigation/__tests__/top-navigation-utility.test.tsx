// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import Utility, { UtilityProps } from '../../../lib/components/top-navigation/parts/utility';
import { TopNavigationUtilityWrapper } from '../../../lib/components/test-utils/dom/top-navigation';

type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

const renderUtility = (props: Optional<UtilityProps, 'hideText'>) => {
  const { container } = render(<Utility hideText={false} {...props} />);
  return new TopNavigationUtilityWrapper(container);
};

describe('TopNavigation Utility part', () => {
  describe('Link button', () => {
    it('renders with text', () => {
      const buttonWrapper = renderUtility({
        definition: { type: 'button', variant: 'link', text: 'Link Button' },
      }).findButtonLinkType()!;
      expect(buttonWrapper.getElement()).toHaveTextContent('Link Button');
    });

    it('can hide text when there is an icon', () => {
      const buttonWrapper = renderUtility({
        definition: { type: 'button', variant: 'link', text: 'Link Button', iconName: 'settings' },
        hideText: true,
      }).findButtonLinkType()!;
      expect(buttonWrapper.getElement()).not.toHaveTextContent('Link Button');
    });

    it('does not hide text when there is no icon', () => {
      const buttonWrapper = renderUtility({
        definition: { type: 'button', variant: 'link', text: 'Link Button' },
        hideText: true,
      }).findButtonLinkType()!;
      expect(buttonWrapper.getElement()).toHaveTextContent('Link Button');
    });

    it('falls back to using the text when there is no explicit ariaLabel', () => {
      const buttonWrapper = renderUtility({
        definition: { type: 'button', variant: 'link', text: 'Link Button', iconName: 'user-profile' },
        hideText: true,
      }).findButtonLinkType()!;
      expect(buttonWrapper.getElement()).toHaveAttribute('aria-label', 'Link Button');
    });

    it('ariaLabel takes precedence over text', () => {
      const buttonWrapper = renderUtility({
        definition: { type: 'button', ariaLabel: 'ARIA label', text: 'Link Button' },
        hideText: true,
      }).findButtonLinkType()!;
      expect(buttonWrapper.getElement()).toHaveAttribute('aria-label', 'ARIA label');
    });

    it('supports iconUrl', () => {
      const iconUrl = 'data:image/png;base64,aaaa';
      const iconAlt = 'Custom icon';

      const buttonWrapper = renderUtility({
        definition: {
          type: 'button',
          ariaLabel: 'ARIA label',
          iconUrl,
          iconAlt,
        },
        hideText: true,
      }).findButtonLinkType()!;
      expect(buttonWrapper.find('img')!.getElement()).toHaveAttribute('alt', iconAlt);
      expect(buttonWrapper.find('img')!.getElement()).toHaveAttribute('src', iconUrl);
    });

    it('supports iconSvg', () => {
      const iconSvg = (
        <svg className="test-svg">
          <circle cx="8" cy="8" r="7" />
        </svg>
      );

      const buttonWrapper = renderUtility({
        definition: { type: 'button', ariaLabel: 'ARIA label', iconSvg },
        hideText: true,
      }).findButtonLinkType()!;
      expect(buttonWrapper.findByClassName('test-svg')).toBeTruthy();
    });

    it('target and rel can be set', () => {
      const buttonWrapper = renderUtility({
        definition: { type: 'button', href: '#', ariaLabel: 'ARIA label', target: 'target', rel: 'rel' },
      }).findButtonLinkType()!;

      expect(buttonWrapper.getElement()).toHaveAttribute('target', 'target');
      expect(buttonWrapper.getElement()).toHaveAttribute('rel', 'rel');
    });

    it('fires onClick with empty detail', () => {
      const onClick = jest.fn();
      const buttonWrapper = renderUtility({ definition: { type: 'button', onClick } }).findButtonLinkType()!;
      buttonWrapper.click();

      expect(onClick).toBeCalledWith(expect.objectContaining({ detail: {} }));
    });
  });

  describe('Primary button', () => {
    it('renders with text', () => {
      const buttonWrapper = renderUtility({
        definition: { type: 'button', variant: 'primary-button', text: 'Primary Link' },
      }).findPrimaryButtonType()!;
      expect(buttonWrapper.findTextRegion()!.getElement()).toHaveTextContent('Primary Link');
    });

    it('can hide text when there is an icon', () => {
      const buttonWrapper = renderUtility({
        definition: { type: 'button', variant: 'primary-button', text: 'Primary Link', iconName: 'share' },
        hideText: true,
      }).findPrimaryButtonType()!;
      expect(buttonWrapper.getElement()).not.toHaveTextContent('Primary Link');
    });

    it('does not hide text when there is no icon', () => {
      const buttonWrapper = renderUtility({
        definition: { type: 'button', variant: 'primary-button', text: 'Primary Link' },
        hideText: true,
      }).findPrimaryButtonType()!;
      expect(buttonWrapper.getElement()).toHaveTextContent('Primary Link');
    });

    it('falls back to using the text when there is no explicit ariaLabel', () => {
      const buttonWrapper = renderUtility({
        definition: { type: 'button', variant: 'primary-button', text: 'Primary Link', iconName: 'user-profile' },
        hideText: true,
      }).findPrimaryButtonType()!;
      expect(buttonWrapper.getElement()).toHaveAttribute('aria-label', 'Primary Link');
    });

    it('ariaLabel takes precedence over text', () => {
      const buttonWrapper = renderUtility({
        definition: { type: 'button', variant: 'primary-button', ariaLabel: 'ARIA label', text: 'Primary Link' },
        hideText: true,
      }).findPrimaryButtonType()!;
      expect(buttonWrapper.getElement()).toHaveAttribute('aria-label', 'ARIA label');
    });
  });

  describe('Menu dropdown', () => {
    it('renders with text', () => {
      const menuWrapper = renderUtility({
        definition: { type: 'menu-dropdown', text: 'Menu', iconName: 'user-profile', items: [] },
      }).findMenuDropdownType()!;
      expect(menuWrapper.findNativeButton()!.getElement()).toHaveTextContent('Menu');
    });

    it('can hide text when there is an icon', () => {
      const menuWrapper = renderUtility({
        definition: { type: 'menu-dropdown', text: 'Menu', iconName: 'user-profile', items: [] },
        hideText: true,
      }).findMenuDropdownType()!;
      expect(menuWrapper.findNativeButton()!.getElement()).not.toHaveTextContent('Menu');
    });

    it('has a title in the dropdown', () => {
      const menuWrapper = renderUtility({
        definition: { type: 'menu-dropdown', text: 'Menu', title: 'Title', iconName: 'user-profile', items: [] },
        hideText: true,
      }).findMenuDropdownType()!;

      menuWrapper.openDropdown();
      expect(menuWrapper.findTitle()!.getElement()).toHaveTextContent('Title');
    });

    it('uses text as a fallback for the title', () => {
      const menuWrapper = renderUtility({
        definition: { type: 'menu-dropdown', text: 'Menu', iconName: 'user-profile', items: [] },
        hideText: true,
      }).findMenuDropdownType()!;

      menuWrapper.openDropdown();
      expect(menuWrapper.findTitle()!.getElement()).toHaveTextContent('Menu');
    });

    it('renders options', () => {
      const items = [
        { id: '1', text: 'Option 1' },
        { id: '2', text: 'Option 2' },
        { id: '3', text: 'Option 3' },
      ];
      const menuWrapper = renderUtility({
        definition: {
          type: 'menu-dropdown',
          text: 'Menu',
          iconName: 'user-profile',
          items,
        },
      }).findMenuDropdownType()!;
      menuWrapper.openDropdown();

      items.forEach((item, i) => expect(menuWrapper.findItems()[i].getElement()).toHaveTextContent(item.text));
    });

    it('does not show title in the dropdown if there is visible text', () => {
      const menuWrapper = renderUtility({
        definition: {
          type: 'menu-dropdown',
          text: 'Menu',
          title: 'Title',
          iconName: 'user-profile',
          items: [],
          description: 'Description',
        },
      }).findMenuDropdownType()!;

      menuWrapper.openDropdown();
      expect(menuWrapper.findTitle()).toBeFalsy();
      expect(menuWrapper.findDescription()!.getElement()).toHaveTextContent('Description');
    });

    it('supports iconUrl', () => {
      const iconUrl = 'data:image/png;base64,aaaa';
      const iconAlt = 'Custom icon';

      const menuWrapper = renderUtility({
        definition: {
          type: 'menu-dropdown',
          text: 'Menu',
          title: 'Title',
          iconUrl,
          iconAlt,
          items: [],
          description: 'Description',
        },
      }).findMenuDropdownType()!;
      expect(menuWrapper.find('img')!.getElement()).toHaveAttribute('alt', iconAlt);
      expect(menuWrapper.find('img')!.getElement()).toHaveAttribute('src', iconUrl);
    });

    it('supports iconSvg', () => {
      const iconSvg = (
        <svg className="test-svg">
          <circle cx="8" cy="8" r="7" />
        </svg>
      );

      const menuWrapper = renderUtility({
        definition: {
          type: 'menu-dropdown',
          text: 'Menu',
          title: 'Title',
          iconSvg,
          items: [],
          description: 'Description',
        },
      }).findMenuDropdownType()!;
      expect(menuWrapper.findByClassName('test-svg')).toBeTruthy();
    });
  });
});
