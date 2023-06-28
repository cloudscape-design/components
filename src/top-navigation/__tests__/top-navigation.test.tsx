// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, render } from '@testing-library/react';
import Input from '../../../lib/components/input';

import TopNavigation, { TopNavigationProps } from '../../../lib/components/top-navigation';
import OverflowMenu from '../../../lib/components/top-navigation/parts/overflow-menu';
import createWrapper from '../../../lib/components/test-utils/dom';
import TopNavigationWrapper, {
  OverflowMenu as OverflowMenuWrapper,
} from '../../../lib/components/test-utils/dom/top-navigation';
import TestI18nProvider from '../../../lib/components/internal/i18n/testing';

export const I18N_STRINGS: TopNavigationProps.I18nStrings = {
  searchIconAriaLabel: 'Search',
  searchDismissIconAriaLabel: 'Close search',
  overflowMenuTriggerText: 'More',
  overflowMenuTitleText: 'All',
  overflowMenuBackIconAriaLabel: 'Back',
  overflowMenuDismissIconAriaLabel: 'Close',
};

type PickPartial<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

const renderTopNavigation = (props: PickPartial<TopNavigationProps, 'i18nStrings'>) => {
  const { container } = render(<TopNavigation i18nStrings={I18N_STRINGS} {...props} />);
  return createWrapper(container).findTopNavigation()!;
};

describe('TopNavigation Component', () => {
  test('has title', () => {
    const topNavigation = renderTopNavigation({ identity: { href: '#', title: 'Application Title' } });
    expect(topNavigation.findTitle()!.getElement()).toHaveTextContent('Application Title');
  });

  test('has a logo', () => {
    const topNavigation = renderTopNavigation({ identity: { href: '#', logo: { src: 'image', alt: 'description' } } });
    expect(topNavigation.findLogo()!.getElement()).toHaveAttribute('src', 'image');
    expect(topNavigation.findLogo()!.getElement()).toHaveAttribute('alt', 'description');
  });

  test('has a link', () => {
    const topNavigation = renderTopNavigation({ identity: { href: '#', title: 'Application Title' } });
    expect(topNavigation.findIdentityLink().getElement()).toHaveAttribute('href', '#');
  });

  test('fires follow event when the title is clicked', () => {
    const onFollowSpy = jest.fn();

    const topNavigation = renderTopNavigation({
      identity: {
        href: '#',
        title: 'Application Title',
        onFollow: event => onFollowSpy(event.detail),
      },
    });
    const identityLink = topNavigation.findIdentityLink().getElement();
    identityLink.click();
    expect(onFollowSpy).toHaveBeenCalledWith({});
  });

  test('does not fire a follow event when the item is clicked with a modifier', () => {
    const onFollowSpy = jest.fn();

    const topNavigation = renderTopNavigation({
      identity: {
        href: '#',
        title: 'Application Title',
        onFollow: event => onFollowSpy(event.detail),
      },
    });
    const identityLink = topNavigation.findIdentityLink();
    identityLink.click({ ctrlKey: true });
    identityLink.click({ altKey: true });
    identityLink.click({ shiftKey: true });
    identityLink.click({ metaKey: true });
    identityLink.click({ button: 1 });

    expect(onFollowSpy).not.toHaveBeenCalled();
  });

  test('has a search control', () => {
    const topNavigation = renderTopNavigation({
      identity: { href: '#' },
      search: <Input value="" onChange={() => {}} />,
    });
    expect(topNavigation.findSearch()).toBeTruthy();
  });

  describe('Primary button utility', () => {
    let topNavigation: TopNavigationWrapper, onClick: jest.Mock;
    beforeEach(() => {
      onClick = jest.fn();
      topNavigation = renderTopNavigation({
        identity: { href: '#' },
        utilities: [
          {
            type: 'button',
            variant: 'primary-button',
            text: 'Primary button',
            onClick,
          },
          {
            type: 'button',
            variant: 'primary-button',
            text: 'Primary external button',
            external: true,
            externalIconAriaLabel: 'opens in a new tab',
          },
        ],
      });
    });

    test('is correctly rendered', () => {
      expect(topNavigation.findUtility(1)!.findPrimaryButtonType()!.getElement()).toHaveTextContent('Primary button');
    });

    test('renders an external icon with the provided label', () => {
      expect(
        topNavigation.findUtility(2)!.findPrimaryButtonType()!.find('[aria-label="opens in a new tab"]')
      ).toBeTruthy();
    });

    test('calls onClick when clicked', () => {
      topNavigation.findUtility(1)!.findPrimaryButtonType()!.click();
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Link button utility', () => {
    let topNavigation: TopNavigationWrapper, onClick: jest.Mock;
    beforeEach(() => {
      onClick = jest.fn();
      topNavigation = renderTopNavigation({
        identity: { href: '#' },
        utilities: [
          {
            type: 'button',
            text: 'External link',
            href: '#',
            external: true,
            externalIconAriaLabel: 'opens in a new tab',
            onClick,
          },
        ],
      });
    });

    test('is correctly rendered', () => {
      expect(topNavigation.findUtility(1)!.findButtonLinkType()!.getElement()).toHaveTextContent('External link');
    });

    test('renders an external icon with the provided label', () => {
      expect(topNavigation.findUtility(1)!.findButtonLinkType()!.getElement()).toHaveAttribute(
        'aria-label',
        'External link opens in a new tab'
      );
    });

    test('calls onClick when clicked', () => {
      topNavigation.findUtility(1)!.findButtonLinkType()!.click();
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Menu dropdown utility', () => {
    let topNavigation: TopNavigationWrapper, onItemClick: jest.Mock;
    beforeEach(() => {
      onItemClick = jest.fn();
      topNavigation = renderTopNavigation({
        identity: { href: '#' },
        utilities: [
          {
            type: 'menu-dropdown',
            text: 'Menu dropdown',
            title: 'Jane Doe',
            description: 'jane.doe@example.com',
            items: [{ id: 'one', text: 'First' }],
            onItemClick,
          },
        ],
      });
    });

    test('is rendered', () => {
      expect(topNavigation.findUtility(1)!.findMenuDropdownType()!.getElement()).toHaveTextContent('Menu dropdown');
    });

    test('renders the title and description', () => {
      const menuDropdown = topNavigation.findUtility(1)!.findMenuDropdownType()!;
      menuDropdown.openDropdown();

      expect(menuDropdown.findNativeButton()!.getElement()).toHaveTextContent('Menu dropdown');
      expect(menuDropdown.findDescription()!.getElement()).toHaveTextContent('jane.doe@example.com');
    });

    test('calls onItemClick when an item is selected', () => {
      const menuDropdown = topNavigation.findUtility(1)!.findMenuDropdownType()!;
      menuDropdown.openDropdown();
      menuDropdown.findItemById('one')!.click();
      expect(onItemClick).toHaveBeenCalledWith(expect.objectContaining({ detail: { id: 'one' } }));
    });
  });
});

describe('URL sanitization', () => {
  let consoleWarnSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;
  beforeEach(() => {
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
  });
  afterEach(() => {
    consoleWarnSpy?.mockRestore();
    consoleErrorSpy?.mockRestore();
  });

  describe('for the identity', () => {
    test('does not throw an error when a safe javascript: URL is passed', () => {
      const element = renderTopNavigation({ identity: { href: 'javascript:void(0)' } });
      expect((element.findIdentityLink().getElement() as HTMLAnchorElement).href).toBe('javascript:void(0)');

      expect(console.warn).toHaveBeenCalledTimes(0);
    });

    test('throws an error when a dangerous javascript: URL is passed', () => {
      expect(() => renderTopNavigation({ identity: { href: "javascript:alert('Hello from the identity!')" } })).toThrow(
        'A javascript: URL was blocked as a security precaution.'
      );

      expect(console.warn).toHaveBeenCalledTimes(1);
      expect(console.warn).toHaveBeenCalledWith(
        `[AwsUi] [TopNavigation] A javascript: URL was blocked as a security precaution. The URL was "javascript:alert('Hello from the identity!')".`
      );
    });
  });

  describe('for a utility button', () => {
    test('does not throw an error when a safe javascript: URL is passed', () => {
      const element = renderTopNavigation({
        identity: { href: '#' },
        utilities: [{ type: 'button', href: 'javascript:void(0)' }],
      });
      expect(element.findUtility(1)!.findButtonLinkType()!.getElement().href).toBe('javascript:void(0)');
      expect(console.warn).toHaveBeenCalledTimes(0);
    });

    test('throws an error when a dangerous javascript: URL is passed', () => {
      expect(() =>
        renderTopNavigation({ identity: { href: "javascript:alert('Hello from the utility button!')" } })
      ).toThrow('A javascript: URL was blocked as a security precaution.');

      expect(console.warn).toHaveBeenCalledTimes(1);
      expect(console.warn).toHaveBeenCalledWith(
        `[AwsUi] [TopNavigation] A javascript: URL was blocked as a security precaution. The URL was "javascript:alert('Hello from the utility button!')".`
      );
    });
  });

  describe('for a utility menu item', () => {
    test('does not throw an error when a safe javascript: URL is passed', () => {
      const element = renderTopNavigation({
        identity: { href: '#' },
        utilities: [{ type: 'menu-dropdown', items: [{ id: 'test', text: 'test', href: 'javascript:void(0)' }] }],
      });
      const dropdown = element.findUtility(1)!.findMenuDropdownType()!;
      act(() => {
        dropdown.openDropdown();
      });

      expect(dropdown.findItemById('test')!.find<HTMLAnchorElement>('a')!.getElement().href).toBe('javascript:void(0)');
      expect(console.warn).toHaveBeenCalledTimes(0);
    });

    test('throws an error when a dangerous javascript: URL is passed', () => {
      expect(() =>
        renderTopNavigation({
          identity: { href: '#' },
          utilities: [
            {
              type: 'menu-dropdown',
              items: [{ id: 'test', text: 'test', href: "javascript:alert('Hello from a utility menu item!')" }],
            },
          ],
        })
      ).toThrow('A javascript: URL was blocked as a security precaution.');

      expect(console.warn).toHaveBeenCalledTimes(1);
      expect(console.warn).toHaveBeenCalledWith(
        `[AwsUi] [TopNavigation] A javascript: URL was blocked as a security precaution. The URL was "javascript:alert('Hello from a utility menu item!')".`
      );
    });
  });

  describe('for a nested utility menu item', () => {
    test('does not throw an error when a safe javascript: URL is passed', () => {
      const element = renderTopNavigation({
        identity: { href: '#' },
        utilities: [
          {
            type: 'menu-dropdown',
            items: [
              {
                id: 'outer-menu-item',
                text: 'outer menu item',
                items: [{ id: 'test', text: 'nested menu item', href: 'javascript:void(0)' }],
              },
            ],
          },
        ],
      });
      const dropdown = element.findUtility(1)!.findMenuDropdownType()!;
      act(() => {
        dropdown.openDropdown();
      });
      expect(dropdown.findItemById('test')!.find<HTMLAnchorElement>('a')!.getElement().href).toBe('javascript:void(0)');

      expect(console.warn).toHaveBeenCalledTimes(0);
    });

    test('throws an error when a dangerous javascript: URL is passed', () => {
      expect(() =>
        renderTopNavigation({
          identity: { href: '#' },
          utilities: [
            {
              type: 'menu-dropdown',
              items: [
                {
                  id: 'outer-menu-item',
                  text: 'outer menu item',
                  items: [
                    {
                      id: 'test',
                      text: 'nested menu item',
                      href: "javascript:alert('Hello from a nested utility menu item!')",
                    },
                  ],
                },
              ],
            },
          ],
        })
      ).toThrow('A javascript: URL was blocked as a security precaution.');

      expect(console.warn).toHaveBeenCalledTimes(1);
      expect(console.warn).toHaveBeenCalledWith(
        `[AwsUi] [TopNavigation] A javascript: URL was blocked as a security precaution. The URL was "javascript:alert('Hello from a nested utility menu item!')".`
      );
    });
  });

  describe('i18n', () => {
    test('supports using overflow menu strings from i18n provider', () => {
      const { container } = render(
        <TestI18nProvider
          messages={{
            'top-navigation': {
              'i18nStrings.overflowMenuDismissIconAriaLabel': 'Custom dismiss',
              'i18nStrings.overflowMenuTitleText': 'Custom all',
            },
          }}
        >
          <OverflowMenu />
        </TestI18nProvider>
      );
      const wrapper = new OverflowMenuWrapper(container);
      expect(wrapper.findTitle()!.getElement()).toHaveTextContent('Custom all');
      expect(wrapper.findDismissButton()!.getElement()).toHaveAccessibleName('Custom dismiss');
    });
  });
});
